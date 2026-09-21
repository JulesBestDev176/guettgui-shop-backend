"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  User,
  Users,
  X,
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
    { href: "/vendeur",               icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/vendeur/produits",      icon: Package,         label: "Mes produits" },
    { href: "/vendeur/commandes",     icon: ShoppingBag,     label: "Commandes" },
    { href: "/vendeur/livraison",     icon: MapPin,          label: "Zones livraison" },
    { href: "/vendeur/statistiques",  icon: BarChart3,       label: "Statistiques" },
    { href: "/vendeur/parametres",    icon: Settings,        label: "Paramètres" },
  ],
  admin: [
    { href: "/admin",               icon: LayoutDashboard, label: "Vue globale" },
    { href: "/admin/utilisateurs",  icon: Users,           label: "Utilisateurs" },
    { href: "/admin/vendeurs",      icon: Shield,          label: "Vendeurs" },
    { href: "/admin/produits",      icon: Package,         label: "Produits" },
    { href: "/admin/commandes",     icon: ShoppingBag,     label: "Commandes" },
    { href: "/admin/statistiques",  icon: BarChart3,       label: "Statistiques" },
    { href: "/admin/parametres",    icon: Settings,        label: "Paramètres" },
  ],
  livreur: [
    { href: "/livreur",            icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/livreur/livraisons", icon: Package,         label: "Livraisons" },
    { href: "/livreur/profil",     icon: User,            label: "Mon profil" },
  ],
};

// Bottom nav: max 5 items for the role (most important ones)
const bottomNavByRole: Record<Role, NavItem[]> = {
  client:  navItemsByRole.client.slice(0, 5),
  vendeur: [
    navItemsByRole.vendeur[0], // Dashboard
    navItemsByRole.vendeur[1], // Produits
    navItemsByRole.vendeur[2], // Commandes
    navItemsByRole.vendeur[4], // Statistiques
    navItemsByRole.vendeur[5], // Paramètres
  ],
  admin:   navItemsByRole.admin.slice(0, 5),
  livreur: navItemsByRole.livreur,
};

const roleColors: Record<Role, string> = {
  client:  "bg-[#22A849]",
  vendeur: "bg-[#22A849]",
  admin:   "bg-[#22A849]",
  livreur: "bg-emerald-600",
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
  const pathname = usePathname();
  const router   = useRouter();
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

  // Close drawer on nav
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  const navItems    = navItemsByRole[role];
  const bottomItems = bottomNavByRole[role];

  const getActiveHref = (items: NavItem[]) =>
    [...items]
      .sort((a, b) => b.href.length - a.href.length)
      .find(({ href }) => pathname === href || pathname.startsWith(href + "/"))?.href ?? items[0]?.href;

  const activeHref = getActiveHref(navItems);
  const activeItem = navItems.find((i) => i.href === activeHref);

  const handleLogout = () => {
    try {
      localStorage.removeItem("gg-token");
      localStorage.removeItem("gg-refresh");
      localStorage.removeItem("gg-user");
      sessionStorage.clear();
      document.cookie.split(";")
        .map((c) => c.split("=")[0]?.trim())
        .filter(Boolean)
        .forEach((name) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });
    } finally {
      setDrawerOpen(false);
      router.replace("/connexion");
      router.refresh();
    }
  };

  // ── Sidebar / drawer nav content ──
  const sidebarNav = (
    <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = href === activeHref;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setDrawerOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-[#22A849] text-white shadow-sm"
                : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            <span className="truncate">{label}</span>
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/60" />}
          </Link>
        );
      })}
    </nav>
  );

  const userBlock = (
    <div className="border-t border-white/10 p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${roleColors[role]} text-sm font-bold text-white`}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{userName}</p>
          <p className="text-xs text-[#9CA3AF]">{roleLabels[role]}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Se déconnecter"
          title="Se déconnecter"
          className="shrink-0 rounded-lg p-1.5 text-[#9CA3AF] transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F3F4F6]">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden h-full w-[230px] shrink-0 flex-col bg-[#1F2937] text-white lg:flex">
        <div className="flex h-[64px] items-center border-b border-white/10 px-5">
          <Brand compact light />
          <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${roleColors[role]}`}>
            {roleLabels[role]}
          </span>
        </div>
        {sidebarNav}
        {userBlock}
      </aside>

      {/* ── Mobile / tablet drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 top-0 flex w-[260px] flex-col bg-[#1F2937] shadow-2xl">
            <div className="flex h-[60px] items-center justify-between border-b border-white/10 px-4">
              <Brand compact light />
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl p-2 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
              >
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

        {/* Mobile top bar */}
        <div className="flex h-14 shrink-0 items-center gap-3 bg-[#1F2937] px-4 text-white lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-xl p-2 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 min-w-0">
            {activeItem && (
              <p className="truncate text-sm font-semibold text-white">{activeItem.label}</p>
            )}
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22A849] text-xs font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 overflow-y-auto pb-[64px] lg:pb-0">
          {children}
        </main>

        {/* ── Mobile bottom navigation ── */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[60px] items-stretch border-t border-[#E5E7EB] bg-white lg:hidden">
          {bottomItems.map(({ href, icon: Icon, label }) => {
            const active = href === activeHref;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                  active ? "text-[#22A849]" : "text-[#9CA3AF] hover:text-[#1F2937]"
                )}
              >
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-lg transition-all",
                  active && "bg-[#F0FDF4]"
                )}>
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="leading-tight truncate max-w-[56px] text-center">{label}</span>
                {active && <span className="absolute bottom-0 h-0.5 w-8 rounded-t-full bg-[#22A849]" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
