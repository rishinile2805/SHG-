import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Order,
  CartItem,
  CategoryInfo,
  Offer,
  Review,
  ContactMessage,
  Customer,
  Language,
  Role,
  PageRoute,
  OrderStatus,
  ProductCategory
} from '../types';
import {
  initialProducts,
  initialOrders,
  initialCategories,
  initialOffers,
  initialReviews,
  initialMessages,
  initialCustomers
} from '../data/initialData';
import { translations } from '../data/translations';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Navigation & Role
  currentPage: PageRoute;
  selectedProductId: string | null;
  selectedOrderId: string | null;
  role: Role;
  language: Language;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setLanguage: (lang: Language) => void;
  setRole: (role: Role) => void;
  navigateTo: (page: PageRoute, params?: { productId?: string; orderId?: string }) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductStock: (id: string, newStock: number) => void;
  deleteProduct: (id: string) => void;

  // Categories
  categories: CategoryInfo[];
  addCategory: (cat: CategoryInfo) => void;
  updateCategory: (id: ProductCategory, updates: Partial<CategoryInfo>) => void;
  deleteCategory: (id: ProductCategory) => void;

  // Cart & Wishlist
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, selectedWeight?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'orderDate' | 'timeline'>) => string;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, customDesc?: string) => void;

  // Offers & Coupons
  offers: Offer[];
  appliedOffer: Offer | null;
  applyCouponCode: (code: string, currentSubtotal: number) => { success: boolean; message: string };
  removeCouponCode: () => void;
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  deleteOffer: (id: string) => void;
  toggleOfferStatus: (id: string) => void;

  // Reviews & Messages
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  toggleReviewStatus: (id: string) => void;
  messages: ContactMessage[];
  addMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => void;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => void;

  // Customers
  customers: Customer[];

  // Auth (Simulated)
  customerUser: { name: string; phone: string; email: string; city: string } | null;
  adminUser: { name: string; role: string; username: string } | null;
  customerLogin: (data: { name: string; phone: string; email?: string; city?: string }) => void;
  customerLogout: () => void;
  loginCustomer: (emailOrPhone: string, name?: string) => void;
  logoutCustomer: () => void;
  adminLogin: (username: string) => void;
  adminLogout: () => void;

  // Toast
  toast: ToastData | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language & Role
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('jgu_lang') as Language) || 'en';
  });

  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('jgu_role') as Role) || 'customer';
  });

  const [currentPage, setCurrentPageState] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('chakli-bhajani');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('JGU-8942');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 2. Data States with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('jgu_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialProducts;
  });

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    const saved = localStorage.getItem('jgu_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialCategories;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('jgu_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialOrders;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jgu_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('jgu_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['chakli-bhajani', 'laddu-besan'];
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('jgu_offers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialOffers;
  });

  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('jgu_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialReviews;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('jgu_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialMessages;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('jgu_customers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialCustomers;
  });

  // 3. User States
  const [customerUser, setCustomerUser] = useState<{ name: string; phone: string; email: string; city: string } | null>(() => {
    const saved = localStorage.getItem('jgu_cust_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      name: 'Rajesh Kulkarni',
      phone: '+91 98220 44521',
      email: 'rajesh.kulkarni@gmail.com',
      city: 'Pune'
    };
  });

  const [adminUser, setAdminUser] = useState<{ name: string; role: string; username: string } | null>(() => {
    const saved = localStorage.getItem('jgu_admin_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  const [toast, setToast] = useState<ToastData | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('jgu_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('jgu_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('jgu_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('jgu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jgu_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('jgu_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('jgu_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('jgu_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('jgu_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('jgu_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('jgu_role', role);
  }, [role]);

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('jgu_cust_user', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('jgu_cust_user');
    }
  }, [customerUser]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('jgu_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('jgu_admin_user');
    }
  }, [adminUser]);

  // Toast handler
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  };

  // Translation helper
  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let text = langDict[key] || translations.en[key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    showToast(newLang === 'mr' ? 'भाषा मराठी निवडली' : newLang === 'hi' ? 'भाषा हिंदी चुनी गई' : 'Language set to English', 'info');
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole === 'admin') {
      if (!adminUser) {
        setAdminUser({ name: 'Sunita Patil (SHG Coordinator)', role: 'Head Coordinator', username: 'admin' });
      }
      setCurrentPageState('admin-dashboard');
      showToast('Switched to Jijamata Admin Portal', 'info');
    } else {
      setCurrentPageState('home');
      showToast('Switched to Customer Storefront', 'info');
    }
  };

  const navigateTo = (page: PageRoute, params?: { productId?: string; orderId?: string }) => {
    if (params?.productId) {
      setSelectedProductId(params.productId);
    }
    if (params?.orderId) {
      setSelectedOrderId(params.orderId);
    }
    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product Operations
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id: newId
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to store catalog!`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
    // Also update any item in the cart if the price or title changed
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.productId === id) {
          const updatedProd = { ...item.product, ...updates };
          const updatedUnitPrice = updates.price !== undefined ? updates.price : item.unitPrice;
          return {
            ...item,
            product: updatedProd,
            unitPrice: updatedUnitPrice
          };
        }
        return item;
      })
    );
    showToast('Product updated successfully! Changes reflected across store.');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.productId !== id));
    showToast(`Deleted "${prod?.name || 'Product'}" from store.`, 'warning');
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    showToast('Stock inventory updated successfully.');
  };

  // Category Operations
  const addCategory = (cat: CategoryInfo) => {
    setCategories((prev) => [...prev, cat]);
    showToast(`Category "${cat.name}" added successfully.`);
  };

  const updateCategory = (id: ProductCategory, updates: Partial<CategoryInfo>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Category updated.');
  };

  const deleteCategory = (id: ProductCategory) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category removed.', 'warning');
  };

  // Cart Operations
  const addToCart = (product: Product, selectedWeight?: string, quantity: number = 1) => {
    const weightToUse = selectedWeight || product.weight;
    const matchingOption = product.weightOptions?.find((w) => w.weight === weightToUse);
    const unitPrice = matchingOption ? matchingOption.price : product.price;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.selectedWeight === weightToUse
      );

      if (existingItemIndex > -1) {
        const updated = [...prevCart];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart-${product.id}-${weightToUse}-${Date.now()}`,
          productId: product.id,
          product,
          selectedWeight: weightToUse,
          unitPrice,
          quantity
        };
        return [...prevCart, newItem];
      }
    });

    const localizedTitle = language === 'mr' ? (product.nameMr || product.name) : language === 'hi' ? (product.nameHi || product.name) : product.name;
    showToast(`Added ${quantity}x "${localizedTitle}" (${weightToUse}) to cart!`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart.', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist!');
        return [...prev, productId];
      }
    });
  };

  // Orders Operations
  const createOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'timeline'>): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `JGU-${randomNum}`;
    const now = new Date();
    const dateString = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      orderDate: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes()}`,
      timeline: [
        { status: 'Pending', timestamp: dateString, description: 'Order placed by customer and logged', completed: true },
        { status: 'Confirmed', timestamp: 'Pending', description: 'Order verified by Jijamata SHG office', completed: false },
        { status: 'Preparing', timestamp: 'Pending', description: 'Fresh preparation & weighing in Nashik kitchen', completed: false },
        { status: 'Packed', timestamp: 'Pending', description: 'Sealed in airtight packaging', completed: false },
        { status: 'Out for Delivery', timestamp: 'Pending', description: 'Dispatched with courier service', completed: false },
        { status: 'Delivered', timestamp: 'Pending', description: 'Package handed over with gratitude', completed: false }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedOffer(null);
    setSelectedOrderId(newOrderId);

    // Also update or add to customers list
    setCustomers((prev) => {
      const existing = prev.find((c) => c.phone === orderData.customerPhone || c.email === orderData.customerEmail);
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                ordersCount: c.ordersCount + 1,
                totalSpent: c.totalSpent + orderData.total,
                lastOrderDate: now.toISOString().split('T')[0]
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: orderData.customerName,
          email: orderData.customerEmail,
          phone: orderData.customerPhone,
          city: orderData.address.city,
          district: orderData.address.district,
          ordersCount: 1,
          totalSpent: orderData.total,
          lastOrderDate: now.toISOString().split('T')[0],
          status: 'New'
        };
        return [newCust, ...prev];
      }
    });

    showToast(`Order ${newOrderId} placed successfully!`);
    return newOrderId;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, customDesc?: string) => {
    const statusOrder: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'];
    const targetIndex = statusOrder.indexOf(newStatus);
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map((event) => {
            const eventIndex = statusOrder.indexOf(event.status);
            if (newStatus === 'Cancelled') {
              return { ...event, completed: false };
            }
            if (event.status === newStatus) {
              return {
                ...event,
                timestamp: timeStr,
                description: customDesc || event.description,
                completed: true
              };
            }
            if (eventIndex !== -1 && targetIndex !== -1) {
              return {
                ...event,
                completed: eventIndex <= targetIndex
              };
            }
            return event;
          });

          return {
            ...ord,
            status: newStatus,
            timeline: updatedTimeline
          };
        }
        return ord;
      })
    );

    showToast(`Order ${orderId} status updated to: ${newStatus}`);
  };

  // Coupons
  const applyCouponCode = (code: string, currentSubtotal: number) => {
    const foundOffer = offers.find(
      (o) => o.code.toUpperCase() === code.trim().toUpperCase() && o.isActive
    );
    if (!foundOffer) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (currentSubtotal < foundOffer.minOrderValue) {
      return {
        success: false,
        message: `Minimum order value for ${foundOffer.code} is ₹${foundOffer.minOrderValue}.`
      };
    }
    setAppliedOffer(foundOffer);
    showToast(`Coupon "${foundOffer.code}" applied! ${foundOffer.discountPercent}% OFF`);
    return { success: true, message: `Coupon applied: ${foundOffer.title}` };
  };

  const removeCouponCode = () => {
    setAppliedOffer(null);
    showToast('Coupon removed.', 'info');
  };

  const addOffer = (newOff: Omit<Offer, 'id'>) => {
    const offer: Offer = { ...newOff, id: `offer-${Date.now()}` };
    setOffers((prev) => [offer, ...prev]);
    showToast(`Coupon "${offer.code}" created.`);
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    if (appliedOffer?.id === id) setAppliedOffer(null);
    showToast('Offer deleted.', 'info');
  };

  const toggleOfferStatus = (id: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              isActive: !o.isActive,
              active: !o.isActive
            }
          : o
      )
    );
    showToast('Offer status updated.');
  };

  // Reviews
  const addReview = (rev: Omit<Review, 'id' | 'date'>) => {
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;
    const newRev: Review = { ...rev, id: `rev-${Date.now()}`, date: dateStr };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you for your feedback! Review submitted.');
  };

  const toggleReviewStatus = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'Approved' ? 'Hidden' : 'Approved' } : r
      )
    );
    showToast('Review visibility updated.');
  };

  // Messages
  const addMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newMsg: ContactMessage = { ...msg, id: `msg-${Date.now()}`, date: dateStr, status: 'New' };
    setMessages((prev) => [newMsg, ...prev]);
    showToast('Message sent to Jijamata Gruh Udyog office!');
  };

  const updateMessageStatus = (id: string, status: ContactMessage['status']) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    showToast(`Message marked as ${status}`);
  };

  // Auth (Mock)
  const customerLogin = (data: { name: string; phone: string; email?: string; city?: string }) => {
    const user = {
      name: data.name || 'Customer',
      phone: data.phone || '+91 98220 44521',
      email: data.email || 'customer@gmail.com',
      city: data.city || 'Nashik'
    };
    setCustomerUser(user);
    showToast(`Welcome back, ${user.name}!`);
    navigateTo('customer-dashboard');
  };

  const customerLogout = () => {
    setCustomerUser(null);
    showToast('Logged out of customer account.', 'info');
    navigateTo('home');
  };

  const loginCustomer = (emailOrPhone: string, name?: string) => {
    customerLogin({
      name: name || 'Sunita Ranade',
      phone: emailOrPhone.includes('@') ? '+91 98230 44521' : emailOrPhone,
      email: emailOrPhone.includes('@') ? emailOrPhone : 'sunita.ranade@gmail.com',
      city: 'Nashik'
    });
  };

  const logoutCustomer = () => {
    customerLogout();
  };

  const adminLogin = (username: string) => {
    setAdminUser({
      name: 'Sunita Patil (SHG Coordinator)',
      role: 'Head Coordinator, Nashik',
      username: username || 'admin'
    });
    setRoleState('admin');
    setCurrentPageState('admin-dashboard');
    showToast('Welcome to Jijamata Admin Management Portal!');
  };

  const adminLogout = () => {
    setAdminUser(null);
    setRoleState('customer');
    setCurrentPageState('home');
    showToast('Logged out of Admin Portal.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        selectedProductId,
        selectedOrderId,
        role,
        language,
        searchQuery,
        setSearchQuery,
        setLanguage,
        setRole,
        navigateTo,
        t,

        products,
        addProduct,
        updateProduct,
        updateProductStock,
        deleteProduct,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,

        orders,
        createOrder,
        updateOrderStatus,

        offers,
        appliedOffer,
        applyCouponCode,
        removeCouponCode,
        addOffer,
        deleteOffer,
        toggleOfferStatus,

        reviews,
        addReview,
        toggleReviewStatus,
        messages,
        addMessage,
        updateMessageStatus,

        customers,

        customerUser,
        adminUser,
        customerLogin,
        customerLogout,
        loginCustomer,
        logoutCustomer,
        adminLogin,
        adminLogout,

        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
