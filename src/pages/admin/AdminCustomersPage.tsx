import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Users, MapPin, Phone, Mail, ShoppingBag } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const { customers } = useApp();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
          Customer Relationships
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2C221E] mt-0.5">
          Registered Patrons & Customers
        </h1>
        <p className="text-xs text-[#735F50]">
          View contact details, lifetime spend, and frequent delivery destinations.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DEC8] shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#735F50] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name, city, phone..."
            className="w-full pl-10 pr-3 py-2 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2C221E] outline-hidden focus:border-[#1E4D2B]"
          />
        </div>
        <span className="text-xs text-[#735F50] font-semibold">
          Total Patrons: {customers.length}
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#E8DEC8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2C221E]">
            <thead className="bg-[#FAF7F2] text-[#735F50] uppercase text-[10px] font-bold border-b border-[#E8DEC8]">
              <tr>
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#1E4D2B] font-bold flex items-center justify-center text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#2C221E]">{c.name}</span>
                        <span className="block text-[10px] text-gray-400 font-mono">
                          ID: {c.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-[#5C4A3E]">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{c.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#735F50] text-[11px] mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{c.email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-semibold text-[#1E4D2B]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{c.city}, Maharashtra</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold bg-amber-50 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200">
                      {c.ordersCount} orders
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-sm text-[#1E4D2B]">
                      ₹{c.totalSpent.toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[#735F50]">
                    {c.joinedDate || c.lastOrderDate || 'Jan 2026'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
