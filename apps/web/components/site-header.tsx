"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Bell, Menu, Search, ShoppingCart, User, X, LogOut } from "lucide-react";
import { Brand } from "@/components/brand";
import { getCart } from "@/lib/cart";
import { getNotificationCount, markAllNotificationsRead, getNotifications, logout } from "@/lib/api";

interface StoredUser { fullName: string; role: string }
interface Notification { id: string; title: string; body: string; isRead: boolean; createdAt: string; link?: string | null }

const navLinks = [
  { label: "Accueil",   href: "/" },
  { label: "Produits",  href: "/catalogue" },
  { label: "Boutiques", href: "/boutiques" },
  { label: "Support",   href: "/support" },
];

export function SiteHeader() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [cartCount,   setCartCount]   = useState(0);
  const [unread,      setUnread]      = useState(0);
  const [notifs,      setNotifs]      = useState<Notification[]>([]);
  const [user,        setUser]        = useState<StoredUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Cart count
    setCartCount(getCart().reduce((s, i) => s + i.qty, 0));

    // Auth state from localStorage
    const raw = localStorage.getItem("gg-user");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
  }, [pathname]); // re-run on route change

  useEffect(() => {
    if (!user) return;
    // Fetch unread notification count
    getNotificationCount()
      .then((res) => setUnread(res.count))
      .catch(() => {});
  }, [user]);

  const handleNotifOpen = async () => {
    setNotifOpen((v) => !v);
    if (!notifOpen && user) {
      try {
        const list = await getNotifications() as Notification[];
        setNotifs(list);
        if (unread > 0) {
          await markAllNotificationsRead();
          setUnread(0);
        }
      } catch {}
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/");
  };

  const dashboardHref = user?.role === "SELLER" ? "/vendeur" : user?.role === "ADMIN" ? "/admin" : "/client";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      {/* Top bar */}
      <div className="hidden md:block bg-ink text-sm text-gray-300 px-6 py-2">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span>Livraison disponible partout au Sénégal</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Brand />

          <div className="hidden md:flex flex-1 max-w-md items-center h-10 rounded-lg bg-page px-3">
            <Search size={16} className="text-muted" />
            <input
              className="h-full flex-1 bg-transparent pl-2 text-sm outline-none placeholder:text-muted font-body"
              placeholder="Rechercher un produit, un vendeur..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) router.push(`/catalogue?search=${encodeURIComponent(val)}`);
                }
              }}
            />
          </div>

          <nav className="ml-auto hidden lg:flex items-center gap-4 font-body text-sm text-ink-light">
            {user ? (
              <>
                <Link href={dashboardHref} className="flex items-center gap-1.5 font-medium text-ink hover:text-brand">
                  <User size={16} />
                  {user.fullName.split(" ")[0]}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 text-muted hover:text-brand">
                  <LogOut size={15} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/devenir-vendeur" className="hover:text-brand">Devenir vendeur</Link>
                <Link href="/connexion" className="flex items-center gap-1.5 font-medium text-ink hover:text-brand">
                  <User size={16} /> Connexion
                </Link>
              </>
            )}
          </nav>

          <div className="flex-1 md:hidden" />

          {/* Notification bell — logged in users only */}
          {user && (
            <div className="relative">
              <button
                onClick={handleNotifOpen}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-page text-ink hover:bg-brand-soft"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-white shadow-lg z-50">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-bold text-ink">Notifications</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-muted">Aucune notification</p>
                    ) : (
                      notifs.map((n) => (
                        <div
                          key={n.id}
                          className={`border-b border-border px-4 py-3 last:border-0 ${n.isRead ? "" : "bg-brand-soft/50"}`}
                        >
                          <p className="text-sm font-semibold text-ink">{n.title}</p>
                          <p className="font-body mt-0.5 text-xs text-muted">{n.body}</p>
                          <p className="font-body mt-1 text-[10px] text-muted/60">
                            {new Date(n.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t border-border px-4 py-2 text-center">
                    <button onClick={() => setNotifOpen(false)} className="text-xs font-semibold text-brand hover:underline">
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Link
            href="/panier"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-page"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center h-10 rounded-lg bg-page px-3">
          <Search size={16} className="text-muted" />
          <input
            className="h-full flex-1 bg-transparent pl-2 text-sm outline-none placeholder:text-muted font-body"
            placeholder="Rechercher..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) router.push(`/catalogue?search=${encodeURIComponent(val)}`);
              }
            }}
          />
        </div>
      </div>

      {/* Nav tabs — desktop */}
      <div className="hidden md:block border-t border-border px-6">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto">
          {navLinks.map(({ label, href }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={
                  isActive
                    ? "px-4 py-2.5 text-sm font-semibold text-brand border-b-2 border-brand"
                    : "px-4 py-2.5 text-sm font-medium text-ink-light hover:text-brand border-b-2 border-transparent"
                }
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-2 shadow-lg">
          {[
            ["Catalogue", "/catalogue"],
            ["Boutiques", "/boutiques"],
            ["Devenir vendeur", "/devenir-vendeur"],
            ["Support", "/support"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-ink-light hover:bg-page hover:text-brand min-h-[44px]"
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href={dashboardHref} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-page min-h-[44px]">
                Mon espace ({user.fullName.split(" ")[0]})
              </Link>
              <button onClick={handleLogout} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50 min-h-[44px]">
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/connexion" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-brand hover:bg-page min-h-[44px]">
              Se connecter
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
