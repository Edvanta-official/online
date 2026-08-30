import React, { useEffect, useState } from 'react';
import { XCircle, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PaymentFailedPage = () => {
  const [reason, setReason] = useState('Payment was not completed or was cancelled.');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
      const r = params.get('reason') || params.get('error') || 'Your payment was not completed.';
      setReason(r);
    } catch (e) {}
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 font-poppins flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-rose-100">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-rose-600" />
        </div>

        <span className="text-[11px] font-montserrat font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
          Payment Failed / Cancelled
        </span>

        <h1 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C] mt-3">
          Payment Not Completed
        </h1>

        <p className="text-xs text-[#707070] mt-2">
          {reason} Your order has not been marked as paid.
        </p>

        <div className="space-y-3 my-8">
          <Link
            to="/shop"
            className="w-full bg-gradient-to-r from-[#2C2C2C] via-[#C89B3C] to-[#2C2C2C] text-white py-3.5 px-4 rounded-xl text-xs font-bold font-montserrat uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Payment Again</span>
          </Link>

          <a
            href="https://wa.me/919949157771?text=Hello%20Sparkle%20Support!%20My%20PayU%20payment%20failed.%20Please%20help."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white py-3.5 px-4 rounded-xl text-xs font-bold font-montserrat uppercase tracking-wider shadow-md hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Need Help? Contact WhatsApp Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};
