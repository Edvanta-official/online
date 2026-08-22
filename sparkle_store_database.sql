-- =================================================================
-- Sparkle @ KKV Luxury Store - Complete SQL Database Schema
-- Compatible with: Microsoft SQL Server (MSSQL), MySQL, PostgreSQL, SQLite
-- =================================================================

-- 1. CREATE DATABASE (Execute if creating a new database instance)
-- CREATE DATABASE SparkleStoreDB;
-- GO
-- USE SparkleStoreDB;
-- GO

-- -----------------------------------------------------------------
-- Table 1: USERS & LOGIN SESSIONS LOG
-- Tracks who logged in, their profile details, and login timestamps
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer', -- 'customer' or 'admin'
    auth_method VARCHAR(50) DEFAULT 'Standard Auth',
    last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    login_count INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------
-- Table 2: CUSTOMER ORDERS & PAYMENTS LOG
-- Tracks customer orders, total paid, payment method, & address
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    final_paid_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'PhonePe',
    payment_status VARCHAR(20) DEFAULT 'Paid', -- 'Paid' or 'Pending'
    order_status VARCHAR(30) DEFAULT 'Order Received', -- 'Order Received', 'Processing', 'Shipped', 'Delivered'
    utr_number VARCHAR(100),
    tracking_number VARCHAR(100),
    shipping_street TEXT,
    shipping_city VARCHAR(100),
    shipping_pincode VARCHAR(20),
    estimated_delivery_date VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------
-- Table 3: ORDERED ITEMS & SIZES BREAKDOWN
-- Tracks item name, selected size (e.g. 2*4, 2*6, 2*8), price, & qty
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    selected_size VARCHAR(20) DEFAULT 'N/A', -- Bangle sizes: 2*4, 2*6, 2*8
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_item_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------
-- Table 4: NEWSLETTER & VIP SUBSCRIBERS DATABASE
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscribers (
    subscriber_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    coupon_code VARCHAR(30) DEFAULT 'SPARKEL10',
    status VARCHAR(20) DEFAULT 'active',
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- SAMPLE SELECT QUERIES FOR ADMIN REPORTS
-- =================================================================

-- Query 1: View all logged in users & last login time
-- SELECT user_id, full_name, email, phone, role, last_login_at, login_count FROM users ORDER BY last_login_at DESC;

-- Query 2: View complete customer orders with payment & item details
-- SELECT 
--     o.order_id,
--     o.customer_name,
--     o.email,
--     o.phone,
--     o.final_paid_amount,
--     o.payment_method,
--     o.order_status,
--     i.product_name,
--     i.selected_size,
--     i.quantity,
--     i.unit_price,
--     i.total_item_price,
--     o.shipping_street,
--     o.shipping_city,
--     o.shipping_pincode,
--     o.created_at
-- FROM orders o
-- INNER JOIN order_items i ON o.order_id = i.order_id
-- ORDER BY o.created_at DESC;
