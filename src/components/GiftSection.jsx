import React from 'react';
import { Gift, Sparkles, ArrowRight, Heart, Award, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const GiftSection = () => {
  const { products } = useShop();

  // Curate gift products into 2 distinct sessions
  const canvasGiftProducts = products.filter(p => p.category === 'gift-sets' && p.subcategory === 'canvas-gifts');
  const flowerGiftProducts = products.filter(p => p.category === 'gift-sets' && p.subcategory === 'flower-gifts');

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-[#FFF9F5] via-[#FCE4EC]/30 to-[#FFF9F5] border-y border-[#FCE4EC] relative overflow-hidden font-poppins">
      
      {/* Decorative Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#F48FB1]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#D4AF7F]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Main Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/90 border border-[#D4AF7F]/40 shadow-xs px-4 py-1.5 rounded-full font-montserrat text-xs tracking-widest text-[#C89B3C] uppercase backdrop-blur-md">
            <Gift className="w-4 h-4" />
            <span>Luxury Gift Hampers & Festive Collections</span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#2C2C2C] tracking-tight">
            Give the Gift of <span className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</span> <span className="text-[#2C2C2C] text-lg sm:text-xl font-extrabold lowercase font-poppins">@kkv</span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-[#FCE4EC] via-[#D4AF7F] to-[#FCE4EC] mx-auto rounded-full" />

          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Choose from our curated <strong>Canvas Gifts</strong> and <strong>Flower Gifts</strong> sessions, delivered in signature velvet drawer boxes with satin ribbons.
          </p>
        </div>

        {/* SESSION 1: CANVAS GIFTS */}
        <div className="space-y-6 bg-white/80 p-6 sm:p-8 rounded-3xl border border-[#D4AF7F]/30 shadow-xs backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D4AF7F]/30 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-montserrat font-bold text-[#C89B3C] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Session 1
              </div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2C2C2C]">
                🎨 Canvas Gifts Collection
              </h3>
              <p className="text-xs text-gray-500 font-poppins font-light">Custom printed luxury canvas art frames & personalized keepsake gift trunks</p>
            </div>
            <Link
              to="/shop?category=gift-sets&subcategory=canvas-gifts"
              className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-[#C89B3C] hover:text-[#2C2C2C] uppercase tracking-wider"
            >
              <span>View All Canvas Gifts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {canvasGiftProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* SESSION 2: FLOWER GIFTS */}
        <div className="space-y-6 bg-white/80 p-6 sm:p-8 rounded-3xl border border-[#F48FB1]/30 shadow-xs backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F48FB1]/30 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-montserrat font-bold text-[#F48FB1] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Session 2
              </div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2C2C2C]">
                🌸 Flower Gifts Collection
              </h3>
              <p className="text-xs text-gray-500 font-poppins font-light">Botanical Plumeria flower hampers, silk floral scrunchies & floral bloom boxes</p>
            </div>
            <Link
              to="/shop?category=gift-sets&subcategory=flower-gifts"
              className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-[#F48FB1] hover:text-[#2C2C2C] uppercase tracking-wider"
            >
              <span>View All Flower Gifts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {flowerGiftProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* View All Gifts CTA */}
        <div className="text-center pt-4">
          <Link
            to="/shop?category=gift-sets"
            className="inline-flex items-center gap-2 bg-[#2C2C2C] text-[#FCE4EC] hover:text-white font-montserrat font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <span>Explore Complete Gifts Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF7F]" />
          </Link>
        </div>

      </div>
    </section>
  );
};
