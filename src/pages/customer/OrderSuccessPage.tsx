import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  Printer,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orders, selectedOrderId, navigateTo, t } = useApp();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p>No order found.</p>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-6 py-2 bg-[#1E4D2B] text-white rounded-xl"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Top Celebration Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DEC8] text-center shadow-xs space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1E4D2B] flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2C221E]">
            {t('orderSuccessTitle')}
          </h1>
          <p className="text-sm text-[#735F50] max-w-md mx-auto">
            {t('orderSuccessSub')}
          </p>
        </div>

        {/* Order ID & Date Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-[#FAF7F2] px-6 py-3 rounded-2xl border border-[#E8DEC8] text-xs">
          <div>
            <span className="text-[#735F50]">{t('orderNumber')}: </span>
            <span className="font-bold text-[#1E4D2B] font-mono">{order.id}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div>
            <span className="text-[#735F50]">{t('orderDate')}: </span>
            <span className="font-semibold text-[#2C221E]">{order.orderDate || order.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-4">
          <h3 className="font-bold text-base font-serif text-[#2C221E]">
            Package Contents ({order.items.length} items)
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
            Status: {order.status}
          </span>
        </div>

        {/* Items List */}
        <div className="divide-y divide-[#F0E8DC]">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center gap-4">
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-14 h-14 rounded-xl object-cover bg-[#FAF7F2] shrink-0 border border-[#E5DACD]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-[#2C221E] truncate">
                  {item.productName}
                </h4>
                <p className="text-xs text-[#735F50]">
                  Pack: {item.weight} • Qty: {item.quantity}
                </p>
              </div>
              <span className="font-bold text-sm text-[#1E4D2B]">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Breakdown & Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F0E8DC] text-xs">
          {/* Shipping Address */}
          <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8]">
            <h4 className="font-bold text-[#2C221E] flex items-center gap-1.5 text-xs">
              <MapPin className="w-4 h-4 text-[#C85A32]" />
              <span>Delivery Address</span>
            </h4>
            <p className="font-semibold text-[#2C221E]">{order.customerName}</p>
            <p className="text-[#735F50] leading-relaxed">
              {order.address.street}, {order.address.landmark && `${order.address.landmark}, `}
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
            <p className="text-[#735F50]">Phone: {order.customerPhone}</p>
          </div>

          {/* Payment & Estimates */}
          <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8]">
            <h4 className="font-bold text-[#2C221E] flex items-center gap-1.5 text-xs">
              <Truck className="w-4 h-4 text-[#1E4D2B]" />
              <span>Delivery & Payment</span>
            </h4>
            <div className="space-y-1 text-[#735F50]">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-semibold text-[#2C221E]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-semibold text-emerald-700">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span className="font-semibold text-[#2C221E]">{order.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8DEC8] font-bold text-sm text-[#1E4D2B]">
                <span>Total Amount:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrint}
          className="px-5 py-3 rounded-xl border border-[#D5C6B5] hover:bg-white text-[#5C4A3E] text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>{t('printReceipt')}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            id="track-order-success-btn"
            onClick={() => navigateTo('track-order', { orderId: order.id })}
            className="px-6 py-3 rounded-xl bg-[#1E4D2B] hover:bg-[#163E23] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>{t('trackThisOrder')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('products')}
            className="px-6 py-3 rounded-xl bg-white border border-[#D5C6B5] hover:border-[#1E4D2B] text-[#2C221E] text-xs sm:text-sm font-bold transition-colors"
          >
            {t('continueShopping')}
          </button>
        </div>
      </div>
    </div>
  );
};
