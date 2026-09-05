import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fetchAllDatabaseOrders } from '../server/db_mysql.js';

dotenv.config();

console.log('\n============================================================');
console.log('   💎 SPARKLE @ KKV LUXURY STORE DATABASE VIEWER (VS CODE)   ');
console.log('============================================================\n');

async function viewDatabase() {
  console.log('📊 1. FETCHING MYSQL DATABASE (`sparkle_store`)...\n');

  try {
    const sqlOrders = await fetchAllDatabaseOrders();
    console.log(`✅ MySQL Connection: SUCCESS`);
    console.log(`📦 Total MySQL Orders Found: ${sqlOrders.length}\n`);

    if (sqlOrders.length > 0) {
      console.log('--- MYSQL ORDERS TABLE SUMMARY ---');
      console.table(sqlOrders.map(o => ({
        OrderID: o.id,
        Customer: o.customerName || o.shippingAddress?.fullName || 'N/A',
        Phone: o.phone || o.shippingAddress?.phone || 'N/A',
        Amount: `₹${o.totalAmount || o.cartTotal || 0}`,
        PaymentMethod: o.paymentMethod || 'PayU',
        PaymentStatus: o.paymentStatus || 'Paid',
        OrderStatus: o.orderStatus || 'Order Received',
        Date: o.createdAt || 'N/A'
      })));
    } else {
      console.log('ℹ️ No orders in MySQL yet.');
    }
  } catch (err) {
    console.log('⚠️ MySQL Database Notice:', err.message);
  }

  console.log('\n------------------------------------------------------------');
  console.log('📂 2. READING LOCAL VS CODE JSON DATABASE FILES...\n');

  const ordersJsonPath = path.resolve('server/data/orders.json');
  const usersJsonPath = path.resolve('server/data/users.json');

  if (fs.existsSync(ordersJsonPath)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(ordersJsonPath, 'utf8'));
      console.log(`📄 File: ${ordersJsonPath}`);
      console.log(`📦 Total JSON File Orders: ${fileData.length}`);
      if (fileData.length > 0) {
        console.table(fileData.slice(0, 10).map(o => ({
          ID: o.id,
          Customer: o.customerName || o.shippingAddress?.fullName,
          Phone: o.phone || o.shippingAddress?.phone,
          Total: `₹${o.finalAmount || o.cartTotal || 0}`,
          Status: o.paymentStatus || 'Paid'
        })));
      }
    } catch (e) {
      console.log('Error reading orders.json:', e.message);
    }
  } else {
    console.log('ℹ️ Local orders.json file not created yet.');
  }

  console.log('');

  if (fs.existsSync(usersJsonPath)) {
    try {
      const usersData = JSON.parse(fs.readFileSync(usersJsonPath, 'utf8'));
      console.log(`📄 File: ${usersJsonPath}`);
      console.log(`👤 Total Registered Customers: ${usersData.length}`);
      if (usersData.length > 0) {
        console.table(usersData.map(u => ({
          ID: u.id || u.user_id,
          Name: u.name || u.full_name,
          Email: u.email,
          Phone: u.phone,
          Role: u.role || 'customer'
        })));
      }
    } catch (e) {
      console.log('Error reading users.json:', e.message);
    }
  } else {
    console.log('ℹ️ Local users.json file not created yet.');
  }

  console.log('\n============================================================');
  console.log('✨ DATABASE INSPECTION COMPLETE!');
  console.log('============================================================\n');
  process.exit(0);
}

viewDatabase();
