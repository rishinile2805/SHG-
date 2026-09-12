import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Language } from '../../types';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    language,
    setLanguage,
    role,
    setRole,
    cart,
    wishlist,
    customerUser,
    t,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const navItems = [
    { id: 'home', labelKey: 'navHome' },
    { id: 'products', labelKey: 'navProducts' },
    { id: 'our-story', labelKey: 'navOurStory' },
    { id: 'about', labelKey: 'navAbout' },
    { id: 'contact', labelKey: 'navContact' },
    { id: 'track-order', labelKey: 'navTrackOrder' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('products');
      setSearchOpen(false);
    }
  };

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'EN' },
    { code: 'mr', label: 'मराठी', sub: 'MR' },
    { code: 'hi', label: 'हिंदी', sub: 'HI' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DEC8] shadow-xs">
      {/* Top Banner */}
      <div className="bg-[#1E4D2B] text-[#FAF7F2] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#86EFAC] bg-white/10 px-2 py-0.5 rounded-full text-[11px]">
              <Sparkles className="w-3 h-3" /> Nashik Women's SHG
            </span>
            <span className="hidden sm:inline text-white/80">|</span>
            <span className="text-white/90 text-[11px] sm:text-xs">
              🌾 {t('brandTagline')} • Free delivery on orders over ₹500
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="language-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                aria-label="Select Language"
              >
                <span>{languages.find((l) => l.code === language)?.label}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {langDropdownOpen && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-1.5 w-32 bg-white text-[#2C221E] rounded-xl shadow-xl border border-[#E5DACD] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#F6EFE8] ${
                        language === lang.code ? 'font-bold text-[#1E4D2B] bg-[#EBF4ED]' : ''
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{lang.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Demo Switcher to Admin */}
            <button
              id="switch-to-admin-demo-btn"
              onClick={() => setRole('admin')}
              className="inline-flex items-center gap-1 bg-[#C85A32] hover:bg-[#B34D27] text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs transition-colors"
              title="Click to view Admin Management Dashboard"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Portal Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E4D2B] to-[#2E6F40] flex items-center justify-center text-white shadow-sm border border-[#377F4C]/40 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-xl font-bold font-serif">जि</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1E4D2B] font-serif">
                  Jijamata
                </span>
                <span className="text-lg sm:text-xl font-semibold text-[#C85A32]">
                  Gruh Udyog
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#735F50] tracking-wide">
                जिजामाता महिला बचत गट, नाशिक
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => navigateTo(item.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-[#1E4D2B] bg-[#E8DEC8]/50 shadow-xs font-bold'
                      : 'text-[#5C4A3E] hover:text-[#1E4D2B] hover:bg-[#F3ECE4]'
                  }`}
                >
                  {t(item.labelKey)}
                </button>
              );
            })}
          </nav>

          {/* Action Controls (Right side) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button / Bar */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white rounded-full shadow-lg border border-[#D5C6B5] w-64 sm:w-80 px-3 py-1.5 z-30"
                >
                  <Search className="w-4 h-4 text-[#735F50] shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full text-xs text-[#2C221E] outline-hidden bg-transparent"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  id="header-search-open-btn"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search products"
                  className="p-2.5 rounded-xl text-[#5C4A3E] hover:text-[#1E4D2B] hover:bg-[#F3ECE4] transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => {
                if (customerUser) {
                  navigateTo('customer-dashboard');
                } else {
                  navigateTo('login');
                }
              }}
              aria-label="View Wishlist"
              className="relative p-2.5 rounded-xl text-[#5C4A3E] hover:text-[#C85A32] hover:bg-[#F3ECE4] transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#C85A32] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => navigateTo('cart')}
              aria-label="View Shopping Cart"
              className="flex items-center gap-2.5 bg-[#1E4D2B] hover:bg-[#163E23] text-white px-3.5 py-2.5 rounded-xl shadow-xs transition-all hover:shadow-md"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C85A32] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#1E4D2B]">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-sm">
                ₹{cartSubtotal}
              </span>
            </button>

            {/* Customer User Profile / Login */}
            <button
              id="header-user-account-btn"
              onClick={() => {
                if (customerUser) {
                  navigateTo('customer-dashboard');
                } else {
                  navigateTo('login');
                }
              }}
              className="p-2.5 rounded-xl text-[#5C4A3E] hover:text-[#1E4D2B] hover:bg-[#F3ECE4] transition-colors flex items-center gap-1.5"
              aria-label="Account Login or Profile"
            >
              <div className="w-7 h-7 rounded-full bg-[#E8DEC8] flex items-center justify-center text-[#1E4D2B]">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden md:inline text-xs font-semibold text-[#5C4A3E]">
                {customerUser ? customerUser.name.split(' ')[0] : t('navLogin')}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[#5C4A3E] hover:bg-[#F3ECE4]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="lg:hidden border-t border-[#E8DEC8] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150"
        >
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-xl px-3 py-2 border border-[#D5C6B5] mb-3">
            <Search className="w-4 h-4 text-[#735F50] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full text-xs text-[#2C221E] outline-hidden bg-transparent"
            />
          </form>

          {/* Links */}
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between ${
                  isActive
                    ? 'bg-[#1E4D2B] text-white'
                    : 'text-[#2C221E] hover:bg-[#F3ECE4]'
                }`}
              >
                <span>{t(item.labelKey)}</span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
            );
          })}

          <div className="pt-4 border-t border-[#E8DEC8] flex flex-col gap-2">
            <button
              onClick={() => {
                setRole('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-[#C85A32] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Switch to Admin Portal Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
