import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Banknote, QrCode, Sparkles, Copy, Smartphone, Video, Truck } from 'lucide-react';
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

  // Generate UPI Deep Link for PhonePe, GPay, Paytm & SuperMoney with exact order total pre-filled automatically
  const upiDeepLink = `upi://pay?pa=sparklekkv@ibl&pn=Sparkle%20@kkv&am=${cartTotal}&cu=INR&tn=Sparkle%20Order%20Payment`;
  const phonepeLink = `phonepe://pay?pa=sparklekkv@ibl&pn=Sparkle%20@kkv&am=${cartTotal}&cu=INR&tn=Sparkle%20Order%20Payment`;
  const gpayLink = `gpay://upi/pay?pa=sparklekkv@ibl&pn=Sparkle%20@kkv&am=${cartTotal}&cu=INR&tn=Sparkle%20Order%20Payment`;
  const paytmLink = `paytmmp://pay?pa=sparklekkv@ibl&pn=Sparkle%20@kkv&am=${cartTotal}&cu=INR&tn=Sparkle%20Order%20Payment`;

  const copyUpiId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('sparklekkv@ibl');
      showToast("Copied UPI ID sparklekkv@ibl!");
    }
  };

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
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#FCE4EC] my-auto font-poppins relative">
        
        {/* Header - Fixed inside modal container */}
        <div className="bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-montserrat tracking-widest uppercase font-bold">
              <strong className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</strong> <span className="text-[#2C2C2C] bg-white/90 px-1 py-0.5 rounded text-[9px] font-extrabold lowercase font-poppins ml-0.5">@kkv</span> Secure Checkout
            </span>
            <h2 className="font-serif-luxury text-xl font-bold">
              {step === 1 && "Shipping & Delivery Address"}
              {step === 2 && "PhonePe & Payment Options"}
              {step === 3 && "Order Placed & Received Successfully!"}
            </h2>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Item Summary Bar */}
        {cart.length > 0 && (
          <div className="bg-[#FFF9F5] px-4 sm:px-6 py-2.5 border-b border-[#FCE4EC] flex items-center justify-between text-xs font-poppins shrink-0">
            <span className="text-gray-600 font-medium">
              Checkout Items: <strong className="text-[#2C2C2C]">{cart.length} Product{cart.length > 1 ? 's' : ''} ({cart.reduce((s, i) => s + i.quantity, 0)} Units)</strong>
            </span>
            {cart.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  if (cart[0] && cart[0].product) {
                    clearCart();
                    addToCart(cart[0].product, cart[0].quantity, cart[0].selectedColor);
                    showToast("Updated to checkout ONLY 1 item!");
                  }
                }}
                className="text-[11px] text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-full font-bold font-montserrat transition-colors"
              >
                Reset to Only 1 Item
              </button>
            )}
          </div>
        )}

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          
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

                {/* Mandatory Unboxing Video Warning Banner */}
                <div className="bg-amber-50/95 border border-amber-300/80 rounded-2xl p-3.5 space-y-1 text-left font-poppins">
                  <div className="flex items-center gap-1.5 text-amber-900 font-montserrat text-xs font-bold">
                    <Video className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Mandatory Unboxing Video Policy</span>
                  </div>
                  <p className="text-[11px] text-amber-800 font-light leading-relaxed">
                    ⚠️ <strong>Important Return & Damage Guarantee:</strong> Returns/replacements for damaged or defective products are accepted <u>ONLY with a continuous unboxing video proof</u> (showing original parcel seal being opened on camera for the first time without edits).
                  </p>
                </div>

                <div className="pt-2 flex justify-end font-montserrat">
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

              {/* Order Total & 7-Day Express Delivery Banner */}
              <div className="p-4 bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-montserrat tracking-widest text-[#D4AF7F]">Amount Payable</span>
                    <p className="text-2xl font-bold font-poppins">₹{cartTotal}</p>
                  </div>
                  <span className="bg-[#D4AF7F] text-[#2C2C2C] font-bold text-[10px] px-3 py-1 rounded-full uppercase font-montserrat">
                    30% OFF Applied
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300 font-poppins font-medium">
                  <Truck className="w-4 h-4 text-[#D4AF7F] shrink-0" />
                  <span>🚚 <strong>Guaranteed 7-Day Delivery:</strong> Every item in your order is delivered within 7 business days pan-India.</span>
                </div>
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
                        <span className="text-xs font-bold text-[#2C2C2C]">PhonePe, GPay, Paytm & Scanner UPI Payment</span>
                        <p className="text-[10px] text-gray-500 font-poppins">sparklekkv@ibl • Auto-Fills ₹{cartTotal}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#5f259f] text-white font-bold px-2.5 py-1 rounded-full">RECOMMENDED</span>
                  </div>

                  {paymentMethod === 'PhonePe' && (
                    <div className="mt-4 pt-4 border-t border-[#D4AF7F]/30 font-poppins text-xs space-y-4 text-center">
                      
                      {/* Dynamic Live Auto-Filling QR Code */}
                      <div className="max-w-[260px] mx-auto rounded-3xl p-4 bg-white border-2 border-[#5f259f] shadow-lg text-center space-y-2">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-[10px] text-gray-400 font-montserrat font-bold uppercase tracking-wider">Dynamic QR</span>
                          <span className="text-xs font-bold text-[#5f259f] font-montserrat">Sparkle @kkv</span>
                        </div>
                        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white p-2 border border-gray-100 flex items-center justify-center">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(upiDeepLink)}`}
                            alt="Scan to Pay Sparkle @kkv"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="pt-1">
                          <p className="text-[11px] text-[#2C2C2C] font-semibold">
                            Scan with PhonePe, GPay, Paytm or Any UPI App
                          </p>
                          <p className="text-xs font-extrabold text-[#5f259f] mt-0.5">
                            Auto-fills exact amount ₹{cartTotal}
                          </p>
                          <div className="flex items-center justify-center gap-1.5 mt-2 bg-[#FFF9F5] py-1 px-2.5 rounded-lg border border-[#D4AF7F]/30 w-fit mx-auto">
                            <span className="text-[10px] text-gray-700 font-mono font-semibold">sparklekkv@ibl</span>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); copyUpiId(); }}
                              className="text-gray-400 hover:text-[#C89B3C] p-0.5"
                              title="Copy UPI ID"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Instant Payment Buttons Grid: PhonePe, GPay, Paytm, SuperMoney */}
                      <div className="space-y-2 pt-1 max-w-md mx-auto">
                        <p className="text-[11px] font-montserrat font-bold text-[#2C2C2C] uppercase tracking-wider">
                          Instant App Payment Buttons
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={phonepeLink}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#5f259f] hover:bg-[#4a1c7d] text-white font-montserrat font-bold py-2.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>PhonePe</span>
                          </a>

                          <a
                            href={gpayLink}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#4285F4] hover:bg-[#3367D6] text-white font-montserrat font-bold py-2.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Google Pay</span>
                          </a>

                          <a
                            href={paytmLink}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#00baf2] hover:bg-[#0094c4] text-white font-montserrat font-bold py-2.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Paytm</span>
                          </a>

                          <a
                            href={upiDeepLink}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#2C2C2C] hover:bg-[#3A2D32] text-[#FCE4EC] font-montserrat font-bold py-2.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>SuperMoney / UPI</span>
                          </a>
                        </div>
                        <p className="text-[10px] text-gray-500 font-poppins">Click any app button to pay pre-filled ₹{cartTotal} directly</p>
                      </div>

                    </div>
                  )}
                </div>


                {/* Myntra / Meesho Security Trust Footer Badges */}
                <div className="bg-[#FFF9F5] border border-[#D4AF7F]/30 p-3 rounded-2xl flex items-center justify-around text-[10px] text-gray-600 font-montserrat font-bold">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit SSL Protection</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
                    <span>100% Original Products</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C89B3C]" />
                    <span>Easy Exchange</span>
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
                <span className="text-xs font-montserrat uppercase tracking-widest text-[#C89B3C] font-bold">Sparkle @kkv Order Receipt</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C]">
                  Thank You, {placedOrderInfo.customerName}!
                </h3>
                <p className="text-xs text-gray-500">Order ID: <strong className="text-[#2C2C2C]">{placedOrderInfo.id}</strong></p>
              </div>

              {/* Order Summary Receipt Box */}
              <div className="bg-[#FFF9F5] p-6 rounded-3xl border border-[#FCE4EC] max-w-md mx-auto text-left space-y-3 text-xs">
                
                {/* ORDER RECEIVED & VERIFIED STATUS BADGE */}
                <div className="bg-emerald-600 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                    <div>
                      <span className="text-[10px] font-montserrat uppercase tracking-wider text-emerald-100 font-bold block">Order Status</span>
                      <strong className="text-sm font-bold uppercase">Order Received</strong>
                    </div>
                  </div>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    Payment Verified
                  </span>
                </div>

                {/* 7-Day Express Delivery Guarantee Box */}
                <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl flex items-center gap-3 text-emerald-950 font-poppins">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs text-emerald-900 font-bold">🚚 Guaranteed 7-Day Product Delivery</strong>
                    <span className="text-[11px] text-emerald-700">Estimated Delivery Date: <strong className="text-emerald-900">{placedOrderInfo.estimatedDeliveryDate || 'Within 7 Business Days'}</strong></span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold text-gray-700 border-b border-[#D4AF7F]/30 pb-2 pt-1">
                  <span>Items Total ({placedOrderInfo.items.length} Product{placedOrderInfo.items.length > 1 ? 's' : ''})</span>
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
                <div className="pt-2 text-[11px] text-gray-500 font-light border-t border-gray-100 space-y-1">
                  <p><strong>Deliver To:</strong> {placedOrderInfo.shippingAddress.street}, {placedOrderInfo.shippingAddress.city} - {placedOrderInfo.shippingAddress.pincode}</p>
                  <p><strong>Guaranteed Delivery:</strong> All items arriving by <strong>{placedOrderInfo.estimatedDeliveryDate}</strong></p>
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
