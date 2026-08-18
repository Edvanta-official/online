import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useShop();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast("🎁 Subscribed! Use Code SPARKEL10 for 10% OFF!");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-[#FCE4EC] via-[#FFF9F5] to-[#FCE4EC] border-y border-[#D4AF7F]/30 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
        
        <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full border border-[#D4AF7F]/40 shadow-sm text-xs font-montserrat uppercase font-bold text-[#C89B3C]">
          <Sparkles className="w-3.5 h-3.5" /> VIP Sparkel Insider Club
        </div>

        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2C2C2C]">
          Unlock 10% OFF Your First Luxury Order
        </h2>

        <p className="text-xs sm:text-sm text-gray-600 font-poppins max-w-lg mx-auto font-light leading-relaxed">
          Join 1,000+ fashion lovers. Receive exclusive secret flash sale invites, early access to new hair accessories, and style tips straight to your inbox.
        </p>

        {subscribed ? (
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-[#F48FB1] inline-flex items-center gap-3 text-emerald-700 font-montserrat text-xs font-bold animate-in zoom-in-95">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>Welcome to the VIP Club! Use Code: <strong className="text-[#C89B3C]">SPARKEL10</strong> at Checkout.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF7F]" />
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#D4AF7F]/50 rounded-full py-3.5 pl-11 pr-4 text-xs font-poppins focus:outline-none focus:ring-2 focus:ring-[#C89B3C] shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="shimmer-btn bg-[#2C2C2C] text-[#FCE4EC] hover:text-white font-montserrat font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
