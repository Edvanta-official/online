import express from 'express';
import cors from 'cors';
import { PRODUCTS, CATEGORIES, COUPONS, TESTIMONIALS } from '../src/data/mockData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let productsList = [...PRODUCTS];
let ordersList = [
  {
    id: "ORD-98241",
    customerName: "Ananya Sharma",
    email: "ananya@example.com",
    phone: "+91 98765 12345",
    items: [
      { id: "p1", name: "Premium Swarovski Butterfly Hair Clip", price: 179, quantity: 2, image: "/images/butterfly_clip.jpg" },
      { id: "p4", name: "Pure Mulberry Silk Scrunchie Trio Box", price: 349, quantity: 1, image: "/images/silk_scrunchies.jpg" }
    ],
    totalAmount: 707,
    discount: 0,
    shippingFee: 0,
    finalAmount: 707,
    paymentMethod: "UPI / Razorpay",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    trackingNumber: "SPK-IN-9812489",
    shippingAddress: {
      fullName: "Ananya Sharma",
      street: "Flat 402, Rosewood Heights, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050"
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "ORD-98242",
    customerName: "Rhea Kapoor",
    email: "rhea@example.com",
    phone: "+91 99887 76655",
    items: [
      { id: "p2", name: "Royal Rose Gold & Kundan Choker Set", price: 899, quantity: 1, image: "/images/rose_necklace.jpg" }
    ],
    totalAmount: 899,
    discount: 179.8,
    shippingFee: 0,
    finalAmount: 719.2,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    orderStatus: "Processing",
    trackingNumber: "SPK-IN-9812490",
    shippingAddress: {
      fullName: "Rhea Kapoor",
      street: "B-12, Vasant Vihar",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110057"
    },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Sparkel @KKL Server Running", time: new Date() });
});

// GET all products with filtering, search & sorting
app.get('/api/products', (req, res) => {
  const { category, search, sort, flashSale } = req.query;
  let result = [...productsList];

  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }

  if (flashSale === 'true') {
    result = result.filter(p => p.isFlashSale);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (sort === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, count: result.length, products: result });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = productsList.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, product });
});

// ADMIN: Create Product
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: `p${Date.now()}`,
    rating: 5.0,
    reviewsCount: 0,
    images: req.body.images?.length ? req.body.images : ["/images/butterfly_clip.jpg"],
    ...req.body
  };
  productsList.unshift(newProduct);
  res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });
});

// ADMIN: Update Product
app.put('/api/products/:id', (req, res) => {
  const index = productsList.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  productsList[index] = { ...productsList[index], ...req.body };
  res.json({ success: true, message: "Product updated", product: productsList[index] });
});

// ADMIN: Delete Product
app.delete('/api/products/:id', (req, res) => {
  productsList = productsList.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: "Product deleted" });
});

// COUPONS: Validate
app.post('/api/coupons/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  const coupon = COUPONS.find(c => c.code.toUpperCase() === (code || '').toUpperCase());

  if (!coupon) {
    return res.status(400).json({ success: false, message: "Invalid coupon code" });
  }

  if (cartTotal < coupon.minAmount) {
    return res.status(400).json({ 
      success: false, 
      message: `Coupon code '${coupon.code}' requires a minimum order of ₹${coupon.minAmount}` 
    });
  }

  const discountAmount = Math.round((cartTotal * coupon.discountPercent) / 100);
  res.json({ 
    success: true, 
    coupon, 
    discountAmount,
    message: `Success! ${coupon.discountPercent}% discount applied (Saved ₹${discountAmount})`
  });
});

// ORDERS: Create Order
app.post('/api/orders', (req, res) => {
  const { customer, items, totalAmount, discount, finalAmount, paymentMethod, shippingAddress } = req.body;
  
  const newOrder = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    customerName: customer?.name || "Sparkel Customer",
    email: customer?.email || "customer@example.com",
    phone: customer?.phone || "+91 98765 43210",
    items,
    totalAmount,
    discount,
    finalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
    orderStatus: 'Placed',
    trackingNumber: `SPK-IN-${Math.floor(1000000 + Math.random() * 9000000)}`,
    shippingAddress,
    createdAt: new Date().toISOString()
  };

  ordersList.unshift(newOrder);
  res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
});

// GET orders
app.get('/api/orders', (req, res) => {
  res.json({ success: true, orders: ordersList });
});

// ADMIN: Update order status
app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = ordersList.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  order.orderStatus = status;
  res.json({ success: true, message: `Order status updated to ${status}`, order });
});

// ADMIN: Analytics dashboard
app.get('/api/admin/analytics', (req, res) => {
  const totalRevenue = ordersList.reduce((sum, o) => sum + o.finalAmount, 0);
  const totalOrders = ordersList.length;
  const totalProducts = productsList.length;
  const activeCustomers = 42;

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders,
      totalProducts,
      activeCustomers,
      conversionRate: "3.8%"
    },
    monthlySales: [
      { month: 'Jan', sales: 12000 },
      { month: 'Feb', sales: 19000 },
      { month: 'Mar', sales: 15000 },
      { month: 'Apr', sales: 28000 },
      { month: 'May', sales: 34000 },
      { month: 'Jun', sales: 42000 },
      { month: 'Jul', sales: 58000 }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✨ Sparkel @KKL Server running on http://localhost:${PORT}`);
});
