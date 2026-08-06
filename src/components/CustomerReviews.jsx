import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export const CustomerReviews = () => {
  return (
    <section className="py-16 bg-[#FFF9F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-[#C89B3C] font-montserrat text-xs tracking-widest uppercase font-semibold block">
            Love Notes From Real Sparkel Girls
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2C2C2C]">
            Customer Reviews & Experiences
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FCE4EC] via-[#D4AF7F] to-[#FCE4EC] mx-auto rounded-full" />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#FCE4EC] shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-[#FCE4EC] absolute top-6 right-6 pointer-events-none" />

              <div className="space-y-4">
                {/* Rating */}
                <div className="flex text-[#C89B3C]">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-gray-700 font-poppins leading-relaxed italic">
                  "{review.review}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar || '/images/hero_model.jpg'}
                    alt={review.name}
                    onError={(e) => {
                      e.target.src = '/images/hero_model.jpg';
                    }}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF7F]"
                  />
                  <div>
                    <h4 className="font-serif-luxury text-sm font-bold text-[#2C2C2C]">
                      {review.name}
                    </h4>
                    <span className="text-[11px] text-gray-400 font-poppins">{review.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-montserrat font-bold bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
