import { withTransaction, queryPostgres } from '../db_postgres.js';

// Helper to generate readable sequential order numbers: e.g. SKK-2026-000128
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `SKK-2026-${timestamp}${random}`.slice(0, 18);
}

export async function createOrder({
  userId = null,
  customerName,
  email,
  phone,
  address,
  city,
  state,
  pincode,
  country = 'India',
  items = [],
  paymentMethod = 'PAYU',
  couponCode = null
}) {
  if (!items || items.length === 0) {
    return { success: false, statusCode: 400, error: 'Order must contain at least one product item.' };
  }

  if (!customerName || (!email && !phone)) {
    return { success: false, statusCode: 400, error: 'Customer name and contact details (email/phone) are required.' };
  }

  // Wrap order creation inside a PostgreSQL Transaction
  return await withTransaction(async (client) => {
    let finalUserId = userId;
    let shippingAddressId = null;

    // 1. If user ID is provided, verify or update profile
    if (finalUserId) {
      const userRes = await client.query('SELECT id FROM users WHERE id = $1', [finalUserId]);
      if (userRes.rows.length === 0) {
        finalUserId = null;
      }
    }

    // If customer has no account, create or lookup guest customer by email/phone
    if (!finalUserId && (email || phone)) {
      const existingUser = await client.query(
        'SELECT id FROM users WHERE (email = $1 AND email != \'\') OR (phone = $2 AND phone != \'\')',
        [email ? email.trim().toLowerCase() : '', phone ? phone.replace(/\D/g, '') : '']
      );
      if (existingUser.rows.length > 0) {
        finalUserId = existingUser.rows[0].id;
      } else {
        const dummyHash = 'GUEST_USER_HASH';
        const nameParts = customerName.trim().split(' ');
        const firstName = nameParts[0] || 'Customer';
        const lastName = nameParts.slice(1).join(' ') || '';
        const newUserRes = await client.query(`
          INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_active)
          VALUES ($1, $2, $3, $4, $5, 'CUSTOMER', true)
          RETURNING id
        `, [firstName, lastName, email ? email.trim().toLowerCase() : '', phone ? phone.replace(/\D/g, '') : '', dummyHash]);
        finalUserId = newUserRes.rows[0].id;
      }
    }

    // 2. Save Shipping Address
    if (address && city && pincode) {
      const addrRes = await client.query(`
        INSERT INTO addresses (user_id, full_name, phone, address_line_1, city, state, postal_code, country, address_type, is_default)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'HOME', true)
        RETURNING id
      `, [finalUserId, customerName, phone || '', address, city, state || 'Telangana', pincode, country]);
      shippingAddressId = addrRes.rows[0].id;
    }

    // 3. Process & Validate Items & Inventory with Row Locks (SELECT FOR UPDATE)
    let calculatedSubtotal = 0;
    const validatedOrderItems = [];

    for (const item of items) {
      const prodIdentifier = item.id || item.productId || item.sku;
      // Lock product row to prevent concurrency race condition
      const prodRes = await client.query(
        'SELECT id, sku, name, price, stock_quantity, is_active FROM products WHERE (id::text = $1 OR sku = $1 OR slug = $1) FOR UPDATE',
        [prodIdentifier]
      );

      if (prodRes.rows.length === 0) {
        throw new Error(`Product '${item.name || prodIdentifier}' no longer exists in stock.`);
      }

      const product = prodRes.rows[0];
      const requestedQty = Number(item.quantity) || 1;

      if (!product.is_active) {
        throw new Error(`Product '${product.name}' is currently unavailable.`);
      }

      if (product.stock_quantity < requestedQty) {
        throw new Error(`Insufficient stock for '${product.name}'. Available: ${product.stock_quantity}, Requested: ${requestedQty}`);
      }

      const unitPrice = Number(product.price);
      const totalAmount = unitPrice * requestedQty;
      calculatedSubtotal += totalAmount;

      validatedOrderItems.push({
        productUuid: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: requestedQty,
        unitPrice,
        totalAmount
      });
    }

    const orderNumber = generateOrderNumber();
    const finalTotalAmount = calculatedSubtotal;

    // 4. Insert Order Record
    const orderRes = await client.query(`
      INSERT INTO orders (
        order_number, user_id, shipping_address_id, billing_address_id,
        subtotal, discount_amount, shipping_amount, tax_amount, total_amount,
        currency, payment_status, order_status, payment_method
      )
      VALUES ($1, $2, $3, $3, $4, 0.00, 0.00, 0.00, $5, 'INR', 'PENDING', 'PAYMENT_PENDING', $6)
      RETURNING id, order_number, total_amount, payment_status, order_status, created_at
    `, [orderNumber, finalUserId, shippingAddressId, calculatedSubtotal, finalTotalAmount, paymentMethod]);

    const newOrder = orderRes.rows[0];

    // 5. Insert Order Items & Record Inventory Transactions
    for (const item of validatedOrderItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, product_name, sku, quantity, unit_price, discount_amount, tax_amount, total_amount)
        VALUES ($1, $2, $3, $4, $5, $6, 0.00, 0.00, $7)
      `, [newOrder.id, item.productUuid, item.productName, item.sku, item.quantity, item.unitPrice, item.totalAmount]);

      // Deduct stock safely
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [item.quantity, item.productUuid]
      );

      // Record inventory transaction
      await client.query(`
        INSERT INTO inventory_transactions (product_id, transaction_type, quantity, reference_type, reference_id, notes)
        VALUES ($1, 'ORDER', $2, 'ORDER', $3, $4)
      `, [item.productUuid, -item.quantity, newOrder.order_number, `Order placed by ${customerName}`]);
    }

    // 6. Create Payment Record (Pending)
    const transactionId = `txnid_${newOrder.order_number}_${Date.now()}`;
    const payRes = await client.query(`
      INSERT INTO payments (order_id, user_id, gateway, transaction_id, amount, currency, payment_method, status)
      VALUES ($1, $2, 'PAYU', $3, $4, 'INR', $5, 'PENDING')
      RETURNING id, transaction_id
    `, [newOrder.id, finalUserId, transactionId, newOrder.total_amount, paymentMethod]);

    const newPayment = payRes.rows[0];

    await client.query(`
      INSERT INTO payment_transactions (payment_id, order_id, transaction_id, amount, status, payment_method)
      VALUES ($1, $2, $3, $4, 'INITIATED', $5)
    `, [newPayment.id, newOrder.id, transactionId, newOrder.total_amount, paymentMethod]);

    // 7. Insert Order Status History
    await client.query(`
      INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, reason)
      VALUES ($1, NULL, 'PAYMENT_PENDING', 'CUSTOMER', 'Customer initiated order checkout')
    `, [newOrder.id]);

    // 8. If customer had active cart, mark converted
    if (finalUserId) {
      await client.query('UPDATE carts SET status = \'CONVERTED\' WHERE user_id = $1 AND status = \'ACTIVE\'', [finalUserId]);
    }

    return {
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
      totalAmount: Number(newOrder.total_amount),
      paymentStatus: newOrder.payment_status,
      orderStatus: newOrder.order_status,
      transactionId: newPayment.transaction_id,
      customerName,
      email,
      phone,
      items: validatedOrderItems
    };
  });
}

export async function updateOrderStatus(orderId, newStatus, changedBy = 'ADMIN', reason = '') {
  const findOrder = await queryPostgres('SELECT id, order_status FROM orders WHERE id::text = $1 OR order_number = $1', [orderId]);
  if (!findOrder.success || findOrder.rows.length === 0) {
    return { success: false, error: 'Order not found.' };
  }

  const order = findOrder.rows[0];
  const oldStatus = order.order_status;

  await queryPostgres(
    'UPDATE orders SET order_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [newStatus, order.id]
  );

  await queryPostgres(`
    INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, reason)
    VALUES ($1, $2, $3, $4, $5)
  `, [order.id, oldStatus, newStatus, changedBy, reason]);

  return { success: true, oldStatus, newStatus };
}

export async function getOrderById(orderIdentifier) {
  const query = `
    SELECT 
      o.*, 
      u.first_name, u.last_name, u.email as user_email, u.phone as user_phone,
      a.full_name as shipping_name, a.phone as shipping_phone, a.address_line_1, a.address_line_2, a.city, a.state, a.postal_code, a.country,
      p.transaction_id, p.gateway, p.gateway_payment_id, p.payment_method as pay_method,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'productId', oi.product_id,
            'productName', oi.product_name,
            'sku', oi.sku,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price,
            'totalAmount', oi.total_amount
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) as items,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', h.id,
              'oldStatus', h.old_status,
              'newStatus', h.new_status,
              'changedBy', h.changed_by,
              'reason', h.reason,
              'createdAt', h.created_at
            ) ORDER BY h.created_at ASC
          ) FROM order_status_history h WHERE h.order_id = o.id
        ), '[]'
      ) as status_history
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN addresses a ON o.shipping_address_id = a.id
    LEFT JOIN payments p ON o.id = p.order_id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE (o.id::text = $1 OR o.order_number = $1)
    GROUP BY o.id, u.id, a.id, p.id
  `;

  const res = await queryPostgres(query, [orderIdentifier]);
  if (!res.success || res.rows.length === 0) {
    return { success: false, error: 'Order not found.' };
  }

  const o = res.rows[0];
  return {
    success: true,
    order: {
      id: o.order_number,
      orderUuid: o.id,
      orderNumber: o.order_number,
      createdAt: o.created_at,
      customerName: o.shipping_name || `${o.first_name || ''} ${o.last_name || ''}`.trim() || 'Customer',
      email: o.user_email || '',
      phone: o.shipping_phone || o.user_phone || '',
      subtotal: Number(o.subtotal),
      discountAmount: Number(o.discount_amount),
      shippingAmount: Number(o.shipping_amount),
      totalAmount: Number(o.total_amount),
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      paymentMethod: o.pay_method || o.payment_method,
      transactionId: o.transaction_id,
      gatewayPaymentId: o.gateway_payment_id,
      address: {
        fullName: o.shipping_name,
        phone: o.shipping_phone,
        street: o.address_line_1,
        city: o.city,
        state: o.state,
        pincode: o.postal_code,
        country: o.country
      },
      items: o.items,
      statusHistory: o.status_history
    }
  };
}

export async function getCustomerOrders(userId) {
  const query = `
    SELECT 
      o.id, o.order_number, o.total_amount, o.payment_status, o.order_status, o.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'productName', oi.product_name,
            'sku', oi.sku,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price,
            'totalAmount', oi.total_amount
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  const res = await queryPostgres(query, [userId]);
  if (!res.success) {
    return { success: false, orders: [] };
  }
  return {
    success: true,
    orders: res.rows.map(o => ({
      id: o.order_number,
      orderUuid: o.id,
      orderNumber: o.order_number,
      totalAmount: Number(o.total_amount),
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      date: new Date(o.created_at).toLocaleDateString('en-IN'),
      createdAt: o.created_at,
      items: o.items
    }))
  };
}

export default {
  createOrder,
  updateOrderStatus,
  getOrderById,
  getCustomerOrders
};
