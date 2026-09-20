"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Camera, CheckCircle, FileText, Loader2, MapPin, Rocket, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Progress, Textarea } from "@/components/ui/primitives";
import { registerSeller } from "@/lib/api";

const STEPS = [
  { title: "Votre profil" },
  { title: "Localisation" },
  { title: "Photos" },
  { title: "Documents" },
  { title: "Paiement" },
  { title: "Lancement" },
];

interface FormData {
  fullName: string;
  shopName: string;
  phone: string;
  email: string;
  password: string;
  description: string;
  productionTypes: string[];
  region: string;
  city: string;
  address: string;
}

export default function DevenirVendeurPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    shopName: "",
    phone: "",
    email: "",
    password: "",
    description: "",
    productionTypes: [],
    region: "Dakar",
    city: "",
    address: "",
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleProductionType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      productionTypes: prev.productionTypes.includes(type)
        ? prev.productionTypes.filter((t) => t !== type)
        : [...prev.productionTypes, type],
    }));
  };

  const handleNext = async () => {
    if (step === STEPS.length - 1) {
      setSubmitting(true);
      setSubmitError("");

      try {
        const res = await registerSeller({
          fullName: formData.fullName,
          shopName: formData.shopName,
          phone: formData.phone,
          password: formData.password,
          email: formData.email || undefined,
          city: formData.city,
          region: formData.region,
          description: formData.description || undefined,
        });
        if (res.accessToken) {
          localStorage.setItem("gg-token", res.accessToken);
        }
        setStep(STEPS.length);
      } catch (err: unknown) {
        setSubmitError(err instanceof Error ? err.message : "Erreur lors de la soumission. Veuillez reessayer.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  if (step === STEPS.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-brand-soft">
          <CheckCircle size={44} className="text-brand" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-ink">Dossier soumis</h1>
        <p className="mb-6 text-sm leading-relaxed text-muted">
          Votre dossier de vendeur est soumis. Notre equipe va verifier vos informations sous 24-48h. Vous serez notifie par SMS.
        </p>
        <Button size="lg" className="w-full" onClick={() => router.push("/")}>Retour a l&apos;accueil</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <section className="mb-5 rounded-xl bg-ink p-5 text-white md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Devenir vendeur</h1>
            <p className="font-body mt-2 max-w-xl text-sm leading-6 text-gray-400">
              Completez votre dossier vendeur en quelques minutes.
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-4 py-3 text-left md:text-right">
            <p className="font-body text-xs text-gray-400">Etape en cours</p>
            <p className="text-lg font-bold">{STEPS[step].title}</p>
          </div>
        </div>
        <Progress value={progress} className="mt-5 bg-white/15" />
      </section>

      <section className="mb-5 rounded-xl bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
          {STEPS.map(({ title }, i) => {
            const active = i === step;
            const done = i < step;

            return (
              <div key={title} className="flex items-center">
                {i > 0 && (
                  <span className={`h-0.5 w-4 sm:w-6 shrink-0 ${i <= step ? "bg-brand" : "bg-gray-200"}`} />
                )}
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-label={`Etape ${i + 1}: ${title}`}
                  title={title}
                  className="group flex items-center justify-center"
                >
                  <span
                    className={`flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-bold transition ${
                      active
                        ? "border-brand bg-brand text-white"
                        : done
                          ? "border-brand bg-white text-brand"
                          : "border-gray-200 bg-page text-muted group-hover:border-brand"
                    }`}
                  >
                    {i + 1}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-body text-xs text-muted">Etape {step + 1} sur {STEPS.length}</p>
            <h2 className="text-lg font-bold text-ink">{STEPS[step].title}</h2>
          </div>
          <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">{Math.round(progress)}%</span>
        </div>
      </section>

      <section className="mb-6 rounded-xl bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 border-b border-gray-100 pb-4">
          <p className="font-body text-xs font-semibold uppercase tracking-wide text-brand">Etape {step + 1}</p>
          <h2 className="mt-1 text-xl font-bold text-ink">{STEPS[step].title}</h2>
        </div>

        {step === 0 && <ProfileStep formData={formData} updateField={updateField} toggleProductionType={toggleProductionType} />}
        {step === 1 && <LocationStep formData={formData} updateField={updateField} />}
        {step === 2 && <PhotosStep />}
        {step === 3 && <DocumentsStep />}
        {step === 4 && <PaymentStep />}
        {step === 5 && <LaunchStep />}
      </section>

      {submitError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{submitError}</div>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={16} />
            Retour
          </Button>
        )}
        <Button className="ml-auto" onClick={handleNext} disabled={submitting}>
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {step === STEPS.length - 1 ? (submitting ? "Envoi..." : "Soumettre le dossier") : "Continuer"}
          {!submitting && <ArrowRight size={16} />}
        </Button>
      </div>
    </div>
  );
}

function ProfileStep({ formData, updateField, toggleProductionType }: {
  formData: FormData;
  updateField: (field: keyof FormData, value: string) => void;
  toggleProductionType: (type: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-light">Nom complet</label>
        <Input placeholder="ex. Mamadou Diallo" value={formData.fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("fullName", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-light">Nom de la ferme / boutique</label>
        <Input placeholder="ex. Ferme Diallo" value={formData.shopName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("shopName", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-light">Telephone</label>
        <Input placeholder="+221 77 000 00 00" type="tel" value={formData.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("phone", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-light">Email (optionnel)</label>
        <Input placeholder="vendeur@email.com" type="email" value={formData.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("email", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-light">Mot de passe</label>
        <Input placeholder="8 caracteres minimum" type="password" value={formData.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("password", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-light">Description</label>
        <Textarea rows={3} placeholder="Decrivez votre elevage, vos produits, votre savoir-faire" value={formData.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("description", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-light">Type de production</label>
        <div className="flex flex-wrap gap-2">
          {["Poulet", "Dinde", "Canard", "Oeufs", "Lapin", "Autre"].map((type) => (
            <label key={type} className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:text-brand">
              <input type="checkbox" className="accent-brand" checked={formData.productionTypes.includes(type)} onChange={() => toggleProductionType(type)} />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function LocationStep({ formData, updateField }: {
  formData: FormData;
  updateField: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-light">Region</label>
        <select
          className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-brand"
          value={formData.region}
          onChange={(e) => updateField("region", e.target.value)}
        >
          {["Dakar", "Thies", "Saint-Louis", "Ziguinchor", "Kaolack", "Diourbel", "Fatick", "Kolda", "Tambacounda", "Louga"].map((region) => (
            <option key={region}>{region}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-light">Ville / Commune</label>
        <Input placeholder="ex. Thies Nord" value={formData.city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("city", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink-light">Adresse precise</label>
        <Input placeholder="Quartier, repere" value={formData.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("address", e.target.value)} />
      </div>
      <div className="flex gap-2 rounded-xl bg-brand-soft p-4 text-sm text-brand-dark">
        <MapPin size={16} className="mt-0.5 shrink-0" />
        <span>Votre localisation permet aux acheteurs de calculer les frais de livraison.</span>
      </div>
    </div>
  );
}

function PhotosStep() {
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    setPhotos((current) => [
      ...current,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    event.target.value = "";
  };

  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-muted">Ajoutez quelques photos, nous verifierons apres.</p>

      <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-page p-5 text-center transition hover:border-brand hover:bg-brand-soft">
        <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
          <Upload size={22} />
        </span>
        <span className="text-sm font-bold text-ink">Ajouter des photos</span>
        <span className="font-body max-w-sm text-xs leading-5 text-muted">
          Selectionnez une ou plusieurs images depuis votre telephone ou ordinateur.
        </span>
      </label>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <div key={photo} className="group relative overflow-hidden rounded-xl bg-white shadow-sm">
              <img src={photo} alt={`Photo ajoutee ${index + 1}`} className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}
                aria-label="Supprimer cette photo"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-brand-soft p-3 text-sm text-brand-dark">
          <Camera size={16} className="shrink-0" />
          <span>Les photos aident juste a valider le vendeur. Elles pourront etre revues par l&apos;equipe.</span>
        </div>
      )}
    </div>
  );
}

function DocumentsStep() {
  const [files, setFiles] = useState<Record<string, string>>({});
  const documents = [
    { label: "CNI ou Passeport", desc: "Document d'identite du vendeur", required: true },
    { label: "Attestation veterinaire", desc: "Si disponible", required: false },
    { label: "Registre de commerce", desc: "Pour les entreprises formelles", required: false },
  ];

  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-muted">La CNI ou le passeport est obligatoire. Les autres documents peuvent etre ajoutes plus tard.</p>
      {documents.map((doc) => (
        <div key={doc.label} className="flex items-center gap-3 rounded-xl bg-page p-3 sm:gap-4 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
            <FileText size={18} className="text-muted" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-ink">{doc.label}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${doc.required ? "bg-brand-soft text-brand" : "bg-gray-100 text-muted"}`}>
                {doc.required ? "Obligatoire" : "Optionnel"}
              </span>
            </div>
            <p className="text-xs text-muted">{doc.desc}</p>
            {files[doc.label] && (
              <p className="mt-1 truncate text-xs font-semibold text-brand">{files[doc.label]}</p>
            )}
          </div>
          {files[doc.label] ? (
            <button
              type="button"
              onClick={() => setFiles((current) => {
                const next = { ...current };
                delete next[doc.label];
                return next;
              })}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-500 transition hover:bg-red-50"
              aria-label="Retirer ce document"
            >
              <Trash2 size={15} />
            </button>
          ) : (
            <label className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-white px-3 text-xs font-bold text-ink transition hover:text-brand">
              Ajouter
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setFiles((current) => ({ ...current, [doc.label]: file.name }));
                  }
                  event.target.value = "";
                }}
              />
            </label>
          )}
        </div>
      ))}
    </div>
  );
}

function PaymentStep() {
  const methods = [
    { id: "wave", label: "Wave", logo: "/payment-logos/wave.jpg" },
    { id: "orange-money", label: "Orange Money", logo: "/payment-logos/orange-money.png" },
    { id: "free-money", label: "Free Money", logo: "/payment-logos/free-money.png" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Choisissez comment recevoir vos paiements.</p>
      <div className="space-y-3">
        {methods.map((method) => (
          <label key={method.id} className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
            <input type="radio" name="payout" className="accent-brand" />
            <span className="flex h-12 w-16 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm">
              <img src={method.logo} alt={method.label} className="max-h-full max-w-full object-contain" />
            </span>
            <span className="text-sm font-semibold">{method.label}</span>
          </label>
        ))}
      </div>
      <Input placeholder="Numero de telephone" />
    </div>
  );
}

function LaunchStep() {
  return (
    <div className="space-y-4 py-4 text-center">
      <div className="bg-brand mx-auto flex h-20 w-20 items-center justify-center rounded-2xl">
        <Rocket size={36} className="text-white" />
      </div>
      <h2 className="text-xl font-bold text-ink">Pret a lancer ?</h2>
      <p className="text-sm leading-relaxed text-muted">
        Verifiez vos informations et soumettez votre dossier. Notre equipe l&apos;examinera sous 24-48h.
      </p>
      <div className="space-y-1.5 rounded-xl bg-brand-soft p-4 text-left text-sm">
        {["Profil elevage complete", "Localisation renseignee", "Photos ajoutees", "Documents fournis", "Mode de paiement configure"].map((item) => (
          <div key={item} className="flex items-center gap-2 text-brand-dark">
            <CheckCircle size={14} className="shrink-0 text-brand" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
