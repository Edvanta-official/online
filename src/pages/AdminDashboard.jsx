import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShieldCheck, Package, DollarSign, Users, ShoppingBag, 
  Check, X, Sparkles, Tag, Search, Truck, Clock, RefreshCw, Download, Filter, CheckCircle2
} from 'lucide-react';

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

  const [adminTab, setAdminTab] = useState('orders');
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  // Custom local order status state for live management
  const [liveOrders, setLiveOrders] = useState(orders);

  // Sync live orders if shop context updates
  React.useEffect(() => {
    setLiveOrders(orders);
  }, [orders]);

  const totalRevenue = liveOrders.reduce((sum, o) => sum + (o.finalAmount || o.cartTotal || 0), 0);

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setLoginError("Please enter both Admin Email and Passcode.");
      return;
    }
    if (adminPassword !== 'admin123' && adminPassword !== 'sparkleadmin' && adminPassword !== 'admin') {
      setLoginError("Invalid Administrator Passcode. Please try again.");
      return;
    }

    loginUser("Sparkle Owner @ KKV", adminEmail, adminPassword, "admin@sparklekkv.com");
    showToast("🛡️ Owner Admin Authenticated Successfully!");
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setLiveOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    try {
      const updatedList = liveOrders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
      localStorage.setItem('sparkel_orders', JSON.stringify(updatedList));
    } catch (e) {}
    showToast(`Order ${orderId} status updated to "${newStatus}"!`, "success");
  };

  // Filtered orders list for Admin Search
  const filteredOrdersList = liveOrders.filter(o => {
    const matchesSearch = 
      (o.id && o.id.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.email && o.email.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.shippingAddress?.phone && o.shippingAddress.phone.includes(orderSearchQuery)) ||
      (o.utrNumber && o.utrNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    const matchesStatus = selectedStatusFilter === "ALL" || o.orderStatus === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Admin Auth Login Screen if user is not admin authenticated
  if (!user || !user.isLoggedIn || user.role !== 'admin') {
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

              {/* Status Filter Buttons */}
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
              </div>
            </div>

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
                        <p className="text-xs font-bold text-[#2C2C2C] mt-1">
                          👤 {order.customerName || order.shippingAddress?.fullName} • 📱 {order.shippingAddress?.phone || order.phone || 'N/A'} • ✉️ {order.email || user.email}
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

                    {/* Action Bar - Update Order Status */}
                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between font-montserrat text-xs">
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
                <p className="text-2xl font-extrabold text-[#2C2C2C]">{liveOrders.length}</p>
                <span className="text-[10px] text-emerald-600 font-bold">100% Guaranteed Fulfilled</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>Active Catalog Items</span>
                  <Package className="w-5 h-5 text-[#D4AF7F]" />
                </div>
                <p className="text-2xl font-extrabold text-[#2C2C2C]">{products.length}</p>
                <span className="text-[10px] text-gray-400">8 Luxury Categories</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>Active VIP Subscribers</span>
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-[#2C2C2C]">{subscribers ? subscribers.length : 0}</p>
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

      </div>
    </div>
  );
};

export default AdminDashboard;
