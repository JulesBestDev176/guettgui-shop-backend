import Link from "next/link";
import { Brand } from "@/components/brand";

const groups = [
  { title: "Acheter", links: [["Catalogue", "/catalogue"], ["Poulet de chair", "/catalogue"], ["Poulet local", "/catalogue"], ["Ventes en lot", "/catalogue"]] },
  { title: "Vendre", links: [["Devenir vendeur", "/devenir-vendeur"], ["Espace vendeur", "/vendeur"], ["Commissions", "/support"]] },
  { title: "Aide", links: [["Suivre ma commande", "/suivi-commande"], ["Paiement Dexpay", "/support"], ["Annulations", "/support"], ["Support", "/support"]] },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink px-4 py-10 text-gray-300 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 pb-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Brand light />
            <p className="font-body mt-3 max-w-[260px] text-sm leading-relaxed text-gray-400">
              Marketplace de volaille fraiche au Senegal. Achetez en confiance aupres de vendeurs verifies.
            </p>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-semibold text-white">{group.title}</h3>
              <div className="font-body space-y-2 text-sm text-gray-400">
                {group.links.map(([label, href]) => (
                  <Link key={label} href={href} className="block hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="font-body flex flex-col gap-2 border-t border-gray-700 pt-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <span>&copy; 2026 Guett Gui — Tous droits reserves</span>
          <span>Paiement securise par <strong className="font-medium text-gray-300">Dexpay</strong></span>
        </div>
      </div>
    </footer>
  );
}
