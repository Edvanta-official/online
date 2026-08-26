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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sparkle_store';

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

async function inspectDatabase() {
  console.log(`\n===========================================================`);
  console.log(` 🔍 SPARKLE @ KKV - DATABASE INSPECTION TOOL`);
  console.log(`===========================================================`);

  if (MONGODB_URI.includes('cluster0.mongodb.net')) {
    console.log(`⚠️  NOTICE: Your .env file currently has a placeholder MongoDB Atlas URI:`);
    console.log(`   ${MONGODB_URI}`);
    console.log(`\n👉 To connect to live cloud MongoDB Atlas:`);
    console.log(`   Replace MONGODB_URI in your .env file with your real connection string from cloud.mongodb.com`);
    console.log(`\n📊 Displaying Local Data Backup Records below:\n`);
  }

  try {
    console.log(`📡 Attempting MongoDB connection...`);
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to MongoDB Atlas successfully!\n');

    // 1. Fetch Users / Login Records
    const users = await User.find().sort({ createdAt: -1 }).lean();
    console.log(`===========================================================`);
    console.log(` 👤 USER ACCOUNTS & LOGIN RECORDS (${users.length} Total Users)`);
    console.log(`===========================================================`);
    if (users.length === 0) {
      console.log(' (No users found in MongoDB yet)');
    } else {
      console.table(users.map(u => ({
        "User ID": u.userId,
        "Full Name": u.fullName,
        "Email": u.email,
        "Phone": u.phone || 'N/A',
        "Role": u.role,
        "Auth Method": u.authMethod,
        "Logins": u.loginCount,
        "Last Login": u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'N/A'
      })));
    }

    // 2. Fetch Orders & Order Items
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    console.log(`\n===========================================================`);
    console.log(` 🛍️ CUSTOMER ORDERS (${orders.length} Total Orders)`);
    console.log(`===========================================================`);
    if (orders.length === 0) {
      console.log(' (No orders found in MongoDB yet)');
    } else {
      console.table(orders.map(o => ({
        "Order ID": o.orderId,
        "Customer Name": o.customerName,
        "Email": o.email || 'N/A',
        "Phone": o.phone || 'N/A',
        "Total Paid": `₹${o.finalPaidAmount}`,
        "Payment Status": o.paymentStatus,
        "Order Status": o.orderStatus,
        "Items Count": o.items ? o.items.length : 0,
        "Order Date": o.createdAt ? new Date(o.createdAt).toLocaleString() : 'N/A'
      })));
    }

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.log(`ℹ️ Cloud MongoDB connection offline/placeholder (${error.message}).`);
    console.log(`\n===========================================================`);
    console.log(` 📁 LOCAL DATA FILE RECORDS (orders.json & subscribers.json)`);
    console.log(`===========================================================`);

    const localOrders = readJsonFile('orders.json');
    const localSubscribers = readJsonFile('subscribers.json');

    console.log(`\n📦 Orders (${localOrders.length} records):`);
    if (localOrders.length === 0) {
      console.log(' (No local orders stored yet)');
    } else {
      console.table(localOrders.map(o => ({
        "Order ID": o.id || o.order_id,
        "Customer Name": o.customerName || o.customer_name,
        "Email": o.email || 'N/A',
        "Phone": o.phone || 'N/A',
        "Total Paid": `₹${o.finalPaidAmount || o.totalAmount || 0}`,
        "Payment": o.paymentMethod || 'PhonePe',
        "Status": o.orderStatus || 'Order Received'
      })));
    }

    console.log(`\n👥 Newsletter Subscribers (${localSubscribers.length} records):`);
    if (localSubscribers.length === 0) {
      console.log(' (No local subscribers stored yet)');
    } else {
      console.table(localSubscribers);
    }

    console.log('\n===========================================================');
    console.log('✅ Local Inspection Complete!');
    console.log('===========================================================\n');
    process.exit(0);
  }
}

inspectDatabase();
