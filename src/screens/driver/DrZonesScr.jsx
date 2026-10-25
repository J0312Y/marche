import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";
import driverService from "../../services/driverService";
import { loadZones, quarterList } from "../../utils/zone";

/** Mes quartiers : choisis parmi les quartiers des villes desservies (gérés dans le panneau, « Zones de livraison ») */
export default function DrZonesScr({ onBack }) {
  const [mine, setMine] = useState(null); // [{ id, zone_name }]
  const [, setTick] = useState(0);
  const [busy, setBusy] = useState(null);
  const reload = () => driverService.getZones().then((r) => setMine(Array.isArray(r) ? r : [])).catch(() => setMine([]));
  useEffect(() => { reload(); loadZones(true).then(() => setTick((t) => t + 1)); }, []);

  const byCity = {};
  quarterList().forEach((q) => { (byCity[q.zone || ""] = byCity[q.zone || ""] || []).push(q); });
  const has = (name) => (mine || []).find((z) => z.zone_name === name);
  const toggle = async (name) => {
    setBusy(name);
    try {
      const z = has(name);
      if (z) await driverService.removeZone(z.id); else await driverService.addZone(name);
      await reload();
    } catch (e) { toast.error(e?.message || "Modification impossible"); }
    setBusy(null);
  };
  const count = (mine || []).length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>Mes quartiers</h1></div>
      <div className="t-scr gray">
        <div className="t-card tk-box"><div className="t-sub" style={{ fontSize: 14, lineHeight: 1.5 }}>Choisissez les quartiers où vous préférez livrer. {mine === null ? "" : count ? `${count} quartier${count > 1 ? "s" : ""} choisi${count > 1 ? "s" : ""}.` : "Aucun pour l'instant."}</div></div>
        {mine === null ? <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><div className="spinner" /></div>
          : Object.entries(byCity).map(([city, qs]) => (
            <div key={city} className="t-card tk-box">
              {city && <div className="tk-h">{city}</div>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {qs.sort((a, b) => a.name.localeCompare(b.name, "fr")).map((q) => (
                  <button key={q.name} className={"t-chip" + (has(q.name) ? " on" : "")} disabled={busy === q.name} onClick={() => toggle(q.name)} aria-pressed={!!has(q.name)}>
                    {has(q.name) && <Icon name="check" size={14} color="currentColor" />}{q.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
