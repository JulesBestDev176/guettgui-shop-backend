import { LegalLayout, FaqItem } from "@/components/legal-layout";

export const metadata = {
  title: "FAQ — Questions fréquentes — Guett Gui",
  description: "Trouvez les réponses aux questions les plus fréquentes sur Guett Gui.",
};

export default function FaqPage() {
  return (
    <LegalLayout
      title="Questions fréquentes"
      subtitle="Tout ce que vous devez savoir sur Guett Gui."
    >
      {/* Acheteurs */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white">A</span>
          <h2 className="text-lg font-extrabold text-ink">Questions des acheteurs</h2>
        </div>
        <div className="space-y-2">
          <FaqItem question="Comment passer une commande sur Guett Gui ?">
            <p>Parcourez le catalogue ou cherchez un produit, cliquez sur &quot;Ajouter au panier&quot; puis validez
            votre commande en renseignant votre adresse de livraison. Vous recevrez une confirmation par SMS.</p>
          </FaqItem>
          <FaqItem question="Les produits sont-ils frais et de qualité ?">
            <p>Tous nos vendeurs sont vérifiés par notre équipe avant publication. Les produits sont proposés
            par des éleveurs locaux. Les avis clients visibles sur chaque fiche vous permettent de choisir
            en toute confiance.</p>
          </FaqItem>
          <FaqItem question="Comment se passe la livraison ?">
            <p>Chaque vendeur définit ses zones et délais de livraison (affichés sur sa fiche boutique).
            Vous recevez un SMS avec un code de suivi dès que votre commande est expédiée.
            Le retrait chez le vendeur est aussi possible si proposé.</p>
          </FaqItem>
          <FaqItem question="Quels sont les frais de livraison ?">
            <p>Les frais varient selon le vendeur, votre localisation et le poids de la commande.
            Ils sont toujours affichés avant la validation finale de votre commande.</p>
          </FaqItem>
          <FaqItem question="Puis-je annuler ou modifier ma commande ?">
            <p>Vous pouvez annuler une commande tant qu&apos;elle n&apos;a pas été confirmée par le vendeur (généralement
            dans les 2 heures). Contactez notre support via la messagerie intégrée ou par SMS.</p>
          </FaqItem>
          <FaqItem question="Que faire si je reçois un produit non conforme ?">
            <p>Signalez le problème dans les 24 heures suivant la réception via le bouton &quot;Signaler un problème&quot;
            sur votre commande. Notre équipe de médiation intervient sous 48h ouvrées.</p>
          </FaqItem>
          <FaqItem question="Comment payer ?">
            <p>Pour le lancement, le paiement se fait directement avec le vendeur (espèces à la livraison ou
            Mobile Money). Le paiement en ligne sécurisé (Wave, Orange Money) sera disponible prochainement.</p>
          </FaqItem>
        </div>
      </section>

      {/* Vendeurs */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-extrabold text-white">V</span>
          <h2 className="text-lg font-extrabold text-ink">Questions des vendeurs</h2>
        </div>
        <div className="space-y-2">
          <FaqItem question="Comment créer ma boutique sur Guett Gui ?">
            <p>Cliquez sur &quot;Devenir vendeur&quot;, renseignez vos informations (nom, boutique, téléphone, région)
            et créez votre compte. Notre équipe vérifie votre profil sous 24–48h et vous notifie par SMS.</p>
          </FaqItem>
          <FaqItem question="C'est gratuit de vendre sur Guett Gui ?">
            <p>Oui, entièrement gratuit pendant la période de lancement. Vous pouvez publier jusqu&apos;à
            10 produits sans frais. Des plans premium seront proposés ultérieurement pour les vendeurs
            souhaitant plus de visibilité.</p>
          </FaqItem>
          <FaqItem question="Comment ajouter mes produits ?">
            <p>Depuis votre tableau de bord vendeur, cliquez sur &quot;Ajouter un produit&quot;, renseignez le nom,
            la catégorie, le prix, les photos et le stock disponible. Le produit est en ligne après validation.</p>
          </FaqItem>
          <FaqItem question="Comment gérer mes commandes ?">
            <p>Toutes vos commandes sont visibles dans votre tableau de bord. Pour chaque commande,
            vous pouvez confirmer, signaler un problème ou marquer comme livrée. Vous recevez une
            notification SMS pour chaque nouvelle commande.</p>
          </FaqItem>
          <FaqItem question="Quand et comment suis-je payé ?">
            <p>Pour le lancement, vous êtes payé directement par l&apos;acheteur (espèces à la livraison
            ou Mobile Money). Guett Gui ne prend pas de commission pour le moment.</p>
          </FaqItem>
          <FaqItem question="Qu'est-ce que le badge 'Vendeur vérifié' ?">
            <p>Ce badge est attribué après vérification de votre identité et de votre activité d&apos;élevage
            par notre équipe. Il rassure les acheteurs et améliore la visibilité de votre boutique.</p>
          </FaqItem>
          <FaqItem question="Que se passe-t-il en cas de litige avec un acheteur ?">
            <p>Notre équipe de médiation est disponible pour résoudre les litiges. Contactez le support
            via support@guettgui.sn. Nous examinons les preuves des deux parties et proposons une solution
            équitable sous 48h ouvrées.</p>
          </FaqItem>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-2xl bg-brand-soft p-6">
        <p className="font-body text-sm text-ink">
          Vous ne trouvez pas la réponse à votre question ?
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/support" className="flex h-10 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white">
            Contacter le support
          </a>
          <a href="https://wa.me/221770000000" className="flex h-10 items-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-ink" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </section>
    </LegalLayout>
  );
}
