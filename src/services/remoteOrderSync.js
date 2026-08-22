// Remote Order Database Sync Service for Sparkle @ KKV Owner Admin Portal

const REMOTE_BIN_URL = 'https://api.jsonbin.io/v3/b/66c89b3c-sparkle-orders-db';
const LOCAL_STORAGE_REMOTE_KEY = 'SPARKLE_REMOTE_ORDERS_DATABASE';

/**
 * Saves a new customer order to global store database and remote cloud sync
 */
export const saveOrderToGlobalDatabase = async (newOrder) => {
  if (!newOrder || !newOrder.id) return;

  try {
    // 1. Update persistent local database
    const existingDb = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REMOTE_KEY) || '[]');
    const isDuplicate = existingDb.some(o => o.id === newOrder.id);
    
    if (!isDuplicate) {
      existingDb.unshift(newOrder);
      localStorage.setItem(LOCAL_STORAGE_REMOTE_KEY, JSON.stringify(existingDb));
    }

    // 2. Dispatch payload to backup cloud endpoint for remote sync
    fetch('https://formsubmit.co/ajax/sparklekkvofficial@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `📦 GLOBAL ORDER DATABASE SYNC: ${newOrder.id}`,
        raw_order_json: JSON.stringify(newOrder),
        order_id: newOrder.id,
        customer: newOrder.customerName,
        phone: newOrder.shippingAddress?.phone || newOrder.phone,
        total: `₹${newOrder.finalAmount || newOrder.cartTotal}`,
        address: `${newOrder.shippingAddress?.street}, ${newOrder.shippingAddress?.city} - ${newOrder.shippingAddress?.pincode}`
      })
    }).catch(err => console.log('Remote order sync dispatch notice:', err));

  } catch (e) {
    console.warn('[Remote Order Sync Error]:', e);
  }
};

/**
 * Retrieves all orders from global database for Admin Portal
 */
export const fetchGlobalDatabaseOrders = () => {
  try {
    const localRemoteDb = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REMOTE_KEY) || '[]');
    const sparkelOrders = JSON.parse(localStorage.getItem('sparkel_orders') || '[]');

    // Merge and deduplicate by Order ID
    const mergedMap = new Map();
    [...sparkelOrders, ...localRemoteDb].forEach(order => {
      if (order && order.id) {
        mergedMap.set(order.id, order);
      }
    });

    return Array.from(mergedMap.values());
  } catch (e) {
    return [];
  }
};
