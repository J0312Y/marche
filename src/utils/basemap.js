// Fond de carte de l'application : tuiles vectorielles OpenStreetMap hébergées avec l'app (public/tiles/bzv.pmtiles,
// extrait de la région de Brazzaville), dessinées avec un style clair et sobre, net à tous les zooms.
// Étiquettes pensées pour Brazzaville (beaucoup d'adresses sans nom de rue) : quartiers, noms de rues dès qu'on zoome,
// repères discrets (marchés, santé, écoles, lieux de culte, stations, ronds-points…).
// Hors de la zone couverte (autre ville ajoutée dans le panneau), on revient au fond OpenStreetMap.
const PMTILES = "/tiles/bzv.pmtiles";
// Zone couverte par le fichier (ouest, sud, est, nord) — doit correspondre à l'extraction, faite sur le VPS :
// pmtiles extract https://build.protomaps.com/AAAAMMJJ.pmtiles bzv.pmtiles --bbox=15.12,-4.37,15.37,-4.00 --maxzoom=15
// (zoom 15 : ruelles, chemins, restaurants, boutiques, banques… absents au zoom 14)
export const BASEMAP_BOUNDS = [15.12, -4.37, 15.37, -4.0];

const inside = (ll) => ll.lng >= BASEMAP_BOUNDS[0] && ll.lng <= BASEMAP_BOUNDS[2] && ll.lat >= BASEMAP_BOUNDS[1] && ll.lat <= BASEMAP_BOUNDS[3];

// Le serveur interne de l'application (Android) ne sait pas renvoyer un morceau de fichier (requêtes « Range ») :
// le fichier (≈ 12 Mo, livré avec l'app ou téléchargé, voir plus bas) est lu une seule fois en mémoire, puis découpé localement.
// Mise à jour automatique : le serveur renouvelle la carte chaque semaine (OpenStreetMap) ; l'application télécharge
// la nouvelle (GET /map-tiles/file) quand elle a au moins N jours de plus que la sienne (réglage du panneau), la garde sur le téléphone
// (Cache Storage) et l'utilise dès l'ouverture suivante si elle est plus récente que celle livrée avec l'app.
const TILE_CACHE = "lk-tiles", TILE_KEY = "/tiles/remote.pmtiles";
const VERSION_HEADER = "X-Map-Version";
let embeddedVersionP = null;
const embeddedVersion = () => (embeddedVersionP ??= fetch("/tiles/version.json").then((r) => r.json()).then((j) => Number(j.version) || 0).catch(() => 0));
async function cachedMap() {
  try { const r = await (await caches.open(TILE_CACHE)).match(TILE_KEY); return r ? { version: Number(r.headers.get(VERSION_HEADER)) || 0, res: r } : null; } catch { return null; }
}
const lsGet = (k) => { try { return Number(localStorage.getItem(k)) || 0; } catch { return 0; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, String(v)); } catch { /* stockage indisponible */ } };

let filePromise = null;
async function loadMap() {
  const [c, emb] = await Promise.all([cachedMap(), embeddedVersion()]);
  if (c && c.version > emb) { try { return await c.res.arrayBuffer(); } catch { /* copie abîmée : on prend celle de l'app */ } }
  const r = await fetch(PMTILES);
  if (!r.ok) throw new Error("tuiles " + r.status);
  return r.arrayBuffer();
}
async function memorySource() {
  if (!filePromise) filePromise = loadMap().catch((e) => { filePromise = null; throw e; });
  const buf = await filePromise;
  return { getKey: () => PMTILES, getBytes: async (offset, length) => ({ data: buf.slice(offset, offset + length) }) };
}

let updateStarted = false;
/** Vérifie (une fois par jour) s'il existe une carte plus récente et la télécharge en arrière-plan si le délai est écoulé. */
async function checkMapUpdate() {
  if (updateStarted || typeof caches === "undefined") return;
  updateStarted = true;
  const now = Date.now();
  if (now - lsGet("lk-map-check") < 864e5) return;
  lsSet("lk-map-check", now);
  try {
    const { default: api } = await import("../api/client");
    const info = await api.get("/map-tiles");
    if (!info?.version) return;
    const [c, emb] = await Promise.all([cachedMap(), embeddedVersion()]);
    // seulement si la carte en ligne a au moins N jours de plus que celle du téléphone (une APK récente ne retélécharge rien)
    if (Number(info.version) - Math.max(emb, c?.version || 0) < (Number(info.every_days) || 30) * 86400) return;
    const r = await fetch(`${api.BASE_URL}/map-tiles/file`);
    if (!r.ok) return;
    const buf = await r.arrayBuffer();
    if (info.size && buf.byteLength !== Number(info.size)) return; // téléchargement interrompu
    await (await caches.open(TILE_CACHE)).put(TILE_KEY, new Response(buf, { headers: { [VERSION_HEADER]: String(info.version), "Content-Type": "application/octet-stream" } }));
  } catch { /* hors ligne ou serveur indisponible : on réessaiera */ }
}

const FONT = "'Noto Sans', system-ui, sans-serif";
// Repères : catégorie → couleur de la pastille, zoom d'apparition
// (ordre = priorité d'affichage quand les étiquettes se chevauchent)
const POI = [
  { kinds: ["marketplace", "supermarket", "mall"], color: "#E8890C", z: 14 },
  { kinds: ["hospital", "clinic", "pharmacy"], color: "#E5484D", z: 14 },
  { kinds: ["fuel"], color: "#475467", z: 14 },
  { kinds: ["primary", "secondary"], color: "#98A2B3", z: 14 }, // ronds-points, places (repères très utilisés)
  { kinds: ["restaurant", "fast_food", "cafe", "bar", "pub", "nightclub", "bakery"], color: "#EF6820", z: 15 },
  { kinds: ["hotel", "guest_house", "stadium", "museum", "cinema", "bus_station", "aerodrome", "conference_centre", "library", "events_venue", "arts_centre"], color: "#0E9384", z: 15 },
  { kinds: ["bank", "atm", "bureau_de_change", "post_office", "townhall", "police", "courthouse", "fire_station"], color: "#667085", z: 15 },
  { kinds: ["school", "college", "university", "kindergarten"], color: "#3B82F6", z: 15 },
  { kinds: ["place_of_worship"], color: "#8B5CF6", z: 15 },
  { kinds: ["doctors", "health"], color: "#E5484D", z: 16 },
  { kinds: ["convenience", "beverages", "clothes", "hairdresser", "beauty", "mobile_phone", "hardware", "butcher", "furniture", "books", "stationery", "dry_cleaning", "retail", "travel_agency", "car_repair"], color: "#E8890C", z: 16 },
];

function lamukaLabels(P, base, lang) {
  const name = [`name:${lang}`, "name"];
  const kindOf = (f) => f.props.kind;
  const rules = [
    // Quartiers (Poto-Poto, Moungali, Bacongo…) : bien lisibles, en capitales espacées
    { dataLayer: "places", minzoom: 11, symbolizer: new P.CenteredTextSymbolizer({ labelProps: name, fill: "#6B7280", stroke: "#F2F2EF", width: 3, font: `600 12px ${FONT}`, textTransform: "uppercase", letterSpacing: 1.5 }),
      filter: (z, f) => ["neighbourhood", "macrohood", "suburb", "quarter"].includes(kindOf(f)) },
    { dataLayer: "places", minzoom: 9, maxzoom: 13, symbolizer: new P.CenteredTextSymbolizer({ labelProps: name, fill: "#374151", stroke: "#F2F2EF", width: 3, font: `700 15px ${FONT}` }),
      filter: (z, f) => kindOf(f) === "locality" },
    // Grands axes dès le zoom 12, rues secondaires dès 15 (avant : 16)
    { dataLayer: "roads", minzoom: 12, symbolizer: new P.LineLabelSymbolizer({ labelProps: name, fill: "#4B5563", stroke: "#FFFFFF", width: 3, font: `500 12px ${FONT}` }),
      filter: (z, f) => ["highway", "major_road"].includes(kindOf(f)) },
    // Repères : petite pastille colorée + nom
    ...POI.map((c) => ({
      dataLayer: "pois", minzoom: c.z,
      symbolizer: new P.GroupSymbolizer([
        new P.CircleSymbolizer({ radius: 4, fill: c.color, stroke: "#FFFFFF", width: 1.5 }),
        new P.OffsetTextSymbolizer({ labelProps: name, fill: "#4B5563", stroke: "#FFFFFF", width: 2.5, offsetX: 7, offsetY: 4, font: `500 11px ${FONT}` }),
      ]),
      filter: (z, f) => c.kinds.includes(kindOf(f)),
    })),
    { dataLayer: "roads", minzoom: 14, symbolizer: new P.LineLabelSymbolizer({ labelProps: name, fill: "#6B7280", stroke: "#FFFFFF", width: 2.5, font: `400 11px ${FONT}` }),
      filter: (z, f) => ["minor_road", "other", "path"].includes(kindOf(f)) },
  ];
  // On garde de l'original les noms d'eau (fleuve, lacs) et des pays
  return [...rules, ...base.filter((r) => r.dataLayer === "water" || (r.dataLayer === "places" && r.maxzoom === undefined && r.minzoom === undefined))];
}

/** Ajoute le fond de carte à une carte Leaflet (window.L). */
export async function addBasemap(map) {
  const L = window.L;
  const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 });
  let vec = null;
  try {
    const [P, { namedFlavor }, { PMTiles }] = await Promise.all([import("protomaps-leaflet"), import("@protomaps/basemaps"), import("pmtiles")]);
    // Style « light » éclairci (proche des applis de livraison) : bâtiments à peine marqués, fond gris très clair
    const f = { ...namedFlavor("light"), background: "#F2F2EF", earth: "#F2F2EF", buildings: "#E5E5E1" };
    vec = P.leafletLayer({ url: new PMTiles(await memorySource()), paintRules: P.paintRules(f), labelRules: lamukaLabels(P, P.labelRules(f, "fr"), "fr"), backgroundColor: f.background, maxDataZoom: 15 });
  } catch (e) { if (import.meta.env.DEV) console.warn("fond de carte", e); vec = null; }
  const sync = () => {
    const useVec = vec && inside(map.getCenter());
    if (useVec) { if (map.hasLayer(osm)) map.removeLayer(osm); if (!map.hasLayer(vec)) vec.addTo(map); }
    else { if (vec && map.hasLayer(vec)) map.removeLayer(vec); if (!map.hasLayer(osm)) osm.addTo(map); }
  };
  sync();
  map.on("moveend", sync);
  if (vec) setTimeout(checkMapUpdate, 5000); // après l'affichage : ne ralentit pas l'ouverture de la carte
}
