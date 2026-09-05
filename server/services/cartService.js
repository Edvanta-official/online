import { queryPostgres } from '../db_postgres.js';

export async function getOrCreateActiveCart(userId) {
  if (!userId) return null;

  const findCart = await queryPostgres(
    'SELECT id, user_id, status, created_at FROM carts WHERE user_id = $1 AND status = \'ACTIVE\' ORDER BY created_at DESC LIMIT 1',
    [userId]
  );

  if (findCart.rows.length > 0) {
    return findCart.rows[0];
  }

  const createCart = await queryPostgres(
    'INSERT INTO carts (user_id, status) VALUES ($1, \'ACTIVE\') RETURNING id, user_id, status, created_at',
    [userId]
  );
  return createCart.rows[0];
}

export async function getUserCart(userId) {
  const cart = await getOrCreateActiveCart(userId);
  if (!cart) return { success: false, items: [], subtotal: 0 };

  const query = `
    SELECT 
      ci.id as item_id, ci.quantity, ci.unit_price, ci.created_at,
      p.id as product_uuid, p.sku, p.name, p.slug, p.price as current_price, p.stock_quantity,
      COALESCE(
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1),
        'images/default_product.jpg'
      ) as image_url
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = $1
    ORDER BY ci.created_at DESC
  `;

  const itemsRes = await queryPostgres(query, [cart.id]);
  const items = itemsRes.rows.map(item => ({
    itemId: item.item_id,
    productId: item.sku || item.product_uuid,
    productUuid: item.product_uuid,
    name: item.name,
    sku: item.sku,
    price: Number(item.unit_price),
    quantity: item.quantity,
    image: item.image_url,
    totalPrice: Number(item.unit_price) * item.quantity,
    inStock: item.stock_quantity >= item.quantity
  }));

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    success: true,
    cartId: cart.id,
    items,
    subtotal,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
  };
}

export async function addItemToCart(userId, { productId, quantity = 1, unitPrice }) {
  const cart = await getOrCreateActiveCart(userId);
  if (!cart) return { success: false, error: 'User cart session unavailable.' };

  // Find product by UUID or SKU or Slug
  const prodRes = await queryPostgres(
    'SELECT id, sku, name, price, stock_quantity FROM products WHERE (id::text = $1 OR sku = $1 OR slug = $1) AND is_active = true',
    [productId]
  );
  if (prodRes.rows.length === 0) {
    return { success: false, error: 'Product not found.' };
  }
  const product = prodRes.rows[0];
  const price = unitPrice !== undefined ? Number(unitPrice) : Number(product.price);

  // Check existing cart item
  const existingItem = await queryPostgres(
    'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
    [cart.id, product.id]
  );

  if (existingItem.rows.length > 0) {
    const newQty = existingItem.rows[0].quantity + quantity;
    await queryPostgres(
      'UPDATE cart_items SET quantity = $1, unit_price = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [newQty, price, existingItem.rows[0].id]
    );
  } else {
    await queryPostgres(
      'INSERT INTO cart_items (cart_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
      [cart.id, product.id, quantity, price]
    );
  }

  return await getUserCart(userId);
}

export async function updateCartItemQuantity(userId, itemId, quantity) {
  const cart = await getOrCreateActiveCart(userId);
  if (!cart) return { success: false, error: 'Cart not found.' };

  if (quantity <= 0) {
    await queryPostgres('DELETE FROM cart_items WHERE id = $1 AND cart_id = $2', [itemId, cart.id]);
  } else {
    await queryPostgres('UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND cart_id = $3', [quantity, itemId, cart.id]);
  }

  return await getUserCart(userId);
}

export async function removeCartItem(userId, itemId) {
  const cart = await getOrCreateActiveCart(userId);
  if (!cart) return { success: false, error: 'Cart not found.' };

  await queryPostgres('DELETE FROM cart_items WHERE id = $1 AND cart_id = $2', [itemId, cart.id]);
  return await getUserCart(userId);
}

export default {
  getOrCreateActiveCart,
  getUserCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem
};
