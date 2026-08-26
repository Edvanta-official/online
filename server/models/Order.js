import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  selectedSize: { type: String, default: 'Standard' },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  totalItemPrice: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: String },
  customerName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  shippingStreet: { type: String },
  shippingCity: { type: String },
  shippingPincode: { type: String },
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  finalPaidAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'PhonePe' },
  paymentStatus: { type: String, default: 'Paid' },
  orderStatus: { type: String, default: 'Order Received' },
  utrNumber: { type: String, default: '' },
  items: [orderItemSchema],
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
