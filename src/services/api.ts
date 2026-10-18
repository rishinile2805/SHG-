import { Product, Order, CategoryInfo, Offer, Review, ContactMessage, Customer, OrderStatus, ProductCategory } from '../types';

const API_BASE = '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = localStorage.getItem('jgu_auth_token');

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    credentials: 'include', // Include HTTP-only cookie
  };

  const response = await fetch(url, config);

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `HTTP error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string; database: string }>('/health'),

  // Auth
  register: (userData: { name: string; email?: string; phone?: string; password: string; city?: string; district?: string }) =>
    request<{ success: boolean; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (emailOrPhone: string, password: string, role?: 'customer' | 'admin') =>
    request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone, password, role }),
    }),

  logout: () =>
    request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => request<{ user: any }>('/auth/me'),

  // Products
  getProducts: (params?: { category?: string; featured?: boolean; search?: string }) =>
    request<Product[]>('/products', { params }),

  getProduct: (id: string) => request<Product>(`/products/${id}`),

  adminAddProduct: (product: Omit<Product, 'id'>) =>
    request<Product>('/products/admin', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  adminUpdateProduct: (id: string, updates: Partial<Product>) =>
    request<Product>(`/products/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  adminDeleteProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/products/admin/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategories: () => request<CategoryInfo[]>('/categories'),

  adminAddCategory: (category: CategoryInfo) =>
    request<CategoryInfo>('/categories/admin', {
      method: 'POST',
      body: JSON.stringify(category),
    }),

  adminUpdateCategory: (id: ProductCategory, updates: Partial<CategoryInfo>) =>
    request<{ success: boolean }>(`/categories/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  adminDeleteCategory: (id: ProductCategory) =>
    request<{ success: boolean }>(`/categories/admin/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  createOrder: (orderPayload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address: {
      street: string;
      landmark?: string;
      city: string;
      district: string;
      state: string;
      pincode: string;
    };
    items: Array<{ productId: string; selectedWeight: string; quantity: number }>;
    couponCode?: string;
    paymentMethod: string;
    notes?: string;
  }) =>
    request<{
      success: boolean;
      orderId: string;
      trackingHash: string;
      subtotal: number;
      deliveryCharge: number;
      discount: number;
      total: number;
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    }),

  trackOrder: (orderNumber: string) => request<Order>(`/orders/${orderNumber}`),

  getCustomerOrders: () => request<Order[]>('/orders/customer/my'),

  getAdminOrders: () => request<Order[]>('/orders/admin/all'),

  adminUpdateOrderStatus: (id: string, status: OrderStatus, customDesc?: string) =>
    request<{ success: boolean; order: Order }>(`/orders/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, customDesc }),
    }),

  // Offers
  getOffers: () => request<Offer[]>('/offers'),

  validateCoupon: (code: string, subtotal: number) =>
    request<{ success: boolean; message: string; offer: Offer; discountAmount: number }>('/offers/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),

  adminAddOffer: (offer: Omit<Offer, 'id'>) =>
    request<Offer>('/offers/admin', {
      method: 'POST',
      body: JSON.stringify(offer),
    }),

  adminToggleOffer: (id: string) =>
    request<{ success: boolean; message: string }>(`/offers/admin/${id}/status`, {
      method: 'PATCH',
    }),

  adminDeleteOffer: (id: string) =>
    request<{ success: boolean; message: string }>(`/offers/admin/${id}`, {
      method: 'DELETE',
    }),

  // Reviews
  getReviews: (productId?: string) =>
    request<Review[]>('/reviews', { params: { productId } }),

  submitReview: (review: {
    productId: string;
    productName: string;
    customerName: string;
    customerCity?: string;
    rating: number;
    comment: string;
  }) =>
    request<{ success: boolean; review: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    }),

  adminToggleReview: (id: string) =>
    request<{ success: boolean; message: string }>(`/reviews/admin/${id}/status`, {
      method: 'PATCH',
    }),

  // Contact
  submitContact: (data: { name: string; email?: string; phone: string; message: string }) =>
    request<{ success: boolean; message: string; id: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAdminMessages: () => request<ContactMessage[]>('/contact/admin'),

  adminUpdateMessageStatus: (id: string, status: 'New' | 'Read' | 'Resolved') =>
    request<{ success: boolean }>(`/contact/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Customers (Admin)
  getAdminCustomers: () => request<Customer[]>('/customers/admin'),
};
