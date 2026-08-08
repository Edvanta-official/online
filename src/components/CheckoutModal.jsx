import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Banknote, QrCode, Sparkles, Copy, Smartphone } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import exactScannerImg from '../assets/phonepe_scanner_exact.png';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    clearCart,
    user,
    placeOrder,
    showToast
  } = useShop();

  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment, 3: Confirmation
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);

  const [shippingForm, setShippingForm] = useState({
    fullName: user.name || '',
    phone: '+91 9949157771',
    email: user.email || '',
    street: 'Flat 402, Rosewood Heights, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050'
  });

  const [paymentMethod, setPaymentMethod] = useState('PhonePe'); // 'PhonePe', 'UPI', 'Razorpay', 'COD'

  if (!isCheckoutOpen) return null;

  // Generate UPI Deep Link for PhonePe & GPay with exact order total pre-filled automatically
  const upiDeepLink = `upi://pay?pa=7981714189-4@ibl&pn=Koti%20Koushik&am=${cartTotal}&cu=INR&tn=Sparkel%20Order%20Payment`;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingForm.fullName || !shippingForm.phone || !shippingForm.street || !shippingForm.pincode) {
      showToast("Please fill in all address details", "error");
      return;
    }
    setStep(2);
  };

  const handleCompleteOrder = () => {
    const newOrder = placeOrder({
      shippingAddress: shippingForm,
      paymentMethod,
      cartSubtotal,
      discountAmount,
      shippingFee,
      cartTotal
    });

    setPlacedOrderInfo(newOrder);
    setStep(3);
    showToast("🎉 Order Placed Successfully! Receipt Generated.");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#FCE4EC] my-8 font-poppins relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-montserrat tracking-widest uppercase text-[#D4AF7F] font-bold">Sparkel @kkv Boutique</span>
            <h2 className="font-serif-luxury text-xl font-bold">
              {step === 1 && "Shipping & Delivery Address"}
              {step === 2 && "PhonePe & Payment Confirmation"}
              {step === 3 && "Order Placed Successfully!"}
            </h2>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8">
          
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C]">1. Delivery Details</h3>
              <form onSubmit={handleShippingSubmit} className="space-y-4 text-xs font-poppins">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Street Address / Flat No. *</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                    className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={shippingForm.pincode}
                      onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
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

          {/* STEP 2: PhonePe & Payment Methods */}
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

              {/* Order Total Display Banner */}
              <div className="p-4 bg-gradient-to-r from-[#2C2C2C] to-[#3A2D32] text-[#FCE4EC] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-montserrat tracking-widest text-[#D4AF7F]">Amount Payable</span>
                  <p className="text-2xl font-bold font-poppins">₹{cartTotal}</p>
                </div>
                <span className="bg-[#D4AF7F] text-[#2C2C2C] font-bold text-[10px] px-3 py-1 rounded-full uppercase font-montserrat">
                  30% OFF Applied
                </span>
              </div>

              {/* Payment Mode Options */}
              <div className="space-y-3 font-montserrat">
                
                {/* PhonePe / UPI Scanner Option */}
                <div
                  onClick={() => setPaymentMethod('PhonePe')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'PhonePe' ? 'border-[#C89B3C] bg-[#FFF9F5] shadow-md' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-[#5f259f]" />
                      <div>
                        <span className="text-xs font-bold text-[#2C2C2C]">PhonePe & Scanner UPI Instant Payment</span>
                        <p className="text-[10px] text-gray-500 font-poppins">KOTI KOUSHIK • Auto-Fills ₹{cartTotal}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#5f259f] text-white font-bold px-2.5 py-1 rounded-full">RECOMMENDED</span>
                  </div>

                  {paymentMethod === 'PhonePe' && (
                    <div className="mt-4 pt-4 border-t border-[#D4AF7F]/30 font-poppins text-xs space-y-3 text-center">
                      
                      {/* Dynamic Live Auto-Filling QR Code */}
                      <div className="max-w-[240px] mx-auto rounded-3xl p-4 bg-white border-2 border-[#5f259f] shadow-lg text-center space-y-2">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-[10px] text-gray-400 font-montserrat font-bold uppercase tracking-wider">Dynamic QR</span>
                          <span className="text-xs font-bold text-[#5f259f] font-montserrat">Koti Koushik</span>
                        </div>
                        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white p-2 border border-gray-100 flex items-center justify-center">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(upiDeepLink)}`}
                            alt="Scan to Pay Koti Koushik"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="pt-2">
                          <p className="text-[11px] text-[#2C2C2C] font-semibold">
                            Scan with PhonePe / Any UPI App
                          </p>
                          <p className="text-xs font-extrabold text-[#5f259f] mt-0.5">
                            Auto-fills ₹{cartTotal}
                          </p>
                          <p className="text-[9px] text-gray-400 font-mono mt-1">UPI: 7981714189-4@ibl</p>
                        </div>
                      </div>

                      {/* Instant PhonePe Mobile App Payment Button */}
                      <div className="max-w-[280px] mx-auto pt-1">
                        <a
                          href={upiDeepLink}
                          className="w-full bg-[#5f259f] hover:bg-[#4a1c7d] text-white font-montserrat font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Pay ₹{cartTotal} via PhonePe App</span>
                        </a>
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

              <div className="pt-2 flex justify-between items-center font-montserrat">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-black font-semibold"
                >
                  ← Back to Address
                </button>

                <button
                  onClick={handleCompleteOrder}
                  className="shimmer-btn bg-gradient-to-r from-[#2C2C2C] to-[#3A2D32] text-[#FCE4EC] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl flex items-center gap-2"
                >
                  <span>Confirm & Place Order (₹{cartTotal})</span>
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF7F]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Confirmation */}
          {step === 3 && placedOrderInfo && (
            <div className="text-center space-y-6 py-4 font-poppins">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
                ✓
              </div>

              <div className="space-y-1">
                <span className="text-xs font-montserrat uppercase tracking-widest text-[#C89B3C] font-bold">Sparkel @kkv Order Receipt</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C]">
                  Thank You, {placedOrderInfo.customerName}!
                </h3>
                <p className="text-xs text-gray-500">Order ID: <strong className="text-[#2C2C2C]">{placedOrderInfo.id}</strong></p>
              </div>

              {/* Order Summary Receipt Box */}
              <div className="bg-[#FFF9F5] p-6 rounded-3xl border border-[#FCE4EC] max-w-md mx-auto text-left space-y-3 text-xs">
                <div className="flex justify-between font-semibold text-gray-700 border-b border-[#D4AF7F]/30 pb-2">
                  <span>Items Total ({placedOrderInfo.items.length})</span>
                  <span>₹{placedOrderInfo.cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>30% Discount Saved</span>
                  <span>-₹{placedOrderInfo.discountAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>{placedOrderInfo.shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${placedOrderInfo.shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#2C2C2C] border-t border-[#D4AF7F]/30 pt-2">
                  <span>Total Amount Paid</span>
                  <span className="text-[#C89B3C]">₹{placedOrderInfo.cartTotal}</span>
                </div>
                <div className="pt-2 text-[11px] text-gray-500 font-light border-t border-gray-100">
                  <p><strong>Deliver To:</strong> {placedOrderInfo.shippingAddress.street}, {placedOrderInfo.shippingAddress.city} - {placedOrderInfo.shippingAddress.pincode}</p>
                  <p><strong>Contact:</strong> +91 9949157771</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-montserrat">
                <Link
                  to="/dashboard"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="bg-[#2C2C2C] text-[#FCE4EC] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#3A2D32]"
                >
                  Track Order in Dashboard
                </Link>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="bg-white border border-[#D4AF7F] text-[#2C2C2C] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#FCE4EC]"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
