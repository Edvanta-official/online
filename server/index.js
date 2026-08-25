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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || 'sparklekkvofficial@gmail.com';

// ============================================================
// DATA DIRECTORY
// ============================================================

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const OTPS_FILE = path.join(DATA_DIR, 'otps.json');

// ============================================================
// JSON HELPERS
// ============================================================

const readJsonFile = (filePath, fallback = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');

      if (!data.trim()) {
        return fallback;
      }

      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }

  return fallback;
};

const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 2),
      'utf8'
    );
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors({ origin: '*' }));
app.use(express.json());

// ============================================================
// EMAIL TRANSPORTER
// ============================================================

const createTransporter = async () => {
  // Custom SMTP
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
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

  // Gmail
  if (
    process.env.GMAIL_USER &&
    process.env.GMAIL_PASS &&
    !process.env.GMAIL_PASS.includes('your_16_character')
  ) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  }

  // Ethereal test email
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
// HEALTH CHECK
// ============================================================

app.get('/api/health', async (req, res) => {
  try {
    const subscribers = readJsonFile(SUBSCRIBERS_FILE);
    const orders = readJsonFile(ORDERS_FILE);

    const [userRows] = await db.execute(
      'SELECT COUNT(*) AS totalUsers FROM users'
    );

    res.json({
      status: 'ok',
      service: 'Sparkle @kkv Backend API',
      adminEmail: ADMIN_EMAIL,
      totalSubscribers: subscribers.length,
      totalOrders: orders.length,
      totalUsers: Number(userRows[0].totalUsers),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Health Check Error:', err);

    res.status(500).json({
      status: 'error',
      error: 'Database health check failed.'
    });
  }
});

// ============================================================
// AUTHENTICATION
// ============================================================

// ============================================================
// REGISTER USER - MYSQL
// ============================================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({
        error: 'Name, Email/Phone, and Password are required.'
      });
    }

    const cleanName = String(name).trim();

    const cleanEmail = email
      ? String(email).trim().toLowerCase()
      : null;

    const cleanPhone = phone
      ? String(phone).replace(/\D/g, '')
      : null;

    // --------------------------------------------------------
    // CHECK EXISTING USER
    // --------------------------------------------------------

    let existingUsers;

    if (cleanEmail && cleanPhone) {
      [existingUsers] = await db.execute(
        `
        SELECT user_id
        FROM users
        WHERE LOWER(email) = ?
           OR REPLACE(
                REPLACE(
                  REPLACE(phone, ' ', ''),
                '-', ''),
              '+', '') = ?
        LIMIT 1
        `,
        [cleanEmail, cleanPhone]
      );
    } else if (cleanEmail) {
      [existingUsers] = await db.execute(
        `
        SELECT user_id
        FROM users
        WHERE LOWER(email) = ?
        LIMIT 1
        `,
        [cleanEmail]
      );
    } else {
      [existingUsers] = await db.execute(
        `
        SELECT user_id
        FROM users
        WHERE REPLACE(
                REPLACE(
                  REPLACE(phone, ' ', ''),
                '-', ''),
              '+', '') = ?
        LIMIT 1
        `,
        [cleanPhone]
      );
    }

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error:
          'An account with this email or phone already exists.'
      });
    }

    // --------------------------------------------------------
    // HASH PASSWORD
    // --------------------------------------------------------

    const passwordHash = await bcrypt.hash(password, 12);

    const userId = `USR-${Date.now()}`;

    // Your current MySQL table has email NOT NULL.
    // For phone-only registration, use an empty string.
    const databaseEmail = cleanEmail || '';

    // --------------------------------------------------------
    // INSERT INTO MYSQL
    // --------------------------------------------------------

    await db.execute(
      `
      INSERT INTO users
      (
        user_id,
        full_name,
        email,
        phone,
        password_hash,
        role,
        auth_method,
        login_count
      )
      VALUES
      (?, ?, ?, ?, ?, 'customer', 'Standard Auth', 0)
      `,
      [
        userId,
        cleanName,
        databaseEmail,
        cleanPhone,
        passwordHash
      ]
    );

    console.log(
      `✅ Customer registered in MySQL: ${userId}`
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
      token: `SPK-TOKEN-${Date.now()}`
    });

  } catch (err) {
    console.error('❌ Registration Error:', err);

    return res.status(500).json({
      error: 'Failed to create user account.'
    });
  }
});

// ============================================================
// LOGIN USER / ADMIN - MYSQL
// ============================================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        error: 'Email/Phone and Password are required.'
      });
    }

    const cleanId = String(identifier)
      .trim()
      .toLowerCase();

    const cleanPhone = String(identifier).replace(
      /\D/g,
      ''
    );

    // ========================================================
    // ADMIN LOGIN
    // ========================================================

    if (
      role === 'admin' ||
      cleanId === 'admin@sparklekkv.com' ||
      cleanId === 'admin'
    ) {
      if (
        password === 'admin123' ||
        password === 'sparkleadmin' ||
        password === 'admin'
      ) {
        const adminUser = {
          id: 'ADM-001',
          name: 'Sparkle Admin @ KKV',
          email: 'admin@sparklekkv.com',
          phone: '+91 9949157771',
          role: 'admin',
          isLoggedIn: true
        };

        return res.json({
          success: true,
          message: 'Admin access granted!',
          user: adminUser,
          token: `SPK-ADMIN-${Date.now()}`
        });
      }

      return res.status(401).json({
        error: 'Invalid Administrator passcode.'
      });
    }

    // ========================================================
    // CUSTOMER LOGIN - MYSQL
    // ========================================================

    let rows;

    if (cleanId.includes('@')) {
      [rows] = await db.execute(
        `
        SELECT
          user_id,
          full_name,
          email,
          phone,
          password_hash,
          role,
          auth_method,
          last_login_at,
          login_count,
          created_at
        FROM users
        WHERE LOWER(email) = ?
        LIMIT 1
        `,
        [cleanId]
      );
    } else {
      [rows] = await db.execute(
        `
        SELECT
          user_id,
          full_name,
          email,
          phone,
          password_hash,
          role,
          auth_method,
          last_login_at,
          login_count,
          created_at
        FROM users
        WHERE REPLACE(
                REPLACE(
                  REPLACE(phone, ' ', ''),
                '-', ''),
              '+', '') = ?
        LIMIT 1
        `,
        [cleanPhone]
      );
    }

    // --------------------------------------------------------
    // USER NOT FOUND
    // --------------------------------------------------------

    if (rows.length === 0) {
      return res.status(401).json({
        error:
          'Account not found. Please create an account first.'
      });
    }

    const user = rows[0];

    // --------------------------------------------------------
    // PASSWORD CHECK
    // --------------------------------------------------------

    if (!user.password_hash) {
      return res.status(401).json({
        error:
          'This account does not have a password configured.'
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordValid) {
      return res.status(401).json({
        error:
          'Incorrect password. Please try again.'
      });
    }

    // --------------------------------------------------------
    // UPDATE LOGIN DETAILS
    // --------------------------------------------------------

    await db.execute(
      `
      UPDATE users
      SET
        last_login_at = CURRENT_TIMESTAMP,
        login_count = COALESCE(login_count, 0) + 1
      WHERE user_id = ?
      `,
      [user.user_id]
    );

    const newLoginCount =
      Number(user.login_count || 0) + 1;

    console.log(
      `✅ Customer login recorded in MySQL: ${user.user_id}`
    );

    // --------------------------------------------------------
    // LOGIN SUCCESS
    // --------------------------------------------------------

    return res.json({
      success: true,
      message: 'Signed in successfully!',
      user: {
        id: user.user_id,
        name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authMethod: user.auth_method,
        lastLoginAt: new Date().toISOString(),
        loginCount: newLoginCount,
        createdAt: user.created_at
      },
      token: `SPK-TOKEN-${Date.now()}`
    });

  } catch (err) {
    console.error('❌ Login Error:', err);

    return res.status(500).json({
      error: 'Authentication failed.'
    });
  }
});

// ============================================================
// SEND OTP
// ============================================================

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { destination } = req.body;

    if (!destination) {
      return res.status(400).json({
        error: 'Email or Mobile Number is required.'
      });
    }

    const cleanDestination = String(destination).trim();

    const otpCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otps = readJsonFile(OTPS_FILE);

    otps.push({
      id: `OTP-${Date.now()}`,
      destination: cleanDestination,
      code: otpCode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ).toISOString()
    });

    writeJsonFile(OTPS_FILE, otps);

    // --------------------------------------------------------
    // SEND EMAIL OTP
    // --------------------------------------------------------

    if (cleanDestination.includes('@')) {
      const mailOptions = {
        from:
          `"Sparkle @kkv Security" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
        to: cleanDestination,
        subject:
          `🔑 Your Sparkle @ KKV Security OTP: ${otpCode}`,
        html: `
          <div style="
            font-family: Arial, sans-serif;
            background-color: #FFF9F5;
            padding: 24px;
            border-radius: 16px;
            border: 2px solid #C89B3C;
            max-width: 500px;
            margin: 0 auto;
          ">
            <h2 style="
              color: #2C2C2C;
              font-family: Georgia, serif;
              margin-top: 0;
              text-align: center;
            ">
              Sparkle @ KKV Security OTP
            </h2>

            <p style="
              font-size: 14px;
              color: #555;
              text-align: center;
            ">
              Use the code below to complete your authentication:
            </p>

            <div style="
              background-color: #2C2C2C;
              color: #D4AF7F;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              text-align: center;
              padding: 16px;
              border-radius: 12px;
              margin: 20px 0;
            ">
              ${otpCode}
            </div>

            <p style="
              font-size: 12px;
              color: #888;
              text-align: center;
            ">
              This code will expire in 5 minutes.
              Do not share it with anyone.
            </p>
          </div>
        `
      };

      const transporter = await createTransporter();

      if (transporter) {
        try {
          await transporter.sendMail(mailOptions);
        } catch (mailError) {
          console.error(
            'OTP Mail Error:',
            mailError.message
          );
        }
      }
    }

    return res.json({
      success: true,
      message:
        `Security OTP sent to ${cleanDestination}`,
      otp: otpCode,
      destination: cleanDestination
    });

  } catch (err) {
    console.error('❌ Send OTP Error:', err);

    return res.status(500).json({
      error: 'Failed to send OTP.'
    });
  }
});

// ============================================================
// VERIFY OTP
// ============================================================

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const {
      destination,
      otp,
      name,
      phone,
      email
    } = req.body;

    if (!otp) {
      return res.status(400).json({
        error: 'OTP code is required.'
      });
    }

    const otps = readJsonFile(OTPS_FILE);

    const targetDestination = String(
      destination || email || phone || ''
    ).trim();

    const now = Date.now();

    const validOtp = otps.find(
      (item) =>
        String(item.code) === String(otp) &&
        item.destination.toLowerCase() ===
          targetDestination.toLowerCase() &&
        new Date(item.expiresAt).getTime() > now
    );

    // Keep your existing test OTPs
    const isTestOtp =
      String(otp) === '123456' ||
      String(otp) === '391874';

    if (!validOtp && !isTestOtp) {
      return res.status(400).json({
        error: 'Invalid or expired OTP code.'
      });
    }

    // ========================================================
    // FIND CUSTOMER IN MYSQL
    // ========================================================

    const cleanEmail = email
      ? String(email).trim().toLowerCase()
      : targetDestination.includes('@')
        ? targetDestination.toLowerCase()
        : '';

    const cleanPhone = phone
      ? String(phone).replace(/\D/g, '')
      : !targetDestination.includes('@')
        ? targetDestination.replace(/\D/g, '')
        : '';

    let rows;

    if (cleanEmail) {
      [rows] = await db.execute(
        `
        SELECT
          user_id,
          full_name,
          email,
          phone,
          role,
          auth_method,
          login_count,
          last_login_at,
          created_at
        FROM users
        WHERE LOWER(email) = ?
        LIMIT 1
        `,
        [cleanEmail]
      );
    } else {
      [rows] = await db.execute(
        `
        SELECT
          user_id,
          full_name,
          email,
          phone,
          role,
          auth_method,
          login_count,
          last_login_at,
          created_at
        FROM users
        WHERE REPLACE(
                REPLACE(
                  REPLACE(phone, ' ', ''),
                '-', ''),
              '+', '') = ?
        LIMIT 1
        `,
        [cleanPhone]
      );
    }

    // ========================================================
    // CREATE USER IF OTP USER DOESN'T EXIST
    // ========================================================

    if (rows.length === 0) {
      const userId = `USR-${Date.now()}`;

      const finalName =
        name ||
        (
          cleanEmail
            ? cleanEmail.split('@')[0]
            : 'Sparkle Member'
        );

      await db.execute(
        `
        INSERT INTO users
        (
          user_id,
          full_name,
          email,
          phone,
          password_hash,
          role,
          auth_method,
          login_count
        )
        VALUES (?, ?, ?, ?, NULL, 'customer', 'OTP Auth', 1)
        `,
        [
          userId,
          finalName,
          cleanEmail || '',
          cleanPhone || null
        ]
      );

      console.log(
        `✅ OTP customer saved to MySQL: ${userId}`
      );

      return res.json({
        success: true,
        message: 'OTP verified successfully!',
        user: {
          id: userId,
          name: finalName,
          email: cleanEmail || '',
          phone: cleanPhone || null,
          role: 'customer',
          authMethod: 'OTP Auth'
        },
        token: `SPK-TOKEN-${Date.now()}`
      });
    }

    const user = rows[0];

    // Update OTP login
    await db.execute(
      `
      UPDATE users
      SET
        last_login_at = CURRENT_TIMESTAMP,
        login_count = COALESCE(login_count, 0) + 1
      WHERE user_id = ?
      `,
      [user.user_id]
    );

    return res.json({
      success: true,
      message: 'OTP verified successfully!',
      user: {
        id: user.user_id,
        name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authMethod: user.auth_method,
        loginCount:
          Number(user.login_count || 0) + 1
      },
      token: `SPK-TOKEN-${Date.now()}`
    });

  } catch (err) {
    console.error(
      '❌ Verify OTP Error:',
      err
    );

    return res.status(500).json({
      error: 'OTP verification failed.'
    });
  }
});

// ============================================================
// ADMIN - GET ALL USERS FROM MYSQL
// ============================================================

app.get('/api/auth/users', async (req, res) => {
  try {
    const [users] = await db.execute(
      `
      SELECT
        user_id,
        full_name,
        email,
        phone,
        role,
        auth_method,
        last_login_at,
        login_count,
        created_at
      FROM users
      ORDER BY created_at DESC
      `
    );

    return res.json({
      count: users.length,
      users
    });

  } catch (err) {
    console.error(
      '❌ Get Users Error:',
      err
    );

    return res.status(500).json({
      error: 'Failed to retrieve users.'
    });
  }
});

// ============================================================
// NEWSLETTER SUBSCRIPTION
// ============================================================

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        error: 'Valid email address is required.'
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const subscribers =
      readJsonFile(SUBSCRIBERS_FILE);

    const existing = subscribers.find(
      (s) =>
        s.email &&
        s.email.toLowerCase() === cleanEmail
    );

    const newEntry = {
      id: `SUB-${Date.now()}`,
      email: cleanEmail,
      subscribedAt:
        new Date().toISOString(),
      couponCode: 'SPARKEL10',
      status: 'active'
    };

    if (!existing) {
      subscribers.push(newEntry);
      writeJsonFile(
        SUBSCRIBERS_FILE,
        subscribers
      );
    }

    const mailOptions = {
      from:
        `"Sparkle @kkv Boutique" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject:
        `🎉 New Subscriber Alert: ${cleanEmail} is your new subscriber!`,
      html: `
        <div style="
          font-family: Arial, sans-serif;
          background-color: #FFF9F5;
          padding: 24px;
          border-radius: 16px;
          border: 2px solid #D4AF7F;
          max-width: 600px;
        ">
          <h2 style="color: #2C2C2C;">
            🎉 Congratulations!
          </h2>

          <p style="
            font-size: 16px;
            color: #C89B3C;
            font-weight: bold;
          ">
            This member is your new subscriber:
            <span style="color: #2C2C2C;">
              ${cleanEmail}
            </span>
          </p>

          <div style="
            background-color: #ffffff;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #FCE4EC;
            margin: 16px 0;
          ">
            <p>
              <strong>Subscriber Email:</strong>
              ${cleanEmail}
            </p>

            <p>
              <strong>Subscription Date:</strong>
              ${new Date().toLocaleString()}
            </p>

            <p>
              <strong>Issued Promo Code:</strong>
              SPARKEL10 (10% OFF)
            </p>
          </div>

          <p style="font-size: 12px; color: #888;">
            Sparkle @kkv Automated Backend Notification Service
          </p>
        </div>
      `
    };

    const transporter =
      await createTransporter();

    let emailSent = false;
    let previewUrl = null;

    if (transporter) {
      try {
        const info =
          await transporter.sendMail(
            mailOptions
          );

        emailSent = true;

        previewUrl =
          nodemailer.getTestMessageUrl(info);

        if (previewUrl) {
          console.log(
            `[Ethereal Test Email] ${previewUrl}`
          );
        } else {
          console.log(
            `[Email Sent] Admin notified at ${ADMIN_EMAIL}`
          );
        }
      } catch (mailErr) {
        console.error(
          '[Email Error]:',
          mailErr.message
        );
      }
    }

    return res.status(200).json({
      success: true,
      message:
        `🎉 Congratulations! Subscription confirmed for ${cleanEmail}.`,
      subscriber: newEntry,
      emailSent,
      previewUrl
    });

  } catch (error) {
    console.error(
      'Subscription Endpoint Error:',
      error
    );

    return res.status(500).json({
      error: 'Failed to process subscription.'
    });
  }
});

// ============================================================
// GET SUBSCRIBERS
// ============================================================

app.get('/api/subscribers', (req, res) => {
  const subscribers =
    readJsonFile(SUBSCRIBERS_FILE);

  res.json({
    count: subscribers.length,
    subscribers
  });
});

// ============================================================
// ORDER CREATION
// ============================================================

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body || {};

    const orderId = String(orderData.id || orderData.order_id || `ORD-${Date.now()}`).substring(0, 50);
    const customerName = String(orderData.customerName || orderData.shippingAddress?.fullName || 'Sparkle Customer').substring(0, 100);
    const email = String(orderData.email || orderData.shippingAddress?.email || '').substring(0, 150);
    const phone = String(orderData.phone || orderData.shippingAddress?.phone || '').substring(0, 20);

    let userId = (orderData.userId || orderData.user_id || '').trim();
    if (!userId && (email || phone)) {
      try {
        const [userRows] = await db.execute(
          `SELECT user_id FROM users WHERE (email != '' AND LOWER(email) = ?) OR (phone != '' AND phone = ?) LIMIT 1`,
          [email.toLowerCase(), phone]
        );
        if (userRows.length > 0) {
          userId = userRows[0].user_id;
        }
      } catch (uErr) {}
    }

    const finalUserId = userId ? String(userId).substring(0, 50) : null;

    const totalAmount = Number(orderData.cartSubtotal || orderData.totalAmount || orderData.total_amount || 0) || 0;
    const discountAmount = Number(orderData.discountAmount || orderData.discount || orderData.discount_amount || 0) || 0;
    const finalPaidAmount = Number(orderData.finalAmount || orderData.cartTotal || orderData.final_paid_amount || totalAmount - discountAmount) || 0;
    const paymentMethod = String(orderData.paymentMethod || orderData.payment_method || 'PhonePe').substring(0, 50);
    const paymentStatus = String(orderData.paymentStatus || orderData.payment_status || 'Paid').substring(0, 20);
    const orderStatus = String(orderData.orderStatus || orderData.order_status || 'Order Received').substring(0, 30);
    const utrNumber = String(orderData.utrNumber || orderData.utr_number || `UPI-${Date.now()}`).substring(0, 100);
    const trackingNumber = String(orderData.trackingNumber || orderData.tracking_number || `SPK-IN-${Math.floor(1000000 + Math.random() * 9000000)}`).substring(0, 100);

    const shippingStreet = typeof orderData.shippingAddress?.street === 'string' ? orderData.shippingAddress.street : (typeof orderData.shippingAddress === 'string' ? orderData.shippingAddress : String(orderData.shipping_street || 'Madhapur'));
    const shippingCity = String(orderData.shippingAddress?.city || orderData.shipping_city || 'Hyderabad').substring(0, 100);
    const shippingPincode = String(orderData.shippingAddress?.pincode || orderData.shipping_pincode || '500081').substring(0, 20);
    const estimatedDeliveryDate = String(orderData.estimatedDeliveryDate || orderData.estimated_delivery_date || 'Within 7 Business Days').substring(0, 50);

    console.log(`📦 Processing incoming Order for MySQL: ${orderId} (Customer User ID: ${finalUserId || 'N/A'}) by ${customerName}`);

    // --------------------------------------------------------
    // 1. INSERT INTO MYSQL orders TABLE
    // --------------------------------------------------------
    try {
      await db.execute(
        `INSERT INTO orders (
          order_id, user_id, customer_name, email, phone, total_amount, discount_amount,
          final_paid_amount, payment_method, payment_status, order_status,
          utr_number, tracking_number, shipping_street, shipping_city,
          shipping_pincode, estimated_delivery_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          user_id = VALUES(user_id),
          customer_name = VALUES(customer_name),
          final_paid_amount = VALUES(final_paid_amount),
          payment_status = VALUES(payment_status)`,
        [
          orderId, finalUserId, customerName, email, phone, totalAmount, discountAmount,
          finalPaidAmount, paymentMethod, paymentStatus, orderStatus,
          utrNumber, trackingNumber, shippingStreet, shippingCity,
          shippingPincode, estimatedDeliveryDate
        ]
      );

      // --------------------------------------------------------
      // 2. INSERT INTO MYSQL order_items TABLE
      // --------------------------------------------------------
      const itemsList = Array.isArray(orderData.items) ? orderData.items : (Array.isArray(orderData.order_items) ? orderData.order_items : []);
      
      for (const item of itemsList) {
        const productId = String(item.id || item.product_id || 'SPK-PROD').substring(0, 50);
        const productName = String(item.name || item.product_name || 'Sparkle Jewelry Item').substring(0, 150);
        const selectedSize = String(item.size || item.selected_size || item.selectedSize || 'Standard').substring(0, 20);
        const quantity = Number(item.quantity || 1) || 1;
        const unitPrice = Number(item.price || item.unit_price || 0) || 0;
        const totalItemPrice = unitPrice * quantity;

        await db.execute(
          `INSERT INTO order_items (
            order_id, product_id, product_name, selected_size, quantity, unit_price, total_item_price
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [orderId, productId, productName, selectedSize, quantity, unitPrice, totalItemPrice]
        );
      }

      console.log(`✅ Order & ${itemsList.length} Ordered Items successfully inserted into MySQL! ID: ${orderId}`);
    } catch (mysqlErr) {
      console.error('❌ MySQL Order Insertion Error:', mysqlErr);
    }

    // Fallback JSON persistence
    const orders = readJsonFile(ORDERS_FILE);
    const newOrder = { id: orderId, customerName, email, phone, totalAmount, finalPaidAmount, paymentMethod, paymentStatus, orderStatus, items: orderData.items || [], createdAt: new Date().toISOString() };
    orders.unshift(newOrder);
    writeJsonFile(ORDERS_FILE, orders);

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
      try {
        await transporter.sendMail(mailOptions);
      } catch (e) {}
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed & recorded in MySQL database successfully!',
      orderId,
      order: newOrder
    });

  } catch (err) {
    console.error('Order Endpoint Error:', err);
    return res.status(500).json({ error: 'Failed to process order.' });
  }
});

// ============================================================
// GET ALL ORDERS & ORDERED ITEMS FROM MYSQL
// ============================================================

app.get('/api/orders', async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT 
        o.order_id,
        o.customer_name,
        o.email,
        o.phone,
        o.total_amount,
        o.discount_amount,
        o.final_paid_amount,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.utr_number,
        o.tracking_number,
        o.shipping_street,
        o.shipping_city,
        o.shipping_pincode,
        o.estimated_delivery_date,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
    `);

    const [items] = await db.execute(`
      SELECT item_id, order_id, product_id, product_name, selected_size, quantity, unit_price, total_item_price
      FROM order_items
    `);

    const ordersWithItems = orders.map(ord => ({
      ...ord,
      items: items.filter(itm => itm.order_id === ord.order_id)
    }));

    res.json({
      count: ordersWithItems.length,
      orders: ordersWithItems
    });
  } catch (err) {
    const orders = readJsonFile(ORDERS_FILE);
    res.json({ count: orders.length, orders });
  }
});

// ============================================================
// GET MY ORDERS - LOGGED IN CUSTOMER SCOPED (MYSQL)
// ============================================================

app.get('/api/orders/my-orders', requireAuth, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const customerEmail = req.user.email ? req.user.email.toLowerCase() : '';

    const [orders] = await db.execute(`
      SELECT 
        o.order_id,
        o.customer_id,
        o.customer_name,
        o.email,
        o.phone,
        o.street_address,
        o.city,
        o.pincode,
        o.total_amount,
        o.discount_amount,
        o.final_paid_amount,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.utr_number,
        o.created_at
      FROM orders o
      WHERE o.customer_id = ? OR LOWER(o.email) = ?
      ORDER BY o.created_at DESC
    `, [customerId, customerEmail]);

    const [items] = await db.execute(`
      SELECT id, order_id, product_id, product_name, selected_size, quantity, unit_price, subtotal
      FROM order_items
    `);

    const ordersWithItems = orders.map(ord => ({
      ...ord,
      items: items.filter(itm => itm.order_id === ord.order_id)
    }));

    return res.json({
      success: true,
      count: ordersWithItems.length,
      orders: ordersWithItems
    });
  } catch (err) {
    console.error('❌ My Orders Fetch Error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch customer orders.' });
  }
});

// ============================================================
// GET CURRENT CUSTOMER PROFILE (GET /api/auth/me)
// ============================================================

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const [rows] = await db.execute(
      `SELECT customer_id, full_name, email, phone, created_at FROM customers WHERE customer_id = ? LIMIT 1`,
      [customerId]
    );

    if (rows.length === 0) {
      const [uRows] = await db.execute(
        `SELECT user_id AS customer_id, full_name, email, phone, created_at FROM users WHERE user_id = ? LIMIT 1`,
        [customerId]
      );
      if (uRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Customer account not found.' });
      }
      return res.json({ success: true, customer: uRows[0] });
    }

    return res.json({ success: true, customer: rows[0] });
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
    const customerId = req.user.customer_id;

    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE order_id = ? LIMIT 1`,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];

    // Authorization check: Customer can only view their own order
    if (order.customer_id !== customerId && LOWER(order.email) !== (req.user.email || '').toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to view this order.' });
    }

    const [items] = await db.execute(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    return res.json({ success: true, order: { ...order, items } });
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
    const customerId = req.user.customer_id;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    const status = paymentStatus || 'Paid';

    await db.execute(
      `UPDATE orders SET payment_status = ?, order_status = 'Order Received', utr_number = COALESCE(?, utr_number) WHERE order_id = ? AND customer_id = ?`,
      [status, utrNumber, orderId, customerId]
    );

    await db.execute(
      `UPDATE payments SET payment_status = ?, utr_number = COALESCE(?, utr_number) WHERE order_id = ?`,
      [status, utrNumber, orderId]
    );

    return res.json({
      success: true,
      message: 'Payment Verified & Order Received!',
      orderId,
      paymentStatus: status,
      orderStatus: 'Order Received'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

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