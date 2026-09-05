import express from 'express';
import { getAllProducts, getProductByIdOrSlug, getAllCategories } from '../services/productService.js';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, limit, offset } = req.query;
    const result = await getAllProducts({ category, search, minPrice, maxPrice, limit, offset });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products from PostgreSQL.' });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await getAllCategories();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await getProductByIdOrSlug(req.params.id);
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product details.' });
  }
});

export default router;
