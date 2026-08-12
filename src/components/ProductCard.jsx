import React from 'react';
import { Heart, ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { getDirectImageUrl } from '../utils/imageUtils';

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
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#FCE4EC] shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full isolate">
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#FFF9F5] cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <img
          src={getDirectImageUrl(product.images[0]) || 'images/plumeria_flower.jpg'}
          alt={product.name}
          onError={(e) => {
            e.target.src = 'images/plumeria_flower.jpg';
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-[#2C2C2C] text-[#FCE4EC] text-[9px] sm:text-[10px] font-montserrat font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shadow-xs">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-gradient-to-r from-[#F48FB1] to-[#D4AF7F] text-white text-[9px] sm:text-[10px] font-montserrat font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-[#C89B3C] text-white text-[9px] sm:text-[10px] font-montserrat font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-current" /> Flash Sale
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#F48FB1] shadow-md transition-transform active:scale-90 z-10"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-[#F48FB1] text-[#F48FB1]' : ''}`} />
        </button>

        {/* Quick View Trigger on Image Hover (Desktop) */}
        <div className="absolute inset-x-0 bottom-2 sm:bottom-3 px-2 sm:px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:flex gap-2">
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
      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category Tag */}
          <span className="text-[9px] sm:text-[10px] font-montserrat uppercase tracking-wider sm:tracking-widest text-[#D4AF7F] font-bold block mb-0.5 sm:mb-1 truncate">
            {product.categoryName}
          </span>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif-luxury text-xs sm:text-base font-bold text-[#2C2C2C] hover:text-[#C89B3C] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1 my-1 sm:my-2 text-[10px] sm:text-xs">
            <div className="flex text-[#C89B3C]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="font-semibold text-[#2C2C2C]">{product.rating}</span>
            <span className="text-gray-400 font-light hidden sm:inline">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-1.5 sm:pt-2 border-t border-gray-100 mt-1.5 sm:mt-2">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-base sm:text-lg font-bold text-[#2C2C2C] font-poppins">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through font-light">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 font-montserrat">
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/60 text-[#2C2C2C] hover:bg-[#FCE4EC] hover:border-[#F48FB1] py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-0.5 sm:gap-1"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C89B3C]" /> Add
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-[#2C2C2C] to-[#4A3940] text-[#FCE4EC] hover:text-white py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold tracking-wider transition-all shadow-xs flex items-center justify-center gap-0.5 sm:gap-1"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF7F]" /> Buy
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
