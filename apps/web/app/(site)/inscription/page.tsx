"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Store, Bike, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import { register } from "@/lib/api";

const profiles = [
  { id: "client", role: "CLIENT", icon: User, label: "Client", desc: "Acheter des produits" },
  { id: "vendeur", role: "SELLER", icon: Store, label: "Vendeur", desc: "Vendre mes produits" },
  { id: "livreur", role: "DELIVERY", icon: Bike, label: "Livreur", desc: "Livrer les commandes" },
];

export default function InscriptionPage() {
  const router = useRouter();
  const [profile, setProfile] = useState("client");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedProfile = profiles.find((p) => p.id === profile)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const result = await register({
        fullName,
        phone,
        email: email || undefined,
        password,
        role: selectedProfile.role,
      });
      const role = result.user.role;
      if (role === "SELLER") {
        router.push("/vendeur");
      } else if (role === "DELIVERY") {
        router.push("/client");
      } else {
        router.push("/client");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <Link href="/" className="mb-8 inline-block">
        <img src="/assets/logo.png" alt="Guett Gui" className="h-10 object-contain" />
      </Link>

      <h1 className="text-2xl font-bold text-ink mb-1">Creer un compte</h1>
      <p className="text-muted text-sm mb-6">Choisissez votre profil</p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Profile selector */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
        {profiles.map(({ id, icon: Icon, label, desc }) => (
          <button
            key={id}
            type="button"
            onClick={() => setProfile(id)}
            className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all min-h-[44px] ${
              profile === id
                ? "border-brand bg-brand-soft"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${profile === id ? "bg-brand" : "bg-page"}`}>
              <Icon size={18} className={profile === id ? "text-white" : "text-muted"} />
            </div>
            <div className="text-center">
              <p className={`text-xs sm:text-sm font-bold ${profile === id ? "text-brand" : "text-ink"}`}>{label}</p>
              <p className="text-[10px] text-muted mt-0.5 hidden sm:block">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-light">Prenom</label>
            <Input
              placeholder="Prenom"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-light">Nom</label>
            <Input
              placeholder="Nom"
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-light">Telephone</label>
          <Input
            placeholder="+221 77 000 00 00"
            type="tel"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-light">Email</label>
          <Input
            placeholder="email@exemple.com"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-light">Mot de passe</label>
          <Input
            placeholder="Minimum 8 caracteres"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
          />
        </div>

        {profile === "vendeur" && (
          <div className="space-y-1.5 p-4 bg-brand-soft rounded-xl">
            <label className="text-xs font-semibold text-brand-dark">Nom de votre elevage / boutique</label>
            <Input
              placeholder="ex. Ferme Diallo"
              className="bg-white"
              value={shopName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShopName(e.target.value)}
            />
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Creer mon compte"}
          {!loading && <ArrowRight size={16} />}
        </Button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Deja un compte ?{" "}
        <Link href="/connexion" className="text-brand font-semibold hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
