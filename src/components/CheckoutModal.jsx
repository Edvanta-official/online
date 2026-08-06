import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, QrCode, Banknote, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import confetti from 'canvas-confetti';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    user,
    placeOrder
  } = useShop();

  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment, 3: Confirmation
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);

  const [shippingForm, setShippingForm] = useState({
    fullName: user.name || '',
    phone: '+91 98765 43210',
    email: user.email || '',
    street: 'Flat 402, Rosewood Heights, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050'
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'Razorpay', 'COD'
  const [upiOption, setUpiOption] = useState('gpay');

  if (!isCheckoutOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    const newOrder = placeOrder({
      shippingAddress: shippingForm,
      paymentMethod: paymentMethod === 'UPI' ? 'UPI / Razorpay' : paymentMethod
    });
    setPlacedOrderInfo(newOrder);
    setStep(3);
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#FCE4EC] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#2C2C2C] to-[#3A2D32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF7F]" />
            <h2 className="font-serif-luxury text-xl font-bold text-[#FCE4EC]">
              Sparkel Boutique Checkout
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="text-gray-300 hover:text-white p-1 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 3 && (
          <div className="bg-[#FFF9F5] px-6 py-3 border-b border-[#FCE4EC] flex items-center justify-center gap-6 font-montserrat text-xs font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#C89B3C]' : 'text-gray-400'}`}>
              <span className="w-6 h-6 rounded-full bg-[#2C2C2C] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Shipping Address</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#C89B3C]' : 'text-gray-400'}`}>
              <span className="w-6 h-6 rounded-full bg-[#2C2C2C] text-white flex items-center justify-center text-[10px]">2</span>
              <span>Payment Mode</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 md:p-8 font-poppins">
          
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C]">
                1. Delivery Shipping Address
              </h3>

              {/* Saved Address Preset Button */}
              {user.savedAddresses?.length > 0 && (
                <div className="p-4 bg-[#FCE4EC]/40 border border-[#F48FB1]/40 rounded-2xl">
                  <span className="text-[10px] font-montserrat uppercase font-bold text-[#C89B3C]">Quick Saved Address</span>
                  <p className="text-xs font-semibold text-[#2C2C2C] mt-1">{user.savedAddresses[0].fullName}</p>
                  <p className="text-xs text-gray-600">{user.savedAddresses[0].street}, {user.savedAddresses[0].city} - {user.savedAddresses[0].pincode}</p>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number (for OTP & Delivery Updates)</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Street Address / House No.</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                    className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl px-4 py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl px-4 py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.pincode}
                      onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl px-4 py-2.5 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end font-montserrat">
                  <button
                    type="submit"
                    className="bg-[#2C2C2C] text-[#FCE4EC] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#3A2D32]"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF7F]" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C]">
                  2. Select Payment Method
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-montserrat font-bold text-[#C89B3C] underline"
                >
                  Edit Address
                </button>
              </div>

              {/* Payment Mode Toggles */}
              <div className="space-y-3 font-montserrat">
                
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-[#C89B3C] bg-[#FFF9F5] shadow-md' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-[#C89B3C]" />
                      <span className="text-xs font-bold text-[#2C2C2C]">UPI Instant Payment (GPay / PhonePe / Paytm / BHIM)</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">FASTEST</span>
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="mt-4 pt-3 border-t border-[#D4AF7F]/30 font-poppins text-xs space-y-2">
                      <p className="text-gray-600">Scan QR Code or enter VPA id:</p>
                      <div className="w-32 h-32 bg-white border border-gray-300 p-2 rounded-xl mx-auto flex items-center justify-center shadow-inner">
                        <div className="text-center font-mono text-[10px] text-gray-500">
                          [SPARKEL@KKL QR CODE SIMULATION]
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod('Razorpay')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-[#C89B3C] bg-[#FFF9F5] shadow-md' : 'border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#C89B3C]" />
                    <span className="text-xs font-bold text-[#2C2C2C]">Debit / Credit Cards & NetBanking (Razorpay)</span>
                  </div>
                </div>

                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-[#C89B3C] bg-[#FFF9F5] shadow-md' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-[#C89B3C]" />
                      <span className="text-xs font-bold text-[#2C2C2C]">Cash On Delivery (COD)</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Pay on Delivery</span>
                  </div>
                </div>

              </div>

              {/* Order Amount Summary */}
              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Order Total:</span>
                  <span className="font-bold text-[#2C2C2C]">₹{cartTotal}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center font-montserrat">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-black font-semibold"
                >
                  ← Back to Address
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrderSubmit}
                  className="shimmer-btn bg-gradient-to-r from-[#2C2C2C] to-[#3A2D32] text-[#FCE4EC] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl hover:scale-105 transition-all"
                >
                  Place Order Now (₹{cartTotal})
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Order Confirmation */}
          {step === 3 && placedOrderInfo && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="bg-[#FCE4EC] text-[#2C2C2C] text-xs font-montserrat font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Order Successfully Confirmed!
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C]">
                  Thank You for Shopping at Sparkel @KKL
                </h3>
                <p className="text-xs text-gray-500 font-poppins">
                  Order Reference: <strong className="text-[#C89B3C] font-mono">{placedOrderInfo.id}</strong>
                </p>
              </div>

              <div className="max-w-md mx-auto bg-[#FFF9F5] p-6 rounded-2xl border border-[#FCE4EC] text-left text-xs space-y-2">
                <p className="font-semibold text-[#2C2C2C] border-b border-[#FCE4EC] pb-2">Order Summary Receipt</p>
                <div className="flex justify-between text-gray-600">
                  <span>Tracking Number:</span>
                  <span className="font-bold text-[#2C2C2C]">{placedOrderInfo.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Status:</span>
                  <span className="font-bold text-emerald-600">{placedOrderInfo.paymentStatus}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Amount Paid:</span>
                  <span className="font-bold text-[#C89B3C]">₹{placedOrderInfo.finalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Address:</span>
                  <span className="truncate max-w-[180px]">{placedOrderInfo.shippingAddress.city}, {placedOrderInfo.shippingAddress.state}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setStep(1);
                }}
                className="bg-[#2C2C2C] text-[#FCE4EC] font-montserrat font-bold text-xs px-8 py-3.5 rounded-full uppercase tracking-wider shadow-lg"
              >
                Continue Exploring Collections
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
