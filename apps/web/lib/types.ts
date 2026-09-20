// ── Auth ──
export interface AuthResponse {
  user: { id: string; phone: string; role: string };
  accessToken: string;
  refreshToken: string;
}

// ── User ──
export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: "CLIENT" | "SELLER" | "DELIVERY" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  createdAt: string;
}

// ── Category ──
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
}

// ── Product ──
export interface ProductImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface PriceOption {
  id: string;
  label: string;
  price: number;
  stock: number | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "OUT_OF_STOCK" | "SUSPENDED";
  stock: number;
  basePrice: number;
  unit: string;
  city: string;
  categoryId: string;
  sellerId: string;
  category: Category;
  seller: { id: string; shopName: string; city: string; region: string };
  images: ProductImage[];
  priceOptions?: PriceOption[];
  reviews?: Review[];
  createdAt: string;
}

export interface ProductListResponse {
  data: Product[];
  meta: { page: number; limit: number; total: number; pageCount: number };
}

// ── Review ──
export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  user: { fullName: string };
  createdAt: string;
}

// ── Order ──
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  productId: string;
}

export interface Order {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: OrderItem[];
  payment?: { status: string; provider: string };
  history?: { status: string; note: string | null; createdAt: string }[];
  createdAt: string;
}

// ── Seller ──
export interface SellerDashboard {
  revenueMonth: number;
  ordersCount: number;
  activeProducts: number;
  ratingAverage: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  region: string;
  city: string;
  fee: number;
  estimatedTime: string;
  minimumOrderAmount: number;
  active: boolean;
}

// ── Subscription ──
export interface Subscription {
  id: string;
  status: "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  amount: number;
  startDate: string;
  endDate: string;
}

// ── Favorite ──
export interface Favorite {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

// ── Support ──
export interface SupportTicket {
  id: string;
  name: string;
  contact: string;
  subject: string;
  message: string;
}
