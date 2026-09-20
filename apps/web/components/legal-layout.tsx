import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  breadcrumb?: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, subtitle, lastUpdated, breadcrumb, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-1.5 font-body text-xs text-muted">
            <Link href="/" className="hover:text-brand">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-ink">{breadcrumb ?? title}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink md:text-3xl">{title}</h1>
          {subtitle && (
            <p className="font-body mt-2 text-sm text-muted">{subtitle}</p>
          )}
          {lastUpdated && (
            <p className="font-body mt-3 text-xs text-muted">
              Dernière mise à jour : <strong>{lastUpdated}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <div className="prose-legal">{children}</div>
      </div>
    </div>
  );
}

/* ── Section block ── */
export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-4 text-lg font-extrabold text-ink">{title}</h2>
      <div className="space-y-3 font-body text-sm leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

/* ── FAQ accordion item ── */
export function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-border bg-white">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink marker:hidden list-none">
        {question}
        <ChevronRight size={16} className="shrink-0 text-muted transition-transform group-open:rotate-90" />
      </summary>
      <div className="border-t border-border px-5 pb-4 pt-3 font-body text-sm leading-relaxed text-ink/80">
        {children}
      </div>
    </details>
  );
}
