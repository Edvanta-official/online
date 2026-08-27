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
  addressLine1: { type: String, default: '' },
  addressLine2: { type: String, default: '' },
  shippingStreet: { type: String, default: '' },
  shippingCity: { type: String, default: '' },
  shippingState: { type: String, default: '' },
  shippingPincode: { type: String, default: '' },
  country: { type: String, default: 'India' },
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  finalPaidAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED', 'Pending Payment', 'Payment Processing', 'Payment Successful', 'Paid', 'Payment Failed', 'Payment Cancelled'],
    default: 'PENDING' 
  },
  orderStatus: { 
    type: String, 
    enum: ['PAYMENT_PENDING', 'ORDER_RECEIVED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'Order Received', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Payment Failed'],
    default: 'ORDER_RECEIVED' 
  },
  transactionId: { type: String, default: '' },
  paymentRef: { type: String, default: '' },
  utrNumber: { type: String, default: '' },
  items: [orderItemSchema],
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
