import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Tag,
  Check,
  X
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    navigateTo,
    appliedOffer,
    applyCouponCode,
    removeCouponCode,
    language,
    t
  } = useApp();

  const [couponInput, setCouponInput] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const isFreeDelivery = subtotal >= 500 || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 40;
  const deliveryDifference = 500 - subtotal;

  const discountAmount = appliedOffer
    ? Math.round((subtotal * appliedOffer.discountPercent) / 100)
    : 0;

  const totalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCouponCode(couponInput, subtotal);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-16 border border-[#E8DEC8] max-w-lg mx-auto shadow-sm space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#FAF4EC] text-[#1E4D2B] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black font-serif text-[#2C221E]">
            {t('emptyCartTitle')}
          </h2>
          <p className="text-sm text-[#735F50] leading-relaxed">
            {t('emptyCartSub')}
          </p>
          <button
            id="empty-cart-shop-btn"
            onClick={() => navigateTo('products')}
            className="px-8 py-3.5 bg-[#1E4D2B] hover:bg-[#163E23] text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 text-sm"
          >
            <span>{t('continueShopping')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2C221E]">
            {t('cartTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#735F50]">
            {cart.length} unique homemade items in your box
          </p>
        </div>

        <button
          onClick={() => navigateTo('products')}
          className="text-xs sm:text-sm font-bold text-[#1E4D2B] hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('continueShopping')}</span>
        </button>
      </div>

      {/* Free Delivery Banner Hint */}
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {isFreeDelivery
              ? t('freeDeliveryEligible')
              : t('deliveryHint', { amount: deliveryDifference })}
          </span>
        </div>
        {!isFreeDelivery && (
          <button
            onClick={() => navigateTo('products')}
            className="font-bold underline shrink-0 hover:text-emerald-950"
          >
            Add More Items
          </button>
        )}
      </div>

      {/* Cart Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Line Items */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E8DEC8] overflow-hidden shadow-xs divide-y divide-[#F0E8DC]">
            {cart.map((item) => {
              const localizedTitle =
                language === 'mr'
                  ? item.product.nameMr || item.product.name
                  : language === 'hi'
                  ? item.product.nameHi || item.product.name
                  : item.product.name;

              return (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
                >
                  {/* Product Thumbnail & Details */}
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.product.image}
                      alt={localizedTitle}
                      className="w-20 h-20 rounded-xl object-cover bg-[#FAF7F2] shrink-0 border border-[#E5DACD]"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#1E4D2B] uppercase tracking-wider">
                        {item.product.category}
                      </span>
                      <h3
                        onClick={() =>
                          navigateTo('product-detail', { productId: item.productId })
                        }
                        className="font-bold text-sm sm:text-base text-[#2C221E] hover:text-[#1E4D2B] cursor-pointer"
                      >
                        {localizedTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#735F50]">
                        <span className="bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E8DEC8] font-medium">
                          Pack: {item.selectedWeight}
                        </span>
                        <span>₹{item.unitPrice} each</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#D5C6B5] rounded-xl bg-[#FAF7F2] p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-[#2C221E] hover:bg-white rounded-lg transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-[#2C221E]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-[#2C221E] hover:bg-white rounded-lg transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <div className="text-right min-w-[70px]">
                      <span className="font-bold text-base text-[#1E4D2B]">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                    </div>

                    {/* Remove Action */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          toggleWishlist(item.productId);
                          removeFromCart(item.id);
                        }}
                        title="Move to Wishlist"
                        className="p-2 text-[#735F50] hover:text-[#C85A32] rounded-lg transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                        className="p-2 text-[#735F50] hover:text-rose-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-[#735F50] px-2">
            <button
              onClick={clearCart}
              className="text-rose-600 hover:underline font-semibold"
            >
              Clear Cart
            </button>
            <span>All food items are packed hygienically in Nashik.</span>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E8DEC8] shadow-xs space-y-6">
            <h3 className="text-lg font-bold font-serif text-[#2C221E]">
              {t('orderSummary')}
            </h3>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-[#735F50] uppercase tracking-wider block">
                {t('promoCode')}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Try JIJAMATA10"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs font-mono font-bold uppercase text-[#2C221E] outline-hidden focus:border-[#1E4D2B]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E4D2B] text-white font-bold rounded-xl text-xs hover:bg-[#163E23]"
                >
                  {t('applyPromo')}
                </button>
              </div>

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
              )}

              {appliedOffer && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>{appliedOffer.code} ({appliedOffer.discountPercent}% OFF)</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCouponCode}
                    className="text-emerald-700 hover:text-emerald-950 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </form>

            {/* Breakdown */}
            <div className="space-y-3 text-sm border-t border-b border-[#F0E8DC] py-4">
              <div className="flex justify-between text-[#5C4A3E]">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-[#2C221E]">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-[#5C4A3E]">
                <span>{t('deliveryFee')}</span>
                <span>
                  {isFreeDelivery ? (
                    <span className="font-bold text-emerald-700">{t('freeDelivery')}</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t('discount')} ({appliedOffer?.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-base text-[#2C221E]">{t('totalAmount')}</span>
              <span className="text-2xl font-black text-[#1E4D2B]">₹{totalAmount}</span>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={() => navigateTo('checkout')}
              className="w-full py-3.5 px-6 rounded-xl bg-[#1E4D2B] hover:bg-[#163E23] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{t('proceedCheckout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
