import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, wishlist, toggleWishlist, language, t } = useApp();

  const isWishlisted = wishlist.includes(product.id);
  const localizedTitle =
    language === 'mr' ? (product.nameMr || product.name) : language === 'hi' ? (product.nameHi || product.name) : product.name;
  const localizedDesc =
    language === 'mr' ? (product.descriptionMr || product.description) : language === 'hi' ? (product.descriptionHi || product.description) : product.description;

  const discountPercent = product.discountPrice
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F3ECE4]">
        <img
          src={product.image}
          alt={localizedTitle}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="bg-[#1E4D2B] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
              SHG Special
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#C85A32] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {discountPercent}% {t('off')}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-xs hover:bg-white text-[#5C4A3E] hover:text-[#C85A32] transition-colors z-10"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'text-[#C85A32] fill-[#C85A32]' : ''}`}
          />
        </button>

        {/* Weight Chip */}
        <div className="absolute bottom-3 left-3 bg-[#2C221E]/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md">
          {product.weight}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#735F50] mb-1.5">
            <span className="font-semibold text-[#1E4D2B] tracking-wide uppercase text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-semibold text-[#2C221E]">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[#A18F80] font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => navigateTo('product-detail', { productId: product.id })}
            className="font-bold text-[#2C221E] text-base leading-snug cursor-pointer group-hover:text-[#1E4D2B] transition-colors line-clamp-1"
            title={localizedTitle}
          >
            {localizedTitle}
          </h3>

          {/* Secondary Title in Devanagari if currently in English */}
          {language === 'en' && product.nameMr && (
            <p className="text-[11px] text-[#8C7B6D] font-medium mt-0.5 font-serif line-clamp-1">
              {product.nameMr}
            </p>
          )}

          {/* Short Description */}
          <p className="text-xs text-[#735F50] mt-2 line-clamp-2 leading-relaxed">
            {localizedDesc}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-4 mt-3 border-t border-[#F0E8DC]">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-[#1E4D2B]">₹{product.price}</span>
              {product.discountPrice && (
                <span className="text-xs text-[#A18F80] line-through">
                  ₹{product.discountPrice}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                product.stock > 10
                  ? 'bg-emerald-50 text-emerald-700'
                  : product.stock > 0
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {product.stock > 10
                ? t('inStock')
                : product.stock > 0
                ? `${product.stock} left`
                : t('outOfStock')}
            </span>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`view-details-${product.id}`}
              onClick={() => navigateTo('product-detail', { productId: product.id })}
              className="px-3 py-2 border border-[#D5C6B5] hover:border-[#1E4D2B] text-[#5C4A3E] hover:text-[#1E4D2B] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('viewDetails')}</span>
            </button>

            <button
              id={`add-to-cart-${product.id}`}
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all ${
                product.stock > 0
                  ? 'bg-[#1E4D2B] hover:bg-[#163E23] text-white hover:shadow-md active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('addToCart')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
