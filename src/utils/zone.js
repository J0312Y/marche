import api from "../api/client";

/**
 * Zones de livraison (« Oups, nous ne livrons pas ici ! ») : villes, contours et quartiers gérés dans le panneau
 * (« Zones de livraison »), lus via GET /zones. La dernière réponse est gardée sur le téléphone (hors connexion).
 */
const CACHE = "lk-zones";
const cached = (() => { try { return JSON.parse(localStorage.getItem(CACHE) || "null"); } catch { return null; } })();
let ZONES = cached?.zones || [];
let QUARTERS = cached?.quarters || {};
let QLIST = cached?.quarter_list || null; // [{ name, zone, lat, lng, label }]
let CITIES = cached?.cities || "";
/** Centre de la première ville livrée (carte sans position connue) */
export const cityCenter = () => ZONES[0]?.center || null;

let loaded = null;
/** Zones du serveur (une zone peut être suspendue) ; événement « lk-zones » quand elles changent */
export function loadZones(force = false) {
  if (loaded && !force) return loaded;
  loaded = api.get("/zones").then((r) => {
    if (Array.isArray(r?.zones)) ZONES = r.zones;
    if (r?.quarters) QUARTERS = r.quarters;
    if (Array.isArray(r?.quarter_list)) QLIST = r.quarter_list;
    if (typeof r?.cities === "string") CITIES = r.cities;
    try { localStorage.setItem(CACHE, JSON.stringify({ zones: ZONES, quarters: QUARTERS, quarter_list: QLIST, cities: CITIES })); } catch {}
    window.dispatchEvent(new Event("lk-zones"));
  }).catch(() => { loaded = null; });
  return loaded;
}
export const hasZones = () => ZONES.length > 0;
/** Noms des quartiers desservis (ordre alphabétique) */
export const quarterNames = () => Object.keys(QUARTERS).sort((a, b) => a.localeCompare(b, "fr"));

/** Vérification par le serveur (fait foi) ; repli sur la copie locale hors connexion */
export async function checkZone(lat, lng) {
  try {
    const r = await api.get(`/zones/check?lat=${lat}&lng=${lng}`);
    if (r && typeof r.in_zone === "boolean") {
      // Copie locale périmée (zone ouverte ou suspendue entre-temps) → on la recharge pour tout l'écran
      if (!!zoneOf(lat, lng) !== r.in_zone) await loadZones(true);
      return r.in_zone ? r.zone : null;
    }
  } catch {}
  return zoneOf(lat, lng);
}

/** Nom de la zone livrée qui contient le point, sinon null */
export function zoneOf(lat, lng) {
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;
  for (const z of ZONES) {
    let inside = false; const p = z.polygon;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [yi, xi] = p[i], [yj, xj] = p[j];
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    if (inside) return z.name;
  }
  return null;
}

export function nearestQuarter(lat, lng) {
  let best = null, bd = Infinity;
  for (const [name, [la, lo]] of Object.entries(QUARTERS)) {
    const d = (la - lat) ** 2 + ((lo - lng) * Math.cos((lat * Math.PI) / 180)) ** 2;
    if (d < bd) { bd = d; best = name; }
  }
  return best;
}

/**
 * Quartier et rue réels via OpenStreetMap (Nominatim), avec repli sur le quartier le plus proche.
 * Une seule requête par lieu (cache), délai max 4 s.
 */
const geoCache = new Map();
export async function reverseGeocode(lat, lng) {
  const k = lat.toFixed(4) + "," + lng.toFixed(4);
  if (geoCache.has(k)) return geoCache.get(k);
  const fallback = { quarter: nearestQuarter(lat, lng), road: null };
  try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 4000);
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=17&accept-language=fr&lat=${lat}&lon=${lng}`, { signal: ctrl.signal });
    clearTimeout(t);
    const a = (await r.json())?.address || {};
    const quarter = a.suburb || a.quarter || a.neighbourhood || (a.city_district || "").replace(/\s*\(.*\)$/, "") || fallback.quarter;
    const v = { quarter, road: a.road || null };
    geoCache.set(k, v);
    return v;
  } catch { return fallback; }
}

/** Quartiers pour la recherche de la carte (avec leur ville) */
export const quarterList = () => QLIST ? QLIST.map((q) => ({ name: q.label || q.name, zone: q.zone, lat: q.lat, lng: q.lng }))
  : Object.entries(QUARTERS).map(([name, [lat, lng]]) => ({ name, zone: zoneOf(lat, lng), lat, lng }));

/** Villes livrées pour les messages : « Brazzaville », « Brazzaville et Pointe-Noire » */
export const citiesText = () => CITIES;
export const outOfZoneText = () => "Oups, nous ne livrons pas ici !" + (CITIES ? ` Lamuka livre à ${CITIES}.` : "");
/** Ville du lieu de livraison choisi, sinon la première ville livrée */
export const deliveryCity = () => { const d = getDeliverTo(); return (d?.lat && zoneOf(Number(d.lat), Number(d.lng))) || ZONES[0]?.name || ""; };

// ── Lieu de livraison choisi (affiché dans l'en-tête de l'accueil, comme « Beirut » chez Toters) ──
const KEY = "lk-deliver-to";
export function getDeliverTo() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } }
export function setDeliverTo(v) {
  try { if (v) localStorage.setItem(KEY, JSON.stringify(v)); else localStorage.removeItem(KEY); } catch {}
  window.dispatchEvent(new Event("lk-deliver-to"));
}

/** Position GPS (promesse) ; erreur.code === 1 → refusée */
export function currentPosition() {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) { rej({ code: 2 }); return; }
    navigator.geolocation.getCurrentPosition((p) => res({ lat: p.coords.latitude, lng: p.coords.longitude }), rej, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  });
}
