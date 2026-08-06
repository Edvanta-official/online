import React from 'react';
import { Heart, ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart, setQuickViewProduct, setIsCheckoutOpen } = useShop();
  const navigate = useNavigate();

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#FCE4EC] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#FFF9F5] cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <img
          src={product.images[0] || 'images/butterfly_clip.jpg'}
          alt={product.name}
          onError={(e) => {
            e.target.src = 'images/butterfly_clip.jpg';
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-[#2C2C2C] text-[#FCE4EC] text-[10px] font-montserrat font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-gradient-to-r from-[#F48FB1] to-[#D4AF7F] text-white text-[10px] font-montserrat font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-[#C89B3C] text-white text-[10px] font-montserrat font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> Flash Sale
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#F48FB1] shadow-md transition-transform active:scale-90 z-10"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#F48FB1] text-[#F48FB1]' : ''}`} />
        </button>

        {/* Quick View Trigger on Image Hover */}
        <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 bg-white/95 backdrop-blur-md text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FCE4EC] py-2 rounded-xl text-xs font-montserrat font-semibold tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>

      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] font-montserrat uppercase tracking-widest text-[#D4AF7F] font-bold block mb-1">
            {product.categoryName}
          </span>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif-luxury text-base font-bold text-[#2C2C2C] hover:text-[#C89B3C] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 my-2">
            <div className="flex text-[#C89B3C]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#2C2C2C]">{product.rating}</span>
            <span className="text-[11px] text-gray-400 font-light">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-2 border-t border-gray-100 mt-2">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#2C2C2C] font-poppins">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through font-light">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-2 gap-2 font-montserrat">
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/60 text-[#2C2C2C] hover:bg-[#FCE4EC] hover:border-[#F48FB1] py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C89B3C]" /> Add
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-[#2C2C2C] to-[#4A3940] text-[#FCE4EC] hover:text-white py-2 rounded-xl text-xs font-bold tracking-wider transition-all shadow-sm flex items-center justify-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-[#D4AF7F]" /> Buy Now
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
