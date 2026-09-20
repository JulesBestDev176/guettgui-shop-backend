import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit3,
  Heart,
  Home,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Trash2,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/primitives";
import { productImages } from "@/lib/product-images";

const orders = [
  { id: "CMD-20260626-0042", status: "En livraison", date: "26 juin 2026", total: "17 200 F", items: "3 articles", eta: "14 h 30", address: "Dakar Plateau, Rue Carnot", image: productImages.wholeChicken, vendor: "Ferme Keur Massar", payment: "Dexpay", driver: "Moussa Diop", phone: "+221 77 450 22 11" },
  { id: "CMD-20260619-0031", status: "Livre", date: "19 juin 2026", total: "8 900 F", items: "2 articles", eta: "Terminee", address: "Almadies, Immeuble Ocean", image: productImages.chickenCuts, vendor: "Boucherie Premium SN", payment: "Dexpay", driver: "Awa Ndiaye", phone: "+221 76 300 11 90" },
  { id: "CMD-20260612-0018", status: "Livre", date: "12 juin 2026", total: "4 500 F", items: "1 article", eta: "Terminee", address: "Mermoz, pharmacie principale", image: productImages.eggs, vendor: "Pondeuses du Sine", payment: "Dexpay", driver: "Ibrahima Fall", phone: "+221 78 111 49 20" },
  { id: "CMD-20260604-0009", status: "Annulee", date: "4 juin 2026", total: "12 000 F", items: "1 article", eta: "Remboursee", address: "Sacre-Coeur", image: productImages.turkey, vendor: "Ferme Senghor", payment: "Dexpay", driver: "Non assigne", phone: "-" },
];

const orderLines: Record<string, { name: string; qty: string; price: string; image: string }[]> = {
  "CMD-20260626-0042": [
    { name: "Poulet de chair 2 kg", qty: "2 pieces", price: "7 000 F", image: productImages.wholeChicken },
    { name: "Plateau 30 oeufs frais", qty: "1 plateau", price: "4 200 F", image: productImages.eggs },
    { name: "Frais de livraison", qty: "Dakar Plateau", price: "6 000 F", image: productImages.chickenCuts },
  ],
  "CMD-20260619-0031": [
    { name: "Morceaux de poulet", qty: "2 barquettes", price: "6 900 F", image: productImages.chickenCuts },
    { name: "Livraison express", qty: "Almadies", price: "2 000 F", image: productImages.wholeChicken },
  ],
  "CMD-20260612-0018": [
    { name: "Plateau 30 oeufs frais", qty: "1 plateau", price: "4 500 F", image: productImages.eggs },
  ],
  "CMD-20260604-0009": [
    { name: "Dinde entiere prete a cuire", qty: "1 piece", price: "12 000 F", image: productImages.turkey },
  ],
};

const trackingSteps = [
  { label: "Commande validee", time: "10 h 12" },
  { label: "Preparation vendeur", time: "11 h 05" },
  { label: "En livraison", time: "13 h 20" },
  { label: "Livree", time: "14 h 30" },
];

const favorites = [
  { name: "Poulet de chair 2 kg", vendor: "Ferme Keur Massar", city: "Thies", price: "3 500 F", rating: 4.8, image: productImages.wholeChicken },
  { name: "Plateau 30 oeufs frais", vendor: "Pondeuses du Sine", city: "Fatick", price: "4 200 F", rating: 4.6, image: productImages.eggs },
  { name: "Dinde entiere prete a cuire", vendor: "Ferme Senghor", city: "Rufisque", price: "12 000 F", rating: 4.8, image: productImages.turkey },
  { name: "Canard vide sur commande", vendor: "Elevage Kaolack", city: "Kaolack", price: "7 500 F", rating: 4.5, image: productImages.duck },
];

const addresses = [
  { label: "Maison", value: "Dakar Plateau, Rue Carnot, Villa 34", note: "Adresse par defaut", active: true },
  { label: "Bureau", value: "Almadies, Immeuble Ocean, 4e etage", note: "Livraison en semaine", active: false },
  { label: "Famille", value: "Mermoz, pres de la pharmacie principale", note: "Appeler avant livraison", active: false },
];

const statusColor: Record<string, string> = {
  "En livraison": "bg-[#F0FDF4] text-[#1A8A3A]",
  Livre: "bg-[#DCFCE7] text-[#15803D]",
  Annulee: "bg-[#F1F5F9] text-[#64748B]",
};

function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.4px] text-[#1F2937] md:text-3xl">{title}</h1>
        <p className="font-body mt-1 text-sm text-[#6B7280]">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] ${color}`}>
        <Icon size={19} />
      </div>
      <p className="text-2xl font-extrabold text-[#1F2937]">{value}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="font-body text-xs text-[#6B7280]">{label}</p>
        <span className="rounded-full bg-[#FAFAFA] px-2 py-0.5 text-[10px] font-bold text-[#6B7280]">{sub}</span>
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: (typeof orders)[number] }) {
  return (
    <Link href={`/client/commandes/${order.id}`} className="grid gap-3 rounded-[14px] border border-[#F1F1F1] bg-white p-4 transition hover:border-[#22A849]/30 hover:bg-[#FAFAFA] md:grid-cols-[auto_1fr_auto_auto_auto] md:items-center">
      <img src={order.image} alt={order.id} className="h-12 w-12 rounded-[12px] object-cover" />
      <div className="min-w-0">
        <p className="font-semibold text-[#1F2937]">{order.id}</p>
        <p className="font-body text-xs text-[#6B7280]">{order.date} · {order.items} · {order.address}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={`rounded-full px-3 py-1 ${statusColor[order.status]}`}>{order.status}</Badge>
        <span className="font-body text-xs text-[#9CA3AF]">{order.eta}</span>
      </div>
      <p className="font-bold text-[#1F2937] md:text-right">{order.total}</p>
      <ArrowRight size={17} className="hidden text-[#9CA3AF] md:block" />
    </Link>
  );
}

function OverviewPage() {
  return (
    <>
      <section className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[18px] bg-[#1F2937] p-6 text-white shadow-[0_12px_32px_rgba(31,41,55,.16)]">
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-[#22A849]/25" />
          <div className="relative">
            <p className="font-body text-sm text-[#9CA3AF]">Bonjour</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.6px]">Fatou Sarr</h1>
            <p className="font-body mt-2 max-w-xl text-sm leading-6 text-[#D1D5DB]">
              Suivez vos commandes, retrouvez vos favoris et commandez rapidement vos produits frais.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogue" className="inline-flex h-11 items-center justify-center gap-2 rounded-[11px] bg-[#22A849] px-5 text-sm font-bold text-white">
                Commander
                <ArrowRight size={16} />
              </Link>
              <Link href="/suivi-commande" className="inline-flex h-11 items-center justify-center rounded-[11px] border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white">
                Suivre une commande
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-body text-xs text-[#6B7280]">Commande active</p>
              <h2 className="font-bold text-[#1F2937]">En livraison</h2>
            </div>
            <Badge className="rounded-full bg-[#F0FDF4] px-3 py-1 text-[#1A8A3A]">Arrive a 14 h 30</Badge>
          </div>
          <div className="flex items-center gap-4 rounded-[14px] bg-[#FAFAFA] p-3">
            <img src={productImages.wholeChicken} alt="Commande en livraison" className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#1F2937]">Poulet de chair x2 + oeufs</p>
              <p className="font-body text-xs text-[#6B7280]">Ferme Keur Massar · Dakar Plateau</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
                <div className="h-full w-[72%] rounded-full bg-[#22A849]" />
              </div>
            </div>
          </div>
          <Link href="/suivi-commande" className="mt-4 flex h-10 items-center justify-center rounded-[10px] border border-[#E5E7EB] text-sm font-semibold text-[#1F2937]">
            Voir le suivi
          </Link>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Commandes" value="12" sub="Total" icon={ShoppingBag} color="bg-[#F0FDF4] text-[#22A849]" />
        <StatCard label="En cours" value="1" sub="Active" icon={Truck} color="bg-[#F0FDF4] text-[#1A8A3A]" />
        <StatCard label="Depense" value="148 000 F" sub="Ce mois" icon={Wallet} color="bg-[#F1F5F9] text-[#475569]" />
        <StatCard label="Favoris" value="8" sub="Produits" icon={Heart} color="bg-[#F0FDF4] text-[#22A849]" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">
        <OrdersPanel compact />
        <div className="space-y-6">
          <QuickActions />
          <FavoritesPanel compact />
          <SecurityCard />
        </div>
      </section>
    </>
  );
}

function OrdersPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1F2937]">Commandes recentes</h2>
          <p className="font-body text-xs text-[#6B7280]">Vos dernieres commandes et leur statut</p>
        </div>
        {compact && <Link href="/client/commandes" className="text-xs font-bold text-[#22A849]">Voir tout</Link>}
      </div>
      <div className="space-y-3">
        {(compact ? orders.slice(0, 3) : orders).map((order) => <OrderRow key={order.id} order={order} />)}
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <h2 className="mb-4 text-lg font-bold text-[#1F2937]">Actions rapides</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Rechercher", href: "/catalogue", icon: Search },
          { label: "Suivi", href: "/suivi-commande", icon: Clock },
          { label: "Adresses", href: "/client/adresses", icon: MapPin },
          { label: "Favoris", href: "/client/favoris", icon: Heart },
        ].map(({ label, href, icon: Icon }) => (
          <Link key={label} href={href} className="rounded-[13px] border border-[#E5E7EB] bg-[#FAFAFA] p-3 text-center transition hover:border-[#22A849] hover:bg-[#F0FDF4]">
            <Icon size={20} className="mx-auto mb-2 text-[#22A849]" />
            <span className="text-xs font-semibold text-[#1F2937]">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FavoritesPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1F2937]">{compact ? "Favoris" : "Mes favoris"}</h2>
        <Star size={18} className="fill-[#F59E0B] text-[#F59E0B]" />
      </div>
      <div className={compact ? "space-y-3" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"}>
        {(compact ? favorites.slice(0, 2) : favorites).map((item) => (
          <div key={item.name} className={compact ? "flex items-center gap-3" : "rounded-[14px] border border-[#F1F1F1] bg-[#FAFAFA] p-3"}>
            <img src={item.image} alt={item.name} className={compact ? "h-12 w-12 rounded-[10px] object-cover" : "mb-3 h-36 w-full rounded-[12px] object-cover"} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1F2937]">{item.name}</p>
              <p className="font-body text-xs text-[#6B7280]">{item.vendor} · {item.city}</p>
              {!compact && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-[#22A849]">{item.price}</span>
                  <Link href="/catalogue" className="rounded-lg bg-[#22A849] px-3 py-2 text-xs font-bold text-white">Commander</Link>
                </div>
              )}
            </div>
            {compact && <p className="text-sm font-bold text-[#22A849]">{item.price}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityCard() {
  return (
    <div className="rounded-[18px] border border-[#BBF7D0] bg-[#F0FDF4] p-5 text-[#15803D]">
      <div className="mb-2 flex items-center gap-2 font-bold">
        <ShieldCheck size={18} />
        Paiement protege
      </div>
      <p className="font-body text-xs leading-5">Vos paiements Dexpay restent securises jusqu&apos;a confirmation de livraison.</p>
    </div>
  );
}

function OrdersPage() {
  return (
    <>
      <PageHeader
        title="Mes commandes"
        subtitle="Consultez vos commandes, suivez les livraisons et retrouvez vos factures."
        action={<Link href="/catalogue" className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white"><Plus size={16} /> Nouvelle commande</Link>}
      />
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value="12" sub="Commandes" icon={ShoppingBag} color="bg-[#F0FDF4] text-[#22A849]" />
        <StatCard label="En livraison" value="1" sub="Active" icon={Truck} color="bg-[#F0FDF4] text-[#1A8A3A]" />
        <StatCard label="Livrees" value="10" sub="OK" icon={PackageCheck} color="bg-[#DCFCE7] text-[#15803D]" />
        <StatCard label="Montant" value="148K" sub="Ce mois" icon={Wallet} color="bg-[#F1F5F9] text-[#475569]" />
      </div>
      <OrdersPanel />
    </>
  );
}

function OrderDetailPage({ orderId }: { orderId: string }) {
  const order = orders.find((item) => item.id === orderId) ?? orders[0];
  const lines = orderLines[order.id] ?? [];
  const activeIndex = order.status === "Livre" ? 3 : order.status === "En livraison" ? 2 : 0;

  return (
    <>
      <PageHeader
        title={order.id}
        subtitle={`${order.date} · ${order.vendor}`}
        action={<Link href="/client/commandes" className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-bold text-[#1F2937]"><ArrowLeft size={16} /> Retour</Link>}
      />

      <div className="mb-6 overflow-hidden rounded-[18px] bg-[#1F2937] text-white shadow-[0_12px_32px_rgba(31,41,55,.16)]">
        <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <img src={order.image} alt={order.id} className="h-20 w-20 rounded-[16px] object-cover" />
            <div className="min-w-0">
              <Badge className={`mb-2 rounded-full px-3 py-1 ${statusColor[order.status]}`}>{order.status}</Badge>
              <h2 className="text-xl font-extrabold md:text-2xl">{order.items} · {order.total}</h2>
              <p className="font-body mt-1 text-sm text-[#D1D5DB]">Livraison vers {order.address}</p>
            </div>
          </div>
          <div className="rounded-[14px] bg-white/10 p-4 md:min-w-56">
            <p className="font-body text-xs text-[#D1D5DB]">Arrivee estimee</p>
            <p className="mt-1 text-2xl font-extrabold">{order.eta}</p>
            <p className="font-body mt-1 text-xs text-[#D1D5DB]">{order.driver} · {order.phone}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
            <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Suivi de la commande</h2>
            <div className="space-y-4">
              {trackingSteps.map((step, index) => {
                const done = index <= activeIndex && order.status !== "Annulee";
                return (
                  <div key={step.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${done ? "bg-[#22A849] text-white" : "bg-[#F1F5F9] text-[#9CA3AF]"}`}>
                        {done ? <CheckCircle2 size={18} /> : <Clock size={17} />}
                      </div>
                      {index < trackingSteps.length - 1 && <div className={`h-9 w-px ${index < activeIndex ? "bg-[#22A849]" : "bg-[#E5E7EB]"}`} />}
                    </div>
                    <div className="min-w-0 pb-3">
                      <p className="font-semibold text-[#1F2937]">{step.label}</p>
                      <p className="font-body text-xs text-[#6B7280]">{done ? step.time : "En attente"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
            <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Articles commandes</h2>
            <div className="space-y-3">
              {lines.map((line) => (
                <div key={line.name} className="flex items-center gap-3 rounded-[14px] bg-[#FAFAFA] p-3">
                  <img src={line.image} alt={line.name} className="h-14 w-14 rounded-[12px] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#1F2937]">{line.name}</p>
                    <p className="font-body text-xs text-[#6B7280]">{line.qty}</p>
                  </div>
                  <p className="text-sm font-extrabold text-[#22A849]">{line.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
            <h2 className="mb-4 text-lg font-bold text-[#1F2937]">Infos livraison</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={18} className="mt-0.5 text-[#22A849]" />
                <div>
                  <p className="font-semibold text-[#1F2937]">{order.address}</p>
                  <p className="font-body text-xs text-[#6B7280]">Adresse client</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Truck size={18} className="mt-0.5 text-[#22A849]" />
                <div>
                  <p className="font-semibold text-[#1F2937]">{order.driver}</p>
                  <p className="font-body text-xs text-[#6B7280]">{order.phone}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CreditCard size={18} className="mt-0.5 text-[#22A849]" />
                <div>
                  <p className="font-semibold text-[#1F2937]">{order.payment}</p>
                  <p className="font-body text-xs text-[#6B7280]">Paiement securise</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/support" className="flex h-11 items-center justify-center rounded-[11px] bg-[#22A849] px-4 text-sm font-bold text-white">
            Contacter le support
          </Link>
        </aside>
      </div>
    </>
  );
}

function FavoritesPage() {
  return (
    <>
      <PageHeader title="Favoris" subtitle="Vos produits et vendeurs preferes pour commander plus vite." />
      <FavoritesPanel />
    </>
  );
}

function AddressesPage() {
  return (
    <>
      <PageHeader
        title="Adresses"
        subtitle="Gerez vos lieux de livraison frequents."
        action={<button className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white"><Plus size={16} /> Ajouter</button>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {addresses.map((address) => (
          <div key={address.label} className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#F0FDF4] text-[#22A849]">
                {address.label === "Maison" ? <Home size={20} /> : <MapPin size={20} />}
              </div>
              {address.active && <Badge className="rounded-full bg-[#DCFCE7] text-[#15803D]">Defaut</Badge>}
            </div>
            <h2 className="font-bold text-[#1F2937]">{address.label}</h2>
            <p className="font-body mt-2 text-sm leading-6 text-[#6B7280]">{address.value}</p>
            <p className="font-body mt-2 text-xs text-[#9CA3AF]">{address.note}</p>
            <div className="mt-5 flex gap-2">
              <button className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] text-xs font-bold text-[#1F2937]"><Edit3 size={14} /> Modifier</button>
              <button className="inline-flex h-9 w-10 items-center justify-center rounded-[10px] border border-[#E5E7EB] text-[#22A849]"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ProfilePage() {
  return (
    <>
      <PageHeader title="Mon profil" subtitle="Vos informations personnelles et preferences de paiement." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#22A849] text-2xl font-extrabold text-white">FS</div>
          <h2 className="mt-4 text-xl font-bold text-[#1F2937]">Fatou Sarr</h2>
          <p className="font-body text-sm text-[#6B7280]">Cliente depuis juin 2026</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[12px] bg-[#FAFAFA] p-3">
              <p className="text-xl font-extrabold text-[#1F2937]">12</p>
              <p className="font-body text-xs text-[#6B7280]">Commandes</p>
            </div>
            <div className="rounded-[12px] bg-[#FAFAFA] p-3">
              <p className="text-xl font-extrabold text-[#1F2937]">4.9</p>
              <p className="font-body text-xs text-[#6B7280]">Note client</p>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Informations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Nom complet", value: "Fatou Sarr", icon: User },
              { label: "Telephone", value: "+221 77 123 45 67", icon: Phone },
              { label: "Email", value: "fatou.sarr@email.com", icon: Mail },
              { label: "Paiement", value: "Dexpay active", icon: CreditCard },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-[14px] border border-[#F1F1F1] bg-[#FAFAFA] p-4">
                <Icon size={18} className="mb-3 text-[#22A849]" />
                <p className="font-body text-xs text-[#6B7280]">{label}</p>
                <p className="mt-1 font-semibold text-[#1F2937]">{value}</p>
              </div>
            ))}
          </div>
          <button className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white">
            <Edit3 size={15} /> Modifier le profil
          </button>
        </div>
      </div>
    </>
  );
}

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  const current = section?.[0] ?? "dashboard";
  const orderId = section?.[1] ? decodeURIComponent(section[1]) : undefined;

  const page =
    current === "commandes" && orderId ? <OrderDetailPage orderId={orderId} /> :
    current === "commandes" ? <OrdersPage /> :
    current === "favoris" ? <FavoritesPage /> :
    current === "adresses" ? <AddressesPage /> :
    current === "profil" ? <ProfilePage /> :
    <OverviewPage />;

  return (
    <DashboardShell role="client" userName="Fatou Sarr">
      <div className="mx-auto max-w-7xl p-4 md:p-6">{page}</div>
    </DashboardShell>
  );
}
