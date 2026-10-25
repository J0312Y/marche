import { useState } from "react";
import api, { docUrl } from "../api";
import { useLoad, usePaged, useAction, PageHead, Toolbar, Tabs, Table, Pager, Badge, Drawer, Rows, Confirm, Btn, fmt, dt, fullName, phone } from "../ui";
import { AssignDriver } from "./Deliveries";

// Étape suivante que Lamuka peut faire à la place du commerce
const NEXT = { pending: [["confirmed", "Accepter pour le commerce"]], confirmed: [["preparing", "Marquer en préparation"], ["ready", "Marquer prête"]], preparing: [["ready", "Marquer prête"]] };

const TABS = [["", "Toutes"], ["pending", "En attente"], ["confirmed", "Acceptées"], ["preparing", "En préparation"], ["ready", "Prêtes"], ["delivering", "En livraison"], ["delivered", "Livrées"], ["cancelled", "Annulées"]];
const OPEN = ["pending", "confirmed", "preparing", "ready", "assigned", "picked_up", "delivering"];

function OrderDrawer({ id, onClose, onChanged }) {
  const { data, reload } = useLoad(() => api.get(`/admin/orders/${id}`), [id]);
  const { run, busy } = useAction();
  const [ask, setAsk] = useState(false);
  const [assign, setAssign] = useState(false);
  const o = data?.order || data || {};
  const d = data?.delivery;
  // Attribuer ou changer le livreur : commande acceptée par le commerce, pas encore récupérée
  const canAssign = d && ["pending", "assigned", "pickup_arrived"].includes(d.status) && ["confirmed", "preparing", "ready", "assigned"].includes(o.status);
  const step = async (s, label) => { if (await run(() => api.put(`/admin/orders/${id}/status`, { status: s, message: `${label} par Lamuka` }), "Commande mise à jour")) { reload(); onChanged(); } };
  const items = data?.items || o.items || [];
  const cancel = async (why) => {
    if (await run(() => api.put(`/admin/orders/${id}/status`, { status: "cancelled", message: why ? `Annulée par Lamuka : ${why}` : "Annulée par Lamuka" }), "Commande annulée")) { setAsk(false); reload(); onChanged(); }
  };
  return (
    <Drawer title={o.ref ? `Commande ${o.ref}` : "Commande"} onClose={onClose}
      footer={OPEN.includes(o.status) && <>
        {(NEXT[o.status] || []).map(([s, label]) => <Btn key={s} disabled={busy} onClick={() => step(s, label)}>{label}</Btn>)}
        {canAssign && <Btn kind="ghost" onClick={() => setAssign(true)}>{d.driver_id ? "Changer de livreur" : "Attribuer un livreur"}</Btn>}
        <Btn kind="danger" onClick={() => setAsk(true)}>Annuler</Btn>
      </>}>
      {!data ? <p className="muted">Chargement…</p> : <>
        <div className="drawer-status"><Badge s={o.status} /><Badge s={o.payment_status} /></div>
        <Rows items={[
          ["Passée le", dt(o.created_at)],
          o.scheduled_for && ["Programmée pour", dt(o.scheduled_for)],
          ["Client", <>{fullName(o.first_name || data.user?.first_name, o.last_name || data.user?.last_name)}<small className="block">{phone(o.user_phone || data.user?.phone)}</small></>],
          ["Commerce", o.establishment_name || data.establishment?.name],
          ["Adresse", o.delivery_address],
          o.note && ["Note du client", o.note],
          ["Paiement", o.payment_method === "cash" ? "Espèces à la livraison" : o.payment_method],
          data.invoice && ["Facture", <><b>{data.invoice.number}</b><small className="block"><a href={docUrl(data.invoice, true)} target="_blank" rel="noreferrer">Voir</a> · <a href={docUrl(data.invoice)}>Télécharger (PDF)</a></small></>],
          data.delivery && ["Livraison", <><Badge s={data.delivery.status} /><small className="block">{data.delivery.distance_km ? `${Number(data.delivery.distance_km).toFixed(1)} km · ` : ""}gain livreur {fmt(data.delivery.driver_earning || data.delivery.fee)}</small></>],
          data.delivery && ["Livreur", data.driver ? <>{fullName(data.driver.first_name, data.driver.last_name)}<small className="block">{phone(data.driver.phone)} · {data.driver.vehicle_type}</small></> : <span className="muted">Aucun livreur pour le moment</span>],
        ]} />
        <h4 className="sub-h">Articles</h4>
        <table className="mini">
          <tbody>{items.map((it, i) => <tr key={i}><td>{it.quantity} × {it.article_name}</td><td className="r">{fmt(it.subtotal ?? it.article_price * it.quantity)}</td></tr>)}</tbody>
          <tfoot>
            <tr><td>Sous-total</td><td className="r">{fmt(o.subtotal)}</td></tr>
            <tr><td>Livraison (client)</td><td className="r">{Number(o.delivery_fee) ? fmt(o.delivery_fee) : "Offerte"}</td></tr>
            {Number(o.vendor_delivery_subsidy) > 0 && <tr><td>Livraison offerte par le commerce</td><td className="r">{fmt(o.vendor_delivery_subsidy)}</td></tr>}
            {Number(o.discount) > 0 && <tr><td>Code promo</td><td className="r">−{fmt(o.discount)}</td></tr>}
            {Number(o.punch_reward) > 0 && <tr><td>Carte à tampons</td><td className="r">−{fmt(o.punch_reward)}</td></tr>}
            {Number(o.points_used) > 0 && <tr><td>Points</td><td className="r">−{fmt(o.points_used)}</td></tr>}
            <tr className="tot"><td>Total payé</td><td className="r">{fmt(o.total)}</td></tr>
          </tfoot>
        </table>
        {Array.isArray(data.tracking) && data.tracking.length > 0 && <>
          <h4 className="sub-h">Historique</h4>
          <ul className="timeline">{data.tracking.map((t, i) => <li key={i}><Badge s={t.status} /><span>{t.message || ""}</span><small>{dt(t.created_at)}</small></li>)}</ul>
        </>}
      </>}
      {assign && d && <AssignDriver title={`${d.driver_id ? "Changer le livreur de" : "Attribuer"} la commande ${o.ref}`}
        sub={`${o.establishment_name || ""} → ${o.delivery_address || "client"} · gain ${fmt(d.driver_earning || d.fee)}${data.driver ? ` · actuellement : ${fullName(data.driver.first_name, data.driver.last_name)}` : ""}`}
        url={`/admin/deliveries/${d.id}/assign`} currentId={d.driver_id}
        onClose={() => setAssign(false)} onDone={() => { setAssign(false); reload(); onChanged(); }} />}
      {ask && <Confirm title="Annuler la commande ?" danger reason text="Le client, le commerce et le livreur éventuel seront prévenus. La course est retirée des livreurs." confirm="Annuler la commande" busy={busy} onCancel={() => setAsk(false)} onConfirm={cancel} />}
    </Drawer>
  );
}

export default function Orders({ onChanged }) {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const list = usePaged("/admin/orders", "orders", { status, search });
  return (
    <div className="page">
      <PageHead title="Commandes" sub="Toutes les commandes passées dans l'application" />
      <Tabs value={status} onChange={setStatus} items={TABS} />
      <Toolbar onSearch={setSearch} placeholder="Référence (LMK-…)" />
      <Table {...list} onRow={(o) => setOpen(o.id)} empty="Aucune commande." cols={[
        { k: "ref", label: "Commande", render: (o) => <><b>{o.ref}</b><small className="block">{dt(o.created_at)}</small></> },
        { k: "client", label: "Client", render: (o) => <>{fullName(o.first_name, o.last_name)}<small className="block">{phone(o.user_phone)}</small></> },
        { k: "establishment_name", label: "Commerce" },
        { k: "status", label: "Statut", render: (o) => <Badge s={o.status} /> },
        { k: "pay", label: "Paiement", render: (o) => <Badge s={o.payment_status} /> },
        { k: "total", label: "Total", right: true, render: (o) => <b>{fmt(o.total)}</b> },
      ]} />
      <Pager {...list} />
      {open && <OrderDrawer id={open} onClose={() => setOpen(null)} onChanged={() => { list.reload(); onChanged?.(); }} />}
    </div>
  );
}
