import { useState } from "react";
import { Wallet, Percent, Truck, Store, Gift } from "lucide-react";
import api, { docUrl } from "../api";
import { useLoad, useAction, PageHead, Tabs, Stat, Card, Table, Btn, Modal, Field, Drawer, Confirm, fmt, num, dt, phone } from "../ui";
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

/**
 * Règlements du paiement à la livraison : ce que Lamuka doit à chaque commerce (versements),
 * et les espèces que chaque livreur doit remettre (encaissé − sa part de livraison).
 */
function Settlements() {
  const [kind, setKind] = useState("vendor");
  const { data, loading, error, reload } = useLoad(() => api.get("/admin/settlements", { kind }), [kind]);
  const { run, busy } = useAction();
  const [form, setForm] = useState(null); // { row, amount, method, reference, note }
  const [hist, setHist] = useState(null);
  const [histRows, setHistRows] = useState([]);
  const [del, setDel] = useState(null);
  const methods = data?.methods || { cash: "Espèces" };
  const vendor = kind === "vendor";
  const openHist = async (row) => { setHist(row); setHistRows([]); try { setHistRows(await api.get("/admin/settlements/history", { kind, id: row.id })); } catch { /* affiché vide */ } };
  const save = async () => {
    const amount = Number(String(form.amount).replace(/\s/g, ""));
    if (await run(() => api.post("/admin/settlements", { kind, id: form.row.id, amount, method: form.method, reference: form.reference, note: form.note }), vendor ? "Versement enregistré, le commerce est prévenu" : "Remise enregistrée, le livreur est prévenu")) { setForm(null); reload(); }
  };
  const cancel = async () => { if (await run(() => api.del(`/admin/settlements/${del.id}`), "Saisie annulée")) { setDel(null); openHist(hist); reload(); } };
  const rows = data?.rows || [];
  return (
    <Card title="Règlements" action={<div className="seg">{[["vendor", "Commerces"], ["driver", "Livreurs"]].map(([k, l]) => <button key={k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>{l}</button>)}</div>} pad={false}>
      <p className="muted small pad">{vendor
        ? <>Reste à verser à tous les commerces : <b>{fmt(data?.total_balance)}</b>. Notez chaque versement : le commerce le voit dans ses relevés.</>
        : <>Espèces encore détenues par les livreurs : <b>{fmt(data?.total_balance)}</b> (encaissé − leur part de livraison). Notez chaque remise.</>}</p>
      <Table rows={rows} loading={loading} error={error} empty={vendor ? "Aucun commerce n'a encore de vente payée." : "Aucun livreur n'a encore encaissé."} onRow={openHist} cols={vendor ? [
        { k: "name", label: "Commerce", render: (r) => <b>{r.name}</b> },
        { k: "due", label: "Dû depuis le début", right: true, render: (r) => fmt(r.due) },
        { k: "paid", label: "Déjà versé", right: true, render: (r) => <>{fmt(r.paid)}{r.last_paid_at && <small className="block">le {dt(r.last_paid_at, false)}</small>}</> },
        { k: "bal", label: "Reste à verser", right: true, render: (r) => <b className={r.balance > 0 ? "acc" : ""}>{fmt(r.balance)}</b> },
        { k: "act", label: "", w: 150, render: (r) => r.balance > 0 && <Btn size="sm" onClick={(e) => { e.stopPropagation(); setForm({ row: r, amount: String(r.balance), method: "cash", reference: "", note: "" }); }}>Enregistrer un versement</Btn> },
      ] : [
        { k: "name", label: "Livreur", render: (r) => <><b>{r.name}</b><small className="block">{phone(r.phone)}</small></> },
        { k: "col", label: "Encaissé", right: true, render: (r) => fmt(r.collected) },
        { k: "earn", label: "Sa part (livraisons)", right: true, render: (r) => fmt(r.earnings) },
        { k: "rem", label: "Déjà remis", right: true, render: (r) => <>{fmt(r.remitted)}{r.last_paid_at && <small className="block">le {dt(r.last_paid_at, false)}</small>}</> },
        { k: "bal", label: "Reste à remettre", right: true, render: (r) => <b className={r.balance > 0 ? "acc" : ""}>{fmt(r.balance)}</b> },
        { k: "act", label: "", w: 150, render: (r) => r.balance > 0 && <Btn size="sm" onClick={(e) => { e.stopPropagation(); setForm({ row: r, amount: String(r.balance), method: "cash", reference: "", note: "" }); }}>Enregistrer une remise</Btn> },
      ]} />
      {form && <Modal title={vendor ? `Versement à ${form.row.name}` : `Espèces remises par ${form.row.name}`} onClose={() => setForm(null)}
        footer={<><Btn kind="ghost" onClick={() => setForm(null)}>Annuler</Btn><Btn disabled={busy || !(Number(form.amount) > 0) || Number(form.amount) > form.row.balance} onClick={save}>Enregistrer</Btn></>}>
        <p className="muted">{vendor ? "Reste à verser" : "Reste à remettre"} : <b>{fmt(form.row.balance)}</b></p>
        <Field label="Montant (F)"><input type="number" min="1" max={form.row.balance} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} autoFocus /></Field>
        <Field label="Moyen"><select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>{Object.entries(methods).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        <Field label="Référence" hint="Numéro de transaction, de reçu… (facultatif)"><input value={form.reference} maxLength={100} onChange={(e) => setForm({ ...form, reference: e.target.value })} /></Field>
        <Field label="Note"><input value={form.note} maxLength={255} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
      </Modal>}
      {hist && <Drawer title={hist.name} onClose={() => setHist(null)}>
        <p className="muted">{vendor ? `Dû : ${fmt(hist.due)} · versé : ${fmt(hist.paid)} · reste : ${fmt(hist.balance)}` : `Encaissé : ${fmt(hist.collected)} · sa part : ${fmt(hist.earnings)} · remis : ${fmt(hist.remitted)} · reste : ${fmt(hist.balance)}`}</p>
        <Table rows={histRows} empty="Aucun règlement enregistré." cols={[
          { k: "d", label: "Date", render: (s) => dt(s.created_at) },
          { k: "a", label: "Montant", right: true, render: (s) => <b>{fmt(s.amount)}</b> },
          { k: "m", label: "Moyen", render: (s) => <>{methods[s.method] || s.method}{s.reference && <small className="block">{s.reference}</small>}{s.note && <small className="block muted">{s.note}</small>}</> },
          { k: "x", label: "", w: 90, render: (s) => <button className="link bad" onClick={() => setDel(s)}>Annuler</button> },
        ]} />
      </Drawer>}
      {del && <Confirm danger title="Annuler cette saisie ?" text={`${fmt(del.amount)} du ${dt(del.created_at)} : à utiliser seulement pour corriger une erreur de saisie.`} confirm="Annuler la saisie" busy={busy} onCancel={() => setDel(null)} onConfirm={cancel} />}
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
      <Settlements />
      <Invoices />
      <p className="muted small note">Le client paie le livreur en espèces. « À reverser » = ventes d'articles − réductions du commerce (carte à tampons, ses codes promo) − livraison offerte par le commerce − commission Lamuka. Les réductions Lamuka (points de fidélité, codes promo créés par Lamuka) sont à la charge de Lamuka : elles ne diminuent pas ce que reçoit le commerce.</p>
    </div>
  );
}
