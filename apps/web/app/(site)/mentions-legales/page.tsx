import { LegalLayout, LegalSection } from "@/components/legal-layout";

export const metadata = {
  title: "Mentions légales — Guett Gui",
  description: "Informations légales relatives à la plateforme Guett Gui.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout
      title="Mentions légales"
      subtitle="Informations légales obligatoires relatives à la plateforme."
      lastUpdated="Septembre 2026"
    >
      <LegalSection title="Éditeur de la plateforme">
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["Raison sociale", "Guett Gui SAS"],
            ["Forme juridique", "Société par Actions Simplifiée"],
            ["NINEA", "En cours d'obtention"],
            ["Siège social", "Dakar, Sénégal"],
            ["Email de contact", "contact@guettgui.sn"],
            ["Téléphone", "+221 77 000 00 00"],
            ["Directeur de publication", "Souleymane Fall"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-page px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="Hébergement">
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["Hébergeur", "Vercel Inc."],
            ["Adresse", "340 Pine Street, Suite 1101, San Francisco, CA 94104, USA"],
            ["Site web", "vercel.com"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-page px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L&apos;ensemble du contenu présent sur la plateforme Guett Gui (marque, logo, textes,
          images, interface, code source) est protégé par le droit de la propriété intellectuelle
          sénégalais et international.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication ou adaptation de tout ou
          partie des éléments de la plateforme, quel que soit le moyen ou le procédé utilisé,
          est interdite sans autorisation écrite préalable de Guett Gui.
        </p>
      </LegalSection>

      <LegalSection title="Liens hypertextes">
        <p>
          La plateforme Guett Gui peut contenir des liens vers des sites tiers. Ces liens sont
          fournis à titre informatif. Guett Gui ne contrôle pas le contenu de ces sites et décline
          toute responsabilité quant aux informations qui y sont publiées.
        </p>
      </LegalSection>

      <LegalSection title="Droit applicable">
        <p>
          Les présentes mentions légales sont soumises au droit sénégalais, notamment :
        </p>
        <ul className="mt-2 space-y-1.5 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span>Loi n°2008-11 du 25 janvier 2008 sur la cybercriminalité</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Loi n°2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Loi n°2008-08 du 25 janvier 2008 sur les transactions électroniques</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative aux présentes mentions légales ou à la plateforme :
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <a href="mailto:contact@guettgui.sn" className="flex h-10 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white hover:opacity-90">
            contact@guettgui.sn
          </a>
          <a href="/support" className="flex h-10 items-center justify-center rounded-xl border border-border bg-white px-6 text-sm font-semibold text-ink hover:border-brand">
            Formulaire de contact
          </a>
        </div>
      </LegalSection>
    </LegalLayout>
  );
}
