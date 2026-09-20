import { LegalLayout, LegalSection } from "@/components/legal-layout";

export const metadata = {
  title: "Politique de confidentialité — Guett Gui",
  description: "Comment Guett Gui collecte, utilise et protège vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      subtitle="Comment nous collectons, utilisons et protégeons vos données personnelles."
      lastUpdated="Septembre 2026"
    >
      <LegalSection title="1. Responsable du traitement">
        <p>
          Guett Gui, marketplace d&apos;élevage au Sénégal, est responsable du traitement de vos
          données personnelles conformément à la loi sénégalaise n°2008-12 sur la protection des
          données à caractère personnel et à la Commission de Protection des Données Personnelles (CDP).
        </p>
        <p>
          Pour toute question relative à vos données : <strong>privacy@guettgui.sn</strong>
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <p>Nous collectons les données suivantes selon votre utilisation :</p>
        <ul className="mt-2 space-y-1.5 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Données d&apos;inscription :</strong> nom, prénom, numéro de téléphone, adresse e-mail (optionnelle), mot de passe chiffré.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Données vendeur :</strong> nom de la boutique, description, localisation (région, ville), photos, documents de vérification.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées, durée de session (via cookies analytiques avec votre consentement).</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Données de commande :</strong> adresse de livraison, historique d&apos;achats.</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Finalités du traitement">
        <ul className="space-y-1.5 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span>Gestion de votre compte et authentification</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Traitement des commandes et suivi de livraison</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Vérification des profils vendeurs</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Service client et support</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Amélioration de nos services (avec votre consentement)</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Envoi de notifications transactionnelles par SMS</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Base légale du traitement">
        <ul className="space-y-1.5 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Exécution du contrat</strong> : traitement des commandes, gestion des comptes.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Consentement</strong> : cookies analytiques, notifications marketing.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Obligation légale</strong> : conservation des données de transaction (10 ans).</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Partage des données">
        <p>Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :</p>
        <ul className="mt-2 space-y-1.5 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span>Les vendeurs concernés par vos commandes (nom, téléphone, adresse de livraison uniquement)</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Nos prestataires techniques (hébergement, envoi SMS) soumis aux mêmes obligations</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Les autorités compétentes sur réquisition légale</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Conservation des données">
        <ul className="space-y-1.5 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span>Données de compte : durée de l&apos;activité + 3 ans</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Données de transaction : 10 ans (obligation légale)</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Données de navigation : 13 mois maximum</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Données de support : 3 ans</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Vos droits">
        <p>Conformément à la loi 2008-12, vous disposez des droits suivants :</p>
        <ul className="mt-2 space-y-1.5 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Droit de rectification</strong> : corriger vos données inexactes</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Droit à l&apos;effacement</strong> : supprimer vos données (sous conditions)</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span><strong>Droit d&apos;opposition</strong> : vous opposer à certains traitements</span></li>
        </ul>
        <p className="mt-3">
          Pour exercer ces droits : <strong>privacy@guettgui.sn</strong> ou via le formulaire de support.
          Réponse sous 30 jours. Vous pouvez également adresser une réclamation à la CDP Sénégal.
        </p>
      </LegalSection>

      <LegalSection title="8. Sécurité">
        <p>
          Vos données sont protégées par chiffrement TLS en transit et AES-256 au repos.
          Les mots de passe sont hachés avec bcrypt. Nous réalisons des audits de sécurité réguliers.
          En cas de violation de données, vous serez notifié dans les 72 heures conformément à la réglementation.
        </p>
      </LegalSection>

      <LegalSection title="9. Cookies">
        <p>
          Nous utilisons des cookies strictement nécessaires au fonctionnement du site (session, panier).
          Les cookies analytiques et de personnalisation ne sont activés qu&apos;avec votre consentement
          explicite via notre bannière de cookies. Vous pouvez modifier vos préférences à tout moment.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
