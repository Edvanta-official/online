import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Sparkles } from 'lucide-react';
import { getDirectImageUrl } from '../utils/imageUtils';

export const FeaturedCategories = () => {
  const { categories } = useShop();

  return (
    <section className="py-16 bg-[#FFF9F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-[#C89B3C] font-montserrat text-xs tracking-widest uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2C2C2C]">
            Explore By Category
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FCE4EC] via-[#D4AF7F] to-[#FCE4EC] mx-auto rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative rounded-3xl overflow-hidden glass-card border border-[#FCE4EC] p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col items-center text-center"
            >
              {/* Category Image Preview */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 border-2 border-[#D4AF7F]/40 p-1 group-hover:border-[#C89B3C] transition-colors shadow-inner">
                <img
                  src={getDirectImageUrl(cat.image)}
                  alt={cat.name}
                  onError={(e) => {
                    e.target.src = getDirectImageUrl('images/plumeria_flower_claw_clip_drive.jpg');
                  }}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Category Icon & Name */}
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xl">{cat.icon}</span>
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                  {cat.name}
                </h3>
              </div>

              <p className="text-[11px] text-gray-500 font-poppins line-clamp-1 mb-2 font-light">
                {cat.description}
              </p>

              <span className="mt-auto font-montserrat text-[10px] uppercase font-bold tracking-widest text-[#D4AF7F] group-hover:text-[#2C2C2C] transition-colors">
                {cat.count}+ Designs
              </span>

              {/* Subtle hover gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FCE4EC]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
