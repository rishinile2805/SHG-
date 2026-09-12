import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Store,
  LogOut,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { currentPage, navigateTo, setRole, products, orders } = useApp();

  const lowStockCount = products.filter((p) => p.stock < 10).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  const menuItems = [
    {
      id: 'admin-dashboard',
      label: 'Overview & Stats',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'admin-products',
      label: 'Products & Inventory',
      icon: <Package className="w-4 h-4" />,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'admin-orders',
      label: 'Customer Orders',
      icon: <ShoppingCart className="w-4 h-4" />,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'admin-customers',
      label: 'Customer Directory',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'admin-offers',
      label: 'Offers & Coupons',
      icon: <Tag className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-64 bg-[#231C18] text-[#EBE3D9] flex flex-col justify-between shrink-0 min-h-[calc(100vh-5rem)] border-r border-[#3A2F29]">
      <div className="p-5 space-y-6">
        {/* Admin Header Badge */}
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#C85A32] text-white flex items-center justify-center font-bold text-lg font-serif shrink-0">
            जि
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white truncate">SHG Admin Desk</h3>
            <p className="text-[11px] text-[#D97706] font-medium truncate">
              Kavita Shinde (President)
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => navigateTo(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1E4D2B] text-white shadow-xs font-bold'
                    : 'text-[#B8A89A] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Return to Shop */}
      <div className="p-5 border-t border-[#3A2F29] space-y-2">
        <button
          onClick={() => {
            setRole('customer');
            navigateTo('home');
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FAF7F2] text-[#1E4D2B] text-xs font-bold hover:bg-white transition-colors shadow-xs"
        >
          <Store className="w-4 h-4" />
          <span>Exit to Customer Shop</span>
        </button>
        <p className="text-[10px] text-center text-[#8A7A6E]">
          Changes reflect immediately on storefront
        </p>
      </div>
    </aside>
  );
};
