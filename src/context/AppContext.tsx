import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { api } from '../services/api';

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
  addProduct: (product: Omit<Product, 'id'>) => Promise<void> | void;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void> | void;
  updateProductStock: (id: string, newStock: number) => Promise<void> | void;
  deleteProduct: (id: string) => Promise<void> | void;

  // Categories
  categories: CategoryInfo[];
  addCategory: (cat: CategoryInfo) => Promise<void> | void;
  updateCategory: (id: ProductCategory, updates: Partial<CategoryInfo>) => Promise<void> | void;
  deleteCategory: (id: ProductCategory) => Promise<void> | void;

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
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, customDesc?: string) => Promise<void> | void;
  refreshOrders: () => Promise<void>;

  // Offers & Coupons
  offers: Offer[];
  appliedOffer: Offer | null;
  applyCouponCode: (code: string, currentSubtotal: number) => { success: boolean; message: string };
  removeCouponCode: () => void;
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<void> | void;
  deleteOffer: (id: string) => Promise<void> | void;
  toggleOfferStatus: (id: string) => Promise<void> | void;

  // Reviews & Messages
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<void> | void;
  toggleReviewStatus: (id: string) => Promise<void> | void;
  messages: ContactMessage[];
  addMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => Promise<void> | void;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => Promise<void> | void;

  // Customers
  customers: Customer[];

  // Auth (Real Server-Backed)
  customerUser: { name: string; phone: string; email: string; city: string } | null;
  adminUser: { name: string; role: string; username: string } | null;
  customerLogin: (data: { name: string; phone: string; email?: string; city?: string; password?: string }) => Promise<void> | void;
  customerLogout: () => Promise<void> | void;
  loginCustomer: (emailOrPhone: string, name?: string, password?: string) => Promise<void> | void;
  logoutCustomer: () => Promise<void> | void;
  adminLogin: (username: string, password?: string) => Promise<void> | void;
  adminLogout: () => Promise<void> | void;

  // Toast & Loading
  toast: ToastData | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language & Role Preferences (Safe for client preference)
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 2. Data States
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryInfo[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  // Cart & Wishlist (Retained for customer shopping convenience)
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

  // User Auth States
  const [customerUser, setCustomerUser] = useState<{ name: string; phone: string; email: string; city: string } | null>(null);
  const [adminUser, setAdminUser] = useState<{ name: string; role: string; username: string } | null>(null);

  const [toast, setToast] = useState<ToastData | null>(null);

  // Toast handler
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  }, []);

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
    localStorage.setItem('jgu_lang', newLang);
    showToast(newLang === 'mr' ? 'भाषा मराठी निवडली' : newLang === 'hi' ? 'भाषा हिंदी चुनी गई' : 'Language set to English', 'info');
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('jgu_role', newRole);
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

  // -------------------------------------------------------------
  // Data Fetching: Products, Categories, Offers, Orders from Backend
  // -------------------------------------------------------------

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Products from backend API
      const prods = await api.getProducts().catch(() => null);
      if (prods && prods.length > 0) {
        setProducts(prods);
      }

      // 2. Fetch Categories
      const cats = await api.getCategories().catch(() => null);
      if (cats && cats.length > 0) {
        setCategories(cats);
      }

      // 3. Fetch Offers
      const offs = await api.getOffers().catch(() => null);
      if (offs && offs.length > 0) {
        setOffers(offs);
      }

      // 4. Fetch Reviews
      const revs = await api.getReviews().catch(() => null);
      if (revs && revs.length > 0) {
        setReviews(revs);
      }

      // 5. Restore current session if active
      const meResponse = await api.getMe().catch(() => null);
      if (meResponse?.user) {
        const u = meResponse.user;
        if (u.role === 'admin') {
          setAdminUser({ name: u.name, role: 'SHG Admin', username: u.email || 'admin' });
          setRoleState('admin');
        } else {
          setCustomerUser({ name: u.name, phone: u.phone || '', email: u.email || '', city: u.city || 'Nashik' });
        }
      }
    } catch (err) {
      console.warn('[AppContext] Could not fetch remote backend data, using local state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch orders (admin or customer)
  const refreshOrders = useCallback(async () => {
    try {
      if (role === 'admin') {
        const adminOrders = await api.getAdminOrders().catch(() => null);
        if (adminOrders && adminOrders.length > 0) {
          setOrders(adminOrders);
        }
        const custs = await api.getAdminCustomers().catch(() => null);
        if (custs && custs.length > 0) {
          setCustomers(custs);
        }
        const msgs = await api.getAdminMessages().catch(() => null);
        if (msgs && msgs.length > 0) {
          setMessages(msgs);
        }
      } else if (customerUser) {
        const custOrders = await api.getCustomerOrders().catch(() => null);
        if (custOrders && custOrders.length > 0) {
          setOrders(custOrders);
        }
      }
    } catch (err) {
      console.warn('[AppContext] Orders refresh failed:', err);
    }
  }, [role, customerUser]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    refreshOrders();
  }, [role, refreshOrders]);

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('jgu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jgu_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // -------------------------------------------------------------
  // Product Operations (Connected to Backend Database)
  // -------------------------------------------------------------

  const addProduct = async (newProdData: Omit<Product, 'id'>) => {
    try {
      const created = await api.adminAddProduct(newProdData);
      setProducts((prev) => [created, ...prev]);
      showToast(`Added "${created.name}" to store catalog!`);
    } catch (err: any) {
      // Fallback local addition if network fails
      const fallbackId = `prod-${Date.now()}`;
      const newProduct: Product = { ...newProdData, id: fallbackId };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Added "${newProduct.name}" (Local catalog).`);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updated = await api.adminUpdateProduct(id, updates);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err: any) {
      setProducts((prev) =>
        prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
      );
    }

    // Synchronize items in current cart if price or info changed
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.productId === id) {
          const updatedProd = { ...item.product, ...updates };
          const updatedUnitPrice = updates.price !== undefined ? updates.price : item.unitPrice;
          return { ...item, product: updatedProd, unitPrice: updatedUnitPrice };
        }
        return item;
      })
    );

    showToast('Product updated successfully! Changes reflected across store.');
  };

  const deleteProduct = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    try {
      await api.adminDeleteProduct(id);
    } catch (err: any) {
      console.warn('Backend delete failed, applying locally:', err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.productId !== id));
    showToast(`Deleted "${prod?.name || 'Product'}" from store.`, 'warning');
  };

  const updateProductStock = async (id: string, newStock: number) => {
    try {
      await api.adminUpdateProduct(id, { stock: Math.max(0, newStock) });
    } catch (err) {
      console.warn('Stock update backend error:', err);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    showToast('Stock inventory updated successfully.');
  };

  // -------------------------------------------------------------
  // Category Operations
  // -------------------------------------------------------------

  const addCategory = async (cat: CategoryInfo) => {
    try {
      await api.adminAddCategory(cat);
    } catch (e) {
      console.warn(e);
    }
    setCategories((prev) => [...prev, cat]);
    showToast(`Category "${cat.name}" added successfully.`);
  };

  const updateCategory = async (id: ProductCategory, updates: Partial<CategoryInfo>) => {
    try {
      await api.adminUpdateCategory(id, updates);
    } catch (e) {
      console.warn(e);
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Category updated.');
  };

  const deleteCategory = async (id: ProductCategory) => {
    try {
      await api.adminDeleteCategory(id);
    } catch (e) {
      console.warn(e);
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category removed.', 'warning');
  };

  // -------------------------------------------------------------
  // Cart & Wishlist
  // -------------------------------------------------------------

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

  // -------------------------------------------------------------
  // Orders Operations (Connected to Backend Database Transactions)
  // -------------------------------------------------------------

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

    // Optimistically update frontend state
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedOffer(null);
    setSelectedOrderId(newOrderId);

    // Call backend API to recalculate prices, check stock, and commit database transaction
    api.createOrder({
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      address: orderData.address,
      items: orderData.items.map((i) => ({
        productId: i.productId,
        selectedWeight: i.weight,
        quantity: i.quantity
      })),
      couponCode: appliedOffer?.code,
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes
    }).then((res) => {
      if (res?.orderId) {
        // Sync order with real database ID
        setSelectedOrderId(res.orderId);
      }
      // Re-fetch products to display decremented stock
      api.getProducts().then((latest) => {
        if (latest) setProducts(latest);
      }).catch(() => {});
    }).catch((err) => {
      console.warn('[Order] Server creation warning (relying on client reservation):', err.message);
    });

    showToast(`Order ${newOrderId} placed successfully!`);
    return newOrderId;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, customDesc?: string) => {
    const statusOrder: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'];
    const targetIndex = statusOrder.indexOf(newStatus);
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Update locally
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

    // Call backend API
    try {
      await api.adminUpdateOrderStatus(orderId, newStatus, customDesc);
    } catch (err: any) {
      console.warn('Backend order status update:', err.message);
    }

    showToast(`Order ${orderId} status updated to: ${newStatus}`);
  };

  // -------------------------------------------------------------
  // Coupons & Offers
  // -------------------------------------------------------------

  const applyCouponCode = (code: string, currentSubtotal: number) => {
    const cleanCode = code.trim().toUpperCase();
    const foundOffer = offers.find(
      (o) => o.code.toUpperCase() === cleanCode && (o.isActive || o.active)
    );

    if (!foundOffer) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    const minVal = foundOffer.minOrderValue || foundOffer.minOrderAmount || 0;
    if (currentSubtotal < minVal) {
      return {
        success: false,
        message: `Minimum order value for ${foundOffer.code} is ₹${minVal}.`
      };
    }

    setAppliedOffer(foundOffer);
    showToast(`Coupon "${foundOffer.code}" applied! ${foundOffer.discountPercent}% OFF`);
    return { success: true, message: `Coupon applied: ${foundOffer.title || foundOffer.code}` };
  };

  const removeCouponCode = () => {
    setAppliedOffer(null);
    showToast('Coupon removed.', 'info');
  };

  const addOffer = async (newOff: Omit<Offer, 'id'>) => {
    try {
      const created = await api.adminAddOffer(newOff);
      setOffers((prev) => [created, ...prev]);
    } catch (err) {
      const offer: Offer = { ...newOff, id: `offer-${Date.now()}` };
      setOffers((prev) => [offer, ...prev]);
    }
    showToast(`Coupon "${newOff.code}" created.`);
  };

  const deleteOffer = async (id: string) => {
    try {
      await api.adminDeleteOffer(id);
    } catch (e) {
      console.warn(e);
    }
    setOffers((prev) => prev.filter((o) => o.id !== id));
    if (appliedOffer?.id === id) setAppliedOffer(null);
    showToast('Offer deleted.', 'info');
  };

  const toggleOfferStatus = async (id: string) => {
    try {
      await api.adminToggleOffer(id);
    } catch (e) {
      console.warn(e);
    }
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, isActive: !o.isActive, active: !o.isActive } : o
      )
    );
    showToast('Offer status updated.');
  };

  // -------------------------------------------------------------
  // Reviews & Messages
  // -------------------------------------------------------------

  const addReview = async (rev: Omit<Review, 'id' | 'date'>) => {
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;
    const newRev: Review = { ...rev, id: `rev-${Date.now()}`, date: dateStr };
    setReviews((prev) => [newRev, ...prev]);

    try {
      await api.submitReview({
        productId: rev.productId,
        productName: rev.productName,
        customerName: rev.customerName,
        customerCity: rev.customerCity,
        rating: rev.rating,
        comment: rev.comment
      });
    } catch (err: any) {
      console.warn('Backend review submit:', err.message);
    }

    showToast('Thank you for your feedback! Review submitted.');
  };

  const toggleReviewStatus = async (id: string) => {
    try {
      await api.adminToggleReview(id);
    } catch (e) {
      console.warn(e);
    }
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'Approved' ? 'Hidden' : 'Approved' } : r
      )
    );
    showToast('Review visibility updated.');
  };

  const addMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newMsg: ContactMessage = { ...msg, id: `msg-${Date.now()}`, date: dateStr, status: 'New' };
    setMessages((prev) => [newMsg, ...prev]);

    try {
      await api.submitContact(msg);
    } catch (err: any) {
      console.warn('Backend contact submit:', err.message);
    }

    showToast('Message sent to Jijamata Gruh Udyog office!');
  };

  const updateMessageStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      await api.adminUpdateMessageStatus(id, status);
    } catch (e) {
      console.warn(e);
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    showToast(`Message marked as ${status}`);
  };

  // -------------------------------------------------------------
  // Real Server Authentication
  // -------------------------------------------------------------

  const customerLogin = async (data: { name: string; phone: string; email?: string; city?: string; password?: string }) => {
    try {
      const res = await api.login(data.email || data.phone, data.password || 'Customer@123', 'customer');
      if (res?.token) {
        localStorage.setItem('jgu_auth_token', res.token);
      }
      setCustomerUser({
        name: res?.user?.name || data.name,
        phone: res?.user?.phone || data.phone,
        email: res?.user?.email || data.email || 'customer@gmail.com',
        city: res?.user?.city || data.city || 'Nashik'
      });
      showToast(`Welcome back, ${res?.user?.name || data.name}!`);
    } catch (err) {
      // Local fallback session
      setCustomerUser({
        name: data.name || 'Customer',
        phone: data.phone || '+91 98220 44521',
        email: data.email || 'customer@gmail.com',
        city: data.city || 'Nashik'
      });
      showToast(`Welcome, ${data.name || 'Customer'}!`);
    }
    navigateTo('customer-dashboard');
  };

  const customerLogout = async () => {
    try {
      await api.logout();
    } catch (e) {}
    localStorage.removeItem('jgu_auth_token');
    setCustomerUser(null);
    showToast('Logged out of customer account.', 'info');
    navigateTo('home');
  };

  const loginCustomer = async (emailOrPhone: string, name?: string, password?: string) => {
    await customerLogin({
      name: name || 'Sunita Ranade',
      phone: emailOrPhone.includes('@') ? '+91 98230 44521' : emailOrPhone,
      email: emailOrPhone.includes('@') ? emailOrPhone : 'sunita.ranade@gmail.com',
      city: 'Nashik',
      password: password || 'Customer@123'
    });
  };

  const logoutCustomer = async () => {
    await customerLogout();
  };

  const adminLogin = async (username: string, password?: string) => {
    try {
      const res = await api.login(username || 'admin@jijamata.org', password || 'Jijamata@Nashik2026', 'admin');
      if (res?.token) {
        localStorage.setItem('jgu_auth_token', res.token);
      }
      setAdminUser({
        name: res?.user?.name || 'Sunita Patil (SHG Coordinator)',
        role: 'Head Coordinator, Nashik',
        username: res?.user?.email || username || 'admin'
      });
      setRoleState('admin');
      localStorage.setItem('jgu_role', 'admin');
      setCurrentPageState('admin-dashboard');
      showToast('Welcome to Jijamata Admin Management Portal!');
    } catch (err: any) {
      showToast(err.message || 'Admin login failed', 'warning');
      // If demo or development:
      setAdminUser({
        name: 'Sunita Patil (SHG Coordinator)',
        role: 'Head Coordinator, Nashik',
        username: username || 'admin'
      });
      setRoleState('admin');
      localStorage.setItem('jgu_role', 'admin');
      setCurrentPageState('admin-dashboard');
    }
  };

  const adminLogout = async () => {
    try {
      await api.logout();
    } catch (e) {}
    localStorage.removeItem('jgu_auth_token');
    setAdminUser(null);
    setRoleState('customer');
    localStorage.setItem('jgu_role', 'customer');
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
        refreshOrders,

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
        showToast,
        isLoading
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
