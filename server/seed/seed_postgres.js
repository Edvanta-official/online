import bcrypt from 'bcryptjs';
import { queryPostgres, runPostgresMigrations, getPostgresPool } from '../db_postgres.js';
import { CATEGORIES, PRODUCTS } from '../../src/data/mockData.js';

export async function seedPostgresDatabase() {
  console.log('🌱 Starting PostgreSQL Seed Process...');
  try {
    // 1. Run migrations first to ensure schema exists
    const migrationOk = await runPostgresMigrations();
    if (!migrationOk) {
      console.log('⚠️ PostgreSQL database is not reachable at DATABASE_URL.');
      console.log('👉 Please set your live PostgreSQL connection URL in .env:');
      console.log('   DATABASE_URL=postgresql://user:password@host:5432/dbname');
      return false;
    }

    // 2. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'sparklekkvofficial@gmail.com';
    const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Sparkle2026';
    const adminHash = await bcrypt.hash(adminPass, 12);

    const adminCheck = await queryPostgres('SELECT id FROM users WHERE email = $1', [adminEmail]);
    let adminId;
    if (!adminCheck.success || adminCheck.rows.length === 0) {
      const res = await queryPostgres(`
        INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_active, email_verified, phone_verified)
        VALUES ($1, $2, $3, $4, $5, 'ADMIN', true, true, true)
        RETURNING id
      `, ['Sparkle', 'Admin', adminEmail, '9949157771', adminHash]);
      adminId = res.rows?.[0]?.id;
      if (adminId) console.log('✅ Admin user created:', adminEmail);
    } else {
      adminId = adminCheck.rows[0].id;
      console.log('ℹ️ Admin user already exists:', adminEmail);
    }

    // 3. Seed Test Customer (Rahul)
    const customerEmail = 'rahul@gmail.com';
    const customerPass = 'Password123';
    const customerHash = await bcrypt.hash(customerPass, 10);

    const customerCheck = await queryPostgres('SELECT id FROM users WHERE email = $1', [customerEmail]);
    let customerId;
    if (customerCheck.rows.length === 0) {
      const res = await queryPostgres(`
        INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_active, email_verified, phone_verified, last_login_at)
        VALUES ($1, $2, $3, $4, $5, 'CUSTOMER', true, true, true, CURRENT_TIMESTAMP)
        RETURNING id
      `, ['Rahul', 'Sharma', customerEmail, '9876543210', customerHash]);
      customerId = res.rows[0].id;
      console.log('✅ Test customer created: rahul@gmail.com');

      // Create address for Rahul
      const addrRes = await queryPostgres(`
        INSERT INTO addresses (user_id, full_name, phone, address_line_1, address_line_2, area, city, state, postal_code, country, address_type, is_default)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'India', 'HOME', true)
        RETURNING id
      `, [customerId, 'Rahul Sharma', '9876543210', 'Plot No 45, Jubilee Hills', 'Road No 36', 'Jubilee Hills', 'Hyderabad', 'Telangana', '500033']);
      const addressId = addrRes.rows[0].id;

      // Create login event
      await queryPostgres(`
        INSERT INTO login_events (user_id, event_type, ip_address, user_agent, device, browser, operating_system, success)
        VALUES ($1, 'LOGIN', '127.0.0.1', 'Mozilla/5.0 (Android; Mobile)', 'Android Phone', 'Chrome Mobile', 'Android', true)
      `, [customerId]);

      // Create session
      await queryPostgres(`
        INSERT INTO user_sessions (user_id, session_token_hash, ip_address, user_agent, device_name, browser, operating_system, is_active)
        VALUES ($1, md5($2), '127.0.0.1', 'Mozilla/5.0 (Android)', 'Android', 'Chrome', 'Android', true)
      `, [customerId, `session_${Date.now()}`]);

      // Create sample order for Rahul (SKK-2026-000125)
      const orderRes = await queryPostgres(`
        INSERT INTO orders (order_number, user_id, billing_address_id, shipping_address_id, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, currency, payment_status, order_status, payment_method, confirmed_at)
        VALUES ($1, $2, $3, $3, 2998.00, 0.00, 0.00, 0.00, 2998.00, 'INR', 'PAID', 'CONFIRMED', 'PayU Hosted Gateway', CURRENT_TIMESTAMP)
        RETURNING id
      `, ['SKK-2026-000125', customerId, addressId]);
      const orderId = orderRes.rows[0].id;

      // Create order item
      await queryPostgres(`
        INSERT INTO order_items (order_id, product_name, sku, quantity, unit_price, discount_amount, tax_amount, total_amount)
        VALUES ($1, 'Gold Necklace', 'SKK-NK-001', 2, 1499.00, 0.00, 0.00, 2998.00)
      `, [orderId]);

      // Create payment record
      const payRes = await queryPostgres(`
        INSERT INTO payments (order_id, user_id, gateway, transaction_id, amount, currency, payment_method, status, gateway_payment_id)
        VALUES ($1, $2, 'PAYU', 'txnid_skk_125_sample', 2998.00, 'INR', 'UPI / Card', 'PAID', 'mihpayid_889911')
        RETURNING id
      `, [orderId, customerId]);
      const paymentId = payRes.rows[0].id;

      await queryPostgres(`
        INSERT INTO payment_transactions (payment_id, order_id, transaction_id, gateway_transaction_id, amount, status, payment_method, gateway_response)
        VALUES ($1, $2, 'txnid_skk_125_sample', 'mihpayid_889911', 2998.00, 'SUCCESS', 'PayU Gateway', '{"status":"success","msg":"Payment Successful"}'::jsonb)
      `, [paymentId, orderId]);

      await queryPostgres(`
        INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, reason)
        VALUES 
          ($1, 'PAYMENT_PENDING', 'CONFIRMED', 'SYSTEM', 'PayU Webhook Confirmed Payment'),
          ($1, 'CONFIRMED', 'PROCESSING', 'ADMIN', 'Order being packed')
      `, [orderId]);

    } else {
      customerId = customerCheck.rows[0].id;
      console.log('ℹ️ Test customer already exists: rahul@gmail.com');
    }

    // 4. Seed Categories from mockData.js
    console.log(`📦 Seeding ${CATEGORIES.length} Categories...`);
    const categoryIdMap = new Map();
    for (const cat of CATEGORIES) {
      const slug = cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const catCheck = await queryPostgres('SELECT id FROM categories WHERE slug = $1', [slug]);
      let catId;
      if (catCheck.rows.length === 0) {
        const res = await queryPostgres(`
          INSERT INTO categories (name, slug, description, image_url, is_active)
          VALUES ($1, $2, $3, $4, true)
          RETURNING id
        `, [cat.name, slug, cat.description || '', cat.image || '']);
        catId = res.rows[0]?.id;
      } else {
        catId = catCheck.rows[0].id;
      }
      categoryIdMap.set(cat.id, catId);
    }

    // 5. Seed Products from mockData.js
    console.log(`🛍️ Seeding ${PRODUCTS.length} Products...`);
    for (const p of PRODUCTS) {
      const sku = p.sku || p.id;
      const slug = (p.id || p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const categoryUUID = categoryIdMap.get(p.category) || null;
      const price = Number(p.price) || 0;
      const comparePrice = Number(p.originalPrice) || price;
      const stock = typeof p.stock === 'number' ? p.stock : 10;

      const prodCheck = await queryPostgres('SELECT id FROM products WHERE sku = $1 OR slug = $2', [sku, slug]);
      let prodId;
      if (prodCheck.rows.length === 0) {
        const res = await queryPostgres(`
          INSERT INTO products (sku, name, slug, description, short_description, price, compare_at_price, category_id, stock_quantity, is_active, is_featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10)
          RETURNING id
        `, [
          sku,
          p.name,
          slug,
          p.description || '',
          (p.details && Array.isArray(p.details)) ? p.details.join('. ') : (p.description || ''),
          price,
          comparePrice,
          categoryUUID,
          stock,
          p.isBestSeller || p.isTrending || false
        ]);
        prodId = res.rows[0]?.id;

        if (prodId && Array.isArray(p.images)) {
          for (let i = 0; i < p.images.length; i++) {
            await queryPostgres(`
              INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
              VALUES ($1, $2, $3, $4, $5)
            `, [prodId, p.images[i], p.name, i, i === 0]);
          }
        }
      }
    }

    // 6. Seed Sample Coupon
    await queryPostgres(`
      INSERT INTO coupons (code, description, discount_type, discount_value, minimum_order_amount, is_active)
      VALUES ('SPARKLE10', '10% Off on all luxury jewelry items', 'PERCENTAGE', 10.00, 499.00, true)
      ON CONFLICT (code) DO NOTHING
    `);

    console.log('✅ PostgreSQL Database Seeding Completed Successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error during PostgreSQL seed execution:', error);
    return false;
  }
}

// Allow standalone execution via `node server/seed/seed_postgres.js`
if (process.argv[1]?.includes('seed_postgres.js')) {
  seedPostgresDatabase().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
