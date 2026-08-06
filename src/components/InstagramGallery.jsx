import React from 'react';
import { Instagram, Heart, MessageCircle } from 'lucide-react';
import { INSTAGRAM_POSTS } from '../data/mockData';

export const InstagramGallery = () => {
  return (
    <section className="py-16 bg-white border-t border-[#FCE4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 text-center md:text-left gap-4">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#F48FB1] font-montserrat text-xs tracking-widest uppercase font-bold">
              <Instagram className="w-4 h-4" />
              <span>@sparkelkkl_official</span>
            </div>
            <h2 className="font-serif-luxury text-3xl font-bold text-[#2C2C2C] mt-1">
              Shop The Instagram Look
            </h2>
          </div>
          
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="bg-[#FFF9F5] border border-[#D4AF7F] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FCE4EC] font-montserrat text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all"
          >
            Follow Us On Instagram
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSTAGRAM_POSTS.map(post => (
            <div key={post.id} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
              <img
                src={post.image}
                alt="Instagram post"
                onError={(e) => {
                  e.target.src = '/images/butterfly_clip.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-2 p-4">
                <span className="font-montserrat text-xs font-bold text-[#D4AF7F]">{post.tag}</span>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-current text-[#F48FB1]" /> {post.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
