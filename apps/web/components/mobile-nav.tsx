"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drumstick, Grid3X3, Home, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/catalogue", icon: Drumstick, label: "Poulets" },
  { href: "/commande-rapide", icon: Grid3X3, label: "Rapide" },
  { href: "/panier", icon: ShoppingBag, label: "Panier" },
  { href: "/connexion", icon: User, label: "Compte" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.06)] px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-2 py-1 text-[11px] font-medium",
                active ? "font-semibold text-brand" : "text-muted"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
