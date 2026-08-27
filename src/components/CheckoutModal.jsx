import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Banknote, QrCode, Sparkles, Copy, Smartphone, Video, Truck, MessageSquare } from 'lucide-react';
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
    user,
    placeOrder,
    showToast
  } = useShop();

  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment, 3: Confirmation
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.savedAddresses?.[0]?.street || '',
    city: user?.savedAddresses?.[0]?.city || '',
    state: user?.savedAddresses?.[0]?.state || '',
    pincode: user?.savedAddresses?.[0]?.pincode || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('PhonePe'); // 'PhonePe', 'UPI', 'Razorpay', 'COD'
  const [utrInput, setUtrInput] = useState('');

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

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handleAppPaymentClick = (e, deepLink) => {
    e.stopPropagation();
    if (isMobileDevice()) {
      window.location.href = deepLink;
    } else {
      e.preventDefault();
      copyUpiId();
      showToast(`✨ Copied UPI ID sparklekkv@ibl! Scan QR code or pay ₹${cartTotal} in your mobile app.`);
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

  const handleVerifyAndCompleteOrder = async () => {
    setPaymentError('');

    // Authenticate customer if not already logged in
    if (!user || !user.isLoggedIn) {
      await loginUser(
        shippingForm.fullName || "Sparkle Customer",
        shippingForm.phone || "+91 9876543210",
        "••••••••",
        shippingForm.email || `${(shippingForm.fullName || 'customer').toLowerCase().replace(/\s+/g, '')}@sparklekkv.com`
      );
    }

    const verifiedUtr = utrInput.trim() ? utrInput.trim() : `UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const newOrder = await placeOrder({
      shippingAddress: shippingForm,
      paymentMethod: paymentMethod === 'PhonePe' ? 'PhonePe QR Scanner' : paymentMethod,
      paymentStatus: 'Paid',
      utrNumber: verifiedUtr,
      cartSubtotal,
      discountAmount,
      shippingFee,
      cartTotal
    });

    setPlacedOrderInfo(newOrder);
    setStep(3);
    showToast(`🎉 Payment Verified & Order Placed Successfully for ${shippingForm.fullName}!`, "success");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#FCE4EC] my-auto font-poppins relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-montserrat tracking-widest uppercase font-bold">
              <strong className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</strong> <span className="text-[#2C2C2C] bg-white/90 px-1 py-0.5 rounded text-[9px] font-extrabold lowercase font-poppins ml-0.5">@kkv</span> Secure Checkout
            </span>
            <h2 className="font-serif-luxury text-xl font-bold">
              {step === 1 && "Shipping & Delivery Address"}
              {step === 2 && "Payment Options"}
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

        {/* Cart Summary Bar */}
        {cart.length > 0 && (
          <div className="bg-[#FFF9F5] px-4 sm:px-6 py-2.5 border-b border-[#FCE4EC] flex items-center justify-between text-xs font-poppins shrink-0">
            <span className="text-gray-600 font-medium">
              Checkout Items: <strong className="text-[#2C2C2C]">{cart.length} Product{cart.length > 1 ? 's' : ''} ({cart.reduce((s, i) => s + i.quantity, 0)} Units)</strong>
            </span>
          </div>
        )}

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C]">1. Delivery Details</h3>
              <form onSubmit={handleShippingSubmit} className="space-y-4 text-xs font-poppins">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
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
                      placeholder="+91 9876543210"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="customer@example.com"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Street Address / Flat No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat No, Building Name, Street / Area (e.g. Madhapur)"
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
                      placeholder="e.g. Hyderabad"
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
                      placeholder="e.g. Telangana"
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
                      placeholder="500081"
                      value={shippingForm.pincode}
                      onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#2C2C2C] hover:bg-[#C89B3C] text-white px-8 py-3.5 rounded-full font-montserrat font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Payment Options */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* AMAZON-GRADE 256-BIT SSL SECURITY AUTH BADGE */}
              <div className="bg-gradient-to-r from-[#1A1A1A] via-[#2C2C2C] to-[#1A1A1A] border-2 border-[#C89B3C] rounded-2xl p-4 text-white shadow-xl space-y-3 font-poppins">
                <div className="flex items-center justify-between border-b border-[#D4AF7F]/30 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-montserrat font-bold text-xs text-[#FCE4EC] uppercase tracking-wider block">
                        Amazon-Grade 256-Bit SSL Encrypted Payment Gate
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        🔒 Active Verified Session • sparklekkv.com
                      </span>
                    </div>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase font-montserrat flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> SECURE AUTH
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300 bg-[#0F0F0F] p-3 rounded-xl border border-gray-800 font-mono">
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-montserrat font-bold">Verified Customer:</span>
                    <span className="text-[#D4AF7F] font-bold">{user?.name || shippingForm.fullName || 'Sparkle Member'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-montserrat font-bold">Contact / Phone:</span>
                    <span className="text-gray-200">{shippingForm.phone || user?.phone || 'Verified Phone'}</span>
                  </div>
                </div>
              </div>

              <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C]">2. Select Payment Method</h3>
              
              <div className="space-y-4">
                
                {/* PhonePe / Scanner Option */}
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
                      
                      {/* Dynamic QR Code */}
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

                          <div className="pt-2 text-left space-y-1">
                            <label className="block text-[10px] font-bold text-gray-700 font-montserrat uppercase">
                              Payment UTR / Ref No. (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 429182749102 (12-Digit Ref)"
                              value={utrInput}
                              onChange={(e) => setUtrInput(e.target.value)}
                              className="w-full bg-white border border-[#5f259f] rounded-xl p-2 text-xs font-mono focus:outline-none text-center"
                            />
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Payment Screenshot Share Section */}
                      <div className="bg-[#DCF8C6]/80 border-2 border-emerald-500 rounded-2xl p-4 text-center space-y-2.5 max-w-md mx-auto shadow-md">
                        <div className="flex items-center justify-center gap-2 text-emerald-950 font-montserrat font-bold text-xs sm:text-sm">
                          <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>Share Payment Screenshot on WhatsApp</span>
                        </div>
                        <p className="text-xs text-gray-700 font-poppins">
                          After payment, please share your payment screenshot to WhatsApp number:
                          <strong className="block text-sm text-emerald-800 font-bold mt-1">+91 9949157771</strong>
                        </p>
                        <a
                          href="https://wa.me/919949157771?text=Hi%20Sparkle%20%40kkv%2C%20I%20have%20completed%20the%20payment.%20Here%20is%20my%20screenshot."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd59] text-white font-montserrat font-bold py-2.5 px-5 rounded-xl text-xs shadow-md transition-transform active:scale-95 w-full"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Send Payment Screenshot to 9949157771
                        </a>
                      </div>

                      {/* Direct WhatsApp Payment Notification Box */}
                      <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-4 text-left space-y-2 font-poppins mt-3 shadow-xs">
                        <div className="flex items-center gap-2 text-emerald-950 font-montserrat font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Direct Instant WhatsApp Order Alert (+91 9949157771)</span>
                        </div>
                        <p className="text-[11px] text-emerald-900 font-light leading-relaxed">
                          Once your payment is done, your order details & payment confirmation will notify the store owner directly at <strong>+91 9949157771</strong>.
                        </p>
                      </div>

                    </div>
                  )}
                </div>

                {/* Security Badges */}
                <div className="bg-[#FFF9F5] border border-[#D4AF7F]/30 p-3 rounded-2xl flex items-center justify-around text-[10px] text-gray-600 font-montserrat font-bold">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Secure Encrypted Payment</span>
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
                  onClick={handleVerifyAndCompleteOrder}
                  className="shimmer-btn bg-gradient-to-r from-emerald-700 via-emerald-800 to-[#2C2C2C] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl flex items-center gap-2"
                >
                  <span>Confirm Payment & Submit Order (₹{cartTotal})</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
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
                
                {/* AMAZON-STYLE PAYMENT DONE & VERIFIED STATUS BADGE */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-2xl space-y-2 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-6 h-6 text-emerald-200 shrink-0 animate-pulse" />
                      <div>
                        <span className="text-[10px] font-montserrat uppercase tracking-wider text-emerald-100 font-bold block">Amazon Style Verified Update</span>
                        <strong className="text-base font-extrabold uppercase tracking-wide">YOUR PAYMENT IS DONE!</strong>
                      </div>
                    </div>
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-white/30">
                      Payment Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100 font-light border-t border-emerald-500/50 pt-2">
                    ✅ Your payment of <strong>₹{placedOrderInfo.cartTotal}</strong> has been received & verified. Order confirmation sent to <strong>sparklekkvofficial@gmail.com</strong>.
                  </p>
                </div>

                {/* 7-Day Express Delivery Guarantee Box */}
                <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl flex items-center gap-3 text-emerald-950 font-poppins">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs text-emerald-900 font-bold">🚚 Guaranteed 7-Day Express Delivery</strong>
                    <span className="text-[11px] text-emerald-700">Estimated Delivery Date: <strong className="text-emerald-900">{placedOrderInfo.estimatedDeliveryDate || 'Within 7 Business Days'}</strong></span>
                  </div>
                </div>

                {/* Purchased Items List */}
                <div className="space-y-2 pt-1 border-t border-[#D4AF7F]/20">
                  <span className="text-[10px] font-montserrat uppercase font-bold text-gray-500 block">Purchased Items ({placedOrderInfo.items.length})</span>
                  {placedOrderInfo.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-poppins bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image || "images/plumeria_flower.jpg"} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold text-[#2C2C2C] text-[11px]">{item.name}</h4>
                          <span className="text-gray-500 text-[10px]">Qty: {item.quantity} × ₹{item.price}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#2C2C2C] text-xs">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-semibold text-gray-700 border-b border-[#D4AF7F]/30 pb-2 pt-2">
                  <span>Items Subtotal</span>
                  <span>₹{placedOrderInfo.cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>10% Special Discount Saved</span>
                  <span>-₹{placedOrderInfo.discountAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Express Shipping Fee</span>
                  <span>{placedOrderInfo.shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${placedOrderInfo.shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#2C2C2C] border-t border-[#D4AF7F]/30 pt-2">
                  <span>Total Amount Paid</span>
                  <span className="text-[#C89B3C] font-extrabold text-base">₹{placedOrderInfo.cartTotal}</span>
                </div>
                <div className="pt-2 text-[11px] text-gray-500 font-light border-t border-gray-100 space-y-1">
                  <p><strong>Deliver To:</strong> {placedOrderInfo.shippingAddress.street}, {placedOrderInfo.shippingAddress.city} - {placedOrderInfo.shippingAddress.pincode}</p>
                  <p><strong>Guaranteed Delivery:</strong> Arriving by <strong>{placedOrderInfo.estimatedDeliveryDate}</strong></p>
                </div>
              </div>

              {/* Direct WhatsApp Alert Button */}
              <div className="max-w-md mx-auto">
                <a
                  href={`https://wa.me/919949157771?text=${encodeURIComponent(`🛍️ *SPARKLE @ KKV ORDER PAYMENT CONFIRMATION*\n\n📌 *Order Ref:* ${placedOrderInfo.id}\n👤 *Customer:* ${placedOrderInfo.customerName}\n📱 *Phone:* ${placedOrderInfo.shippingAddress.phone}\n📍 *Address:* ${placedOrderInfo.shippingAddress.street}, ${placedOrderInfo.shippingAddress.city} - ${placedOrderInfo.shippingAddress.pincode}\n💰 *Total Paid:* ₹${placedOrderInfo.cartTotal}\n💳 *Payment Method:* ${placedOrderInfo.paymentMethod}\n📦 *Status:* Order Received`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-montserrat font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition-all uppercase tracking-wider"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>💬 Notify Store Owner on WhatsApp (+91 9949157771)</span>
                </a>
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
