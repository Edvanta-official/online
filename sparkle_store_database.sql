-- =================================================================
-- Sparkle @ KKV Luxury Store - Complete SQL Database Schema
-- Compatible with: Microsoft SQL Server (MSSQL), MySQL, PostgreSQL, SQLite
-- =================================================================

-- -----------------------------------------------------------------
-- Table 1: PRODUCTS CATALOG DATABASE
-- Tracks store items, categories, price, stock & bangle sizes
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(50) PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    stock INT DEFAULT 50,
    available_sizes VARCHAR(100) DEFAULT 'Standard', -- Bangle sizes: 2*4, 2*6, 2*8
    is_best_seller BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------
-- Table 2: USERS & LOGIN SESSIONS LOG
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer',
    auth_method VARCHAR(50) DEFAULT 'Standard Auth',
    last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    login_count INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------
-- Table 3: CUSTOMER ORDERS & PAYMENTS LOG
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    final_paid_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'PhonePe',
    payment_status VARCHAR(20) DEFAULT 'Paid',
    order_status VARCHAR(30) DEFAULT 'Order Received',
    utr_number VARCHAR(100),
    tracking_number VARCHAR(100),
    shipping_street TEXT,
    shipping_city VARCHAR(100),
    shipping_pincode VARCHAR(20),
    estimated_delivery_date VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------
-- Table 4: ORDERED ITEMS & SIZES BREAKDOWN
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    selected_size VARCHAR(20) DEFAULT 'N/A',
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_item_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------
-- SEED STORE CATALOG PRODUCTS INTO DATABASE
-- -----------------------------------------------------------------
INSERT INTO products (product_id, product_name, category, price, original_price, stock, available_sizes, is_best_seller) VALUES
('SPK-HC-001', 'Plumeria flower claw clip', 'Clips', 99.00, 199.00, 12, 'Standard', 1),
('SPK-HC-002', 'Claw Clips', 'Clips', 99.00, 199.00, 10, 'Standard', 1),
('SPK-BG-501', 'Royal Kundan Gold Bangle Set', 'Bangles', 1299.00, 2499.00, 15, '2*4, 2*6, 2*8', 1),
('SPK-BG-502', 'Traditional Temple Kada Bangles', 'Bangles', 999.00, 1899.00, 20, '2*4, 2*6, 2*8', 0),
('SPK-BG-503', 'Antique Matte Gold Peacock Bangle', 'Bangles', 1499.00, 2799.00, 8, '2*4, 2*6, 2*8', 1),
('SPK-BG-504', 'Pearl & Emerald Studded Bangles', 'Bangles', 899.00, 1599.00, 25, '2*4, 2*6, 2*8', 0),
('SPK-BG-505', 'Designer Oxidised Silver Bangle Set', 'Bangles', 699.00, 1299.00, 30, '2*4, 2*6, 2*8', 0),
('SPK-NC-101', 'Matte Gold Antique Choker Set', 'Necklace Sets', 1899.00, 3499.00, 10, 'Standard', 1),
('SPK-CH-301', 'Satellite Chain 18K Gold Plated', 'Chains', 499.00, 999.00, 50, 'Standard', 1),
('SPK-BR-401', 'Adjustable Gold Plated Kada Bracelet', 'Bracelets', 599.00, 1199.00, 40, 'Standard', 1),
('SPK-ER-201', 'Kundan Chandbali Earrings', 'Ear Rings', 499.00, 899.00, 35, 'Standard', 1);
