import { useCallback, useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { fmtPhone } from "../../utils/phoneValidation";
import { RouteMap, RouteStops } from "../../components/t/Route";
import MapScreen from "../../components/t/MapScreen";
import { useApp } from "../../context/AppContext";
import { errandsAPI } from "../../api";
import { fmt } from "../../utils/helpers";
import { ERRAND_STATUS } from "./CoursierScr";

const STEPS = ["pending", "assigned", "picked_up", "delivered"];
const HINT = {
  pending: "Nous cherchons un coursier disponible près du point de départ.",
  assigned: { send: "Le coursier se rend au point de retrait.", buy: "Le coursier se rend au magasin pour vos achats." },
  picked_up: { send: "Le colis est en route vers le destinataire.", buy: "Vos achats sont en route." },
  delivered: "Course terminée. Merci d'avoir utilisé Lamuka !",
  cancelled: "Cette course a été annulée.",
};

const Code = ({ label, code, hint }) => (
  <div className="tk-code">
    <small>{label}</small>
    <b>{code}</b>
    <span>{hint}</span>
  </div>
);

/** Suivi d'une course : carte, statut, codes, coursier, trajet, montants, annulation */
export default function ErrandDetailScr({ id, onBack }) {
  const { showToast } = useApp();
  const [e, setE] = useState(null);
  const [busy, setBusy] = useState(false);
  const [recenter, setRecenter] = useState(0);

  const load = useCallback(() => errandsAPI.detail(id).then((r) => setE(r?.errand || null)).catch(() => {}), [id]);
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [load]);

  const head = (title) => <div className="t-head" style={{ background: "var(--card)" }}><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>{title}</h1></div>;
  if (!e) return <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--card)" }}>{head("Course")}<div className="t-empty"><span className="spinner" style={{ borderColor: "var(--t-line)", borderTopColor: "var(--acc)", width: 28, height: 28 }} /></div></div>;

  const isBuy = e.type === "buy";
  const st = ERRAND_STATUS[e.status] || ERRAND_STATUS.pending;
  const idx = STEPS.indexOf(e.status);
  const live = e.status === "assigned" || e.status === "picked_up";
  const d = e.driver;
  const hint = HINT[e.status]; const hintTxt = typeof hint === "string" ? hint : hint?.[e.type];
  const a = { lat: e.pickup_lat, lng: e.pickup_lng };
  const b = { lat: e.dropoff_lat, lng: e.dropoff_lng };
  const pos = live && d?.current_lat ? { lat: d.current_lat, lng: d.current_lng } : null;
  const contact = (n, p) => [n, fmtPhone(p)].filter(Boolean).join(" · ");
  const total = Number(e.delivery_fee) + Number(e.items_cost || 0);

  const cancel = async () => {
    setBusy(true);
    try { await errandsAPI.cancel(e.id, "Annulée par le client"); showToast("Course annulée"); load(); }
    catch (err) { showToast(err.message || "Impossible d'annuler", "error"); }
    setBusy(false);
  };

  const status = <>
    <span className="tk-badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
    <div className="tk-hint">{hintTxt}</div>
    {idx >= 0 && <div className="tk-prog">{STEPS.map((s, i) => <span key={s} className={i <= idx ? "on" : ""} />)}</div>}
    {idx >= 0 && <div className="tk-progl"><span>Demandée</span><span>Acceptée</span><span>{isBuy ? "Achetée" : "Récupérée"}</span><span>Livrée</span></div>}
  </>;
  const codes = e.status !== "delivered" && e.status !== "cancelled" && <div style={{ display: "flex", gap: 10 }}>
    {e.pickup_code && e.status !== "picked_up" && <Code label="Code de retrait" code={e.pickup_code} hint="À donner au coursier au retrait" />}
    <Code label="Code de livraison" code={e.delivery_code} hint={isBuy ? "À donner au coursier à la livraison" : "À transmettre au destinataire"} />
  </div>;
  const vehicle = d ? [d.vehicle_type === "moto" ? "Moto" : d.vehicle_type === "velo" ? "Vélo" : d.vehicle_type === "voiture" ? "Voiture" : "", d.vehicle_plate].filter(Boolean).join(" · ") : "";
  const stops = <RouteStops stops={[
    { kind: "a", title: isBuy ? "Acheter chez" : "Récupérer chez", main: isBuy ? e.store_name : e.pickup_address, sub: isBuy ? e.pickup_address : contact(e.pickup_contact, e.pickup_phone), action: null },
    { kind: "b", title: "Livrer à", main: e.dropoff_address, sub: contact(e.dropoff_contact, e.dropoff_phone), action: null },
  ]} />;
  const money = <>
    <div className="tk-h">{isBuy ? "Liste d'achats" : "Colis"}</div>
    <div style={{ fontSize: 14, color: "var(--t-sub)", lineHeight: 1.5, whiteSpace: "pre-wrap", marginBottom: 12 }}>{e.description}</div>
    <div className="t-row"><span className="t-sub">Frais de course</span><span>{fmt(e.delivery_fee)}</span></div>
    {isBuy && <div className="t-row"><span className="t-sub">Achats</span><span>{e.items_cost != null ? fmt(e.items_cost) : e.items_budget > 0 ? `≈ ${fmt(e.items_budget)}` : "Selon le ticket"}</span></div>}
    <div className="t-row" style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}><span>{e.status === "delivered" ? "Payé en espèces" : "À payer en espèces"}</span><span>{fmt(total)}{isBuy && e.items_cost == null ? " + achats" : ""}</span></div>
  </>;

  // ── Course en cours avec un trajet : carte plein écran + panneau ──
  if (["pending", "assigned", "picked_up"].includes(e.status) && (a.lat || b.lat)) return (
    <MapScreen
      map={(pad) => <RouteMap a={a.lat ? a : null} b={b} me={pos} meKind="driver" next={e.status === "picked_up" ? "b" : "a"} height="100%" interactive padTop={70} padBottom={pad + 24} recenter={recenter} routeLabel="total" />}
      top={<>
        <button className="tk-mapbtn" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={20} /></button>
        <span className="tm-chip">{isBuy ? "Achat" : "Envoi"} {e.ref}</span>
        <span className="sp" />
        <button className="tk-mapbtn" onClick={() => setRecenter((n) => n + 1)} aria-label="Recentrer la carte"><Icon name="navigation" size={18} /></button>
      </>}
      footer={e.status === "pending" ? <button className="t-cta ghost center" disabled={busy} onClick={cancel}>Annuler la course</button> : null}
      peek={<>
        <div className="tm-card">{status}</div>
        {(d || codes) && <div className="tm-card">
          {d && <div className="tm-person" style={codes ? { marginBottom: 12 } : undefined}>
            <div className="av">{d.avatar ? <img src={d.avatar} alt="" /> : (d.first_name || "?")[0]}</div>
            <div className="nm"><b>{[d.first_name, d.last_name].filter(Boolean).join(" ")}</b><small>Votre coursier{vehicle ? ` · ${vehicle}` : ""}{Number(d.avg_rating) > 0 ? ` · ★ ${Number(d.avg_rating).toFixed(1)}` : ""}</small></div>
            <div className="acts">{d.phone && <a href={`tel:${d.phone}`} className="t-round-btn" style={{ background: "var(--acc)", textDecoration: "none" }} aria-label="Appeler le coursier"><Icon name="phone" size={20} color="#fff" /></a>}</div>
          </div>}
          {codes}
        </div>}
      </>}
    >
      <div className="t-card tk-box">{stops}</div>
      <div className="t-card tk-box">{money}</div>
      <div style={{ height: 8 }} />
    </MapScreen>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      {head(`${isBuy ? "Achat" : "Envoi"} ${e.ref}`)}
      <div className="t-scr gray">
        <div className="t-card tk-box">{status}</div>
        {codes && <div className="t-card tk-box">{codes}</div>}
        {d && <div className="t-card tk-box" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="tk-av">{d.avatar ? <img src={d.avatar} alt="" /> : (d.first_name || "?")[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{[d.first_name, d.last_name].filter(Boolean).join(" ")}</div>
            <div className="t-mut">{vehicle}{Number(d.avg_rating) > 0 ? ` · ★ ${Number(d.avg_rating).toFixed(1)}` : ""}</div>
          </div>
          {d.phone && live && <a href={`tel:${d.phone}`} className="t-round-btn" style={{ background: "var(--acc)", textDecoration: "none" }} aria-label="Appeler"><Icon name="phone" size={20} color="#fff" /></a>}
        </div>}
        <div className="t-card tk-box">{stops}</div>
        <div className="t-card tk-box">{money}</div>
        <div style={{ height: 12 }} />
      </div>
      {e.status === "pending" && <div className="t-bottom"><button className="t-cta ghost center" style={{ flex: 1 }} disabled={busy} onClick={cancel}>Annuler la course</button></div>}
    </div>
  );
}