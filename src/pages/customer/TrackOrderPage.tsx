import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const TrackOrderPage: React.FC = () => {
  const { orders, selectedOrderId, t } = useApp();

  const [searchQuery, setSearchQuery] = useState(selectedOrderId || 'JJ-2026-102');
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (selectedOrderId) {
      const match = orders.find((o) => o.id === selectedOrderId);
      if (match) {
        setActiveOrder(match);
        setSearchQuery(match.id);
        setSearched(true);
      }
    } else {
      // Default to JJ-2026-102 (which is In Transit)
      const defaultOrder = orders.find((o) => o.id === 'JJ-2026-102') || orders[0];
      if (defaultOrder) {
        setActiveOrder(defaultOrder);
        setSearchQuery(defaultOrder.id);
        setSearched(true);
      }
    }
  }, [selectedOrderId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const query = searchQuery.trim().toUpperCase();
    const match = orders.find(
      (o) => o.id.toUpperCase() === query || o.customerPhone.includes(query)
    );
    setActiveOrder(match || null);
  };

  const steps: { status: OrderStatus; labelKey: string; desc: string }[] = [
    { status: 'Pending', labelKey: 'statusPending', desc: 'Order received at Nashik SHG' },
    { status: 'Confirmed', labelKey: 'statusConfirmed', desc: 'Verified & allocated to kitchen' },
    { status: 'Processing', labelKey: 'statusProcessing', desc: 'Handcrafted, sealed & packed' },
    { status: 'Shipped', labelKey: 'statusShipped', desc: 'Dispatched via express logistics' },
    { status: 'Delivered', labelKey: 'statusDelivered', desc: 'Safely delivered to customer' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Preparing':
      case 'Processing':
      case 'Packed':
        return 2;
      case 'Shipped':
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D2B]">
          Live Shipment Status
        </span>
        <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#2C221E]">
          {t('trackOrderTitle')}
        </h1>
        <p className="text-sm text-[#735F50]">
          {t('trackOrderSub')}
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#735F50] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Order ID (e.g., JJ-2026-102) or Mobile Number"
              className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm font-medium text-[#2C221E] outline-hidden focus:border-[#1E4D2B]"
            />
          </div>
          <button
            id="track-order-submit-btn"
            type="submit"
            className="px-6 py-3 bg-[#1E4D2B] hover:bg-[#163E23] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors shrink-0"
          >
            {t('trackBtn')}
          </button>
        </form>

        {/* Quick Sample Links for Judges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#735F50]">
          <span className="font-semibold text-[#2C221E]">Try Demo Orders:</span>
          {orders.slice(0, 4).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setSearchQuery(o.id);
                setActiveOrder(o);
                setSearched(true);
              }}
              className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#E8DEC8] rounded-lg border border-[#E5DACD] font-mono text-[11px] font-bold text-[#1E4D2B]"
            >
              {o.id} ({o.status})
            </button>
          ))}
        </div>
      </div>

      {/* Active Order Result */}
      {activeOrder ? (
        <div className="bg-white rounded-3xl border border-[#E8DEC8] p-6 sm:p-8 shadow-xs space-y-8">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0E8DC] pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold font-mono text-[#1E4D2B]">
                  {activeOrder.id}
                </h3>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  {activeOrder.status}
                </span>
              </div>
              <p className="text-xs text-[#735F50] mt-1">
                Placed on {activeOrder.createdAt} by {activeOrder.customerName}
              </p>
            </div>

            <div className="text-left sm:text-right bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DEC8]">
              <span className="text-[11px] text-[#735F50] block">Estimated Delivery</span>
              <span className="text-xs sm:text-sm font-bold text-[#2C221E]">
                {activeOrder.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* 5-Step Visual Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#735F50] uppercase tracking-wider">
              Shipment Progress
            </h4>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.status} className="flex md:flex-col items-start gap-3 relative">
                      {/* Node Icon */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs z-10 transition-all ${
                          isCompleted
                            ? 'bg-[#1E4D2B] text-white ring-4 ring-emerald-50'
                            : 'bg-[#FAF7F2] text-[#A18F80] border border-[#D5C6B5]'
                        } ${isCurrent ? 'ring-4 ring-[#C85A32]/30 scale-105' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      {/* Text */}
                      <div className="space-y-0.5">
                        <span
                          className={`text-xs font-bold block ${
                            isCompleted ? 'text-[#2C221E]' : 'text-[#A18F80]'
                          }`}
                        >
                          {t(step.labelKey)}
                        </span>
                        <span className="text-[11px] text-[#735F50] leading-snug block">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Package Details and Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F0E8DC] text-xs">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] space-y-1">
              <h5 className="font-bold text-[#2C221E] flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#1E4D2B]" />
                <span>Package Contents</span>
              </h5>
              <p className="text-[#735F50]">
                {activeOrder.items.map((i: any) => `${i.productName} (${i.weight}) × ${i.quantity}`).join(', ')}
              </p>
              <p className="font-bold text-[#1E4D2B] pt-1">
                Total Paid: ₹{activeOrder.total} ({activeOrder.paymentMethod})
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] space-y-1">
              <h5 className="font-bold text-[#2C221E] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C85A32]" />
                <span>Destination Address</span>
              </h5>
              <p className="text-[#735F50]">
                {activeOrder.address.street}, {activeOrder.address.city}, {activeOrder.address.state} -{' '}
                {activeOrder.address.pincode}
              </p>
              <p className="text-[#735F50]">Recipient: {activeOrder.customerName} ({activeOrder.customerPhone})</p>
            </div>
          </div>
        </div>
      ) : searched ? (
        <div className="bg-white rounded-3xl p-10 border border-[#E8DEC8] text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-[#C85A32] mx-auto" />
          <h3 className="text-base font-bold text-[#2C221E]">No Order Found</h3>
          <p className="text-xs text-[#735F50]">
            Please double-check the Order ID (e.g. JJ-2026-101) or try clicking one of the sample order buttons above.
          </p>
        </div>
      ) : null}
    </div>
  );
};
