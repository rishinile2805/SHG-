import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Offer } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Tag, Plus, Check, Trash2, Sparkles, Percent, Calendar } from 'lucide-react';

export const AdminOffersPage: React.FC = () => {
  const { offers, addOffer, toggleOfferStatus, deleteOffer, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(300);
  const [description, setDescription] = useState('');
  const [validUntil, setValidUntil] = useState('2026-12-31');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addOffer({
      code: code.trim().toUpperCase(),
      title: description || `${discountPercent}% OFF`,
      discountPercent: Number(discountPercent),
      minOrderValue: Number(minOrderAmount),
      minOrderAmount: Number(minOrderAmount),
      description: description || `${discountPercent}% off on homemade snacks`,
      expiryDate: validUntil,
      validUntil,
      isActive: true,
      active: true
    });

    setCode('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Promotion & Loyalty Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2C221E] mt-0.5">
            Discount Coupons & Special Offers
          </h1>
          <p className="text-xs text-[#735F50]">
            Create promotional discount codes for festivals and return customers. Codes work in the shopping cart immediately.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#1E4D2B] hover:bg-[#163E23] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon Code</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => {
          const isOfferActive = offer.isActive !== false && offer.active !== false;

          return (
            <div
              key={offer.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-xs flex flex-col justify-between space-y-4 ${
                isOfferActive ? 'border-[#E8DEC8]' : 'border-gray-200 opacity-60'
              }`}
            >
              <div>
                {/* Top Row: Tag & Status Switch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-black text-base text-[#1E4D2B] bg-[#FAF7F2] px-3 py-1 rounded-xl border border-[#E5DACD]">
                    <Tag className="w-4 h-4 text-[#C85A32]" />
                    <span>{offer.code}</span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2C221E]">
                    <input
                      type="checkbox"
                      checked={isOfferActive}
                      onChange={() => toggleOfferStatus(offer.id)}
                      className="w-4 h-4 text-[#1E4D2B] rounded border-gray-300"
                    />
                    <span>{isOfferActive ? 'Active' : 'Paused'}</span>
                  </label>
                </div>

                {/* Discount Details */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#C85A32]">
                      {offer.discountPercent}%
                    </span>
                    <span className="text-xs font-bold uppercase text-[#735F50]">Instant Discount</span>
                  </div>
                  <p className="text-xs text-[#5C4A3E] leading-relaxed">{offer.description}</p>
                </div>
              </div>

              {/* Constraints & Delete */}
              <div className="pt-4 border-t border-[#F0E8DC] flex items-center justify-between text-xs text-[#735F50]">
                <div className="space-y-0.5">
                  <div>
                    Min Cart Order:{' '}
                    <span className="font-bold text-[#2C221E]">
                      ₹{offer.minOrderValue ?? offer.minOrderAmount ?? 300}
                    </span>
                  </div>
                  <div>
                    Valid Until:{' '}
                    <span className="font-semibold">
                      {offer.expiryDate || offer.validUntil || '2026-12-31'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteOffer(offer.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Delete coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promotional Top Ribbon Manager */}
      <div className="bg-[#FAF4EC] rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] space-y-3">
        <h3 className="font-bold text-base font-serif text-[#2C221E] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C85A32]" />
          <span>Homepage Announcement Banner</span>
        </h3>
        <p className="text-xs text-[#735F50]">
          Active banner on storefront: <span className="font-bold text-[#1E4D2B]">"100% Traditional Homemade Delicacies by Jijamata Women's SHG, Nashik • Free Delivery over ₹500"</span>
        </p>
      </div>

      {/* Add Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Coupon"
        subtitle="This coupon can be entered by customers on the Cart & Checkout page."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Coupon Code (Uppercase) *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. DIWALI20"
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm font-mono font-bold text-[#2C221E] focus:border-[#1E4D2B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#2C221E] block mb-1">
                Discount Percentage (%) *
              </label>
              <input
                type="number"
                required
                min="1"
                max="75"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2C221E] block mb-1">
                Min Order Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Valid Until Date
            </label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs text-[#2C221E]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Festival flat 15% off on all Chakli & Laddus"
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs text-[#2C221E]"
            />
          </div>

          <div className="pt-4 border-t border-[#E8DEC8] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-[#D5C6B5] rounded-xl text-xs font-bold text-[#735F50]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#1E4D2B] text-white rounded-xl text-xs font-bold hover:bg-[#163E23]"
            >
              Save Coupon
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
