import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sparklekkvofficial@gmail.com';

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Helper to read JSON file safely
const readJsonFile = (filePath, fallback = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
};

// Helper to write JSON file safely
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Create Nodemailer Transporter
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

  // Gmail SMTP Transport
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS && !process.env.GMAIL_PASS.includes('your_16_character')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  }

  // Automatic Test Transporter for instant zero-config email preview
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
  } catch (e) {
    return null;
  }
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const subscribers = readJsonFile(SUBSCRIBERS_FILE);
  const orders = readJsonFile(ORDERS_FILE);
  res.json({
    status: 'ok',
    service: 'Sparkle @kkv Backend API',
    adminEmail: ADMIN_EMAIL,
    totalSubscribers: subscribers.length,
    totalOrders: orders.length,
    timestamp: new Date().toISOString()
  });
});

// Newsletter Subscription Endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const subscribers = readJsonFile(SUBSCRIBERS_FILE);
    const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());

    const newEntry = {
      id: `SUB-${Date.now()}`,
      email,
      subscribedAt: new Date().toISOString(),
      couponCode: 'SPARKEL10',
      status: 'active'
    };

    if (!existing) {
      subscribers.push(newEntry);
      writeJsonFile(SUBSCRIBERS_FILE, subscribers);
    }

    // Email Notification Setup
    const mailOptions = {
      from: `"Sparkle @kkv Boutique" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🎉 New Subscriber Alert: ${email} is your new subscriber!`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FFF9F5; padding: 24px; border-radius: 16px; border: 2px solid #D4AF7F; max-width: 600px;">
          <h2 style="color: #2C2C2C; font-family: Georgia, serif; margin-top: 0;">🎉 Congratulations!</h2>
          <p style="font-size: 16px; color: #C89B3C; font-weight: bold; margin-bottom: 12px;">This member is your new subscriber: <span style="color: #2C2C2C;">${email}</span></p>
          
          <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #FCE4EC; margin: 16px 0;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Subscriber Email:</strong> <span style="color: #C89B3C; font-weight: bold;">${email}</span></p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Subscription Date:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Issued Promo Code:</strong> <span style="color: #2C2C2C; font-weight: bold; background-color: #FCE4EC; padding: 2px 6px; border-radius: 4px;">SPARKEL10</span> (10% OFF)</p>
          </div>

          <p style="font-size: 12px; color: #888;">Sparkle @kkv Automated Backend Notification Service • Admin: ${ADMIN_EMAIL}</p>
        </div>
      `
    };

    const transporter = await createTransporter();
    let emailSent = false;
    let previewUrl = null;

    if (transporter) {
      try {
        const info = await transporter.sendMail(mailOptions);
        emailSent = true;
        previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log(`[Ethereal Test Email Delivered] Preview URL: ${previewUrl}`);
        } else {
          console.log(`[Gmail SMTP Delivered] Admin notification sent to ${ADMIN_EMAIL} for subscriber ${email}`);
        }
      } catch (mailErr) {
        console.error('[Email Dispatch Error]:', mailErr.message);
      }
    } else {
      console.log(`[Backend Saved] Subscribed email recorded: ${email}. Add GMAIL_USER & GMAIL_PASS to .env for SMTP delivery.`);
    }

    res.status(200).json({
      success: true,
      message: `🎉 Congratulations! Subscription confirmed for ${email}. Admin notified at ${ADMIN_EMAIL}.`,
      subscriber: newEntry,
      emailSent
    });
  } catch (error) {
    console.error('Subscription Endpoint Error:', error);
    res.status(500).json({ error: 'Failed to process subscription.' });
  }
});

// Admin Route: Get All Subscribers
app.get('/api/subscribers', (req, res) => {
  const subscribers = readJsonFile(SUBSCRIBERS_FILE);
  res.json({ count: subscribers.length, subscribers });
});

// Order Creation Endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const orders = readJsonFile(ORDERS_FILE);
    
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    writeJsonFile(ORDERS_FILE, orders);

    // Notify Admin via Email
    const mailOptions = {
      from: `"Sparkle @kkv Boutique" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🛍️ New Order Placed #${newOrder.id} - ₹${newOrder.cartTotal}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FFF9F5; padding: 24px; border-radius: 16px; border: 2px solid #C89B3C;">
          <h2 style="color: #2C2C2C;">🛍️ New Order Received!</h2>
          <p><strong>Order ID:</strong> ${newOrder.id}</p>
          <p><strong>Total Amount:</strong> ₹${newOrder.cartTotal}</p>
          <p><strong>Customer Name:</strong> ${newOrder.shippingAddress?.fullName || 'Guest'}</p>
          <p><strong>Phone:</strong> ${newOrder.shippingAddress?.phone || 'N/A'}</p>
          <p><strong>Payment Method:</strong> ${newOrder.paymentMethod || 'UPI'}</p>
        </div>
      `
    };

    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail(mailOptions);
      } catch (e) {
        console.error('Order Email Error:', e.message);
      }
    }

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process order.' });
  }
});

// Admin Route: Get All Orders
app.get('/api/orders', (req, res) => {
  const orders = readJsonFile(ORDERS_FILE);
  res.json({ count: orders.length, orders });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`
  ✨ Sparkle @kkv Backend Server Running!
  ----------------------------------------
  🚀 Port: ${PORT}
  📧 Admin Email: ${ADMIN_EMAIL}
  🌐 API Base: http://localhost:${PORT}/api
  ----------------------------------------
  `);
});
