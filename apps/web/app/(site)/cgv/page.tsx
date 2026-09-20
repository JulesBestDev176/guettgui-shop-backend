import { LegalLayout, LegalSection } from "@/components/legal-layout";

export const metadata = {
  title: "Conditions Générales de Vente — Guett Gui",
  description: "Conditions applicables aux achats effectués sur Guett Gui.",
};

export default function CgvPage() {
  return (
    <LegalLayout
      title="Conditions Générales de Vente"
      subtitle="Conditions applicables à toute transaction effectuée sur la plateforme."
      lastUpdated="Septembre 2026"
    >
      <LegalSection title="1. Champ d'application">
        <p>
          Les présentes CGV s&apos;appliquent à toutes les ventes conclues entre vendeurs inscrits
          sur Guett Gui et acheteurs via la plateforme. Chaque vendeur est responsable de ses propres
          conditions de vente dans le cadre du présent cadre général.
        </p>
      </LegalSection>

      <LegalSection title="2. Prix">
        <ul className="space-y-2 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span>Tous les prix sont affichés en <strong>Francs CFA (FCFA)</strong>, toutes taxes comprises.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Les frais de livraison sont indiqués séparément lors de la commande.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Les prix sont définis par chaque vendeur et peuvent varier. Guett Gui ne fixe pas les prix des produits.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Le prix applicable est celui affiché au moment de la validation de la commande.</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Commande">
        <p>La commande est validée en plusieurs étapes :</p>
        <ol className="mt-2 space-y-1.5 pl-4">
          <li className="flex gap-2"><span className="text-brand font-bold">1.</span><span>Sélection du produit et ajout au panier</span></li>
          <li className="flex gap-2"><span className="text-brand font-bold">2.</span><span>Renseignement des informations de livraison</span></li>
          <li className="flex gap-2"><span className="text-brand font-bold">3.</span><span>Acceptation des CGV et confirmation de la commande</span></li>
          <li className="flex gap-2"><span className="text-brand font-bold">4.</span><span>Réception d&apos;un SMS de confirmation avec numéro de suivi</span></li>
        </ol>
        <p className="mt-3">
          La commande n&apos;est définitive qu&apos;après confirmation par le vendeur (sous 24h maximum).
        </p>
      </LegalSection>

      <LegalSection title="4. Disponibilité des produits">
        <p>
          Les offres sont proposées dans la limite des stocks disponibles. En cas d&apos;indisponibilité
          après commande, l&apos;acheteur est informé par SMS et la commande est annulée sans frais.
          Guett Gui encourage les vendeurs à maintenir leurs stocks à jour en temps réel.
        </p>
      </LegalSection>

      <LegalSection title="5. Retrait & Remise">
        <p>
          La remise des produits se fait directement entre acheteur et vendeur, soit au lieu d&apos;élevage
          du vendeur, soit à un point convenu lors de la commande. Les modalités sont précisées sur
          chaque fiche boutique. Guett Gui n&apos;assure pas la livraison et n&apos;en est pas responsable.
        </p>
      </LegalSection>

      <LegalSection title="6. Paiement">
        <p>
          Pour la période de lancement, les transactions peuvent être réglées directement entre
          acheteur et vendeur (espèces, Mobile Money). Les modalités de paiement en ligne
          (Wave, Orange Money, Free Money) seront activées prochainement.
        </p>
      </LegalSection>

      <LegalSection title="7. Réclamations et retours">
        <ul className="space-y-2 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span>Toute réclamation doit être signalée dans les <strong>24 heures</strong> suivant la réception.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Les produits vivants (animaux) ne sont pas remboursables sauf défaut sanitaire prouvé.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>En cas de litige, notre équipe de médiation intervient sous 48h ouvrées.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Contact : <strong>support@guettgui.sn</strong> ou via la messagerie intégrée.</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Garanties">
        <p>
          Chaque vendeur est responsable de la conformité sanitaire de ses produits conformément
          aux lois sénégalaises sur l&apos;élevage et la santé animale. Les vendeurs vérifiés par
          Guett Gui ont fait l&apos;objet d&apos;un contrôle de leurs informations, mais cela ne
          constitue pas une garantie sur la qualité des produits.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
