import type {
  AuthResponse,
  Category,
  DeliveryZone,
  Favorite,
  Order,
  Product,
  ProductListResponse,
  Review,
  SellerDashboard,
  Subscription,
  User,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// ── Helpers ──

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gg-token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erreur ${res.status}`);
  }
  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

// ── Auth ──

export async function register(data: { fullName: string; phone: string; email?: string; password: string; role?: string }): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) });
  localStorage.setItem("gg-token", result.accessToken);
  localStorage.setItem("gg-user", JSON.stringify(result.user));
  return result;
}

export async function login(data: { phone: string; password: string }): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) });
  localStorage.setItem("gg-token", result.accessToken);
  localStorage.setItem("gg-user", JSON.stringify(result.user));
  return result;
}

export function logout() {
  localStorage.removeItem("gg-token");
  localStorage.removeItem("gg-user");
}

export async function getMe(): Promise<User> {
  return request<User>("/auth/me");
}

// ── Catalog ──

export async function listCategories(): Promise<Category[]> {
  return request<Category[]>("/categories");
}

export async function listProducts(params?: {
  q?: string;
  category?: string;
  city?: string;
  delivery?: string;
  page?: number;
  limit?: number;
}): Promise<ProductListResponse> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") query.set(k, String(v));
    });
  }
  return request<ProductListResponse>(`/products?${query}`);
}

export async function getProduct(slug: string): Promise<Product> {
  return request<Product>(`/products/${slug}`);
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  return request<Product[]>(`/products/${slug}/related`);
}

// ── Orders ──

export async function checkout(data: {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: { productId: string; quantity: number }[];
}): Promise<Order> {
  return request<Order>("/checkout", { method: "POST", body: JSON.stringify(data) });
}

export async function quickOrder(data: {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: { productId: string; quantity: number }[];
}): Promise<Order> {
  return request<Order>("/quick-orders", { method: "POST", body: JSON.stringify(data) });
}

export async function trackOrder(code: string, phone: string): Promise<Order> {
  return request<Order>(`/orders/track?code=${code}&phone=${phone}`);
}

export async function listOrders(): Promise<Order[]> {
  return request<Order[]>("/orders");
}

export async function getOrder(id: string): Promise<Order> {
  return request<Order>(`/orders/${id}`);
}

// ── Reviews ──

export async function getReviews(productId: string): Promise<Review[]> {
  return request<Review[]>(`/products/${productId}/reviews`);
}

export async function createReview(productId: string, data: { rating: number; comment?: string }): Promise<Review> {
  return request<Review>(`/products/${productId}/reviews`, { method: "POST", body: JSON.stringify(data) });
}

// ── Favorites ──

export async function listFavorites(): Promise<Favorite[]> {
  return request<Favorite[]>("/favorites");
}

export async function addFavorite(productId: string): Promise<Favorite> {
  return request<Favorite>(`/favorites/${productId}`, { method: "POST" });
}

export async function removeFavorite(productId: string): Promise<void> {
  await request(`/favorites/${productId}`, { method: "DELETE" });
}

// ── Seller ──

export async function registerSeller(data: {
  fullName: string;
  shopName: string;
  phone: string;
  password: string;
  email?: string;
  city: string;
  region: string;
  description?: string;
}) {
  return request<AuthResponse>("/seller-register", { method: "POST", body: JSON.stringify(data) });
}

export async function getSellerDashboard(): Promise<SellerDashboard> {
  return request<SellerDashboard>("/seller/dashboard");
}

export async function getSellerProducts(): Promise<Product[]> {
  return request<Product[]>("/seller/products");
}

export async function createSellerProduct(data: {
  name: string;
  categoryId: string;
  basePrice: number;
  unit: string;
  stock: number;
  description?: string;
}): Promise<Product> {
  return request<Product>("/seller/products", { method: "POST", body: JSON.stringify(data) });
}

export async function getSellerStats(): Promise<{ revenue: number; averageBasket: number; productViews: number; conversionRate: number }> {
  return request<{ revenue: number; averageBasket: number; productViews: number; conversionRate: number }>("/seller/stats");
}

export async function getSellerDeliveryZones(): Promise<DeliveryZone[]> {
  return request<DeliveryZone[]>("/seller/delivery-zones");
}

export async function createDeliveryZone(data: Omit<DeliveryZone, "id" | "active">): Promise<DeliveryZone> {
  return request<DeliveryZone>("/seller/delivery-zones", { method: "POST", body: JSON.stringify(data) });
}

export async function toggleDeliveryZone(id: string): Promise<DeliveryZone> {
  return request<DeliveryZone>(`/seller/delivery-zones/${id}/toggle`, { method: "PATCH" });
}

// ── Subscription ──

export async function getMySubscription(): Promise<Subscription> {
  return request<Subscription>("/subscriptions/my");
}

export async function renewSubscription(): Promise<Subscription> {
  return request<Subscription>("/subscriptions/renew", { method: "POST" });
}

// ── User Profile ──

export async function updateProfile(data: { fullName?: string; email?: string }): Promise<User> {
  return request<User>("/users/me", { method: "PATCH", body: JSON.stringify(data) });
}

// ── Support ──

export async function createSupportTicket(data: {
  name: string;
  contact: string;
  subject: string;
  message: string;
}) {
  return request("/support/tickets", { method: "POST", body: JSON.stringify(data) });
}

// ── Payments ──

export async function initPayment(orderId: string): Promise<{ paymentUrl: string }> {
  return request<{ paymentUrl: string }>("/payments/dexpay/init", { method: "POST", body: JSON.stringify({ orderId }) });
}
