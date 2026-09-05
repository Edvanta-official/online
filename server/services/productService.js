import { queryPostgres } from '../db_postgres.js';

export async function getAllProducts({ category, search, minPrice, maxPrice, limit = 50, offset = 0 } = {}) {
  let query = `
    SELECT 
      p.id, p.sku, p.name, p.slug, p.description, p.short_description,
      p.price, p.compare_at_price, p.discount_price, p.brand, p.stock_quantity,
      p.is_active, p.is_featured, p.created_at, p.updated_at,
      c.id as category_id, c.name as category_name, c.slug as category_slug,
      COALESCE(
        json_agg(
          json_build_object(
            'id', pi.id,
            'imageUrl', pi.image_url,
            'isPrimary', pi.is_primary,
            'sortOrder', pi.sort_order
          ) ORDER BY pi.sort_order ASC, pi.is_primary DESC
        ) FILTER (WHERE pi.id IS NOT NULL), '[]'
      ) as images
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.is_active = true
  `;

  const params = [];
  let paramIdx = 1;

  if (category) {
    query += ` AND (c.slug = $${paramIdx} OR c.id::text = $${paramIdx})`;
    params.push(category);
    paramIdx++;
  }

  if (search) {
    query += ` AND (p.name ILIKE $${paramIdx} OR p.sku ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx})`;
    params.push(`%${search}%`);
    paramIdx++;
  }

  if (minPrice !== undefined && minPrice !== null) {
    query += ` AND p.price >= $${paramIdx}`;
    params.push(Number(minPrice));
    paramIdx++;
  }

  if (maxPrice !== undefined && maxPrice !== null) {
    query += ` AND p.price <= $${paramIdx}`;
    params.push(Number(maxPrice));
    paramIdx++;
  }

  query += ` GROUP BY p.id, c.id ORDER BY p.created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
  params.push(limit, offset);

  const res = await queryPostgres(query, params);
  
  if (!res.success) {
    return { success: false, error: res.error, products: [] };
  }

  const formattedProducts = res.rows.map(p => ({
    id: p.sku || p.id,
    uuid: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    category: p.category_slug || p.category_name?.toLowerCase(),
    categoryName: p.category_name,
    price: Number(p.price),
    originalPrice: p.compare_at_price ? Number(p.compare_at_price) : Number(p.price),
    stock: p.stock_quantity,
    description: p.description,
    shortDescription: p.short_description,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images.map(img => img.imageUrl) : ['images/default_product.jpg'],
    isBestSeller: p.is_featured,
    isTrending: p.is_featured
  }));

  return { success: true, products: formattedProducts, count: formattedProducts.length };
}

export async function getProductByIdOrSlug(identifier) {
  const query = `
    SELECT 
      p.*, c.name as category_name, c.slug as category_slug,
      COALESCE(
        json_agg(
          json_build_object(
            'id', pi.id,
            'imageUrl', pi.image_url,
            'isPrimary', pi.is_primary
          ) ORDER BY pi.sort_order ASC
        ) FILTER (WHERE pi.id IS NOT NULL), '[]'
      ) as images
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE (p.id::text = $1 OR p.sku = $1 OR p.slug = $1)
    GROUP BY p.id, c.id
  `;
  const res = await queryPostgres(query, [identifier]);
  if (!res.success || res.rows.length === 0) {
    return { success: false, error: 'Product not found.' };
  }
  const p = res.rows[0];
  return {
    success: true,
    product: {
      id: p.sku || p.id,
      uuid: p.id,
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      originalPrice: p.compare_at_price ? Number(p.compare_at_price) : Number(p.price),
      stock: p.stock_quantity,
      description: p.description,
      images: Array.isArray(p.images) ? p.images.map(img => img.imageUrl) : []
    }
  };
}

export async function getAllCategories() {
  const query = `
    SELECT c.*, COUNT(p.id)::int as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
    WHERE c.is_active = true
    GROUP BY c.id
    ORDER BY c.name ASC
  `;
  const res = await queryPostgres(query);
  return {
    success: res.success,
    categories: res.rows.map(c => ({
      id: c.slug,
      uuid: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image_url,
      count: c.product_count
    }))
  };
}

export default {
  getAllProducts,
  getProductByIdOrSlug,
  getAllCategories
};
