import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/customer/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Package,
  Sparkles,
  Truck,
  Users
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    navigateTo,
    addToCart,
    wishlist,
    toggleWishlist,
    language,
    t
  } = useApp();

  const product =
    products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedWeight, setSelectedWeight] = useState<string>(
    product?.weightOptions?.[0]?.weight || product?.weight || '250g'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<
    'desc' | 'ingredients' | 'packaging' | 'shelflife' | 'safety' | 'shipping'
  >('desc');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p>Product not found.</p>
        <button
          onClick={() => navigateTo('products')}
          className="mt-4 px-6 py-2.5 bg-[#1E4D2B] text-white rounded-xl"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const currentOption = product.weightOptions?.find((w) => w.weight === selectedWeight);
  const currentPrice = currentOption ? currentOption.price : product.price;
  const currentDiscountPrice = currentOption?.discountPrice || product.discountPrice;

  const localizedTitle =
    language === 'mr' ? (product.nameMr || product.name) : language === 'hi' ? (product.nameHi || product.name) : product.name;
  const localizedDesc =
    language === 'mr' ? (product.descriptionMr || product.description) : language === 'hi' ? (product.descriptionHi || product.description) : product.description;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, selectedWeight, quantity);
    navigateTo('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('products')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5C4A3E] hover:text-[#1E4D2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </button>

        <span className="text-xs font-semibold text-[#735F50]">
          {product.category} &gt; <span className="text-[#2C221E]">{localizedTitle}</span>
        </span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-[#E8DEC8] shadow-sm">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E5DACD] relative shadow-inner">
            <img
              src={product.image}
              alt={localizedTitle}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 bg-[#1E4D2B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Nashik SHG Signature
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-xs rounded-full shadow-md hover:bg-white text-[#5C4A3E] hover:text-[#C85A32] transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? 'text-[#C85A32] fill-[#C85A32]' : ''}`}
              />
            </button>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8DEC8]">
              <span className="font-bold text-[#1E4D2B] block">100% Pure</span>
              <span className="text-[10px] text-[#735F50]">No Preservatives</span>
            </div>
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8DEC8]">
              <span className="font-bold text-[#C85A32] block">Hand-Crafted</span>
              <span className="text-[10px] text-[#735F50]">Rural Women SHG</span>
            </div>
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8DEC8]">
              <span className="font-bold text-[#1E4D2B] block">{product.shelfLife}</span>
              <span className="text-[10px] text-[#735F50]">Optimal Freshness</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#2C221E]">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-xs text-[#735F50] font-normal">
                  ({product.reviewsCount} customer reviews)
                </span>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2C221E] leading-snug">
                {localizedTitle}
              </h1>
              {language === 'en' && product.nameMr && (
                <p className="text-sm font-medium text-[#735F50] mt-1 font-serif">
                  {product.nameMr}
                </p>
              )}
            </div>

            {/* Price section with MRP & discount */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-[#1E4D2B]">
                ₹{currentPrice}
              </span>
              {currentDiscountPrice && (
                <>
                  <span className="text-base text-[#8C7B6D] line-through">
                    ₹{currentDiscountPrice}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                    Save ₹{currentDiscountPrice - currentPrice}
                  </span>
                </>
              )}
              <span className="text-xs text-[#735F50] ml-auto">
                Inclusive of all taxes
              </span>
            </div>

            {/* Short Description */}
            <p className="text-sm text-[#5C4A3E] leading-relaxed border-t border-b border-[#F0E8DC] py-4">
              {localizedDesc}
            </p>

            {/* Pack Size / Weight Selector */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-[#2C221E] uppercase tracking-wider block">
                {t('selectPackSize')}
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.weightOptions?.map((opt) => (
                  <button
                    key={opt.weight}
                    id={`pack-size-${opt.weight}`}
                    onClick={() => setSelectedWeight(opt.weight)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedWeight === opt.weight
                        ? 'bg-[#1E4D2B] text-white border-[#1E4D2B] shadow-xs scale-102'
                        : 'bg-white text-[#2C221E] border-[#D5C6B5] hover:border-[#1E4D2B]'
                    }`}
                  >
                    <span>{opt.weight}</span>
                    <span className="block text-[10px] opacity-80 font-normal">
                      ₹{opt.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Stock Indicator */}
            <div className="flex items-center gap-6 pt-2">
              <div>
                <label className="text-xs font-bold text-[#2C221E] uppercase tracking-wider block mb-1.5">
                  {t('quantity')}
                </label>
                <div className="flex items-center border border-[#D5C6B5] rounded-xl bg-[#FAF7F2] p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-lg text-[#2C221E] hover:bg-white rounded-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#2C221E]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-lg text-[#2C221E] hover:bg-white rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div className="pt-5">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                    product.stock > 10
                      ? 'bg-emerald-50 text-emerald-700'
                      : product.stock > 0
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {product.stock > 10
                    ? t('inStock')
                    : product.stock > 0
                    ? `Only ${product.stock} left in stock`
                    : t('outOfStock')}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Add to Cart and Buy Now */}
          <div className="space-y-3 pt-6 border-t border-[#F0E8DC]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="product-detail-add-cart-btn"
                onClick={() => addToCart(product, selectedWeight, quantity)}
                disabled={product.stock === 0}
                className="py-3.5 px-6 rounded-xl bg-[#1E4D2B] hover:bg-[#163E23] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('addToCart')}</span>
              </button>

              <button
                id="product-detail-buy-now-btn"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="py-3.5 px-6 rounded-xl bg-[#C85A32] hover:bg-[#B34D27] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{t('buyNow')}</span>
              </button>
            </div>

            {/* Delivery Free Guarantee */}
            <div className="flex items-center gap-2 text-xs text-[#735F50] justify-center pt-2">
              <Truck className="w-4 h-4 text-[#1E4D2B]" />
              <span>Free Delivery on orders above ₹500 across India. Dispatched from Nashik.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Tabs Section */}
      <div className="bg-white rounded-3xl border border-[#E8DEC8] overflow-hidden shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-[#E8DEC8] bg-[#FAF7F2] overflow-x-auto scrollbar-none">
          {[
            { id: 'desc', labelKey: 'tabDescription' },
            { id: 'ingredients', labelKey: 'tabIngredients' },
            { id: 'packaging', labelKey: 'tabPackaging' },
            { id: 'shelflife', labelKey: 'tabShelfLife' },
            { id: 'safety', labelKey: 'tabSafety' },
            { id: 'shipping', labelKey: 'tabShipping' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#1E4D2B] text-[#1E4D2B] bg-white'
                  : 'border-transparent text-[#735F50] hover:text-[#2C221E]'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 text-sm text-[#5C4A3E] leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#2C221E]">About This Delicacy</h3>
              <p>{localizedDesc}</p>
              <p>
                Every single piece is prepared by hand in our community kitchen in Nashik. We avoid all
                palm oil, artificial food colorings, chemical tenderizers, and MSG. Only the highest grade
                sun-dried grains, pure desi cow ghee, and cold-pressed oils are used.
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#2C221E]">Ingredients & Composition</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8DEC8] rounded-xl text-xs font-semibold text-[#2C221E]"
                  >
                    🌿 {ing}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#735F50] pt-2">
                All pulses and grains are hand-sorted and stone-milled to ensure standard hygienic purity.
              </p>
            </div>
          )}

          {activeTab === 'packaging' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#2C221E]">Airtight Packaging & Storage</h3>
              <p>
                Vacuum-sealed in multilayer, food-grade moisture-barrier pouches. For pickles and thecha,
                we use leak-proof, food-grade jars with induction sealing to ensure no transit leakage.
              </p>
              <p className="font-semibold text-xs text-[#1E4D2B]">
                Storage Tip: Store in a cool, dry place away from direct sunlight. Use a clean, dry spoon
                for pickles.
              </p>
            </div>
          )}

          {activeTab === 'shelflife' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#2C221E]">Freshness & Shelf Life</h3>
              <p>
                Shelf Life: <span className="font-bold text-[#1E4D2B]">{product.shelfLife}</span> from the
                date of packaging.
              </p>
              <p>
                Because we use natural preservation methods (sun-drying, salt, mustard oil, and pure ghee)
                rather than chemical additives, products retain their natural crunch and aroma throughout.
              </p>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#2C221E]">FSSAI & Rural Hygiene Standards</h3>
              <p>
                Jijamata Gruh Udyog operates under strict FSSAI food safety regulations. All women
                artisans undergo periodic hygiene training, wear hairnets and gloves, and our kitchen
                water is RO-purified.
              </p>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                <strong>FSSAI Registration:</strong> 21523000000000 (Nashik Division)
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#2C221E]">Delivery Information</h3>
              <p>
                Dispatched directly from our Nashik facility within 24 hours of order confirmation. Delivery
                takes 2-3 business days across Maharashtra and 4-5 business days across India.
              </p>
              <p>
                Express air packaging and bubble-wrapped cartons prevent breakage of delicate items like
                Chakli and Laddus.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Artisan Spotlight Card */}
      <div className="bg-[#FAF4EC] rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#1E4D2B] text-white flex items-center justify-center shrink-0 shadow-md">
          <Users className="w-8 h-8" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-base text-[#2C221E]">
            Handcrafted with Pride by Jijamata Gruh Udyog
          </h4>
          <p className="text-xs text-[#735F50] leading-relaxed">
            Prepared by the women members of Unit 1, Nashik. By purchasing this item, you are directly
            supporting rural women self-reliance and education in Maharashtra.
          </p>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2C221E]">
            {t('relatedProducts')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
