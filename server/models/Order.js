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
  shippingState: { type: String, default: 'Telangana' },
  shippingPincode: { type: String },
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  finalPaidAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  paymentStatus: { 
    type: String, 
    enum: ['Pending Payment', 'Payment Processing', 'Payment Successful', 'Paid', 'Order Received', 'Payment Failed', 'Payment Cancelled'],
    default: 'Pending Payment' 
  },
  orderStatus: { 
    type: String, 
    enum: ['Order Received', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Payment Failed', 'Refunded'],
    default: 'Order Received' 
  },
  transactionId: { type: String, default: '' },
  paymentRef: { type: String, default: '' },
  utrNumber: { type: String, default: '' },
  items: [orderItemSchema],
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
