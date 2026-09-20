import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <Link href="/" className="shrink-0">
      <img
        src="/assets/logo.png"
        alt="Guett Gui"
        className={cn(
          "object-contain",
          compact ? "h-8" : "h-10",
          light && "brightness-0 invert"
        )}
      />
    </Link>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="text-xl font-bold text-ink md:text-2xl">{title}</h2>
      {action && (
        <Link href="/catalogue" className="font-body text-sm font-medium text-brand hover:underline">
          {action}
        </Link>
      )}
    </div>
  );
}
