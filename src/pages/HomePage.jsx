import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { ProductCard } from '../components/ProductCard';
import { FlashSaleCountdown } from '../components/FlashSaleCountdown';
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

      {/* Why Choose Sparkel @kkv Banner */}
      <section className="py-10 sm:py-16 bg-gradient-to-r from-[#FCE4EC]/50 via-[#FFF9F5] to-[#FCE4EC]/50 border-y border-[#D4AF7F]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C2C2C]">
              Why Choose Sparkel @kkv?
            </h2>
            <p className="text-xs text-gray-600 max-w-lg mx-auto font-light">
              We treat every accessory like a masterpiece crafted for your special moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-center font-poppins">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] shadow-xs space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-[#FCE4EC] text-[#2C2C2C] flex items-center justify-center mx-auto text-xl">
                💎
              </div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2C2C2C]">Handcrafted Elegance</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Made with premium cubic zirconia, Grade 6A mulberry silk, and durable 18K micro gold plating.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] shadow-xs space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-[#FCE4EC] text-[#2C2C2C] flex items-center justify-center mx-auto text-xl">
                🎁
              </div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2C2C2C]">Signature Velvet Unboxing</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Every order arrives in our signature blush pink velvet drawer box wrapped with satin ribbons.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE4EC] shadow-xs space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-[#FCE4EC] text-[#2C2C2C] flex items-center justify-center mx-auto text-xl">
                🚚
              </div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2C2C2C]">Pan-India Express Shipping</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Free shipping over ₹999 with real-time order tracking and 7-day exchange guarantee.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Instagram Feed */}
      <InstagramGallery />

      {/* VIP Newsletter */}
      <NewsletterSection />

    </div>
  );
};
