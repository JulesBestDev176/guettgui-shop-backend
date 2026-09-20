import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardBody, CardHeader, Badge, Progress } from "@/components/ui/primitives";

const pendingVendors = [
  { name: "Élevage Kaolack", region: "Kaolack", date: "25 juin", status: "En attente" },
  { name: "Ranch Podor", region: "Saint-Louis", date: "24 juin", status: "En attente" },
  { name: "Aviculture Mbour", region: "Thiès", date: "23 juin", status: "En cours" },
];

const topCategories = [
  { name: "Poulet", pct: 62 },
  { name: "Œufs", pct: 18 },
  { name: "Dinde", pct: 10 },
  { name: "Canard", pct: 6 },
  { name: "Autres", pct: 4 },
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell role="admin" userName="Admin SN">
      <div className="p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1F2937]">Administration</h1>
          <p className="text-stone-500 text-sm mt-1">Vue d&apos;ensemble de la plateforme</p>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Utilisateurs", value: "1 842", delta: "+34 cette semaine", color: "bg-blue-50 text-blue-600" },
            { label: "Vendeurs actifs", value: "158", delta: "+12 ce mois", color: "bg-[#F0FDF4] text-[#22A849]" },
            { label: "GMV ce mois", value: "4.2M F", delta: "+22%", color: "bg-emerald-50 text-emerald-600" },
            { label: "Commandes", value: "732", delta: "Juin 2026", color: "bg-purple-50 text-purple-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardBody className="pt-5">
                <div className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-bold mb-2 ${s.color}`}>{s.delta}</div>
                <p className="text-xl font-bold text-[#1F2937]">{s.value}</p>
                <p className="text-xs text-stone-400">{s.label}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pending vendors */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#1F2937]">Vendeurs en attente</h2>
                <Badge className="bg-rose-50 text-rose-700">{pendingVendors.length}</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {pendingVendors.map((v) => (
                  <div key={v.name} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
                    <div className="w-9 h-9 bg-[#22A849] rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {v.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1F2937]">{v.name}</p>
                      <p className="text-xs text-stone-400">{v.region} · {v.date}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">✓</button>
                      <button className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-colors">✗</button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Category breakdown */}
          <Card>
            <CardHeader>
              <h2 className="font-bold text-[#1F2937]">Répartition par catégorie</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {topCategories.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-stone-700">{cat.name}</span>
                      <span className="font-semibold text-[#22A849]">{cat.pct}%</span>
                    </div>
                    <Progress value={cat.pct} />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
