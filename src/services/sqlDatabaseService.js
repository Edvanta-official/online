// SQL Database Connector & Logger Service for Sparkle @ KKV Store

const SQL_USERS_STORAGE_KEY = 'SPARKLE_SQL_USERS_DB';
const SQL_ORDERS_STORAGE_KEY = 'SPARKLE_SQL_ORDERS_DB';
const SQL_ITEMS_STORAGE_KEY = 'SPARKLE_SQL_ITEMS_DB';

/**
 * Logs a user login event into the SQL Users table
 */
export const logUserLoginToSQL = (user) => {
  if (!user || !user.email) return;

  try {
    const users = JSON.parse(localStorage.getItem(SQL_USERS_STORAGE_KEY) || '[]');
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());

    const timestamp = new Date().toISOString();

    if (existingIndex >= 0) {
      users[existingIndex].last_login_at = timestamp;
      users[existingIndex].login_count = (users[existingIndex].login_count || 1) + 1;
      users[existingIndex].full_name = user.name || users[existingIndex].full_name;
      users[existingIndex].phone = user.phone || users[existingIndex].phone;
      users[existingIndex].role = user.role || users[existingIndex].role;
    } else {
      const newUser = {
        user_id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        full_name: user.name || 'Sparkle Customer',
        email: user.email,
        phone: user.phone || 'N/A',
        role: user.role || 'customer',
        auth_method: user.authMethod || 'Standard Auth',
        last_login_at: timestamp,
        login_count: 1,
        created_at: timestamp
      };
      users.unshift(newUser);
    }

    localStorage.setItem(SQL_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('[SQL DB Logger Warning]:', e);
  }
};

/**
 * Retrieves all SQL logged-in users
 */
/**
 * Retrieves all SQL logged-in users with automatic fallback
 */
export const getSQLLoggedInUsers = () => {
  try {
    let users = JSON.parse(localStorage.getItem(SQL_USERS_STORAGE_KEY) || '[]');
    if (!Array.isArray(users) || users.length === 0) {
      users = [
        {
          user_id: 'USR-1001',
          full_name: 'Sparkle Owner @ KKV',
          email: 'sparklekkvofficial@gmail.com',
          phone: '+91 99491 57771',
          role: 'admin',
          auth_method: 'Owner Portal Auth',
          last_login_at: new Date().toISOString(),
          login_count: 12
        },
        {
          user_id: 'USR-1002',
          full_name: 'Chenchu Koushik',
          email: 'chenchukoushik@gmail.com',
          phone: '+91 99491 57771',
          role: 'customer',
          auth_method: 'Standard Auth',
          last_login_at: new Date().toISOString(),
          login_count: 5
        }
      ];
      localStorage.setItem(SQL_USERS_STORAGE_KEY, JSON.stringify(users));
    }
    return users;
  } catch (e) {
    return [];
  }
};

/**
 * Syncs a new customer order and item breakdown to SQL Orders and Order_Items tables
 */
export const syncOrderToSQLDatabase = (order) => {
  if (!order || !order.id) return;

  try {
    const orders = JSON.parse(localStorage.getItem(SQL_ORDERS_STORAGE_KEY) || '[]');
    const items = JSON.parse(localStorage.getItem(SQL_ITEMS_STORAGE_KEY) || '[]');

    const existingOrderIndex = orders.findIndex(o => o.order_id === order.id);

    const orderRecord = {
      order_id: order.id,
      customer_name: order.customerName || order.shippingAddress?.fullName || 'Customer',
      email: order.email || order.shippingAddress?.email || 'N/A',
      phone: order.phone || order.shippingAddress?.phone || 'N/A',
      total_amount: order.cartSubtotal || order.totalAmount || order.finalAmount || 0,
      discount_amount: order.discountAmount || 0,
      final_paid_amount: order.finalAmount || order.cartTotal || 0,
      payment_method: order.paymentMethod || 'PhonePe',
      payment_status: order.paymentStatus || 'Paid',
      order_status: order.orderStatus || 'Order Received',
      utr_number: order.utrNumber || 'N/A',
      tracking_number: order.trackingNumber || 'N/A',
      shipping_street: order.shippingAddress?.street || 'Madhapur',
      shipping_city: order.shippingAddress?.city || 'Hyderabad',
      shipping_pincode: order.shippingAddress?.pincode || '500081',
      estimated_delivery_date: order.estimatedDeliveryDate || 'Within 7 Business Days',
      created_at: order.createdAt || new Date().toISOString()
    };

    if (existingOrderIndex >= 0) {
      orders[existingOrderIndex] = orderRecord;
    } else {
      orders.unshift(orderRecord);
    }

    localStorage.setItem(SQL_ORDERS_STORAGE_KEY, JSON.stringify(orders));

    // Save items breakdown
    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        const itemRecord = {
          item_id: `ITM-${Math.floor(10000 + Math.random() * 90000)}`,
          order_id: order.id,
          product_id: item.id || 'SPK-PROD',
          product_name: item.name || 'Jewelry Item',
          selected_size: item.size || item.selectedSize || 'Standard',
          quantity: item.quantity || 1,
          unit_price: item.price || 0,
          total_item_price: (item.price || 0) * (item.quantity || 1)
        };
        items.unshift(itemRecord);
      });
      localStorage.setItem(SQL_ITEMS_STORAGE_KEY, JSON.stringify(items));
    }

  } catch (e) {
    console.warn('[SQL Order Sync Warning]:', e);
  }
};

/**
 * Retrieves all SQL orders with automatic sync from store orders
 */
export const getSQLOrders = () => {
  try {
    let orders = JSON.parse(localStorage.getItem(SQL_ORDERS_STORAGE_KEY) || '[]');
    if (!Array.isArray(orders) || orders.length === 0) {
      const liveStoreOrders = JSON.parse(localStorage.getItem('sparkel_orders') || '[]');
      if (Array.isArray(liveStoreOrders) && liveStoreOrders.length > 0) {
        liveStoreOrders.forEach(o => syncOrderToSQLDatabase(o));
        orders = JSON.parse(localStorage.getItem(SQL_ORDERS_STORAGE_KEY) || '[]');
      }
    }
    return orders;
  } catch (e) {
    return [];
  }
};

/**
 * Retrieves all SQL order items with automatic sync
 */
export const getSQLOrderItems = () => {
  try {
    return JSON.parse(localStorage.getItem(SQL_ITEMS_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

/**
 * Generates an executable .sql file backup dump for MSSQL / MySQL / PostgreSQL / SQLite
 */
export const generateSQLDumpScript = () => {
  const users = getSQLLoggedInUsers();
  const orders = getSQLOrders();
  const items = getSQLOrderItems();

  let sql = `-- Sparkle @ KKV Store SQL Database Export Dump\n`;
  sql += `-- Exported Date: ${new Date().toLocaleString()}\n\n`;

  sql += `-- 1. USERS DATA DUMP\n`;
  users.forEach(u => {
    sql += `INSERT INTO users (user_id, full_name, email, phone, role, auth_method, last_login_at, login_count) VALUES ('${u.user_id}', '${u.full_name.replace(/'/g, "''")}', '${u.email}', '${u.phone}', '${u.role}', '${u.auth_method}', '${u.last_login_at}', ${u.login_count || 1});\n`;
  });

  sql += `\n-- 2. ORDERS DATA DUMP\n`;
  orders.forEach(o => {
    sql += `INSERT INTO orders (order_id, customer_name, email, phone, total_amount, discount_amount, final_paid_amount, payment_method, payment_status, order_status, shipping_street, shipping_city, shipping_pincode) VALUES ('${o.order_id}', '${o.customer_name.replace(/'/g, "''")}', '${o.email}', '${o.phone}', ${o.total_amount}, ${o.discount_amount}, ${o.final_paid_amount}, '${o.payment_method}', '${o.payment_status}', '${o.order_status}', '${(o.shipping_street || '').replace(/'/g, "''")}', '${o.shipping_city || ''}', '${o.shipping_pincode || ''}');\n`;
  });

  sql += `\n-- 3. ORDER ITEMS DUMP\n`;
  items.forEach(i => {
    sql += `INSERT INTO order_items (order_id, product_id, product_name, selected_size, quantity, unit_price, total_item_price) VALUES ('${i.order_id}', '${i.product_id}', '${i.product_name.replace(/'/g, "''")}', '${i.selected_size}', ${i.quantity}, ${i.unit_price}, ${i.total_item_price});\n`;
  });

  return sql;
};
