import { useEffect, useRef, useState } from "react";
import { useLoad } from "../../hooks";
import driver from "../../services/driverService";
import driverAPI from "../../api/driver";
import { fmt } from "../../utils/helpers";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";
import { useApp } from "../../context/AppContext";

const STEP = { assigned: "Retrait", pickup_arrived: "Retrait", picked_up: "Livraison", delivering: "Livraison" };
const list = (x, ...keys) => { if (Array.isArray(x)) return x; for (const k of keys) if (Array.isArray(x?.[k])) return x[k]; return []; };
const km = (d) => (d.distance_km ? `${Number(d.distance_km).toFixed(1)} km` : "");
const when = (s) => {
  const t = s ? new Date(String(s).replace(" ", "T")) : null;
  return t && !isNaN(t) ? t.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " · " + t.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
};

/**
 * Accueil livreur : disponibilité, gains du jour, livraisons en cours, nouvelles demandes, dernières livraisons.
 * Données réelles uniquement (GET /driver/dashboard, /driver/deliveries, /driver/history).
 */
function DrDashboardScr({ go }) {
  const { user, userName } = useApp();
  const firstName = (userName || user?.first_name || "").split(" ")[0];
  const [onlineLocal, setOnlineLocal] = useState(null);
  const [accepting, setAccepting] = useState(null);
  const { data: dash, reload: reloadDash } = useLoad(() => driver.getDashboard());
  const { data: avail, reload: reloadAvail } = useLoad(() => driver.getAvailable());
  const { data: hist, reload: reloadHist } = useLoad(() => driver.getHistory());
  const reloadAll = () => Promise.all([reloadDash(), reloadAvail(), reloadHist()]);

  // Nouvelles demandes et suivi : actualisation régulière
  // (toutes les 10 s : une course proposée à moi seul n'attend que quelques dizaines de secondes)
  useEffect(() => { const t = setInterval(() => { reloadDash(); reloadAvail(); }, 10000); return () => clearInterval(t); }, []);
  // Compte à rebours des courses proposées à moi seul (attribution au plus proche, livreur attitré)
  const [tick, setTick] = useState(0);
  const loadedAt = useRef(Date.now());
  useEffect(() => { loadedAt.current = Date.now(); }, [avail]);
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 1000); return () => clearInterval(t); }, []);
  const left = (d) => (d.offer ? Math.max(0, d.offer.expires_in - Math.floor((Date.now() - loadedAt.current) / 1000)) : null);
  const [declining, setDeclining] = useState(null);
  const decline = async (d) => {
    setDeclining(d.id);
    try { await driverAPI.declineDelivery(d.id); toast.info("Course refusée : elle est proposée à un autre livreur"); }
    catch (e) { toast.error(e?.message || "Impossible de refuser"); }
    setDeclining(null); reloadAvail();
  };

  const online = onlineLocal ?? (dash?.driver ? String(dash.driver.is_available) === "1" : false);
  const toggleOnline = async () => {
    const next = !online;
    try { await driverAPI.setAvailability(next ? 1 : 0); }
    catch (err) { toast.error(err.message || "Impossible de changer votre disponibilité"); return; }
    setOnlineLocal(next);
  };

  const today = dash?.today || {};
  const active = list(dash?.active);
  // Courses proposées à moi seul d'abord, et plus celles dont le délai est passé
  const pending = list(avail, "deliveries", "data").filter((x) => x.status === "pending" && (!x.offer || left(x) > 0)).sort((a, b) => (b.offer ? 1 : 0) - (a.offer ? 1 : 0)); void tick;
  const history = list(hist, "deliveries", "data", "history");

  const accept = async (d) => {
    setAccepting(d.id);
    try {
      await driver.acceptDelivery(d.id);
      const r = await driver.getDashboard();
      const mine = list(r?.active).find((x) => Number(x.id) === Number(d.id));
      await reloadAll();
      toast.success("Livraison acceptée");
      if (mine) go("drDelivery", mine);
    } catch (e) { toast.error(e?.message || "Cette livraison n'est plus disponible"); reloadAvail(); }
    setAccepting(null);
  };

  return (
    <PullToRefresh onRefresh={reloadAll}>
      <div className="t-scr gray" style={{ minHeight: "100%" }}>
        <div className="t-head" style={{ background: "var(--card)" }}>
          <h1>{firstName ? `Bonjour ${firstName}` : "Accueil"}</h1>
          <button onClick={toggleOnline} className={"t-chip" + (online ? " on" : "")} style={{ height: 34 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: online ? "var(--acc)" : "#9CA3AF" }} />{online ? "En ligne" : "Hors ligne"}
          </button>
          <button className="t-back" style={{ marginLeft: 0, marginRight: -8 }} onClick={() => go("drNotif")} aria-label="Notifications"><Icon name="bell" size={22} /></button>
        </div>

        {!online && <div className="t-card tk-box" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Icon name="info" size={20} color="var(--t-sub)" />
          <span className="t-sub" style={{ flex: 1, fontSize: 14 }}>Vous êtes hors ligne : passez en ligne pour recevoir des livraisons.</span>
        </div>}

        <div style={{ display: "flex", gap: 10, margin: "12px 16px" }}>
          {[["Gains du jour", fmt(Number(today.total_earned) || 0)], ["Livraisons du jour", String(Number(today.total_deliveries) || 0)]].map(([l, v]) => (
            <div key={l} className="t-card" style={{ flex: 1, margin: 0, padding: 16 }}>
              <div className="t-sub" style={{ fontSize: 13 }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>

        {active.length > 0 && <>
          <div className="tk-h" style={{ margin: "18px 16px 0" }}>En cours</div>
          {active.map((d) => (
            <div key={d.id} className="t-card tk-box" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }} onClick={() => go("drDelivery", d)} role="button">
              <span style={{ width: 40, height: 40, borderRadius: 10, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="package" size={20} color="var(--acc)" /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.establishment_name} → {d.client_name || "Client"}</div>
                <div className="t-sub" style={{ fontSize: 13 }}>{d.ref} · <b style={{ color: "var(--acc-d)", fontWeight: 600 }}>{STEP[d.status] || "En cours"}</b></div>
              </div>
              <Icon name="chevron_right" size={20} color="var(--t-mut)" />
            </div>
          ))}
        </>}

        <div className="tk-h" style={{ margin: "18px 16px 0" }}>Nouvelles demandes</div>
        {pending.length === 0
          ? <div className="t-card tk-box" style={{ textAlign: "center", padding: "26px 20px" }}>
            <div style={{ fontWeight: 600 }}>Aucune demande pour le moment</div>
            <div className="t-sub" style={{ fontSize: 14, marginTop: 4 }}>{online ? "Les nouvelles livraisons apparaissent ici automatiquement." : "Passez en ligne pour en recevoir."}</div>
          </div>
          : pending.map((d) => (
            <div key={d.id} className={"t-card tk-box" + (d.offer ? " dr-offer" : "")}>
              {d.offer && <div className="dr-offer-head">
                <span>{d.offer.source === "own" ? "Course de votre commerce partenaire" : "Course proposée pour vous"}</span>
                <b>{left(d)} s</b>
                <i style={{ width: `${Math.min(100, (left(d) / Math.max(1, d.offer.expires_in)) * 100)}%` }} />
              </div>}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{d.establishment_name}</div>
                  <div className="t-sub" style={{ fontSize: 13, marginTop: 2 }}>{[d.pickup_address_text || d.pickup_address, km(d)].filter(Boolean).join(" · ")}</div>
                  {d.dropoff_address && <div className="t-sub" style={{ fontSize: 13, marginTop: 2 }}>→ {d.dropoff_address}</div>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--acc-d)" }}>+{fmt(Number(d.driver_earning) || Number(d.fee) || 0)}</div>
                  <div className="t-mut" style={{ fontSize: 12 }}>votre gain</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {d.offer && <button className="t-cta ghost center" style={{ flex: "0 0 36%" }} disabled={declining === d.id} onClick={() => decline(d)}><span>{declining === d.id ? "…" : "Refuser"}</span></button>}
                <button className="t-cta center" style={{ flex: 1 }} disabled={!online || accepting === d.id} onClick={() => accept(d)}>
                  <span>{accepting === d.id ? "…" : online ? "Accepter" : "Passez en ligne pour accepter"}</span>
                </button>
              </div>
            </div>
          ))}

        {history.length > 0 && <>
          <div style={{ display: "flex", alignItems: "center", margin: "18px 16px 0" }}>
            <div className="tk-h" style={{ flex: 1, margin: 0 }}>Dernières livraisons</div>
            <button className="t-pill-btn" onClick={() => go("drHistory")}>Tout voir</button>
          </div>
          <div className="t-card tk-box" style={{ padding: "4px 16px" }}>
            {history.slice(0, 3).map((h, i) => (
              <div key={h.id} className="t-row" style={{ padding: "12px 0", borderTop: i ? "1px solid var(--t-line)" : "none" }}>
                <span><span style={{ display: "block", fontSize: 15 }}>{h.ref}</span><span className="t-sub" style={{ fontSize: 13 }}>{when(h.delivered_at)}</span></span>
                <b style={{ color: "var(--acc-d)" }}>+{fmt(Number(h.driver_earning) || 0)}</b>
              </div>
            ))}
          </div>
        </>}
        <div style={{ height: 20 }} />
      </div>
    </PullToRefresh>
  );
}

export default DrDashboardScr;
