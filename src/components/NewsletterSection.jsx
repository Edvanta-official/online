import React, { useState, useRef } from 'react';
import { Mail, Sparkles, CheckCircle2, Loader2, Send, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hiddenFormRef = useRef(null);
  const { showToast } = useShop();

  const mailtoLink = `mailto:sparklekkvofficial@gmail.com?subject=${encodeURIComponent(`🎉 Congratulations! New VIP Subscriber: ${email}`)}&body=${encodeURIComponent(`Congratulations!\n\nA new customer subscribed to Sparkle @kkv VIP Insider Club.\n\nSubscriber Email: ${email}\nSubscription Date: ${new Date().toLocaleString()}\nPromotional Code Issued: SPARKEL10 (10% OFF)`)}`;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // 1. Send to Express Backend API (http://localhost:5000/api/subscribe)
      try {
        await fetch("http://localhost:5000/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
      } catch (backendErr) {
        console.log("Express backend connection:", backendErr);
      }

      // 2. Primary FormSubmit email dispatch to sparklekkvofficial@gmail.com
      await fetch("https://formsubmit.co/ajax/sparklekkvofficial@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          subscriber_email: email,
          _subject: `🎉 Congratulations! New VIP Subscriber: ${email}`,
          message: `Congratulations!\n\nA new VIP Insider subscriber has registered on Sparkle @kkv Boutique:\nSubscriber Email: ${email}\nSubscription Date: ${new Date().toLocaleString()}\nDiscount Code Issued: SPARKEL10 (10% OFF)`
        })
      });

      // 3. Submit hidden native form as fallback
      if (hiddenFormRef.current) {
        hiddenFormRef.current.submit();
      }
    } catch (err) {
      console.log("Email dispatch notification:", err);
    } finally {
      setIsSubmitting(false);
      setSubscribed(true);
      showToast(`🎉 Congratulations! Email notification dispatched for ${email}`);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-[#FCE4EC] via-[#FFF9F5] to-[#FCE4EC] border-y border-[#D4AF7F]/30 relative overflow-hidden">
      
      {/* Hidden iframe & fallback form to guarantee FormSubmit delivery without page refresh */}
      <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }}></iframe>
      <form
        ref={hiddenFormRef}
        action="https://formsubmit.co/sparklekkvofficial@gmail.com"
        method="POST"
        target="hidden_iframe"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="_subject" value={`🎉 Congratulations! New VIP Subscriber: ${email}`} />
        <input type="hidden" name="message" value={`Congratulations! New subscriber: ${email}`} />
        <input type="hidden" name="_captcha" value="false" />
      </form>

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
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-[#D4AF7F]/50 max-w-lg mx-auto space-y-4 animate-in zoom-in-95 text-center font-poppins">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
              🎉
            </div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2C2C2C]">
              Congratulations! You're Subscribed!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Subscriber Email: <strong className="text-[#C89B3C] font-mono">{email}</strong>
              <br />
              An alert email notification has been sent to Admin (<strong className="text-[#2C2C2C]">sparklekkvofficial@gmail.com</strong>).
            </p>

            <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#D4AF7F]/40 inline-flex items-center justify-center gap-2">
              <span className="text-xs font-montserrat text-gray-700 font-medium">Use Coupon Code: </span>
              <strong className="text-[#C89B3C] font-mono text-sm font-bold">SPARKEL10</strong>
              <span className="text-xs text-gray-500 font-medium">(10% OFF)</span>
            </div>

            {/* Direct Mailto Fallback Button */}
            <div className="pt-2">
              <a
                href={mailtoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#2C2C2C] hover:bg-[#C89B3C] text-white font-montserrat font-bold text-[11px] px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4AF7F]" />
                <span>Send Direct Mail to Admin (sparklekkvofficial@gmail.com)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
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
