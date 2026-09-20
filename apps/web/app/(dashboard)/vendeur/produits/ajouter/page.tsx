"use client";
import { useState, useEffect, useRef } from "react";
import { Camera, ArrowLeft, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/primitives";
import { listCategories, createSellerProduct, uploadImage } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function AjouterProduitPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [images,     setImages]     = useState<string[]>([]);

  const [name,        setName]        = useState("");
  const [categoryId,  setCategoryId]  = useState("");
  const [description, setDescription] = useState("");
  const [basePrice,   setBasePrice]   = useState("");
  const [stock,       setStock]       = useState("");
  const [unit,        setUnit]        = useState("pièce");

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch(() => {});
  }, []);

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      setImages((prev) => [...prev, url].slice(0, 3));
    } catch {
      // keep going without image
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !basePrice || !stock) {
      setError("Remplissez tous les champs obligatoires.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await createSellerProduct({
        name,
        categoryId,
        description: description || undefined,
        basePrice: Number(basePrice),
        unit,
        stock: Number(stock),
      });
      router.push("/vendeur");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell role="vendeur" userName="">
      <div className="p-6 max-w-2xl">
        <Link href="/vendeur" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-[#22A849] mb-6 w-fit">
          <ArrowLeft size={16} />
          Retour
        </Link>
        <h1 className="text-2xl font-bold text-[#1F2937] mb-6">Ajouter un produit</h1>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <h2 className="font-bold text-[#1F2937] mb-4">Photos</h2>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-[#22A849] hover:bg-[#F0FDF4] hover:text-[#22A849] transition-colors cursor-pointer"
              >
                <Camera size={28} />
                <span className="text-xs font-medium">Ajouter</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
              {[0, 1, 2].slice(0, 2).map((i) => (
                images[i] ? (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-stone-100">
                    <img src={images[i]} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-stone-100 flex items-center justify-center text-stone-300">
                    <Camera size={22} />
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] space-y-4">
            <h2 className="font-bold text-[#1F2937]">Informations</h2>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">Nom du produit *</label>
              <Input
                placeholder="ex. Poulet entier frais fermier"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">Catégorie *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#22A849]"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">Description</label>
              <Textarea
                rows={3}
                placeholder="Décrivez votre produit (origine, qualité, conditionnement…)"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] space-y-4">
            <h2 className="font-bold text-[#1F2937]">Prix et stock</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600">Prix de vente (FCFA) *</label>
                <Input
                  type="number"
                  placeholder="4500"
                  value={basePrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBasePrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600">Stock disponible *</label>
                <Input
                  type="number"
                  placeholder="20"
                  value={stock}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStock(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-stone-600">Unité</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#22A849]"
                >
                  {["pièce", "kg", "plateau", "barquette", "litre", "sac", "carton"].map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/vendeur">
              <Button type="button" variant="ghost">Annuler</Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Publier le produit"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
