import React from 'react';
import { Sparkles, Award, ShieldCheck, Heart, UserCheck, Phone, MapPin, Mail } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="py-12 sm:py-20 bg-white border-y border-[#FCE4EC] font-poppins relative overflow-hidden">
      
      {/* Decorative Gold Glow Background Circle */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#FCE4EC]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-[#D4AF7F]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-[#C89B3C] font-montserrat text-xs tracking-widest uppercase font-bold bg-[#FFF9F5] px-4 py-1.5 rounded-full border border-[#D4AF7F]/30">
            <Sparkles className="w-3.5 h-3.5" /> Our Story & Leadership
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2C2C2C]">
            About <span className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</span> <span className="text-[#2C2C2C] text-lg font-extrabold lowercase font-poppins">@kkv</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Where heritage craftsmanship meets contemporary boutique fashion accessories.
          </p>
        </div>

        {/* Grid Layout: Founder Card & Brand Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Founder & Director Profile Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#D4AF7F]/40 relative overflow-hidden group">
              
              {/* Subtle Gold Shimmer Accent */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#D4AF7F]/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
              
              <div className="space-y-6 relative z-10">
                
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FCE4EC] to-[#D4AF7F] flex items-center justify-center shadow-lg">
                    <UserCheck className="w-6 h-6 text-[#2C2C2C]" />
                  </div>
                  <span className="bg-[#D4AF7F] text-[#2C2C2C] text-[10px] font-bold font-montserrat px-3 py-1 rounded-full uppercase tracking-wider">
                    Leadership
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-montserrat uppercase tracking-widest text-[#D4AF7F] font-bold block">
                    Founder & CEO
                  </span>
                  <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Koti Koushik
                  </h3>
                  <p className="text-xs text-gray-300 font-light">
                    Founder & CEO, <strong className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</strong> <span className="text-white font-bold lowercase text-[10px]">@kkv</span>
                  </p>
                </div>

                <blockquote className="text-xs font-light italic leading-relaxed text-gray-200 border-l-2 border-[#D4AF7F] pl-4 py-1">
                  "At <strong className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</strong> <span className="text-white font-bold lowercase text-[10px]">@kkv</span>, our mission is to empower every woman to feel confident, elegant, and radiant. We curate handcrafted luxury fashion accessories that blend South Indian heritage with modern boutique style."
                </blockquote>

                <div className="pt-4 border-t border-gray-700/60 flex flex-col gap-2.5 text-xs text-gray-300 font-light">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#D4AF7F]" />
                    <span className="font-semibold text-white">+91 99491 57771</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#D4AF7F]" />
                    <span>support@sparklekkv.com</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#D4AF7F] shrink-0 mt-0.5" />
                    <span>Ayyappa Society, Madhapur, Telangana, Hyderabad - 500081</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Brand Philosophy & Key Pillars */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C]">
                Crafting Timeless Accessories for Every Moment
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Founded by <strong>Koti Koushik</strong>, <strong className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</strong> <span className="text-[#2C2C2C] font-extrabold lowercase text-xs">@kkv</span> was born out of a vision to deliver boutique-quality fashion accessories without compromising on quality or elegance. From handcrafted Plumeria flower hair claws to traditional South Indian Kemp choker sets and waterproof anti-tarnish chains, every piece is designed to tell your unique story.
              </p>
            </div>

            {/* 4 Pillar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FCE4EC] text-[#2C2C2C] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-[#C89B3C]" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-sm font-bold text-[#2C2C2C]">Direct Leadership</h4>
                  <p className="text-[11px] text-gray-500 font-light mt-0.5">
                    Guided by Founder & CEO Koti Koushik with 100% commitment to customer satisfaction.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FCE4EC] text-[#2C2C2C] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#C89B3C]" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-sm font-bold text-[#2C2C2C]">100% Quality Checked</h4>
                  <p className="text-[11px] text-gray-500 font-light mt-0.5">
                    Every piece undergoes 3-step quality inspection before boutique packaging.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FCE4EC] text-[#2C2C2C] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#C89B3C]" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-sm font-bold text-[#2C2C2C]">Anti-Tarnish Polish</h4>
                  <p className="text-[11px] text-gray-500 font-light mt-0.5">
                    18K micro gold plating & waterproof stainless steel craftsmanship.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FCE4EC] text-[#2C2C2C] flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-[#F48FB1]" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-sm font-bold text-[#2C2C2C]">1,000+ Happy Customers</h4>
                  <p className="text-[11px] text-gray-500 font-light mt-0.5">
                    Loved across India with 4.9★ average customer rating and express shipping.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
