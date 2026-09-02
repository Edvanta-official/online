import mysql from 'mysql2/promise';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

let pool = null;
let isMySQLLive = false;

// Create MySQL Connection Pool
export function getMySQLPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'koushik',
      password: process.env.DB_PASSWORD || 'Koushik@1',
      database: process.env.DB_NAME || 'sparkle_store',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000
    });
  }
  return pool;
}

// Helper to execute MySQL queries safely with local JSON fallback
export async function queryMySQL(sql, params = []) {
  try {
    const poolInstance = getMySQLPool();
    const [results] = await poolInstance.execute(sql, params);
    isMySQLLive = true;
    return { success: true, results, isMySQL: true };
  } catch (err) {
    isMySQLLive = false;
    return { success: false, error: err.message, isMySQL: false };
  }
}

// Automatic Schema Migration & Initializer
export async function initMySQLSchema() {
  try {
    const poolInstance = getMySQLPool();
    const conn = await poolInstance.getConnection();
    
    // 1. Customers Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id VARCHAR(50) PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password_hash VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_customer_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Users Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(50) PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password_hash VARCHAR(255),
        role VARCHAR(20) DEFAULT 'customer',
        auth_method VARCHAR(50) DEFAULT 'Standard Auth',
        last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        login_count INT DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Orders Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        email VARCHAR(150),
        phone VARCHAR(20),
        street_address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        total_amount DECIMAL(10, 2) NOT NULL,
        discount_amount DECIMAL(10, 2) DEFAULT 0.00,
        shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
        final_paid_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'PayU Hosted Gateway',
        payment_status VARCHAR(50) DEFAULT 'pending',
        order_status VARCHAR(50) DEFAULT 'payment_pending',
        payu_txnid VARCHAR(100),
        mihpayid VARCHAR(100),
        utr_number VARCHAR(100),
        payment_hash VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_orders_customer_id (customer_id),
        INDEX idx_orders_payment_status (payment_status),
        INDEX idx_orders_payu_txnid (payu_txnid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Safe Alter Columns if table existed prior
    const safeAddColumn = async (tableName, colName, colDef) => {
      try {
        const [cols] = await conn.query(`SHOW COLUMNS FROM ${tableName} LIKE '${colName}'`);
        if (cols.length === 0) {
          await conn.query(`ALTER TABLE ${tableName} ADD COLUMN ${colName} ${colDef}`);
        }
      } catch (e) {}
    };

    await safeAddColumn('orders', 'payu_txnid', 'VARCHAR(100)');
    await safeAddColumn('orders', 'mihpayid', 'VARCHAR(100)');
    await safeAddColumn('orders', 'payment_hash', 'VARCHAR(255)');
    await safeAddColumn('orders', 'shipping_fee', 'DECIMAL(10, 2) DEFAULT 0.00');
    await safeAddColumn('orders', 'state', 'VARCHAR(100)');

    // 4. Order Items Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        product_name VARCHAR(150) NOT NULL,
        selected_size VARCHAR(50) DEFAULT 'Standard',
        selected_color VARCHAR(50),
        quantity INT DEFAULT 1,
        unit_price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        INDEX idx_order_items_order_id (order_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Payments Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        customer_id VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'PayU Hosted Gateway',
        payment_status VARCHAR(50) DEFAULT 'pending',
        payu_txnid VARCHAR(100),
        mihpayid VARCHAR(100),
        gateway_response TEXT,
        payment_hash VARCHAR(255),
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_payments_order_id (order_id),
        INDEX idx_payments_customer_id (customer_id),
        INDEX idx_payments_payu_txnid (payu_txnid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    conn.release();
    isMySQLLive = true;
    console.log('✅ MySQL Database & Tables Schema Initialized Successfully!');
    return true;
  } catch (err) {
    isMySQLLive = false;
    console.log(`ℹ️ MySQL Schema Init Notice (${err.message}) — Local Engine active.`);
    return false;
  }
}

// Save Order to MySQL Database & Backup JSON Engine
export async function saveOrderToDatabase(orderData) {
  const {
    orderId,
    customerId,
    customerName,
    email,
    phone,
    shippingAddress = {},
    items = [],
    subtotal = 0,
    discountAmount = 0,
    shippingFee = 0,
    finalPaidAmount = 0,
    paymentMethod = 'PayU Hosted Gateway',
    paymentStatus = 'pending',
    orderStatus = 'payment_pending',
    payuTxnid,
    mihpayid = '',
    paymentHash = ''
  } = orderData;

  const street = shippingAddress.street || shippingAddress.address || '';
  const city = shippingAddress.city || '';
  const state = shippingAddress.state || '';
  const pincode = shippingAddress.pincode || shippingAddress.zip || '';

  // 1. Try MySQL Database Insertion
  try {
    const poolInstance = getMySQLPool();
    const conn = await poolInstance.getConnection();
    await conn.beginTransaction();

    // Ensure customer exists in customers table
    await conn.execute(`
      INSERT INTO customers (customer_id, full_name, email, phone, password_hash)
      VALUES (?, ?, ?, ?, 'GUEST_CHECKOUT')
      ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), phone = VALUES(phone)
    `, [customerId, customerName, email || `${customerId}@sparkle.com`, phone || '']);

    // Insert Order
    await conn.execute(`
      INSERT INTO orders (
        order_id, customer_id, customer_name, email, phone,
        street_address, city, state, pincode, total_amount,
        discount_amount, shipping_fee, final_paid_amount,
        payment_method, payment_status, order_status,
        payu_txnid, mihpayid, payment_hash, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        payment_status = VALUES(payment_status),
        order_status = VALUES(order_status),
        payu_txnid = VALUES(payu_txnid),
        mihpayid = VALUES(mihpayid),
        payment_hash = VALUES(payment_hash),
        updated_at = NOW()
    `, [
      orderId, customerId, customerName, email, phone,
      street, city, state, pincode, subtotal,
      discountAmount, shippingFee, finalPaidAmount,
      paymentMethod, paymentStatus, orderStatus,
      payuTxnid, mihpayid, paymentHash
    ]);

    // Insert Order Items
    await conn.execute(`DELETE FROM order_items WHERE order_id = ?`, [orderId]);
    for (const item of items) {
      const pId = item.product?.id || item.id || 'SPK-PROD';
      const pName = item.product?.name || item.name || 'Sparkle Jewelry';
      const pSize = item.selectedSize || item.size || 'Standard';
      const pColor = item.selectedColor || item.color || '';
      const pQty = Number(item.quantity || 1);
      const pPrice = Number(item.product?.price || item.price || 0);
      const pSubtotal = pPrice * pQty;

      await conn.execute(`
        INSERT INTO order_items (
          order_id, product_id, product_name, selected_size, selected_color, quantity, unit_price, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [orderId, pId, pName, pSize, pColor, pQty, pPrice, pSubtotal]);
    }

    // Insert Payment Record
    const paymentId = `PAY-${Date.now()}`;
    await conn.execute(`
      INSERT INTO payments (
        payment_id, order_id, customer_id, amount, payment_method,
        payment_status, payu_txnid, mihpayid, payment_hash, payment_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        payment_status = VALUES(payment_status),
        mihpayid = VALUES(mihpayid)
    `, [paymentId, orderId, customerId, finalPaidAmount, paymentMethod, paymentStatus, payuTxnid, mihpayid, paymentHash]);

    await conn.commit();
    conn.release();
    console.log(`✅ Order saved to MySQL Database: ${orderId} (TxnID: ${payuTxnid})`);
  } catch (mysqlErr) {
    console.warn(`ℹ️ MySQL Save Notice (${mysqlErr.message}) — Backing up to Local File Data.`);
  }

  // 2. Always backup to JSON Data File Engine
  try {
    let localOrders = [];
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      if (data.trim()) localOrders = JSON.parse(data);
    }
    const idx = localOrders.findIndex(o => o.orderId === orderId || o.payuTxnid === payuTxnid || o.id === orderId);
    const newRecord = {
      orderId,
      id: orderId,
      customerId,
      customer_id: customerId,
      customerName,
      customer_name: customerName,
      email,
      phone,
      shippingAddress: { street, city, state, pincode },
      items,
      subtotal,
      discountAmount,
      shippingFee,
      finalPaidAmount,
      totalAmount: finalPaidAmount,
      paymentMethod,
      paymentStatus,
      payment_status: paymentStatus,
      orderStatus,
      order_status: orderStatus,
      payuTxnid,
      payu_txnid: payuTxnid,
      mihpayid,
      paymentHash,
      createdAt: new Date().toISOString()
    };

    if (idx >= 0) localOrders[idx] = newRecord;
    else localOrders.unshift(newRecord);

    fs.writeFileSync(ORDERS_FILE, JSON.stringify(localOrders, null, 2), 'utf8');
    console.log(`✅ Order synced to Local Engine File: ${orderId}`);
  } catch (fileErr) {
    console.error('Local File Save Error:', fileErr);
  }

  return true;
}

// Update Order Status in Database by PayU TxnID
export async function updateOrderStatusByTxnid(txnid, statusData) {
  const {
    paymentStatus = 'paid',
    orderStatus = 'Order Received',
    mihpayid = '',
    gatewayResponse = {}
  } = statusData;

  // 1. Update MySQL
  try {
    const poolInstance = getMySQLPool();
    const conn = await poolInstance.getConnection();
    await conn.execute(`
      UPDATE orders
      SET payment_status = ?, order_status = ?, mihpayid = ?, updated_at = NOW()
      WHERE payu_txnid = ? OR order_id = ?
    `, [paymentStatus, orderStatus, mihpayid, txnid, txnid]);

    await conn.execute(`
      UPDATE payments
      SET payment_status = ?, mihpayid = ?, gateway_response = ?
      WHERE payu_txnid = ? OR order_id = ?
    `, [paymentStatus, mihpayid, JSON.stringify(gatewayResponse), txnid, txnid]);

    conn.release();
    console.log(`✅ MySQL Order updated via TxnID ${txnid}: ${paymentStatus} / ${orderStatus}`);
  } catch (err) {}

  // 2. Update Local Engine File
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      if (data.trim()) {
        let localOrders = JSON.parse(data);
        let updated = false;
        localOrders = localOrders.map(o => {
          if (o.payuTxnid === txnid || o.payu_txnid === txnid || o.orderId === txnid || o.id === txnid) {
            updated = true;
            return {
              ...o,
              paymentStatus,
              payment_status: paymentStatus,
              orderStatus,
              order_status: orderStatus,
              mihpayid,
              gatewayResponse
            };
          }
          return o;
        });
        if (updated) {
          fs.writeFileSync(ORDERS_FILE, JSON.stringify(localOrders, null, 2), 'utf8');
          console.log(`✅ Local Engine Order updated via TxnID ${txnid}: ${paymentStatus}`);
        }
      }
    }
  } catch (e) {}
}

// Fetch Customer Orders from MySQL or Local Backup
export async function fetchCustomerOrders(customerIdOrEmail) {
  const cleanKey = String(customerIdOrEmail || '').trim().toLowerCase();

  // 1. Try MySQL
  try {
    const poolInstance = getMySQLPool();
    const [orders] = await poolInstance.execute(`
      SELECT 
        o.order_id AS orderId,
        o.customer_id AS customerId,
        o.customer_name AS customerName,
        o.email,
        o.phone,
        o.street_address AS street,
        o.city,
        o.state,
        o.pincode,
        o.total_amount AS subtotal,
        o.discount_amount AS discountAmount,
        o.shipping_fee AS shippingFee,
        o.final_paid_amount AS finalPaidAmount,
        o.payment_method AS paymentMethod,
        o.payment_status AS paymentStatus,
        o.order_status AS orderStatus,
        o.payu_txnid AS payuTxnid,
        o.mihpayid,
        o.created_at AS createdAt
      FROM orders o
      WHERE LOWER(o.customer_id) = ? OR LOWER(o.email) = ?
      ORDER BY o.created_at DESC
    `, [cleanKey, cleanKey]);

    if (orders && orders.length > 0) {
      // Attach Items
      for (const ord of orders) {
        const [items] = await poolInstance.execute(`
          SELECT product_id AS id, product_name AS name, selected_size AS selectedSize, selected_color AS selectedColor, quantity, unit_price AS price, subtotal
          FROM order_items
          WHERE order_id = ?
        `, [ord.orderId]);
        ord.items = items || [];
      }
      return orders;
    }
  } catch (err) {}

  // 2. Fallback Local File
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      if (data.trim()) {
        const localOrders = JSON.parse(data);
        return localOrders.filter(o => 
          String(o.customerId || o.customer_id || '').toLowerCase() === cleanKey ||
          String(o.email || '').toLowerCase() === cleanKey
        );
      }
    }
  } catch (e) {}

  return [];
}

// Fetch All Orders (for Admin Panel)
export async function fetchAllDatabaseOrders() {
  try {
    const poolInstance = getMySQLPool();
    const [orders] = await poolInstance.execute(`
      SELECT 
        o.order_id AS orderId,
        o.customer_id AS customerId,
        o.customer_name AS customerName,
        o.email,
        o.phone,
        o.street_address AS street,
        o.city,
        o.state,
        o.pincode,
        o.total_amount AS subtotal,
        o.discount_amount AS discountAmount,
        o.shipping_fee AS shippingFee,
        o.final_paid_amount AS finalPaidAmount,
        o.payment_method AS paymentMethod,
        o.payment_status AS paymentStatus,
        o.order_status AS orderStatus,
        o.payu_txnid AS payuTxnid,
        o.mihpayid,
        o.created_at AS createdAt
      FROM orders o
      ORDER BY o.created_at DESC
    `);

    if (orders && orders.length > 0) {
      for (const ord of orders) {
        const [items] = await poolInstance.execute(`
          SELECT product_id AS id, product_name AS name, selected_size AS selectedSize, selected_color AS selectedColor, quantity, unit_price AS price, subtotal
          FROM order_items
          WHERE order_id = ?
        `, [ord.orderId]);
        ord.items = items || [];
      }
      return orders;
    }
  } catch (err) {}

  // Local File Fallback
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      if (data.trim()) return JSON.parse(data);
    }
  } catch (e) {}

  return [];
}

// Run schema initialization on module import
initMySQLSchema();
