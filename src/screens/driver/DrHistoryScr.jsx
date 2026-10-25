import { useEffect, useMemo, useState } from "react";
import Icon from "../../components/Icon";
import api from "../../api/client";
import { fmt } from "../../utils/helpers";

const DAY = 86400000;
const parse = (d) => (d ? new Date(String(d).replace(" ", "T")) : null);
const startOfDay = (t) => { const x = new Date(t); x.setHours(0, 0, 0, 0); return x; };
const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

/** Historique et gains du livreur : calculés à partir de ses courses livrées (GET /driver/history) */
export default function DrHistoryScr({ onBack }) {
  const [rows, setRows] = useState(null);
  const [period, setPeriod] = useState("week");
  useEffect(() => {
    let alive = true;
    (async () => {
      const all = [];
      for (let p = 1; p <= 10; p++) { // 50 courses par page côté serveur
        const r = await api.get(`/driver/history?page=${p}&limit=50`).catch(() => null);
        const list = Array.isArray(r) ? r : r?.deliveries || [];
        all.push(...list);
        if (list.length < 50) break;
      }
      if (alive) setRows(all);
    })();
    return () => { alive = false; };
  }, []);

  const items = useMemo(() => (rows || []).map((d) => ({
    id: d.id, ref: d.ref || d.order_id, gain: parseInt(d.driver_earning || d.fee) || 0,
    km: parseFloat(d.distance_km) || null, at: parse(d.delivered_at || d.updated_at), to: d.dropoff_address || "",
  })), [rows]);

  const now = new Date();
  const from = period === "today" ? startOfDay(now) : period === "week" ? startOfDay(now - 6 * DAY) : period === "month" ? startOfDay(now - 27 * DAY) : null;
  const inPeriod = items.filter((i) => !from || (i.at && i.at >= from));
  const total = inPeriod.reduce((s, i) => s + i.gain, 0);
  const km = inPeriod.reduce((s, i) => s + (i.km || 0), 0);

  // Barres : 7 derniers jours, ou 4 dernières semaines
  const bars = period === "week" ? Array.from({ length: 7 }, (_, k) => {
    const d0 = startOfDay(now - (6 - k) * DAY), d1 = new Date(+d0 + DAY);
    return { l: DAYS[d0.getDay()], v: items.filter((i) => i.at >= d0 && i.at < d1).reduce((s, i) => s + i.gain, 0) };
  }) : period === "month" ? Array.from({ length: 4 }, (_, k) => {
    const d0 = startOfDay(now - (27 - k * 7) * DAY), d1 = new Date(+d0 + 7 * DAY);
    return { l: d0.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }), v: items.filter((i) => i.at >= d0 && i.at < d1).reduce((s, i) => s + i.gain, 0) };
  }) : null;
  const max = bars ? Math.max(1, ...bars.map((b) => b.v)) : 1;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>Historique et gains</h1></div>
      <div className="t-tabs" style={{ background: "var(--card)" }}>
        {[["today", "Aujourd'hui"], ["week", "7 jours"], ["month", "4 semaines"], ["all", "Tout"]].map(([k, l]) => <button key={k} className={"t-tab" + (period === k ? " on" : "")} onClick={() => setPeriod(k)}>{l}</button>)}
      </div>
      <div className="t-scr gray">
        {rows === null ? <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><div className="spinner" /></div> : <>
          <div className="t-card tk-box" style={{ display: "flex", gap: 8 }}>
            {[["Gains", fmt(total)], ["Courses", String(inPeriod.length)], ["Distance", km ? km.toFixed(1).replace(".", ",") + " km" : "—"]].map(([l, v]) => (
              <div key={l} style={{ flex: 1, textAlign: "center" }}><div className="t-sub" style={{ fontSize: 13 }}>{l}</div><div style={{ fontSize: 19, fontWeight: 700, marginTop: 2, color: l === "Gains" ? "var(--acc-d)" : undefined }}>{v}</div></div>
            ))}
          </div>
          {bars && <div className="t-card tk-box">
            <div className="tk-h">Gains par {period === "week" ? "jour" : "semaine"}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, marginTop: 8 }}>
              {bars.map((b, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                  {b.v > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: "var(--acc-d)" }}>{b.v >= 1000 ? Math.round(b.v / 100) / 10 + "k" : b.v}</span>}
                  <div style={{ width: "100%", borderRadius: 6, background: b.v ? "var(--acc)" : "var(--t-bg2)", height: Math.max(4, (b.v / max) * 80) }} />
                  <span className="t-mut" style={{ fontSize: 11 }}>{b.l}</span>
                </div>
              ))}
            </div>
          </div>}
          {inPeriod.length === 0 ? <div className="t-card tk-box" style={{ textAlign: "center", padding: "26px 20px" }}><div style={{ fontWeight: 600 }}>Aucune course sur cette période</div><div className="t-sub" style={{ marginTop: 4 }}>Vos livraisons terminées apparaîtront ici.</div></div>
            : <div className="t-card tk-box" style={{ padding: "4px 16px" }}>{inPeriod.map((i, k) => (
              <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: k ? "1px solid var(--t-line)" : "none" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{i.ref}</div>
                  <div className="t-sub" style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{[i.at && i.at.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " · " + i.at.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), i.km && i.km.toFixed(1).replace(".", ",") + " km", i.to].filter(Boolean).join(" · ")}</div>
                </div>
                <b style={{ color: "var(--acc-d)" }}>+{fmt(i.gain)}</b>
              </div>
            ))}</div>}
        </>}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
