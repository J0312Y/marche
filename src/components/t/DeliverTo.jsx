import { useEffect, useState } from "react";
import Sheet from "./Sheet";
import Icon from "../Icon";
import LocationPicker from "./LocationPicker";
import AddressForm from "./AddressForm";
import { useApp } from "../../context/AppContext";
import { addressesAPI } from "../../api";
import { getDeliverTo, setDeliverTo, currentPosition, zoneOf, nearestQuarter, citiesText } from "../../utils/zone";

/**
 * Feuille « Où livrer ? » (Toters « Where should we deliver to? ») :
 * adresses enregistrées, Utiliser ma position, Livrer ailleurs (carte), Ajouter une adresse (carte + détails).
 * Le lieu choisi est mémorisé (getDeliverTo) et affiché dans l'en-tête de l'accueil.
 */
export default function DeliverTo({ onClose }) {
  const { user, requireLogin, showToast } = useApp();
  const [step, setStep] = useState("sheet"); // sheet | map | add-map | form
  const [gpsState, setGpsState] = useState(() => { try { return localStorage.getItem("lk-geo") || "off"; } catch { return "off"; } });
  const [addrs, setAddrs] = useState(null);
  const [spot, setSpot] = useState(null);
  const [start, setStart] = useState(null);
  const cur = getDeliverTo();

  useEffect(() => {
    if (!user) { setAddrs([]); return; }
    addressesAPI.getAll().then((r) => setAddrs(Array.isArray(r) ? r : r?.addresses || [])).catch(() => setAddrs([]));
  }, [user]);

  const choose = (v) => { setDeliverTo(v); onClose?.(); };
  const allow = async () => {
    try { const p = await currentPosition(); try { localStorage.setItem("lk-geo", "on"); } catch {} setGpsState("on"); setStart(p); setStep("map"); }
    catch (e) { const s = e?.code === 1 ? "denied" : "off"; setGpsState(s); try { localStorage.setItem("lk-geo", s); } catch {} if (s === "denied") showToast("Localisation refusée : activez-la dans les réglages du téléphone", "error"); }
  };

  if (step === "map" || step === "add-map") return (
    <LocationPicker initial={start || cur} useGps={false} onClose={() => setStep("sheet")}
      onConfirm={(p) => {
        if (step === "map") choose({ lat: p.lat, lng: p.lng, quarter: p.quarter, label: p.quarter });
        else { setSpot(p); setStep("form"); }
      }} />
  );
  if (step === "form") return (
    <AddressForm spot={spot} onClose={() => setStep("sheet")} onMove={() => { setStart(spot); setStep("add-map"); }}
      onSaved={(a) => { showToast("Adresse enregistrée"); choose({ lat: a.latitude, lng: a.longitude, quarter: a.quarter, label: a.label, addressId: a.id }); }} />
  );

  return (
    <Sheet onClose={onClose} title="Où livrer ?">
      {addrs?.length > 0 && <div className="ta-addr" style={{ marginBottom: 14 }}>
        {addrs.map((a) => {
          const ok = a.latitude && zoneOf(Number(a.latitude), Number(a.longitude));
          const on = cur?.addressId && Number(cur.addressId) === Number(a.id);
          return (
            <button key={a.id} className="row" onClick={() => {
              if (!ok) { setStart(a.latitude ? { lat: Number(a.latitude), lng: Number(a.longitude) } : null); setSpot(null); setStep("add-map"); showToast(a.latitude ? `Cette adresse est hors zone : choisissez un lieu à ${citiesText()}` : "Placez cette adresse sur la carte", "info"); return; }
              choose({ lat: Number(a.latitude), lng: Number(a.longitude), quarter: a.quarter || nearestQuarter(Number(a.latitude), Number(a.longitude)), label: a.label, addressId: a.id });
            }}>
              <Icon name={/bureau/i.test(a.label || "") ? "briefcase" : "home"} size={22} color={on ? "var(--acc)" : "var(--t-text)"} />
              <div className="tx"><b>{a.label || a.quarter}</b><span>{ok ? [a.address, a.quarter].filter(Boolean).join(", ") : a.latitude ? "Hors zone de livraison" : "À placer sur la carte"}</span></div>
              {on ? <Icon name="check" size={20} color="var(--acc)" strokeWidth={2.6} /> : !ok && <span className="t-pill-btn">Placer</span>}
            </button>
          );
        })}
      </div>}
      <div className="ta-addr">
        <button className="row" onClick={() => (gpsState === "on" ? allow() : null)} style={{ cursor: gpsState === "on" ? "pointer" : "default" }}>
          <Icon name="navigation" size={22} color={gpsState === "on" ? "var(--acc)" : "var(--t-mut)"} />
          <div className="tx"><b style={{ color: gpsState === "on" ? "var(--t-text)" : "var(--t-mut)" }}>Utiliser ma position</b><span>{gpsState === "on" ? "Livrer à ma position actuelle" : gpsState === "denied" ? "Localisation refusée" : "Localisation désactivée"}</span></div>
          {gpsState !== "on" && <span className="t-pill-btn" onClick={(e) => { e.stopPropagation(); allow(); }}>Autoriser</span>}
        </button>
        <button className="row" onClick={() => { setStart(cur); setStep("map"); }}>
          <Icon name="map_pin" size={22} color="var(--t-text)" />
          <div className="tx"><b>Livrer ailleurs</b><span>Choisir sur la carte</span></div><Icon name="chevron_right" size={20} />
        </button>
        <button className="row" onClick={() => requireLogin("login", () => { setStart(cur); setStep("add-map"); })}>
          <Icon name="plus" size={22} color="var(--t-text)" />
          <div className="tx"><b>Ajouter une adresse</b><span>Choisir sur la carte</span></div><Icon name="chevron_right" size={20} />
        </button>
      </div>
      <div style={{ height: 14 }} />
    </Sheet>
  );
}
