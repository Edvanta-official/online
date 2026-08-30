import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, CreditCard, Sparkles, Building2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { apiFetch } from '../services/apiConfig';
import { sha512 } from 'js-sha512';

export const PaymentPage = () => {
  const { showToast, cartTotal } = useShop();

  const [pageTitle, setPageTitle] = useState('Sparkle @ KKV Credit & Debit Card Checkout');
  const [pageDescription, setPageDescription] = useState('Official online payment gateway for Sparkle @ KKV. Enter your Credit Card or Debit Card details below for instant 256-bit SSL encrypted payment.');
  
  // Read pre-filled checkout details from session or cart
  const [amount, setAmount] = useState('569.00');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const [isPayULoading, setIsPayULoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    // Instant redirect to Official PayU Live Payment Options Gateway Link
    showToast('🔒 Connecting to PayU Official Secure Payment Gateway...');
    window.location.href = 'https://api.payu.in/public/#/f6d2f6cb14024877660918af9369f2a3/paymentoptions';
  }, []);

  const cleanAmount = Number(parseFloat(amount || 569)).toFixed(2);

  const formatCardNumber = (val) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return val;
    }
  };

  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayUPayment = (e) => {
    if (e) e.preventDefault();
    setPaymentError('');
    setIsPayULoading(true);
    showToast('🔒 Connecting to PayU Official Secure Payment Gateway...');
    
    const key = '8izKVp';
    const salt = 'Do2eaSyvC2mBV7HoEPGiiYpaVxsSSmGl';
    const txnid = `SPK-${Date.now()}`;
    const cleanProductInfo = 'SparkleAccessories';
    const cleanFirstName = (fullName.trim().split(' ')[0] || 'Customer').replace(/[^a-zA-Z0-9]/g, '') || 'Customer';
    const cleanEmail = email.trim() || 'customer@sparklekkv.com';
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '') || '9949157771';

    const hashString = `${key}|${txnid}|${cleanAmount}|${cleanProductInfo}|${cleanFirstName}|${cleanEmail}|||||||||||${salt}`;
    const hash = sha512(hashString);

    const params = {
      key,
      txnid,
      amount: cleanAmount,
      productinfo: cleanProductInfo,
      firstname: cleanFirstName,
      email: cleanEmail,
      phone: cleanPhone,
      surl: 'https://sparkle-backend.onrender.com/api/payments/payu/success',
      furl: 'https://sparkle-backend.onrender.com/api/payments/payu/failure',
      hash,
      service_provider: 'payu_paisa',
      udf1: '', udf2: '', udf3: '', udf4: '', udf5: ''
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://secure.payu.in/_payment';

    Object.keys(params).forEach((k) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = params[k];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-8 px-4 sm:px-6 md:px-8 font-poppins text-[#2C2C2C]">
      
      {/* Top Banner */}
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] p-4 sm:p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-montserrat tracking-widest uppercase font-bold text-[#C89B3C]">
            SPARKLE @ KKV CREDIT & DEBIT CARD PAYMENT
          </span>
          <h1 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white mt-1">
            Credit & Debit Card Online Checkout
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#FCE4EC] border border-white/20">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PayU 256-Bit Encrypted</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Order & Payment Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] shadow-sm space-y-5">
            <h2 className="text-sm font-montserrat uppercase font-bold text-[#C89B3C] tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C89B3C]" />
              <span>Card Payment Gateway Info</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-2xl p-3.5 text-sm font-semibold focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Page Description</label>
                <textarea
                  rows={2}
                  value={pageDescription}
                  onChange={(e) => setPageDescription(e.target.value)}
                  className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-2xl p-3.5 text-xs focus:outline-none focus:border-[#C89B3C]"
                />
              </div>
            </div>

            {/* Accepted Cards Display */}
            <div className="pt-3 space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase font-montserrat">Accepted Cards & Banking Partners</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-gray-700 text-center">
                <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#D4AF7F]/30 shadow-xs">
                  <span className="text-lg block">💳</span>
                  <span className="text-[11px] font-bold block mt-1">Visa</span>
                </div>
                <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#D4AF7F]/30 shadow-xs">
                  <span className="text-lg block">🏧</span>
                  <span className="text-[11px] font-bold block mt-1">Mastercard</span>
                </div>
                <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#D4AF7F]/30 shadow-xs">
                  <span className="text-lg block">🇮🇳</span>
                  <span className="text-[11px] font-bold block mt-1">RuPay</span>
                </div>
                <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#D4AF7F]/30 shadow-xs">
                  <span className="text-lg block">🏦</span>
                  <span className="text-[11px] font-bold block mt-1">NetBanking</span>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase font-montserrat">Contact & Customer Support</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="bg-[#FFF9F5] p-3 rounded-xl border border-[#D4AF7F]/20">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Support Email</span>
                  <strong className="text-[#2C2C2C]">sparklekkvofficial@gmail.com</strong>
                </div>
                <div className="bg-[#FFF9F5] p-3 rounded-xl border border-[#D4AF7F]/20">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Support Phone / WhatsApp</span>
                  <strong className="text-[#2C2C2C]">+91 9949157771</strong>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-gray-500 font-bold text-center">
              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PCI-DSS Compliant</span>
              </div>
              <div className="bg-amber-50 text-amber-800 p-2.5 rounded-xl flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>256-Bit Encryption</span>
              </div>
              <div className="bg-blue-50 text-blue-800 p-2.5 rounded-xl flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Instant Receipt</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Credit & Debit Card Details Form Only */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden sticky top-6">
            
            <div className="border-b border-gray-100 p-5 bg-[#FFF9F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C89B3C]" />
                <h3 className="text-base font-bold text-[#2C2C2C] font-montserrat">Card Payment Form</h3>
              </div>
              <span className="text-[11px] font-bold text-[#C89B3C] bg-white px-2.5 py-1 rounded-full border border-[#D4AF7F]/40">
                ₹{cleanAmount}
              </span>
            </div>

            <form onSubmit={handlePayUPayment} className="p-6 space-y-4">
              
              {paymentError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs font-medium">
                  {paymentError}
                </div>
              )}

              {/* Amount Field */}
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Total Payable Amount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-700">₹</span>
                  <input
                    type="text"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="w-full pl-8 pr-4 py-3 bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl text-base font-bold text-[#2C2C2C] focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-[#2C2C2C] focus:outline-none focus:border-[#C89B3C]"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-[#2C2C2C] focus:outline-none focus:border-[#C89B3C]"
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-[#2C2C2C] focus:outline-none focus:border-[#C89B3C]"
                  placeholder="name@example.com"
                />
              </div>

              {/* CARD DETAILS SECTION */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#2C2C2C] font-montserrat uppercase">
                    Credit / Debit Card Details
                  </label>
                  <span className="text-[10px] text-gray-400 font-bold">SSL 256-Bit</span>
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-[10px] text-gray-500 font-semibold mb-1">Card Number *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold tracking-widest text-[#2C2C2C] focus:outline-none focus:border-[#C89B3C]"
                      placeholder="4111 2222 3333 4444"
                    />
                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-semibold mb-1">Expiry Date *</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold tracking-wider text-[#2C2C2C] focus:outline-none focus:border-[#C89B3C]"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-semibold mb-1">CVV / CVC *</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold tracking-widest text-[#2C2C2C] focus:outline-none focus:border-[#C89B3C]"
                      placeholder="•••"
                    />
                  </div>
                </div>

                {/* Name on Card */}
                <div>
                  <label className="block text-[10px] text-gray-500 font-semibold mb-1">Name on Card *</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-[#2C2C2C] focus:outline-none focus:border-[#C89B3C]"
                    placeholder="As printed on card"
                  />
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isPayULoading}
                className="w-full mt-3 bg-gradient-to-r from-[#2C2C2C] via-[#C89B3C] to-[#2C2C2C] text-white py-3.5 px-4 rounded-xl text-xs font-bold font-montserrat uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>{isPayULoading ? 'Processing Card Payment...' : `Pay ₹${cleanAmount} via Credit/Debit Card`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
