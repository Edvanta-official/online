import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../server/models/User.js';
import Order from '../server/models/Order.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sparkle_store';

async function inspectDatabase() {
  try {
    console.log(`\n🔍 Connecting to MongoDB Atlas: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!\n');

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

      console.log(`\n-----------------------------------------------------------`);
      console.log(` 📦 BREAKDOWN OF ORDERED ITEMS:`);
      console.log(`-----------------------------------------------------------`);
      orders.forEach(o => {
        console.log(`\n▶ Order #${o.orderId} (${o.customerName}):`);
        if (o.items && o.items.length > 0) {
          console.table(o.items.map(item => ({
            "Product ID": item.productId,
            "Product Name": item.productName,
            "Size": item.selectedSize,
            "Qty": item.quantity,
            "Unit Price": `₹${item.unitPrice}`,
            "Subtotal": `₹${item.totalItemPrice}`
          })));
        } else {
          console.log('  No items listed in order.');
        }
      });
    }

    console.log('\n===========================================================');
    console.log('✅ Inspection Complete!');
    console.log('===========================================================\n');

  } catch (error) {
    console.error('❌ Error inspecting MongoDB database:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

inspectDatabase();
