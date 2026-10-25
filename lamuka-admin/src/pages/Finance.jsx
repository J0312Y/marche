import { useState } from "react";
import { Wallet, Percent, Truck, Store, Gift } from "lucide-react";
import api, { docUrl } from "../api";
import { useLoad, PageHead, Tabs, Stat, Card, Table, Btn, fmt, num, dt } from "../ui";
import { TYPES } from "./Stores";

/** Factures émises sur un mois : liste + export CSV pour la comptabilité (séparateur « ; », lisible par Excel) */
function Invoices() {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const { data, loading, error } = useLoad(() => api.get("/admin/invoices", { month }), [month]);
  const rows = data?.invoices || [];
  const csv = () => {
    const head = ["Facture", "Date", "Commande", "Client", "Téléphone", "Commerce", "Sous-total", "Livraison", "Réductions", "Total", "Paiement"];
    const cell = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    const lines = rows.map((r) => [r.invoice_number, String(r.invoice_issued_at).slice(0, 10), r.ref, r.client, r.client_phone, r.store, r.subtotal, r.delivery_fee, r.discount, r.total, r.payment_method === "cash" ? "Espèces" : r.payment_method].map(cell).join(";"));
    const blob = new Blob(["\ufeff" + [head.map(cell).join(";"), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `Factures-${month}.csv`; a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <Card title="Factures" action={<div style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="month" value={month} onChange={(e) => setMonth(e.target.value)} /><Btn size="sm" disabled={!rows.length} onClick={csv}>Exporter (CSV)</Btn></div>} pad={false}>
      <Table rows={rows} loading={loading} error={error} empty="Aucune facture ce mois-ci." cols={[
        { k: "n", label: "Facture", render: (r) => <><b>{r.invoice_number}</b><small className="block">{dt(r.invoice_issued_at)}</small></> },
        { k: "ref", label: "Commande", render: (r) => <>{r.ref}<small className="block">{r.store}</small></> },
        { k: "client", label: "Client", render: (r) => r.client || "—" },
        { k: "total", label: "Total", right: true, render: (r) => <b>{fmt(r.total)}</b> },
        { k: "pdf", label: "", render: (r) => <a href={docUrl(r)}>PDF</a> },
      ]} />
      {rows.length > 0 && <p className="muted small pad">{rows.length} facture{rows.length > 1 ? "s" : ""} · {fmt(data.total)}</p>}
    </Card>
  );
}

const PERIODS = [["today", "Aujourd'hui"], ["week", "7 jours"], ["month", "Ce mois"], ["year", "Cette année"], ["all", "Tout"]];

/** Argent encaissé (espèces), commission Lamuka et part de chaque commerce. Commandes livrées et payées uniquement. */
export default function Finance() {
  const [period, setPeriod] = useState("month");
  const { data, loading, error } = useLoad(() => api.get("/admin/finance", { period }), [period]);
  const t = data?.totals || {};
  return (
    <div className="page">
      <PageHead title="Finances" sub="Commandes livrées et payées en espèces : ce que chaque commerce a vendu et la commission Lamuka" />
      <Tabs value={period} onChange={setPeriod} items={PERIODS} />
      <div className="stats">
        <Stat icon={Wallet} label="Encaissé par les livreurs" value={fmt(t.collected)} sub={`${num(t.orders)} commande${t.orders > 1 ? "s" : ""} payée${t.orders > 1 ? "s" : ""}`} />
        <Stat icon={Percent} label="Commission Lamuka" value={fmt(t.commission)} sub={t.lamuka_discount ? `${fmt(t.commission - t.lamuka_discount)} après les réductions Lamuka` : "sur les ventes d'articles"} tone="acc" />
        <Stat icon={Gift} label="Réductions Lamuka" value={fmt(t.lamuka_discount)} sub="points de fidélité et codes promo Lamuka, à notre charge" />
        <Stat icon={Store} label="À reverser aux commerces" value={fmt(t.due_to_vendors)} sub="après commission, réductions du commerce et livraison offerte" />
        <Stat icon={Truck} label="Livraisons (aux livreurs)" value={fmt(t.delivery)} sub={data?.errands?.count ? `+ ${fmt(data.errands.fees)} de coursier (${data.errands.count})` : "payées par les clients ou offertes"} />
      </div>
      <Card title="Par commerce" pad={false}>
        <Table rows={data?.establishments || []} loading={loading} error={error} empty="Aucune commande payée sur cette période." cols={[
          { k: "name", label: "Commerce", render: (e) => <><b>{e.name}</b><small className="block">{TYPES[e.type] || e.type}</small></> },
          { k: "orders", label: "Commandes", right: true, render: (e) => num(e.orders) },
          { k: "items", label: "Ventes articles", right: true, render: (e) => fmt(e.items) },
          { k: "vdisc", label: "Réductions du commerce", right: true, render: (e) => e.vendor_discount ? fmt(e.vendor_discount) : "—" },
          { k: "ldisc", label: "Réductions Lamuka", right: true, render: (e) => e.lamuka_discount ? fmt(e.lamuka_discount) : "—" },
          { k: "offered", label: "Livraison offerte", right: true, render: (e) => e.delivery_offered ? fmt(e.delivery_offered) : "—" },
          { k: "commission", label: "Commission", right: true, render: (e) => <><b>{fmt(e.commission)}</b><small className="block">{e.commission_rate} %</small></> },
          { k: "due", label: "À reverser", right: true, render: (e) => <b>{fmt(e.due_to_vendor)}</b> },
        ]} />
      </Card>
      <Invoices />
      <p className="muted small note">Le client paie le livreur en espèces. « À reverser » = ventes d'articles − réductions du commerce (carte à tampons, ses codes promo) − livraison offerte par le commerce − commission Lamuka. Les réductions Lamuka (points de fidélité, codes promo créés par Lamuka) sont à la charge de Lamuka : elles ne diminuent pas ce que reçoit le commerce.</p>
    </div>
  );
}
