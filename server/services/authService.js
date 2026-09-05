import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queryPostgres, withTransaction } from '../db_postgres.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sparkle_kkv_secure_jwt_secret_key_2026';

export async function registerUser({ firstName, lastName, email, phone, password, role = 'CUSTOMER' }) {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const cleanFirstName = firstName ? firstName.trim() : '';
  const cleanLastName = lastName ? lastName.trim() : '';

  if (!cleanEmail && !cleanPhone) {
    return { success: false, statusCode: 400, error: 'Email or phone number is required.' };
  }
  if (!password || password.length < 6) {
    return { success: false, statusCode: 400, error: 'Password must be at least 6 characters long.' };
  }

  // Check if user already exists in PostgreSQL
  const existing = await queryPostgres(
    'SELECT id, email, phone FROM users WHERE (email = $1 AND email != \'\') OR (phone = $2 AND phone != \'\')',
    [cleanEmail, cleanPhone]
  );
  if (existing.rows.length > 0) {
    return { success: false, statusCode: 409, error: 'An account with this email or phone number already exists.' };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const insertRes = await queryPostgres(`
    INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_active, email_verified)
    VALUES ($1, $2, $3, $4, $5, $6, true, false)
    RETURNING id, first_name, last_name, email, phone, role, created_at
  `, [cleanFirstName, cleanLastName, cleanEmail, cleanPhone, passwordHash, role]);

  if (!insertRes.success || insertRes.rows.length === 0) {
    return { success: false, statusCode: 500, error: 'Failed to create user account in database.' };
  }

  const user = insertRes.rows[0];

  // Audit login event
  await queryPostgres(`
    INSERT INTO login_events (user_id, event_type, success)
    VALUES ($1, 'ACCOUNT_CREATED', true)
  `, [user.id]);

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  return {
    success: true,
    user: {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim(),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  };
}

export async function loginUser({ email, phone, password, reqInfo = {} }) {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';

  if ((!cleanEmail && !cleanPhone) || !password) {
    return { success: false, statusCode: 400, error: 'Email/Phone and Password are required.' };
  }

  const userRes = await queryPostgres(
    'SELECT * FROM users WHERE (email = $1 AND email != \'\') OR (phone = $2 AND phone != \'\')',
    [cleanEmail, cleanPhone]
  );

  const ipAddress = reqInfo.ip || reqInfo.ipAddress || '127.0.0.1';
  const userAgent = reqInfo.userAgent || 'Unknown Browser';
  const deviceName = reqInfo.device || reqInfo.deviceName || 'Desktop/Mobile';
  const browser = reqInfo.browser || 'Browser';
  const operatingSystem = reqInfo.os || reqInfo.operatingSystem || 'OS';

  if (!userRes.success || userRes.rows.length === 0) {
    // Record failed login audit
    await queryPostgres(`
      INSERT INTO login_events (event_type, ip_address, user_agent, device, browser, operating_system, success)
      VALUES ('LOGIN_FAILED', $1, $2, $3, $4, $5, false)
    `, [ipAddress, userAgent, deviceName, browser, operatingSystem]);
    return { success: false, statusCode: 401, error: 'Invalid email/phone or password.' };
  }

  const user = userRes.rows[0];

  if (!user.is_active) {
    return { success: false, statusCode: 403, error: 'Your account has been deactivated. Please contact support.' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    await queryPostgres(`
      INSERT INTO login_events (user_id, event_type, ip_address, user_agent, device, browser, operating_system, success)
      VALUES ($1, 'LOGIN_FAILED', $2, $3, $4, $5, $6, false)
    `, [user.id, ipAddress, userAgent, deviceName, browser, operatingSystem]);
    return { success: false, statusCode: 401, error: 'Invalid email/phone or password.' };
  }

  // Update last_login_at
  await queryPostgres('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

  // Create session
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const tokenHash = jwt.sign({ id: user.id, token: token.slice(-10) }, JWT_SECRET);

  await queryPostgres(`
    INSERT INTO user_sessions (user_id, session_token_hash, ip_address, user_agent, device_name, browser, operating_system, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, true)
  `, [user.id, tokenHash, ipAddress, userAgent, deviceName, browser, operatingSystem]);

  // Record login event
  await queryPostgres(`
    INSERT INTO login_events (user_id, event_type, ip_address, user_agent, device, browser, operating_system, success)
    VALUES ($1, 'LOGIN', $2, $3, $4, $5, $6, true)
  `, [user.id, ipAddress, userAgent, deviceName, browser, operatingSystem]);

  return {
    success: true,
    user: {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim(),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      lastLoginAt: new Date().toISOString()
    },
    token
  };
}

export async function getUserProfile(userId) {
  const res = await queryPostgres(
    'SELECT id, first_name, last_name, email, phone, role, is_active, email_verified, phone_verified, created_at, last_login_at FROM users WHERE id = $1',
    [userId]
  );
  if (!res.success || res.rows.length === 0) {
    return { success: false, statusCode: 404, error: 'User not found.' };
  }
  const u = res.rows[0];
  return {
    success: true,
    user: {
      id: u.id,
      name: `${u.first_name} ${u.last_name}`.trim(),
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isActive: u.is_active,
      createdAt: u.created_at,
      lastLoginAt: u.last_login_at
    }
  };
}

export async function logoutUser(userId, tokenHash) {
  if (tokenHash) {
    await queryPostgres(
      'UPDATE user_sessions SET is_active = false, logout_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND session_token_hash = $2',
      [userId, tokenHash]
    );
  }
  await queryPostgres(
    'INSERT INTO login_events (user_id, event_type, success) VALUES ($1, \'LOGOUT\', true)',
    [userId]
  );
  return { success: true, message: 'Logged out successfully.' };
}

export default {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser
};
