import React, { useState, useEffect } from 'react';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FlashSaleCountdown = () => {
  // Use localStorage to maintain target end timestamp across page refreshes!
  const getTargetEndTime = () => {
    const STORAGE_KEY = 'sparkle_flash_sale_target';
    const saved = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (saved) {
      const target = parseInt(saved, 10);
      if (target > now) {
        return target;
      }
    }

    // Set target 2 days 14 hours 32 mins 45 secs from now
    const newTarget = now + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (32 * 60 * 1000) + (45 * 1000);
    try {
      localStorage.setItem(STORAGE_KEY, newTarget.toString());
    } catch (e) {}
    return newTarget;
  };

  const calculateTimeLeft = (targetTime) => {
    const diff = Math.max(0, targetTime - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  const [targetEndTime] = useState(getTargetEndTime);
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetEndTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetEndTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetEndTime]);

  return (
    <section className="my-6 sm:my-10 py-10 sm:py-14 bg-gradient-to-r from-[#2C2C2C] via-[#3A2A30] to-[#2C2C2C] text-white relative overflow-hidden shadow-xl border-y-2 border-[#D4AF7F]/40 isolate">
      
      {/* Background Ambient Glows */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#F48FB1]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-[#D4AF7F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          
          {/* Flash Sale Banner Text */}
          <div className="space-y-3 text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 bg-[#C89B3C] text-white text-[10px] sm:text-xs font-montserrat font-bold px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
              <Zap className="w-4 h-4 fill-current animate-bounce" /> Flash Sale — VIP Limited Time Offer
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FCE4EC] tracking-tight leading-tight">
              <span className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</span> <span className="text-white text-base sm:text-xl font-extrabold lowercase font-poppins">@kkv</span> Flash Sale — Up To 10% OFF
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-poppins font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Grab bestselling Swarovski Hair Clips, Kundan Choker Sets, and Anti-Tarnish Chains before limited stock runs out!
            </p>
          </div>

          {/* Countdown Clock Displays (Days, Hours, Minutes, Seconds) */}
          <div className="flex items-center gap-2 sm:gap-4 font-montserrat shrink-0 my-2 lg:my-0">
            {/* Days */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 px-3.5 sm:px-5 py-3 rounded-2xl min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF7F]">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-300 font-semibold mt-0.5">Days</span>
            </div>

            <span className="text-xl sm:text-2xl font-bold text-[#FCE4EC] animate-pulse">:</span>

            {/* Hours */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 px-3.5 sm:px-5 py-3 rounded-2xl min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF7F]">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-300 font-semibold mt-0.5">Hours</span>
            </div>

            <span className="text-xl sm:text-2xl font-bold text-[#FCE4EC] animate-pulse">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 px-3.5 sm:px-5 py-3 rounded-2xl min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF7F]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-300 font-semibold mt-0.5">Mins</span>
            </div>

            <span className="text-xl sm:text-2xl font-bold text-[#FCE4EC] animate-pulse">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 px-3.5 sm:px-5 py-3 rounded-2xl min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F48FB1]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-300 font-semibold mt-0.5">Secs</span>
            </div>
          </div>

          {/* CTA Link */}
          <Link
            to="/shop?flashSale=true"
            className="shimmer-btn bg-gradient-to-r from-[#D4AF7F] to-[#C89B3C] text-[#2C2C2C] hover:text-black font-montserrat font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 shrink-0"
          >
            <span>Shop Flash Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </div>
    </section>
  );
};
