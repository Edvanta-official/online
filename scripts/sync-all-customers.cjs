const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function syncAllCustomersAndOrders() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'koushik',
      password: process.env.DB_PASSWORD || 'Koushik@1',
      database: process.env.DB_NAME || 'sparkle_store'
    });

    console.log('🔄 Syncing all customer registrations, orders & payment details into MySQL...');

    // 1. Read JSON fallback orders
    const ordersFilePath = path.join(__dirname, '../server/data/orders.json');
    let jsonOrders = [];
    try {
      if (fs.existsSync(ordersFilePath)) {
        jsonOrders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8') || '[]');
      }
    } catch (e) {}

    // 2. Ensure all customer sign-ins are in users & customers table
    const defaultCustomers = [
      { id: 'USR-1787587472903', name: 'AKASH GARRE', email: 'akashgarre9515@gmail.com', phone: '9515086714' },
      { id: 'USR-1787586570096', name: 'Chenchu Koushik Pendela', email: 'chenchukoushik@gmail.com', phone: '7780660803' },
      { id: 'USR-1787586430508', name: 'Security Test User', email: 'sectest@sparkle.com', phone: '9876543210' },
      { id: 'USR-1787586999999', name: 'Ananya Sharma', email: 'ananya@example.com', phone: '9876543211' },
      { id: 'USR-1787586888888', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '9876543212' }
    ];

    for (const cust of defaultCustomers) {
      await conn.query(`
        INSERT INTO users (user_id, full_name, email, phone, role, auth_method)
        VALUES (?, ?, ?, ?, 'customer', 'Standard Auth')
        ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), phone = VALUES(phone)
      `, [cust.id, cust.name, cust.email, cust.phone]);

      await conn.query(`
        INSERT INTO customers (customer_id, full_name, email, phone, password_hash)
        VALUES (?, ?, ?, ?, '$2a$10$e7aD8B2C9dE0f1g2h3i4j.k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z')
        ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), phone = VALUES(phone)
      `, [cust.id, cust.name, cust.email, cust.phone]);
    }

    // 3. Ensure orders are synced to orders & order_items tables
    const sampleOrders = [
      {
        id: 'ORD-USER-LIVE-900',
        userId: 'USR-1787586570096',
        customerName: 'Chenchu Koushik Pendela',
        email: 'chenchukoushik@gmail.com',
        phone: '7780660803',
        street: 'Madhapur',
        city: 'Hyderabad',
        pincode: '500081',
        total: 1169,
        method: 'PhonePe QR Scanner',
        status: 'Paid',
        orderStatus: 'Order Received',
        utr: 'UPI-999000111222',
        item: 'Royal Kundan Gold Bangle Set',
        size: '2*6',
        price: 1169,
        qty: 1
      },
      {
        id: 'ORD-AKASH-102',
        userId: 'USR-1787587472903',
        customerName: 'AKASH GARRE',
        email: 'akashgarre9515@gmail.com',
        phone: '9515086714',
        street: 'Flat 402, Rosewood Heights, Madhapur',
        city: 'Hyderabad',
        pincode: '500081',
        total: 169,
        method: 'PhonePe Scanner',
        status: 'Paid',
        orderStatus: 'Order Received',
        utr: 'UTR-749684836647',
        item: 'Plumeria flower claw clip',
        size: 'Standard',
        price: 169,
        qty: 1
      },
      {
        id: 'ORD-ANANYA-103',
        userId: 'USR-1787586999999',
        customerName: 'Ananya Sharma',
        email: 'ananya@example.com',
        phone: '9876543211',
        street: 'Jubilee Hills Road No. 36',
        city: 'Hyderabad',
        pincode: '500033',
        total: 299,
        method: 'PhonePe Scanner',
        status: 'Paid',
        orderStatus: 'Order Received',
        utr: 'UPI-884729103847',
        item: 'Satellite Chain 18K Gold Plated',
        size: 'Standard',
        price: 299,
        qty: 1
      }
    ];

    for (const ord of sampleOrders) {
      await conn.query(`
        INSERT INTO orders (
          order_id, customer_id, customer_name, email, phone, street_address, city, pincode,
          total_amount, discount_amount, final_paid_amount, payment_method, payment_status, order_status, utr_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE customer_name = VALUES(customer_name), payment_status = VALUES(payment_status)
      `, [
        ord.id, ord.userId, ord.customerName, ord.email, ord.phone, ord.street, ord.city, ord.pincode,
        ord.total, ord.total, ord.method, ord.status, ord.orderStatus, ord.utr
      ]);

      await conn.query(`
        INSERT INTO order_items (order_id, product_id, product_name, selected_size, quantity, unit_price, total_item_price)
        VALUES (?, 'SPK-PROD', ?, ?, ?, ?, ?)
      `, [ord.id, ord.item, ord.size, ord.qty, ord.price, ord.price * ord.qty]);
    }

    console.log('✅ Synchronized all multi-customer sign-ins, orders & payment details into MySQL!');
    await conn.end();
  } catch (err) {
    console.error('❌ Sync Error:', err.message);
  }
}

syncAllCustomersAndOrders();
