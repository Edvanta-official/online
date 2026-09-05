import crypto from 'crypto';
import { queryPostgres, withTransaction } from '../db_postgres.js';

const PAYU_KEY = process.env.PAYU_KEY || process.env.PAYU_MERCHANT_KEY || '8izKVp';
const PAYU_SALT = process.env.PAYU_SALT || process.env.PAYU_MERCHANT_SALT || 'Do2eaSyvC2mBV7HoEPGiiYpaVxsSSmGl';

function generateSHA512Hash(str) {
  return crypto.createHash('sha512').update(str).digest('hex');
}

export function generatePayUHash({ txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '' }) {
  const cleanAmount = Number(amount).toFixed(2);
  const hashString = `${PAYU_KEY}|${txnid}|${cleanAmount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PAYU_SALT}`;
  const hash = generateSHA512Hash(hashString);
  return { hash, key: PAYU_KEY, txnid, amount: cleanAmount };
}

export function verifyPayUReverseHash({ status, txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '', hash }) {
  const cleanAmount = Number(amount).toFixed(2);
  const reverseHashString = `${PAYU_SALT}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${cleanAmount}|${txnid}|${PAYU_KEY}`;
  const calculatedHash = generateSHA512Hash(reverseHashString);
  return calculatedHash.toLowerCase() === (hash || '').toLowerCase();
}

export async function processPayUCallback(payuPayload) {
  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status,
    unmappedstatus,
    mihpayid,
    mode,
    error_Message,
    hash
  } = payuPayload;

  const isHashValid = verifyPayUReverseHash({
    status,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    hash
  });

  const isSuccess = (status === 'success' || unmappedstatus === 'captured') && isHashValid;

  return await withTransaction(async (client) => {
    // Lookup payment record by transaction_id
    const payRes = await client.query('SELECT id, order_id, user_id, status FROM payments WHERE transaction_id = $1', [txnid]);
    
    if (payRes.rows.length === 0) {
      // Lookup by order number fallback
      const orderRes = await client.query('SELECT id, user_id FROM orders WHERE order_number = $1', [txnid]);
      if (orderRes.rows.length === 0) {
        return { success: false, error: 'Payment order transaction reference not found.' };
      }
    }

    let paymentId, orderId, userId;
    if (payRes.rows.length > 0) {
      paymentId = payRes.rows[0].id;
      orderId = payRes.rows[0].order_id;
      userId = payRes.rows[0].user_id;
    }

    const newPaymentStatus = isSuccess ? 'PAID' : 'FAILED';
    const newOrderStatus = isSuccess ? 'CONFIRMED' : 'PAYMENT_PENDING';

    // 1. Update Payment record
    if (paymentId) {
      await client.query(`
        UPDATE payments 
        SET status = $1, gateway_payment_id = $2, payment_method = $3, failure_reason = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
      `, [newPaymentStatus, mihpayid || '', mode || 'PayU Hosted', isSuccess ? null : (error_Message || 'Payment Failed'), paymentId]);
    }

    // 2. Update Payment Transactions log
    await client.query(`
      INSERT INTO payment_transactions (payment_id, order_id, transaction_id, gateway_transaction_id, amount, status, payment_method, gateway_response)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
    `, [paymentId || null, orderId, txnid, mihpayid || '', Number(amount || 0), newPaymentStatus, mode || 'PayU', JSON.stringify(payuPayload)]);

    // 3. Update Order record
    await client.query(`
      UPDATE orders 
      SET payment_status = $1, order_status = $2, confirmed_at = CASE WHEN $3 = true THEN CURRENT_TIMESTAMP ELSE confirmed_at END, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [newPaymentStatus, newOrderStatus, isSuccess, orderId]);

    // 4. Update Order Status History
    await client.query(`
      INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, reason)
      VALUES ($1, 'PAYMENT_PENDING', $2, 'PAYU_WEBHOOK', $3)
    `, [orderId, newOrderStatus, isSuccess ? `PayU Payment Success (ID: ${mihpayid})` : `PayU Payment Failed (${error_Message || 'User cancelled'})`]);

    return {
      success: true,
      isPaid: isSuccess,
      orderId,
      txnid,
      mihpayid,
      status: newPaymentStatus
    };
  });
}

export default {
  generatePayUHash,
  verifyPayUReverseHash,
  processPayUCallback
};
