import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../../components/Icon";
import { RouteMap, RouteStops } from "../../components/t/Route";
import toast from "../../utils/toast";
import useDriverPosition from "../../hooks/useDriverPosition";
import { errandsAPI } from "../../api";
import driverAPI from "../../api/driver";
import { fmt } from "../../utils/helpers";

// Ouvre la navigation GPS (Google Maps / appli par défaut) vers un point
const navTo = (lat, lng) => { if (lat && lng) window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`, "_blank"); };
const contact = (n, p) => [n, p].filter(Boolean).join(" · ");

function Stops({ e }) {
  const isBuy = e.type === "buy";
  const btns = (lat, lng, phone) => (
    <div style={{ display: "flex", gap: 6 }}>
      {phone && <a className="tk-nav" href={`tel:${phone}`} onClick={(x) => x.stopPropagation()} aria-label="Appeler"><Icon name="phone" size={17} color="var(--acc)" /></a>}
      {lat && <button className="tk-nav" onClick={(x) => { x.stopPropagation(); navTo(lat, lng); }} aria-label="Itinéraire"><Icon name="navigation" size={18} color="var(--acc)" /></button>}
    </div>
  );
  return <RouteStops stops={[
    { kind: "a", title: isBuy ? "Acheter chez" : "Récupérer chez", main: isBuy ? e.store_name : e.pickup_address, sub: isBuy ? e.pickup_address : contact(e.pickup_contact, e.pickup_phone), action: btns(e.pickup_lat, e.pickup_lng, e.pickup_phone) },
    { kind: "b", title: "Livrer à", main: e.dropoff_address, sub: contact(e.dropoff_contact, e.dropoff_phone), action: btns(e.dropoff_lat, e.dropoff_lng, e.dropoff_phone) },
  ]} />;
}

function Card({ e, live, me, offer, children }) {
  const isBuy = e.type === "buy";
  const step = e.status === "assigned" ? (isBuy ? "Faire les achats" : "Récupérer le colis") : e.status === "picked_up" ? "Livrer" : "Nouvelle course";
  return (
    <div className={"t-card tk-box" + (offer ? " dr-offer" : "")} style={{ margin: "0 0 12px" }}>
      {offer && <div className="dr-offer-head"><span>Course proposée pour vous</span><b>{offer.left} s</b><i style={{ width: `${Math.min(100, (offer.left / Math.max(1, offer.total)) * 100)}%` }} /></div>}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span className="tk-kind"><Icon name={isBuy ? "bag" : "package"} size={20} color="var(--acc)" /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{isBuy ? "Achat" : "Envoi de colis"}</div>
          <div className="t-mut" style={{ fontSize: 12 }}>{e.ref}{e.distance_km ? ` · ${Number(e.distance_km).toFixed(1)} km` : ""} · {step}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--acc)" }}>+{fmt(e.delivery_fee)}</div>
          <div className="t-mut" style={{ fontSize: 11 }}>votre gain</div>
        </div>
      </div>
      {live && (e.pickup_lat || e.dropoff_lat) && <RouteMap a={e.pickup_lat ? { lat: e.pickup_lat, lng: e.pickup_lng } : null} b={{ lat: e.dropoff_lat, lng: e.dropoff_lng }} me={me} next={e.status === "picked_up" ? "b" : "a"} height={140} style={{ marginBottom: 6 }} />}
      <Stops e={e} />
      <div className="tk-desc"><b>{isBuy ? "À acheter" : "Colis"}</b>{e.description}{isBuy && e.items_budget > 0 ? `\nBudget indiqué : ≈ ${fmt(e.items_budget)}` : ""}</div>
      {children}
    </div>
  );
}

/** Saisie d'un code ou d'un montant + bouton d'action */
function Act({ placeholder, value, onChange, money, label, disabled, onClick }) {
  return (
    <div className="tk-act">
      {money ? <div className="tk-money" style={{ flex: 1 }}><input inputMode="numeric" placeholder={placeholder} value={value} onChange={(x) => onChange(x.target.value.replace(/\D/g, "").slice(0, 7))} /><span>FCFA</span></div>
        : <input className="tk-pin" inputMode="numeric" maxLength={6} placeholder={placeholder} value={value} onChange={(x) => onChange(x.target.value.replace(/\D/g, "").slice(0, 6))} />}
      <button className="t-cta center" disabled={disabled} onClick={onClick}>{label}</button>
    </div>
  );
}

/**
 * Courses du coursier (envoyer un colis / faire un achat) côté livreur.
 * Retrait : code de l'expéditeur ('send') ou montant payé au magasin ('buy') ; livraison : code du destinataire.
 */
export default function DrErrandsPanel({ onCount }) {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(null);
  const [inputs, setInputs] = useState({});
  const me = useDriverPosition(!!data?.active?.length);

  const load = useCallback(() => errandsAPI.driverList().then((r) => { setData(r); onCount?.((r?.available?.length || 0) + (r?.active?.length || 0)); }).catch(() => setData({ available: [], active: [] })), [onCount]);
  // toutes les 10 s : une course proposée à moi seul n'attend que quelques dizaines de secondes
  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t); }, [load]);
  // Compte à rebours des courses proposées à moi seul (attribution au plus proche)
  const [, setTick] = useState(0);
  const loadedAt = useRef(Date.now());
  useEffect(() => { loadedAt.current = Date.now(); }, [data]);
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 1000); return () => clearInterval(t); }, []);
  const left = (e) => (e.offer ? Math.max(0, e.offer.expires_in - Math.floor((Date.now() - loadedAt.current) / 1000)) : null);

  const act = async (id, fn, ok) => {
    setBusy(id);
    try { const r = await fn(); toast.success(typeof ok === "function" ? ok(r) : ok); setInputs((x) => ({ ...x, [id]: "" })); await load(); }
    catch (e) { toast.error(e?.message || "Action impossible"); }
    setBusy(null);
  };

  if (!data) return <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><div className="spinner" /></div>;
  const { active = [] } = data;
  const available = (data.available || []).filter((e) => !e.offer || left(e) > 0).sort((a, b) => (b.offer ? 1 : 0) - (a.offer ? 1 : 0));

  return (
    <div style={{ fontFamily: "var(--t-font)", color: "var(--t-text)" }}>
      {active.length > 0 && <div className="tk-h" style={{ margin: "4px 0 10px" }}>En cours</div>}
      {active.map((e) => {
        const v = inputs[e.id] || "";
        const set = (val) => setInputs((x) => ({ ...x, [e.id]: val }));
        const toCollect = Number(e.delivery_fee) + Number(e.items_cost || 0);
        return (
          <Card key={e.id} e={e} live me={me}>
            {e.status === "assigned" && (e.type === "send"
              ? <><div className="tk-ask">Demandez le <b>code de retrait</b> à l'expéditeur.</div>
                <Act placeholder="• • • • • •" value={v} onChange={set} label="Colis récupéré" disabled={busy === e.id || v.length !== 6} onClick={() => act(e.id, () => errandsAPI.pickup(e.id, { pickup_code: v }), "Colis récupéré")} /></>
              : <><div className="tk-ask">Après les achats, saisissez le <b>montant du ticket</b>.</div>
                <Act money placeholder="Montant payé" value={v} onChange={set} label="Achats faits" disabled={busy === e.id || !v} onClick={() => act(e.id, () => errandsAPI.pickup(e.id, { items_cost: Number(v) }), "Achats enregistrés")} /></>)}
            {e.status === "picked_up" && <>
              <div className="tk-collect"><span>À encaisser en espèces</span><b>{fmt(toCollect)}</b></div>
              {Number(e.items_cost) > 0 && <div className="t-mut" style={{ fontSize: 12, marginTop: 4 }}>dont achats {fmt(e.items_cost)} + course {fmt(e.delivery_fee)}</div>}
              <div className="tk-ask">Demandez le <b>code de livraison</b> au destinataire.</div>
              <Act placeholder="• • • • • •" value={v} onChange={set} label="Livrée" disabled={busy === e.id || v.length !== 6} onClick={() => act(e.id, () => errandsAPI.deliver(e.id, v), (r) => `Course livrée · +${fmt(r?.earning || e.delivery_fee)}`)} />
            </>}
          </Card>
        );
      })}

      <div className="tk-h" style={{ margin: "8px 0 10px" }}>Courses disponibles</div>
      {available.length === 0 && <div className="t-card tk-box" style={{ margin: 0, textAlign: "center", padding: "28px 20px" }}>
        <span className="tk-kind" style={{ margin: "0 auto 10px", width: 52, height: 52 }}><Icon name="bike" size={26} color="var(--acc)" /></span>
        <div style={{ fontWeight: 600 }}>Aucune course pour le moment</div>
        <div className="t-mut" style={{ marginTop: 4 }}>Les nouvelles demandes apparaissent ici automatiquement.</div>
      </div>}
      {available.map((e) => (
        <Card key={e.id} e={e} offer={e.offer ? { left: left(e), total: e.offer.expires_in } : null}>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {e.offer && <button className="t-cta ghost center" style={{ flex: "0 0 36%" }} disabled={busy === e.id} onClick={() => act(e.id, () => driverAPI.declineErrand(e.id), "Course refusée : elle est proposée à un autre livreur")}>Refuser</button>}
            <button className="t-cta center" style={{ flex: 1 }} disabled={busy === e.id} onClick={() => act(e.id, () => errandsAPI.accept(e.id), "Course acceptée")}>{busy === e.id ? "…" : "Accepter la course"}</button>
          </div>
        </Card>
      ))}
    </div>
  );
}
