const mysql = require('mysql2/promise');
require('dotenv').config();

async function showDatabaseData() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'koushik',
      password: process.env.DB_PASSWORD || 'Koushik@1',
      database: process.env.DB_NAME || 'sparkle_store'
    });

    console.log('\n======================================================');
    console.log('👤 1. SIGN-IN & REGISTERED CUSTOMER DETAILS');
    console.log('======================================================');
    
    // Check columns in users table:
    const [cols] = await conn.query('SHOW COLUMNS FROM users');
    const hasFullName = cols.some(c => c.Field === 'full_name');
    const nameCol = hasFullName ? 'full_name' : 'name';

    const [users] = await conn.query(
      `SELECT user_id, ${nameCol} AS name, email, phone, created_at FROM users ORDER BY created_at DESC`
    );

    if (users.length === 0) {
      console.log('No registered users found yet.');
    } else {
      console.table(users);
    }

    console.log('\n======================================================');
    console.log('📦 2. LIVE ORDERS, CUSTOMER ADDRESS & PAYMENT DETAILS');
    console.log('======================================================');
    const [orders] = await conn.query(`
      SELECT 
        o.order_id,
        o.user_id,
        o.customer_name,
        o.email,
        o.phone,
        o.street_address,
        o.city,
        o.pincode,
        o.final_paid_amount,
        o.payment_method,
        o.utr_number,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
    `);

    if (orders.length === 0) {
      console.log('No orders placed yet.');
    } else {
      console.table(orders);
    }

    console.log('\n======================================================');
    console.log('🛍️ 3. ORDERED PRODUCTS & ITEM DETAILS');
    console.log('======================================================');
    const [items] = await conn.query(`
      SELECT 
        order_id,
        product_name,
        selected_size,
        unit_price,
        quantity,
        subtotal
      FROM order_items
      ORDER BY id DESC
    `);

    if (items.length === 0) {
      console.log('No order items found.');
    } else {
      console.table(items);
    }

    await conn.end();
  } catch (err) {
    console.error('❌ Error checking database:', err.message);
  }
}

showDatabaseData();
