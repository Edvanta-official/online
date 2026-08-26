import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sparkle_store';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Atlas connected successfully! Host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:');
    console.error(error.message);
    console.log('ℹ️ Tip: Check MONGODB_URI in your .env file to ensure valid credentials and network access.');
  }
}

connectDB();

export default mongoose;