export type Language = 'en' | 'mr' | 'hi';

export type Role = 'customer' | 'admin';

export type ProductCategory = 'Papad' | 'Achar' | 'Chakli' | 'Laddus' | 'Masala';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface ProductWeightOption {
  weight: string; // e.g. "250g", "500g", "1kg"
  price: number;
  discountPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number;
  image: string;
  description: string;
  descriptionMr?: string;
  descriptionHi?: string;
  ingredients: string[];
  weight: string; // default displayed weight
  weightOptions: ProductWeightOption[];
  stock: number;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  available: boolean;
  shelfLife: string;
  spicinessLevel?: 'Mild' | 'Medium' | 'Spicy';
  madeBy: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedWeight: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  weight: string;
  price: number;
  quantity: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. "JGU-8942"
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
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'UPI' | 'Card';
  paymentStatus: 'Pending' | 'Paid';
  status: OrderStatus;
  orderDate: string;
  createdAt?: string; // alias for orderDate
  estimatedDelivery: string;
  notes?: string;
  timeline: OrderTimelineEvent[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  joinedDate?: string;
  status: 'Active' | 'New' | 'Inactive';
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  nameMr: string;
  nameHi: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Offer {
  id: string;
  code: string;
  title?: string;
  description: string;
  discountPercent: number;
  minOrderValue?: number;
  minOrderAmount?: number;
  expiryDate?: string;
  validUntil?: string;
  isActive?: boolean;
  active?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerCity: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Hidden';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'New' | 'Read' | 'Resolved';
}

export type PageRoute = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'order-success' 
  | 'track-order' 
  | 'about' 
  | 'our-story' 
  | 'contact' 
  | 'login' 
  | 'customer-dashboard' 
  | 'admin-login' 
  | 'admin-dashboard' 
  | 'admin-products' 
  | 'admin-orders' 
  | 'admin-categories' 
  | 'admin-customers' 
  | 'admin-offers' 
  | 'admin-reviews' 
  | 'admin-messages' 
  | 'admin-settings';
