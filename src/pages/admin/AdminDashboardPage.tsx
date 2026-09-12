import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  ArrowRight,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  Eye,
  Store
} from 'lucide-react';
import { OrderStatus } from '../../types';
import { ProductModal } from '../../components/admin/ProductModal';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    orders,
    updateOrderStatus,
    updateProductStock,
    addProduct,
    navigateTo,
    setRole
  } = useApp();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Metrics
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0) + 145000; // Realistic historical base
  const totalOrdersCount = orders.length + 420;
  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const lowStockProducts = products.filter((p) => p.stock < 10);

  const statusColors: Record<OrderStatus, string> = {
    Pending: 'bg-amber-50 text-amber-800 border-amber-200',
    Confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
    Preparing: 'bg-purple-50 text-purple-800 border-purple-200',
    Processing: 'bg-purple-50 text-purple-800 border-purple-200',
    Packed: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    Shipped: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    'Out for Delivery': 'bg-cyan-50 text-cyan-800 border-cyan-200',
    Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-800 border-rose-200'
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            SHG Management Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2C221E] mt-0.5">
            Operations & Sales Dashboard
          </h1>
          <p className="text-xs text-[#735F50]">
            Nashik Kitchen Collective • Real-time synchronization active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="px-4 py-2.5 bg-[#1E4D2B] hover:bg-[#163E23] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => {
              setRole('customer');
              navigateTo('home');
            }}
            className="px-4 py-2.5 bg-white border border-[#D5C6B5] hover:bg-[#FAF7F2] text-[#2C221E] rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Customer View</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DEC8] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#735F50] uppercase tracking-wider">
              Total Revenue
            </span>
            <h3 className="text-2xl font-black text-[#1E4D2B]">
              ₹{totalSales.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-emerald-700 font-semibold">+18.4% this month</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1E4D2B] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DEC8] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#735F50] uppercase tracking-wider">
              Orders Processed
            </span>
            <h3 className="text-2xl font-black text-[#2C221E]">{totalOrdersCount}</h3>
            <p className="text-[11px] text-[#C85A32] font-semibold">
              {pendingOrders.length} pending dispatch
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C85A32] flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DEC8] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#735F50] uppercase tracking-wider">
              Product Catalogue
            </span>
            <h3 className="text-2xl font-black text-[#2C221E]">{products.length}</h3>
            <p className="text-[11px] text-[#735F50]">Across 5 categories</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1E4D2B] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DEC8] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#735F50] uppercase tracking-wider">
              Inventory Alert
            </span>
            <h3
              className={`text-2xl font-black ${
                lowStockProducts.length > 0 ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {lowStockProducts.length} Items
            </h3>
            <p className="text-[11px] text-[#735F50]">Require kitchen restocking</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                Low Inventory Notice ({lowStockProducts.length} products running out)
              </h4>
              <p className="text-[11px] text-amber-800">
                {lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).join(' • ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('admin-products')}
            className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            Update Stock Now
          </button>
        </div>
      )}

      {/* Recent Orders Section with Direct Status Editor */}
      <div className="bg-white rounded-3xl border border-[#E8DEC8] overflow-hidden shadow-xs space-y-4">
        <div className="p-6 border-b border-[#F0E8DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold font-serif text-[#2C221E]">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-[#735F50]">
              Change status dropdown to see updates reflect in customer tracking in real-time
            </p>
          </div>

          <button
            onClick={() => navigateTo('admin-orders')}
            className="text-xs font-bold text-[#1E4D2B] hover:underline flex items-center gap-1"
          >
            <span>View All Orders ({orders.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2C221E]">
            <thead className="bg-[#FAF7F2] text-[#735F50] uppercase text-[10px] font-bold border-b border-[#E8DEC8]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Live Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1E4D2B]">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold">{order.customerName}</div>
                    <div className="text-[10px] text-[#735F50]">{order.address.city}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold">{order.items.length} items</span>
                    <span className="block text-[10px] text-[#735F50] truncate max-w-[140px]">
                      {order.items[0]?.productName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sm">₹{order.total}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-semibold text-gray-700">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {/* Status Dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      aria-label="Update Order Live Status"
                      className={`py-1 px-2.5 rounded-lg text-xs font-bold border outline-hidden transition-colors ${statusColors[order.status]}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigateTo('track-order', { orderId: order.id })}
                      className="p-1.5 text-[#5C4A3E] hover:text-[#1E4D2B] rounded-lg hover:bg-white transition-colors"
                      title="View tracking timeline"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={(data) => addProduct(data as any)}
      />
    </div>
  );
};
