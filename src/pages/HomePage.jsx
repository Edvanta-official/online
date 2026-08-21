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
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award, RefreshCw, Phone, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { products } = useShop();

  // Curate diverse items across categories for Trending This Season
  const trendingProducts = [
    products.find(p => p.id === "SPK-HC-001"), // Plumeria flower claw clip
    products.find(p => p.id === "SPK-NK-101"), // Traditional South Indian Matte Gold Plated choker set
    products.find(p => p.id === "SPK-CN-203"), // Green oval stone anti-tarnish chain
    products.find(p => p.id === "SPK-BR-302")  // Adjustable gold plated kada Bracelet
  ].filter(Boolean);

  if (trendingProducts.length < 4) {
    const fallback = products.filter(p => p.isTrending && !trendingProducts.includes(p));
    trendingProducts.push(...fallback.slice(0, 4 - trendingProducts.length));
  }

  // Curate completely distinct items for Best Sellers Collection
  const bestSellers = [
    products.find(p => p.id === "SPK-NK-102"), // Traditional South Indian kemp floral Necklace set
    products.find(p => p.id === "SPK-HC-005"), // Rectangle hair claw clips
    products.find(p => p.id === "SPK-CN-204"), // Flat Snake Chain
    products.find(p => p.id === "SPK-BR-301")  // Beaded Charm bracelet
  ].filter(Boolean);

  if (bestSellers.length < 4) {
    const fallback = products.filter(p => p.isBestSeller && !bestSellers.includes(p));
    bestSellers.push(...fallback.slice(0, 4 - bestSellers.length));
  }

  return (
    <div className="relative font-poppins">
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

      {/* Flash Sale Separate Dedicated Section */}
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

      {/* Why Choose Sparkle @ KKV Section */}
      <section className="py-14 sm:py-24 bg-gradient-to-b from-[#FFF9F5] via-white to-[#FFF9F5] border-y border-[#FCE4EC] relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FCE4EC]/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12 sm:mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#2C2C2C] text-[#FCE4EC] px-4 py-1.5 rounded-full text-xs font-montserrat uppercase tracking-widest font-bold shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF7F]" />
              <span>The Sparkle Difference</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold text-[#2C2C2C] text-center tracking-tight leading-snug pt-1">
              Why Choose <span className="font-serif-luxury text-[#C89B3C] font-extrabold uppercase">SPARKLE</span> <span className="font-serif italic text-[#2C2C2C] font-normal">@</span> <span className="font-poppins text-[#2C2C2C] font-extrabold uppercase text-[0.8em]">KKV</span>?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FCE4EC] via-[#D4AF7F] to-[#FCE4EC] mx-auto rounded-full" />
            
            <p className="text-xs sm:text-base text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              We treat every single accessory like a masterpiece, combining traditional South Indian design heritage with modern micro-gold plating, anti-tarnish durability, and signature boutique packaging.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Handcrafted Elegance */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-xs hover:shadow-2xl transition-all duration-300 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300 shadow-inner">
                💎
              </div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                Handcrafted Elegance
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Made with premium cubic zirconia, Grade 6A mulberry silk, and durable 18K micro gold plating, meticulously crafted by master South Indian artisans.
              </p>
            </div>
 
            {/* Card 2: Signature Velvet Unboxing */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-xs hover:shadow-2xl transition-all duration-300 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300 shadow-inner">
                🎁
              </div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                Signature Velvet Packaging
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Every single accessory is delivered in our signature blush-pink velvet drawer box wrapped with gold-foiled satin ribbons, perfect for luxury gifting.
              </p>
            </div>
 
            {/* Card 3: Own Boutique Manufacture */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-xs hover:shadow-2xl transition-all duration-300 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300 shadow-inner">
                🏭
              </div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                Own Boutique Manufacture
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Directly manufactured in our own boutique production facility with strict quality assurance, fine craftsmanship, and factory-direct honest pricing.
              </p>
            </div>

            {/* Card 4: Anti-Tarnish Finish */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-xs hover:shadow-2xl transition-all duration-300 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300 shadow-inner">
                ✨
              </div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                Anti-Tarnish Polish
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Our necklaces and chains feature a premium anti-tarnish finish on hypoallergenic stainless steel. Resistant to sweat, perfume, and daily wear.
              </p>
            </div>

            {/* Card 5: Direct Customer Support */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-xs hover:shadow-2xl transition-all duration-300 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300 shadow-inner">
                📞
              </div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                Direct Customer Support
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Get dedicated support via +91 99491 57771 for order adjustments, customized sizing, delivery tracking, and wholesale inquiries.
              </p>
            </div>

            {/* Card 6: 7-Day Easy Exchange Policy */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#FCE4EC] hover:border-[#D4AF7F] shadow-xs hover:shadow-2xl transition-all duration-300 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9F5] border border-[#FCE4EC] group-hover:bg-[#2C2C2C] flex items-center justify-center text-2xl transition-all duration-300 shadow-inner">
                🔄
              </div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                7-Day Easy Exchanges
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                ⚠️ <strong>Important Notice:</strong> Returns/replacements accepted <u>ONLY with continuous unboxing video proof</u> (showing original courier seal opened on camera).
              </p>
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
