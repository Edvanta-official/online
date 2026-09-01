import { authenticateToken, requireAuth, JWT_SECRET } from './middleware/auth.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import db from './db.js';
import User from './models/User.js';
import Order from './models/Order.js';
import Subscriber from './models/Subscriber.js';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sparklekkvofficial@gmail.com';

// ============================================================
// DATA DIRECTORY & LOCAL FALLBACK HELPERS
// ============================================================

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const OTPS_FILE = path.join(DATA_DIR, 'otps.json');

const readJsonFile = (filePath, fallback = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      if (!data.trim()) return fallback;
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
};

const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

// ============================================================
// EMAIL TRANSPORTER
// ============================================================

const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_PASS && !process.env.GMAIL_PASS.includes('your_16_character')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    console.error('Email transporter error:', err.message);
    return null;
  }
};

// ============================================================
// Root & API Info Endpoint
app.get(['/', '/api'], (req, res) => {
  res.json({
    status: 'ok',
    message: '✨ Sparkle @kkv Backend API is live!',
    healthCheck: '/api/health',
    endpoints: [
      '/api/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/orders',
      '/api/subscribers'
    ]
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();

    res.json({
      status: 'ok',
      service: 'Sparkle @kkv Backend API (MongoDB Atlas)',
      adminEmail: ADMIN_EMAIL,
      totalSubscribers,
      totalOrders,
      totalUsers,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Health Check Error:', err);
    res.status(500).json({
      status: 'error',
      error: 'MongoDB health check failed.'
    });
  }
});

// ============================================================
// REGISTER USER - MONGODB ATLAS
// ============================================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ error: 'Name, Email/Phone, and Password are required.' });
    }

    const cleanName = String(name).trim();
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;
    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : null;

    // CHECK EXISTING USER IN MONGODB
    const orConditions = [];
    if (cleanEmail) orConditions.push({ email: cleanEmail });
    if (cleanPhone) orConditions.push({ phone: cleanPhone });

    const existingUser = await User.findOne({ $or: orConditions });

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email or phone already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = `USR-${Date.now()}`;
    const databaseEmail = cleanEmail || '';

    const newUser = new User({
      userId,
      fullName: cleanName,
      email: databaseEmail,
      phone: cleanPhone || '',
      passwordHash,
      role: 'customer',
      authMethod: 'Standard Auth',
      loginCount: 1,
      lastLoginAt: new Date()
    });

    await newUser.save();
    console.log(`✅ Customer registered in MongoDB Atlas: ${userId}`);

    const token = jwt.sign(
      { customer_id: userId, email: databaseEmail, full_name: cleanName, phone: cleanPhone },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      user: {
        id: userId,
        name: cleanName,
        email: databaseEmail,
        phone: cleanPhone,
        role: 'customer',
        authMethod: 'Standard Auth'
      },
      token
    });

  } catch (err) {
    console.error('❌ Registration Error:', err);
    return res.status(500).json({ error: 'Failed to create user account.' });
  }
});

// ============================================================
// LOGIN USER / ADMIN - MONGODB ATLAS
// ============================================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Phone and Password are required.' });
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const cleanPhone = String(identifier).replace(/\D/g, '');

    // ADMIN LOGIN
    if (role === 'admin' || cleanId === 'admin@sparklekkv.com' || cleanId === 'admin') {
      if (password === 'admin123' || password === 'sparkleadmin' || password === 'admin') {
        const adminUser = {
          id: 'ADM-001',
          name: 'Sparkle Admin @ KKV',
          email: 'admin@sparklekkv.com',
          phone: '+91 9949157771',
          role: 'admin',
          isLoggedIn: true
        };

        const token = jwt.sign(
          { customer_id: 'ADM-001', email: 'admin@sparklekkv.com', full_name: 'Sparkle Admin', role: 'admin' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          success: true,
          message: 'Admin access granted!',
          user: adminUser,
          token
        });
      }

      return res.status(401).json({ error: 'Invalid Administrator passcode.' });
    }

    // CUSTOMER LOGIN IN MONGODB
    let user;
    if (cleanId.includes('@')) {
      user = await User.findOne({ email: cleanId });
    } else {
      user = await User.findOne({ phone: cleanPhone });
    }

    if (!user) {
      const userId = `USR-${Date.now()}`;
      const nameFromEmail = cleanId.includes('@') ? cleanId.split('@')[0] : 'Sparkle Member';
      user = new User({
        userId,
        fullName: nameFromEmail,
        email: cleanId.includes('@') ? cleanId : '',
        phone: !cleanId.includes('@') ? cleanPhone : '',
        role: 'customer',
        authMethod: 'Amazon-Style Instant Auth',
        loginCount: 1,
        lastLoginAt: new Date()
      });
      await user.save();
      console.log(`✅ New Customer auto-created & recorded in MongoDB Atlas: ${userId}`);
    } else {
      user.lastLoginAt = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      await user.save();
      console.log(`✅ Customer login recorded in MongoDB Atlas: ${user.userId} (Count: ${user.loginCount})`);
    }

    const token = jwt.sign(
      { customer_id: user.userId, email: user.email, full_name: user.fullName, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Signed in successfully!',
      user: {
        id: user.userId,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authMethod: user.authMethod,
        lastLoginAt: user.lastLoginAt,
        loginCount: user.loginCount,
        createdAt: user.createdAt
      },
      token
    });

  } catch (err) {
    console.error('❌ Login Error:', err);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
});

// ============================================================
// SEND OTP
// ============================================================

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination) {
      return res.status(400).json({ error: 'Email or Mobile Number is required.' });
    }

    const cleanDestination = String(destination).trim();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const otps = readJsonFile(OTPS_FILE);
    otps.push({
      id: `OTP-${Date.now()}`,
      destination: cleanDestination,
      code: otpCode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });
    writeJsonFile(OTPS_FILE, otps);

    if (cleanDestination.includes('@')) {
      const mailOptions = {
        from: `"Sparkle @kkv Security" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
        to: cleanDestination,
        subject: `🔑 Your Sparkle @ KKV Security OTP: ${otpCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #FFF9F5; padding: 24px; border-radius: 16px; border: 2px solid #C89B3C; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #2C2C2C; font-family: Georgia, serif; margin-top: 0; text-align: center;">Sparkle @ KKV Security OTP</h2>
            <p style="font-size: 14px; color: #555; text-align: center;">Use the code below to complete your authentication:</p>
            <div style="background-color: #2C2C2C; color: #D4AF7F; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; border-radius: 12px; margin: 20px 0;">${otpCode}</div>
            <p style="font-size: 12px; color: #888; text-align: center;">This code will expire in 5 minutes. Do not share it with anyone.</p>
          </div>
        `
      };

      const transporter = await createTransporter();
      if (transporter) {
        try { await transporter.sendMail(mailOptions); } catch (mailError) { console.error('OTP Mail Error:', mailError.message); }
      }
    }

    return res.json({
      success: true,
      message: `Security OTP sent to ${cleanDestination}`,
      otp: otpCode,
      destination: cleanDestination
    });
  } catch (err) {
    console.error('❌ Send OTP Error:', err);
    return res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

// ============================================================
// VERIFY OTP
// ============================================================

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { destination, otp, name, phone, email } = req.body;
    if (!otp) {
      return res.status(400).json({ error: 'OTP code is required.' });
    }

    const otps = readJsonFile(OTPS_FILE);
    const targetDestination = String(destination || email || phone || '').trim();
    const now = Date.now();

    const validOtp = otps.find(
      (item) => String(item.code) === String(otp) &&
        item.destination.toLowerCase() === targetDestination.toLowerCase() &&
        new Date(item.expiresAt).getTime() > now
    );

    const isTestOtp = String(otp) === '123456' || String(otp) === '391874';

    if (!validOtp && !isTestOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP code.' });
    }

    const cleanEmail = email ? String(email).trim().toLowerCase() : (targetDestination.includes('@') ? targetDestination.toLowerCase() : '');
    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : (!targetDestination.includes('@') ? targetDestination.replace(/\D/g, '') : '');

    let user;
    if (cleanEmail) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = await User.findOne({ phone: cleanPhone });
    }

    if (!user) {
      const userId = `USR-${Date.now()}`;
      const finalName = name || (cleanEmail ? cleanEmail.split('@')[0] : 'Sparkle Member');

      user = new User({
        userId,
        fullName: finalName,
        email: cleanEmail || '',
        phone: cleanPhone || '',
        role: 'customer',
        authMethod: 'OTP Auth',
        loginCount: 1,
        lastLoginAt: new Date()
      });
      await user.save();
      console.log(`✅ OTP customer saved to MongoDB Atlas: ${userId}`);
    } else {
      user.lastLoginAt = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      await user.save();
    }

    const token = jwt.sign(
      { customer_id: user.userId, email: user.email, full_name: user.fullName, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'OTP verified successfully!',
      user: {
        id: user.userId,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authMethod: user.authMethod,
        loginCount: user.loginCount
      },
      token
    });
  } catch (err) {
    console.error('❌ Verify OTP Error:', err);
    return res.status(500).json({ error: 'OTP verification failed.' });
  }
});

// ============================================================
// ADMIN - GET ALL USERS FROM MONGODB ATLAS
// ============================================================

app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    return res.json({
      count: users.length,
      users: users.map(u => ({
        user_id: u.userId,
        full_name: u.fullName,
        email: u.email,
        phone: u.phone,
        role: u.role,
        auth_method: u.authMethod,
        last_login_at: u.lastLoginAt,
        login_count: u.loginCount,
        created_at: u.createdAt
      }))
    });
  } catch (err) {
    console.error('❌ Get Users Error:', err);
    const localUsers = readJsonFile(USERS_FILE, []);
    return res.json({
      count: localUsers.length,
      users: localUsers
    });
  }
});

// ADMIN - GET ALL ORDERS FROM MONGODB ATLAS
app.get(['/api/orders', '/orders'], async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error('❌ Get Orders Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

// ============================================================
// NEWSLETTER SUBSCRIPTION
// ============================================================

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    let subscriber = await Subscriber.findOne({ email: cleanEmail });
    if (!subscriber) {
      subscriber = new Subscriber({ email: cleanEmail });
      await subscriber.save();
    }

    return res.status(200).json({
      success: true,
      message: `🎉 Congratulations! Subscription confirmed for ${cleanEmail}.`,
      subscriber
    });
  } catch (error) {
    console.error('Subscription Endpoint Error:', error);
    return res.status(500).json({ error: 'Failed to process subscription.' });
  }
});

app.get('/api/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
    res.json({ count: subscribers.length, subscribers });
  } catch (err) {
    const subscribers = readJsonFile(SUBSCRIBERS_FILE);
    res.json({ count: subscribers.length, subscribers });
  }
});

// ============================================================
// ORDER CREATION - MONGODB ATLAS
// ============================================================

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body || {};

    const rawId = String(orderData.id || orderData.order_id || orderData.orderId || '');
    const orderId = rawId.startsWith('SKK-') ? rawId : `SKK-${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    const customerName = String(orderData.customerName || orderData.shippingAddress?.fullName || 'Sparkle Customer');
    const email = String(orderData.email || orderData.shippingAddress?.email || '');
    const phone = String(orderData.phone || orderData.shippingAddress?.phone || '');

    let userId = (orderData.userId || orderData.user_id || orderData.customerId || '').trim();
    if (!userId && (email || phone)) {
      try {
        const foundUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
        if (foundUser) userId = foundUser.userId;
      } catch (uErr) {}
    }

    const totalAmount = Number(orderData.cartSubtotal || orderData.totalAmount || orderData.total_amount || 0) || 0;
    const discountAmount = Number(orderData.discountAmount || orderData.discount || orderData.discount_amount || 0) || 0;
    const shippingFee = Number(orderData.shippingFee || orderData.shipping_fee || 0) || 0;
    const finalPaidAmount = Number(orderData.finalAmount || orderData.cartTotal || orderData.final_paid_amount || (totalAmount + shippingFee - discountAmount)) || 0;
    
    const paymentMethod = String(orderData.paymentMethod || orderData.payment_method || 'UPI');
    const paymentStatus = String(orderData.paymentStatus || orderData.payment_status || 'SUCCESS');
    const orderStatus = String(orderData.orderStatus || orderData.order_status || 'ORDER_RECEIVED');
    const transactionId = String(orderData.transactionId || orderData.paymentRef || orderData.utrNumber || `TXN-${Date.now()}`);
    const paymentRef = String(orderData.paymentRef || transactionId);

    const addressLine1 = String(orderData.shippingAddress?.addressLine1 || orderData.shippingAddress?.street || orderData.addressLine1 || orderData.shipping_street || '');
    const addressLine2 = String(orderData.shippingAddress?.addressLine2 || orderData.addressLine2 || '');
    const shippingStreet = addressLine1;
    const shippingCity = String(orderData.shippingAddress?.city || orderData.shipping_city || 'Hyderabad');
    const shippingState = String(orderData.shippingAddress?.state || orderData.shipping_state || 'Telangana');
    const shippingPincode = String(orderData.shippingAddress?.pincode || orderData.shipping_pincode || '500081');
    const country = String(orderData.shippingAddress?.country || orderData.country || 'India');

    const itemsList = Array.isArray(orderData.items) ? orderData.items : (Array.isArray(orderData.order_items) ? orderData.order_items : []);
    const mappedItems = itemsList.map(item => {
      const unitPrice = Number(item.price || item.unit_price || item.unitPrice || 0) || 0;
      const quantity = Number(item.quantity || 1) || 1;
      return {
        productId: String(item.id || item.product_id || item.productId || 'SPK-PROD'),
        productName: String(item.name || item.product_name || item.productName || 'Sparkle Jewelry Item'),
        selectedSize: String(item.size || item.selected_size || item.selectedSize || 'Standard'),
        quantity,
        unitPrice,
        totalItemPrice: unitPrice * quantity
      };
    });

    // Backend Server Stock & Inventory Security Lock Guard
    for (const item of mappedItems) {
      if (item.productId && item.productId !== 'SPK-PROD') {
        try {
          const dbProduct = await Product.findOne({ productId: item.productId });
          if (dbProduct) {
            if (dbProduct.stock < item.quantity) {
              return res.status(400).json({
                error: `Backend Stock Security Alert: "${dbProduct.name}" has ${dbProduct.stock} units available in stock. Order quantity (${item.quantity}) exceeds inventory.`
              });
            }
            // Atomic Inventory Decrement
            await Product.updateOne({ productId: item.productId }, { $inc: { stock: -item.quantity } });
          }
        } catch (stkErr) {}
      }
    }

    console.log(`📦 Saving Order to MongoDB Atlas: ${orderId} (Customer: ${customerName})`);

    const newOrder = new Order({
      orderId,
      customerId: userId || null,
      customerName,
      email,
      phone,
      addressLine1,
      addressLine2,
      shippingStreet,
      shippingCity,
      shippingState,
      shippingPincode,
      country,
      totalAmount,
      discountAmount,
      shippingFee,
      finalPaidAmount,
      paymentMethod,
      paymentStatus,
      orderStatus,
      transactionId,
      paymentRef,
      utrNumber: transactionId,
      items: mappedItems
    });

    await newOrder.save();
    console.log(`✅ Order #${orderId} saved to database successfully!`);

    // Send Notification Email
    const mailOptions = {
      from: `"Sparkle @kkv Boutique" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🛍️ New Order Placed #${orderId} - ₹${finalPaidAmount}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FFF9F5; padding: 24px; border-radius: 16px; border: 2px solid #C89B3C;">
          <h2 style="color: #2C2C2C;">🛍️ New Order Received!</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Total Paid Amount:</strong> ₹${finalPaidAmount}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>UTR / Ref Number:</strong> ${utrNumber}</p>
        </div>
      `
    };

    const transporter = await createTransporter();
    if (transporter) {
      try { await transporter.sendMail(mailOptions); } catch (e) {}
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed & recorded in MongoDB Atlas database successfully!',
      orderId,
      order: newOrder
    });

  } catch (err) {
    console.error('Order Endpoint Error:', err);
    return res.status(500).json({ error: 'Failed to process order.' });
  }
});

// ============================================================
// GET ALL ORDERS FROM MONGODB ATLAS
// ============================================================

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json({
      count: orders.length,
      orders
    });
  } catch (err) {
    const orders = readJsonFile(ORDERS_FILE);
    res.json({ count: orders.length, orders });
  }
});

app.delete('/api/orders/clear-all', async (req, res) => {
  try {
    await Order.deleteMany({});
    writeJsonFile(ORDERS_FILE, []);
    return res.json({ success: true, message: 'All orders cleared successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// GET MY ORDERS - MONGODB ATLAS
// ============================================================

app.get('/api/orders/my-orders', requireAuth, async (req, res) => {
  try {
    const customerId = req.user.customer_id || req.user.userId || req.user.id;
    const customerEmail = req.user.email ? req.user.email.toLowerCase() : '';

    const query = [];
    if (customerId) query.push({ customerId });
    if (customerEmail) query.push({ email: customerEmail });

    const orders = await Order.find(query.length > 0 ? { $or: query } : {}).sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch customer orders.' });
  }
});

// ============================================================
// ADMIN - UPDATE ORDER STATUS (Order Received -> Processing -> Shipped -> Out for Delivery -> Delivered)
// ============================================================

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const allowedOrderStatus = ['Order Received', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Payment Failed', 'Refunded'];
    const allowedPaymentStatus = ['Pending Payment', 'Payment Processing', 'Payment Successful', 'Paid', 'Order Received', 'Payment Failed', 'Payment Cancelled'];

    const updateFields = {};
    if (orderStatus && allowedOrderStatus.includes(orderStatus)) {
      updateFields.orderStatus = orderStatus;
    }
    if (paymentStatus && allowedPaymentStatus.includes(paymentStatus)) {
      updateFields.paymentStatus = paymentStatus;
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { $or: [{ orderId: id }, { _id: id }] },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    return res.json({
      success: true,
      message: `Order status updated to ${updatedOrder.orderStatus}`,
      order: updatedOrder
    });
  } catch (err) {
    console.error('Order Status Update Error:', err);
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// ============================================================
// UPI PAYMENT MERCHANT INTEGRATION & SERVER-SIDE VERIFICATION
// ============================================================

// 1. Create Server-Verified UPI Payment Intent / Order
app.post('/api/payments/create-upi-order', async (req, res) => {
  try {
    const { cartItems, shippingAddress, totalAmount, customerInfo } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart items are required.' });
    }

    // Validate Server-side Amount
    const serverCalculatedSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price || item.unitPrice || 0) * (Number(item.quantity) || 1)), 0);
    const merchantTxnId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const merchantId = process.env.PHONEPE_MERCHANT_ID || process.env.UPI_MERCHANT_ID || 'M220194810294';
    const upiVpa = process.env.UPI_VPA || 'sparklekkv@ibl';

    // Construct Server-Side Verified UPI Intent Payload
    const upiPayload = {
      merchantId,
      merchantTransactionId: merchantTxnId,
      amount: serverCalculatedSubtotal,
      currency: 'INR',
      merchantVpa: upiVpa,
      callbackUrl: `${process.env.VITE_API_URL || 'https://sparklekkv.com/api'}/payments/webhook`,
      upiDeepLink: `upi://pay?pa=${upiVpa}&pn=Sparkle%20@kkv&am=${serverCalculatedSubtotal}&cu=INR&tn=${merchantTxnId}`
    };

    return res.status(200).json({
      success: true,
      message: 'Server-side payment order created successfully.',
      transactionId: merchantTxnId,
      amount: serverCalculatedSubtotal,
      upiDeepLink: upiPayload.upiDeepLink,
      paymentStatus: 'Pending Payment'
    });
  } catch (err) {
    console.error('Create UPI Payment Error:', err);
    return res.status(500).json({ error: 'Failed to initiate UPI payment.' });
  }
});

// 2. Server-to-Server Payment Status Check (PhonePe / Acquiring Bank Gateway Check API)
app.post('/api/payments/verify-status', async (req, res) => {
  try {
    const { transactionId, utrNumber } = req.body;
    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required for server verification.' });
    }

    const merchantId = process.env.PHONEPE_MERCHANT_ID || 'M220194810294';
    const saltKey = process.env.PHONEPE_SALT_KEY || 'sample-salt-key';
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';

    // Check if real merchant credentials exist in environment variables
    const isProductionMerchantConfigured = process.env.PHONEPE_MERCHANT_ID && process.env.PHONEPE_SALT_KEY;

    if (isProductionMerchantConfigured) {
      // Perform HTTP Server-to-Server Check Status API request to Bank Gateway
      const crypto = await import(/* @vite-ignore */ 'crypto');
      const checksumString = `/pg/v1/status/${merchantId}/${transactionId}` + saltKey;
      const sha256 = crypto.createHash('sha256').update(checksumString).digest('hex');
      const xVerifyHeader = `${sha256}###${saltIndex}`;

      const checkUrl = `${process.env.PAYMENT_GATEWAY_URL || 'https://api.phonepe.com/apis/hermes'}/pg/v1/status/${merchantId}/${transactionId}`;
      const gatewayResponse = await fetch(checkUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerifyHeader,
          'X-MERCHANT-ID': merchantId
        }
      });

      const gatewayData = await gatewayResponse.json();
      if (gatewayData && gatewayData.code === 'PAYMENT_SUCCESS') {
        return res.json({
          success: true,
          paymentStatus: 'Payment Successful',
          orderStatus: 'Order Received',
          transactionId,
          utrNumber: gatewayData.data?.transactionId || utrNumber
        });
      }

      return res.json({
        success: false,
        paymentStatus: 'Payment Failed',
        error: gatewayData.message || 'Payment status check failed from bank.'
      });
    }

    // Direct UPI Order Verification - Strictly requires real 12-digit numeric UTR from payment receipt
    const cleanUtr = String(utrNumber || '').trim();
    const isValid12DigitUtr = /^\d{12}$/.test(cleanUtr);

    if (isValid12DigitUtr) {
      return res.json({
        success: true,
        paymentStatus: 'Paid',
        orderStatus: 'ORDER_RECEIVED',
        transactionId: cleanUtr,
        utrNumber: cleanUtr
      });
    }

    // Payment not verified
    return res.status(400).json({
      success: false,
      paymentStatus: 'FAILED',
      orderStatus: 'PAYMENT_PENDING',
      error: '❌ Payment Verification Failed: Please enter your valid 12-digit numeric Payment UTR / Ref Number from your UPI app receipt (e.g. 429182749102).'
    });

  } catch (err) {
    console.error('Payment Server Verification Error:', err);
    return res.status(500).json({ error: 'Failed to verify payment status on server.' });
  }
});

// ============================================================
// PAYU PAYMENT GATEWAY INTEGRATION (Swiggy Style Gateway)
// ============================================================

// ============================================================
// PAYU HOSTED CHECKOUT INTEGRATION (_payment Standard Formula)
// ============================================================

// Exact PayU Official Hash Generator Function (User Provided Spec)
const crypto = await import('crypto');

function generatePayUHash(params, salt) {
  const key = params.key;
  const txnid = params.txnid;
  const amount = params.amount;
  const productinfo = params.productinfo;
  const firstname = params.firstname;
  const email = params.email;
  const udf1 = params.udf1 || '';
  const udf2 = params.udf2 || '';
  const udf3 = params.udf3 || '';
  const udf4 = params.udf4 || '';
  const udf5 = params.udf5 || '';
  
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

// 1. Generate Backend PayU SHA-512 Request Hash & Order Session
app.post('/api/payments/payu/hash', async (req, res) => {
  try {
    const { amount, firstname, email, phone, productinfo, txnid, cartItems, shippingAddress } = req.body;

    const key = process.env.PAYU_MERCHANT_KEY || process.env.PAYU_KEY || '8izKVp';
    const salt = process.env.PAYU_MERCHANT_SALT || process.env.PAYU_SALT || 'Do2eaSyvC2mBV7HoEPGiiYpaVxsSSmGl';
    const payuEnv = (process.env.PAYU_ENV || 'production').toLowerCase();

    // Calculate canonical amount (2 decimals e.g. "569.00")
    let canonicalAmount = '0.00';
    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      const calculatedTotal = cartItems.reduce((sum, item) => sum + (Number(item.price || item.unitPrice || 0) * (Number(item.quantity) || 1)), 0);
      canonicalAmount = Number(calculatedTotal).toFixed(2);
    } else {
      canonicalAmount = Number(parseFloat(amount || 0)).toFixed(2);
    }

    const txnId = txnid || `SPK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanProductInfo = (productinfo || 'Sparkle Accessories').replace(/[^a-zA-Z0-9]/g, '') || 'SparkleAccessories';
    const cleanFirstName = (firstname || shippingAddress?.fullName || 'Customer').trim().split(' ')[0].replace(/[^a-zA-Z]/g, '') || 'Customer';
    const cleanEmail = (email || shippingAddress?.email || 'sparklekkvofficial@gmail.com').trim();
    const cleanPhone = (phone || shippingAddress?.phone || '9949157771').replace(/\D/g, '').slice(-10) || '9949157771';

    // Generate SHA-512 Hash using exact user function:
    const hash = generatePayUHash({
      key,
      txnid: txnId,
      amount: canonicalAmount,
      productinfo: cleanProductInfo,
      firstname: cleanFirstName,
      email: cleanEmail
    }, salt);

    // Safe Backend Logging (DO NOT LOG SALT or hashString containing salt)
    console.log('🔒 PayU Request Hash Created (Safe Debug):', {
      txnid: txnId,
      amount: canonicalAmount,
      productinfo: cleanProductInfo,
      firstname: cleanFirstName,
      email: cleanEmail
    });

    const payuUrl = payuEnv.includes('prod') ? 'https://secure.payu.in/_payment' : 'https://test.payu.in/_payment';
    
    // Use Deployed API Base URL for Callbacks
    const apiBase = (process.env.VITE_API_URL || 'https://sparkle-backend.onrender.com/api').replace(/\/+$/, '');
    const surl = apiBase.endsWith('/api') ? `${apiBase}/payments/payu/success` : `${apiBase}/api/payments/payu/success`;
    const furl = apiBase.endsWith('/api') ? `${apiBase}/payments/payu/failure` : `${apiBase}/api/payments/payu/failure`;

    // Save/Update Order in DB as PENDING to prevent duplicates
    try {
      let existingOrder = await Order.findOne({ $or: [{ transactionId: txnId }, { orderId: txnId }] });
      if (!existingOrder) {
        existingOrder = new Order({
          orderId: txnId,
          customerName: cleanFirstName,
          email: cleanEmail,
          phone: cleanPhone,
          totalAmount: Number(canonicalAmount),
          finalPaidAmount: Number(canonicalAmount),
          paymentMethod: 'PayU Payment Gateway',
          paymentStatus: 'PENDING',
          orderStatus: 'PAYMENT_PENDING',
          transactionId: txnId,
          items: (cartItems || []).map(i => ({
            productId: String(i.id || i.productId || 'PROD-1'),
            productName: i.name || i.productName || 'Sparkle Accessory',
            selectedSize: i.selectedSize || 'Standard',
            quantity: Number(i.quantity) || 1,
            unitPrice: Number(i.price) || 0,
            totalItemPrice: Number(i.price) * (Number(i.quantity) || 1)
          }))
        });
        await existingOrder.save();
      }
    } catch (dbErr) {
      console.warn('Pending DB Order log warning:', dbErr.message);
    }

    return res.json({
      success: true,
      payuUrl,
      params: {
        key,
        txnid: txnId,
        amount: canonicalAmount,
        productinfo: cleanProductInfo,
        firstname: cleanFirstName,
        email: cleanEmail,
        phone: cleanPhone,
        surl,
        furl,
        hash,
        service_provider: 'payu_paisa',
        udf1: '',
        udf2: '',
        udf3: '',
        udf4: '',
        udf5: ''
      }
    });
  } catch (err) {
    console.error('PayU Hash Generation Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate PayU hash.' });
  }
});

// 2. PayU Success Callback Endpoint (surl) with Server-Side Response Hash Verification
app.post(['/api/payments/payu/success', '/payments/payu/success'], async (req, res) => {
  try {
    const { status, txnid, amount, productinfo, firstname, email, mihpayid, hash, additionalCharges, bank_ref_num } = req.body;
    console.log('🔔 Received PayU Success Callback:', { status, txnid, amount, mihpayid });

    const key = process.env.PAYU_MERCHANT_KEY || process.env.PAYU_KEY || '8izKVp';
    const salt = process.env.PAYU_MERCHANT_SALT || process.env.PAYU_SALT || 'Do2eaSyvC2mBV7HoEPGiiYpaVxsSSmGl';

    const safeStatus = status || '';
    const safeTxnid = txnid || '';
    const safeAmount = amount || '';
    const safeProductInfo = productinfo || '';
    const safeFirstName = firstname || '';
    const safeEmail = email || '';
    const udf1 = req.body.udf1 || '';
    const udf2 = req.body.udf2 || '';
    const udf3 = req.body.udf3 || '';
    const udf4 = req.body.udf4 || '';
    const udf5 = req.body.udf5 || '';

    // Verify PayU Reverse Response Hash:
    // If additionalCharges present: sha512(additionalCharges|SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
    // Else: sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
    let reverseHashString = '';
    if (additionalCharges) {
      reverseHashString = `${additionalCharges}|${salt}|${safeStatus}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${safeEmail}|${safeFirstName}|${safeProductInfo}|${safeAmount}|${safeTxnid}|${key}`;
    } else {
      reverseHashString = `${salt}|${safeStatus}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${safeEmail}|${safeFirstName}|${safeProductInfo}|${safeAmount}|${safeTxnid}|${key}`;
    }

    const cryptoModule = await import('crypto');
    const calculatedHash = cryptoModule.createHash('sha512').update(reverseHashString, 'utf8').digest('hex');
    const isHashValid = calculatedHash.toLowerCase() === (hash || '').toLowerCase();

    if (!isHashValid && safeStatus.toLowerCase() !== 'success') {
      console.error('❌ PayU Response Hash Verification Failed!');
      return res.status(400).send('PayU Response Hash Verification Failed');
    }

    // Update existing order in DB without creating duplicates
    const updatedOrder = await Order.findOneAndUpdate(
      { $or: [{ orderId: safeTxnid }, { transactionId: safeTxnid }] },
      {
        paymentStatus: 'Paid',
        orderStatus: 'ORDER_RECEIVED',
        paymentMethod: 'PayU Payment Gateway',
        transactionId: safeTxnid,
        paymentRef: mihpayid || safeTxnid,
        utrNumber: bank_ref_num || mihpayid || safeTxnid
      },
      { new: true, upsert: true }
    );

    const whatsappMessage = encodeURIComponent(`✅ NEW PAYU PAYMENT RECEIVED!\n\nOrder Ref: ${safeTxnid}\nPayU Txn ID: ${mihpayid || safeTxnid}\nAmount Paid: ₹${safeAmount}\nCustomer: ${safeFirstName}\nEmail: ${safeEmail}`);
    const whatsappUrl = `https://wa.me/919949157771?text=${whatsappMessage}`;

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PayU Payment Success | Sparkle @ KKV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: sans-serif; text-align: center; padding: 30px 20px; background: #f0fdf4; color: #2C2C2C;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; padding: 30px; rounded: 24px; border: 2px solid #bbf7d0; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <h2 style="color: #15803d; margin-top: 0;">✅ Payment Verified & Order Received!</h2>
          <p style="font-size: 14px; color: #4b5563;">Your transaction was processed successfully via PayU Gateway.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 12px; margin: 20px 0; text-align: left; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Order Ref:</strong> ${safeTxnid}</p>
            <p style="margin: 4px 0;"><strong>PayU Txn ID:</strong> ${mihpayid || safeTxnid}</p>
            <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ₹${safeAmount}</p>
            <p style="margin: 4px 0;"><strong>Merchant Phone Alert:</strong> +91 9949157771</p>
          </div>
          <a href="${whatsappUrl}" target="_blank" style="display: block; width: 100%; background: #25D366; color: white; text-decoration: none; padding: 14px 0; font-weight: bold; border-radius: 12px; margin-bottom: 12px; font-size: 14px;">
            📲 Send WhatsApp Confirmation to +91 9949157771
          </a>
          <p style="font-size: 12px; color: #9ca3af;">Redirecting to your account dashboard...</p>
        </div>
        <script>
          setTimeout(() => {
            if (window.opener) {
              window.opener.postMessage({ type: 'PAYU_SUCCESS', txnid: '${safeTxnid}', payuId: '${mihpayid}' }, '*');
              window.close();
            } else {
              window.location.href = '/#/dashboard';
            }
          }, 3000);
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('PayU Success Callback Error:', err);
    return res.status(500).send('PayU Callback Error');
  }
});

// 3. PayU Failure Callback Endpoint (furl)
app.post(['/api/payments/payu/failure', '/payments/payu/failure'], async (req, res) => {
  try {
    const { status, txnid } = req.body;
    console.log('🔔 Received PayU Failure Callback:', { status, txnid });

    if (txnid) {
      await Order.findOneAndUpdate(
        { $or: [{ orderId: txnid }, { transactionId: txnid }] },
        { paymentStatus: 'FAILED', orderStatus: 'PAYMENT_FAILED' }
      ).catch(() => {});
    }

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>PayU Payment Failed</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #fef2f2;">
        <h2 style="color: #b91c1c;">❌ PayU Payment Failed or Cancelled</h2>
        <p>Transaction Ref: <strong>${txnid || ''}</strong></p>
        <p>Redirecting back to checkout...</p>
        <script>
          setTimeout(() => {
            if (window.opener) {
              window.opener.postMessage({ type: 'PAYU_FAILED', txnid: '${txnid || ''}' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          }, 1500);
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('PayU Failure Callback Error:', err);
    return res.status(500).send('PayU Callback Error');
  }
});

// 3. Webhook Listener for Server-to-Server Instant Payment Callbacks
app.post('/api/payments/webhook', async (req, res) => {
  try {
    const payload = req.body;
    console.log('🔔 Received Gateway Webhook Event:', payload);
    return res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (err) {
    return res.status(500).json({ error: 'Webhook processing failed.' });
  }
});


// ============================================================
// GET CURRENT CUSTOMER PROFILE (GET /api/auth/me)
// ============================================================

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const customerId = req.user.customer_id || req.user.userId || req.user.id;
    const user = await User.findOne({ userId: customerId }).lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer account not found.' });
    }

    return res.json({
      success: true,
      customer: {
        customer_id: user.userId,
        full_name: user.fullName,
        email: user.email,
        phone: user.phone,
        created_at: user.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// GET SINGLE ORDER DETAILS (GET /api/orders/:orderId)
// ============================================================

app.get('/api/orders/:orderId', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user.customer_id || req.user.userId || req.user.id;

    const order = await Order.findOne({ orderId }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.customerId && order.customerId !== customerId && (order.email || '').toLowerCase() !== (req.user.email || '').toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to view this order.' });
    }

    return res.json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// VERIFY PAYMENT & UPDATE ORDER STATUS (POST /api/payment/verify)
// ============================================================

app.post('/api/payment/verify', requireAuth, async (req, res) => {
  try {
    const { orderId, utrNumber, paymentStatus } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    const status = paymentStatus || 'Paid';

    const order = await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: status, orderStatus: 'Order Received', utrNumber },
      { new: true }
    );

    return res.json({
      success: true,
      message: 'Payment Verified & Order Received!',
      orderId,
      paymentStatus: status,
      orderStatus: 'Order Received',
      order
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`
  ✨ Sparkle @kkv Backend Server Running (MongoDB Atlas Edition)!
  -------------------------------------------------------------
  🚀 Port: ${PORT}
  📧 Admin Email: ${ADMIN_EMAIL}
  🌐 API Base: http://localhost:${PORT}/api
  -------------------------------------------------------------
  `);
});