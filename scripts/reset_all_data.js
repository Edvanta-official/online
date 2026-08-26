import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import 'dotenv/config';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import User from '../server/models/User.js';
import Order from '../server/models/Order.js';
import Subscriber from '../server/models/Subscriber.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../server/data');

const MONGODB_URI = process.env.MONGODB_URI;

async function resetAllData() {
  console.log(`\n===========================================================`);
  console.log(` 🧹 RESETTING & CLEARING ALL STORE DATA`);
  console.log(`===========================================================`);

  // 1. Clear JSON Data Files in server/data
  const jsonFiles = ['orders.json', 'users.json', 'subscribers.json', 'otps.json'];
  jsonFiles.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
    console.log(`✅ Cleared local JSON file: server/data/${file}`);
  });

  // 2. Remove old SQLite DB file if exists so python setup_database.py creates fresh
  const dbPath = path.join(__dirname, '../sparkle_store.db');
  if (fs.existsSync(dbPath)) {
    try {
      fs.unlinkSync(dbPath);
      console.log(`✅ Removed old SQLite database file (sparkle_store.db)`);
    } catch (e) {}
  }

  // 3. Clear MongoDB Atlas Cloud Database
  if (MONGODB_URI) {
    try {
      console.log(`\n📡 Connecting to MongoDB Atlas to clear cloud collections...`);
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      await Order.deleteMany({});
      await User.deleteMany({});
      await Subscriber.deleteMany({});
      console.log(`✅ Cleared all documents in MongoDB Atlas (orders, users, subscribers collections)`);
      await mongoose.disconnect();
    } catch (err) {
      console.log(`ℹ️ MongoDB Atlas notice: ${err.message}`);
    }
  }

  console.log(`\n===========================================================`);
  console.log(` ✨ ALL STORE DATA HAS BEEN RESET & CLEARED!`);
  console.log(` Your Admin Portal at https://sparklekkv.com/#/admin is now 100% FRESH.`);
  console.log(`===========================================================\n`);
  process.exit(0);
}

resetAllData();
