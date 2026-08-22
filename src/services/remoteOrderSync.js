// Real-Time Cloud Order Sync Service for Sparkle @ KKV Owner Admin Portal

const CLOUD_DB_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a02a7e04f57bb4';
const LOCAL_STORAGE_REMOTE_KEY = 'SPARKLE_REMOTE_ORDERS_DATABASE';

/**
 * Saves a new customer order to global store database and real-time cloud endpoint
 */
export const saveOrderToGlobalDatabase = async (newOrder) => {
  if (!newOrder || !newOrder.id) return;

  try {
    // 1. Update persistent local storage cache
    const localDb = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REMOTE_KEY) || '[]');
    const isDuplicate = localDb.some(o => o.id === newOrder.id);
    
    if (!isDuplicate) {
      localDb.unshift(newOrder);
      localStorage.setItem(LOCAL_STORAGE_REMOTE_KEY, JSON.stringify(localDb));
    }

    // 2. Sync to cloud database for cross-device Admin Portal access
    try {
      const getRes = await fetch(CLOUD_DB_URL);
      let existingCloudOrders = [];
      if (getRes.ok) {
        const json = await getRes.json();
        existingCloudOrders = json?.data?.orders || [];
      }

      const mergedMap = new Map();
      [newOrder, ...localDb, ...existingCloudOrders].forEach(o => {
        if (o && o.id) mergedMap.set(o.id, o);
      });

      const updatedCloudOrders = Array.from(mergedMap.values());

      await fetch(CLOUD_DB_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Sparkle Store Orders DB",
          data: { orders: updatedCloudOrders }
        })
      });
      console.log(`[Cloud Order Sync Success]: Order ${newOrder.id} saved to cloud database.`);
    } catch (cloudErr) {
      console.warn('[Cloud Order Sync Warning]:', cloudErr);
    }

  } catch (e) {
    console.warn('[Remote Order Sync Error]:', e);
  }
};

/**
 * Retrieves all orders from global database and cloud endpoint for Admin Portal
 */
export const fetchGlobalDatabaseOrders = async () => {
  let cachedOrders = [];

  try {
    const localRemoteDb = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REMOTE_KEY) || '[]');
    const sparkelOrders = JSON.parse(localStorage.getItem('sparkel_orders') || '[]');

    const mergedMap = new Map();
    [...sparkelOrders, ...localRemoteDb].forEach(order => {
      if (order && order.id) mergedMap.set(order.id, order);
    });

    cachedOrders = Array.from(mergedMap.values());
  } catch (e) {}

  // Fetch live cloud orders asynchronously
  try {
    const res = await fetch(CLOUD_DB_URL);
    if (res.ok) {
      const cloudData = await res.json();
      const cloudOrders = cloudData?.data?.orders || [];

      if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
        const fullMap = new Map();
        [...cloudOrders, ...cachedOrders].forEach(o => {
          if (o && o.id) fullMap.set(o.id, o);
        });

        const fullMerged = Array.from(fullMap.values());
        localStorage.setItem(LOCAL_STORAGE_REMOTE_KEY, JSON.stringify(fullMerged));
        return fullMerged;
      }
    }
  } catch (err) {
    console.warn('[Cloud Order Fetch Warning]:', err);
  }

  return cachedOrders;
};
