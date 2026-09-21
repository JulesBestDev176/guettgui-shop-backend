"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Bell, Home, LayoutGrid, LogOut, Menu, Search, ShoppingBag,
  ShoppingCart, Store, User, X, ChevronRight, Headphones,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { getCart } from "@/lib/cart";
import { getNotificationCount, markAllNotificationsRead, getNotifications, logout } from "@/lib/api";

interface StoredUser { fullName: string; role: string }
interface Notification { id: string; title: string; body: string; isRead: boolean; createdAt: string; link?: string | null }

const navLinks = [
  { label: "Accueil",   href: "/",           icon: Home },
  { label: "Catalogue", href: "/catalogue",  icon: LayoutGrid },
  { label: "Boutiques", href: "/boutiques",  icon: Store },
  { label: "Support",   href: "/support",    icon: Headphones },
];

export function SiteHeader() {
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [cartCount,   setCartCount]   = useState(0);
  const [unread,      setUnread]      = useState(0);
  const [notifs,      setNotifs]      = useState<Notification[]>([]);
  const [user,        setUser]        = useState<StoredUser | null>(null);
  const [searchVal,   setSearchVal]   = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname  = usePathname();
  const router    = useRouter();

  useEffect(() => {
    setCartCount(getCart().reduce((s, i) => s + i.qty, 0));
    try {
      const raw = localStorage.getItem("gg-user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    getNotificationCount().then((r) => setUnread(r.count)).catch(() => {});
  }, [user]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); setSearchOpen(false); }, [pathname]);

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const val = searchVal.trim();
      if (val) {
        router.push(`/catalogue?search=${encodeURIComponent(val)}`);
        setSearchOpen(false);
        setSearchVal("");
      }
    }
    if (e.key === "Escape") { setSearchOpen(false); setSearchVal(""); }
  };

  const handleNotifOpen = async () => {
    setNotifOpen((v) => !v);
    if (!notifOpen && user) {
      try {
        const list = await getNotifications() as Notification[];
        setNotifs(list);
        if (unread > 0) { await markAllNotificationsRead(); setUnread(0); }
      } catch {}
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setDrawerOpen(false);
    router.push("/");
  };

  const dashboardHref = user?.role === "SELLER" ? "/vendeur" : user?.role === "ADMIN" ? "/admin" : "/client";
  const firstName = user?.fullName?.split(" ")[0] ?? "";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
        {/* ── Top bar (desktop only) ── */}
        <div className="hidden md:block bg-[#1F2937] text-xs text-gray-400 px-6 py-1.5">
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <span>Livraison disponible partout au Sénégal</span>
            {!user && (
              <Link href="/devenir-vendeur" className="text-[#22A849] font-semibold hover:underline">
                Devenir vendeur
              </Link>
            )}
          </div>
        </div>

        {/* ── Main row ── */}
        <div className="px-4 py-3 md:px-6">
          <div className="mx-auto flex max-w-6xl items-center gap-3">

            {/* Logo */}
            <Brand />

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-md items-center h-10 rounded-xl bg-[#F3F4F6] px-3 gap-2">
              <Search size={16} className="text-[#9CA3AF] shrink-0" />
              <input
                className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#9CA3AF] font-body"
                placeholder="Rechercher un produit, un éleveur..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {/* Spacer on mobile */}
            <div className="flex-1 md:hidden" />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(1).map(({ label, href }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link key={href} href={href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "text-[#22A849] bg-[#F0FDF4]" : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]"}`}>
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop auth */}
            <div className="hidden lg:flex items-center gap-2 ml-1">
              {user ? (
                <>
                  <Link href={dashboardHref}
                    className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-semibold text-[#1F2937] hover:border-[#22A849] hover:text-[#22A849] transition-colors">
                    <User size={15} /> {firstName}
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-[#6B7280] hover:text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={15} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/devenir-vendeur"
                    className="text-sm font-medium text-[#6B7280] hover:text-[#22A849] transition-colors">
                    Devenir vendeur
                  </Link>
                  <Link href="/connexion"
                    className="flex items-center gap-1.5 rounded-xl bg-[#22A849] px-4 py-2 text-sm font-bold text-white hover:bg-[#1a9a3d] transition-colors">
                    <User size={15} /> Connexion
                  </Link>
                </>
              )}
            </div>

            {/* ── Icon row (always visible) ── */}

            {/* Mobile search toggle */}
            <button
              onClick={openSearch}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
            >
              <Search size={18} />
            </button>

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button onClick={handleNotifOpen}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]">
                  <Bell size={18} />
                  {unread > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
                      <p className="text-sm font-bold text-[#1F2937]">Notifications</p>
                      <button onClick={() => setNotifOpen(false)} className="text-[#9CA3AF] hover:text-[#1F2937]"><X size={16} /></button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifs.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-[#9CA3AF]">Aucune notification</p>
                      ) : notifs.map((n) => (
                        <div key={n.id} className={`border-b border-[#F1F5F9] px-4 py-3 last:border-0 ${!n.isRead ? "bg-[#F0FDF4]" : ""}`}>
                          <p className="text-sm font-semibold text-[#1F2937]">{n.title}</p>
                          <p className="mt-0.5 font-body text-xs text-[#6B7280]">{n.body}</p>
                          <p className="mt-1 font-body text-[10px] text-[#9CA3AF]">
                            {new Date(n.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            <Link href="/panier"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#22A849] text-white hover:bg-[#1a9a3d] transition-colors">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1F2937] text-[10px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger (mobile + tablet) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#1F2937] hover:bg-[#E5E7EB]"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* ── Mobile search bar ── */}
        {searchOpen && (
          <div className="md:hidden border-t border-[#F1F5F9] px-4 pb-3 pt-2">
            <div className="flex items-center gap-2 h-11 rounded-xl bg-[#F3F4F6] px-3">
              <Search size={16} className="text-[#9CA3AF] shrink-0" />
              <input
                ref={searchRef}
                className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#9CA3AF] font-body"
                placeholder="Rechercher..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button onClick={() => { setSearchOpen(false); setSearchVal(""); }} className="text-[#9CA3AF] hover:text-[#1F2937]">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Desktop nav tabs ── */}
        <div className="hidden md:block lg:hidden border-t border-[#F1F5F9] px-6">
          <div className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto">
            {navLinks.map(({ label, href }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${active ? "text-[#22A849] border-[#22A849]" : "text-[#6B7280] border-transparent hover:text-[#1F2937]"}`}>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F1F5F9] px-5 py-4">
              <Brand compact />
              <button onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]">
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link key={href} href={href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${active ? "bg-[#F0FDF4] text-[#22A849]" : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#1F2937]"}`}>
                    <Icon size={18} className={active ? "text-[#22A849]" : "text-[#9CA3AF]"} />
                    {label}
                    {active && <ChevronRight size={14} className="ml-auto text-[#22A849]" />}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-[#F1F5F9]" />

              <Link href="/devenir-vendeur"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB]">
                <Store size={18} className="text-[#9CA3AF]" />
                Devenir vendeur
              </Link>
            </nav>

            {/* Auth section */}
            <div className="border-t border-[#F1F5F9] p-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-xl bg-[#F9FAFB] px-3 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22A849] text-sm font-bold text-white">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#1F2937]">{user.fullName}</p>
                      <p className="text-xs text-[#9CA3AF]">{user.role === "SELLER" ? "Vendeur" : user.role === "ADMIN" ? "Admin" : "Client"}</p>
                    </div>
                  </div>
                  <Link href={dashboardHref}
                    className="flex items-center justify-center gap-2 h-11 w-full rounded-xl bg-[#22A849] text-sm font-bold text-white hover:bg-[#1a9a3d] transition-colors">
                    <ShoppingBag size={16} /> Mon espace
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center justify-center gap-2 h-11 w-full rounded-xl border border-[#E5E7EB] text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/connexion"
                    className="flex items-center justify-center gap-2 h-11 w-full rounded-xl bg-[#22A849] text-sm font-bold text-white hover:bg-[#1a9a3d] transition-colors">
                    <User size={16} /> Se connecter
                  </Link>
                  <Link href="/inscription"
                    className="flex items-center justify-center h-11 w-full rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                    Créer un compte
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
