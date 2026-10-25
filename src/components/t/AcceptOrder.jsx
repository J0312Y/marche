import { useState } from "react";
import Sheet from "./Sheet";
import Icon from "../Icon";
import vendorAPI from "../../api/vendor";
import vendorService from "../../services/vendorService";
import { fmtPhone } from "../../utils/phoneValidation";

/**
 * Acceptation d'une commande par le commerçant.
 * Sans livreur attitré : acceptée tout de suite, Lamuka propose la course au livreur le plus proche.
 * Avec des livreurs attitrés : feuille « Qui livre cette commande ? » — Lamuka, ou l'un d'eux
 * (proposée d'abord à lui seul ; s'il ne répond pas, Lamuka prend le relais).
 * useAcceptOrder() → { accept(order) : Promise<boolean>, sheet : élément à afficher }
 */
export default function useAcceptOrder() {
  const [ask, setAsk] = useState(null); // { order, drivers, resolve, reject }
  const [busy, setBusy] = useState(false);

  const send = async (order, driverId) => {
    await vendorService.updateOrderStatus(order.id, "confirmed", undefined, driverId ? { driver_id: driverId } : {});
  };

  const accept = async (order) => {
    let drivers = [];
    try { drivers = (await vendorAPI.ownDrivers())?.drivers || []; } catch { drivers = []; }
    if (!drivers.length) { await send(order); return true; }
    return new Promise((resolve, reject) => setAsk({ order, drivers, resolve, reject }));
  };

  const choose = async (driverId) => {
    setBusy(true);
    try { await send(ask.order, driverId); ask.resolve(true); }
    catch (e) { ask.reject(e); }
    setAsk(null); setBusy(false);
  };
  const cancel = () => { ask?.resolve(false); setAsk(null); };

  const sheet = ask && (
    <Sheet onClose={() => !busy && cancel()} title="Qui livre cette commande ?">
      <div style={{ padding: "0 16px 20px" }}>
        <button className="t-li" disabled={busy} onClick={() => choose(null)}>
          <span className="ic" style={{ background: "var(--acc-l)" }}><Icon name="bike" size={20} color="var(--acc)" /></span>
          <span style={{ flex: 1, textAlign: "left" }}><b style={{ display: "block", fontSize: 15 }}>Lamuka trouve un livreur</b><small className="t-sub">Proposée au livreur le plus proche</small></span>
        </button>
        <div className="t-sub" style={{ fontSize: 13, margin: "14px 4px 6px" }}>Ou l'un de vos livreurs (s'il ne répond pas, Lamuka prend le relais)</div>
        {ask.drivers.map((d) => {
          const free = d.online && !d.busy;
          return (
            <button key={d.id} className="t-li" disabled={busy} onClick={() => choose(d.id)}>
              <span className="ic">{d.avatar ? <img src={d.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : <b style={{ color: "var(--acc)" }}>{(d.first_name || "?")[0]}</b>}</span>
              <span style={{ flex: 1, textAlign: "left" }}>
                <b style={{ display: "block", fontSize: 15 }}>{[d.first_name, d.last_name].filter(Boolean).join(" ")}</b>
                <small className="t-sub">{fmtPhone(d.phone)} · <span style={{ color: free ? "var(--acc-d)" : "var(--t-sub)", fontWeight: 600 }}>{d.busy ? "En course" : d.online ? "En ligne" : "Hors ligne"}</span></small>
              </span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
  return { accept, sheet };
}
