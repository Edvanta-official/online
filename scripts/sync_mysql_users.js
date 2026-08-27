import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import dns from 'dns';
import 'dotenv/config';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://chenchukoushik_db_user:gxaVw8AcBAzevD1o@cluster0.u48i0mp.mongodb.net/sparkle_store?retryWrites=true&w=majority';

async function syncAndQueryUsers() {
  console.log('\n=============================================================');
  console.log('👥 SPARKLE @ KKV MYSQL & MONGODB ATLAS CUSTOMER LOGINS DATA');
  console.log('=============================================================\n');

  // 1. Fetch live customer users from MongoDB Atlas
  let atlasUsers = [];
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    atlasUsers = await db.collection('users').find().toArray();
    console.log(`✅ MongoDB Atlas Live Customers Found: ${atlasUsers.length}`);
    await mongoose.disconnect();
  } catch (err) {
    console.warn('⚠️ Atlas Fetch Warning:', err.message);
  }

  // 2. Sync to local MySQL Server
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'koushik',
      password: process.env.DB_PASSWORD || 'Koushik@1',
      database: process.env.DB_NAME || 'sparkle_store'
    });

    console.log('✅ Connected to local MySQL server successfully!');

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(50) PRIMARY KEY,
        full_name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'customer',
        auth_method VARCHAR(50) DEFAULT 'Standard Auth',
        login_count INT DEFAULT 1,
        last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert Atlas users into MySQL
    for (const u of atlasUsers) {
      const uid = u.userId || String(u._id);
      const name = u.fullName || u.name || 'Customer';
      const email = u.email || '';
      const phone = u.phone || '';
      const role = u.role || 'customer';
      const authMethod = u.authMethod || 'Standard Auth';
      const loginCount = u.loginCount || 1;

      await conn.execute(`
        INSERT INTO users (user_id, full_name, email, phone, role, auth_method, login_count, last_login_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          full_name = VALUES(full_name),
          phone = VALUES(phone),
          login_count = VALUES(login_count),
          last_login_at = NOW()
      `, [uid, name, email, phone, role, authMethod, loginCount]);
    }

    const [rows] = await conn.execute('SELECT user_id, full_name, email, phone, role, login_count, last_login_at FROM users');
    console.log(`\n📊 MySQL 'users' Table Records (Count: ${rows.length}):\n`);
    console.table(rows);

    await conn.end();
  } catch (err) {
    console.warn('⚠️ Local MySQL Server Notice:', err.message);
  }
}

syncAndQueryUsers();
