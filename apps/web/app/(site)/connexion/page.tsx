"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Shield, Users, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import { productImages } from "@/lib/product-images";
import { login } from "@/lib/api";

export default function ConnexionPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login({ phone, password });
      const role = result.user.role;
      if (role === "SELLER") {
        router.push("/vendeur");
      } else {
        router.push("/client");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-block">
            <img src="/assets/logo.png" alt="Guett Gui" className="h-10 object-contain" />
          </Link>

          <h1 className="text-2xl font-bold text-ink mb-1">Bon retour !</h1>
          <p className="text-muted text-sm mb-8">Connectez-vous a votre compte</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-light">Telephone ou email</label>
              <Input
                placeholder="+221 77 000 00 00"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-ink-light">Mot de passe</label>
                <Link href="/support" className="text-xs text-brand hover:underline">Oublie ?</Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Se connecter"}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-brand font-semibold hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>

      {/* Visual side */}
      <div className="hidden lg:flex bg-ink relative overflow-hidden items-center justify-center">
        <div className="relative z-10 text-white text-center px-12">
          <img src={productImages.farm} alt="Ferme avicole" className="w-40 h-40 rounded-2xl object-cover mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-3">La volaille fraiche<br />a portee de clic</h2>
          <p className="text-gray-400 mb-10 text-sm leading-relaxed">
            Commandez en ligne, payez avec Dexpay, et recevez chez vous en 2h.
          </p>
          <div className="space-y-3">
            {[
              { icon: Shield, text: "Produits controles et certifies" },
              { icon: Users, text: "+150 eleveurs partenaires" },
              { icon: TrendingUp, text: "Note moyenne 4.8/5" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <Icon size={16} className="text-brand shrink-0" />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
