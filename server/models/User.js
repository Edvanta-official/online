import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  passwordHash: { type: String },
  role: { type: String, default: 'customer' },
  authMethod: { type: String, default: 'Standard Auth' },
  lastLoginAt: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
