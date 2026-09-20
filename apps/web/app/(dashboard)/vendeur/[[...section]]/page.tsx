import { DashboardShell } from "@/components/dashboard-shell";
import {
  OverviewPage,
  ProductsPage,
  OrdersPage,
  OrderDetailPage,
  DeliveryPage,
  StatsPage,
  SettingsPage,
} from "./seller-sections";

export default async function VendeurDashboardPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  const current = section?.[0] ?? "dashboard";
  const itemId = section?.[1] ? decodeURIComponent(section[1]) : undefined;

  const page =
    current === "produits" ? <ProductsPage /> :
    current === "commandes" && itemId ? <OrderDetailPage orderId={itemId} /> :
    current === "commandes" ? <OrdersPage /> :
    current === "livraison" ? <DeliveryPage /> :
    current === "statistiques" ? <StatsPage /> :
    current === "parametres" ? <SettingsPage /> :
    <OverviewPage />;

  return (
    <DashboardShell role="vendeur" userName="Vendeur">
      <div className="mx-auto max-w-7xl p-4 md:p-6">{page}</div>
    </DashboardShell>
  );
}
