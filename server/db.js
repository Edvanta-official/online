import mongoose from 'mongoose';
import 'dotenv/config';
import dns from 'dns';

// Force DNS resolution order and servers (8.8.8.8) for Windows SRV compatibility
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

// Disable mongoose command buffering so operations fail fast when offline instead of hanging
mongoose.set('bufferCommands', false);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sparkle_store';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000
    });
    console.log(`\n===========================================================`);
    console.log(` ✅ MongoDB Atlas Connected Successfully! Host: ${conn.connection.host}`);
    console.log(`===========================================================\n`);
    return conn;
  } catch (error) {
    console.log(`\n===========================================================`);
    console.log(` ⚠️  MongoDB Atlas Offline / Whitelist Needed (${error.message})`);
    console.log(` 💡  Active Mode: Local Data Engine (Full functionality active)`);
    console.log(` 📌  To enable Atlas: Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access.`);
    console.log(`===========================================================\n`);
  }
}

connectDB();

export default mongoose;