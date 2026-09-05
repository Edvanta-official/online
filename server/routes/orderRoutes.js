import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createOrder, getOrderById, getCustomerOrders, updateOrderStatus } from '../services/orderService.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sparkle_kkv_secure_jwt_secret_key_2026';

// Optional Auth Helper to extract user if logged in
const getOptionalUserId = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.id;
    }
  } catch (e) {}
  return null;
};

// POST /api/orders - Create Order
router.post('/', async (req, res) => {
  try {
    const userId = getOptionalUserId(req);
    const {
      customerName,
      name,
      email,
      phone,
      address,
      street,
      city,
      state,
      pincode,
      zipCode,
      country,
      items,
      paymentMethod,
      couponCode
    } = req.body;

    const result = await createOrder({
      userId,
      customerName: customerName || name,
      email,
      phone,
      address: address || street,
      city,
      state,
      pincode: pincode || zipCode,
      country,
      items,
      paymentMethod,
      couponCode
    });

    if (!result.success && result.error) {
      return res.status(result.statusCode || 400).json({ error: result.error });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully in PostgreSQL.',
      order: result.result || result
    });
  } catch (err) {
    console.error('Order Creation Route Error:', err);
    res.status(500).json({ error: err.message || 'Failed to place order.' });
  }
});

// GET /api/orders/my-orders - Logged in customer order list
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const result = await getCustomerOrders(req.user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer orders.' });
  }
});

// GET /api/orders/:id - Order Details
router.get('/:id', async (req, res) => {
  try {
    const result = await getOrderById(req.params.id);
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve order details.' });
  }
});

// PUT /api/orders/:id/status - Update Order Status (Admin protected)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    const { status, reason } = req.body;
    const result = await updateOrderStatus(req.params.id, status, req.user.name || 'ADMIN', reason);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

export default router;
