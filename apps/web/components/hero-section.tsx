"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Users } from "lucide-react";

const trustBadges = [
  { icon: Users, label: "Vendeurs vérifiés" },
  { icon: ShieldCheck, label: "Paiement sécurisé" },
  { icon: Truck, label: "Livraison locale" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-soft">
      {/* Blobs décoratifs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-brand/10"
          style={{ borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%" }}
        />
        <div
          className="absolute -bottom-16 left-1/3 h-56 w-56 bg-brand/8"
          style={{ borderRadius: "40% 60% 30% 70% / 60% 40% 70% 30%" }}
        />
      </div>

      {/* Feuilles décoratives */}
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2">
        <span className="block h-1.5 w-6 rounded-full bg-brand/40 rotate-[-30deg]" />
        <span className="block h-1.5 w-4 rounded-full bg-brand/30 rotate-[20deg]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid items-center gap-10 md:grid-cols-2">

          {/* ─── Contenu gauche ─── */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm">
              <Users size={15} className="text-brand" />
              <span className="text-xs font-semibold text-brand">
                Plus de 280 vendeurs vérifiés au Sénégal
              </span>
            </div>

            {/* Titre */}
            <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.15] tracking-tight text-ink md:text-[2.75rem]">
              Les meilleurs produits{" "}
              <span className="text-brand">
                d&apos;élevage,{" "}
                <br className="hidden md:block" />
                près de chez vous.
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="mt-4 max-w-md font-body text-base leading-relaxed text-muted">
              Poulets, moutons, chèvres, bovins et autres produits
              d&apos;élevage proposés par des vendeurs locaux vérifiés.
            </p>

            {/* Boutons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalogue"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Découvrir les produits
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/devenir-vendeur"
                className="inline-flex h-13 items-center justify-center rounded-xl border-2 border-brand px-6 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                Vendre sur GuettGui
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10">
                    <Icon size={15} className="text-brand" />
                  </span>
                  <span className="font-body text-xs font-medium text-ink-light">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Image droite (desktop) ─── */}
          <div className="relative hidden md:flex justify-center">
            {/* Image fermier — forme blob organique */}
            <div
              className="relative h-[440px] w-full max-w-[520px] overflow-hidden"
              style={{
                borderRadius: "62% 38% 46% 54% / 60% 44% 56% 40%",
              }}
            >
              <img
                src="/ferme.png"
                alt="Éleveur GuettGui"
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* Tableau ardoise — image seule, sans card */}
            <img
              src="/tableau.png"
              alt="Un Sénégal plus fort avec ses éleveurs"
              className="absolute -bottom-4 right-2 h-40 w-auto drop-shadow-lg"
            />
          </div>
        </div>

        {/* ─── Image fermier (mobile uniquement) ─── */}
        <div className="relative mt-8 md:hidden">
          <div
            className="overflow-hidden"
            style={{ borderRadius: "40% 60% 55% 45% / 45% 40% 60% 55%" }}
          >
            <img
              src="/ferme.png"
              alt="Éleveur GuettGui"
              className="h-72 w-full object-cover object-top"
            />
          </div>
          {/* Tableau ardoise mobile — image seule */}
          <img
            src="/tableau.png"
            alt="Un Sénégal plus fort avec ses éleveurs"
            className="absolute -bottom-4 right-2 h-28 w-auto drop-shadow-md"
          />
        </div>

        {/* ─── Trust badges mobile ─── */}
        <div className="mt-10 grid grid-cols-3 gap-4 md:hidden">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10">
                <Icon size={18} className="text-brand" />
              </span>
              <span className="font-body text-[11px] font-medium leading-tight text-ink-light">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
