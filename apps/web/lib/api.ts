import type {
  AuthResponse,
  Category,
  DeliveryZone,
  Favorite,
  Order,
  OrderListResponse,
  Product,
  ProductListResponse,
  Review,
  SellerDashboard,
  Shop,
  Subscription,
  User,
  Region,
  Plan,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// ── Helpers ──

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gg-token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      Array.isArray(body.message) ? body.message.join(", ") : body.message || `Erreur ${res.status}`
    );
  }
  const json = await res.json();
  // API wraps responses in { data: ... }
  return json.data !== undefined ? json.data : json;
}

// ── Auth ──

export async function register(data: {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  role?: string;
  shopName?: string;
}): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (typeof window !== "undefined") {
    localStorage.setItem("gg-token", result.accessToken);
    localStorage.setItem("gg-refresh", result.refreshToken);
    localStorage.setItem("gg-user", JSON.stringify(result.user));
  }
  return result;
}

export async function login(data: { phone: string; password: string }): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (typeof window !== "undefined") {
    localStorage.setItem("gg-token", result.accessToken);
    localStorage.setItem("gg-refresh", result.refreshToken);
    localStorage.setItem("gg-user", JSON.stringify(result.user));
  }
  return result;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await request("/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function logout() {
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem("gg-refresh") : null;
  if (refreshToken) {
    await request("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("gg-token");
    localStorage.removeItem("gg-refresh");
    localStorage.removeItem("gg-user");
  }
}

export async function getMe(): Promise<User> {
  return request<User>("/auth/me");
}

// ── Geo ──

export async function listRegions(): Promise<Region[]> {
  return request<Region[]>("/geo/regions");
}

// ── Categories ──

export async function listCategories(): Promise<Category[]> {
  return request<Category[]>("/categories");
}

export async function getCategory(slug: string): Promise<Category> {
  return request<Category>(`/categories/${slug}`);
}

// ── Products ──

export async function listProducts(params?: {
  search?: string;
  categoryId?: string;
  shopSlug?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "rating";
}): Promise<ProductListResponse> {
  const query = new URLSearchParams();
  if (params) {
    if (params.search) query.set("search", params.search);
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.shopSlug) query.set("shopSlug", params.shopSlug);
    if (params.featured !== undefined) query.set("featured", String(params.featured));
    if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
    if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.sort) query.set("sort", params.sort);
  }
  return request<ProductListResponse>(`/products?${query}`);
}

export async function getProduct(slug: string): Promise<Product> {
  return request<Product>(`/products/${slug}`);
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const product = await getProduct(slug);
  const related = await listProducts({
    categoryId: product.category.id,
    limit: 4,
  });
  return related.data.filter((p) => p.slug !== slug).slice(0, 3);
}

// ── Shops ──

export async function listShops(params?: {
  regionId?: string;
  verified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Shop[]; meta: { total: number; page: number; limit: number; pages: number } }> {
  const query = new URLSearchParams();
  if (params) {
    if (params.regionId) query.set("regionId", params.regionId);
    if (params.verified !== undefined) query.set("verified", String(params.verified));
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
  }
  return request<{ data: Shop[]; meta: { total: number; page: number; limit: number; pages: number } }>(
    `/shops?${query}`
  );
}

export async function getShop(slug: string): Promise<Shop> {
  return request<Shop>(`/shops/${slug}`);
}

// ── Orders ──

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  note?: string;
  items: { productId: string; quantity: number; priceOptionId?: string }[];
}): Promise<Order> {
  return request<Order>("/orders", { method: "POST", body: JSON.stringify(data) });
}

// Legacy compat aliases
export const checkout = createOrder;
export const quickOrder = createOrder;

export async function trackOrder(code: string, phone?: string): Promise<Order> {
  const q = phone ? `?phone=${encodeURIComponent(phone)}` : "";
  return request<Order>(`/orders/track/${code}${q}`);
}

export async function listMyOrders(params?: {
  page?: number;
  limit?: number;
}): Promise<OrderListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  return request<OrderListResponse>(`/orders/me?${query}`);
}

export async function getSellerOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<OrderListResponse> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  return request<OrderListResponse>(`/orders/shop?${query}`);
}

export async function updateOrderStatus(
  id: string,
  status: string,
  note?: string
): Promise<Order> {
  return request<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, note }),
  });
}

// ── Reviews ──

export async function getReviews(productId: string, page = 1): Promise<{ data: Review[]; meta: { total: number } }> {
  return request(`/reviews/product/${productId}?page=${page}`);
}

export async function createReview(data: {
  productId: string;
  rating: number;
  comment?: string;
}): Promise<Review> {
  return request<Review>("/reviews", { method: "POST", body: JSON.stringify(data) });
}

// ── Favorites ──

export async function listFavorites(): Promise<Favorite[]> {
  return request<Favorite[]>("/favorites");
}

export async function toggleFavorite(productId: string): Promise<{ favorited: boolean }> {
  return request<{ favorited: boolean }>(`/favorites/${productId}`, { method: "POST" });
}

export async function checkFavorite(productId: string): Promise<{ favorited: boolean }> {
  return request<{ favorited: boolean }>(`/favorites/${productId}`);
}

// Legacy compat
export async function addFavorite(productId: string) {
  return toggleFavorite(productId);
}
export async function removeFavorite(productId: string) {
  return toggleFavorite(productId);
}

// ── Seller dashboard ──

export async function registerSeller(data: {
  fullName: string;
  shopName: string;
  phone: string;
  password: string;
  email?: string;
  region?: string;
  city?: string;
}): Promise<AuthResponse> {
  return register({ ...data, role: "SELLER" });
}

export async function getSellerDashboard(): Promise<SellerDashboard> {
  const stats = await request<{
    productCount: number;
    activeProducts: number;
    orderCount: number;
    totalRevenue: number;
  }>("/shops/me/stats");
  // Map to legacy SellerDashboard shape expected by existing UI
  return {
    ...stats,
    revenueMonth: stats.totalRevenue,
    ordersCount: stats.orderCount,
    ratingAverage: 0,
  };
}

export async function getSellerProducts(params?: { page?: number; limit?: number }): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const res = await request<ProductListResponse>(`/products/mine?${query}`);
  return res.data ?? [];
}

export async function createSellerProduct(data: {
  name: string;
  categoryId: string;
  basePrice: number;
  unit: string;
  stock: number;
  description?: string;
}): Promise<Product> {
  return request<Product>("/products", { method: "POST", body: JSON.stringify(data) });
}

export async function updateSellerProduct(id: string, data: Partial<{
  name: string;
  description: string;
  basePrice: number;
  unit: string;
  stock: number;
  status: string;
}>): Promise<Product> {
  return request<Product>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteSellerProduct(id: string): Promise<void> {
  await request(`/products/${id}`, { method: "DELETE" });
}

export async function getSellerStats(): Promise<{
  revenue: number;
  averageBasket: number;
  productViews: number;
  conversionRate: number;
}> {
  const stats = await request<{
    productCount: number;
    activeProducts: number;
    orderCount: number;
    totalRevenue: number;
  }>("/shops/me/stats");
  return {
    revenue: stats.totalRevenue,
    averageBasket: stats.orderCount > 0 ? Math.round(stats.totalRevenue / stats.orderCount) : 0,
    productViews: 0,
    conversionRate: 0,
  };
}

// Delivery zones are not used in the new backend — return empty for compat
export async function getSellerDeliveryZones(): Promise<DeliveryZone[]> {
  return [];
}
export async function createDeliveryZone(): Promise<DeliveryZone> {
  throw new Error("Non disponible");
}
export async function toggleDeliveryZone(): Promise<DeliveryZone> {
  throw new Error("Non disponible");
}

// ── Seller shop ──

export async function getMyShop(): Promise<Shop> {
  return request<Shop>("/shops/me");
}

export async function updateMyShop(data: {
  name?: string;
  description?: string;
  phone?: string;
  regionId?: string;
  cityId?: string;
  address?: string;
  since?: string;
}): Promise<Shop> {
  return request<Shop>("/shops/me", { method: "PATCH", body: JSON.stringify(data) });
}

// ── Plans ──

export async function listPlans(): Promise<Plan[]> {
  return request<Plan[]>("/plans");
}

// ── Support ──

export async function createSupportTicket(data: {
  name: string;
  contact: string;
  subject: string;
  message: string;
}): Promise<void> {
  await request("/support/tickets", { method: "POST", body: JSON.stringify(data) });
}

// ── Settings ──

export async function getSiteSettings(): Promise<Record<string, string>> {
  return request<Record<string, string>>("/settings");
}

// ── Upload ──

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const token = getToken();
  const res = await fetch(`${API_BASE}/upload/image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error("Échec de l'upload");
  const json = await res.json();
  return json.data ?? json;
}

// ── Admin ──

export async function getAdminStats(): Promise<{
  totalUsers: number;
  totalSellers: number;
  totalOrders: number;
  ordersThisMonth: number;
  gmv: number;
  gmvThisMonth: number;
  pendingShops: number;
}> {
  return request("/shops/admin/stats");
}

export async function getAdminPendingShops(page = 1, limit = 20): Promise<{
  data: Array<{ id: string; name: string; slug: string; verified: boolean; status: string; createdAt: string; region: { name: string } | null; user: { fullName: string; phone: string } }>;
  meta: { total: number; page: number; limit: number; pages: number };
}> {
  return request(`/shops/admin/pending?page=${page}&limit=${limit}`);
}

export async function adminVerifyShop(id: string): Promise<void> {
  await request(`/shops/${id}/verify`, { method: "POST" });
}

export async function adminSuspendShop(id: string): Promise<void> {
  await request(`/shops/${id}/suspend`, { method: "POST" });
}

// ── Notifications ──

export async function getNotifications(unreadOnly = false) {
  return request(`/notifications${unreadOnly ? "?unread=true" : ""}`);
}

export async function getUnreadCount(): Promise<{ count: number }> {
  return request("/notifications/unread-count");
}

// Alias used by site-header
export const getNotificationCount = getUnreadCount;

export async function markNotificationRead(id: string) {
  return request(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead() {
  return request("/notifications/read-all", { method: "PATCH" });
}
