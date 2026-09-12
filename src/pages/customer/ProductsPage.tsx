import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/customer/ProductCard';
import { ProductCategory } from '../../types';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, t, searchQuery, setSearchQuery } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const categories = [
    { id: 'All', label: t('catAll') },
    { id: 'Papad', label: t('catPapad') },
    { id: 'Achar', label: t('catAchar') },
    { id: 'Chakli', label: t('catChakli') },
    { id: 'Laddus', label: t('catLaddus') },
    { id: 'Masala', label: t('catMasala') }
  ];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        // In-stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }
        // Price filter
        if (p.price > maxPrice) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(query);
          const matchMr = p.nameMr?.toLowerCase().includes(query);
          const matchHi = p.nameHi?.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchCategory = p.category.toLowerCase().includes(query);
          return matchName || matchMr || matchHi || matchDesc || matchCategory;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default popular: featured first, then review count
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.reviewsCount - a.reviewsCount;
      });
  }, [products, selectedCategory, inStockOnly, maxPrice, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setInStockOnly(false);
    setMaxPrice(1000);
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#FAF4EC] rounded-3xl p-6 sm:p-10 border border-[#E8DEC8] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E4D2B]/10 text-[#1E4D2B] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Traditional Hand-Rolled Delicacies</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#2C221E]">
            {t('catalogueTitle')}
          </h1>
          <p className="text-sm text-[#735F50] max-w-xl">
            {t('catalogueSub')}
          </p>
        </div>

        {/* Live Active Products Counter */}
        <div className="bg-white px-5 py-3 rounded-2xl border border-[#E8DEC8] shadow-xs shrink-0 text-center sm:text-right">
          <span className="text-2xl font-black text-[#1E4D2B]">
            {filteredProducts.length}
          </span>
          <p className="text-xs text-[#735F50] font-medium">Available Varieties</p>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#1E4D2B] text-white shadow-xs'
                : 'bg-white text-[#5C4A3E] border border-[#E0D5C7] hover:border-[#1E4D2B]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#735F50] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border border-[#E0D5C7] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#735F50] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort products by"
              className="w-full bg-[#FAF7F2] border border-[#E0D5C7] rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-[#2C221E] outline-hidden focus:border-[#1E4D2B]"
            >
              <option value="popular">{t('sortPopular')}</option>
              <option value="price-low">{t('sortPriceLow')}</option>
              <option value="price-high">{t('sortPriceHigh')}</option>
              <option value="rating">{t('sortRating')}</option>
            </select>
          </div>

          {/* Availability Toggle */}
          <div className="md:col-span-3 flex items-center justify-between sm:justify-end gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-[#2C221E]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-[#1E4D2B] rounded border-gray-300 focus:ring-[#1E4D2B]"
              />
              <span>{t('inStockOnly')}</span>
            </label>

            {(searchQuery || selectedCategory !== 'All' || inStockOnly || maxPrice < 1000) && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#C85A32] hover:underline"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        </div>

        {/* Max Price Slider (Collapsible / inline) */}
        <div className="pt-2 border-t border-[#F0E8DC] flex flex-wrap items-center justify-between gap-4 text-xs text-[#735F50]">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-semibold text-[#2C221E]">Max Price:</span>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum price filter slider"
              className="w-44 accent-[#1E4D2B]"
            />
            <span className="font-bold text-[#1E4D2B]">Up to ₹{maxPrice}</span>
          </div>

          <div className="text-xs text-[#735F50]">
            {t('showingProducts')} <span className="font-bold text-[#2C221E]">{filteredProducts.length}</span> {t('productsCount')}
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DEC8] space-y-4 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C85A32] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#2C221E]">
            {t('noProductsFound')}
          </h3>
          <p className="text-xs text-[#735F50]">
            Try clearing filters or search for another delicious snack like "Papad", "Chakli", "Pickle", or "Laddus".
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 bg-[#1E4D2B] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#163E23]"
          >
            {t('clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
};
