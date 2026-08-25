import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sparkle_kkv_luxury_secret_key_2026_jwt';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    // Optional fallback for guest user if endpoint supports public access
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.warn('⚠️ Invalid or expired JWT token:', err.message);
      req.user = null;
    } else {
      req.user = user; // { customer_id, email, full_name, phone }
    }
    next();
  });
};

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to your account.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.'
      });
    }
    req.user = user;
    next();
  });
};

export { JWT_SECRET };
