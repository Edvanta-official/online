import { queryPostgres } from '../db_postgres.js';

export async function getAdminDashboardStats() {
  const query = `
    SELECT
      (SELECT COUNT(*)::int FROM users WHERE role = 'CUSTOMER') as total_customers,
      (SELECT COUNT(*)::int FROM users WHERE role = 'CUSTOMER' AND created_at >= CURRENT_DATE) as today_new_customers,
      (SELECT COUNT(*)::int FROM orders) as total_orders,
      (SELECT COALESCE(SUM(total_amount), 0)::numeric FROM orders WHERE payment_status = 'PAID') as total_sales,
      (SELECT COUNT(*)::int FROM orders WHERE created_at >= CURRENT_DATE) as today_orders,
      (SELECT COALESCE(SUM(total_amount), 0)::numeric FROM orders WHERE payment_status = 'PAID' AND created_at >= CURRENT_DATE) as today_sales,
      (SELECT COUNT(*)::int FROM orders WHERE payment_status = 'PENDING') as pending_payments,
      (SELECT COUNT(*)::int FROM orders WHERE payment_status = 'FAILED') as failed_payments,
      (SELECT COUNT(*)::int FROM orders WHERE order_status = 'PROCESSING') as processing_orders,
      (SELECT COUNT(*)::int FROM orders WHERE order_status = 'SHIPPED') as shipped_orders,
      (SELECT COUNT(*)::int FROM orders WHERE order_status = 'DELIVERED') as delivered_orders,
      (SELECT COUNT(*)::int FROM products WHERE stock_quantity <= 5 AND is_active = true) as low_stock_count
  `;

  const res = await queryPostgres(query);
  if (!res.success || res.rows.length === 0) {
    return { success: false, error: 'Failed to fetch admin dashboard stats.' };
  }

  const s = res.rows[0];
  return {
    success: true,
    stats: {
      totalCustomers: Number(s.total_customers),
      todayNewCustomers: Number(s.today_new_customers),
      totalOrders: Number(s.total_orders),
      totalSales: Number(s.total_sales),
      todayOrders: Number(s.today_orders),
      todaySales: Number(s.today_sales),
      pendingPayments: Number(s.pending_payments),
      failedPayments: Number(s.failed_payments),
      processingOrders: Number(s.processing_orders),
      shippedOrders: Number(s.shipped_orders),
      deliveredOrders: Number(s.delivered_orders),
      lowStockProducts: Number(s.low_stock_count)
    }
  };
}

export async function getLiveCustomersList({ search, limit = 20, page = 1 } = {}) {
  const offset = (page - 1) * limit;
  let whereClause = `WHERE u.role = 'CUSTOMER'`;
  const params = [];
  let paramIdx = 1;

  if (search) {
    whereClause += ` AND (
      u.first_name ILIKE $${paramIdx} OR 
      u.last_name ILIKE $${paramIdx} OR 
      u.email ILIKE $${paramIdx} OR 
      u.phone ILIKE $${paramIdx} OR
      EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.order_number ILIKE $${paramIdx})
    )`;
    params.push(`%${search}%`);
    paramIdx++;
  }

  const countQuery = `SELECT COUNT(*)::int FROM users u ${whereClause}`;
  const countRes = await queryPostgres(countQuery, params);
  const totalCount = countRes.rows[0]?.count || 0;

  const dataQuery = `
    SELECT 
      u.id, u.first_name, u.last_name, u.email, u.phone, u.is_active, u.created_at, u.last_login_at,
      COALESCE(COUNT(o.id), 0)::int as total_orders,
      COALESCE(SUM(CASE WHEN o.payment_status = 'PAID' THEN o.total_amount ELSE 0 END), 0)::numeric as total_spent,
      s.device_name, s.browser, s.operating_system, s.ip_address, s.last_activity_at, s.is_active as is_session_active
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    LEFT JOIN LATERAL (
      SELECT device_name, browser, operating_system, ip_address, last_activity_at, is_active
      FROM user_sessions 
      WHERE user_id = u.id 
      ORDER BY last_activity_at DESC 
      LIMIT 1
    ) s ON true
    ${whereClause}
    GROUP BY u.id, s.device_name, s.browser, s.operating_system, s.ip_address, s.last_activity_at, s.is_active
    ORDER BY u.created_at DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `;
  params.push(limit, offset);

  const dataRes = await queryPostgres(dataQuery, params);

  const customers = dataRes.rows.map(c => ({
    id: c.id,
    name: `${c.first_name} ${c.last_name}`.trim(),
    firstName: c.first_name,
    lastName: c.last_name,
    email: c.email,
    phone: c.phone || 'N/A',
    status: c.is_active ? 'Active' : 'Inactive',
    createdAt: c.created_at,
    lastLoginAt: c.last_login_at,
    ordersCount: Number(c.total_orders),
    totalSpent: Number(c.total_spent),
    device: c.device_name || 'Desktop / Mobile',
    browser: c.browser || 'Browser',
    os: c.operating_system || 'OS',
    ipAddress: c.ip_address || '127.0.0.1',
    isOnline: Boolean(c.is_session_active && c.last_activity_at && (Date.now() - new Date(c.last_activity_at).getTime() < 15 * 60 * 1000))
  }));

  return {
    success: true,
    customers,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
}

export async function getCustomerDetailsWithOrders(userId) {
  const userRes = await queryPostgres(`
    SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.is_active, u.created_at, u.last_login_at,
      COALESCE(COUNT(o.id), 0)::int as orders_count,
      COALESCE(SUM(CASE WHEN o.payment_status = 'PAID' THEN o.total_amount ELSE 0 END), 0)::numeric as total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.id::text = $1 OR u.email = $1
    GROUP BY u.id
  `, [userId]);

  if (!userRes.success || userRes.rows.length === 0) {
    return { success: false, error: 'Customer not found.' };
  }

  const u = userRes.rows[0];

  // Fetch Login History
  const loginHistoryRes = await queryPostgres(`
    SELECT event_type, ip_address, device, browser, operating_system, success, created_at
    FROM login_events
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 20
  `, [u.id]);

  // Fetch Addresses
  const addrRes = await queryPostgres(`
    SELECT full_name, phone, address_line_1, address_line_2, area, city, state, postal_code, country, address_type, is_default
    FROM addresses
    WHERE user_id = $1
    ORDER BY is_default DESC, created_at DESC
  `, [u.id]);

  // Fetch Customer Orders with items
  const ordersRes = await queryPostgres(`
    SELECT 
      o.id, o.order_number, o.total_amount, o.payment_status, o.order_status, o.created_at, o.payment_method,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'productName', oi.product_name,
            'sku', oi.sku,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price,
            'totalAmount', oi.total_amount
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [u.id]);

  return {
    success: true,
    customer: {
      id: u.id,
      name: `${u.first_name} ${u.last_name}`.trim(),
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      phone: u.phone,
      status: u.is_active ? 'Active' : 'Inactive',
      createdAt: u.created_at,
      lastLoginAt: u.last_login_at,
      ordersCount: Number(u.orders_count),
      totalSpent: Number(u.total_spent),
      loginHistory: loginHistoryRes.rows,
      addresses: addrRes.rows,
      orders: ordersRes.rows.map(o => ({
        id: o.order_number,
        orderUuid: o.id,
        orderNumber: o.order_number,
        totalAmount: Number(o.total_amount),
        paymentStatus: o.payment_status,
        orderStatus: o.order_status,
        paymentMethod: o.payment_method,
        createdAt: o.created_at,
        items: o.items
      }))
    }
  };
}

export async function getAllAdminOrders({ search, status, paymentStatus, startDate, endDate, limit = 20, page = 1 } = {}) {
  const offset = (page - 1) * limit;
  let whereClause = `WHERE 1=1`;
  const params = [];
  let paramIdx = 1;

  if (search) {
    whereClause += ` AND (
      o.order_number ILIKE $${paramIdx} OR
      u.first_name ILIKE $${paramIdx} OR
      u.last_name ILIKE $${paramIdx} OR
      u.email ILIKE $${paramIdx} OR
      u.phone ILIKE $${paramIdx} OR
      a.full_name ILIKE $${paramIdx} OR
      p.transaction_id ILIKE $${paramIdx}
    )`;
    params.push(`%${search}%`);
    paramIdx++;
  }

  if (status && status !== 'ALL') {
    whereClause += ` AND o.order_status = $${paramIdx}`;
    params.push(status);
    paramIdx++;
  }

  if (paymentStatus && paymentStatus !== 'ALL') {
    whereClause += ` AND o.payment_status = $${paramIdx}`;
    params.push(paymentStatus);
    paramIdx++;
  }

  if (startDate) {
    whereClause += ` AND o.created_at >= $${paramIdx}`;
    params.push(startDate);
    paramIdx++;
  }

  if (endDate) {
    whereClause += ` AND o.created_at <= $${paramIdx}`;
    params.push(endDate);
    paramIdx++;
  }

  const countQuery = `
    SELECT COUNT(DISTINCT o.id)::int 
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN addresses a ON o.shipping_address_id = a.id
    LEFT JOIN payments p ON o.id = p.order_id
    ${whereClause}
  `;
  const countRes = await queryPostgres(countQuery, params);
  const totalCount = countRes.rows[0]?.count || 0;

  const dataQuery = `
    SELECT 
      o.*, 
      u.first_name, u.last_name, u.email as user_email, u.phone as user_phone,
      a.full_name as shipping_name, a.phone as shipping_phone, a.address_line_1, a.city, a.state, a.postal_code,
      p.transaction_id, p.gateway_payment_id, p.payment_method as pay_method,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'productName', oi.product_name,
            'sku', oi.sku,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price,
            'totalAmount', oi.total_amount
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) as items
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN addresses a ON o.shipping_address_id = a.id
    LEFT JOIN payments p ON o.id = p.order_id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    ${whereClause}
    GROUP BY o.id, u.id, a.id, p.id
    ORDER BY o.created_at DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `;
  params.push(limit, offset);

  const dataRes = await queryPostgres(dataQuery, params);

  const orders = dataRes.rows.map(o => ({
    id: o.order_number,
    orderUuid: o.id,
    orderNumber: o.order_number,
    createdAt: o.created_at,
    customerName: o.shipping_name || `${o.first_name || ''} ${o.last_name || ''}`.trim() || 'Customer',
    email: o.user_email || '',
    phone: o.shipping_phone || o.user_phone || '',
    subtotal: Number(o.subtotal),
    discountAmount: Number(o.discount_amount),
    totalAmount: Number(o.total_amount),
    paymentStatus: o.payment_status,
    orderStatus: o.order_status,
    paymentMethod: o.pay_method || o.payment_method,
    transactionId: o.transaction_id || 'N/A',
    gatewayPaymentId: o.gateway_payment_id || '',
    addressStr: o.shipping_name ? `${o.shipping_name}, ${o.address_line_1 || ''}, ${o.city || ''}, ${o.state || ''} - ${o.postal_code || ''}` : 'Address Pending',
    items: o.items
  }));

  return {
    success: true,
    orders,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
}

export default {
  getAdminDashboardStats,
  getLiveCustomersList,
  getCustomerDetailsWithOrders,
  getAllAdminOrders
};
