import express from 'express';
import { generatePayUHash, processPayUCallback } from '../services/paymentService.js';
import { queryPostgres } from '../db_postgres.js';

const router = express.Router();

// POST /api/payments/payu/create - Generate PayU Request Hash
router.post('/payu/create', async (req, res) => {
  try {
    const { txnid, amount, productinfo, firstname, email, phone, udf1, udf2 } = req.body;

    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return res.status(400).json({ error: 'Missing required PayU payment payload parameters.' });
    }

    const payuData = generatePayUHash({
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2
    });

    res.json({
      success: true,
      payu: {
        key: payuData.key,
        txnid: payuData.txnid,
        amount: payuData.amount,
        productinfo,
        firstname,
        email,
        phone,
        hash: payuData.hash,
        action: process.env.PAYU_ENV === 'production' ? 'https://secure.payu.in/_payment' : 'https://test.payu.in/_payment'
      }
    });
  } catch (err) {
    console.error('PayU Create Hash Error:', err);
    res.status(500).json({ error: 'Failed to generate PayU payment hash.' });
  }
});

// POST /api/payments/payu/webhook or callback
router.post('/payu/webhook', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const payload = { ...req.body, ...req.query };
    const result = await processPayUCallback(payload);

    // If request comes from standard browser POST redirect from PayU, redirect to frontend success/failure page
    const acceptHeader = req.headers.accept || '';
    if (acceptHeader.includes('text/html') || req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      const frontendUrl = process.env.FRONTEND_URL || 'https://sparklekkv.com';
      if (result.isPaid) {
        return res.redirect(`${frontendUrl}/#payment-success?txnid=${payload.txnid}&orderId=${result.orderId || ''}`);
      } else {
        return res.redirect(`${frontendUrl}/#payment-failed?txnid=${payload.txnid}&msg=${encodeURIComponent(payload.error_Message || 'Payment Failed')}`);
      }
    }

    res.json(result);
  } catch (err) {
    console.error('PayU Webhook Error:', err);
    res.status(500).json({ error: 'Server error processing PayU webhook.' });
  }
});

// GET /api/payments/:id/status
router.get('/:id/status', async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.transaction_id, p.amount, p.status, p.gateway_payment_id, p.payment_method, o.order_number, o.order_status
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      WHERE p.transaction_id = $1 OR o.order_number = $1 OR p.id::text = $1
    `;
    const result = await queryPostgres(query, [req.params.id]);
    if (!result.success || result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }
    res.json({ success: true, payment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve payment status.' });
  }
});

export default router;
