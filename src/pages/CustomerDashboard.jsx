import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Package, MapPin, Tag, Bell, User, Truck, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const CustomerDashboard = () => {
  const { user, orders, wishlist, products, COUPONS } = useShop();
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="py-12 bg-[#FFF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profile Summary Banner */}
        <div className="bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#D4AF7F]/30">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FCE4EC] via-[#F48FB1] to-[#D4AF7F] text-[#2C2C2C] font-serif-luxury text-2xl font-bold flex items-center justify-center border-2 border-white shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif-luxury text-2xl font-bold text-[#FCE4EC]">{user.name}</h1>
                <span className="bg-[#D4AF7F] text-[#2C2C2C] text-[10px] font-bold font-montserrat px-2 py-0.5 rounded-full uppercase">
                  Sparkel VIP Member
                </span>
              </div>
              <p className="text-xs text-gray-300 font-poppins">{user.email} • +91 9949157771</p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-montserrat text-xs">
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="block font-bold text-base text-[#D4AF7F]">{orders.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-300">Total Orders</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="block font-bold text-base text-[#F48FB1]">{wishlist.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-300">Wishlist</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2 font-montserrat text-xs uppercase font-bold tracking-wider">
            <div className="bg-white rounded-3xl p-4 border border-[#FCE4EC] shadow-sm space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow' : 'text-gray-600 hover:bg-[#FFF9F5]'}`}
              >
                <Package className="w-4 h-4 text-[#D4AF7F]" />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'addresses' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow' : 'text-gray-600 hover:bg-[#FFF9F5]'}`}
              >
                <MapPin className="w-4 h-4 text-[#D4AF7F]" />
                <span>Saved Addresses</span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'coupons' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow' : 'text-gray-600 hover:bg-[#FFF9F5]'}`}
              >
                <Tag className="w-4 h-4 text-[#D4AF7F]" />
                <span>Coupons & Rewards</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'notifications' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow' : 'text-gray-600 hover:bg-[#FFF9F5]'}`}
              >
                <Bell className="w-4 h-4 text-[#D4AF7F]" />
                <span>Notifications</span>
              </button>
            </div>
          </div>

          {/* Main Tab Content Display */}
          <div className="lg:col-span-9">
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">
                  Order History & Live Progress Tracker
                </h2>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-[#FCE4EC] space-y-3">
                    <p className="text-xs text-gray-500">No orders placed yet.</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-white rounded-3xl p-6 border border-[#FCE4EC] shadow-sm space-y-6">
                      
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4 text-xs font-poppins gap-2">
                        <div>
                          <span className="text-[10px] font-montserrat uppercase font-bold text-[#D4AF7F]">Order Ref</span>
                          <h3 className="font-bold text-[#2C2C2C] font-mono text-sm">{order.id}</h3>
                          <span className="text-gray-400 text-[11px]">{order.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-3 font-montserrat">
                          <span className="bg-[#FCE4EC] text-[#2C2C2C] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                            {order.paymentMethod}
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                            Status: {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Live Order Timeline Stepper */}
                      <div className="bg-[#FFF9F5] p-4 rounded-2xl border border-[#FCE4EC]">
                        <span className="text-[10px] font-montserrat uppercase font-bold text-[#C89B3C] block mb-3">
                          Live Order Progress Tracker
                        </span>
                        <div className="grid grid-cols-4 gap-2 text-center font-montserrat text-[10px] font-bold">
                          <div className="flex flex-col items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>1. Placed</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>2. Processing</span>
                          </div>
                          <div className={`flex flex-col items-center gap-1 ${order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? 'text-emerald-600' : 'text-gray-400'}`}>
                            <Truck className="w-5 h-5" />
                            <span>3. Shipped</span>
                          </div>
                          <div className={`flex flex-col items-center gap-1 ${order.orderStatus === 'Delivered' ? 'text-emerald-600' : 'text-gray-400'}`}>
                            <Sparkles className="w-5 h-5" />
                            <span>4. Delivered</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs font-poppins">
                            <div className="flex items-center gap-3">
                              <img src={item.image || "images/butterfly_clip.jpg"} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                              <div>
                                <h4 className="font-bold text-[#2C2C2C]">{item.name}</h4>
                                <span className="text-gray-500">Qty: {item.quantity} × ₹{item.price}</span>
                              </div>
                            </div>
                            <span className="font-bold text-[#2C2C2C]">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs font-montserrat">
                        <span className="text-gray-500">Tracking Code: <strong className="text-[#2C2C2C] font-mono">{order.trackingNumber}</strong></span>
                        <span className="font-bold text-sm text-[#C89B3C]">Total: ₹{order.finalAmount}</span>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 border border-[#FCE4EC] space-y-4">
                <h2 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">
                  Saved Delivery Addresses
                </h2>
                {user.savedAddresses.map(addr => (
                  <div key={addr.id} className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC] text-xs font-poppins space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#2C2C2C]">
                      <span>{addr.fullName} ({addr.phone})</span>
                      <span className="bg-[#D4AF7F] text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-montserrat">Default</span>
                    </div>
                    <p className="text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                ))}
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div className="space-y-4">
                <h2 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">
                  Available VIP Promo Coupons
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-montserrat">
                  {COUPONS.map(c => (
                    <div key={c.code} className="bg-gradient-to-r from-[#FFF9F5] to-[#FCE4EC] p-5 rounded-3xl border border-[#D4AF7F]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold text-[#2C2C2C] font-mono tracking-wider">{c.code}</span>
                        <span className="bg-[#C89B3C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{c.discountPercent}% OFF</span>
                      </div>
                      <p className="text-xs text-gray-600 font-poppins">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-3xl p-6 border border-[#FCE4EC] space-y-3 font-poppins text-xs">
                <h2 className="font-serif-luxury text-xl font-bold text-[#2C2C2C] mb-4">
                  Account Notifications
                </h2>
                <div className="p-3 bg-[#FFF9F5] rounded-xl border-l-4 border-[#C89B3C]">
                  <p className="font-bold text-[#2C2C2C]">✨ Order #ORD-98241 Shipped!</p>
                  <p className="text-gray-500 text-[11px]">Your luxury parcel is out for express delivery via BlueDart.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-[#F48FB1]">
                  <p className="font-bold text-[#2C2C2C]">🎁 Welcome VIP Gift!</p>
                  <p className="text-gray-500 text-[11px]">Use Code SPARKEL10 for 10% discount on your next luxury purchase.</p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
