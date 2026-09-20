import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guett Gui — L'elevage, notre passion",
  description: "Marketplace de volaille fraiche au Senegal. Achetez en confiance aupres de vendeurs verifies.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
