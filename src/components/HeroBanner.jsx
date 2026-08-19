import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award } from 'lucide-react';

export const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-[#FFF9F5] via-[#FCE4EC]/40 to-[#FFF9F5]">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#F48FB1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF7F]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/90 border border-[#D4AF7F]/40 shadow-xs px-3 py-1.5 rounded-full font-montserrat text-[9px] sm:text-xs tracking-wider sm:tracking-widest text-[#2C2C2C] uppercase backdrop-blur-md max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-[#C89B3C] shrink-0" />
                <span className="truncate sm:whitespace-normal">Sparkle @ KKV — Where Every Accessory Tells Your Story</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2C2C2C] leading-snug sm:leading-[1.25] max-w-full">
              Luxury Fashion <span className="gold-gradient-text italic font-normal">Accessories</span>
              <br />
              <span className="text-base sm:text-2xl lg:text-3xl font-medium text-[#2C2C2C]/90 block mt-1">
                Designed to Make Every Girl Shine.
              </span>
            </h1>

            {/* Category Pill Subtext */}
            <p className="text-xs sm:text-sm text-gray-600 font-poppins max-w-xl mx-auto lg:mx-0 font-light leading-relaxed px-1 sm:px-0">
              Explore our boutique collection of handcrafted Premium Earrings, Hair Flowers, Butterfly Clips, Bangles, Bracelets, and Choker Necklace Sets.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 font-montserrat">
              <Link
                to="/shop"
                className="shimmer-btn bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] hover:text-white w-full sm:w-auto justify-center px-7 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
              >
                <span>Shop Collection Now</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF7F]" />
              </Link>

              <Link
                to="/shop?category=gift-sets"
                className="bg-white/90 border border-[#D4AF7F]/60 text-[#2C2C2C] hover:bg-[#FCE4EC]/50 w-full sm:w-auto justify-center px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold shadow-md transition-all flex items-center gap-2"
              >
                <span>Explore Gift Sets</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="pt-4 border-t border-[#D4AF7F]/20 flex flex-wrap items-center justify-around sm:justify-between gap-3 text-[11px] sm:text-xs text-gray-600 font-poppins">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span>100% Handcrafted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#F48FB1] shrink-0" />
                <span>1k+ Happy Girls</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D4AF7F] shrink-0" />
                <span>Luxury Velvet Box</span>
              </div>
            </div>

          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-5 relative py-2">
            <div className="relative mx-auto max-w-[280px] sm:max-w-xs lg:max-w-[360px] lg:ml-auto">
              
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FCE4EC] via-[#F48FB1] to-[#D4AF7F] rounded-3xl blur-md opacity-40 pointer-events-none" />

              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white aspect-[4/5] group">
                <img
                  src="images/hero_model.jpg"
                  alt="Sparkle @ KKV Luxury Fashion Accessories Model"
                  onError={(e) => {
                    e.target.src = './images/hero_model.jpg';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-3 right-3 glass-card px-2.5 py-1.5 rounded-2xl shadow-lg border border-white/80 z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm">✨</span>
                    <div>
                      <p className="text-[8px] sm:text-[9px] uppercase font-montserrat tracking-widest text-[#C89B3C] font-bold">New Arrival</p>
                      <p className="text-[10px] sm:text-xs font-bold text-[#2C2C2C]">Swarovski Butterfly Clip</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 glass-card px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl shadow-lg border border-white/80 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2C2C2C] text-[#FCE4EC] font-serif-luxury text-[10px] sm:text-xs font-bold flex items-center justify-center">
                      ★ 4.9
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-[#2C2C2C]">Boutique Quality</p>
                      <p className="text-[8px] sm:text-[9px] text-gray-500 font-montserrat">Over 2,400+ 5-Star Reviews</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
