import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "../../components/Icon";
import Img from "../../components/Img";
import Sheet from "../../components/t/Sheet";
import { StoreLogo } from "../../components/t/StoreCard";
import { useApp } from "../../context/AppContext";
import { order as orderSvc } from "../../services";
import { fmt } from "../../utils/helpers";

export const ORDER_STATUS = {
  pending: { label: "En attente", color: "#B45309", bg: "#FEF3C7", icon: "clock" },
  confirmed: { label: "Acceptée", color: "#1D4ED8", bg: "#DBEAFE", icon: "check" },
  preparing: { label: "En préparation", color: "#1D4ED8", bg: "#DBEAFE", icon: "utensils" },
  ready: { label: "Prête", color: "#7C3AED", bg: "#EDE9FE", icon: "package" },
  assigned: { label: "Livreur assigné", color: "#7C3AED", bg: "#EDE9FE", icon: "bike" },
  picked_up: { label: "En route", color: "#C2410C", bg: "#FFEDD5", icon: "truck" },
  delivering: { label: "En route", color: "#C2410C", bg: "#FFEDD5", icon: "truck" },
  delivered: { label: "Livrée", color: "#15803D", bg: "#DCFCE7", icon: "check_circle" },
  cancelled: { label: "Annulée", color: "#6B7280", bg: "#F3F4F6", icon: "x_circle" },
  refunded: { label: "Remboursée", color: "#6B7280", bg: "#F3F4F6", icon: "refresh" },
};
const ACTIVE = ["pending", "confirmed", "preparing", "ready", "assigned", "picked_up", "delivering"];
// Filtres (comme la maquette : « Date ▾ » et « Statut ▾ »)
const DATES = [["all", "Toutes les dates", 0], ["7", "7 derniers jours", 7], ["30", "30 derniers jours", 30], ["90", "3 derniers mois", 90], ["365", "Cette année", 365]];
const STATUSES = [["all", "Tous les statuts"], ["active", "En cours"], ["delivered", "Livrées"], ["cancelled", "Annulées"]];
const PAGE = 30;
const parseOpts = (o) => { try { return typeof o === "string" ? JSON.parse(o) : o || []; } catch { return []; } };
const toDate = (s) => new Date(String(s).replace(" ", "T"));
const longDate = (s) => { const d = toDate(s); return isNaN(d) ? "" : `Commandée le ${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} à ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`; };
const shortDate = (s) => { const d = toDate(s); return isNaN(d) ? "" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " · " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); };

/**
 * Commandes : filtres date / statut, cartes (n° de commande, date, statut, boutique, articles),
 * actions « Donner mon avis » / « Commander à nouveau » / « Suivre » et « Détails de la commande ».
 */
export default function OrdersScr({ go }) {
  const { user, requireLogin, cart, clearCart, addToCart, showToast } = useApp();
  const [orders, setOrders] = useState(null);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [dateF, setDateF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [picker, setPicker] = useState(null); // 'date' | 'status'
  const [again, setAgain] = useState(null);
  const [rate, setRate] = useState(null); // commande dont on choisit l'article à noter
  const [busy, setBusy] = useState(false);

  // Rafraîchit la première page (suivi des commandes en cours toutes les 30 s) sans perdre les pages déjà chargées
  const load = useCallback(() => {
    if (!user) return;
    orderSvc.getAll(null, 1, PAGE).then((r) => {
      const list = Array.isArray(r) ? r : r?.orders || [];
      setOrders((cur) => (cur && cur.length > PAGE ? [...list, ...cur.slice(PAGE).filter((o) => !list.some((x) => x.id === o.id))] : list));
      setMore((m) => (page > 1 ? m : list.length >= PAGE));
    }).catch(() => setOrders((cur) => cur || []));
  }, [user, page]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!user) return; const t = setInterval(load, 30000); return () => clearInterval(t); }, [user, load]);
  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const r = await orderSvc.getAll(null, page + 1, PAGE);
      const list = Array.isArray(r) ? r : r?.orders || [];
      setOrders((cur) => [...(cur || []), ...list.filter((o) => !(cur || []).some((x) => x.id === o.id))]);
      setPage((p) => p + 1); setMore(list.length >= PAGE);
    } catch { showToast("Impossible de charger la suite", "error"); }
    setLoadingMore(false);
  };

  const shown = useMemo(() => {
    const days = DATES.find((d) => d[0] === dateF)?.[2] || 0;
    const since = days ? Date.now() - days * 86400000 : 0;
    return (orders || []).filter((o) => (!since || toDate(o.created_at) >= since)
      && (statusF === "all" || (statusF === "active" ? ACTIVE.includes(o.status) : statusF === "cancelled" ? ["cancelled", "refunded"].includes(o.status) : o.status === statusF)));
  }, [orders, dateF, statusF]);

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
  // Avis : un seul article à noter → directement ; sinon choix de l'article
  const toReview = (o) => (o.items || []).filter((it) => it.article_id && !it.reviewed);
  const openReview = (o, it) => { setRate(null); go("reviews", { id: Number(it.article_id), name: it.article_name, photo: it.thumbnail_url || it.image, type: o.commerce_type, write: true }); };
  const review = (o) => { const list = toReview(o); if (list.length === 1) openReview(o, list[0]); else setRate(o); };

  const Card = ({ o }) => {
    const st = ORDER_STATUS[o.status] || ORDER_STATUS.pending;
    const isActive = ACTIVE.includes(o.status);
    const items = o.items || [];
    const first = items[0];
    const qty = items.reduce((s, it) => s + (Number(it.quantity) || 1), 0);
    const canReview = o.status === "delivered" && toReview(o).length > 0;
    const secondary = isActive ? null
      : canReview ? { label: "Donner mon avis", run: () => review(o) }
      : { label: "Recommander", run: () => setAgain(o) };
    return (
      <div className="t-card" style={{ margin: "0 16px 12px", padding: 16, borderRadius: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>#{o.ref || o.id}</div>
            <div className="t-mut" style={{ marginTop: 2 }}>{longDate(o.created_at)}</div>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 10, background: st.bg, color: st.color, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
            <Icon name={st.icon} size={14} color={st.color} />{st.label}
          </span>
        </div>

        <div onClick={() => go("tracking", { id: o.id })} role="button" style={{ marginTop: 12, padding: 10, background: "var(--t-bg2)", borderRadius: 12, display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }}>
          <span style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", background: "var(--card)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {first && (first.thumbnail_url || first.image) ? <Img src={first.thumbnail_url || first.image} style={{ width: "100%", height: "100%" }} fit="cover" /> : <StoreLogo v={{ name: o.establishment_name, logo: o.establishment_avatar }} size={64} />}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.3 }}>
              {first ? first.article_name : o.establishment_name}{items.length > 1 ? ` et ${items.length - 1} autre${items.length > 2 ? "s" : ""}` : ""}
            </div>
            <div className="t-mut" style={{ marginTop: 3 }}>{qty} article{qty > 1 ? "s" : ""} · {o.establishment_name}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>{fmt(o.total)}</div>
          </div>
        </div>

        {o.scheduled_for && isActive && <div style={{ fontSize: 13, color: "var(--acc-d)", fontWeight: 600, marginTop: 10 }}>Programmée : {shortDate(o.scheduled_for)}</div>}
        {o.status === "cancelled" && o.cancel_reason && <div className="t-mut" style={{ marginTop: 10 }}>{o.cancel_reason}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {secondary && <button className="t-cta ghost center" style={{ flex: 1, height: 44, justifyContent: "center", fontSize: 15, whiteSpace: "nowrap", padding: "0 10px" }} onClick={secondary.run}>{secondary.label}</button>}
          <button className="t-cta center" style={{ flex: 1, height: 44, justifyContent: "center", fontSize: 15, whiteSpace: "nowrap", padding: "0 10px" }} onClick={() => go("tracking", { id: o.id })}>
            {isActive ? <>Suivre la commande <Icon name="arrow_right" size={16} color="#fff" /></> : "Voir le détail"}
          </button>
        </div>
      </div>
    );
  };

  const filtered = dateF !== "all" || statusF !== "all";
  const active = shown.filter((o) => ACTIVE.includes(o.status));
  const past = shown.filter((o) => !ACTIVE.includes(o.status));
  const Pill = ({ k, label, on }) => (
    <button className={"t-chip" + (on ? " on" : "")} style={{ height: 36 }} onClick={() => setPicker(k)}>
      <Icon name={k === "date" ? "clock" : "sliders"} size={16} />{label}<Icon name="chevron_down" size={16} />
    </button>
  );

  return (
    <div className="t-scr gray">
      <div className="t-sticky" style={{ background: "var(--card)" }}>
        <div className="t-head"><h1>Commandes</h1></div>
        <div className="t-chips" style={{ paddingTop: 0 }}>
          <Pill k="date" label={dateF === "all" ? "Date" : DATES.find((d) => d[0] === dateF)[1]} on={dateF !== "all"} />
          <Pill k="status" label={statusF === "all" ? "Statut" : STATUSES.find((s) => s[0] === statusF)[1]} on={statusF !== "all"} />
          {filtered && <button className="t-pill-btn" style={{ height: 36 }} onClick={() => { setDateF("all"); setStatusF("all"); }}>Effacer</button>}
        </div>
      </div>

      {orders === null && <div className="t-empty"><span className="spinner" style={{ borderColor: "var(--t-line)", borderTopColor: "var(--acc)", width: 28, height: 28 }} /></div>}
      {orders && orders.length === 0 && <div className="t-empty" style={{ paddingTop: 100 }}>
        <div className="ic"><Icon name="list" size={38} /></div><b>Pas encore de commande</b><p>Vos commandes apparaîtront ici.</p>
      </div>}
      {orders && orders.length > 0 && shown.length === 0 && <div className="t-empty" style={{ paddingTop: 80 }}>
        <div className="ic"><Icon name="filter" size={34} /></div><b>Aucune commande pour ces filtres</b>
        <button className="t-cta ghost center" style={{ flex: "0 0 auto", width: 200, marginTop: 10 }} onClick={() => { setDateF("all"); setStatusF("all"); }}>Effacer les filtres</button>
      </div>}
      {active.length > 0 && <><div className="t-h2" style={{ padding: "16px 16px 10px" }}>En cours</div>{active.map((o) => <Card key={o.id} o={o} />)}</>}
      {past.length > 0 && <><div className="t-h2" style={{ padding: "16px 16px 10px" }}>{active.length ? "Passées" : filtered ? `${past.length} commande${past.length > 1 ? "s" : ""}` : "Passées"}</div>{past.map((o) => <Card key={o.id} o={o} />)}</>}
      {more && <div style={{ padding: "4px 16px" }}><button className="t-cta ghost center" style={{ width: "100%", height: 44, justifyContent: "center" }} disabled={loadingMore} onClick={loadMore}>{loadingMore ? "Chargement…" : "Voir les commandes plus anciennes"}</button></div>}
      <div style={{ height: 30 }} />

      {picker && <Sheet onClose={() => setPicker(null)}>
        <div style={{ padding: "6px 20px 18px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{picker === "date" ? "Date" : "Statut"}</div>
          {(picker === "date" ? DATES : STATUSES).map(([k, l]) => {
            const on = (picker === "date" ? dateF : statusF) === k;
            return (
              <div key={k} className="t-opt" role="button" onClick={() => { (picker === "date" ? setDateF : setStatusF)(k); setPicker(null); }}>
                <div className="l"><div>{l}</div></div><span className={"t-radio" + (on ? " on" : "")} />
              </div>
            );
          })}
        </div>
      </Sheet>}

      {rate && <Sheet onClose={() => setRate(null)}>
        <div style={{ padding: "6px 20px 18px" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Quel article noter ?</div>
          <div className="t-sub" style={{ fontSize: 14, marginTop: 4, marginBottom: 8 }}>Commande #{rate.ref} chez {rate.establishment_name}</div>
          {toReview(rate).map((it) => (
            <div key={it.id} className="t-opt" role="button" onClick={() => openReview(rate, it)}>
              <span style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, marginRight: 12, background: "var(--t-bg2)" }}>{(it.thumbnail_url || it.image) && <Img src={it.thumbnail_url || it.image} style={{ width: "100%", height: "100%" }} fit="cover" />}</span>
              <div className="l" style={{ flex: 1 }}><div>{it.article_name}</div></div>
              <Icon name="chevron_right" size={18} />
            </div>
          ))}
        </div>
      </Sheet>}

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
