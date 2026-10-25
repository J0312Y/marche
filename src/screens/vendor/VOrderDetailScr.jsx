import { useState, useEffect } from "react";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";
import { useAction } from "../../hooks/useData";
import vendorService from "../../services/vendorService";
import { fmtPhone } from "../../utils/phoneValidation";
import { stOf, clientName, orderDate } from "./orderStatus";
import useAcceptOrder from "../../components/t/AcceptOrder";

const parseOpts = (o) => { try { return typeof o === "string" ? JSON.parse(o) || [] : o || []; } catch { return []; } };
const NEXT = { pending: ["confirmed", "Accepter la commande"], confirmed: ["preparing", "Commencer la préparation"], preparing: ["ready", "Commande prête"] };
const CODE_ST = ["confirmed", "preparing", "ready", "assigned"];

/**
 * Détail d'une commande côté commerçant (GET /vendor/orders/:id).
 * Actions réelles : accepter, refuser, préparer, marquer prête (PUT /vendor/orders/:id/status).
 */
function VOrderDetailScr({ order: oProp, onBack }) {
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState(oProp.status);
  const [askRefuse, setAskRefuse] = useState(false);
  const { run, loading: busy } = useAction();

  const load = () => {
    if (!oProp?.id) return;
    vendorService.getOrderDetail(oProp.id).then((res) => {
      if (res?.order) { setDetail({ ...res.order, items: res.items || [] }); setStatus(res.order.status); }
    }).catch(() => {});
  };
  useEffect(load, [oProp]);

  const o = detail || oProp;
  const items = (o.items || []).map((it) => ({
    name: it.article_name || it.name || "Article",
    qty: parseInt(it.quantity || it.qty) || 1,
    price: parseInt(it.article_price || it.price) || 0,
    photo: it.image || it.photo || null,
    opts: parseOpts(it.options).map((x) => `${x.name}${Number(x.price_delta) > 0 ? " (+" + fmt(Number(x.price_delta)) + ")" : ""}`),
    note: it.note || "",
  }));
  const phone = o.client_phone || o.phone || "";
  const st = stOf(status);
  const next = NEXT[status];

  const { accept, sheet: acceptSheet } = useAcceptOrder();
  const setTo = async (s, okMsg) => {
    if (busy) return;
    try {
      if (s === "confirmed") { if (!(await run(() => accept(o)))) return; }
      else await run(() => vendorService.updateOrderStatus(o.id, s));
    }
    catch (err) { toast.error(err.message || "Impossible de mettre à jour la commande"); return; }
    setStatus(s); setAskRefuse(false); toast.success(okMsg); load();
  };

  return (
    <div className="t-scr gray" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="t-head">
        <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
        <h1>Commande {o.ref}</h1>
      </div>

      <div style={{ flex: 1 }}>
        <div className="t-card tk-box" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="tk-badge" style={{ color: st.c, background: st.bg }}>{st.label}</span>
          <span className="t-sub" style={{ flex: 1, textAlign: "right" }}>{orderDate(o.created_at)}</span>
        </div>

        {o.pickup_code && CODE_ST.includes(status) && <div className="t-card tk-box" style={{ display: "flex" }}>
          <div className="tk-code">
            <small>CODE DE RETRAIT</small>
            <b>{o.pickup_code}</b>
            <span>À donner au livreur seulement quand il récupère la commande.</span>
          </div>
        </div>}

        <div className="t-card tk-box">
          <div className="tk-h">Client</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{clientName(o)}</div>
              {phone && <div className="t-sub">{fmtPhone(phone)}</div>}
            </div>
            {phone && <a className="tk-nav" style={{ marginTop: 0, color: "var(--acc)" }} href={`tel:${phone}`} aria-label="Appeler le client"><Icon name="phone" size={18} /></a>}
          </div>
          {o.delivery_address && <div className="t-sub" style={{ marginTop: 10, display: "flex", gap: 8 }}><Icon name="map_pin" size={16} />{o.delivery_address}</div>}
        </div>

        <div className="t-card tk-box">
          <div className="tk-h">Articles</div>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: i ? "1px solid var(--t-line)" : "none" }}>
              <Img src={it.photo} style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} fit="cover" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{it.qty}× {it.name}</div>
                {it.opts.length > 0 && <div className="t-sub">{it.opts.join(" · ")}</div>}
                {it.note && <div className="t-sub" style={{ fontStyle: "italic" }}>« {it.note} »</div>}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{fmt(it.price * it.qty)}</div>
            </div>
          ))}
          {o.scheduled_for && <div className="tk-note"><Icon name="clock" size={16} />Programmée pour le {new Date(String(o.scheduled_for).replace(" ", "T")).toLocaleString("fr-FR", { weekday: "long", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>}
          {Number(o.no_cutlery) === 1 && <div className="tk-note"><Icon name="info" size={16} />Le client ne veut pas de couverts</div>}
          {o.note && <div className="tk-desc" style={{ marginTop: 10 }}><b>Note du client</b>{o.note}</div>}
          <div style={{ borderTop: "1px solid var(--t-line)", marginTop: 10, paddingTop: 10 }}>
            {Number(o.subtotal) > 0 && <div className="t-row"><span className="t-sub" style={{ fontSize: 14 }}>Articles</span><span>{fmt(Number(o.subtotal))}</span></div>}
            {o.delivery_fee != null && <div className="t-row"><span className="t-sub" style={{ fontSize: 14 }}>Livraison (pour le livreur)</span><span>{Number(o.delivery_fee) > 0 ? fmt(Number(o.delivery_fee)) : "Offerte"}</span></div>}
            <div className="t-row" style={{ fontSize: 16, fontWeight: 700, paddingTop: 6 }}><span>Total payé par le client</span><span>{fmt(Number(o.total) || 0)}</span></div>
            <div className="t-mut" style={{ marginTop: 4 }}>{(o.payment_method || "cash") === "cash" ? "Paiement en espèces à la livraison" : o.payment_method}</div>
          </div>
        </div>

        {["confirmed", "preparing", "ready", "assigned", "picked_up", "delivering"].includes(status) && <div className="t-card tk-box">
          <div className="tk-h">Livreur</div>
          {o.driver
            ? <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="tk-av" style={{ width: 44, height: 44, fontSize: 17 }}>{(o.driver.name || "L").charAt(0)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{o.driver.name}</div>
                <div className="t-sub">{[o.driver.vehicle, o.driver.phone && fmtPhone(o.driver.phone)].filter(Boolean).join(" · ")}</div>
              </div>
              {o.driver.phone && <a className="tk-nav" style={{ marginTop: 0, color: "var(--acc)" }} href={`tel:${o.driver.phone}`} aria-label="Appeler le livreur"><Icon name="phone" size={18} /></a>}
            </div>
            : <div className="t-sub" style={{ fontSize: 14 }}>La course est proposée aux livreurs Lamuka. Son nom s'affichera ici dès qu'un livreur l'accepte.</div>}
        </div>}

        {askRefuse && <div className="t-card tk-box">
          <div style={{ fontWeight: 700, fontSize: 16 }}>Refuser cette commande ?</div>
          <div className="t-sub" style={{ fontSize: 14, marginTop: 4 }}>Le client sera prévenu que sa commande est annulée.</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="t-cta ghost" onClick={() => setAskRefuse(false)}><span>Retour</span></button>
            <button className="t-cta center" style={{ background: "#D92D20" }} disabled={busy} onClick={() => setTo("cancelled", "Commande refusée")}><span>Refuser</span></button>
          </div>
        </div>}
      </div>

      {next && !askRefuse && <div className="t-bottom" style={{ display: "flex", gap: 8, padding: "12px 16px", background: "var(--card)", borderTop: "1px solid var(--t-line)", position: "sticky", bottom: 0 }}>
        {status === "pending" && <button className="t-cta ghost" onClick={() => setAskRefuse(true)}><span>Refuser</span></button>}
        <button className="t-cta center" disabled={busy} onClick={() => setTo(next[0], next[0] === "confirmed" ? "Commande acceptée" : next[0] === "preparing" ? "Préparation commencée" : "Commande prête")}><span>{busy ? "…" : next[1]}</span></button>
      </div>}
      {acceptSheet}
    </div>
  );
}

export default VOrderDetailScr;
