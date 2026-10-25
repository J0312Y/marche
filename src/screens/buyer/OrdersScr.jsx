import { useCallback, useEffect, useState } from "react";
import Icon from "../../components/Icon";
import Sheet from "../../components/t/Sheet";
import { StoreLogo } from "../../components/t/StoreCard";
import { useApp } from "../../context/AppContext";
import { order as orderSvc } from "../../services";
import { fmt } from "../../utils/helpers";

export const ORDER_STATUS = {
  pending: { label: "En attente", color: "#B45309", bg: "#FEF3C7" },
  confirmed: { label: "Acceptée", color: "#1D4ED8", bg: "#DBEAFE" },
  preparing: { label: "En préparation", color: "#1D4ED8", bg: "#DBEAFE" },
  ready: { label: "Prête", color: "#7C3AED", bg: "#EDE9FE" },
  assigned: { label: "Livreur assigné", color: "#7C3AED", bg: "#EDE9FE" },
  picked_up: { label: "En route", color: "#C2410C", bg: "#FFEDD5" },
  delivering: { label: "En route", color: "#C2410C", bg: "#FFEDD5" },
  delivered: { label: "Livrée", color: "#15803D", bg: "#DCFCE7" },
  cancelled: { label: "Annulée", color: "#6B7280", bg: "#F3F4F6" },
  refunded: { label: "Remboursée", color: "#6B7280", bg: "#F3F4F6" },
};
const ACTIVE = ["pending", "confirmed", "preparing", "ready", "assigned", "picked_up", "delivering"];
const parseOpts = (o) => { try { return typeof o === "string" ? JSON.parse(o) : o || []; } catch { return []; } };
const dateLabel = (s) => { const d = new Date(String(s).replace(" ", "T")); return isNaN(d) ? "" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " · " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); };

/**
 * Commandes « Toters » : invité → invitation à se connecter ; sinon en cours / passées, avec « Commander à nouveau ».
 */
export default function OrdersScr({ go }) {
  const { user, requireLogin, cart, clearCart, addToCart, showToast } = useApp();
  const [orders, setOrders] = useState(null);
  const [again, setAgain] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    if (!user) return;
    orderSvc.getAll().then((r) => setOrders(Array.isArray(r) ? r : r?.orders || [])).catch(() => setOrders([]));
  }, [user]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!user) return; const t = setInterval(load, 30000); return () => clearInterval(t); }, [user, load]);

  if (!user) return (
    <div className="t-scr">
      <div className="t-head"><h1>Commandes</h1></div>
      <div className="t-empty" style={{ paddingTop: 120 }}>
        <div className="ic"><Icon name="list" size={38} /></div>
        <b>Commandes</b>
        <p>Connectez-vous pour voir vos commandes</p>
        <button className="t-pill-btn" style={{ marginTop: 8, padding: "14px 30px", fontSize: 16 }} onClick={() => requireLogin("orders")}>Connexion</button>
      </div>
    </div>
  );

  const reorder = async (o) => {
    setBusy(true);
    if (cart.length && Number(cart[0].establishment_id) !== Number(o.establishment_id)) await clearCart();
    let n = 0;
    for (const it of o.items || []) {
      if (!it.article_id) continue;
      const ok = await addToCart({ id: Number(it.article_id), name: it.article_name, price: it.article_price, establishmentId: Number(o.establishment_id) }, Number(it.quantity) || 1,
        { options: parseOpts(it.options).map((x) => ({ group: x.group, name: x.name })), note: it.note || "" });
      if (ok) n++;
    }
    setBusy(false); setAgain(null);
    if (n) go("cart"); else showToast("Ces articles ne sont plus disponibles", "error");
  };

  const active = (orders || []).filter((o) => ACTIVE.includes(o.status));
  const past = (orders || []).filter((o) => !ACTIVE.includes(o.status));

  const Card = ({ o }) => {
    const st = ORDER_STATUS[o.status] || ORDER_STATUS.pending;
    const isActive = ACTIVE.includes(o.status);
    const items = o.items || [];
    return (
      <div className="t-card" style={{ margin: "0 16px 12px", padding: 16, cursor: "pointer" }} onClick={() => go("tracking", { id: o.id })} role="button">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StoreLogo v={{ name: o.establishment_name, logo: o.establishment_avatar }} size={50} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.establishment_name}</div>
            <div className="t-mut">{dateLabel(o.created_at)}</div>
          </div>
          <span style={{ padding: "5px 10px", borderRadius: 10, background: st.bg, color: st.color, fontSize: 12, fontWeight: 700 }}>{st.label}</span>
        </div>
        <div style={{ fontSize: 14, color: "var(--t-sub)", margin: "12px 0 10px", lineHeight: 1.45 }}>
          {items.slice(0, 3).map((it) => `${it.quantity} × ${it.article_name}`).join(", ")}{items.length > 3 ? ` et ${items.length - 3} autre(s)` : ""}
        </div>
        {o.scheduled_for && isActive && <div style={{ fontSize: 13, color: "var(--acc-d)", fontWeight: 700, marginBottom: 8 }}>Programmée : {dateLabel(o.scheduled_for)}</div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <b style={{ fontSize: 16 }}>{fmt(o.total)}</b>
          {isActive ? <span style={{ color: "var(--acc)", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>Suivre <Icon name="arrow_right" size={16} color="var(--acc)" /></span>
            : o.status === "delivered" && <button className="t-pill-btn" style={{ color: "var(--acc)" }} onClick={(e) => { e.stopPropagation(); setAgain(o); }}><Icon name="repeat" size={14} color="var(--acc)" /> Commander à nouveau</button>}
        </div>
      </div>
    );
  };

  return (
    <div className="t-scr gray">
      <div className="t-head" style={{ background: "var(--card)" }}><h1>Commandes</h1></div>
      {orders === null && <div className="t-empty"><span className="spinner" style={{ borderColor: "var(--t-line)", borderTopColor: "var(--acc)", width: 28, height: 28 }} /></div>}
      {orders && orders.length === 0 && <div className="t-empty" style={{ paddingTop: 100 }}>
        <div className="ic"><Icon name="list" size={38} /></div><b>Pas encore de commande</b><p>Vos commandes apparaîtront ici.</p>
      </div>}
      {active.length > 0 && <><div className="t-h2" style={{ padding: "16px 16px 10px" }}>En cours</div>{active.map((o) => <Card key={o.id} o={o} />)}</>}
      {past.length > 0 && <><div className="t-h2" style={{ padding: "16px 16px 10px" }}>Passées</div>{past.map((o) => <Card key={o.id} o={o} />)}</>}
      <div style={{ height: 30 }} />

      {again && <Sheet onClose={() => !busy && setAgain(null)}>
        <div style={{ padding: "10px 20px 22px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Commander à nouveau ?</div>
          <div style={{ fontSize: 14, color: "var(--t-sub)", lineHeight: 1.5, marginBottom: 18 }}>
            Les articles de cette commande chez <b style={{ color: "var(--t-text)" }}>{again.establishment_name}</b> seront ajoutés à votre panier, aux prix actuels.
            {cart.length > 0 && Number(cart[0].establishment_id) !== Number(again.establishment_id) && " Votre panier actuel sera vidé."}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="t-cta ghost" onClick={() => setAgain(null)} disabled={busy}>Annuler</button>
            <button className="t-cta center" onClick={() => reorder(again)} disabled={busy}>{busy ? "Ajout…" : "Ajouter au panier"}</button>
          </div>
        </div>
      </Sheet>}
    </div>
  );
}
