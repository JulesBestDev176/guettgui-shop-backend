import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guettgui.sn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Guett Gui — Marketplace d'élevage au Sénégal",
    template: "%s — Guett Gui",
  },
  description:
    "Achetez volailles, moutons, bovins, œufs et produits d'élevage auprès d'éleveurs vérifiés partout au Sénégal. Livraison disponible dans 14 régions.",
  keywords: ["élevage Sénégal", "volaille", "mouton", "poulet", "marketplace agricole", "achat animaux Dakar"],
  authors: [{ name: "Guett Gui" }],
  creator: "Guett Gui",
  publisher: "Guett Gui",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: SITE_URL,
    siteName: "Guett Gui",
    title: "Guett Gui — Marketplace d'élevage au Sénégal",
    description:
      "Achetez volailles, moutons, bovins, œufs et produits d'élevage auprès d'éleveurs vérifiés au Sénégal.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Guett Gui" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guett Gui — Marketplace d'élevage au Sénégal",
    description: "Achetez auprès d'éleveurs vérifiés partout au Sénégal.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#22A849",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
