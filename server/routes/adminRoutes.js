import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  getAdminDashboardStats, 
  getLiveCustomersList, 
  getCustomerDetailsWithOrders, 
  getAllAdminOrders 
} from '../services/adminService.js';
import { getOrderById } from '../services/orderService.js';

const router = express.Router();

// Middleware to ensure Admin role
const requireAdminRole = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
};

// Apply auth & admin check to all admin routes
router.use(authenticateToken);
router.use(requireAdminRole);

// GET /api/admin/dashboard - High level stats & counters
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await getAdminDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve admin dashboard metrics.' });
  }
});

// GET /api/admin/customers - Live user tracking list with pagination & search
router.get('/customers', async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const result = await getLiveCustomersList({
      search,
      page: Number(page) || 1,
      limit: Number(limit) || 20
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve customer list.' });
  }
});

// GET /api/admin/customers/:id - Customer profile, login history & itemized purchase history
router.get('/customers/:id', async (req, res) => {
  try {
    const result = await getCustomerDetailsWithOrders(req.params.id);
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve customer details.' });
  }
});

// GET /api/admin/orders - Order search, filters (status, date) & pagination
router.get('/orders', async (req, res) => {
  try {
    const { search, status, paymentStatus, startDate, endDate, page, limit } = req.query;
    const result = await getAllAdminOrders({
      search,
      status,
      paymentStatus,
      startDate,
      endDate,
      page: Number(page) || 1,
      limit: Number(limit) || 20
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

// GET /api/admin/orders/:id - Detailed order view
router.get('/orders/:id', async (req, res) => {
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

export default router;
