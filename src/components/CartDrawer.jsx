import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Tag, Check, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    user,
    setIsLoginModalOpen,
    showToast
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCouponSubmit = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#FCE4EC]">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-[#2C2C2C] to-[#3A2D32] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF7F]" />
              <h2 className="font-serif-luxury text-xl font-bold text-[#FCE4EC]">Your Luxury Cart</h2>
              <span className="bg-[#D4AF7F] text-[#2C2C2C] text-xs font-bold font-montserrat px-2 py-0.5 rounded-full">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} Items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping & 30% OFF Meter */}
          <div className="bg-[#FFF9F5] p-4 border-b border-[#FCE4EC]">
            {cartSubtotal >= freeShippingThreshold ? (
              <div className="flex flex-col gap-1 text-xs font-montserrat text-emerald-700 font-bold">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C89B3C] animate-bounce" />
                  <span>🎉 UNLOCKED: AUTOMATIC 30% OFF + FREE SHIPPING!</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-normal font-poppins">
                  You save 30% on your entire cart + FREE Express Pan-India Delivery!
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 font-poppins text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Add <strong className="text-[#C89B3C]">₹{freeShippingThreshold - cartSubtotal}</strong> more for <strong className="text-emerald-600">30% OFF + FREE Delivery</strong>!</span>
                  <span className="font-bold text-[#2C2C2C]">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F48FB1] via-[#D4AF7F] to-[#C89B3C] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items Scroll List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-[#FCE4EC] rounded-full flex items-center justify-center mx-auto text-3xl text-[#D4AF7F]">
                  🛍️
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">Your Cart is Empty</h3>
                <p className="text-xs text-gray-500 font-poppins max-w-xs mx-auto">
                  Discover luxury Swarovski clips, handcrafted hair flowers, and bridal choker sets.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#2C2C2C] text-[#FCE4EC] font-montserrat font-semibold text-xs px-6 py-3 rounded-full uppercase tracking-wider"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC] relative group"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-sm font-bold text-[#2C2C2C] truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedColor && (
                        <span className="text-[11px] text-gray-500 block">
                          Color: {item.selectedColor}
                        </span>
                      )}
                      <span className="text-xs font-bold text-[#C89B3C] block mt-0.5">
                        ₹{item.product.price}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#D4AF7F]/40 rounded-full bg-white px-2 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="text-xs font-bold text-gray-600 px-1 hover:text-[#C89B3C]"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="text-xs font-bold text-gray-600 px-1 hover:text-[#C89B3C]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Coupon Form */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#FCE4EC] space-y-4 shadow-xl">
              
              {/* Promo Coupon Input */}
              <form onSubmit={handleApplyCouponSubmit} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF7F]" />
                    <input
                      type="text"
                      placeholder="Coupon Code (SPARKEL10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl py-2 pl-9 pr-3 text-xs font-poppins uppercase tracking-wider focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#2C2C2C] text-[#FCE4EC] font-montserrat font-bold text-xs px-4 py-2 rounded-xl uppercase tracking-wider hover:bg-[#3A2D32]"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                    <span className="font-semibold">Code '{appliedCoupon.code}' Applied! ({appliedCoupon.discountPercent}% OFF)</span>
                    <button type="button" onClick={removeCoupon} className="text-red-500 text-[10px] underline">Remove</button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-500 px-1">{couponError}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 font-poppins text-xs pt-2 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold">₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promo Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2C2C2C] pt-2 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="text-[#C89B3C]">₹{cartTotal}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  if (!user || !user.isLoggedIn) {
                    setIsCartOpen(false);
                    showToast("⚠️ Please sign in to purchase items!", "error");
                    setIsLoginModalOpen(true);
                    return;
                  }
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full shimmer-btn bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] hover:text-white py-3.5 rounded-2xl font-montserrat text-xs font-bold tracking-widest uppercase shadow-xl transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Proceed To Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF7F]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-poppins">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>100% Encrypted & Safe Checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
