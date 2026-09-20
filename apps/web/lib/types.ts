// ── Auth ──
export interface AuthResponse {
  user: {
    id: string;
    fullName: string;
    phone: string;
    role: string;
    shop?: { id: string; slug: string; name: string } | null;
  };
  accessToken: string;
  refreshToken: string;
}

// ── User ──
export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: "BUYER" | "SELLER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  avatarUrl: string | null;
  createdAt: string;
  shop?: Shop | null;
}

// ── Category ──
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  sortOrder: number;
  children?: Category[];
  _count?: { products: number };
}

// ── Shop ──
export interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  address: string | null;
  since: string | null;
  verified: boolean;
  status: string;
  ratingAvg: number;
  reviewCount: number;
  region: { id: string; name: string } | null;
  city: { id: string; name: string } | null;
  tags: { id: string; name: string }[];
  subscription: {
    status: string;
    plan: { code: string; name: string };
  } | null;
  _count?: { products: number };
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
  badge: string | null;
  featured: boolean;
  ratingAvg: number;
  reviewCount: number;
  viewCount: number;
  createdAt: string;
  category: Category;
  shop: Shop;
  images: ProductImage[];
  priceOptions: PriceOption[];
  reviews?: Review[];
}

export interface ProductListResponse {
  data: Product[];
  meta: { page: number; limit: number; total: number; pages: number };
}

// ── Review ──
export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { fullName: string; avatarUrl: string | null };
}

// ── Order ──
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: { id: string; slug: string; images: { url: string }[] };
}

export interface Order {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  note: string | null;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  subtotal: number;
  total: number;
  items: OrderItem[];
  history: { status: string; note: string | null; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  data: Order[];
  meta: { total: number; page: number; limit: number; pages: number };
}

// ── Seller ──
export interface SellerDashboard {
  productCount: number;
  activeProducts: number;
  orderCount: number;
  totalRevenue: number;
  // legacy compat keys used by existing dashboard UI
  revenueMonth: number;
  ordersCount: number;
  ratingAverage: number;
}

// ── Favorite ──
export interface Favorite {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  unit: string;
  status: string;
  images: { url: string }[];
  shop: { name: string; slug: string };
}

// ── Subscription ──
export interface Subscription {
  id: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  plan: { code: string; name: string };
  startDate: string;
  endDate: string | null;
}

// ── Support ──
export interface SupportTicket {
  id: string;
  name: string;
  contact: string;
  subject: string;
  message: string;
}

// ── Geo ──
export interface Region {
  id: string;
  name: string;
  slug: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
}

// ── Plan ──
export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceMonthly: number;
  maxProducts: number;
  canBeVerified: boolean;
  canBeFeatured: boolean;
  sortOrder: number;
}

// ── DeliveryZone (legacy compat kept for dashboard build) ──
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
