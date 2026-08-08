import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { NAVIGATION_TREE } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles, X, ChevronRight, Tag, Zap } from 'lucide-react';

export const ShopPage = () => {
  const { products, categories } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSubcategory = searchParams.get('subcategory') || '';
  const searchQueryParam = searchParams.get('search') || '';
  const flashSaleParam = searchParams.get('flashSale') === 'true';

  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [onlyFlashSale, setOnlyFlashSale] = useState(flashSaleParam);
  const [maxPriceFilter, setMaxPriceFilter] = useState('all');

  // Sync category and search query state when URL searchParams change
  React.useEffect(() => {
    setSelectedCategory(currentCategory);
    setSearchQuery(searchQueryParam);
  }, [currentCategory, searchQueryParam]);

  const activeCategoryObj = useMemo(() => {
    return NAVIGATION_TREE.find(c => c.id === selectedCategory);
  }, [selectedCategory]);

  const activeSubcategoryObj = useMemo(() => {
    if (!activeCategoryObj || !currentSubcategory) return null;
    return activeCategoryObj.subcategories.find(s => s.id === currentSubcategory);
  }, [activeCategoryObj, currentSubcategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (currentSubcategory) {
      result = result.filter(p => p.subcategory === currentSubcategory);
    }

    if (onlyFlashSale) {
      result = result.filter(p => p.isFlashSale);
    }

    if (maxPriceFilter !== 'all') {
      const limit = Number(maxPriceFilter);
      result = result.filter(p => p.price <= limit);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.categoryName.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
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
  }, [products, selectedCategory, currentSubcategory, searchQuery, sortBy, onlyFlashSale, maxPriceFilter]);

  return (
    <div className="py-8 sm:py-12 bg-[#FFF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Trail */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-montserrat text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#C89B3C]">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/shop" onClick={() => setSelectedCategory('all')} className="hover:text-[#C89B3C]">Shop Catalog</Link>
          
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <Link to={`/shop?category=${activeCategoryObj.id}`} className="hover:text-[#C89B3C] font-medium text-[#2C2C2C]">
                {activeCategoryObj.name}
              </Link>
            </>
          )}

          {activeSubcategoryObj && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-[#C89B3C] font-bold">{activeSubcategoryObj.name}</span>
            </>
          )}
        </div>

        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2C2C2C]">
                {activeSubcategoryObj 
                  ? activeSubcategoryObj.name 
                  : activeCategoryObj 
                  ? activeCategoryObj.name 
                  : "Complete Boutique Catalog"}
              </h1>
              <p className="text-xs text-gray-500 font-poppins font-light mt-1">
                Showing {filteredProducts.length} premium handcrafted accessories with 30% OFF on ₹999+ orders.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#FCE4EC] shadow-xs text-xs font-montserrat font-bold text-[#2C2C2C]">
              <Sparkles className="w-4 h-4 text-[#C89B3C]" />
              <span>{filteredProducts.length} Items Available</span>
            </div>
          </div>

          {/* Active Subcategory Pill Chips Filter Bar */}
          {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
            <div className="pt-3 flex items-center gap-2 overflow-x-auto pb-2 font-montserrat text-xs">
              <Link
                to={`/shop?category=${activeCategoryObj.id}`}
                className={`px-3.5 py-1.5 rounded-full font-bold shrink-0 transition-all ${!currentSubcategory ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow-xs' : 'bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF7F]'}`}
              >
                All {activeCategoryObj.name}
              </Link>
              {activeCategoryObj.subcategories.map(sub => (
                <Link
                  key={sub.id}
                  to={`/shop?category=${activeCategoryObj.id}&subcategory=${sub.id}`}
                  className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all ${currentSubcategory === sub.id ? 'bg-[#C89B3C] text-white shadow-xs' : 'bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF7F]'}`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}

          {/* Active Filter Badges */}
          {(currentSubcategory || searchQuery || onlyFlashSale || maxPriceFilter !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-montserrat">
              <span className="text-gray-400 font-semibold">Active Filters:</span>
              
              {currentSubcategory && (
                <span className="bg-[#FCE4EC] text-[#2C2C2C] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  Subcategory: {activeSubcategoryObj?.name || currentSubcategory}
                  <Link to={`/shop?category=${selectedCategory}`} className="hover:text-red-500 ml-1">
                    <X className="w-3 h-3" />
                  </Link>
                </span>
              )}

              {searchQuery && (
                <span className="bg-[#FFF9F5] border border-[#D4AF7F] text-[#2C2C2C] px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onlyFlashSale && (
                <span className="bg-[#C89B3C] text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  Flash Sale Only
                  <button onClick={() => setOnlyFlashSale(false)} className="hover:text-red-200 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {maxPriceFilter !== 'all' && (
                <span className="bg-[#2C2C2C] text-[#FCE4EC] px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  Under ₹{maxPriceFilter}
                  <button onClick={() => setMaxPriceFilter('all')} className="hover:text-red-200 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyFlashSale(false);
                  setMaxPriceFilter('all');
                  setSearchParams({});
                }}
                className="text-gray-400 hover:text-red-500 underline text-xs font-medium ml-2"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Amazon & Meesho Style Filter & Search Controls Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#FCE4EC] shadow-xs mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search accessories or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#C89B3C]"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF7F]" />
            </div>

            {/* Filters & Sorting */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto font-montserrat text-xs">
              
              <button
                onClick={() => setOnlyFlashSale(!onlyFlashSale)}
                className={`px-3.5 py-2 rounded-full font-bold transition-all border ${onlyFlashSale ? 'bg-[#C89B3C] text-white border-[#C89B3C]' : 'bg-[#FFF9F5] text-gray-700 border-gray-200 hover:border-[#D4AF7F]'}`}
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

          {/* Amazon / Meesho Quick Price Filter Chips Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 font-montserrat text-xs">
            <span className="text-gray-400 font-semibold flex items-center gap-1 mr-1">
              <Tag className="w-3.5 h-3.5 text-[#C89B3C]" /> Quick Price Filters:
            </span>

            <button
              onClick={() => setMaxPriceFilter(maxPriceFilter === '199' ? 'all' : '199')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${maxPriceFilter === '199' ? 'bg-[#2C2C2C] text-[#FCE4EC]' : 'bg-gray-100 text-gray-700 hover:bg-[#FCE4EC]'}`}
            >
              Under ₹199
            </button>

            <button
              onClick={() => setMaxPriceFilter(maxPriceFilter === '299' ? 'all' : '299')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${maxPriceFilter === '299' ? 'bg-[#2C2C2C] text-[#FCE4EC]' : 'bg-gray-100 text-gray-700 hover:bg-[#FCE4EC]'}`}
            >
              Under ₹299
            </button>

            <button
              onClick={() => setMaxPriceFilter(maxPriceFilter === '499' ? 'all' : '499')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${maxPriceFilter === '499' ? 'bg-[#2C2C2C] text-[#FCE4EC]' : 'bg-gray-100 text-gray-700 hover:bg-[#FCE4EC]'}`}
            >
              Under ₹499
            </button>

            <button
              onClick={() => setMaxPriceFilter('all')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${maxPriceFilter === 'all' ? 'bg-[#C89B3C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#FCE4EC]'}`}
            >
              All Prices
            </button>
          </div>

          {/* Main Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-gray-100 font-montserrat text-xs">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchParams({});
              }}
              className={`px-4 py-1.5 rounded-full font-semibold shrink-0 transition-all ${selectedCategory === 'all' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-[#FCE4EC]'}`}
            >
              All Items ({products.length})
            </button>

            {NAVIGATION_TREE.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchParams({ category: cat.id });
                }}
                className={`px-4 py-1.5 rounded-full font-semibold shrink-0 transition-all ${selectedCategory === cat.id ? 'bg-[#C89B3C] text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-[#FCE4EC]'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* Product Cards Grid - 2 per row on Mobile */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-[#FCE4EC]">
            <div className="w-16 h-16 bg-[#FCE4EC] rounded-full flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">No Products Found</h3>
            <p className="text-xs text-gray-500">Try adjusting your subcategory filter, price chip, or search query.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyFlashSale(false);
                setMaxPriceFilter('all');
                setSearchParams({});
              }}
              className="bg-[#2C2C2C] text-[#FCE4EC] font-montserrat font-bold text-xs px-6 py-2.5 rounded-full uppercase shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Catalog Item Counter Footer */}
        <div className="mt-12 text-center text-xs text-gray-400 font-montserrat">
          Displaying {filteredProducts.length} of {products.length} total items in Sparkel @kkv collection.
        </div>

      </div>
    </div>
  );
};
