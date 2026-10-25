import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonCards } from "../../components/Loading";
import { fmt } from "../../utils/helpers";
import Icon from "../../components/Icon";
import { stOf, clientName, itemsLine, orderDate } from "./orderStatus";

const TABS = [["all", "Toutes"], ["pending", "Nouvelles"], ["confirmed", "Acceptées"], ["preparing", "En préparation"], ["ready", "Prêtes"], ["delivered", "Livrées"], ["cancelled", "Annulées"]];

/** Commandes du commerce, filtrées par statut (GET /vendor/orders). */
function VOrdersScr({ go, onBack }) {
  const [filter, setFilter] = useState("all");
  const { data, loading, reload } = useLoad(() => vendor.getOrders(filter === "all" ? undefined : filter), [filter]);
  const orders = data?.orders || (Array.isArray(data) ? data : []);
  const counts = data?.counts || {};

  return (
    <PullToRefresh onRefresh={reload}>
      <div className="t-scr gray" style={{ minHeight: "100%" }}>
        <div className="t-sticky">
          <div className="t-head">
            {onBack && <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>}
            <h1>Commandes</h1>
          </div>
          <div className="t-tabs">
            {TABS.map(([k, l]) => {
              const n = Number(counts[k]) || 0;
              return <button key={k} className={"t-tab" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>{l}{n > 0 && k !== "delivered" && k !== "cancelled" ? ` (${n})` : ""}</button>;
            })}
          </div>
        </div>

        {loading ? <div style={{ padding: 16 }}><SkeletonCards /></div>
          : orders.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <Icon name="package" size={40} color="var(--t-mut)" />
              <div style={{ fontWeight: 600, marginTop: 10 }}>Aucune commande</div>
              <div className="t-sub" style={{ marginTop: 4 }}>{filter === "all" ? "Les commandes de vos clients apparaîtront ici." : "Aucune commande dans cette catégorie."}</div>
            </div>
            : orders.map((o) => {
              const st = stOf(o.status);
              return (
                <div key={o.id} className="t-card tk-box" style={{ cursor: "pointer" }} onClick={() => go("vOrderDetail", o)} role="button">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clientName(o)}</div>
                    <span className="tk-badge" style={{ padding: "4px 10px", fontSize: 12, color: st.c, background: st.bg }}>{st.label}</span>
                  </div>
                  <div className="t-sub" style={{ marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{itemsLine(o.items)}</div>
                  <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                    <span className="t-mut" style={{ flex: 1 }}>{o.ref} · {orderDate(o.created_at)}</span>
                    <b style={{ fontSize: 16 }}>{fmt(Number(o.total) || 0)}</b>
                  </div>
                </div>
              );
            })}
        <div style={{ height: 20 }} />
      </div>
    </PullToRefresh>
  );
}

export default VOrdersScr;
