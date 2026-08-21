import React from 'react';
import { Gift, Sparkles, ArrowRight, Heart, Award, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const GiftSection = () => {
  const { products } = useShop();

  // Curate gift set products
  const giftProducts = products.filter(p => p.category === 'gift-sets').slice(0, 3);

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-[#FFF9F5] via-[#FCE4EC]/30 to-[#FFF9F5] border-y border-[#FCE4EC] relative overflow-hidden font-poppins">
      
      {/* Decorative Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#F48FB1]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#D4AF7F]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-white/90 border border-[#D4AF7F]/40 shadow-xs px-4 py-1.5 rounded-full font-montserrat text-xs tracking-widest text-[#C89B3C] uppercase backdrop-blur-md">
            <Gift className="w-4 h-4" />
            <span>Luxury Gift Hampers & Festive Boxes</span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#2C2C2C] tracking-tight">
            Give the Gift of <span className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</span> <span className="text-[#2C2C2C] text-lg sm:text-xl font-extrabold lowercase font-poppins">@kkv</span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-[#FCE4EC] via-[#D4AF7F] to-[#FCE4EC] mx-auto rounded-full" />

          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Delight your loved ones with handcrafted accessories delivered in our signature blush-pink velvet drawer boxes wrapped with gold-foiled satin ribbons.
          </p>
        </div>

        {/* Gift Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 font-montserrat text-xs">
          <div className="bg-white p-4 rounded-2xl border border-[#FCE4EC] flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFF9F5] border border-[#D4AF7F]/30 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[#C89B3C]" />
            </div>
            <div>
              <h4 className="font-bold text-[#2C2C2C]">Boutique Box Packaging</h4>
              <p className="text-[11px] text-gray-500 font-light font-poppins">Velvet drawer box with luxury satin ribbon</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#FCE4EC] flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFF9F5] border border-[#D4AF7F]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#C89B3C]" />
            </div>
            <div>
              <h4 className="font-bold text-[#2C2C2C]">Custom Greeting Cards</h4>
              <p className="text-[11px] text-gray-500 font-light font-poppins">Add your personalized gift message at checkout</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#FCE4EC] flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFF9F5] border border-[#D4AF7F]/30 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#C89B3C]" />
            </div>
            <div>
              <h4 className="font-bold text-[#2C2C2C]">Curated Combos</h4>
              <p className="text-[11px] text-gray-500 font-light font-poppins">Save up to 40% with pre-assembled luxury sets</p>
            </div>
          </div>
        </div>

        {/* Gift Products Grid */}
        {giftProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Gifts CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/shop?category=gift-sets"
            className="inline-flex items-center gap-2 bg-[#2C2C2C] text-[#FCE4EC] hover:text-white font-montserrat font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <span>Explore All Gift Sets</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF7F]" />
          </Link>
        </div>

      </div>
    </section>
  );
};
