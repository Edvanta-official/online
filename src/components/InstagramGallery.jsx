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
          
          {/* Social Media Icons - Increased Size & Direct Links */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/sparklekkvoffical?igsh=ZDZtcTUwdzZjaTF2"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on Instagram"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF9F5] border-2 border-[#D4AF7F] text-[#E4405F] hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl hover:scale-115"
            >
              <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@sparklekkv_offical?si=8odtaXx_8ziRsyUn"
              target="_blank"
              rel="noopener noreferrer"
              title="Subscribe on YouTube"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF9F5] border-2 border-[#D4AF7F] text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl hover:scale-115"
            >
              <Youtube className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>

            {/* WhatsApp Group */}
            <a
              href="https://chat.whatsapp.com/J8Sg0zst5Hb7X28XspxDCZ"
              target="_blank"
              rel="noopener noreferrer"
              title="Join our WhatsApp Group"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF9F5] border-2 border-[#D4AF7F] text-[#25D366] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl hover:scale-115"
            >
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on Facebook"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF9F5] border-2 border-[#D4AF7F] text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl hover:scale-115"
            >
              <Facebook className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
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
