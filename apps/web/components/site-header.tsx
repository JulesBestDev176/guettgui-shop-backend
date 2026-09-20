"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Brand } from "@/components/brand";

const categoryLinks = [
  "Toutes les categories",
  "Poulet de chair",
  "Poulet local",
  "Local ameliore",
  "Poulet vivant",
  "Pret a cuire",
  "Vente en lot",
  "Ramasse",
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categoryLinks[0]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      {/* Top bar */}
      <div className="hidden md:block bg-ink text-sm text-gray-300 px-6 py-2">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span>Livraison disponible partout au Senegal</span>
          <span>Paiement securise avec Dexpay</span>
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
            />
          </div>

          <nav className="ml-auto hidden lg:flex items-center gap-6 font-body text-sm text-ink-light">
            <Link href="/devenir-vendeur" className="hover:text-brand">Devenir vendeur</Link>
            <Link href="/suivi-commande" className="hover:text-brand">Suivre commande</Link>
            <Link href="/connexion" className="flex items-center gap-1.5 font-medium text-ink hover:text-brand">
              <User size={16} />
              Connexion
            </Link>
          </nav>

          <div className="flex-1 md:hidden" />

          <Link
            href="/panier"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white"
          >
            <ShoppingCart size={18} />
            <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">
              2
            </span>
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
          />
        </div>
      </div>

      {/* Category tabs — desktop */}
      <div className="hidden md:block bg-page/60 px-6 py-2">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto">
          {categoryLinks.map((label) => (
            <Link
              key={label}
              href="/catalogue"
              onClick={() => setActiveCategory(label)}
              className={
                activeCategory === label
                  ? "rounded-full bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand"
                  : "rounded-full px-3.5 py-1.5 text-xs font-medium text-ink-light hover:text-brand"
              }
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-2 shadow-lg">
          {[
            ["Catalogue", "/catalogue"],
            ["Commande rapide", "/commande-rapide"],
            ["Devenir vendeur", "/devenir-vendeur"],
            ["Suivre commande", "/suivi-commande"],
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
        </div>
      )}
    </header>
  );
}
