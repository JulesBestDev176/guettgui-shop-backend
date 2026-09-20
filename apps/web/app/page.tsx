"use client";

import { HeroSection } from "@/components/hero-section";
import {
  CategoriesSection,
  HowItWorksSection,
  LocationBar,
  PopularBoutiquesSection,
  PopularProductsSection,
  TrustBar,
} from "@/components/home-sections";
import { MobileNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <HeroSection />
        <LocationBar />
        <CategoriesSection />
        <PopularProductsSection />
        <PopularBoutiquesSection />
        <HowItWorksSection />
      </main>
      <TrustBar />
      <SiteFooter />
      <MobileNav />
    </>
  );
}
