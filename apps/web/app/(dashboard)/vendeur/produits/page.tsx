import { DashboardShell } from "@/components/dashboard-shell";
import { ProductsPage } from "../[[...section]]/seller-sections";

export default function VendeurProduitsPage() {
  return (
    <DashboardShell role="vendeur" userName="Vendeur">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <ProductsPage />
      </div>
    </DashboardShell>
  );
}
