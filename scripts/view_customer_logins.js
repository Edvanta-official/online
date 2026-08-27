import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const MONGODB_URI = 'mongodb+srv://chenchukoushik_db_user:gxaVw8AcBAzevD1o@cluster0.u48i0mp.mongodb.net/sparkle_store?retryWrites=true&w=majority';

async function displayCustomerLogins() {
  console.log('\n=============================================================');
  console.log('👥 SPARKLE @ KKV LIVE CUSTOMER LOGINS REPORT (VS CODE TERMINAL)');
  console.log('=============================================================\n');

  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    const users = await db.collection('users').find().sort({ lastLoginAt: -1 }).toArray();

    if (!users || users.length === 0) {
      console.log('⚠️ No customer logins found in MongoDB Atlas.');
    } else {
      console.log(`✅ Total Registered/Logged-in Customers: ${users.length}\n`);

      users.forEach((u, i) => {
        console.log(`-------------------------------------------------------------`);
        console.log(`👤 Customer #${i + 1}: ${u.fullName || u.name || 'Sparkle Customer'}`);
        console.log(`   📧 Email:        ${u.email || 'N/A'}`);
        console.log(`   📱 Phone:        ${u.phone || 'N/A'}`);
        console.log(`   🆔 User ID:      ${u.userId || u._id}`);
        console.log(`   🔑 Role:         ${u.role || 'customer'}`);
        console.log(`   🔐 Auth Method:  ${u.authMethod || 'Standard'}`);
        console.log(`   🔢 Login Count:  ${u.loginCount || 1}`);
        console.log(`   ⏰ Last Login:   ${u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-IN') : 'N/A'}`);
      });
      console.log(`-------------------------------------------------------------\n`);

      // Write users to server/data/users.json for viewing in VS Code Explorer
      const dataDir = path.join(process.cwd(), 'server', 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const usersFile = path.join(dataDir, 'users.json');
      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
      console.log(`📄 Saved live customer login details to VS Code file:\n   [server/data/users.json](file:///${usersFile.replace(/\\/g, '/')})\n`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Connection Error:', err.message);
  }
}

displayCustomerLogins();
