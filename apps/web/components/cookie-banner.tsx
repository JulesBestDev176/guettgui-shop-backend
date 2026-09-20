"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const COOKIE_KEY = "gg-cookies-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[560px]">
      <div className="rounded-2xl border border-border bg-white px-5 py-4 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
            <Cookie size={17} className="text-brand" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink">Nous utilisons des cookies</p>
            <p className="font-body mt-1 text-xs leading-relaxed text-muted">
              Des cookies strictement nécessaires assurent le bon fonctionnement du site.
              Avec votre accord, nous utilisons aussi des cookies analytiques pour améliorer
              votre expérience.{" "}
              <Link href="/confidentialite" className="font-semibold text-brand hover:underline">
                En savoir plus
              </Link>
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={accept}
                className="flex h-8 items-center rounded-lg bg-brand px-4 text-xs font-bold text-white hover:opacity-90"
              >
                Accepter
              </button>
              <button
                onClick={decline}
                className="flex h-8 items-center rounded-lg border border-border bg-white px-4 text-xs font-semibold text-ink hover:border-brand"
              >
                Refuser
              </button>
            </div>
          </div>
          <button
            onClick={decline}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Fermer"
          >
            <X size={14} className="text-muted" />
          </button>
        </div>
      </div>
    </div>
  );
}
