import { LegalLayout } from "@/components/legal-layout";
import { CheckCircle, MapPin, ShieldCheck, TrendingUp, Users } from "lucide-react";

export const metadata = {
  title: "À propos — Guett Gui",
  description: "Découvrez Guett Gui, la marketplace d'élevage au Sénégal.",
};

const STATS = [
  { value: "6+",    label: "Régions couvertes" },
  { value: "100+",  label: "Éleveurs vérifiés" },
  { value: "500+",  label: "Produits disponibles" },
  { value: "1000+", label: "Acheteurs satisfaits" },
];

const VALUES = [
  { icon: ShieldCheck, title: "Confiance",      desc: "Chaque vendeur est vérifié par notre équipe avant d'être publié sur la plateforme." },
  { icon: MapPin,      title: "Local d'abord",  desc: "Nous connectons acheteurs et éleveurs dans la même région pour des produits frais et une livraison rapide." },
  { icon: TrendingUp,  title: "Impact",         desc: "Nous aidons les éleveurs sénégalais à accéder à de nouveaux marchés et à augmenter leurs revenus." },
  { icon: Users,       title: "Communauté",     desc: "Guett Gui c'est une communauté d'éleveurs, pas juste une plateforme de vente." },
];

export default function AProposPage() {
  return (
    <LegalLayout
      title="À propos de Guett Gui"
      subtitle="La marketplace de référence pour l'élevage au Sénégal."
    >
      {/* Mission */}
      <section className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-4 text-lg font-extrabold text-ink">Notre mission</h2>
        <p className="font-body text-sm leading-relaxed text-ink/80">
          Guett Gui est né d&apos;un constat simple : au Sénégal, des milliers d&apos;éleveurs produisent
          des animaux et des produits de qualité, mais peinent à trouver des acheteurs au-delà
          de leur quartier ou village.
        </p>
        <p className="font-body mt-3 text-sm leading-relaxed text-ink/80">
          Notre mission est de <strong className="text-ink">connecter les éleveurs vérifiés aux acheteurs partout au Sénégal</strong>,
          en simplifiant la mise en relation, la commande et la livraison.
          Nous croyons que le numérique peut transformer l&apos;élevage sénégalais.
        </p>
      </section>

      {/* Stats */}
      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map(({ value, label }) => (
          <div key={label} className="rounded-2xl border border-border bg-white p-5 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-brand">{value}</p>
            <p className="font-body mt-1 text-xs text-muted">{label}</p>
          </div>
        ))}
      </section>

      {/* Values */}
      <section className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-lg font-extrabold text-ink">Nos valeurs</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                <Icon size={19} className="text-brand" strokeWidth={1.7} />
              </span>
              <div>
                <p className="font-bold text-ink">{title}</p>
                <p className="font-body mt-1 text-sm leading-relaxed text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How we verify */}
      <section className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-4 text-lg font-extrabold text-ink">Comment on vérifie les éleveurs</h2>
        <div className="space-y-3">
          {[
            "Vérification de l'identité du vendeur",
            "Visite ou contrôle de l'élevage par notre équipe",
            "Validation du profil et attribution du badge vérifié ✓",
            "Suivi des avis clients et contrôle qualité continu",
          ].map((step, i) => (
            <div key={step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-white">
                {i + 1}
              </span>
              <p className="font-body text-sm text-ink">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-brand p-6 text-white md:p-8">
        <h2 className="text-lg font-extrabold">Rejoignez la communauté</h2>
        <p className="font-body mt-2 text-sm leading-relaxed text-white/80">
          Éleveur ? Créez votre boutique gratuitement et accédez à des milliers d&apos;acheteurs.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/devenir-vendeur" className="flex h-10 items-center rounded-xl bg-white px-5 text-sm font-bold text-brand hover:opacity-90">
            Devenir vendeur
          </a>
          <a href="/catalogue" className="flex h-10 items-center rounded-xl border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/10">
            Voir le catalogue
          </a>
        </div>
      </section>
    </LegalLayout>
  );
}
