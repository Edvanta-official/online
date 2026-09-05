import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { queryPostgres } from '../db_postgres.js';

const router = express.Router();

// GET /api/users/me/addresses
router.get('/me/addresses', authenticateToken, async (req, res) => {
  try {
    const result = await queryPostgres(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, addresses: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user addresses.' });
  }
});

// POST /api/users/me/addresses
router.post('/me/addresses', authenticateToken, async (req, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, area, city, state, postalCode, country = 'India', addressType = 'HOME', isDefault = false } = req.body;
    
    if (!fullName || !addressLine1 || !city || !state || !postalCode) {
      return res.status(400).json({ error: 'Missing required address fields.' });
    }

    if (isDefault) {
      await queryPostgres('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.id]);
    }

    const result = await queryPostgres(`
      INSERT INTO addresses (user_id, full_name, phone, address_line_1, address_line_2, area, city, state, postal_code, country, address_type, is_default)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [req.user.id, fullName, phone || '', addressLine1, addressLine2 || '', area || '', city, state, postalCode, country, addressType, isDefault]);

    res.status(201).json({ success: true, address: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save address.' });
  }
});

export default router;
