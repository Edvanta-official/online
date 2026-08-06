import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Sparkles, Menu, X, ShieldCheck, ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { NAVIGATION_TREE } from '../data/mockData';

export const Navbar = () => {
  const {
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    user,
    switchUserRole,
    products
  } = useShop();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const searchFilteredProducts = searchQuery.trim() === "" ? [] : products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 5);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 transition-all duration-300">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] text-xs py-2 px-4 text-center tracking-widest font-montserrat flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF7F] animate-pulse" />
        <span className="truncate">LUXURY FASHION ACCESSORIES • FREE PAN-INDIA EXPRESS SHIPPING ON ORDERS OVER ₹999</span>
        <span className="hidden sm:inline-block bg-[#D4AF7F] text-[#2C2C2C] font-bold px-2 py-0.5 rounded text-[10px] ml-2 shrink-0">
          CODE: SPARKEL10
        </span>
      </div>

      {/* Main Glass Header */}
      <nav className="glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Mobile Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#2C2C2C] hover:text-[#C89B3C] transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FCE4EC] via-[#F48FB1] to-[#D4AF7F] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-[#2C2C2C]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                  Sparkel <span className="gold-gradient-text">@KKL</span>
                </span>
                <span className="text-[9px] text-[#D4AF7F] font-montserrat tracking-widest uppercase hidden sm:block">
                  Luxury Fashion Accessories
                </span>
              </div>
            </Link>

            {/* Navigation Links - Desktop with Dropdowns */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-7 font-montserrat text-xs uppercase tracking-widest font-semibold text-[#2C2C2C]">
              <Link to="/" className="hover:text-[#C89B3C] transition-colors whitespace-nowrap">Home</Link>
              <Link to="/shop" className="hover:text-[#C89B3C] transition-colors whitespace-nowrap">Shop All</Link>

              {/* Dynamic Category Navigation Tree */}
              {NAVIGATION_TREE.map(cat => (
                <div
                  key={cat.id}
                  className="relative group py-6"
                  onMouseEnter={() => setActiveDropdown(cat.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={`/shop?category=${cat.id}`}
                    className="hover:text-[#C89B3C] transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>{cat.name}</span>
                    <ChevronDown className="w-3 h-3 text-[#D4AF7F]" />
                  </Link>

                  {/* Dropdown Menu */}
                  {activeDropdown === cat.id && (
                    <div className="absolute top-full left-0 w-48 bg-white rounded-2xl shadow-xl border border-[#FCE4EC] py-2 z-50 animate-in fade-in">
                      {cat.subcategories.map(sub => (
                        <Link
                          key={sub.id}
                          to={`/shop?category=${cat.id}&subcategory=${sub.id}`}
                          className="block px-4 py-2 hover:bg-[#FFF9F5] text-[11px] text-[#2C2C2C] hover:text-[#C89B3C] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3 shrink-0">
              
              {/* Search Bar - Desktop */}
              <div className="relative hidden xl:block w-48">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Search SKU or item..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    className="w-full bg-[#FFF9F5]/90 border border-[#D4AF7F]/40 focus:border-[#C89B3C] rounded-full py-1.5 pl-4 pr-9 text-xs font-poppins focus:outline-none focus:ring-2 focus:ring-[#FCE4EC] transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF7F] hover:text-[#C89B3C]">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Search Autocomplete Results */}
                {showSearchResults && searchFilteredProducts.length > 0 && (
                  <div className="absolute top-full mt-2 w-72 right-0 bg-white rounded-2xl shadow-xl border border-[#FCE4EC] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-montserrat uppercase tracking-wider text-[#D4AF7F] px-3 py-1 font-semibold">Suggested Items</p>
                    {searchFilteredProducts.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          navigate(`/product/${prod.id}`);
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-[#FFF9F5] rounded-xl cursor-pointer transition-colors"
                      >
                        <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium truncate text-[#2C2C2C]">{prod.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">SKU: {prod.sku}</span>
                          <span className="text-xs font-semibold text-[#C89B3C]">₹{prod.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 text-[#2C2C2C] hover:text-[#C89B3C] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#F48FB1] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-[#2C2C2C] hover:text-[#C89B3C] transition-colors group"
                aria-label="Cart"
              >
                <div className="bg-[#FCE4EC] p-2 rounded-full group-hover:bg-[#D4AF7F]/20 transition-colors">
                  <ShoppingBag className="w-5 h-5 text-[#2C2C2C]" />
                </div>
                {totalCartItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#C89B3C] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* User Account / Role Switcher Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-[#D4AF7F]/40 hover:border-[#C89B3C] transition-all bg-[#FFF9F5]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#2C2C2C] text-[#FCE4EC] flex items-center justify-center text-xs font-bold font-montserrat">
                    {user.role === 'admin' ? 'AD' : user.name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#2C2C2C]" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#FCE4EC] py-2 z-50 font-poppins text-xs">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-[#2C2C2C]">{user.name}</p>
                      <p className="text-[11px] text-gray-500">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#FCE4EC] text-[#2C2C2C] text-[10px] font-semibold rounded-full uppercase font-montserrat">
                        Role: {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {user.role === 'admin' ? (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-[#FFF9F5] text-[#C89B3C] font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4" /> Admin Portal
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-[#FFF9F5] text-[#2C2C2C]"
                        >
                          <User className="w-4 h-4" /> My Account & Orders
                        </Link>
                      )}
                    </div>

                    {/* Role Switcher Demo Toggle */}
                    <div className="border-t border-gray-100 pt-2 px-4 pb-1">
                      <p className="text-[10px] font-montserrat uppercase text-gray-400 mb-1">Interactive Mode Switch</p>
                      <div className="grid grid-cols-2 gap-1 bg-[#F5F5F5] p-1 rounded-xl">
                        <button
                          onClick={() => {
                            switchUserRole('customer');
                            setIsUserMenuOpen(false);
                            navigate('/dashboard');
                          }}
                          className={`py-1 rounded-lg text-[10px] font-semibold transition-all ${user.role === 'customer' ? 'bg-white shadow text-[#2C2C2C]' : 'text-gray-500'}`}
                        >
                          Customer
                        </button>
                        <button
                          onClick={() => {
                            switchUserRole('admin');
                            setIsUserMenuOpen(false);
                            navigate('/admin');
                          }}
                          className={`py-1 rounded-lg text-[10px] font-semibold transition-all ${user.role === 'admin' ? 'bg-[#C89B3C] text-white shadow' : 'text-gray-500'}`}
                        >
                          Admin Mode
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#FCE4EC] bg-white px-4 pt-3 pb-6 font-montserrat text-xs uppercase tracking-wider space-y-3 animate-in fade-in">
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-full py-2 pl-4 pr-10 text-xs font-poppins"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF7F]">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-100">Home</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-100">Shop All</Link>

            {NAVIGATION_TREE.map(cat => (
              <div key={cat.id} className="py-2 border-b border-gray-100">
                <Link to={`/shop?category=${cat.id}`} onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-[#C89B3C] block mb-1">
                  {cat.name}
                </Link>
                <div className="pl-3 space-y-1 text-gray-600">
                  {cat.subcategories.map(sub => (
                    <Link
                      key={sub.id}
                      to={`/shop?category=${cat.id}&subcategory=${sub.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-0.5 hover:text-black"
                    >
                      • {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
