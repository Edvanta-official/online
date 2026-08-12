import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { ProductCard } from '../components/ProductCard';
import { FlashSaleCountdown } from '../components/FlashSaleCountdown';
import { AboutSection } from '../components/AboutSection';
import { CustomerReviews } from '../components/CustomerReviews';
import { InstagramGallery } from '../components/InstagramGallery';
import { NewsletterSection } from '../components/NewsletterSection';
import { FloatingPetals } from '../components/FloatingPetals';
import { useShop } from '../context/ShopContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { products } = useShop();

  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="relative">
      <FloatingPetals />

      {/* Hero Section */}
      <HeroBanner />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Trending Accessories Showcase */}
      <section className="py-10 sm:py-16 bg-white border-y border-[#FCE4EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-12 gap-3 text-center md:text-left">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[#C89B3C] font-montserrat text-xs tracking-widest uppercase font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Must-Have Accessories
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C2C2C]">
                Trending This Season
              </h2>
            </div>

            <Link
              to="/shop?sort=trending"
              className="font-montserrat text-xs font-bold text-[#2C2C2C] hover:text-[#C89B3C] uppercase tracking-widest flex items-center gap-2 group"
            >
              <span>View All Trending</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF7F] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Cards Grid - 2 per row on Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* Flash Sale Ticker Section */}
      <FlashSaleCountdown />

      {/* Today's Best Sellers */}
      <section className="py-10 sm:py-16 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2.5 mb-8 sm:mb-12">
            <span className="text-[#C89B3C] font-montserrat text-xs tracking-widest uppercase font-bold">
              Customer Favorites
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#2C2C2C]">
              Best Sellers Collection
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#FCE4EC] via-[#D4AF7F] to-[#FCE4EC] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* Why Choose SPARKEL @kkv Banner */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-[#FFF9F5] via-white to-[#FFF9F5] border-y border-[#FCE4EC] relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FCE4EC]/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-10 sm:mb-16 space-y-3">
            <span className="text-[#C89B3C] font-montserrat text-xs tracking-widest uppercase font-semibold block">
              The Sparkel Advantage
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#2C2C2C] text-center tracking-tight leading-snug">
              Why Choose SPARKLE <span className="text-[#C89B3C] font-poppins text-base sm:text-2xl font-semibold italic inline-block">@kkv</span>?
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF7F] to-transparent mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
              We treat every accessory like a masterpiece, combining traditional South Indian design heritage with modern micro-gold plating and anti-tarnish protection.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-poppins">
            
            {/* Card 1: Handcrafted Elegance */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-sm hover:shadow-xl transition-all duration-300 space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300">
                💎
              </div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                Handcrafted Elegance
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Made with premium cubic zirconia, Grade 6A mulberry silk, and durable 18K micro gold plating, meticulously crafted by master local designers.
              </p>
            </div>
 
            {/* Card 2: Signature Velvet Unboxing */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-sm hover:shadow-xl transition-all duration-300 space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300">
                🎁
              </div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                Signature Velvet Unboxing
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Every single accessory is delivered in our signature blush-pink velvet drawer box wrapped with gold-foiled satin ribbons, perfect for gifting.
              </p>
            </div>
 
            {/* Card 3: Own Manufacture */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-sm hover:shadow-xl transition-all duration-300 space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300">
                🏭
              </div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                Own Manufacture
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Directly manufactured in our own boutique production facility with strict quality assurance, fine craftsmanship, and factory-direct pricing.
              </p>
            </div>

            {/* Card 4: Anti-Tarnish Waterproof Finish */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-sm hover:shadow-xl transition-all duration-300 space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300">
                ✨
              </div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                Anti-Tarnish Polish
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Our necklaces and chains feature a premium anti-tarnish finish on hypoallergenic stainless steel. Resistant to sweat, perfume, and daily wear.
              </p>
            </div>

            {/* Card 5: Direct WhatsApp Support */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-sm hover:shadow-xl transition-all duration-300 space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300">
                📞
              </div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                Direct CEO Leadership
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Get 24/7 dedicated support from Founder & CEO Koti Koushik via +91 99491 57771 for order adjustments, customized sizing, and wholesale inquiries.
              </p>
            </div>

            {/* Card 6: 7-Day Easy Exchange Policy */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-sm hover:shadow-xl transition-all duration-300 space-y-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300">
                🔄
              </div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                7-Day Easy Exchanges
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Shop with absolute confidence. If you're not completely satisfied with your accessories, request an easy product exchange within 7 days.
              </p>

              {/* Mandatory Unboxing Video Notice */}
              <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-3 text-left font-poppins mt-2">
                <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                  ⚠️ <strong>Important Notice:</strong> For damaged or missing products, returns/replacements are accepted <u>ONLY with a continuous unboxing video proof</u> (showing original courier seal being opened on camera for the first time).
                </p>
              </div>
            </div>
 
          </div>
 
        </div>
      </section>

      {/* About Founder & Brand Section */}
      <AboutSection />

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Instagram Feed */}
      <InstagramGallery />

      {/* VIP Newsletter */}
      <NewsletterSection />

    </div>
  );
};
