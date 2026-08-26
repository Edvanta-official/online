import mongoose from 'mongoose';
import 'dotenv/config';
import dns from 'dns';

// Force DNS resolution order and servers (8.8.8.8) for Windows SRV compatibility
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sparkle_store';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Atlas connected successfully! Host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:');
    console.error(error.message);
    console.log('ℹ️ Tip: Check MONGODB_URI in your .env file and ensure 0.0.0.0/0 IP access is allowed in MongoDB Atlas Network Access.');
  }
}

connectDB();

export default mongoose;