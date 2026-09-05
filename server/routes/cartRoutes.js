import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserCart, addItemToCart, updateCartItemQuantity, removeCartItem } from '../services/cartService.js';

const router = express.Router();

// GET /api/cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cart = await getUserCart(req.user.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve shopping cart.' });
  }
});

// POST /api/cart/items
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity, unitPrice } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required.' });
    }
    const cart = await addItemToCart(req.user.id, { productId, quantity: Number(quantity) || 1, unitPrice });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item to cart.' });
  }
});

// PUT /api/cart/items/:id
router.put('/items/:id', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await updateCartItemQuantity(req.user.id, req.params.id, Number(quantity));
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item quantity.' });
  }
});

// DELETE /api/cart/items/:id
router.delete('/items/:id', authenticateToken, async (req, res) => {
  try {
    const cart = await removeCartItem(req.user.id, req.params.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item from cart.' });
  }
});

export default router;
