import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistDrawer = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, products, toggleWishlist, addToCart } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = (Array.isArray(products) && Array.isArray(wishlist)) 
    ? products.filter(p => p && p.id && wishlist.includes(p.id)) 
    : [];

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#FCE4EC]">
          
          {/* Header */}
          <div className="p-6 bg-[#2C2C2C] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#F48FB1] fill-current" />
              <h2 className="font-serif-luxury text-xl font-bold text-[#FCE4EC]">Saved Wishlist</h2>
              <span className="bg-[#F48FB1] text-white text-xs font-bold font-montserrat px-2 py-0.5 rounded-full">
                {wishlistedProducts.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="text-gray-300 hover:text-white p-1 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-[#FCE4EC] rounded-full flex items-center justify-center mx-auto text-2xl">
                  💖
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C]">No Saved Favorites Yet</h3>
                <p className="text-xs text-gray-500 font-poppins">Tap the heart icon on any accessory to save it here.</p>
              </div>
            ) : (
              wishlistedProducts.map(product => (
                <div key={product.id} className="flex gap-4 p-3 bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC]">
                  <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-sm font-bold text-[#2C2C2C] truncate">{product.name}</h4>
                      <span className="text-xs font-bold text-[#C89B3C]">₹{product.price}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          toggleWishlist(product);
                        }}
                        className="flex-1 bg-[#2C2C2C] text-[#FCE4EC] py-1.5 rounded-xl text-xs font-montserrat font-bold flex items-center justify-center gap-1 hover:bg-[#3A2D32]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                      </button>

                      <button
                        onClick={() => toggleWishlist(product)}
                        className="text-gray-400 hover:text-red-500 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
