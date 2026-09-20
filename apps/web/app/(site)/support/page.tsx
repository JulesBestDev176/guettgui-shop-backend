"use client";
import { useState } from "react";
import { Phone, Mail, MessageCircle, ChevronDown, ChevronUp, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/primitives";
import { createSupportTicket } from "@/lib/api";

const faqs = [
  { q: "Comment passer une commande ?", a: "Parcourez notre catalogue, ajoutez des produits a votre panier et finalisez votre commande en choisissant votre mode de livraison et de paiement." },
  { q: "Quels sont les modes de paiement acceptes ?", a: "Nous acceptons Wave, Orange Money, et le paiement en especes a la livraison. D'autres methodes seront bientot disponibles." },
  { q: "Quelle est la zone de livraison ?", a: "Nous livrons actuellement dans tout le Grand Dakar (Dakar, Pikine, Guediawaye, Rufisque, Bargny). D'autres zones sont en cours d'expansion." },
  { q: "Comment devenir vendeur sur la plateforme ?", a: "Cliquez sur 'Devenir vendeur', completez le formulaire en 6 etapes avec vos informations et documents, puis notre equipe validera votre dossier sous 24-48h." },
  { q: "Que faire si ma commande est endommagee ?", a: "Contactez-nous dans les 2h suivant la reception avec des photos. Nous procederons a un remboursement ou remplacement immediat." },
  { q: "Comment suivre ma commande ?", a: "Rendez-vous dans la section 'Suivi commande' et entrez votre numero de commande. Vous pouvez aussi activer les notifications SMS." },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    subject: "Commande en cours",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.contact.trim() || !formData.message.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createSupportTicket({
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData({ name: "", contact: "", subject: "Commande en cours", message: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi. Veuillez reessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-white py-10 sm:py-14 px-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Centre d&apos;aide</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Notre equipe est disponible 7j/7 pour vous aider. Comment pouvons-nous vous aider aujourd&apos;hui ?
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Contact channels */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Phone, label: "Telephone", value: "+221 33 800 00 00", desc: "Lun-Sam 8h-20h", color: "text-brand bg-brand-soft" },
            { icon: MessageCircle, label: "WhatsApp", value: "Chat en direct", desc: "Reponse en < 30 min", color: "text-brand bg-brand-soft" },
            { icon: Mail, label: "Email", value: "support@guettgui.sn", desc: "Reponse en 2h", color: "text-brand bg-brand-soft" },
          ].map(({ icon: Icon, label, value, desc, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 text-center shadow-sm">
              <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-ink text-sm">{label}</h3>
              <p className="text-brand font-semibold text-sm mt-1">{value}</p>
              <p className="text-xs text-muted mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-ink mb-5">Questions frequentes</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <button
                    className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-page transition-colors min-h-[48px]"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-sm text-ink">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp size={16} className="text-brand shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-muted shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-muted leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-xl font-bold text-ink mb-5">Nous contacter</h2>

            {submitted ? (
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
                  <CheckCircle size={32} className="text-brand" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">Message envoye</h3>
                <p className="text-sm text-muted mb-5">Nous avons bien recu votre message. Notre equipe vous repondra dans les plus brefs delais.</p>
                <Button variant="ghost" onClick={() => setSubmitted(false)}>Envoyer un autre message</Button>
              </div>
            ) : (
              <form className="bg-white rounded-xl p-6 shadow-sm space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-light">Votre nom</label>
                  <Input
                    placeholder="Prenom Nom"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("name", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-light">Telephone / Email</label>
                  <Input
                    placeholder="+221 77 000 00 00 ou email"
                    value={formData.contact}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("contact", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-light">Sujet</label>
                  <select
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand"
                    value={formData.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                  >
                    {["Commande en cours", "Probleme de livraison", "Remboursement", "Compte vendeur", "Autre"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-light">Message</label>
                  <Textarea
                    rows={4}
                    placeholder="Decrivez votre probleme en detail..."
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("message", e.target.value)}
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
                )}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  {submitting ? "Envoi..." : "Envoyer"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
