import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  LogOut,
  ArrowRight,
  Package,
  Trash2,
  Sparkles
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const {
    customerUser,
    logoutCustomer,
    orders,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    navigateTo,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  const customerOrders = orders.filter(
    (o) => o.customerPhone === customerUser?.phone || o.customerEmail === customerUser?.email
  );

  // If none matched, show all demo orders so user has things to inspect
  const displayOrders = customerOrders.length > 0 ? customerOrders : orders.slice(0, 3);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Profile Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1E4D2B] text-white flex items-center justify-center font-bold text-2xl font-serif">
            {customerUser?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-serif text-[#2C221E]">
                {customerUser?.name || 'Valued Customer'}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                Loyal Patron
              </span>
            </div>
            <p className="text-xs text-[#735F50] mt-0.5">
              {customerUser?.phone} • {customerUser?.email}
            </p>
          </div>
        </div>

        <button
          onClick={logoutCustomer}
          className="px-4 py-2 text-xs font-bold text-[#735F50] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 border border-[#E5DACD]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#E8DEC8] max-w-md">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-white text-[#1E4D2B] shadow-xs'
              : 'text-[#735F50] hover:text-[#2C221E]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({displayOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'wishlist'
              ? 'bg-white text-[#C85A32] shadow-xs'
              : 'text-[#735F50] hover:text-[#2C221E]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-white text-[#2C221E] shadow-xs'
              : 'text-[#735F50] hover:text-[#2C221E]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>

      {/* Tab 1: My Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {displayOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-[#E8DEC8] shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E8DC] pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-[#1E4D2B] text-base">
                      {order.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800'
                          : order.status === 'Shipped' || order.status === 'Out for Delivery'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#735F50] mt-1">
                    Placed on {order.createdAt || order.orderDate} • Delivery: {order.estimatedDelivery}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('track-order', { orderId: order.id })}
                    className="px-4 py-2 bg-[#1E4D2B] text-white rounded-xl text-xs font-bold hover:bg-[#163E23] transition-colors"
                  >
                    Track Package
                  </button>
                  <button
                    onClick={() => navigateTo('order-success', { orderId: order.id })}
                    className="px-4 py-2 border border-[#D5C6B5] hover:bg-[#FAF7F2] rounded-xl text-xs font-semibold text-[#2C221E]"
                  >
                    Invoice
                  </button>
                </div>
              </div>

              {/* Items in order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8]"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border border-[#E5DACD]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#2C221E] truncate">
                        {item.productName}
                      </p>
                      <p className="text-[10px] text-[#735F50]">
                        {item.weight} • Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs pt-2 font-bold text-[#2C221E]">
                <span>Total Amount Paid:</span>
                <span className="text-base text-[#1E4D2B]">₹{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-xs p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF7F2]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2C221E]">{product.name}</h4>
                    <p className="text-xs text-[#1E4D2B] font-bold mt-1">₹{product.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 py-2 bg-[#1E4D2B] text-white text-xs font-bold rounded-xl hover:bg-[#163E23]"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DEC8] space-y-3">
              <Heart className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-bold text-base text-[#2C221E]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#735F50]">
                Explore our traditional snacks and click the heart icon to save items here.
              </p>
              <button
                onClick={() => navigateTo('products')}
                className="px-6 py-2.5 bg-[#1E4D2B] text-white rounded-xl text-xs font-bold"
              >
                Browse Delicacies
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Details */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs max-w-xl space-y-4">
          <h3 className="text-base font-bold font-serif text-[#2C221E]">
            Profile & Default Delivery Address
          </h3>
          <div className="space-y-3 text-xs text-[#5C4A3E]">
            <div>
              <span className="font-bold text-[#2C221E] block">Name:</span>
              <span>{customerUser?.name}</span>
            </div>
            <div>
              <span className="font-bold text-[#2C221E] block">Phone:</span>
              <span>{customerUser?.phone}</span>
            </div>
            <div>
              <span className="font-bold text-[#2C221E] block">Email:</span>
              <span>{customerUser?.email}</span>
            </div>
            <div>
              <span className="font-bold text-[#2C221E] block">City:</span>
              <span>{customerUser?.city}, Maharashtra</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
