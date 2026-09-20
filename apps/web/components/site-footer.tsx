import Link from "next/link";
import { Brand } from "@/components/brand";

const groups = [
  {
    title: "Acheter",
    links: [
      ["Catalogue",          "/catalogue"],
      ["Toutes les boutiques","/boutiques"],
      ["Volailles",          "/catalogue?categoryId=volailles"],
      ["Moutons & Chèvres",  "/catalogue?categoryId=moutons"],
      ["Œufs & Produits laitiers", "/catalogue?categoryId=oeufs"],
      ["Panier",             "/panier"],
      ["Commander rapidement","/commande-rapide"],
      ["Suivre ma commande", "/suivi-commande"],
    ],
  },
  {
    title: "Vendre",
    links: [
      ["Devenir vendeur",    "/devenir-vendeur"],
      ["Espace vendeur",     "/vendeur"],
      ["Nos offres",         "/devenir-vendeur#offres"],
      ["FAQ vendeurs",       "/faq"],
    ],
  },
  {
    title: "Guett Gui",
    links: [
      ["À propos",           "/a-propos"],
      ["FAQ",                "/faq"],
      ["Support & Contact",  "/support"],
      ["Livraison & Retours","/livraison-retours"],
    ],
  },
  {
    title: "Légal",
    links: [
      ["CGU",                        "/cgu"],
      ["CGV",                        "/cgv"],
      ["Politique de confidentialité","/confidentialite"],
      ["Mentions légales",           "/mentions-legales"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink px-4 py-10 text-gray-300 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 pb-8 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Brand light />
            <p className="font-body mt-3 max-w-[220px] text-sm leading-relaxed text-gray-400">
              Marketplace d&apos;élevage au Sénégal. Achetez en confiance auprès d&apos;éleveurs vérifiés.
            </p>
            {/* Social */}
            <div className="mt-4 flex gap-3">
              {[
                {
                  label: "Facebook",
                  href: "#",
                  svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
                },
                {
                  label: "WhatsApp",
                  href: "#",
                  svg: (
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  ),
                },
                {
                  label: "Instagram",
                  href: "#",
                  svg: (
                    <>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </>
                  ),
                },
              ].map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    {svg}
                  </svg>
                </a>
              ))}
            </div>

            {/* Auth links */}
            <div className="font-body mt-5 space-y-1.5 text-sm text-gray-400">
              <Link href="/connexion" className="block transition hover:text-white">Se connecter</Link>
              <Link href="/inscription" className="block transition hover:text-white">Créer un compte</Link>
            </div>
          </div>

          {/* Link groups */}
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-semibold text-white">{group.title}</h3>
              <div className="font-body space-y-2 text-sm text-gray-400">
                {group.links.map(([label, href]) => (
                  <Link key={label} href={href} className="block transition hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="font-body flex flex-col gap-3 border-t border-gray-700 pt-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} Guett Gui — Tous droits réservés</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/confidentialite" className="hover:text-gray-300">Confidentialité</Link>
            <Link href="/cgu" className="hover:text-gray-300">CGU</Link>
            <Link href="/cgv" className="hover:text-gray-300">CGV</Link>
            <Link href="/mentions-legales" className="hover:text-gray-300">Mentions légales</Link>
            <Link href="/support" className="hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
