import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Search,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  const statusList: { id: string; label: string }[] = [
    { id: 'All', label: 'All Orders' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Confirmed', label: 'Confirmed' },
    { id: 'Processing', label: 'Processing' },
    { id: 'Shipped', label: 'Shipped' },
    { id: 'Delivered', label: 'Delivered' }
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (selectedStatus !== 'All' && o.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.address.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, selectedStatus, search]);

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
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
          Fulfillment Desk
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2C221E] mt-0.5">
          Customer Orders Management
        </h1>
        <p className="text-xs text-[#735F50]">
          Track deliveries, change fulfillment stages, and generate dispatch bills.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DEC8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#735F50] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, name, phone, city..."
            className="w-full pl-10 pr-3 py-2 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2C221E] outline-hidden focus:border-[#1E4D2B]"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {statusList.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st.id
                  ? 'bg-[#1E4D2B] text-white shadow-2xs'
                  : 'bg-[#FAF7F2] text-[#5C4A3E] hover:bg-[#E8DEC8]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E8DEC8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2C221E]">
            <thead className="bg-[#FAF7F2] text-[#735F50] uppercase text-[10px] font-bold border-b border-[#E8DEC8]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  {/* ID and Date */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#1E4D2B] block">
                      {order.id}
                    </span>
                    <span className="text-[10px] text-[#735F50]">{order.createdAt}</span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold">{order.customerName}</div>
                    <div className="text-[10px] text-[#735F50]">{order.customerPhone}</div>
                    <div className="text-[10px] text-emerald-800 font-semibold">
                      {order.address.city}, {order.address.state}
                    </div>
                  </td>

                  {/* Items */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold">{order.items.length} product(s)</span>
                    <div className="text-[11px] text-[#735F50] truncate max-w-[160px]">
                      {order.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4">
                    <span className="font-black text-sm text-[#1E4D2B]">₹{order.total}</span>
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-semibold text-gray-700 block w-max">
                      {order.paymentMethod}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Live Status Selector */}
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      aria-label="Update Order Fulfillment Status"
                      className={`py-1.5 px-2.5 rounded-xl text-xs font-bold border outline-hidden transition-colors ${statusColors[order.status]}`}
                    >
                      <option value="Pending">Pending (Received)</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing (Packed)</option>
                      <option value="Shipped">Shipped (In Transit)</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setInspectingOrder(order)}
                      className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#E8DEC8] rounded-xl border border-[#D5C6B5] text-[#2C221E] font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Inspection Modal */}
      {inspectingOrder && (
        <Modal
          isOpen={!!inspectingOrder}
          onClose={() => setInspectingOrder(null)}
          title={`Order Details • ${inspectingOrder.id}`}
          subtitle={`Placed by ${inspectingOrder.customerName} on ${inspectingOrder.createdAt}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs text-[#2C221E]">
            {/* Delivery address */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DEC8] space-y-1">
              <h4 className="font-bold text-sm text-[#1E4D2B] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C85A32]" />
                <span>Shipping Address</span>
              </h4>
              <p className="font-semibold">{inspectingOrder.customerName}</p>
              <p className="text-[#735F50]">
                {inspectingOrder.address.street}, {inspectingOrder.address.landmark && `${inspectingOrder.address.landmark}, `}
                {inspectingOrder.address.city}, {inspectingOrder.address.district}, {inspectingOrder.address.state} -{' '}
                {inspectingOrder.address.pincode}
              </p>
              <p className="text-[#735F50]">Contact: {inspectingOrder.customerPhone}</p>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-[#735F50] text-[10px]">
                Ordered Homemade Items
              </h4>
              <div className="divide-y divide-[#F0E8DC] border border-[#E8DEC8] rounded-2xl overflow-hidden">
                {inspectingOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-10 h-10 rounded-lg object-cover bg-[#FAF7F2]"
                      />
                      <div>
                        <span className="font-bold text-xs">{item.productName}</span>
                        <span className="block text-[10px] text-[#735F50]">
                          Pack: {item.weight} • Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#1E4D2B]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations breakdown */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DEC8] space-y-1.5">
              <div className="flex justify-between text-[#735F50]">
                <span>Items Subtotal:</span>
                <span>₹{inspectingOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#735F50]">
                <span>Delivery Charge:</span>
                <span>{inspectingOrder.deliveryCharge === 0 ? 'FREE' : `₹${inspectingOrder.deliveryCharge}`}</span>
              </div>
              {inspectingOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Special Coupon Discount:</span>
                  <span>-₹{inspectingOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-base text-[#1E4D2B] pt-2 border-t border-[#E8DEC8]">
                <span>Grand Total:</span>
                <span>₹{inspectingOrder.total}</span>
              </div>
            </div>

            {/* Print and Close Actions */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-[#D5C6B5] hover:bg-white rounded-xl font-bold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Dispatch Invoice</span>
              </button>

              <button
                onClick={() => setInspectingOrder(null)}
                className="px-6 py-2 bg-[#1E4D2B] text-white rounded-xl font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
