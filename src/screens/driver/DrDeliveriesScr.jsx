import { useEffect, useState } from "react";
import { errandsAPI } from "../../api";
import { useLoad } from "../../hooks";
import driver from "../../services/driverService";
import { fmt } from "../../utils/helpers";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";
import DrErrandsPanel from "./DrErrandsPanel";

const STATUS = { assigned: "À récupérer", pickup_arrived: "Au commerce", picked_up: "En route vers le client", delivering: "En route vers le client", delivered: "Livrée" };

const when = (d) => { if (!d) return ""; const t = new Date(String(d).replace(" ", "T")); return isNaN(t) ? "" : t.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " · " + t.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); };

// Données réelles de l'API (aucune valeur par défaut inventée)
const norm = (d) => {
  const km = parseFloat(d.distance_km);
  return {
    raw: d,
    id: d.id,
    ref: d.ref || d.order_id,
    fee: parseInt(d.driver_earning || d.fee) || 0,
    total: parseFloat(d.total) || 0,
    from: d.establishment_name || "Commerce",
    fromAddr: d.pickup_address_text || d.pickup_address || "",
    to: d.dropoff_address || "",
    distance: km ? km.toFixed(1) + " km" : null,
    status: d.status,
    time: when(d.delivered_at || d.created_at),
  };
};

/** Mes courses (livreur) : en cours, nouvelles demandes, coursier, terminées. */
function DrDeliveriesScr({ go }) {
  const [filter, setFilter] = useState("active");
  const [accepting, setAccepting] = useState(null);
  const [hidden, setHidden] = useState([]);
  const [errandCount, setErrandCount] = useState(0);
  // Nombre de courses coursier (disponibles + en cours) affiché sur l'onglet
  useEffect(() => { errandsAPI.driverList().then((r) => setErrandCount((r?.available?.length || 0) + (r?.active?.length || 0))).catch(() => {}); }, []);

  const { data: availData, loading: l1, reload: reloadAvail } = useLoad(() => driver.getAvailable());
  const { data: dashData, loading: l2, reload: reloadDash } = useLoad(() => driver.getDashboard());
  const { data: histData } = useLoad(() => driver.getHistory());

  const pending = (Array.isArray(availData) ? availData : availData?.deliveries || []).map(norm).filter((d) => !hidden.includes(d.id));
  const active = (dashData?.active || []).map(norm);
  const done = (Array.isArray(histData) ? histData : histData?.deliveries || []).map(norm);
  const list = filter === "active" ? active : filter === "pending" ? pending : done;

  const accept = async (d) => {
    setAccepting(d.id);
    try { await driver.acceptDelivery(d.id); }
    catch (e) { setAccepting(null); toast.error(e?.message || "Cette course n'est plus disponible"); reloadAvail(); return; }
    setAccepting(null);
    toast.success("Course acceptée");
    await Promise.all([reloadAvail(), reloadDash()]);
    setFilter("active");
  };

  const TABS = [["active", "En cours", active.length], ["pending", "Nouvelles", pending.length], ["errands", "Coursier", errandCount], ["done", "Terminées", 0]];
  const EMPTY = {
    active: ["Aucune course en cours", "Acceptez une demande pour commencer."],
    pending: ["Aucune nouvelle demande", "Restez en ligne pour recevoir des demandes."],
    done: ["Aucune course terminée", "Vos livraisons terminées apparaîtront ici."],
  };

  return (
    <div className="t-scr gray" style={{ minHeight: "100%" }}>
      <div className="t-sticky">
        <div className="t-head"><h1>Mes courses</h1></div>
        <div className="t-tabs">
          {TABS.map(([k, l, n]) => <button key={k} className={"t-tab" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>{l}{n > 0 ? ` (${n})` : ""}</button>)}
        </div>
      </div>

      {filter === "errands" ? <div style={{ padding: 16 }}><DrErrandsPanel onCount={setErrandCount} /></div> : <>
        {(l1 || l2) && <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><div className="spinner" /></div>}

        {!l1 && !l2 && list.length === 0 && <div className="t-card tk-box" style={{ textAlign: "center", padding: "28px 20px" }}>
          <div style={{ fontWeight: 600 }}>{EMPTY[filter][0]}</div>
          <div className="t-sub" style={{ marginTop: 4 }}>{EMPTY[filter][1]}</div>
          {filter === "active" && pending.length > 0 && <button className="t-pill-btn" style={{ marginTop: 12, height: 36 }} onClick={() => setFilter("pending")}>Voir {pending.length} demande{pending.length > 1 ? "s" : ""}</button>}
        </div>}

        {list.map((d) => (
          <div key={d.id} className="t-card tk-box" onClick={() => filter === "active" && go("drDelivery", d.raw)} role={filter === "active" ? "button" : undefined} style={{ cursor: filter === "active" ? "pointer" : "default" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{d.from}</div>
                <div className="t-sub" style={{ marginTop: 2 }}>{[d.fromAddr, d.distance].filter(Boolean).join(" · ")}</div>
                {d.to && <div className="t-sub" style={{ marginTop: 2 }}>→ {d.to}</div>}
                <div className="t-mut" style={{ marginTop: 4 }}>{d.ref} · <b style={{ color: filter === "active" ? "var(--acc-d)" : "var(--t-sub)", fontWeight: 600 }}>{filter === "pending" ? "Nouvelle demande" : STATUS[d.status] || d.status}</b>{filter === "done" && d.time ? " · " + d.time : ""}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--acc-d)" }}>+{fmt(d.fee)}</div>
                <div className="t-mut">votre gain</div>
              </div>
            </div>
            {filter !== "done" && d.total > 0 && <div className="t-sub" style={{ marginTop: 8 }}>À encaisser : <b style={{ color: "var(--t-text)" }}>{fmt(d.total)}</b></div>}
            {filter === "pending" && <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="t-cta ghost" onClick={() => setHidden((h) => [...h, d.id])}><span>Ignorer</span></button>
              <button className="t-cta center" disabled={accepting === d.id} onClick={() => accept(d)}><span>{accepting === d.id ? "…" : "Accepter"}</span></button>
            </div>}
            {filter === "active" && <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, fontWeight: 600, color: "var(--acc)" }}>Ouvrir la course <Icon name="chevron_right" size={18} color="var(--acc)" /></div>}
          </div>
        ))}
        <div style={{ height: 20 }} />
      </>}
    </div>
  );
}

export default DrDeliveriesScr;
