import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { vendorAPI as vendor } from "../../api";
import { fmt } from "../../utils/helpers";
import { openDocument } from "../../utils/documents";

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const monthLabel = (ym) => { const [y, m] = ym.split("-"); return `${MONTHS[Number(m) - 1]} ${y}`; };

/** Relevés mensuels : ventes, commission Lamuka, livraison offerte, montant à recevoir ; relevé imprimable par mois */
export default function VStatementsScr({ onBack }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState(false);
  const [pay, setPay] = useState(null); // versements de Lamuka : dû, versé, reste, historique
  useEffect(() => { vendor.invoices().then(setD).catch(() => setErr(true)); vendor.settlements().then(setPay).catch(() => {}); }, []);
  const list = d?.invoices || [];
  const rate = d?.commission_rate;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>Relevés mensuels</h1></div>
      <div className="t-scr gray">
        <div className="t-card tk-box"><div className="t-sub" style={{ fontSize: 14, lineHeight: 1.5 }}>
          Commandes payées par vos clients. {rate != null ? `Commission Lamuka : ${String(rate).replace(".", ",").replace(/,00$/, "")} % des ventes d'articles. ` : ""}Vos réductions (carte à tampons, vos codes promo) et la livraison que vous offrez sont déduites ; les réductions de Lamuka (points, codes Lamuka) sont à sa charge.
        </div></div>
        {pay && (pay.due > 0 || pay.paid > 0) && <div className="t-card tk-box">
          <div className="tk-h" style={{ margin: 0 }}>Versements de Lamuka</div>
          <div className="t-row" style={{ marginTop: 8 }}><span className="t-sub">À recevoir depuis le début</span><span>{fmt(pay.due)}</span></div>
          <div className="t-row"><span className="t-sub">Déjà reçu</span><span>{fmt(pay.paid)}</span></div>
          <div className="t-row" style={{ fontWeight: 700, fontSize: 17, borderTop: "1px solid var(--t-line)", paddingTop: 10, marginTop: 4 }}><span>Reste à recevoir</span><span style={{ color: "var(--acc-d)" }}>{fmt(Math.max(0, pay.balance))}</span></div>
          {pay.history.length > 0 && <div style={{ marginTop: 10 }}>
            {pay.history.slice(0, 5).map((h) => <div key={h.id} className="t-row" style={{ fontSize: 14 }}>
              <span className="t-sub">{new Date(String(h.created_at).replace(" ", "T")).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })} · {{ cash: "Espèces", mobile_money: "Mobile Money", bank: "Virement" }[h.method] || h.method}{h.reference ? ` · ${h.reference}` : ""}</span><span>+{fmt(h.amount)}</span>
            </div>)}
          </div>}
        </div>}
        {!d && !err && <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><div className="spinner" /></div>}
        {err && <div className="t-card tk-box"><div className="t-sub">Relevés indisponibles pour le moment.</div></div>}
        {d && !list.length && <div className="t-card tk-box" style={{ textAlign: "center", padding: "26px 20px" }}><div style={{ fontWeight: 600 }}>Aucun relevé pour l'instant</div><div className="t-sub" style={{ marginTop: 4 }}>Votre premier relevé apparaîtra après votre première commande livrée.</div></div>}
        {list.map((m) => (
          <div key={m.month} className="t-card tk-box">
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
              <div className="tk-h" style={{ margin: 0, textTransform: "capitalize" }}>{monthLabel(m.month)}</div>
              <span className="t-sub" style={{ fontSize: 13 }}>{m.orders} commande{m.orders > 1 ? "s" : ""}</span>
            </div>
            <div className="t-row" style={{ marginTop: 8 }}><span className="t-sub">Ventes d'articles</span><span>{fmt(m.items)}</span></div>
            {m.vendor_discount > 0 && <div className="t-row"><span className="t-sub">Vos réductions</span><span>−{fmt(m.vendor_discount)}</span></div>}
            <div className="t-row"><span className="t-sub">Commission Lamuka</span><span>−{fmt(m.commission)}</span></div>
            {m.delivery_offered > 0 && <div className="t-row"><span className="t-sub">Livraison offerte</span><span>−{fmt(m.delivery_offered)}</span></div>}
            <div className="t-row" style={{ fontWeight: 700, fontSize: 17, borderTop: "1px solid var(--t-line)", paddingTop: 10, marginTop: 4 }}><span>À recevoir</span><span style={{ color: "var(--acc-d)" }}>{fmt(m.due)}</span></div>
            {m.lamuka_discount > 0 && <div className="t-mut" style={{ fontSize: 13, marginTop: 6 }}>{fmt(m.lamuka_discount)} de réductions offertes par Lamuka à vos clients (points, codes Lamuka) : à la charge de Lamuka.</div>}
            <button className="t-pill-btn" style={{ marginTop: 12, height: 38 }} onClick={() => openDocument(m.document)}><Icon name="document" size={16} />Ouvrir le relevé (PDF)</button>
          </div>
        ))}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
