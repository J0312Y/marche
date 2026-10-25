import { useEffect, useState } from "react";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import PullToRefresh from "../../components/PullToRefresh";
import Icon from "../../components/Icon";
import { fmt } from "../../utils/helpers";
import toast from "../../utils/toast";
import { useApp } from "../../context/AppContext";
import { clientName, itemsLine } from "./orderStatus";
import useAcceptOrder from "../../components/t/AcceptOrder";

/**
 * Accueil commerçant : ouverture du commerce, délai annoncé, ventes, commandes à traiter.
 * Données réelles uniquement (GET /vendor/dashboard, PUT /vendor/settings).
 */
function VDashboardScr({ go }) {
  const { userName } = useApp();
  const { data, loading, reload } = useLoad(() => vendor.getDashboard("today"), []);
  const { data: month, reload: reloadMonth } = useLoad(() => vendor.getDashboard("month"), []);
  const [openLocal, setOpenLocal] = useState(null);
  const [eta, setEta] = useState(null);
  const [saving, setSaving] = useState(false);
  const reloadAll = () => Promise.all([reload(), reloadMonth()]);

  // Nouvelles commandes : actualisation régulière
  useEffect(() => { const t = setInterval(reload, 20000); return () => clearInterval(t); }, []);

  const e = data?.establishment || {};
  const isOpen = openLocal ?? String(e.is_open ?? "1") !== "0";
  const etaMin = eta?.[0] ?? (Number(e.eta_min) || 30);
  const etaMax = eta?.[1] ?? (Number(e.eta_max) || etaMin + 15);

  const save = async (patch) => {
    setSaving(true);
    try { await vendor.updateSettings(patch); return true; }
    catch (err) { toast.error(err.message || "Impossible d'enregistrer"); return false; }
    finally { setSaving(false); }
  };
  const toggleOpen = async () => { if (await save({ is_open: isOpen ? 0 : 1 })) setOpenLocal(!isOpen); };
  const changeEta = async (d) => {
    const min = Math.max(5, Math.min(180, etaMin + d));
    const max = Math.max(min + 10, etaMax + d);
    if (min === etaMin) return;
    if (await save({ eta_min: min, eta_max: max })) setEta([min, max]);
  };

  const { accept: acceptOrder, sheet: acceptSheet } = useAcceptOrder();
  const accept = async (o) => {
    try { if (!(await acceptOrder(o))) return; }
    catch (err) { toast.error(err.message || "Impossible d'accepter la commande"); return; }
    toast.success("Commande acceptée");
    go("vOrderDetail", { ...o, status: "confirmed" });
  };

  const newOrders = data?.new_orders || [];
  const top = data?.top_products || [];
  const rating = Number(e.rating) || 0;
  const reviews = Number(e.total_reviews) || 0;
  const firstName = (userName || "").split(" ")[0];

  return (
    <PullToRefresh onRefresh={reloadAll}>
      <div className="t-scr gray" style={{ minHeight: "100%" }}>
        <div className="t-head">
          <span className="tk-av" style={{ width: 40, height: 40, fontSize: 16, borderRadius: 12 }}>
            {e.avatar ? <img src={e.avatar} alt="" /> : (e.name || "L").charAt(0)}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 17, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name || (loading ? "…" : "Mon commerce")}</h1>
            {firstName && <div className="t-sub">Bonjour {firstName}</div>}
          </div>
          <button className="t-back" style={{ marginLeft: 0, marginRight: -8 }} onClick={() => go("vNotif")} aria-label="Notifications"><Icon name="bell" size={22} /></button>
        </div>

        <div className="t-card tk-box">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{isOpen ? "Commerce ouvert" : "Commerce fermé"}</div>
              <div className="t-sub" style={{ marginTop: 2 }}>{isOpen ? "Les clients peuvent commander." : "Les clients ne peuvent pas commander."}</div>
            </div>
            <button className={"t-toggle" + (isOpen ? " on" : "")} onClick={toggleOpen} disabled={saving || loading} aria-label="Ouvrir ou fermer le commerce" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--t-line)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Délai annoncé</div>
              <div className="t-sub">Affiché aux clients</div>
            </div>
            <div className="t-stepper">
              <button onClick={() => changeEta(-5)} disabled={saving} aria-label="Réduire"><Icon name="minus" size={20} /></button>
              <b style={{ fontSize: 15, minWidth: 74 }}>{etaMin}–{etaMax} min</b>
              <button onClick={() => changeEta(5)} disabled={saving} aria-label="Augmenter"><Icon name="plus" size={20} /></button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, margin: "0 16px" }}>
          {[["Ventes du jour", fmt(Number(data?.revenue) || 0)], ["Ventes du mois", fmt(Number(month?.revenue) || 0)]].map(([l, v]) => (
            <div key={l} className="t-card" style={{ flex: 1, margin: 0, padding: 16 }}>
              <div className="t-sub">{l}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "20px 16px 0" }}>
          <div className="tk-h" style={{ flex: 1, margin: 0 }}>Nouvelles commandes</div>
          <button className="t-pill-btn" onClick={() => go("vOrdersList")}>Toutes</button>
        </div>
        {newOrders.length === 0
          ? <div className="t-card tk-box" style={{ textAlign: "center", padding: "26px 20px" }}>
            <div style={{ fontWeight: 600 }}>Aucune nouvelle commande</div>
            <div className="t-sub" style={{ marginTop: 4 }}>{isOpen ? "Elles apparaissent ici automatiquement." : "Ouvrez votre commerce pour en recevoir."}</div>
          </div>
          : newOrders.map((o) => (
            <div key={o.id} className="t-card tk-box">
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }} onClick={() => go("vOrderDetail", o)} role="button">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{clientName(o)}</div>
                  <div className="t-sub" style={{ marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{itemsLine(o.items)}</div>
                  <div className="t-mut" style={{ marginTop: 2 }}>{o.ref}</div>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, flexShrink: 0 }}>{fmt(Number(o.total) || 0)}</div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="t-cta ghost" onClick={() => go("vOrderDetail", o)}><span>Détails</span></button>
                <button className="t-cta center" onClick={() => accept(o)}><span>Accepter</span></button>
              </div>
            </div>
          ))}

        <div className="t-card tk-box" style={{ padding: "4px 16px" }}>
          {[
            ["package", "Commandes", `${Number(data?.total_orders) || 0} au total`, () => go("vOrdersList")],
            ["list", "Catalogue", "Articles, prix, photos", () => go("vProducts")],
            ["star_full", "Avis clients", reviews ? `${rating.toFixed(1)} / 5 · ${reviews} avis` : "Aucun avis", () => go("vReviews")],
            ["chart_pie", "Statistiques", "Ventes et meilleurs articles", () => go("vStats")],
          ].map(([ic, l, s, fn]) => (
            <button key={l} className="t-li" onClick={fn}>
              <span className="ic"><Icon name={ic} size={20} /></span>
              <span><span style={{ display: "block", fontSize: 16 }}>{l}</span><span className="t-sub">{s}</span></span>
              <Icon name="chevron_right" size={20} color="var(--t-mut)" />
            </button>
          ))}
        </div>

        {top.length > 0 && <>
          <div className="tk-h" style={{ margin: "20px 16px 0" }}>Les plus vendus</div>
          <div className="t-card tk-box" style={{ padding: "4px 16px" }}>
            {top.slice(0, 3).map((p, i) => (
              <div key={p.article_id || i} className="t-row" style={{ padding: "12px 0", borderTop: i ? "1px solid var(--t-line)" : "none" }}>
                <span><span style={{ display: "block", fontSize: 15 }}>{p.name}</span><span className="t-sub">{p.sold} vendu{Number(p.sold) > 1 ? "s" : ""}</span></span>
                <b>{fmt(Number(p.revenue) || 0)}</b>
              </div>
            ))}
          </div>
        </>}
        <div style={{ height: 20 }} />
      </div>
      {acceptSheet}
    </PullToRefresh>
  );
}

export default VDashboardScr;
