"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3, Bell, ChevronDown, Heart, LayoutDashboard, LogOut,
  MapPin, Menu, Package, Settings, Shield, ShoppingBag, User, Users, X,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { cn } from "@/lib/utils";

type NavItem = { href: string; icon: React.ElementType; label: string };
type Role = "client" | "vendeur" | "admin" | "livreur";

const navItemsByRole: Record<Role, NavItem[]> = {
  client: [
    { href: "/client",           icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/client/commandes", icon: ShoppingBag,     label: "Mes commandes" },
    { href: "/client/favoris",   icon: Heart,           label: "Favoris" },
    { href: "/client/adresses",  icon: MapPin,          label: "Adresses" },
    { href: "/client/profil",    icon: User,            label: "Mon profil" },
  ],
  vendeur: [
    { href: "/vendeur",              icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/vendeur/produits",     icon: Package,         label: "Mes produits" },
    { href: "/vendeur/commandes",    icon: ShoppingBag,     label: "Commandes" },
    { href: "/vendeur/livraison",    icon: MapPin,          label: "Zones de livraison" },
    { href: "/vendeur/statistiques", icon: BarChart3,       label: "Statistiques" },
    { href: "/vendeur/parametres",   icon: Settings,        label: "Paramètres" },
  ],
  admin: [
    { href: "/admin",              icon: LayoutDashboard, label: "Vue globale" },
    { href: "/admin/utilisateurs", icon: Users,           label: "Utilisateurs" },
    { href: "/admin/vendeurs",     icon: Shield,          label: "Vendeurs" },
    { href: "/admin/produits",     icon: Package,         label: "Produits" },
    { href: "/admin/commandes",    icon: ShoppingBag,     label: "Commandes" },
    { href: "/admin/statistiques", icon: BarChart3,       label: "Statistiques" },
    { href: "/admin/parametres",   icon: Settings,        label: "Paramètres" },
  ],
  livreur: [
    { href: "/livreur",            icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/livreur/livraisons", icon: Package,         label: "Livraisons" },
    { href: "/livreur/profil",     icon: User,            label: "Mon profil" },
  ],
};

const bottomNavByRole: Record<Role, NavItem[]> = {
  client:  navItemsByRole.client.slice(0, 5),
  vendeur: [
    navItemsByRole.vendeur[0],
    navItemsByRole.vendeur[1],
    navItemsByRole.vendeur[2],
    navItemsByRole.vendeur[4],
    navItemsByRole.vendeur[5],
  ],
  admin:   navItemsByRole.admin.slice(0, 5),
  livreur: navItemsByRole.livreur,
};

const roleSpaceLabels: Record<Role, string> = {
  client:  "Espace client",
  vendeur: "Espace vendeur",
  admin:   "Administration",
  livreur: "Espace livreur",
};

const roleLabels: Record<Role, string> = {
  client:  "Client",
  vendeur: "Vendeur",
  admin:   "Admin",
  livreur: "Livreur",
};

export function DashboardShell({
  role,
  children,
  userName: userNameProp = "Utilisateur",
}: {
  role: Role;
  children: React.ReactNode;
  userName?: string;
}) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName,   setUserName]   = useState(userNameProp);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gg-user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.fullName) setUserName(u.fullName);
      }
    } catch {}
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  const navItems    = navItemsByRole[role];
  const bottomItems = bottomNavByRole[role];

  const activeHref =
    [...navItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find(({ href }) => pathname === href || pathname.startsWith(href + "/"))?.href ?? navItems[0]?.href;

  const activeItem  = navItems.find((i) => i.href === activeHref);
  const initials    = userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    try {
      localStorage.removeItem("gg-token");
      localStorage.removeItem("gg-refresh");
      localStorage.removeItem("gg-user");
      sessionStorage.clear();
    } finally {
      setDrawerOpen(false);
      router.replace("/connexion");
      router.refresh();
    }
  };

  // ── Sidebar nav ──
  const sidebarNav = (
    <nav className="flex-1 overflow-y-auto px-3 py-2">
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = href === activeHref;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setDrawerOpen(false)}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all mb-0.5",
              active
                ? "bg-[#22A849] text-white"
                : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-white/60" />
            )}
            <Icon size={18} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const userBlock = (
    <div className="border-t border-white/8 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22A849] text-xs font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{userName}</p>
          <p className="text-xs text-[#64748B]">{roleLabels[role]}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-lg p-1.5 text-[#64748B] hover:bg-white/10 hover:text-white transition-colors"
          title="Se déconnecter"
        >
          <LogOut size={15} />
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[#64748B] hover:bg-white/5 hover:text-white transition-colors"
      >
        <LogOut size={13} />
        Se déconnecter
      </button>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden h-full w-[220px] shrink-0 flex-col bg-[#0F172A] lg:flex">
        {/* Logo */}
        <div className="flex flex-col px-5 pt-5 pb-4 border-b border-white/8">
          <Brand compact light />
          <p className="mt-1 text-[11px] font-medium text-[#64748B]">{roleSpaceLabels[role]}</p>
        </div>
        {sidebarNav}
        {userBlock}
      </aside>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 flex w-[240px] flex-col bg-[#0F172A] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-4">
              <div>
                <Brand compact light />
                <p className="mt-0.5 text-[11px] font-medium text-[#64748B]">{roleSpaceLabels[role]}</p>
              </div>
              <button onClick={() => setDrawerOpen(false)}
                className="rounded-xl p-2 text-[#64748B] hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>
            {sidebarNav}
            {userBlock}
          </div>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Desktop top bar */}
        <div className="hidden h-14 shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-6 lg:flex">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <span>{roleSpaceLabels[role]}</span>
            <span className="text-[#CBD5E1]">/</span>
            <span className="font-semibold text-[#1E293B]">{activeItem?.label ?? "Tableau de bord"}</span>
          </div>
          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
              <Bell size={17} />
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 cursor-pointer hover:bg-[#F8FAFC] transition-colors">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#22A849] text-[11px] font-bold text-white">
                {initials}
              </div>
              <ChevronDown size={14} className="text-[#94A3B8]" />
            </div>
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="flex h-14 shrink-0 items-center gap-3 bg-[#0F172A] px-4 text-white lg:hidden">
          <button onClick={() => setDrawerOpen(true)}
            className="rounded-xl p-2 text-[#64748B] hover:bg-white/10 hover:text-white">
            <Menu size={20} />
          </button>
          <span className="flex-1 truncate text-sm font-semibold">{activeItem?.label ?? "Tableau de bord"}</span>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22A849] text-xs font-bold text-white">
            {initials}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-[64px] lg:pb-0">
          {children}
        </main>

        {/* ── Mobile bottom nav ── */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[60px] items-stretch border-t border-[#E2E8F0] bg-white lg:hidden">
          {bottomItems.map(({ href, icon: Icon, label }) => {
            const active = href === activeHref;
            return (
              <Link key={href} href={href}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                  active ? "text-[#22A849]" : "text-[#94A3B8]"
                )}
              >
                {active && <span className="absolute top-0 h-0.5 w-8 rounded-b-full bg-[#22A849]" />}
                <div className={cn("flex h-6 w-6 items-center justify-center rounded-lg", active && "bg-[#F0FDF4]")}>
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="max-w-[52px] truncate text-center leading-tight">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
