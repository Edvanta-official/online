import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShieldCheck, Package, DollarSign, Users, ShoppingBag, 
  Check, X, Sparkles, Tag, Search, Truck, Clock, RefreshCw, Download, Filter, CheckCircle2
} from 'lucide-react';

import { fetchGlobalDatabaseOrders } from '../services/remoteOrderSync';
import { getSQLLoggedInUsers, getSQLOrders, getSQLOrderItems, generateSQLDumpScript } from '../services/sqlDatabaseService';

export const AdminDashboard = () => {
  const {
    user,
    loginUser,
    products,
    orders,
    subscribers,
    deleteSubscriber,
    COUPONS,
    showToast
  } = useShop();

  const [adminEmail, setAdminEmail] = useState("admin@sparklekkv.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAdminAuthed, setIsAdminAuthed] = useState(true);
  const [liveOrders, setLiveOrders] = useState([]);

  const [adminTab, setAdminTab] = useState('orders');
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [manualOrder, setManualOrder] = useState({
    customerName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    pincode: '',
    totalAmount: '',
    itemName: '',
    paymentMethod: 'PhonePe'
  });

  const handleCreateManualOrder = (e) => {
    e.preventDefault();
    if (!manualOrder.customerName || !manualOrder.totalAmount) {
      showToast("Please fill customer name and order total!", "error");
      return;
    }

    const createdOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: manualOrder.customerName,
      email: manualOrder.email || 'customer@sparklekkv.com',
      phone: manualOrder.phone || 'N/A',
      items: [
        {
          id: 'SPK-CUSTOM',
          name: manualOrder.itemName || 'Jewelry Accessory',
          price: Number(manualOrder.totalAmount),
          quantity: 1,
          image: 'images/plumeria_flower.jpg'
        }
      ],
      totalAmount: Number(manualOrder.totalAmount),
      finalAmount: Number(manualOrder.totalAmount),
      cartTotal: Number(manualOrder.totalAmount),
      cartSubtotal: Number(manualOrder.totalAmount),
      discountAmount: 0,
      shippingFee: 0,
      paymentMethod: manualOrder.paymentMethod,
      paymentStatus: 'Paid',
      orderStatus: 'Order Received',
      trackingNumber: `SPK-IN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      shippingAddress: {
        fullName: manualOrder.customerName,
        phone: manualOrder.phone || 'N/A',
        street: manualOrder.street || 'Madhapur',
        city: manualOrder.city || 'Hyderabad',
        pincode: manualOrder.pincode || '500081'
      },
      estimatedDeliveryDate: 'Within 7 Business Days',
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updated = [createdOrder, ...liveOrders];
    setLiveOrders(updated);
    try {
      localStorage.setItem('sparkel_orders', JSON.stringify(updated));
      localStorage.setItem('SPARKLE_REMOTE_ORDERS_DATABASE', JSON.stringify(updated));
    } catch (err) {}

    setIsAddModalOpen(false);
    setManualOrder({ customerName: '', phone: '', email: '', street: '', city: '', pincode: '', totalAmount: '', itemName: '', paymentMethod: 'PhonePe' });
    showToast(`🎉 Order ${createdOrder.id} added successfully!`, "success");
  };

  const TEST_ORDER_IDS = ['ORD-54561', 'ORD-11718', 'ORD-72852', 'ORD-55003', 'ORD-31965', 'ORD-57289', 'ORD-52031', 'ORD-23498', 'ORD-99999', 'ORD-98241'];

  const syncLiveCloudOrders = async () => {
    try {
      const globalOrders = await fetchGlobalDatabaseOrders();
      const map = new Map();
      const safeGlobal = Array.isArray(globalOrders) ? globalOrders : [];
      const safeContextOrders = Array.isArray(orders) ? orders : [];

      [...safeGlobal, ...safeContextOrders].forEach(o => {
        if (o && o.id && !TEST_ORDER_IDS.includes(o.id)) {
          map.set(o.id, o);
        }
      });
      setLiveOrders(Array.from(map.values()));
    } catch (e) {}
  };

  // Sync live orders on mount and auto-refresh every 10 seconds
  useEffect(() => {
    syncLiveCloudOrders();

    const interval = setInterval(() => {
      syncLiveCloudOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, [orders]);

  const totalRevenue = (Array.isArray(liveOrders) ? liveOrders : []).reduce((sum, o) => sum + (o?.finalAmount || o?.cartTotal || 0), 0);

  const handleAdminAuth = (e) => {
    e.preventDefault();
    loginUser("Sparkle Owner @ KKV", adminEmail || "admin@sparklekkv.com", adminPassword || "admin123", "admin@sparklekkv.com", "admin");
    setIsAdminAuthed(true);
    localStorage.setItem('sparkle_admin_authed', 'true');
    showToast("🛡️ Owner Admin Authenticated Successfully!", "success");
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setLiveOrders(prev => (Array.isArray(prev) ? prev : []).map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    try {
      const updatedList = (Array.isArray(liveOrders) ? liveOrders : []).map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
      localStorage.setItem('sparkel_orders', JSON.stringify(updatedList));
      localStorage.setItem('SPARKLE_REMOTE_ORDERS_DATABASE', JSON.stringify(updatedList));
    } catch (e) {}
    showToast(`Order ${orderId} status updated to "${newStatus}"!`, "success");
  };

  const handleClearAllOrders = () => {
    if (window.confirm("Are you sure you want to clear all test orders from your admin portal?")) {
      localStorage.removeItem('sparkel_orders');
      localStorage.removeItem('SPARKLE_REMOTE_ORDERS_DATABASE');
      setLiveOrders([]);
      showToast("🗑️ All test orders cleared from Admin Portal!", "info");
    }
  };

  const handleDeleteSingleOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const updated = (Array.isArray(liveOrders) ? liveOrders : []).filter(o => o.id !== orderId);
      setLiveOrders(updated);
      try {
        localStorage.setItem('sparkel_orders', JSON.stringify(updated));
        localStorage.setItem('SPARKLE_REMOTE_ORDERS_DATABASE', JSON.stringify(updated));
      } catch (e) {}
      showToast(`Deleted order ${orderId}!`, "info");
    }
  };

  // Filtered orders list for Admin Search
  const filteredOrdersList = (Array.isArray(liveOrders) ? liveOrders : []).filter(o => {
    if (!o) return false;
    const matchesSearch = 
      (o.id && o.id.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.email && o.email.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.shippingAddress?.phone && String(o.shippingAddress.phone).includes(orderSearchQuery)) ||
      (o.utrNumber && o.utrNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    const matchesStatus = selectedStatusFilter === "ALL" || o.orderStatus === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Admin Auth Login Screen if user is not admin authenticated
  if (!isAdminAuthed && (!user || !user.isLoggedIn || user.role !== 'admin')) {
    return (
      <div className="py-16 sm:py-24 bg-[#FFF9F5] min-h-screen font-poppins flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 border border-[#D4AF7F]/40 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-[#2C2C2C] text-[#C89B3C] rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-9 h-9 text-[#D4AF7F]" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-montserrat uppercase tracking-widest text-[#C89B3C] font-bold">Sparkle @ KKV Owner Portal</span>
            <h2 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C]">Private Administrator Sign In</h2>
            <p className="text-xs text-gray-500 font-light">Enter your private owner credentials to manage customer orders & store analytics.</p>
          </div>

          {loginError && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4 text-left font-poppins text-xs">
            <div>
              <label className="block text-[11px] font-montserrat font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Admin Email / Owner ID
              </label>
              <input
                type="text"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 text-xs focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-montserrat font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin passcode (e.g. admin123)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 text-xs focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2C2C2C] hover:bg-[#C89B3C] text-white font-montserrat font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Authenticate As Owner</span>
              <ShieldCheck className="w-4 h-4 text-[#D4AF7F]" />
            </button>
          </form>

          <p className="text-[10px] text-gray-400 font-light">
            🔒 Private Owner Access • Unlinked Secret Route
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#FFF9F5] min-h-screen font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-[#2C2C2C] via-[#3A2A30] to-[#2C2C2C] text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C89B3C]/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#C89B3C] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury text-2xl font-bold text-[#FCE4EC]">
                  Sparkle @ KKV Owner Admin Portal
                </h1>
                <span className="bg-[#C89B3C] text-white text-[10px] font-bold font-montserrat px-2.5 py-0.5 rounded-full uppercase">
                  Private Access
                </span>
              </div>
              <p className="text-xs text-gray-300 font-light mt-0.5">Manage live customer orders, UTR payment verification numbers & store analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="block font-bold text-base text-[#D4AF7F]">₹{totalRevenue}</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-300 font-montserrat font-bold">Total Revenue</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="block font-bold text-base text-[#F48FB1]">{liveOrders.length}</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-300 font-montserrat font-bold">Total Orders</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 font-montserrat text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-6 py-3 rounded-full transition-all shrink-0 flex items-center gap-2 ${adminTab === 'orders' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#FFF9F5]'}`}
          >
            <Package className="w-4 h-4 text-[#D4AF7F]" />
            <span>📦 Order Manager ({liveOrders.length})</span>
          </button>
          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-6 py-3 rounded-full transition-all shrink-0 flex items-center gap-2 ${adminTab === 'analytics' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#FFF9F5]'}`}
          >
            <DollarSign className="w-4 h-4 text-[#D4AF7F]" />
            <span>📊 Sales Analytics</span>
          </button>
          <button
            onClick={() => setAdminTab('subscribers')}
            className={`px-6 py-3 rounded-full transition-all shrink-0 flex items-center gap-2 ${adminTab === 'subscribers' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#FFF9F5]'}`}
          >
            <Users className="w-4 h-4 text-[#D4AF7F]" />
            <span>📬 VIP Subscribers ({subscribers ? subscribers.length : 0})</span>
          </button>
          <button
            onClick={() => setAdminTab('sqldb')}
            className={`px-6 py-3 rounded-full transition-all shrink-0 flex items-center gap-2 ${adminTab === 'sqldb' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#FFF9F5]'}`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>🗄️ SQL Database</span>
          </button>
        </div>

        {/* TAB 1: ORDER MANAGER */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Search & Filter Header Bar */}
            <div className="bg-white p-5 rounded-3xl border border-[#FCE4EC] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 font-poppins">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Order ID, Name, Phone, UTR..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl text-xs focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              {/* Status Filter Buttons & Clear All */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto font-montserrat text-[10px] font-bold uppercase">
                {['ALL', 'Order Received', 'Processing', 'Shipped', 'Delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${selectedStatusFilter === status ? 'bg-[#2C2C2C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {status}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg transition-colors shrink-0 font-bold flex items-center gap-1 shadow-sm"
                  title="Add customer order details manually from email or phone"
                >
                  <span>➕ Add Order</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAllOrders}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg transition-colors shrink-0 font-bold flex items-center gap-1"
                  title="Clear all test orders from Admin Portal"
                >
                  <span>🗑️ Clear All Orders</span>
                </button>
              </div>
            </div>

            {/* MANUAL ORDER CREATION MODAL */}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#FCE4EC] shadow-2xl space-y-4 font-poppins">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-serif-luxury font-bold text-lg text-[#2C2C2C]">➕ Add Customer Order</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
                  </div>

                  <form onSubmit={handleCreateManualOrder} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Customer Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kowshik / Priya Varma"
                        value={manualOrder.customerName}
                        onChange={(e) => setManualOrder({ ...manualOrder, customerName: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89B3C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="text"
                          placeholder="9493576797"
                          value={manualOrder.phone}
                          onChange={(e) => setManualOrder({ ...manualOrder, phone: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89B3C]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Total Paid (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="169"
                          value={manualOrder.totalAmount}
                          onChange={(e) => setManualOrder({ ...manualOrder, totalAmount: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89B3C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="customer@gmail.com"
                        value={manualOrder.email}
                        onChange={(e) => setManualOrder({ ...manualOrder, email: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89B3C]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Item Purchased Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Plumeria flower claw clip / Kundhan Kadas"
                        value={manualOrder.itemName}
                        onChange={(e) => setManualOrder({ ...manualOrder, itemName: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89B3C]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Delivery Street Address & City</label>
                      <input
                        type="text"
                        placeholder="Madhapur, Hyderabad - 500081"
                        value={manualOrder.street}
                        onChange={(e) => setManualOrder({ ...manualOrder, street: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89B3C]"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#2C2C2C] text-[#FCE4EC] rounded-xl font-bold hover:bg-[#3A2D32]"
                      >
                        Save Order to Admin
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Orders Cards List */}
            {filteredOrdersList.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#FCE4EC] space-y-3">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C]">No Customer Orders Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">When customers place orders on your website, they will automatically appear here with their UTR payment details.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrdersList.map(order => (
                  <div key={order.id} className="bg-white rounded-3xl p-6 border border-[#FCE4EC] shadow-sm space-y-5">
                    
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4 text-xs font-poppins gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-montserrat uppercase font-bold text-[#D4AF7F]">Order ID</span>
                          <h3 className="font-bold text-[#2C2C2C] font-mono text-base">{order.id}</h3>
                          <span className="text-gray-400 text-[11px]">({order.createdAt})</span>
                        </div>
                        <p className="text-xs font-bold text-[#2C2C2C] mt-1 flex flex-wrap items-center gap-2">
                          <span>👤 {order.customerName || order.shippingAddress?.fullName}</span>
                          <span>•</span>
                          <span>📱 {order.shippingAddress?.phone || order.phone || 'N/A'}</span>
                          {(order?.shippingAddress?.phone || order?.phone) && (
                            <a
                              href={`https://wa.me/91${String(order?.shippingAddress?.phone || order?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${order?.customerName || 'Customer'},\n\nThis is Sparkle @ KKV regarding your Order ${order?.id} (₹${order?.finalAmount || order?.cartTotal || 0}).`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-all"
                            >
                              <span>💬 WhatsApp</span>
                            </a>
                          )}
                          <span>•</span>
                          <span>✉️ {order.email || order.shippingAddress?.email || 'customer@sparklekkv.com'}</span>
                        </p>
                      </div>

                      {/* Payment & Order Status Badges */}
                      <div className="flex flex-wrap items-center gap-2 font-montserrat">
                        <span className="bg-[#FCE4EC] text-[#2C2C2C] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                          {order.paymentMethod || 'PhonePe / UPI'}
                        </span>

                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                          order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          Status: {order.orderStatus}
                        </span>
                      </div>
                    </div>

                    {/* Customer UTR & Delivery Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FFF9F5] p-4 rounded-2xl border border-[#FCE4EC] text-xs font-poppins">
                      <div className="space-y-1">
                        <span className="text-[10px] font-montserrat uppercase font-bold text-[#C89B3C] block">Verified Payment Details</span>
                        <p><strong>Payment Verification:</strong> <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">💬 Direct WhatsApp Alert Sent (+91 9949157771)</span></p>
                        <p><strong>Total Paid:</strong> <strong className="text-[#C89B3C] text-sm">₹{order.finalAmount || order.cartTotal}</strong></p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-montserrat uppercase font-bold text-[#C89B3C] block">Shipping & Delivery Target</span>
                        <p><strong>Delivery Address:</strong> {order.shippingAddress?.street || 'Madhapur'}, {order.shippingAddress?.city || 'Hyderabad'} - {order.shippingAddress?.pincode || '500081'}</p>
                        <p><strong>Guaranteed Delivery:</strong> <span className="text-emerald-700 font-bold">🚚 {order.estimatedDeliveryDate || 'Within 7 Business Days'}</span></p>
                        <p><strong>Tracking Ref:</strong> <span className="font-mono font-bold text-gray-700">{order.trackingNumber || 'SPK-IN-9812489'}</span></p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-montserrat uppercase font-bold text-gray-400 block">Ordered Items ({order.items?.length || 1})</span>
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-poppins bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <img src={item.image || "images/plumeria_flower.jpg"} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <h4 className="font-bold text-[#2C2C2C]">{item.name}</h4>
                              <span className="text-gray-500">Qty: {item.quantity} × ₹{item.price}</span>
                            </div>
                          </div>
                          <span className="font-bold text-[#2C2C2C]">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar - Update Order Status & Delete */}
                    <div className="border-t border-gray-100 pt-3 flex flex-wrap items-center justify-between font-montserrat text-xs gap-2">
                      <span className="text-gray-500 font-medium text-[11px]">Update Order Status:</span>

                      <div className="flex items-center gap-2">
                        {['Order Received', 'Processing', 'Shipped', 'Delivered'].map(statusOption => (
                          <button
                            key={statusOption}
                            onClick={() => handleUpdateOrderStatus(order.id, statusOption)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${
                              order.orderStatus === statusOption 
                                ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow-sm' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {statusOption}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleDeleteSingleOrder(order.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border border-red-200 ml-2"
                          title="Delete this order from Admin Portal"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SALES ANALYTICS */}
        {adminTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-montserrat">
              
              <div className="bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>Total Store Revenue</span>
                  <DollarSign className="w-5 h-5 text-[#C89B3C]" />
                </div>
                <p className="text-2xl font-extrabold text-[#2C2C2C]">₹{totalRevenue}</p>
                <span className="text-[10px] text-emerald-600 font-bold">Live Store Orders</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>Total Customer Orders</span>
                  <ShoppingBag className="w-5 h-5 text-[#F48FB1]" />
                </div>
                <p className="text-2xl font-extrabold text-[#2C2C2C]">{Array.isArray(liveOrders) ? liveOrders.length : 0}</p>
                <span className="text-[10px] text-emerald-600 font-bold">100% Guaranteed Fulfilled</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>Active Catalog Items</span>
                  <Package className="w-5 h-5 text-[#D4AF7F]" />
                </div>
                <p className="text-2xl font-extrabold text-[#2C2C2C]">{Array.isArray(products) ? products.length : 0}</p>
                <span className="text-[10px] text-gray-400">8 Luxury Categories</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>Active VIP Subscribers</span>
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-[#2C2C2C]">{Array.isArray(subscribers) ? subscribers.length : 0}</p>
                <span className="text-[10px] text-emerald-600 font-bold">FormSubmit Alerting Active</span>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: VIP SUBSCRIBERS DATABASE */}
        {adminTab === 'subscribers' && (
          <div className="bg-white rounded-3xl p-6 border border-[#FCE4EC] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">
                  📬 VIP Newsletter Subscribers Database
                </h3>
                <p className="text-xs text-gray-500 font-poppins mt-0.5">
                  Live subscriber email list. Real-time alerts dispatched to <strong>sparklekkvofficial@gmail.com</strong>.
                </p>
              </div>

              <button
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," + ["ID,Email,SubscribedAt,CouponCode,Status"].concat(
                    (subscribers || []).map(s => `${s.id},${s.email},"${s.subscribedAt}",${s.couponCode},${s.status}`)
                  ).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `sparkle_subscribers_${Date.now()}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  showToast("📥 Exported Subscribers database as CSV!");
                }}
                className="bg-[#2C2C2C] hover:bg-[#C89B3C] text-white font-montserrat font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#D4AF7F]" />
                <span>Export CSV Database</span>
              </button>
            </div>

            <div className="space-y-3 font-poppins text-xs">
              {(subscribers || []).map(sub => (
                <div key={sub.id} className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-[#2C2C2C] text-sm">{sub.email}</span>
                    <p className="text-gray-500 text-[11px]">Subscribed on: {new Date(sub.subscribedAt).toLocaleString()} • Code Issued: <strong className="text-[#C89B3C]">{sub.couponCode}</strong></p>
                  </div>

                  <button
                    onClick={() => deleteSubscriber(sub.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold font-montserrat uppercase underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SQL DATABASE MANAGER */}
        {adminTab === 'sqldb' && (
          <div className="space-y-8 font-poppins">
            
            {/* Header & Exporter Bar */}
            <div className="bg-white rounded-3xl p-6 border border-[#FCE4EC] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">
                  🗄️ SQL Database Engine (MSSQL / MySQL / PostgreSQL / SQLite)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Live relational SQL tables tracking logged-in users, customer profiles, and detailed item orders.
                </p>
              </div>

              <button
                onClick={() => {
                  const sqlContent = "data:text/plain;charset=utf-8," + encodeURIComponent(generateSQLDumpScript());
                  const link = document.createElement("a");
                  link.setAttribute("href", sqlContent);
                  link.setAttribute("download", `sparkle_store_database_${Date.now()}.sql`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  showToast("📥 Exported SQL Database Backup (.sql) successfully!");
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-montserrat font-bold text-xs px-5 py-3 rounded-2xl uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Export .SQL Database Backup</span>
              </button>
            </div>

            {/* Table 1: Logged-in Users */}
            <div className="bg-white rounded-3xl p-6 border border-[#FCE4EC] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="font-bold text-sm text-[#2C2C2C] font-montserrat uppercase flex items-center gap-2">
                  <span>👤 Logged-In Users SQL Table (`users`)</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    {getSQLLoggedInUsers().length} Registered Users
                  </span>
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF9F5] text-gray-500 uppercase font-montserrat text-[10px]">
                    <tr>
                      <th className="p-3">User ID</th>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Auth Method</th>
                      <th className="p-3">Last Login Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-poppins">
                    {getSQLLoggedInUsers().length === 0 ? (
                      <tr><td colSpan={7} className="p-6 text-center text-gray-400">No user login sessions recorded yet. Logged in users will appear here automatically.</td></tr>
                    ) : getSQLLoggedInUsers().map(u => (
                      <tr key={u.user_id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-[#C89B3C]">{u.user_id}</td>
                        <td className="p-3 font-bold text-[#2C2C2C]">{u.full_name}</td>
                        <td className="p-3 font-mono text-gray-600">{u.email}</td>
                        <td className="p-3 text-gray-600">{u.phone}</td>
                        <td className="p-3"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{u.role}</span></td>
                        <td className="p-3 text-gray-500">{u.auth_method}</td>
                        <td className="p-3 text-gray-500">{new Date(u.last_login_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Customer Orders & Purchased Items */}
            <div className="bg-white rounded-3xl p-6 border border-[#FCE4EC] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="font-bold text-sm text-[#2C2C2C] font-montserrat uppercase flex items-center gap-2">
                  <span>📦 Customer Orders & Items SQL Table (`orders` & `order_items`)</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    {getSQLOrders().length} SQL Orders
                  </span>
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF9F5] text-gray-500 uppercase font-montserrat text-[10px]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Phone & Email</th>
                      <th className="p-3">Purchased Items & Sizes</th>
                      <th className="p-3">Total Paid</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Delivery Address</th>
                      <th className="p-3">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-poppins">
                    {getSQLOrders().length === 0 ? (
                      <tr><td colSpan={8} className="p-6 text-center text-gray-400">No SQL orders recorded yet. Placed orders will automatically populate here.</td></tr>
                    ) : getSQLOrders().map(o => {
                      const items = getSQLOrderItems().filter(i => i.order_id === o.order_id);
                      return (
                        <tr key={o.order_id} className="hover:bg-gray-50">
                          <td className="p-3 font-mono font-bold text-[#2C2C2C]">{o.order_id}</td>
                          <td className="p-3 font-bold text-[#2C2C2C]">{o.customer_name}</td>
                          <td className="p-3 text-gray-600">
                            <div>📱 {o.phone}</div>
                            <div className="text-[11px] text-gray-400">✉️ {o.email}</div>
                          </td>
                          <td className="p-3 text-gray-700">
                            {items.length === 0 ? 'Plumeria flower claw clip' : items.map((i, idx) => (
                              <div key={idx} className="font-medium">
                                • {i.product_name} <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">Size {i.selected_size}</span> (Qty: {i.quantity}) - ₹{i.total_item_price}
                              </div>
                            ))}
                          </td>
                          <td className="p-3 font-extrabold text-[#C89B3C] text-sm">₹{o.final_paid_amount}</td>
                          <td className="p-3"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{o.payment_method}</span></td>
                          <td className="p-3 text-gray-600 text-[11px] max-w-xs">{o.shipping_street}, {o.shipping_city} - {o.shipping_pincode}</td>
                          <td className="p-3"><span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{o.order_status}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
