import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { AdminSidebar } from './components/admin/AdminSidebar';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ProductsPage } from './pages/customer/ProductsPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderSuccessPage } from './pages/customer/OrderSuccessPage';
import { TrackOrderPage } from './pages/customer/TrackOrderPage';
import { OurStoryPage } from './pages/customer/OurStoryPage';
import { AboutPage } from './pages/customer/AboutPage';
import { ContactPage } from './pages/customer/ContactPage';
import { LoginPage } from './pages/customer/LoginPage';
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';

const AppContent: React.FC = () => {
  const { currentPage, role, setRole, navigateTo } = useApp();

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Render Admin View
  if (role === 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#2C221E] flex flex-col font-sans antialiased">
        {/* Admin Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#1E4D2B] text-white px-4 sm:px-8 py-3 flex items-center justify-between border-b border-[#2E6F40] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-[#1E4D2B] flex items-center justify-center font-bold text-lg font-serif">
              जि
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight font-serif">
                  Jijamata Gruh Udyog
                </span>
                <span className="bg-[#C85A32] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
              <p className="text-[11px] text-white/80">Nashik Women's SHG Operations</p>
            </div>
          </div>

          <button
            onClick={() => {
              setRole('customer');
              navigateTo('home');
            }}
            className="px-4 py-1.5 rounded-xl bg-white text-[#1E4D2B] hover:bg-[#FAF7F2] text-xs font-bold transition-colors shadow-xs"
          >
            ← Exit to Customer Storefront
          </button>
        </header>

        {/* Admin Layout with Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row">
          <AdminSidebar />
          <main className="flex-1 overflow-x-hidden">
            {currentPage === 'admin-products' && <AdminProductsPage />}
            {currentPage === 'admin-orders' && <AdminOrdersPage />}
            {currentPage === 'admin-customers' && <AdminCustomersPage />}
            {currentPage === 'admin-offers' && <AdminOffersPage />}
            {(currentPage === 'admin-dashboard' ||
              !['admin-products', 'admin-orders', 'admin-customers', 'admin-offers'].includes(
                currentPage
              )) && <AdminDashboardPage />}
          </main>
        </div>

        <Toast />
      </div>
    );
  }

  // Render Customer View
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C221E] flex flex-col font-sans antialiased">
      <Header />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'products' && <ProductsPage />}
        {currentPage === 'product-detail' && <ProductDetailPage />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'order-success' && <OrderSuccessPage />}
        {currentPage === 'track-order' && <TrackOrderPage />}
        {currentPage === 'our-story' && <OurStoryPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'login' && <LoginPage />}
        {currentPage === 'customer-dashboard' && <CustomerDashboardPage />}
      </main>

      <Footer />
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
