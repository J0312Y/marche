import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../Icon";
import useBackClose from "../../hooks/useBackClose";
import { addBasemap } from "../../utils/basemap";
import { addStoresLayer } from "../../utils/storesLayer";
import { cityCenter, zoneOf, quarterList, currentPosition, loadZones, reverseGeocode, checkZone } from "../../utils/zone";

/**
 * « Confirmer le lieu de livraison » (comme Toters) : carte, épingle fixe au centre,
 * bulle « Votre commande sera livrée ici » / « Oups, nous ne livrons pas ici ! »,
 * recherche de quartier, « Utiliser ma position », bouton de confirmation.
 * onConfirm({ lat, lng, quarter, zone }) n'est appelé que dans une zone livrée.
 */
export default function LocationPicker({ initial, useGps = false, title = "Confirmer le lieu de livraison", here = "Votre commande sera livrée ici", hint = "Déplacez l'épingle sur votre position exacte pour aider le livreur à vous trouver.", cta, onConfirm, onClose }) {
  const box = useRef(null);
  const map = useRef(null);
  const [ready, setReady] = useState(!!window.L);
  const [center, setCenter] = useState(initial?.lat ? [Number(initial.lat), Number(initial.lng)] : cityCenter()); // sinon : centre de la première ville livrée
  const [refused, setRefused] = useState(false); // confirmation tentée hors zone
  const [q, setQ] = useState(null); // recherche (null = fermée)
  const [gps, setGps] = useState(""); // "" | "busy" | "denied"
  const [moving, setMoving] = useState(false);
  useBackClose(true, () => (q !== null ? setQ(null) : onClose?.()));
  const [, setTick] = useState(0);
  useEffect(() => { Promise.resolve(loadZones(true)).then(() => { setCenter((c) => c || cityCenter()); setTick((n) => n + 1); }); }, []);

  // Leaflet (déjà utilisé par l'app, chargé depuis cdnjs)
  useEffect(() => {
    if (window.L) { setReady(true); return; }
    if (!document.querySelector('link[href*="leaflet"]')) {
      const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(l);
    }
    let s = document.querySelector('script[src*="leaflet"]');
    if (!s) { s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; document.head.appendChild(s); }
    const t = setInterval(() => { if (window.L) { clearInterval(t); setReady(true); } }, 100);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!ready || !box.current || map.current || !center) return;
    const L = window.L;
    const m = L.map(box.current, { center, zoom: 16, zoomControl: false, attributionControl: false });
    addBasemap(m);
    m.on("movestart", () => { setMoving(true); setRefused(false); });
    m.on("moveend", () => { const c = m.getCenter(); setCenter([c.lat, c.lng]); setMoving(false); });
    map.current = m;
    if (import.meta.env.DEV) window.__lkPickerMap = m; // accès pour les tests automatiques
    setTimeout(() => m.invalidateSize(), 50);
    if (useGps) locate();
    return () => { m.remove(); map.current = null; };
  }, [ready, !!center]); // eslint-disable-line react-hooks/exhaustive-deps

  // Commerces Lamuka autour (logo rond) : on voit ce qui livre près de chez soi ; toucher = nom du commerce
  useEffect(() => addStoresLayer(map.current), [ready, !!map.current]); // eslint-disable-line react-hooks/exhaustive-deps

  const flyTo = (lat, lng, z = 17) => map.current?.setView([lat, lng], z);
  async function locate() {
    setGps("busy");
    try { const p = await currentPosition(); setGps(""); flyTo(p.lat, p.lng); }
    catch (e) { setGps(e?.code === 1 ? "denied" : ""); }
  }

  const zone = zoneOf(center[0], center[1]);
  const [busy, setBusy] = useState(false);
  const confirm = async () => {
    setBusy(true);
    // Zone (le serveur fait foi) et nom du quartier demandés en même temps
    const [z, g] = await Promise.all([checkZone(center[0], center[1]), reverseGeocode(center[0], center[1])]);
    if (!z) { setBusy(false); setRefused(true); return; }
    setBusy(false);
    onConfirm?.({ lat: Number(center[0].toFixed(7)), lng: Number(center[1].toFixed(7)), zone: z, quarter: g.quarter, road: g.road });
  };
  const bubble = refused ? "Oups, nous ne livrons pas ici !" : here;
  const results = q ? quarterList().filter((x) => x.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""))) : quarterList();

  const ui = (
    <div className="tl-pick">
      <div className="tl-head"><button className="t-back" onClick={onClose} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><b>{title}</b></div>
      <div className="tl-map">
        <div ref={box} style={{ position: "absolute", inset: 0 }} />
        {!ready && <div className="tl-loading"><span className="spinner" /></div>}
        <button className="tl-search" onClick={() => setQ("")}><Icon name="search" size={22} color="var(--t-text)" /><span>Rechercher un quartier, une rue…</span></button>
        <div className={"tl-bubble" + (moving ? " up" : "")}>{bubble}</div>
        <div className={"tl-pin" + (moving ? " up" : "")}><span className="head" /><span className="stick" /></div>
        <span className="tl-dot" />
        <button className="tl-gps" onClick={locate} disabled={gps === "busy"}>
          <Icon name="crosshair" size={20} color="var(--t-sub)" />{gps === "busy" ? "Localisation…" : gps === "denied" ? "Autoriser la localisation" : "Utiliser ma position"}
        </button>
      </div>
      <div className="tl-card">
        <div className="tl-row"><Icon name="map_pin" size={26} color="var(--acc)" />
          <div><b>{title}</b><p>{hint}</p></div>
        </div>
        <button className="t-cta center" onClick={confirm} disabled={busy}>{busy ? "Un instant…" : cta || title}</button>
      </div>

      {q !== null && <div className="tl-sres">
        <div className="tl-head"><button className="t-back" onClick={() => setQ(null)} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><b>Rechercher un lieu</b></div>
        <div className="sb"><Icon name="search" size={22} color="var(--t-text)" /><input autoFocus placeholder="Quartier (ex. : Bacongo)" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="t-scr">
          {results.map((r) => (
            <button key={r.name} className="tl-res" onClick={() => { setQ(null); flyTo(r.lat, r.lng, 16); }}>
              <Icon name="map_pin" size={20} color="var(--t-sub)" /><span><b>{r.name}</b><small>{r.zone ? r.zone + ", Congo" : "Congo"}</small></span>
            </button>
          ))}
          {results.length === 0 && <div className="t-empty"><p>Aucun quartier trouvé. Déplacez l'épingle sur la carte.</p></div>}
        </div>
      </div>}
    </div>
  );
  const host = document.querySelector(".phone");
  return host ? createPortal(ui, host) : ui;
}
