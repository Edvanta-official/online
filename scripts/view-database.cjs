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
    
    // Check users / customers table
    const [uCols] = await conn.query('SHOW COLUMNS FROM users');
    const uFields = uCols.map(c => c.Field);
    const userTable = uFields.includes('full_name') ? 'users' : 'users';
    const nameCol = uFields.includes('full_name') ? 'full_name' : (uFields.includes('name') ? 'name' : 'email');

    const [users] = await conn.query(
      `SELECT user_id, ${nameCol} AS name, email, phone, created_at FROM ${userTable} ORDER BY created_at DESC`
    );

    if (users.length === 0) {
      console.log('No registered users found yet.');
    } else {
      console.table(users);
    }

    console.log('\n======================================================');
    console.log('📦 2. LIVE ORDERS, CUSTOMER ADDRESS & PAYMENT DETAILS');
    console.log('======================================================');

    // Check orders table columns
    const [oCols] = await conn.query('SHOW COLUMNS FROM orders');
    const oFields = oCols.map(c => c.Field);
    
    const streetCol = oFields.includes('street_address') ? 'street_address' : (oFields.includes('shipping_street') ? 'shipping_street' : 'NULL');
    const cityCol = oFields.includes('city') ? 'city' : (oFields.includes('shipping_city') ? 'shipping_city' : 'NULL');
    const pincodeCol = oFields.includes('pincode') ? 'pincode' : (oFields.includes('shipping_pincode') ? 'shipping_pincode' : 'NULL');
    const custIdCol = oFields.includes('customer_id') ? 'customer_id' : (oFields.includes('user_id') ? 'user_id' : 'order_id');

    const [orders] = await conn.query(`
      SELECT 
        o.order_id,
        o.${custIdCol} AS customer_id,
        o.customer_name,
        o.email,
        o.phone,
        o.${streetCol} AS street_address,
        o.${cityCol} AS city,
        o.${pincodeCol} AS pincode,
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
    
    // Check order_items table columns
    const [iCols] = await conn.query('SHOW COLUMNS FROM order_items');
    const iFields = iCols.map(c => c.Field);
    const subtotalCol = iFields.includes('subtotal') ? 'subtotal' : (iFields.includes('total_item_price') ? 'total_item_price' : 'unit_price');

    const [items] = await conn.query(`
      SELECT 
        order_id,
        product_name,
        selected_size,
        unit_price,
        quantity,
        ${subtotalCol} AS subtotal
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
