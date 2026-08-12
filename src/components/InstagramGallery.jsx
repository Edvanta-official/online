import React from 'react';
import { Instagram, Youtube, Facebook, MessageCircle, Heart } from 'lucide-react';
import { INSTAGRAM_POSTS } from '../data/mockData';

export const InstagramGallery = () => {
  return (
    <section className="py-16 bg-white border-t border-[#FCE4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 text-center md:text-left gap-4">
          <div>
            <a
              href="https://www.instagram.com/sparklekkvoffical?igsh=MW8ydzIza3oybmM2aQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center md:justify-start gap-2 text-[#F48FB1] hover:text-[#C89B3C] font-montserrat text-xs tracking-widest uppercase font-bold transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@sparklekkvoffical</span>
            </a>
            <h2 className="font-serif-luxury text-3xl font-bold text-[#2C2C2C] mt-1">
              Follow Us
            </h2>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/sparklekkvoffical?igsh=MW8ydzIza3oybmM2aQ=="
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="w-10 h-10 rounded-full bg-[#FFF9F5] border border-[#D4AF7F] text-[#E4405F] hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              className="w-10 h-10 rounded-full bg-[#FFF9F5] border border-[#D4AF7F] text-[#FF0000] hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/919949157771"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              className="w-10 h-10 rounded-full bg-[#FFF9F5] border border-[#D4AF7F] text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              className="w-10 h-10 rounded-full bg-[#FFF9F5] border border-[#D4AF7F] text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
            >
              <Facebook className="w-5 h-5 fill-current" />
            </a>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSTAGRAM_POSTS.map(post => (
            <a
              key={post.id}
              href="https://www.instagram.com/sparklekkvoffical?igsh=MW8ydzIza3oybmM2aQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-sm block"
            >
              <img
                src={post.image}
                alt="Instagram post"
                onError={(e) => {
                  e.target.src = 'images/plumeria_flower.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-2 p-4">
                <span className="font-montserrat text-xs font-bold text-[#D4AF7F]">@sparklekkvoffical</span>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-current text-[#F48FB1]" /> {post.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.comments}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
