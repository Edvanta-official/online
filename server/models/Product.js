import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 100 },
  category: { type: String, default: 'General' },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
