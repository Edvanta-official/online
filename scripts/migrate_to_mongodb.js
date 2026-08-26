import mongoose from 'mongoose';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../server/models/User.js';
import Order from '../server/models/Order.js';
import Subscriber from '../server/models/Subscriber.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../server/data');

const MONGODB_URI = process.env.MONGODB_URI;

const readJsonFile = (filename, fallback = []) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      if (data.trim()) return JSON.parse(data);
    }
  } catch (e) {}
  return fallback;
};

async function migrateData() {
  console.log(`\n🚀 Starting Migration to MongoDB Atlas...`);
  console.log(`URI: ${MONGODB_URI}\n`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ Connected to MongoDB Atlas!`);

    const localOrders = readJsonFile('orders.json');
    const localUsers = readJsonFile('users.json');
    const localSubscribers = readJsonFile('subscribers.json');

    // 1. Migrate Users
    let userCount = 0;
    for (const u of localUsers) {
      const existing = await User.findOne({ email: u.email });
      if (!existing && u.email) {
        await User.create({
          userId: u.id || u.user_id || `USR-${Date.now()}`,
          fullName: u.name || u.full_name || 'Sparkle Customer',
          email: u.email,
          phone: u.phone || '',
          role: u.role || 'customer',
          authMethod: u.authMethod || 'Standard Auth',
          loginCount: u.loginCount || 1
        });
        userCount++;
      }
    }
    console.log(`👤 Migrated ${userCount} users to MongoDB Atlas.`);

    // 2. Migrate Orders
    let orderCount = 0;
    for (const o of localOrders) {
      const orderId = String(o.id || o.order_id);
      const existing = await Order.findOne({ orderId });
      if (!existing && orderId) {
        const mappedItems = (o.items || []).map(item => ({
          productId: String(item.id || item.product_id || 'SPK-PROD'),
          productName: String(item.name || item.product_name || 'Sparkle Jewelry Item'),
          selectedSize: String(item.size || item.selected_size || 'Standard'),
          quantity: Number(item.quantity || 1) || 1,
          unitPrice: Number(item.price || item.unit_price || 0) || 0,
          totalItemPrice: Number(item.price || item.unit_price || 0) * Number(item.quantity || 1)
        }));

        await Order.create({
          orderId,
          customerName: o.customerName || o.customer_name || 'Sparkle Customer',
          email: o.email || '',
          phone: o.phone || '',
          totalAmount: Number(o.totalAmount || o.finalPaidAmount || 0),
          finalPaidAmount: Number(o.finalPaidAmount || o.totalAmount || 0),
          paymentMethod: o.paymentMethod || 'PhonePe',
          paymentStatus: o.paymentStatus || 'Paid',
          orderStatus: o.orderStatus || 'Order Received',
          utrNumber: o.utrNumber || '',
          items: mappedItems
        });
        orderCount++;
      }
    }
    console.log(`📦 Migrated ${orderCount} orders to MongoDB Atlas.`);

    // 3. Migrate Subscribers
    let subCount = 0;
    for (const s of localSubscribers) {
      if (s.email) {
        const existing = await Subscriber.findOne({ email: s.email });
        if (!existing) {
          await Subscriber.create({ email: s.email });
          subCount++;
        }
      }
    }
    console.log(`👥 Migrated ${subCount} subscribers to MongoDB Atlas.`);

    console.log(`\n🎉 Migration Complete! All data is live in MongoDB Atlas.\n`);

  } catch (error) {
    console.error(`❌ Migration Error: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrateData();
