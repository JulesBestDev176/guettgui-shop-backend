import { Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/primitives";

export default function AjouterProduitPage() {
  return (
    <DashboardShell role="vendeur" userName="Ferme Diallo">
      <div className="p-6 max-w-2xl">
        <Link href="/vendeur" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-[#22A849] mb-6 w-fit">
          <ArrowLeft size={16} />
          Retour
        </Link>
        <h1 className="text-2xl font-bold text-[#1F2937] mb-6">Ajouter un produit</h1>

        <form className="space-y-6">
          {/* Photos */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <h2 className="font-bold text-[#1F2937] mb-4">Photos</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-square rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-[#22A849] hover:bg-[#F0FDF4] hover:text-[#22A849] transition-colors cursor-pointer col-span-1">
                <Camera size={28} />
                <span className="text-xs font-medium">Principale</span>
              </div>
              {[1, 2].map((i) => (
                <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-stone-100 flex items-center justify-center text-stone-300 hover:border-stone-200 transition-colors cursor-pointer">
                  <Camera size={22} />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] space-y-4">
            <h2 className="font-bold text-[#1F2937]">Informations</h2>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">Nom du produit</label>
              <Input placeholder="ex. Poulet entier frais fermier" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">Catégorie</label>
              <select className="w-full h-11 px-4 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#22A849]">
                {["Poulet", "Dinde", "Canard", "Lapin", "Œufs", "Abats", "Surgelés", "Charcuterie"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">Description</label>
              <Textarea rows={3} placeholder="Décrivez votre produit (origine, qualité, conditionnement…)" />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] space-y-4">
            <h2 className="font-bold text-[#1F2937]">Prix et stock</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600">Prix de vente (F CFA)</label>
                <Input type="number" placeholder="4500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600">Prix barré (optionnel)</label>
                <Input type="number" placeholder="5500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600">Stock disponible</label>
                <Input type="number" placeholder="20" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600">Unité</label>
                <select className="w-full h-11 px-4 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#22A849]">
                  {["pièce", "kg", "plateau", "barquette", "litre"].map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <h2 className="font-bold text-[#1F2937] mb-4">Livraison</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-[#22A849] w-4 h-4" defaultChecked />
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">Livraison disponible</p>
                  <p className="text-xs text-stone-400">Les acheteurs peuvent se faire livrer ce produit</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-[#22A849] w-4 h-4" />
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">Retrait en ferme uniquement</p>
                  <p className="text-xs text-stone-400">L&apos;acheteur doit venir chercher le produit</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost">Annuler</Button>
            <Button type="submit" className="flex-1">Publier le produit</Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
