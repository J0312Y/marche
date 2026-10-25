import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ShoppingBag, Wallet, Percent, Store, Bike, Truck, UserPlus, AlertCircle } from "lucide-react";
import api from "../api";
import { useLoad, PageHead, Stat, Card, Table, Badge, fmt, num, dt, fullName, Btn } from "../ui";

export default function Dashboard({ go }) {
  const { data: d, loading, error, reload } = useLoad(() => api.get("/admin/dashboard"), []);
  if (error) return <div className="page"><PageHead title="Tableau de bord" /><p className="err">{error}</p></div>;
  if (!d) return <div className="page"><PageHead title="Tableau de bord" sub="Chargement…" /></div>;

  const todo = [
    d.establishments.pending_approval > 0 && ["stores", `${d.establishments.pending_approval} commerce${d.establishments.pending_approval > 1 ? "s" : ""} à valider`],
    d.drivers.pending_approval > 0 && ["drivers", `${d.drivers.pending_approval} livreur${d.drivers.pending_approval > 1 ? "s" : ""} à valider`],
    d.orders.pending > 0 && ["orders", `${d.orders.pending} commande${d.orders.pending > 1 ? "s" : ""} en attente d'un commerce`],
    d.deliveries.waiting_driver > 0 && ["deliveries", `${d.deliveries.waiting_driver} course${d.deliveries.waiting_driver > 1 ? "s" : ""} sans livreur`],
  ].filter(Boolean);
  const chart = d.last7.map((x) => ({ ...x, jour: new Date(x.date + "T12:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }) }));

  return (
    <div className="page">
      <PageHead title="Tableau de bord" sub={new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}>
        <Btn kind="ghost" onClick={reload} disabled={loading}>{loading ? "…" : "Actualiser"}</Btn>
      </PageHead>

      {todo.length > 0 && <div className="todo">
        <AlertCircle size={18} /><b>À traiter</b>
        {todo.map(([p, t]) => <button key={p} onClick={() => go(p)}>{t}</button>)}
      </div>}

      <div className="stats">
        <Stat icon={ShoppingBag} label="Commandes aujourd'hui" value={num(d.orders.today)} sub={`${num(d.orders.month)} ce mois · ${num(d.orders.delivered_month)} livrées · ${num(d.orders.cancelled_month)} annulées`} />
        <Stat icon={Wallet} label="Encaissé aujourd'hui" value={fmt(d.revenue.today)} sub={`${fmt(d.revenue.month)} ce mois (espèces)`} />
        <Stat icon={Percent} label="Commission Lamuka" value={fmt(d.commission.month)} sub={`ce mois · ${fmt(d.commission.today)} aujourd'hui`} tone="acc" />
        <Stat icon={Truck} label="Livraisons en cours" value={num(d.deliveries.active)} sub={`${num(d.errands.active)} course${d.errands.active > 1 ? "s" : ""} coursier · ${fmt(d.delivery_fees.month)} aux livreurs ce mois`} />
      </div>
      <div className="stats">
        <Stat icon={Store} label="Commerces actifs" value={num(d.establishments.total)} sub={`${num(d.articles)} articles en ligne`} />
        <Stat icon={Bike} label="Livreurs en ligne" value={num(d.drivers.online)} sub={`${num(d.users.drivers)} comptes livreur`} />
        <Stat icon={UserPlus} label="Utilisateurs" value={num(d.users.total)} sub={`${num(d.users.new_month)} nouveaux ce mois`} />
        <Stat icon={Wallet} label="Ventes des commerces" value={fmt(d.sales.month)} sub="ce mois, hors livraison" />
      </div>

      <div className="grid-2">
        <Card title="7 derniers jours">
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chart} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#E7EEEA" vertical={false} />
                <XAxis dataKey="jour" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip formatter={(v, n) => [n === "orders" ? `${v} commande${v > 1 ? "s" : ""}` : fmt(v), ""]} labelStyle={{ fontWeight: 700 }} />
                <Bar dataKey="orders" fill="#00B492" radius={[6, 6, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="muted small">Nombre de commandes passées chaque jour.</p>
        </Card>
        <Card title="Dernières commandes" action={<Btn kind="link" onClick={() => go("orders")}>Tout voir</Btn>} pad={false}>
          <Table rows={d.recent_orders} onRow={() => go("orders")} cols={[
            { k: "ref", label: "Commande", render: (o) => <><b>{o.ref}</b><small className="block">{dt(o.created_at)}</small></> },
            { k: "c", label: "Client / commerce", render: (o) => <>{fullName(o.first_name, o.last_name)}<small className="block">{o.establishment_name}</small></> },
            { k: "status", label: "Statut", render: (o) => <Badge s={o.status} /> },
            { k: "total", label: "Total", right: true, render: (o) => fmt(o.total) },
          ]} />
        </Card>
      </div>
    </div>
  );
}
