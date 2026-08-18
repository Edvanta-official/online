import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useShop();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Send notification email to admin email sparklekkvofficial@gmail.com
      await fetch("https://formsubmit.co/ajax/sparklekkvofficial@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          subscriber_email: email,
          _subject: `🎉 Congratulations! New VIP Subscriber: ${email}`,
          message: `Congratulations! A new customer subscribed to Sparkle @kkv VIP Insider Club.\n\nSubscriber Email: ${email}\nSubscription Time: ${new Date().toLocaleString()}\nPromotional Code: SPARKEL10 (10% OFF)`
        })
      });
    } catch (err) {
      console.log("Email dispatch notification:", err);
    } finally {
      setIsSubmitting(false);
      setSubscribed(true);
      showToast(`🎉 Congratulations! VIP offer activated for ${email}`);
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
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-[#D4AF7F]/50 max-w-lg mx-auto space-y-3 animate-in zoom-in-95 text-center font-poppins">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
              🎉
            </div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2C2C2C]">
              Congratulations! You're Subscribed!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Subscriber Email: <strong className="text-[#C89B3C] font-mono">{email}</strong>
              <br />
              An instant alert email notification has been dispatched to Admin (<strong className="text-[#2C2C2C]">sparklekkvofficial@gmail.com</strong>).
            </p>
            <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#D4AF7F]/40 inline-flex items-center justify-center gap-2">
              <span className="text-xs font-montserrat text-gray-700 font-medium">Use Code: </span>
              <strong className="text-[#C89B3C] font-mono text-sm font-bold">SPARKEL10</strong>
              <span className="text-xs text-gray-500 font-medium">(10% OFF)</span>
            </div>
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
                disabled={isSubmitting}
                className="w-full bg-white border border-[#D4AF7F]/50 rounded-full py-3.5 pl-11 pr-4 text-xs font-poppins focus:outline-none focus:ring-2 focus:ring-[#C89B3C] shadow-sm disabled:opacity-70"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="shimmer-btn bg-[#2C2C2C] text-[#FCE4EC] hover:text-white font-montserrat font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF7F]" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#D4AF7F]" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
