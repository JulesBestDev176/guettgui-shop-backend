import Link from "next/link";
import { ArrowRight, Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        <p className="text-[120px] font-extrabold leading-none text-brand/10 md:text-[160px]">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <img src="/logo.png" alt="Guett Gui" className="h-12 w-auto" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-extrabold text-ink md:text-3xl">Page introuvable</h1>
      <p className="font-body mt-3 max-w-sm text-sm leading-relaxed text-muted">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
        Voici quelques liens qui pourraient vous aider.
      </p>

      {/* Quick links */}
      <div className="mt-8 grid w-full max-w-sm gap-3">
        <Link
          href="/"
          className="flex h-12 items-center gap-3 rounded-xl bg-brand px-5 text-sm font-semibold text-white"
        >
          <Home size={16} />
          Retour à l&apos;accueil
          <ArrowRight size={15} className="ml-auto" />
        </Link>
        <Link
          href="/catalogue"
          className="flex h-12 items-center gap-3 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-brand"
        >
          <ShoppingBag size={16} className="text-brand" />
          Voir le catalogue
          <ArrowRight size={15} className="ml-auto text-muted" />
        </Link>
        <Link
          href="/boutiques"
          className="flex h-12 items-center gap-3 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-brand"
        >
          <Search size={16} className="text-brand" />
          Trouver un éleveur
          <ArrowRight size={15} className="ml-auto text-muted" />
        </Link>
      </div>

      <p className="font-body mt-8 text-xs text-muted">
        Un problème ?{" "}
        <Link href="/support" className="font-semibold text-brand hover:underline">
          Contactez le support
        </Link>
      </p>
    </div>
  );
}
