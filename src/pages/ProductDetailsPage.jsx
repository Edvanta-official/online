import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Zap, Check, Share2, Sparkles, MessageSquare } from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, wishlist, setIsCheckoutOpen, showToast } = useShop();
  
  const product = products.find(p => p.id === id) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  // Customer Review Form State
  const [reviewsList, setReviewsList] = useState([
    { id: 1, name: "Pooja Varma", rating: 5, date: "2 days ago", comment: "Absolutely breathtaking! The butterfly clip stays in place and shines under studio lights." },
    { id: 2, name: "Kavya Menon", rating: 5, date: "1 week ago", comment: "The velvet drawer box packaging blew me away! Perfect gift set." }
  ]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });

  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.comment) {
      setReviewsList([
        { id: Date.now(), name: newReview.name, rating: newReview.rating, date: "Just now", comment: newReview.comment },
        ...reviewsList
      ]);
      setNewReview({ name: '', rating: 5, comment: '' });
      showToast("Thank you! Your review has been submitted.");
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="py-12 bg-[#FFF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs font-montserrat text-gray-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-[#C89B3C]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#C89B3C]">Shop</Link>
          <span>/</span>
          <span className="text-[#2C2C2C] font-semibold">{product.name}</span>
        </div>

        {/* Product Details Main Grid */}
        <div className="bg-white rounded-3xl border border-[#FCE4EC] shadow-sm overflow-hidden p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FFF9F5] border border-[#D4AF7F]/30 shadow-inner group">
              <img
                src={product.images[selectedImageIndex] || product.images[0] || '/images/butterfly_clip.jpg'}
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/images/butterfly_clip.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[10px] font-montserrat font-bold text-[#C89B3C] px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Boutique Edition
              </span>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-[#C89B3C] shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Content & Actions */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-montserrat uppercase font-bold text-[#D4AF7F] tracking-widest">
                  {product.categoryName}
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

              <h1 className="font-serif-luxury text-3xl font-bold text-[#2C2C2C]">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-[#C89B3C]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#2C2C2C]">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewsCount} verified reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl font-bold text-[#2C2C2C] font-poppins">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
                <span className="bg-[#FCE4EC] text-[#F48FB1] text-xs font-bold px-3 py-1 rounded-full font-montserrat">
                  Save ₹{product.originalPrice - product.price}
                </span>
              </div>

              <p className="text-xs text-gray-600 font-poppins leading-relaxed font-light">
                {product.description}
              </p>

              {/* Colors */}
              {product.colors && (
                <div className="pt-2">
                  <label className="text-xs font-montserrat uppercase font-semibold text-[#2C2C2C] block mb-2">
                    Select Color Finish: <span className="text-[#C89B3C] font-bold">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
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

              {/* Quantity */}
              <div className="pt-2">
                <label className="text-xs font-montserrat uppercase font-semibold text-[#2C2C2C] block mb-2">Quantity</label>
                <div className="flex items-center w-36 border border-[#D4AF7F]/40 rounded-full overflow-hidden bg-[#FFF9F5]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 py-2 text-gray-600 hover:bg-[#FCE4EC] font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 py-2 text-gray-600 hover:bg-[#FCE4EC] font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 font-montserrat pt-6 border-t border-gray-100">
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

              <button
                onClick={() => toggleWishlist(product)}
                className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-[#F48FB1] flex items-center justify-center gap-2"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#F48FB1] text-[#F48FB1]' : ''}`} />
                {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-[10px] text-gray-500 font-poppins border-t border-gray-100 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#C89B3C]" />
                <span>Express Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
                <span>Anti-Tarnish Coating</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-[#C89B3C]" />
                <span>7 Days Exchange</span>
              </div>
            </div>

          </div>

        </div>

        {/* Product Details & Reviews Tabs */}
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
              Customer Reviews ({reviewsList.length})
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-4 text-xs font-poppins text-gray-600 leading-relaxed">
              <p>{product.description}</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 font-medium">
                {product.details?.map((d, i) => <li key={i}>{d}</li>) || <li>100% Quality Inspected before velvet packaging.</li>}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              
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
                  placeholder="Share your experience wearing this Sparkel accessory..."
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
                      <span className="font-bold text-xs text-[#2C2C2C]">{r.name}</span>
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C]">
              You May Also Love
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
