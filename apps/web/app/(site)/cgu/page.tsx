import { LegalLayout, LegalSection } from "@/components/legal-layout";

export const metadata = {
  title: "Conditions Générales d'Utilisation — Guett Gui",
  description: "Conditions d'utilisation de la plateforme Guett Gui.",
};

export default function CguPage() {
  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      subtitle="Les règles qui régissent l'utilisation de la plateforme Guett Gui."
      lastUpdated="Septembre 2026"
    >
      <LegalSection title="1. Présentation de la plateforme">
        <p>
          Guett Gui est une marketplace en ligne permettant la mise en relation entre éleveurs
          (vendeurs) et acheteurs au Sénégal. La plateforme facilite la vente d&apos;animaux
          d&apos;élevage (volailles, ovins, bovins, etc.) et de produits dérivés (œufs, lait, viande).
        </p>
        <p>
          Guett Gui agit en qualité d&apos;intermédiaire technique et ne saurait être tenu responsable
          des transactions entre vendeurs et acheteurs, sous réserve des dispositions légales applicables.
        </p>
      </LegalSection>

      <LegalSection title="2. Acceptation des conditions">
        <p>
          L&apos;inscription et/ou l&apos;utilisation de la plateforme Guett Gui implique l&apos;acceptation
          pleine et entière des présentes CGU. Si vous n&apos;acceptez pas ces conditions, vous ne devez
          pas utiliser nos services.
        </p>
        <p>
          Ces conditions peuvent être modifiées à tout moment. Les utilisateurs inscrits seront notifiés
          par SMS. La poursuite de l&apos;utilisation après notification vaut acceptation.
        </p>
      </LegalSection>

      <LegalSection title="3. Inscription et compte utilisateur">
        <ul className="space-y-2 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span>L&apos;inscription est gratuite et ouverte à toute personne physique ou morale résidant au Sénégal.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Vous devez fournir des informations exactes et les maintenir à jour.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Chaque utilisateur ne peut disposer que d&apos;un seul compte.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Vous êtes responsable de la confidentialité de votre mot de passe.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Guett Gui se réserve le droit de suspendre tout compte en cas d&apos;utilisation frauduleuse.</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Règles pour les acheteurs">
        <ul className="space-y-2 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span>Toute commande passée constitue un engagement ferme d&apos;achat.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>L&apos;acheteur s&apos;engage à respecter les délais de paiement convenus.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Tout abus de réclamation ou retour injustifié peut entraîner la suspension du compte.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Les avis laissés doivent être sincères et basés sur une expérience réelle.</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Règles pour les vendeurs">
        <ul className="space-y-2 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span>Les vendeurs s&apos;engagent à proposer uniquement des produits légaux et conformes à la réglementation sanitaire sénégalaise.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Les descriptions et photos doivent être exactes et représentatives du produit réel.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Le vendeur est seul responsable de la qualité sanitaire de ses animaux et produits.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Tout manquement grave peut entraîner la suspension ou suppression définitive de la boutique.</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>En mode lancement, l&apos;inscription vendeur est gratuite avec un maximum de 10 produits actifs.</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Contenus interdits">
        <p>Sont strictement interdits sur la plateforme :</p>
        <ul className="mt-2 space-y-1.5 pl-4">
          <li className="flex gap-2"><span className="text-brand">•</span><span>La vente d&apos;espèces animales protégées</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Les contenus à caractère trompeur, frauduleux ou diffamatoire</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>Les pratiques de concurrence déloyale</span></li>
          <li className="flex gap-2"><span className="text-brand">•</span><span>L&apos;usurpation d&apos;identité d&apos;un autre vendeur</span></li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Responsabilité de Guett Gui">
        <p>
          Guett Gui s&apos;engage à maintenir la disponibilité de la plateforme dans les meilleures
          conditions, mais ne peut garantir une disponibilité ininterrompue. Notre responsabilité
          ne saurait être engagée pour les dommages résultant d&apos;une indisponibilité temporaire.
        </p>
        <p>
          Guett Gui n&apos;est pas partie aux transactions et ne peut être tenu responsable des
          litiges entre acheteurs et vendeurs, mais met à disposition un service de médiation.
        </p>
      </LegalSection>

      <LegalSection title="8. Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments constituant la plateforme Guett Gui (logo, design, textes, code)
          sont protégés par le droit de la propriété intellectuelle. Toute reproduction non autorisée
          est interdite.
        </p>
        <p>
          En publiant du contenu sur la plateforme, vous accordez à Guett Gui une licence non exclusive
          d&apos;utilisation à des fins de promotion du service.
        </p>
      </LegalSection>

      <LegalSection title="9. Droit applicable et juridiction">
        <p>
          Les présentes CGU sont régies par le droit sénégalais, notamment la loi n°2008-11 sur
          les transactions électroniques. En cas de litige, les parties s&apos;engagent à tenter
          une résolution amiable avant tout recours judiciaire. À défaut, les tribunaux compétents
          de Dakar seront saisis.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
