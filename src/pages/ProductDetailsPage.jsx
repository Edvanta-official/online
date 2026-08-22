import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Zap, Share2, Sparkles, MapPin, CheckCircle2, PackageCheck, Banknote, ShieldAlert } from 'lucide-react';
import { getDirectImageUrl, getCategoryFallbackImage } from '../utils/imageUtils';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products, addToCart, buyNow, toggleWishlist, wishlist, setIsCheckoutOpen, showToast } = useShop();
  
  const product = products.find(p => p.id === id) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '2*6');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  // Helper function to calculate delivery estimate (7 Days Guaranteed for every order)
  const calculateDeliveryDate = (pincodeStr = '') => {
    const today = new Date();
    const days = 7;
    const estDate = new Date(today);
    estDate.setDate(today.getDate() + days);
    
    const dayName = estDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNum = estDate.getDate();
    const monthName = estDate.toLocaleDateString('en-US', { month: 'short' });

    return {
      dateStr: `Guaranteed Delivery in 7 Days (Expected by ${dayName}, ${dayNum} ${monthName})`,
      zone: "Pan-India Guaranteed 7-Day Express Delivery",
      days: 7
    };
  };

  // Pincode Delivery Estimator State (Amazon / Meesho feature)
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Customer Review Form State
  const [reviewsList, setReviewsList] = useState([
    { id: 1, name: "Pooja Varma", rating: 5, date: "2 days ago", comment: "Absolutely breathtaking! Stays in place and shines beautifully.", verified: true },
    { id: 2, name: "Kavya Menon", rating: 5, date: "1 week ago", comment: "The velvet drawer box packaging blew me away! Perfect gift set.", verified: true },
    { id: 3, name: "Ananya Sharma", rating: 5, date: "2 weeks ago", comment: "Super fast 2-day delivery and authentic anti-tarnish gold coating.", verified: true }
  ]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });

  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincodeInput.trim().length === 6) {
      const estimate = calculateDeliveryDate(pincodeInput);
      setPincodeStatus({
        valid: true,
        date: estimate.dateStr,
        zone: estimate.zone,
        cod: true,
        freeShipping: true
      });
      showToast(`Pincode verified! Delivery & COD available for ${estimate.zone}.`);
    } else {
      setPincodeStatus({ valid: false });
      showToast("Please enter a valid 6-digit Pincode", "error");
    }
  };

  const handleQuantityIncrease = () => {
    const maxStock = typeof product.stock === 'number' ? product.stock : 999;
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    } else {
      showToast(`Only ${maxStock} items available in stock!`, "warning");
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityInput = (val) => {
    const num = parseInt(val) || 1;
    const maxStock = typeof product.stock === 'number' ? product.stock : 999;
    if (num > maxStock) {
      setQuantity(maxStock);
      showToast(`Only ${maxStock} items available in stock! Set to maximum.`, "warning");
    } else if (num < 1) {
      setQuantity(1);
    } else {
      setQuantity(num);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.comment) {
      setReviewsList([
        { id: Date.now(), name: newReview.name, rating: newReview.rating, date: "Just now", comment: newReview.comment, verified: true },
        ...reviewsList
      ]);
      setNewReview({ name: '', rating: 5, comment: '' });
      showToast("Thank you! Your review has been submitted.");
    }
  };

  const handleBuyNow = () => {
    const maxStock = typeof product.stock === 'number' ? product.stock : 999;
    if (maxStock <= 0) {
      showToast("Sorry, this item is currently Out of Stock!", "error");
      return;
    }
    const safeQty = Math.min(quantity, maxStock);
    buyNow(product, safeQty, selectedColor);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs font-montserrat text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-[#C89B3C]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#C89B3C]">Shop</Link>
          <span>/</span>
          <span className="text-[#2C2C2C] font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Details Main Grid */}
        <div className="bg-white rounded-3xl border border-[#FCE4EC] shadow-xs overflow-hidden p-5 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column: Image Gallery & Zoom Preview */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FFF9F5] border border-[#D4AF7F]/30 shadow-inner group">
              <img
                src={getDirectImageUrl(product.images[selectedImageIndex] || product.images[0]) || 'images/plumeria_flower.jpg'}
                alt={product.name}
                onError={(e) => {
                  e.target.src = getDirectImageUrl(getCategoryFallbackImage(product.category));
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                <span className="bg-white/95 backdrop-blur-md text-[10px] font-montserrat font-bold text-[#C89B3C] px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Boutique Edition
                </span>
                <span className="bg-[#2C2C2C] text-[#FCE4EC] text-[10px] font-montserrat font-bold px-3 py-1 rounded-full shadow-xs">
                  Amazon & Meesho Verified
                </span>
              </div>

              {/* Wishlist Floating Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#F48FB1] shadow-md transition-transform active:scale-90 z-10"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#F48FB1] text-[#F48FB1]' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-[#C89B3C] shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={getDirectImageUrl(img)} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Content, Amazon/Meesho Delivery Check & Buy Box */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-montserrat uppercase font-bold text-[#D4AF7F] tracking-widest">
                  {product.categoryName} • SKU: {product.sku}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast("Product link copied to clipboard!");
                  }}
                  className="text-xs text-gray-500 hover:text-[#C89B3C] flex items-center gap-1 font-montserrat"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>

              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C2C2C]">
                {product.name}
              </h1>

              {/* Rating & Verified Buyer Count (Amazon/Meesho style) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-poppins">
                <div className="flex items-center gap-1 bg-[#FFF9F5] px-2.5 py-1 rounded-full border border-[#D4AF7F]/40 font-bold text-[#2C2C2C]">
                  <span>★ {product.rating}</span>
                  <div className="flex text-[#C89B3C]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-gray-500">|</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {product.reviewsCount + 140} Verified Ratings
                </span>
              </div>

              {/* Price & Savings Tag */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-bold text-[#2C2C2C] font-poppins">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
                <span className="bg-[#FCE4EC] text-[#F48FB1] text-xs font-bold px-3 py-1 rounded-full font-montserrat">
                  Save ₹{product.originalPrice - product.price} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                </span>
              </div>

              {/* Auto 30% OFF Banner */}
              <div className="bg-gradient-to-r from-[#FFF9F5] to-[#FCE4EC]/50 p-3 rounded-2xl border border-[#D4AF7F]/40 flex items-center gap-2.5 text-xs font-poppins">
                <Zap className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span><strong>Special Offer:</strong> Add items over ₹999 to get <strong>AUTOMATIC 30% OFF</strong> + FREE Shipping at checkout!</span>
              </div>

              {/* Stock Availability Urgency Badge (Amazon Style) */}
              <div className="flex items-center gap-2 text-xs font-poppins font-medium text-[#2C2C2C]">
                {product.stock <= 0 ? (
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-red-600" /> Out of Stock (0 Available)
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1 animate-pulse">
                    <ShieldAlert className="w-4 h-4" /> Only {product.stock} left in stock - Order soon!
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <PackageCheck className="w-4 h-4" /> In Stock ({product.stock} Available) — Dispatched in 24 Hours
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 font-poppins leading-relaxed font-light">
                {product.description}
              </p>

              {/* Colors */}
              {product.colors && (
                <div className="pt-1">
                  <label className="text-xs font-montserrat uppercase font-semibold text-[#2C2C2C] block mb-2">
                    Select Color Finish: <span className="text-[#C89B3C] font-bold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-4 py-2 rounded-full text-xs font-montserrat font-semibold border transition-all ${selectedColor === c ? 'bg-[#2C2C2C] text-[#FCE4EC] border-[#2C2C2C] shadow-md' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#D4AF7F]'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bangle Size Selector */}
              {(product.sizes || product.category === 'bangles') && (
                <div className="pt-2">
                  <label className="text-xs font-montserrat uppercase font-semibold text-[#2C2C2C] block mb-2">
                    Select Bangle Size: <span className="text-[#C89B3C] font-extrabold text-sm">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {(product.sizes || ["2*4", "2*6", "2*8"]).map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-montserrat font-bold border transition-all ${selectedSize === sz ? 'bg-[#2C2C2C] text-[#FCE4EC] border-[#2C2C2C] shadow-md scale-105' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#D4AF7F]'}`}
                      >
                        Size {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-montserrat uppercase font-semibold text-[#2C2C2C]">Quantity</label>
                  <span className="text-[11px] text-gray-500 font-poppins">Available Stock: <strong className={product.stock <= 0 ? "text-red-500 font-bold" : "text-[#C89B3C] font-bold"}>{product.stock} Units</strong></span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center w-36 border border-[#D4AF7F]/40 rounded-full overflow-hidden bg-[#FFF9F5]">
                    <button
                      type="button"
                      onClick={handleQuantityDecrease}
                      disabled={quantity <= 1 || product.stock <= 0}
                      className="w-12 py-2 text-gray-600 hover:bg-[#FCE4EC] font-bold disabled:opacity-30 transition-opacity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={product.stock}
                      disabled={product.stock <= 0}
                      value={product.stock <= 0 ? 0 : quantity}
                      onChange={(e) => handleQuantityInput(e.target.value)}
                      className="w-12 text-center font-bold text-xs bg-transparent focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleQuantityIncrease}
                      disabled={quantity >= product.stock || product.stock <= 0}
                      className="w-12 py-2 text-gray-600 hover:bg-[#FCE4EC] font-bold disabled:opacity-30 transition-opacity"
                    >
                      +
                    </button>
                  </div>

                  {quantity >= product.stock && product.stock > 0 && (
                    <span className="text-[11px] text-amber-800 bg-amber-50 px-3 py-1 rounded-full font-medium border border-amber-200 flex items-center gap-1 animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Stock limit reached ({product.stock} Max)
                    </span>
                  )}
                </div>
              </div>

              {/* Amazon / Meesho Delivery Pincode Estimator */}
              <div className="pt-3 border-t border-gray-100 font-poppins space-y-2">
                <label className="text-xs font-semibold text-[#2C2C2C] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C89B3C]" /> Check 7-Day Guaranteed Express Delivery:
                </label>
                <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode (e.g. 560001)"
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#C89B3C]"
                  />
                  <button
                    type="submit"
                    className="bg-[#2C2C2C] text-[#FCE4EC] font-montserrat font-bold text-xs px-4 py-2 rounded-xl uppercase hover:bg-[#3A2D32]"
                  >
                    Check
                  </button>
                </form>

                {pincodeStatus && (
                  <div className="text-xs pt-1">
                    {pincodeStatus.valid ? (
                      <div className="space-y-1.5 text-emerald-700 bg-emerald-50 p-3 rounded-2xl border border-emerald-100 shadow-xs">
                        <p className="font-bold flex items-center gap-1.5 text-xs text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {pincodeStatus.date}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-medium pl-5 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 🚚 <strong>Guaranteed 7-Day Delivery:</strong> Delivered within 7 days max.
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-600 pt-1 border-t border-emerald-200/50">
                          <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-[#C89B3C]" /> Guaranteed 7-Day Delivery</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" /> Free Express Shipping</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-red-500 font-medium">Please enter a valid 6-digit Pincode.</p>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Main Action Buttons */}
            <div className="space-y-3 font-montserrat pt-4 border-t border-gray-100">
              {product.stock <= 0 ? (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 border border-gray-200 py-3.5 rounded-2xl text-xs font-bold uppercase cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => addToCart(product, quantity, selectedColor)}
                    className="w-full bg-[#FFF9F5] border border-[#D4AF7F] text-[#2C2C2C] hover:bg-[#FCE4EC] py-3.5 rounded-2xl text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C89B3C]" /> Add To Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full shimmer-btn bg-gradient-to-r from-[#2C2C2C] to-[#3A2D32] text-[#FCE4EC] hover:text-white py-3.5 rounded-2xl text-xs font-bold tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-[#D4AF7F]" /> Buy Now
                  </button>
                </div>
              )}
            </div>

            {/* Amazon & Meesho Style Trust Grid */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-[10px] text-gray-500 font-poppins border-t border-gray-100 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#C89B3C]" />
                <span>2-4 Days Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
                <span>Anti-Tarnish Seal</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-[#C89B3C]" />
                <span>7 Days Easy Return</span>
              </div>
            </div>

          </div>

        </div>

        {/* Product Details & Amazon/Meesho Customer Reviews Tabs */}
        <div className="mt-12 bg-white rounded-3xl border border-[#FCE4EC] p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-6 border-b border-gray-200 font-montserrat text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 transition-all ${activeTab === 'details' ? 'border-b-2 border-[#C89B3C] text-[#2C2C2C]' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Product Details & Materials
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-all ${activeTab === 'reviews' ? 'border-b-2 border-[#C89B3C] text-[#2C2C2C]' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Customer Reviews ({reviewsList.length + 120})
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-4 text-xs font-poppins text-gray-600 leading-relaxed">
              <p>{product.description}</p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700 font-medium">
                {product.details?.map((d, i) => <li key={i}>{d}</li>) || <li>100% Quality Inspected before velvet packaging.</li>}
                <li>Dispatched directly from Sparkle Boutique Hyderabad Workshop.</li>
                <li>Hassle-free 7-day exchange or replacement policy.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              
              {/* Amazon / Meesho Review Summary Bar Chart */}
              <div className="bg-[#FFF9F5] p-5 rounded-2xl border border-[#FCE4EC] grid grid-cols-1 md:grid-cols-12 gap-6 items-center font-poppins">
                <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-[#D4AF7F]/30 pb-4 md:pb-0 md:pr-4">
                  <div className="text-4xl font-bold text-[#2C2C2C]">{product.rating}</div>
                  <div className="flex justify-center text-[#C89B3C] my-1">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xs text-gray-500">Based on 140+ verified buyer ratings</p>
                </div>

                <div className="md:col-span-8 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-right">5 Star</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C89B3C] w-[88%]" />
                    </div>
                    <span className="w-8">88%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-right">4 Star</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C89B3C] w-[9%]" />
                    </div>
                    <span className="w-8">9%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-right">3 Star</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C89B3C] w-[3%]" />
                    </div>
                    <span className="w-8">3%</span>
                  </div>
                </div>
              </div>

              {/* Submit Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-[#FFF9F5] p-6 rounded-2xl border border-[#FCE4EC] space-y-3">
                <h4 className="font-serif-luxury text-base font-bold text-[#2C2C2C]">Write a Review</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="bg-white border border-[#D4AF7F]/40 rounded-xl px-4 py-2 text-xs"
                  />
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="bg-white border border-[#D4AF7F]/40 rounded-xl px-4 py-2 text-xs font-montserrat"
                  >
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                    <option value={3}>★★★☆☆ (3/5)</option>
                  </select>
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Share your experience wearing this Sparkle accessory..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-white border border-[#D4AF7F]/40 rounded-xl p-3 text-xs"
                />
                <button type="submit" className="bg-[#2C2C2C] text-[#FCE4EC] font-montserrat font-bold text-xs px-6 py-2 rounded-xl">
                  Post Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map(r => (
                  <div key={r.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#2C2C2C]">{r.name}</span>
                        {r.verified && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-poppins">{r.date}</span>
                    </div>
                    <div className="flex text-[#C89B3C]">
                      {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <p className="text-xs text-gray-600 italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C]">
              Customers Who Viewed This Also Bought
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Buy Bar (Amazon / Meesho style) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#FCE4EC] p-3 shadow-2xl z-40 flex items-center justify-between gap-3 font-montserrat">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-semibold text-gray-400">Total Price</span>
          <span className="text-base font-bold text-[#2C2C2C]">₹{product.price * quantity}</span>
        </div>
        <div className="flex gap-2 flex-1 max-w-xs">
          <button
            onClick={() => addToCart(product, quantity, selectedColor)}
            className="flex-1 bg-[#FFF9F5] border border-[#D4AF7F] text-[#2C2C2C] py-2.5 rounded-xl text-xs font-bold"
          >
            Add
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-gradient-to-r from-[#2C2C2C] to-[#3A2D32] text-[#FCE4EC] py-2.5 rounded-xl text-xs font-bold"
          >
            Buy Now
          </button>
        </div>
      </div>

    </div>
  );
};
