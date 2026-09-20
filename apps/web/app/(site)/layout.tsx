import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileNav } from "@/components/mobile-nav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <SiteFooter />
      <MobileNav />
    </>
  );
}
