import { MapPin, Package, Search, Truck } from "lucide-react";

export const locationFields = [
  { label: "Region", value: "Dakar" },
  { label: "Departement", value: "Choisir..." },
  { label: "Commune / Ville", value: "Choisir..." },
];

export const howItWorks = [
  { title: "Choisissez votre zone", text: "Region, departement et commune pour voir les offres pres de vous.", icon: MapPin },
  { title: "Selectionnez un produit", text: "Type, poids et etat. Comparez les vendeurs verifies.", icon: Search },
  { title: "Payez avec Dexpay", text: "Paiement securise. Votre argent est protege jusqu'a la livraison.", icon: Package },
  { title: "Recevez ou recuperez", text: "Livraison a domicile ou enlevement. Suivez votre commande en direct.", icon: Truck },
];
