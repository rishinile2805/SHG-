import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  LogIn
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    customerUser,
    loginCustomer,
    logoutCustomer,
    setRole,
    navigateTo,
    showToast,
    t
  } = useApp();

  const [portalType, setPortalType] = useState<'customer' | 'admin'>('customer');
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginCustomer(mobileOrEmail || 'user@example.com', 'Registered Customer');
    navigateTo('customer-dashboard');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('admin');
    showToast('Logged into Jijamata SHG Admin Portal', 'success');
    navigateTo('admin-dashboard');
  };

  const handleDemoCustomerLogin = () => {
    loginCustomer('sunita.ranade@gmail.com', 'Sunita Ranade');
    navigateTo('customer-dashboard');
  };

  const handleDemoAdminLogin = () => {
    setRole('admin');
    showToast('Switched to Admin Role for Jijamata SHG', 'success');
    navigateTo('admin-dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DEC8] shadow-sm space-y-6">
        {/* Brand Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1E4D2B] text-white flex items-center justify-center mx-auto shadow-md font-serif font-bold text-xl">
            जि
          </div>
          <h1 className="text-2xl font-black font-serif text-[#2C221E]">
            {portalType === 'customer' ? 'Customer Account' : 'SHG Staff Portal'}
          </h1>
          <p className="text-xs text-[#735F50]">
            {portalType === 'customer'
              ? 'Access your saved orders, wishlist, and tracking'
              : 'Administer products, inventory & order dispatch status'}
          </p>
        </div>

        {/* Portal Switch Tabs */}
        <div className="flex bg-[#FAF7F2] p-1 rounded-2xl border border-[#E8DEC8]">
          <button
            onClick={() => setPortalType('customer')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              portalType === 'customer'
                ? 'bg-white text-[#1E4D2B] shadow-xs'
                : 'text-[#735F50] hover:text-[#2C221E]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer Login</span>
          </button>

          <button
            onClick={() => setPortalType('admin')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              portalType === 'admin'
                ? 'bg-white text-[#C85A32] shadow-xs'
                : 'text-[#735F50] hover:text-[#2C221E]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SHG Staff / Admin</span>
          </button>
        </div>

        {/* Form */}
        {portalType === 'customer' ? (
          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#2C221E] block mb-1">
                Mobile Number or Email
              </label>
              <input
                type="text"
                required
                value={mobileOrEmail}
                onChange={(e) => setMobileOrEmail(e.target.value)}
                placeholder="e.g. +91 98220 44521"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2C221E] block mb-1">
                Password or OTP
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E4D2B] hover:bg-[#163E23] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Customer Account</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#2C221E] block mb-1">
                Staff ID / Admin Username
              </label>
              <input
                type="text"
                required
                defaultValue="kavita.shinde@jijamata"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#C85A32]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2C221E] block mb-1">
                Passcode
              </label>
              <input
                type="password"
                required
                defaultValue="nashik2026"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#C85A32]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#C85A32] hover:bg-[#B34D27] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Enter SHG Admin Portal</span>
            </button>
          </form>
        )}

        {/* 1-Click Demo Buttons for Fast Evaluation */}
        <div className="pt-4 border-t border-[#F0E8DC] space-y-2.5">
          <p className="text-[11px] font-bold text-center text-[#735F50] uppercase tracking-wider">
            ⚡ Quick Demo Sign-In (No typing needed)
          </p>

          <button
            id="demo-login-customer-btn"
            type="button"
            onClick={handleDemoCustomerLogin}
            className="w-full py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#F3ECE4] border border-[#D5C6B5] text-[#1E4D2B] text-xs font-bold rounded-xl flex items-center justify-between transition-colors"
          >
            <span>Customer: Sunita Ranade</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="demo-login-admin-btn"
            type="button"
            onClick={handleDemoAdminLogin}
            className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#C85A32] text-xs font-bold rounded-xl flex items-center justify-between transition-colors"
          >
            <span>SHG Admin: Kavita Shinde (President)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
