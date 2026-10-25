import { useEffect, useMemo, useRef, useState } from "react";
import MapView from "../MapView";
import Icon from "../Icon";
import api from "../../api/client";
import { cityCenter } from "../../utils/zone";
import { addStoresLayer } from "../../utils/storesLayer";

// Épingles : départ = pastille verte, arrivée = carré sombre (codes visuels des applis de livraison)
const PIN_A = '<div style="width:22px;height:22px;border-radius:50%;background:#00B492;border:4px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>';
// Arrivée (adresse de livraison) : pastille sombre avec une maison
const PIN_B = '<div style="width:34px;height:34px;border-radius:50%;background:#1F2933;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/></svg></div>';
const PIN_ME = '<div style="width:18px;height:18px;border-radius:50%;background:#2563EB;border:3px solid #fff;box-shadow:0 0 0 6px rgba(37,99,235,.2)"></div>';
// Livreur (vu par le client) : moto blanche sur pastille verte
const PIN_MOTO = '<div style="width:40px;height:40px;border-radius:50%;background:#00B492;border:3px solid #fff;box-shadow:0 3px 12px rgba(0,180,146,.45);display:flex;align-items:center;justify-content:center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17" r="2.8"/><circle cx="18.5" cy="17" r="2.8"/><path d="M5.5 17h5l3-6h3l2 6M13.5 11l-1.5-4H9M16.5 11l1-3h2.5"/></svg></div>';
// Commerce : son logo dans une pastille blanche
const esc = (s) => String(s).replace(/"/g, "&quot;").replace(/</g, "&lt;");
const pinLogo = (src) => `<div style="width:40px;height:40px;border-radius:50%;background:#fff center/cover no-repeat url(&quot;${esc(src)}&quot;);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`;

const has = (p) => p && p.lat != null && p.lng != null && !Number.isNaN(Number(p.lat));
const r4 = (p) => `${Number(p.lat).toFixed(4)},${Number(p.lng).toFixed(4)}`; // ~10 m : pas de nouvel appel à chaque pas

// Itinéraires déjà calculés pendant la session (5 min : le temps estimé dépend de l'heure / de la circulation)
const cache = new Map();
const toPath = (coords) => (coords || []).map(([lat, lng]) => ({ lat, lng }));
async function roadRoute(points, alt = false) {
  const key = points.map(r4).join(";") + (alt ? "|alt" : "");
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < 5 * 60000) return hit.out;
  const r = await api.get(`/route?points=${encodeURIComponent(points.map(r4).join(";"))}${alt ? "&alt=1" : ""}`);
  const out = {
    path: toPath(r?.coords), distance_m: r?.distance_m || null, duration_s: r?.duration_s || null, legs: r?.legs || [], approx: !!r?.approx,
    // Temps selon la circulation (vitesse mesurée sur les trajets des livreurs ou réglée dans le panneau, heures de pointe)
    eta_min: r?.eta_min || null, speed_kmh: r?.speed_kmh || SPEED_KMH, rush: !!r?.rush,
    alternatives: (r?.alternatives || []).map((a) => ({ path: toPath(a.coords), distance_m: a.distance_m, eta_min: a.eta_min })),
  };
  if (!out.approx) cache.set(key, { at: Date.now(), out });
  return out;
}

/**
 * Carte du trajet : départ (a), arrivée (b), position du livreur (me), tracé par la route.
 * next : prochaine étape du livreur — "a" (aller au commerce, puis au client) ou "b" (aller au client).
 * Sans livreur : trajet a → b. onRoute({ distance_m, duration_s, legs: [m…], approx }) quand l'itinéraire est connu
 * (legs[0] = distance jusqu'à la prochaine étape).
 */
// Vitesse moyenne en ville pour le temps affiché (même hypothèse que l'heure d'arrivée du suivi)
export const SPEED_KMH = 20;
const distM = (p, q) => { const R = 6371000, a = (q.lat - p.lat) * Math.PI / 180, b = (q.lng - p.lng) * Math.PI / 180; const x = Math.sin(a / 2) ** 2 + Math.cos(p.lat * Math.PI / 180) * Math.cos(q.lat * Math.PI / 180) * Math.sin(b / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
const pathLength = (path) => { let d = 0; for (let i = 1; i < path.length; i++) d += distM(path[i - 1], path[i]); return d; };
/** Partie du tracé qui reste à parcourir depuis la position `me` (point le plus proche) */
function remainingPath(path, me) {
  if (!has(me) || path.length < 2) return path;
  const p = { lat: Number(me.lat), lng: Number(me.lng) };
  let best = 0, bd = Infinity;
  path.forEach((q, i) => { const d = distM(p, q); if (d < bd) { bd = d; best = i; } });
  return [p, ...path.slice(best + 1)];
}
/** Point situé à `target` mètres du début d'un tracé */
function pointAlong(path, target) {
  let done = 0;
  for (let i = 1; i < path.length; i++) {
    const d = distM(path[i - 1], path[i]);
    if (done + d >= target) { const k = d ? (target - done) / d : 0; return { lat: path[i - 1].lat + (path[i].lat - path[i - 1].lat) * k, lng: path[i - 1].lng + (path[i].lng - path[i - 1].lng) * k }; }
    done += d;
  }
  return path[path.length - 1] || null;
}

export function RouteMap({ a, b, me, next, height = 160, interactive = false, style, onRoute, padTop = 34, padBottom = 34, aLogo, meKind = "self", recenter = 0, routeLabel, alternatives = false }) {
  const mapRef = useRef(null);
  const userMoved = useRef(false); // la personne a déplacé la carte : on ne recadre plus tout seul
  const [ready, setReady] = useState(false);
  const pts = [a, b, me].filter(has).map((p) => [Number(p.lat), Number(p.lng)]);
  const key = pts.map((p) => p.join(",")).join("|");
  const fit = (m, force) => {
    if (!m || !window.L || (userMoved.current && !force)) return;
    const pad = { paddingTopLeft: [34, padTop], paddingBottomRight: [34, padBottom], maxZoom: 16 };
    if (pts.length > 1) m.fitBounds(window.L.latLngBounds(pts), pad);
    else if (pts.length === 1) m.setView(pts[0], 15);
  };
  useEffect(() => { fit(mapRef.current); }, [key, padBottom]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (recenter) { userMoved.current = false; fit(mapRef.current, true); } }, [recenter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Livreur vu par le client : moto qui glisse d'une position à la suivante (au lieu de sauter)
  const motoRef = useRef(null);
  const showMoto = meKind === "driver" && has(me);
  useEffect(() => {
    const m = mapRef.current, L = window.L;
    if (!m || !L) return;
    if (!showMoto) { motoRef.current?.remove(); motoRef.current = null; return; }
    const to = [Number(me.lat), Number(me.lng)];
    if (!motoRef.current) { motoRef.current = L.marker(to, { icon: L.divIcon({ html: PIN_MOTO, iconSize: [40, 40], iconAnchor: [20, 20], className: "" }), zIndexOffset: 1000 }).addTo(m); return; }
    const from = motoRef.current.getLatLng(), t0 = performance.now(), dur = 1500;
    let raf;
    const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); motoRef.current?.setLatLng([from.lat + (to[0] - from.lat) * e, from.lng + (to[1] - from.lng) * e]); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [showMoto, me?.lat, me?.lng, ready]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { motoRef.current?.remove(); }, []);

  // Autres commerces Lamuka autour (le commerce de la commande a déjà son propre repère)
  useEffect(() => (ready ? addStoresLayer(mapRef.current, { exclude: [a] }) : undefined), [ready, a?.lat, a?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  // Étapes de l'itinéraire à tracer. Avec alternatives (livreur) : seulement jusqu'à la prochaine étape,
  // pour pouvoir proposer plusieurs routes (le calcul n'en propose qu'entre deux points).
  const target = next === "a" ? a : b;
  const stops = alternatives && has(me) && has(target) ? [me, target]
    : has(me) && next === "a" && has(a) ? [me, a, ...(has(b) ? [b] : [])]
    : has(me) && next === "b" && has(b) ? [me, b]
    : has(a) && has(b) ? [a, b] : [];
  const stopsKey = stops.map(r4).join(";");
  const [road, setRoad] = useState(null);
  const onRouteRef = useRef(onRoute);
  onRouteRef.current = onRoute;
  useEffect(() => {
    if (stops.length < 2) { setRoad(null); return; }
    let alive = true;
    roadRoute(stops, !!alternatives).then((r) => { if (alive) { setRoad(r); onRouteRef.current?.(r); } }).catch(() => { if (alive) setRoad(null); });
    return () => { alive = false; };
  }, [stopsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Route choisie par le livreur parmi les propositions : gardée jusqu'à la prochaine étape
  const [chosen, setChosen] = useState(null); // { path, distance_m }
  useEffect(() => { setChosen(null); }, [next, target?.lat, target?.lng]);

  const markers = useMemo(() => [
    has(a) && (aLogo ? { lat: Number(a.lat), lng: Number(a.lng), html: pinLogo(aLogo), size: 40 } : { lat: Number(a.lat), lng: Number(a.lng), html: PIN_A, size: 22 }),
    has(b) && { lat: Number(b.lat), lng: Number(b.lng), html: PIN_B, size: 34 },
    has(me) && !showMoto && { lat: Number(me.lat), lng: Number(me.lng), html: PIN_ME, size: 18 },
  ].filter(Boolean), [a?.lat, a?.lng, b?.lat, b?.lng, me?.lat, me?.lng, aLogo, showMoto]); // eslint-disable-line react-hooks/exhaustive-deps
  // Tant que l'itinéraire n'est pas connu (ou si le service est indisponible) : trait pointillé indicatif
  const real = road && !road.approx && road.path.length > 1;
  const speed = road?.speed_kmh || SPEED_KMH;
  const minutes = (m) => Math.max(1, Math.round((m / 1000 / speed) * 60));
  // Tracé affiché : la route choisie (reste à parcourir depuis la position) ou la route conseillée
  const shown = chosen ? { path: remainingPath(chosen.path, me), distance_m: null } : real ? { path: road.path, distance_m: road.distance_m } : null;
  if (shown && shown.distance_m == null) shown.distance_m = pathLength(shown.path);
  const line = shown ? shown.path : stops.length > 1 ? stops.map((p) => ({ lat: Number(p.lat), lng: Number(p.lng) })) : null;

  // Étiquette « 2,3 km · 8 min » posée au milieu du trajet restant (routeLabel = "total" ou "next" : jusqu'à la prochaine étape)
  const labelRef = useRef(null);
  useEffect(() => {
    const m = mapRef.current, L = window.L;
    labelRef.current?.remove(); labelRef.current = null;
    if (!m || !L || !routeLabel || !shown) return;
    const dist = !chosen && routeLabel === "next" && road.legs?.length ? road.legs[0] : shown.distance_m;
    if (!dist) return;
    const at = pointAlong(shown.path, dist / 2);
    if (!at) return;
    labelRef.current = L.marker([at.lat, at.lng], { interactive: false, zIndexOffset: -1000, icon: L.divIcon({ className: "", iconSize: null, html: `<div class="tm-routelabel">${fmtDistance(dist)} · ${minutes(dist)} min</div>` }) }).addTo(m);
  }, [road, chosen, me?.lat, me?.lng, routeLabel, ready]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { labelRef.current?.remove(); }, []);

  // Autres routes possibles (livreur) : en gris, avec leur distance et leur temps ; toucher = la prendre
  const altRef = useRef(null);
  useEffect(() => {
    const m = mapRef.current, L = window.L;
    altRef.current?.remove(); altRef.current = null;
    if (!m || !L || !alternatives || !real) return;
    const options = [{ path: road.path, distance_m: road.distance_m, main: true }, ...(road.alternatives || [])]
      .filter((o) => o.path.length > 1 && (chosen ? o.distance_m !== chosen.distance_m : !o.main));
    if (!options.length) return;
    const g = L.layerGroup();
    options.forEach((o) => {
      const pick = () => setChosen(o.main ? null : { path: o.path, distance_m: o.distance_m });
      const ll = o.path.map((p) => [p.lat, p.lng]);
      L.polyline(ll, { color: "#FFFFFF", weight: 9, opacity: 0.9 }).addTo(g);
      L.polyline(ll, { color: "#98A2B3", weight: 5, opacity: 1 }).on("click", pick).addTo(g);
      L.polyline(ll, { color: "#000", weight: 26, opacity: 0 }).on("click", pick).addTo(g); // zone tactile plus large
      const at = pointAlong(o.path, o.distance_m / 2);
      if (at) L.marker([at.lat, at.lng], { zIndexOffset: -900, icon: L.divIcon({ className: "", iconSize: null, html: `<div class="tm-routelabel alt">${o.main ? "Conseillé · " : ""}${fmtDistance(o.distance_m)} · ${minutes(o.distance_m)} min</div>` }) }).on("click", pick).addTo(g);
    });
    g.addTo(m);
    altRef.current = g;
  }, [road, chosen, alternatives, ready]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { altRef.current?.remove(); }, []);
  return (
    <MapView center={pts[0] || cityCenter() || [0, 0]} zoom={14} markers={markers} route={line} routeColor="#00B492" routeDashed={!real}
      controls={interactive} interactive={interactive} style={{ height, borderRadius: 16, ...style }}
      onMapReady={(m) => {
        mapRef.current = m; setReady(true);
        m.on("dragstart", () => { userMoved.current = true; });
        m.getContainer().addEventListener("wheel", () => { userMoved.current = true; }, { passive: true });
        m.getContainer().addEventListener("touchstart", (e) => { if (e.touches.length > 1) userMoved.current = true; }, { passive: true });
        setTimeout(() => { m.invalidateSize(); fit(m, true); }, 60);
      }} />
  );
}

/** Distance lisible : « 850 m », « 2,3 km » */
export const fmtDistance = (m) => (m == null ? "" : m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace(".", ",")} km`);

/**
 * Étapes du trajet (Récupérer → Livrer) : chaque ligne peut être touchée pour la modifier.
 * stops : [{ kind: "a"|"b", title, main, sub, empty, onClick, action }]
 */
export function RouteStops({ stops }) {
  return (
    <div className="tk-route">
      {stops.map((s, i) => (
        <div key={i} className={"tk-stop" + (s.onClick ? " tap" : "")} onClick={s.onClick} role={s.onClick ? "button" : undefined}>
          <div className="tk-rail">
            <span className={"tk-dot " + s.kind} />
            {i < stops.length - 1 && <span className="tk-line" />}
          </div>
          <div className="tk-txt">
            <small>{s.title}</small>
            {s.empty ? <b className="ph">{s.empty}</b> : <b>{s.main}</b>}
            {s.sub && <span>{s.sub}</span>}
            {s.extra}
          </div>
          {s.action !== undefined ? s.action : s.onClick && <Icon name="chevron_right" size={20} color="var(--t-sub)" />}
        </div>
      ))}
    </div>
  );
}
