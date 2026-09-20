"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle, Loader2, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Progress } from "@/components/ui/primitives";
import { registerSeller } from "@/lib/api";

/* ── Steps ───────────────────────────────── */
const STEPS = [
  { title: "Votre compte",    short: "Compte" },
  { title: "Localisation",    short: "Localisation" },
];

const REGIONS = [
  "Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor",
  "Diourbel", "Fatick", "Kolda", "Tambacounda", "Louga", "Matam", "Kédougou", "Sédhiou",
];

/* ── Field wrapper ───────────────────────── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-[13px] font-semibold text-ink">{label}</label>
        {hint && <span className="font-body text-[11px] text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls = "h-11 w-full rounded-xl border border-border bg-page px-4 text-sm text-ink outline-none placeholder:text-muted focus:border-brand transition-colors";
const selectCls = "h-11 w-full rounded-xl border border-border bg-page px-4 text-sm text-ink outline-none focus:border-brand transition-colors appearance-none";

/* ── Main page ───────────────────────────── */
export default function DevenirVendeurPage() {
  const router = useRouter();
  const [step, setStep]           = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  /* Step 1 */
  const [fullName,  setFullName]  = useState("");
  const [shopName,  setShopName]  = useState("");
  const [phone,     setPhone]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");

  /* Step 2 */
  const [region, setRegion] = useState("");
  const [city,   setCity]   = useState("");

  const progress = ((step + 1) / STEPS.length) * 100;

  const step1Valid = fullName.trim() && shopName.trim() && phone.trim()
    && password.length >= 6 && password === confirm;
  const step2Valid = !!region;

  const handleNext = async () => {
    if (step === 0) { setStep(1); return; }

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await registerSeller({
        fullName, shopName, phone, password,
        region, city: city || undefined,
      });
      if (res.accessToken) localStorage.setItem("gg-token", res.accessToken);
      setStep(2);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Erreur lors de la soumission. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success ── */
  if (step === 2) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft">
          <CheckCircle size={40} className="text-brand" />
        </div>
        <h1 className="text-2xl font-extrabold text-ink">Bienvenue, {fullName.split(" ")[0]} !</h1>
        <p className="font-body mt-3 text-sm leading-relaxed text-muted">
          Votre boutique <strong className="text-ink">{shopName}</strong> a été créée.
          Notre équipe va vérifier votre profil sous 24–48 h.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-white p-5 text-left shadow-sm">
          <p className="mb-3 text-sm font-bold text-ink">À compléter depuis votre profil</p>
          {[
            "Ajouter une photo de profil et une couverture",
            "Décrire votre élevage",
            "Publier vos premiers produits",
            "Renseigner votre adresse précise",
            "Ajouter vos documents de vérification",
          ].map((s) => (
            <div key={s} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-brand/30">
                <ArrowRight size={10} className="text-brand" />
              </span>
              <span className="font-body text-sm text-ink">{s}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => router.push("/vendeur")}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-brand text-sm font-bold text-white"
          >
            Aller à mon tableau de bord
          </button>
          <button
            onClick={() => router.push("/")}
            className="font-body text-sm font-semibold text-brand hover:underline"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">

      {/* ── Top card (dark) ── */}
      <section className="mb-6 rounded-2xl bg-ink p-5 text-white md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">Devenir vendeur</h1>
            <p className="font-body mt-2 max-w-md text-sm leading-relaxed text-gray-400">
              Créez votre boutique en 2 minutes. Vous pourrez tout compléter après.
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-white/10 px-5 py-3 text-left md:text-right">
            <p className="font-body text-[11px] uppercase tracking-wide text-gray-400">Étape en cours</p>
            <p className="mt-0.5 text-lg font-bold">{STEPS[step].title}</p>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-body text-xs text-gray-400">{step + 1} / {STEPS.length} étapes</span>
            <span className="font-body text-xs font-semibold text-white">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-white/15" />
        </div>
      </section>

      {/* ── Timeline stepper ── */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="relative flex items-start px-12 pt-5 pb-3 sm:px-20">
          {/* track */}
          <div className="absolute left-1/4 right-1/4 top-[calc(theme(spacing.5)+19px)] h-0.5 bg-gray-200" />
          <div
            className="absolute left-1/4 top-[calc(theme(spacing.5)+19px)] h-0.5 bg-brand transition-all duration-500"
            style={{ width: step >= 1 ? "50%" : "0%" }}
          />

          {STEPS.map(({ short }, i) => {
            const done   = i < step;
            const active = i === step;
            return (
              <button
                key={short}
                type="button"
                onClick={() => done && setStep(i)}
                className="relative z-10 flex flex-1 flex-col items-center gap-2 focus:outline-none"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-extrabold transition-all duration-300 ${
                  done   ? "border-brand bg-brand text-white" :
                  active ? "border-brand bg-white text-brand ring-4 ring-brand/10" :
                           "border-gray-200 bg-white text-gray-400"
                }`}>
                  {done ? <Check size={16} strokeWidth={3} /> : i + 1}
                </span>
                <span className={`text-center text-[12px] font-semibold leading-tight ${
                  active ? "text-brand" : done ? "text-ink" : "text-muted"
                }`}>
                  {short}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Form card ── */}
      <section className="mb-6 rounded-2xl border border-border bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4 md:px-6">
          <span className="inline-block rounded-full bg-brand-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
            Étape {step + 1}
          </span>
          <h2 className="mt-1.5 text-lg font-extrabold text-ink">{STEPS[step].title}</h2>
        </div>

        <div className="px-5 py-5 md:px-6">
          {step === 0 && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom complet">
                  <Input className={inputCls} placeholder="ex. Mamadou Diallo"
                    value={fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} />
                </Field>
                <Field label="Nom de la boutique">
                  <Input className={inputCls} placeholder="ex. Ferme Diallo"
                    value={shopName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShopName(e.target.value)} />
                </Field>
              </div>

              <Field label="Téléphone">
                <div className="flex gap-2">
                  <span className="flex h-11 items-center rounded-xl border border-border bg-white px-3 text-sm font-semibold text-ink shrink-0">
                    +221
                  </span>
                  <input className={inputCls} placeholder="77 000 00 00" type="tel"
                    value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mot de passe" hint="6 caractères min.">
                  <Input className={inputCls} placeholder="••••••••" type="password"
                    value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                </Field>
                <Field label="Confirmer le mot de passe">
                  <Input
                    className={`${inputCls} ${confirm && confirm !== password ? "border-red-400 focus:border-red-400" : ""}`}
                    placeholder="••••••••" type="password"
                    value={confirm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)} />
                  {confirm && confirm !== password && (
                    <p className="text-[11px] font-semibold text-red-500">Les mots de passe ne correspondent pas.</p>
                  )}
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Région">
                  <div className="relative">
                    <select className={selectCls} value={region} onChange={(e) => setRegion(e.target.value)}>
                      <option value="">Choisir une région</option>
                      {REGIONS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </Field>
                <Field label="Ville / Commune" hint="optionnel">
                  <input className={inputCls} placeholder="ex. Rufisque"
                    value={city} onChange={(e) => setCity(e.target.value)} />
                </Field>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <p className="font-body leading-relaxed">
                  Votre région permet aux acheteurs de vous trouver. L&apos;adresse précise peut être ajoutée plus tard.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {submitError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</div>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-1.5">
            <ArrowLeft size={15} /> Retour
          </Button>
        )}
        <Button
          className="ml-auto gap-1.5"
          onClick={handleNext}
          disabled={submitting || (step === 0 ? !step1Valid : !step2Valid)}
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {step === STEPS.length - 1
            ? submitting ? "Création…" : "Créer ma boutique"
            : "Continuer"}
          {!submitting && <ArrowRight size={15} />}
        </Button>
      </div>
    </div>
  );
}
