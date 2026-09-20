export interface CartItem {
  productId: string;
  name: string;
  vendor: string;
  weight: string;
  price: number;
  qty: number;
  image: string;
}

const CART_KEY = "gg-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product: Omit<CartItem, "qty">, qty = 1) {
  const items = getCart();
  const idx = items.findIndex((i) => i.productId === product.productId);
  if (idx >= 0) {
    items[idx].qty += qty;
  } else {
    items.push({ ...product, qty });
  }
  saveCart(items);
}

export function updateQty(productId: string, qty: number) {
  let items = getCart();
  if (qty <= 0) {
    items = items.filter((i) => i.productId !== productId);
  } else {
    items = items.map((i) => (i.productId === productId ? { ...i, qty } : i));
  }
  saveCart(items);
}

export function removeFromCart(productId: string) {
  const items = getCart().filter((i) => i.productId !== productId);
  saveCart(items);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
