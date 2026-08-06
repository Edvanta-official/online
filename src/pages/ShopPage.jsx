import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export const ShopPage = () => {
  const { products, categories } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const searchQueryParam = searchParams.get('search') || '';
  const flashSaleParam = searchParams.get('flashSale') === 'true';

  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [onlyFlashSale, setOnlyFlashSale] = useState(flashSaleParam);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (onlyFlashSale) {
      result = result.filter(p => p.isFlashSale);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, onlyFlashSale]);

  return (
    <div className="py-12 bg-[#FFF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 text-[#C89B3C] font-montserrat text-xs tracking-widest uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted Luxury Collection
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2C2C2C]">
            Shop All Fashion Accessories
          </h1>
          <p className="text-xs text-gray-500 font-poppins">
            Showing {filteredProducts.length} premium pieces curated for Sparkel Girls
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#FCE4EC] shadow-sm mb-10 space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search accessories by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-full py-2.5 pl-10 pr-4 text-xs font-poppins focus:outline-none focus:border-[#C89B3C]"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF7F]" />
            </div>

            {/* Filters & Sorting */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-montserrat text-xs">
              
              <button
                onClick={() => setOnlyFlashSale(!onlyFlashSale)}
                className={`px-4 py-2 rounded-full font-bold transition-all border ${onlyFlashSale ? 'bg-[#C89B3C] text-white border-[#C89B3C]' : 'bg-[#FFF9F5] text-gray-700 border-gray-200 hover:border-[#D4AF7F]'}`}
              >
                ⚡ Flash Sale Only
              </button>

              <div className="flex items-center gap-2 bg-[#FFF9F5] px-3 py-1.5 rounded-full border border-[#D4AF7F]/40">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span className="font-semibold text-gray-600">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-[#2C2C2C] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

            </div>

          </div>

          {/* Category Chips Scroll Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 border-t border-gray-100 font-montserrat text-xs">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchParams({});
              }}
              className={`px-4 py-1.5 rounded-full font-semibold shrink-0 transition-all ${selectedCategory === 'all' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow' : 'bg-gray-100 text-gray-600 hover:bg-[#FCE4EC]'}`}
            >
              All Categories
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchParams({ category: cat.id });
                }}
                className={`px-4 py-1.5 rounded-full font-semibold shrink-0 transition-all flex items-center gap-1.5 ${selectedCategory === cat.id ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow' : 'bg-gray-100 text-gray-600 hover:bg-[#FCE4EC]'}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Product Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#FCE4EC] p-8 space-y-4">
            <div className="w-16 h-16 bg-[#FCE4EC] rounded-full flex items-center justify-center mx-auto text-3xl">
              🔍
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">No Products Found</h3>
            <p className="text-xs text-gray-500 font-poppins">Try adjusting your category filter or search query.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyFlashSale(false);
                setSearchParams({});
              }}
              className="bg-[#2C2C2C] text-[#FCE4EC] font-montserrat font-bold text-xs px-6 py-2.5 rounded-full uppercase"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
