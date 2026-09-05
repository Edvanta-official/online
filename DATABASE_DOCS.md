# Sparkle KKV - PostgreSQL Production Database Guide & Documentation

This document describes how to set up, migrate, backup, restore, monitor, and deploy the new PostgreSQL database architecture for **Sparkle KKV** (`https://sparklekkv.com`).

---

## 1. Database Architecture & Table Summary

The PostgreSQL database contains **19 fully normalized relational tables**:

| Table Name | Primary Purpose | Key Foreign Keys |
| :--- | :--- | :--- |
| `users` | Customer & Admin user profiles, password hashes, roles | None |
| `user_sessions` | Active/recent login sessions with hashed tokens & device metadata | `user_id -> users(id)` |
| `login_events` | Audit trail of login attempts, password changes, logouts | `user_id -> users(id)` |
| `addresses` | User shipping & billing addresses | `user_id -> users(id)` |
| `categories` | Product hierarchy & categories | `parent_id -> categories(id)` |
| `products` | Master product catalog, SKU, pricing, stock levels | `category_id -> categories(id)` |
| `product_images` | Multi-image support for products | `product_id -> products(id)` |
| `product_variants` | Product variant details (size, color, material) | `product_id -> products(id)` |
| `inventory_transactions` | Traceable stock adjustments (Stock In, Orders, Returns) | `product_id -> products(id)` |
| `carts` | Shopping carts (`ACTIVE`, `CONVERTED`, `ABANDONED`) | `user_id -> users(id)` |
| `cart_items` | Individual cart items with quantities & price snapshots | `cart_id -> carts(id)`, `product_id -> products(id)` |
| `orders` | Customer orders, totals, payment & shipping status | `user_id -> users(id)`, `shipping_address_id -> addresses(id)` |
| `order_items` | Snapshot of purchased products (Name, SKU, Quantity, Price) | `order_id -> orders(id)`, `product_id -> products(id)` |
| `payments` | Master payment records for orders | `order_id -> orders(id)`, `user_id -> users(id)` |
| `payment_transactions` | Gateway-level PayU transaction logs & JSON responses | `payment_id -> payments(id)`, `order_id -> orders(id)` |
| `coupons` | Promo codes & percentage/fixed discounts | None |
| `coupon_usages` | Log of coupon applications per order/user | `coupon_id -> coupons(id)`, `order_id -> orders(id)` |
| `order_status_history` | Audit log of status transitions (e.g. PAYMENT_PENDING -> CONFIRMED) | `order_id -> orders(id)` |
| `audit_logs` | System audit trail for administrative actions | `user_id -> users(id)` |

---

## 2. Environment Variables Configuration

Ensure your `.env` file contains the following environment variables (never commit `.env` to version control):

```ini
PORT=5000
DATABASE_URL=postgresql://username:password@hostname:5432/sparkle_store?sslmode=require
DIRECT_URL=postgresql://username:password@hostname:5432/sparkle_store
JWT_SECRET=your_secure_random_jwt_secret_key
ADMIN_EMAIL=sparklekkvofficial@gmail.com
PAYU_ENV=production
PAYU_KEY=8izKVp
PAYU_SALT=Do2eaSyvC2mBV7HoEPGiiYpaVxsSSmGl
```

---

## 3. How to Run Migrations & Seed Database

### Run Migrations Automatically
When the Express server starts (`npm run server` or `npm start`), it will automatically connect to PostgreSQL, run `server/migrations/001_initial_schema.sql`, and populate seed data via `server/seed/seed_postgres.js`.

### Run Seed Manually
```bash
node server/seed/seed_postgres.js
```

---

## 4. PostgreSQL Backup & Restore Procedures

### How to Create a Full Database Backup (`pg_dump`)
Run the following command in your terminal or cron task:
```bash
pg_dump -h localhost -U postgres -d sparkle_store -F c -b -v -f sparkle_store_backup.dump
```

### How to Restore Database from Backup (`pg_restore`)
```bash
pg_restore -h localhost -U postgres -d sparkle_store -v sparkle_store_backup.dump
```

### Plain SQL Export (`pg_dump`)
```bash
pg_dump -h localhost -U postgres -d sparkle_store > sparkle_store_schema_data.sql
```

---

## 5. Security Checklist

- [x] **No Plaintext Passwords**: All user passwords hashed using `bcrypt` (12 rounds for admin, 10 rounds for customers).
- [x] **No Plain Session Tokens**: Hashed session tokens stored in `user_sessions`.
- [x] **Server-Side PayU Verification**: SHA-512 hash calculation performed strictly on the backend using `PAYU_KEY` and `PAYU_SALT`.
- [x] **Concurrency & Stock Security**: Order creation uses PostgreSQL row locks (`SELECT FOR UPDATE`) to prevent inventory double-selling.
- [x] **Parameterized SQL Queries**: All queries execute using `pg` parameterized placeholders (`$1`, `$2`, etc.) preventing SQL injection attacks.
- [x] **Role-Based Authorization**: Protected `/api/admin/*` endpoints strictly require `ADMIN` or `SUPER_ADMIN` JWT roles.
