import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award } from 'lucide-react';

export const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#FFF9F5] via-[#FCE4EC]/40 to-[#FFF9F5]">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#F48FB1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF7F]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 border border-[#D4AF7F]/40 shadow-sm px-4 py-1.5 rounded-full font-montserrat text-[11px] sm:text-xs tracking-widest text-[#2C2C2C] uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Where Every Accessory Tells Your Story</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2C2C2C] leading-[1.15]">
              Luxury Fashion <br className="hidden sm:inline" />
              <span className="gold-gradient-text italic font-normal">Accessories</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2C2C2C]/90">
                Designed to Make Every Girl Shine.
              </span>
            </h1>

            {/* Category Pill Subtext */}
            <p className="text-sm sm:text-base text-gray-600 font-poppins max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Explore our boutique collection of handcrafted Premium Earrings, Hair Flowers, Butterfly Clips, Bangles, Bracelets, and Choker Necklace Sets.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 font-montserrat">
              <Link
                to="/shop"
                className="shimmer-btn bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] hover:text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
              >
                <span>Shop Collection Now</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF7F]" />
              </Link>

              <Link
                to="/shop?category=gift-sets"
                className="bg-white/90 border border-[#D4AF7F]/60 text-[#2C2C2C] hover:bg-[#FCE4EC]/50 px-7 py-4 rounded-full text-xs uppercase tracking-widest font-semibold shadow-md transition-all flex items-center gap-2"
              >
                <span>Explore Gift Sets</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="pt-6 border-t border-[#D4AF7F]/20 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 font-poppins text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span>100% Certified Handcrafted</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#F48FB1] shrink-0" />
                <span>15k+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4AF7F] shrink-0" />
                <span>Luxury Velvet Box</span>
              </div>
            </div>

          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-5 relative pt-4 pb-6">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glowing Background Blur */}
              <div className="absolute -inset-3 bg-gradient-to-r from-[#FCE4EC] via-[#F48FB1] to-[#D4AF7F] rounded-3xl blur-lg opacity-50 pointer-events-none" />

              {/* Main Model Frame */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white aspect-[4/5] group">
                <img
                  src="images/hero_model.jpg"
                  alt="Sparkel @KKL Luxury Fashion Accessories Model"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Badge Top Right */}
                <div className="absolute top-4 right-4 glass-card px-3.5 py-2 rounded-2xl shadow-lg border border-white/80 animate-float-slow z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <div>
                      <p className="text-[10px] uppercase font-montserrat tracking-widest text-[#C89B3C] font-bold">New Arrival</p>
                      <p className="text-xs font-bold text-[#2C2C2C]">Swarovski Butterfly Clip</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge Bottom Left */}
                <div className="absolute bottom-4 left-4 glass-card px-4 py-2.5 rounded-2xl shadow-lg border border-white/80 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2C2C2C] text-[#FCE4EC] font-serif-luxury text-xs font-bold flex items-center justify-center">
                      ★ 4.9
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2C2C2C]">Boutique Quality</p>
                      <p className="text-[10px] text-gray-500 font-montserrat">Over 2,400+ 5-Star Reviews</p>
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
