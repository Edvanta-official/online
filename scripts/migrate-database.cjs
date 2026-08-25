const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'koushik',
      password: process.env.DB_PASSWORD || 'Koushik@1',
      database: process.env.DB_NAME || 'sparkle_store'
    });

    console.log('✅ Connected to MySQL for Schema Migration...');

    // 1. Create customers table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id VARCHAR(50) PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_customer_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Ensure users table exists & check columns
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

    // Alter users table if missing columns
    const [uCols] = await conn.query('SHOW COLUMNS FROM users');
    const uFields = uCols.map(c => c.Field);
    if (!uFields.includes('full_name') && uFields.includes('name')) {
      await conn.query('ALTER TABLE users CHANGE name full_name VARCHAR(100) NOT NULL');
    }
    if (!uFields.includes('password_hash')) {
      await conn.query('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)');
    }

    // Alter orders table if missing customer_id or street_address or columns
    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        email VARCHAR(150),
        phone VARCHAR(20),
        street_address TEXT,
        city VARCHAR(100),
        pincode VARCHAR(20),
        total_amount DECIMAL(10, 2) NOT NULL,
        discount_amount DECIMAL(10, 2) DEFAULT 0.00,
        final_paid_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'PhonePe Scanner',
        payment_status VARCHAR(20) DEFAULT 'Paid',
        order_status VARCHAR(50) DEFAULT 'Order Received',
        utr_number VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [oCols] = await conn.query('SHOW COLUMNS FROM orders');
    const oFields = oCols.map(c => c.Field);
    if (!oFields.includes('customer_id') && oFields.includes('user_id')) {
      await conn.query('ALTER TABLE orders CHANGE user_id customer_id VARCHAR(50) NOT NULL');
    } else if (!oFields.includes('customer_id')) {
      await conn.query('ALTER TABLE orders ADD COLUMN customer_id VARCHAR(50) NOT NULL DEFAULT "GUEST"');
    }
    if (!oFields.includes('street_address') && oFields.includes('shipping_street')) {
      await conn.query('ALTER TABLE orders CHANGE shipping_street street_address TEXT');
    } else if (!oFields.includes('street_address')) {
      await conn.query('ALTER TABLE orders ADD COLUMN street_address TEXT');
    }
    if (!oFields.includes('city') && oFields.includes('shipping_city')) {
      await conn.query('ALTER TABLE orders CHANGE shipping_city city VARCHAR(100)');
    } else if (!oFields.includes('city')) {
      await conn.query('ALTER TABLE orders ADD COLUMN city VARCHAR(100)');
    }
    if (!oFields.includes('pincode') && oFields.includes('shipping_pincode')) {
      await conn.query('ALTER TABLE orders CHANGE shipping_pincode pincode VARCHAR(20)');
    } else if (!oFields.includes('pincode')) {
      await conn.query('ALTER TABLE orders ADD COLUMN pincode VARCHAR(20)');
    }

    // 3. Create order_items table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        product_name VARCHAR(150) NOT NULL,
        selected_size VARCHAR(50) DEFAULT 'Standard',
        quantity INT DEFAULT 1,
        unit_price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        INDEX idx_order_items_order_id (order_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Create payments table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        customer_id VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'PhonePe Scanner',
        payment_status VARCHAR(50) DEFAULT 'Paid',
        utr_number VARCHAR(100),
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_payments_order_id (order_id),
        INDEX idx_payments_customer_id (customer_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('🎉 MySQL Database Schema Migrated Successfully!');
    await conn.end();
  } catch (err) {
    console.error('❌ Migration Error:', err.message);
  }
}

migrate();
