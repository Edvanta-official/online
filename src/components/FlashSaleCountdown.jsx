import React, { useState, useEffect } from 'react';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FlashSaleCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-[#2C2C2C] via-[#3A2A30] to-[#2C2C2C] text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#F48FB1]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Flash Sale Banner Text */}
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#C89B3C] text-white text-[10px] font-montserrat font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 fill-current animate-bounce" /> Limited Time VIP Offer
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#FCE4EC]">
              Sparkel Flash Sale — Up To 40% OFF
            </h2>
            <p className="text-xs text-gray-300 font-poppins font-light max-w-md">
              Grab bestselling Swarovski Hair Clips and Kundan Choker Sets before stock runs out!
            </p>
          </div>

          {/* Countdown Clock Displays */}
          <div className="flex items-center gap-3 font-montserrat">
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl min-w-[70px]">
              <span className="text-2xl font-extrabold text-[#D4AF7F]">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-300 font-medium">Hours</span>
            </div>
            <span className="text-xl font-bold text-[#FCE4EC] animate-pulse">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl min-w-[70px]">
              <span className="text-2xl font-extrabold text-[#D4AF7F]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-300 font-medium">Mins</span>
            </div>
            <span className="text-xl font-bold text-[#FCE4EC] animate-pulse">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl min-w-[70px]">
              <span className="text-2xl font-extrabold text-[#F48FB1]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-300 font-medium">Secs</span>
            </div>
          </div>

          {/* CTA Link */}
          <Link
            to="/shop?flashSale=true"
            className="shimmer-btn bg-gradient-to-r from-[#D4AF7F] to-[#C89B3C] text-[#2C2C2C] hover:text-black font-montserrat font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          >
            <span>Shop Flash Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </div>
    </section>
  );
};
