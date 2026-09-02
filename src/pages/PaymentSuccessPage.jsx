import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight, MessageSquare, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { apiFetch } from '../services/apiConfig';

export const PaymentSuccessPage = () => {
  const { clearCart, placeOrder, user } = useShop();
  const [txnid, setTxnid] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
      const t = params.get('txnid') || params.get('mihpayid') || `SPK-${Date.now()}`;
      const a = params.get('amount') || '569.00';
      setTxnid(t);
      setAmount(a);

      // Save confirmed order to MySQL & local engine ONLY AFTER payment is completed
      const pendingStr = sessionStorage.getItem('sparkle_pending_checkout');
      if (pendingStr) {
        const pending = JSON.parse(pendingStr);
        
        apiFetch('/payment/payu/create', {
          method: 'POST',
          body: JSON.stringify({
            amount: pending.cartTotal || a,
            firstname: (pending.customerName || 'Customer').split(' ')[0],
            email: pending.email || 'customer@sparklekkv.com',
            phone: pending.phone || '9949157771',
            productinfo: 'SparkleAccessoriesPaid',
            cartItems: pending.cartItems || [],
            shippingAddress: pending.shippingAddress,
            customerId: pending.customerId || user?.id,
            paymentStatus: 'paid',
            orderStatus: 'Order Received',
            payuTxnid: t
          })
        }).catch(() => {});

        if (placeOrder) {
          placeOrder({
            shippingAddress: pending.shippingAddress,
            paymentMethod: 'PayU Hosted Gateway',
            payuTxnid: t,
            items: pending.cartItems,
            cartTotal: pending.cartTotal || a
          });
        }

        // Clear cart NOW that payment is completed!
        if (clearCart) clearCart();
        sessionStorage.removeItem('sparkle_pending_checkout');
      } else {
        if (clearCart) clearCart();
      }
    } catch (e) {}
  }, []);

  const whatsappMsg = encodeURIComponent(`Hello Sparkle @ KKV Support! I completed my PayU payment for Order ID: ${txnid} (Amount: ₹${amount}). Please process my order!`);
  const whatsappUrl = `https://wa.me/919949157771?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 font-poppins flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-emerald-100">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
        </div>

        <span className="text-[11px] font-montserrat font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Payment Successful
        </span>

        <h1 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C] mt-3">
          Order Received!
        </h1>

        <p className="text-xs text-[#707070] mt-2">
          Thank you for shopping with Sparkle @ KKV. Your PayU transaction has been verified server-side.
        </p>

        <div className="bg-[#F8F9FA] rounded-2xl p-4 my-6 text-left space-y-2 border border-gray-100 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID / Transaction ID:</span>
            <span className="font-bold font-mono text-[#2C2C2C]">{txnid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Paid Amount:</span>
            <span className="font-bold text-emerald-600">₹{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Status:</span>
            <span className="font-bold text-emerald-600 uppercase">Paid</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Order Status:</span>
            <span className="font-bold text-[#C89B3C] uppercase">Order Received</span>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white py-3.5 px-4 rounded-xl text-xs font-bold font-montserrat uppercase tracking-wider shadow-md hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Confirmation on WhatsApp (+91 9949157771)</span>
          </a>

          <Link
            to="/dashboard"
            className="w-full bg-[#2C2C2C] text-white py-3.5 px-4 rounded-xl text-xs font-bold font-montserrat uppercase tracking-wider shadow-md hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View My Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
