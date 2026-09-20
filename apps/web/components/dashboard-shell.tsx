"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
    { href: "/client", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/client/commandes", icon: ShoppingBag, label: "Mes commandes" },
    { href: "/client/favoris", icon: Heart, label: "Favoris" },
    { href: "/client/adresses", icon: MapPin, label: "Adresses" },
    { href: "/client/profil", icon: User, label: "Mon profil" },
  ],
  vendeur: [
    { href: "/vendeur", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/vendeur/produits", icon: Package, label: "Mes produits" },
    { href: "/vendeur/commandes", icon: ShoppingBag, label: "Commandes" },
    { href: "/vendeur/livraison", icon: MapPin, label: "Zones livraison" },
    { href: "/vendeur/statistiques", icon: BarChart3, label: "Statistiques" },
    { href: "/vendeur/parametres", icon: Settings, label: "Paramètres" },
  ],
  admin: [
    { href: "/admin", icon: LayoutDashboard, label: "Vue globale" },
    { href: "/admin/utilisateurs", icon: Users, label: "Utilisateurs" },
    { href: "/admin/vendeurs", icon: Shield, label: "Vendeurs" },
    { href: "/admin/produits", icon: Package, label: "Produits" },
    { href: "/admin/commandes", icon: ShoppingBag, label: "Commandes" },
    { href: "/admin/statistiques", icon: BarChart3, label: "Statistiques" },
    { href: "/admin/parametres", icon: Settings, label: "Paramètres" },
  ],
  livreur: [
    { href: "/livreur", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/livreur/livraisons", icon: Package, label: "Livraisons" },
    { href: "/livreur/profil", icon: User, label: "Mon profil" },
  ],
};

const roleColors: Record<Role, string> = {
  client: "bg-brand",
  vendeur: "bg-brand",
  admin: "bg-brand",
  livreur: "bg-emerald-600",
};

const roleLabels: Record<Role, string> = {
  client: "Client",
  vendeur: "Vendeur",
  admin: "Admin",
  livreur: "Livreur",
};

export function DashboardShell({
  role,
  children,
  userName = "Utilisateur",
}: {
  role: Role;
  children: React.ReactNode;
  userName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navItems = navItemsByRole[role];
  const activeHref =
    [...navItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find(({ href }) => pathname === href || pathname.startsWith(href + "/"))?.href ?? navItems[0]?.href;

  const handleLogout = () => {
    try {
      localStorage.removeItem("charcutsn-user");
      localStorage.removeItem("charcutsn-session");
      localStorage.removeItem("charcutsn-role");
      sessionStorage.clear();
      document.cookie
        .split(";")
        .map((cookie) => cookie.split("=")[0]?.trim())
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

  const navContent = (
    <nav className="flex-1 space-y-1 px-3 py-4">
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
                ? "bg-brand text-white shadow-sm"
                : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const userBlock = (
    <div className="border-t border-white/10 p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${roleColors[role]} text-sm font-bold text-white`}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{userName}</p>
          <p className="text-xs text-[#9CA3AF]">{roleLabels[role]}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Se deconnecter"
          title="Se deconnecter"
          className="rounded-lg p-1.5 text-[#9CA3AF] transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      {/* Desktop sidebar */}
      <aside className="hidden h-full w-[230px] flex-col bg-[#1F2937] text-white lg:flex">
        <div className="flex h-[72px] items-center border-b border-white/10 px-4">
          <Brand compact light />
          <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${roleColors[role]}`}>
            {roleLabels[role]}
          </span>
        </div>
        {navContent}
        {userBlock}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute bottom-0 left-0 top-0 flex w-64 flex-col bg-[#1F2937]">
            <div className="flex h-14 items-center border-b border-white/10 px-4 text-white">
              <span className="text-sm font-bold">Menu</span>
              <button onClick={() => setDrawerOpen(false)} className="ml-auto rounded-xl p-2 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            {navContent}
            {userBlock}
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar mobile */}
        <div className="flex h-[76px] items-center gap-3 bg-[#1F2937] px-4 text-white lg:hidden">
          <button onClick={() => setDrawerOpen(true)} className="rounded-xl p-2 hover:bg-white/10">
            <Menu size={20} />
          </button>
          <Brand compact light />
          <button className="ml-auto rounded-xl p-2 hover:bg-white/10">
            <Bell size={18} />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
