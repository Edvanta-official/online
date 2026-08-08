import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Sparkles, Menu, X, ShieldCheck, ChevronDown, Home, Grid, Lock, Eye, EyeOff } from 'lucide-react';
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
    loginUser,
    logoutUser,
    isLoginModalOpen,
    setIsLoginModalOpen,
    products
  } = useShop();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const [loginForm, setLoginForm] = useState({ name: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Active Route Helpers
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category');
  const isSearchActive = !!searchParams.get('search');

  const isHomeActive = currentPath === '/' && !activeCategory && !isSearchActive;
  const isShopAllActive = currentPath === '/shop' && !activeCategory && !isSearchActive;

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
      setIsMobileMenuOpen(false);
    }
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('about');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 transition-all duration-300">
      {/* Announcement Bar with Marquee Tag */}
      <div className="bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] py-2 px-3 tracking-widest font-montserrat shadow-sm border-b border-[#D4AF7F]/30 overflow-hidden flex items-center">
        <marquee behavior="scroll" direction="left" scrollamount="6" className="font-montserrat text-[11px] sm:text-xs tracking-widest uppercase flex items-center gap-4 py-0.5">
          ✨ LUXURY FASHION ACCESSORIES • SPECIAL OFFER: AUTOMATIC 30% OFF + FREE PAN-INDIA EXPRESS SHIPPING ON ALL ORDERS OVER ₹999 • USE PROMO CODE: <span className="bg-[#D4AF7F] text-[#2C2C2C] font-bold px-2 py-0.5 rounded text-[10px] mx-1 inline-block">CODE: SPARKEL30</span> FOR 30% OFF • 100% HANDCRAFTED ANTI-TARNISH FINISH • SIGNATURE VELVET BOX PACKAGING ✨
        </marquee>
      </div>

      {/* Main Glass Header */}
      <nav className="glass-header border-b border-[#FCE4EC]/60 shadow-xs">
        
        {/* Tier 1: Brand Bar (Logo + Search Bar + Actions) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-1.5 sm:gap-4">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-[#2C2C2C] hover:text-[#C89B3C] bg-[#FFF9F5] rounded-xl border border-[#D4AF7F]/30 transition-colors shadow-xs"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Brand Logo - Sparkel @kkv with smaller kkv size */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-3 group shrink-0">
              <div className="relative flex items-center justify-center">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl bg-gradient-to-tr from-[#FCE4EC] via-[#F48FB1] to-[#D4AF7F] p-[2px] shadow-md group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-[#FFF9F5] rounded-[6px] sm:rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#C89B3C] group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-base sm:text-2xl font-bold tracking-tight text-[#2C2C2C] leading-none group-hover:text-[#C89B3C] transition-colors flex items-baseline">
                  SPARKEL @<span className="text-[#D4AF7F] font-poppins text-[10px] sm:text-xs font-semibold lowercase ml-0.5 tracking-normal">kkv</span>
                </span>
                <span className="text-[8px] sm:text-[8.5px] text-[#D4AF7F] font-montserrat tracking-[0.2em] uppercase hidden sm:block mt-1 font-medium">
                  Luxury Fashion Accessories
                </span>
              </div>
            </Link>

            {/* Search Bar - Center (Desktop Tier 1) */}
            <div className="relative hidden lg:block flex-1 max-w-md mx-6">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search SKU, Kundan, Hair Clips..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    className="w-full bg-[#FFF9F5]/90 border border-[#D4AF7F]/40 focus:border-[#C89B3C] rounded-full py-2 pl-4 pr-10 text-xs font-poppins focus:outline-none focus:ring-2 focus:ring-[#FCE4EC] shadow-inner transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF7F] hover:text-[#C89B3C] p-1">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Search Autocomplete Results */}
              {showSearchResults && searchFilteredProducts.length > 0 && (
                <div className="absolute top-full mt-2 w-full left-0 bg-white rounded-2xl shadow-xl border border-[#FCE4EC] p-2 z-50 animate-in fade-in slide-in-from-top-2">
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

            {/* Right Action Controls (Wishlist, Cart, User Menu) */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              
              {/* Wishlist Icon */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-1.5 text-[#2C2C2C] hover:text-[#C89B3C] transition-colors"
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
                className="relative p-1 text-[#2C2C2C] hover:text-[#C89B3C] transition-colors group"
                aria-label="Cart"
              >
                <div className="bg-[#FCE4EC] p-1.5 sm:p-2 rounded-full group-hover:bg-[#D4AF7F]/20 transition-colors flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#2C2C2C]" />
                  {totalCartItems > 0 && (
                    <span className="text-xs font-bold text-[#2C2C2C] pr-1 hidden sm:inline">
                      {totalCartItems} {totalCartItems === 1 ? 'Item' : 'Items'}
                    </span>
                  )}
                </div>
                {totalCartItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#C89B3C] text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-bounce sm:hidden">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* User Account / Role Switcher Menu (Desktop) */}
              <div className="relative hidden sm:block">
                {user.isLoggedIn ? (
                  <>
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
                          <button
                            onClick={() => {
                              logoutUser();
                              setIsUserMenuOpen(false);
                              navigate('/');
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 font-semibold"
                          >
                            <X className="w-4 h-4" /> Sign Out
                          </button>
                        </div>

                        {/* Role Switcher Toggle */}
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
                  </>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D4AF7F]/40 hover:border-[#C89B3C] text-xs font-semibold font-montserrat hover:bg-[#2C2C2C] hover:text-[#FCE4EC] transition-all bg-[#FFF9F5] text-[#2C2C2C]"
                  >
                    <User className="w-3.5 h-3.5 text-[#D4AF7F]" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Tier 2: Category Navigation Bar (Desktop Dedicated Row) */}
        <div className="hidden lg:block border-t border-[#FCE4EC]/80 bg-white/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-6 xl:gap-9 font-montserrat text-xs uppercase tracking-widest font-semibold text-[#2C2C2C] h-11">
              
              <Link
                to="/"
                className={`transition-colors relative py-3 group whitespace-nowrap flex items-center gap-1.5 ${
                  isHomeActive ? 'text-[#C89B3C] font-bold' : 'hover:text-[#C89B3C]'
                }`}
              >
                <span>Home</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C89B3C] transition-transform duration-300 ${
                  isHomeActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>

              <a
                href="#about"
                onClick={handleAboutClick}
                className="transition-colors relative py-3 group whitespace-nowrap flex items-center gap-1.5 hover:text-[#C89B3C]"
              >
                <span>About Us</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C89B3C] transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
              </a>

              <Link
                to="/shop"
                className={`transition-colors relative py-3 group whitespace-nowrap flex items-center gap-1.5 ${
                  isShopAllActive ? 'text-[#C89B3C] font-bold' : 'hover:text-[#C89B3C]'
                }`}
              >
                <span>Shop All</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C89B3C] transition-transform duration-300 ${
                  isShopAllActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>

              {NAVIGATION_TREE.map(cat => {
                const isCatActive = activeCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="relative group py-3"
                    onMouseEnter={() => setActiveDropdown(cat.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      to={`/shop?category=${cat.id}`}
                      className={`transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                        isCatActive ? 'text-[#C89B3C] font-bold' : 'hover:text-[#C89B3C]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronDown className="w-3 h-3 text-[#D4AF7F] group-hover:rotate-180 transition-transform duration-200" />
                    </Link>

                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C89B3C] transition-transform duration-300 ${
                      isCatActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />

                    {activeDropdown === cat.id && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-white rounded-2xl shadow-xl border border-[#FCE4EC] py-2 z-50 animate-in fade-in">
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
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu - Ultra Clear & Spacious */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#FCE4EC] bg-white/95 backdrop-blur-2xl px-4 pt-4 pb-8 font-montserrat text-xs uppercase tracking-wider space-y-4 animate-in fade-in shadow-2xl">
            
            {/* User Account Info Bar on Mobile */}
            <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#D4AF7F]/30 flex items-center justify-between font-poppins text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2C2C2C] text-[#FCE4EC] flex items-center justify-center font-bold font-montserrat text-xs">
                  {user.role === 'admin' ? 'AD' : user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[#2C2C2C]">{user.name}</p>
                  <p className="text-[10px] text-gray-500">{user.role === 'admin' ? 'Administrator' : user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#F5F5F5] p-1 rounded-xl">
                <button
                  onClick={() => switchUserRole(user.role === 'admin' ? 'customer' : 'admin')}
                  className="px-2.5 py-1 bg-white shadow-xs rounded-lg text-[10px] font-bold text-[#C89B3C]"
                >
                  {user.role === 'admin' ? 'Customer Mode' : 'Admin Mode'}
                </button>
              </div>
            </div>

            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className="mb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/50 focus:border-[#C89B3C] rounded-full py-2.5 pl-4 pr-10 text-xs font-poppins focus:outline-none focus:ring-2 focus:ring-[#FCE4EC]"
                />
                <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D4AF7F]">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Navigation Links */}
            <div className="space-y-1.5">
              
              {/* HOME LINK IN MOBILE DRAWER */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  isHomeActive
                    ? 'bg-[#FFF9F5] text-[#C89B3C] border-l-4 border-[#C89B3C] shadow-xs'
                    : 'text-[#2C2C2C] hover:bg-[#FFF9F5] hover:text-[#C89B3C]'
                }`}
              >
                <Home className="w-4 h-4 text-[#D4AF7F]" />
                <span>Home</span>
              </Link>

              {/* ABOUT US LINK IN MOBILE DRAWER */}
              <a
                href="#about"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleAboutClick(e);
                }}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[#2C2C2C] hover:bg-[#FFF9F5] hover:text-[#C89B3C] transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF7F]" />
                <span>About Us</span>
              </a>

              {/* SHOP ALL LINK IN MOBILE DRAWER */}
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  isShopAllActive
                    ? 'bg-[#FFF9F5] text-[#C89B3C] border-l-4 border-[#C89B3C] shadow-xs'
                    : 'text-[#2C2C2C] hover:bg-[#FFF9F5] hover:text-[#C89B3C]'
                }`}
              >
                <Grid className="w-4 h-4 text-[#D4AF7F]" />
                <span>Shop All</span>
              </Link>

              {/* CATEGORY ACCORDION LIST */}
              {NAVIGATION_TREE.map(cat => {
                const isCatActive = activeCategory === cat.id;
                const isExpanded = expandedMobileCategory === cat.id;

                return (
                  <div key={cat.id} className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/shop?category=${cat.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex-1 px-3.5 py-2.5 font-bold transition-colors ${
                          isCatActive ? 'text-[#C89B3C] bg-[#FFF9F5]' : 'text-[#2C2C2C] hover:text-[#C89B3C]'
                        }`}
                      >
                        {cat.name}
                      </Link>

                      <button
                        onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.id)}
                        className="p-2.5 text-[#D4AF7F] hover:text-[#C89B3C]"
                        aria-label="Expand category"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="bg-[#FFF9F5]/70 px-4 py-2 space-y-1.5 border-t border-gray-100 text-[11px] font-medium lowercase font-poppins">
                        {cat.subcategories.map(sub => (
                          <Link
                            key={sub.id}
                            to={`/shop?category=${cat.id}&subcategory=${sub.id}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-1 text-gray-600 hover:text-[#C89B3C] transition-colors"
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Action Links inside Mobile Drawer */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-around text-xs font-poppins text-gray-600 font-medium">
              <button onClick={() => { setIsWishlistOpen(true); setIsMobileMenuOpen(false); }} className="hover:text-[#C89B3C]">
                💖 Wishlist ({wishlist.length})
              </button>
              <span className="text-gray-300">•</span>
              <button onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }} className="hover:text-[#C89B3C]">
                🛍️ Cart ({totalCartItems})
              </button>
              <span className="text-gray-300">•</span>
              {user.isLoggedIn ? (
                <>
                  {user.role === 'admin' ? (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-[#C89B3C] font-semibold">
                      Admin
                    </Link>
                  ) : (
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C89B3C]">
                      My Orders
                    </Link>
                  )}
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => {
                      logoutUser();
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="text-red-500 font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[#C89B3C] font-semibold"
                >
                  Sign In
                </button>
              )}
            </div>

          </div>
        )}
        {/* Premium Sign In / Login Modal */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 bg-[#2C2C2C]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-[#FFF9F5] w-full max-w-md rounded-3xl overflow-hidden border border-[#FCE4EC] shadow-2xl relative animate-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white border border-[#FCE4EC] text-gray-500 hover:text-gray-800 flex items-center justify-center hover:scale-105 transition-all shadow-xs"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="p-6 pb-4 text-center bg-gradient-to-b from-[#FCE4EC]/40 to-transparent">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FCE4EC] via-[#F48FB1] to-[#D4AF7F] p-[2px] mx-auto shadow-md mb-3">
                  <div className="w-full h-full bg-[#FFF9F5] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#C89B3C]" />
                  </div>
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">Welcome to SPARKEL @kkv</h3>
                <p className="text-[11px] text-gray-500 font-poppins mt-1">Access your orders, custom sizes & exclusive coupons</p>
              </div>

              {/* Modal Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPasswordError("");
                  if (!loginForm.name || !loginForm.phone || !loginForm.password) return;
                  
                  // Security Password Strength Check
                  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
                  if (!passwordRegex.test(loginForm.password)) {
                    setPasswordError("🔒 Security check failed: Password must be at least 6 characters long and contain both letters and numbers!");
                    return;
                  }

                  loginUser(loginForm.name, loginForm.phone, loginForm.password);
                  setIsLoginModalOpen(false);
                  setLoginForm({ name: "", phone: "", password: "" });
                  setPasswordError("");
                }}
                className="p-6 pt-2 space-y-4 font-poppins text-xs text-[#2C2C2C]"
              >
                {/* Secure Badge */}
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-2.5 flex items-center justify-center gap-1.5 font-montserrat text-[10px] font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>🛡️ 256-Bit SSL Encrypted Secure Login</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block text-[10px] uppercase tracking-wider text-gray-500">Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter Your Name"
                      value={loginForm.name}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#FCE4EC] bg-white focus:outline-none focus:border-[#C89B3C] text-xs transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block text-[10px] uppercase tracking-wider text-gray-500">Phone Number</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Enter Phone Number"
                      value={loginForm.phone}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#FCE4EC] bg-white focus:outline-none focus:border-[#C89B3C] text-xs transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block text-[10px] uppercase tracking-wider text-gray-500">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Min 6 chars (letters & numbers)"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-9 pr-10 py-3 rounded-xl border border-[#FCE4EC] bg-white focus:outline-none focus:border-[#C89B3C] text-xs transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <p className="text-[10px] text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl leading-relaxed font-medium">
                    {passwordError}
                  </p>
                )}

                <div className="flex justify-between items-center text-[10px] font-medium text-gray-500 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="accent-[#C89B3C]" defaultChecked />
                    Remember me
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Verification code sent to your details!"); }} className="hover:text-[#C89B3C] underline">Forgot?</a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2C2C2C] hover:bg-[#C89B3C] text-[#FCE4EC] hover:text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-md font-montserrat mt-2 text-xs"
                >
                  Sign In securely
                </button>

                <div className="text-center pt-3 border-t border-gray-100 text-[10px] text-gray-400">
                  Please sign in to complete your checkout and track orders securely.
                </div>
              </form>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
