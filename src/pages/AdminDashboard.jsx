import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Plus, Edit, Trash2, Package, DollarSign, Users, ShoppingBag, Check, X, Sparkles, Tag, Layers, RefreshCw } from 'lucide-react';

export const AdminDashboard = () => {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    COUPONS,
    showToast
  } = useShop();

  const [adminTab, setAdminTab] = useState('analytics');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State for Add / Edit product
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'hair-clips',
    categoryName: 'Hair Clips',
    price: 199,
    originalPrice: 299,
    stock: 20,
    description: '',
    isNew: true,
    isTrending: false,
    isFlashSale: false,
    images: ['images/butterfly_clip.jpg']
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.finalAmount, 0);

  const handleProductFormSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      setEditingProduct(null);
    } else {
      addProduct(productForm);
    }
    setIsAddProductModalOpen(false);
    setProductForm({
      name: '',
      category: 'hair-clips',
      categoryName: 'Hair Clips',
      price: 199,
      originalPrice: 299,
      stock: 20,
      description: '',
      isNew: true,
      isTrending: false,
      isFlashSale: false,
      images: ['images/butterfly_clip.jpg']
    });
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setProductForm(p);
    setIsAddProductModalOpen(true);
  };

  return (
    <div className="py-12 bg-[#FFF9F5] min-h-screen font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-[#2C2C2C] via-[#3A2A30] to-[#2C2C2C] text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C89B3C]/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#C89B3C] text-white flex items-center justify-center font-bold text-xl shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury text-2xl font-bold text-[#FCE4EC]">
                  Sparkel Admin Control Panel
                </h1>
                <span className="bg-[#C89B3C] text-white text-[10px] font-bold font-montserrat px-2.5 py-0.5 rounded-full uppercase">
                  Live Management
                </span>
              </div>
              <p className="text-xs text-gray-300">Manage catalog products, orders, inventory & store analytics</p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsAddProductModalOpen(true);
            }}
            className="shimmer-btn bg-gradient-to-r from-[#D4AF7F] to-[#C89B3C] text-[#2C2C2C] font-montserrat font-bold text-xs px-6 py-3 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Accessory
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 font-montserrat text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-5 py-2.5 rounded-full transition-all shrink-0 ${adminTab === 'analytics' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            📊 Analytics & Sales
          </button>
          <button
            onClick={() => setAdminTab('products')}
            className={`px-5 py-2.5 rounded-full transition-all shrink-0 ${adminTab === 'products' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            🛍️ Products CRUD ({products.length})
          </button>
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-5 py-2.5 rounded-full transition-all shrink-0 ${adminTab === 'orders' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            📦 Order Status Manager ({orders.length})
          </button>
          <button
            onClick={() => setAdminTab('coupons')}
            className={`px-5 py-2.5 rounded-full transition-all shrink-0 ${adminTab === 'coupons' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            🏷️ Promo Coupons
          </button>
        </div>

        {/* TAB 1: ANALYTICS */}
        {adminTab === 'analytics' && (
          <div className="space-y-8">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-montserrat">
              
              <div className="bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>Total Store Revenue</span>
                  <DollarSign className="w-5 h-5 text-[#C89B3C]" />
                </div>
                <p className="text-2xl font-extrabold text-[#2C2C2C]">₹{totalRevenue}</p>
                <span className="text-[10px] text-emerald-600 font-bold">+18.4% from last month</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-5 h-5 text-[#F48FB1]" />
                </div>
                <p className="text-2xl font-extrabold text-[#2C2C2C]">{orders.length}</p>
                <span className="text-[10px] text-emerald-600 font-bold">100% Fulfilled</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>Active Catalog Items</span>
                  <Package className="w-5 h-5 text-[#D4AF7F]" />
                </div>
                <p className="text-2xl font-extrabold text-[#2C2C2C]">{products.length}</p>
                <span className="text-[10px] text-gray-400">8 Categories</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>Active VIP Customers</span>
                  <Users className="w-5 h-5 text-[#2C2C2C]" />
                </div>
                <p className="text-2xl font-extrabold text-[#2C2C2C]">1,420</p>
                <span className="text-[10px] text-emerald-600 font-bold">3.8% Conversion Rate</span>
              </div>

            </div>

            {/* Sales Performance Chart Simulation */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-4">
              <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">
                Monthly Sales & Revenue Growth (INR)
              </h3>
              <div className="h-48 flex items-end gap-4 pt-8 border-b border-gray-100">
                {[
                  { month: 'Jan', val: 30 },
                  { month: 'Feb', val: 45 },
                  { month: 'Mar', val: 40 },
                  { month: 'Apr', val: 65 },
                  { month: 'May', val: 75 },
                  { month: 'Jun', val: 90 },
                  { month: 'Jul', val: 100 }
                ].map((bar) => (
                  <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <div
                      className="w-full bg-gradient-to-t from-[#D4AF7F] to-[#C89B3C] rounded-t-xl group-hover:from-[#F48FB1] transition-all"
                      style={{ height: `${bar.val}%` }}
                    />
                    <span className="text-[10px] font-montserrat font-bold text-gray-500">{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {adminTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-[#FCE4EC] shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">
                Products Inventory Catalog
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left font-poppins">
                <thead className="bg-[#FFF9F5] text-[#2C2C2C] font-montserrat uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Badges</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-[#FFF9F5]/60 transition-colors">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                        <span className="font-bold text-[#2C2C2C] truncate max-w-xs">{p.name}</span>
                      </td>
                      <td className="p-3 font-montserrat">{p.categoryName}</td>
                      <td className="p-3 font-bold text-[#C89B3C]">₹{p.price}</td>
                      <td className="p-3 font-semibold">{p.stock || 15} pcs</td>
                      <td className="p-3 space-x-1">
                        {p.isNew && <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full font-montserrat">NEW</span>}
                        {p.isFlashSale && <span className="bg-[#C89B3C] text-white text-[9px] px-2 py-0.5 rounded-full font-montserrat">FLASH</span>}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 bg-[#FFF9F5] text-[#C89B3C] rounded-lg border border-[#D4AF7F]/40 hover:bg-[#FCE4EC]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {adminTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-[#FCE4EC] shadow-sm space-y-4">
            <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">
              Customer Orders Management
            </h3>

            <div className="space-y-4">
              {orders.map(o => (
                <div key={o.id} className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#2C2C2C]">{o.id}</span>
                    <p className="text-gray-600">{o.customerName} • {o.items.length} items • ₹{o.finalAmount}</p>
                    <span className="text-[10px] text-gray-400">Tracking: {o.trackingNumber}</span>
                  </div>

                  <div className="flex items-center gap-3 font-montserrat">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-[10px]">
                      {o.orderStatus}
                    </span>
                    <button
                      onClick={() => showToast(`Order ${o.id} status updated!`)}
                      className="bg-[#2C2C2C] text-[#FCE4EC] px-4 py-2 rounded-xl text-[10px] font-bold"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {adminTab === 'coupons' && (
          <div className="bg-white rounded-3xl p-6 border border-[#FCE4EC] space-y-4">
            <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">
              Active Store Coupons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-montserrat text-xs">
              {COUPONS.map(c => (
                <div key={c.code} className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <span className="font-mono font-extrabold text-base text-[#2C2C2C] block">{c.code}</span>
                  <span className="text-[#C89B3C] font-bold">{c.discountPercent}% OFF</span>
                  <p className="text-[11px] text-gray-500 font-poppins mt-1">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD / EDIT PRODUCT MODAL */}
        {isAddProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#FCE4EC] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C]">
                  {editingProduct ? 'Edit Accessory Details' : 'Add New Fashion Accessory'}
                </h3>
                <button onClick={() => setIsAddProductModalOpen(false)} className="text-gray-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductFormSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-2.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        category: e.target.value,
                        categoryName: e.target.options[e.target.selectedIndex].text
                      })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-2.5 font-montserrat"
                    >
                      <option value="earrings">Earrings</option>
                      <option value="hair-flowers">Hair Flowers</option>
                      <option value="hair-clips">Hair Clips</option>
                      <option value="scrunchies">Scrunchies</option>
                      <option value="bangles">Bangles</option>
                      <option value="bracelets">Bracelets</option>
                      <option value="necklaces">Necklace Sets</option>
                      <option value="gift-sets">Gift Sets</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-2.5"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-2.5"
                  />
                </div>

                <div className="flex gap-4 font-montserrat pt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isNew}
                      onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                    />
                    <span>New Arrival Badge</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFlashSale}
                      onChange={(e) => setProductForm({ ...productForm, isFlashSale: e.target.checked })}
                    />
                    <span>Flash Sale</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-2 font-montserrat">
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#2C2C2C] text-[#FCE4EC] font-bold uppercase"
                  >
                    Save Product
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
