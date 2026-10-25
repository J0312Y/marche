// Commerces Lamuka sur toutes les cartes (choix de l'adresse, suivi client, carte du livreur, du commerçant) :
// logo rond à leur emplacement dès le zoom 14 ; toucher = nom du commerce.
// Liste chargée une seule fois par session (établissements seulement, sans le catalogue).
import { establishmentsAPI } from "../api";

let storesPromise = null;
export function loadStores() {
  if (!storesPromise) {
    storesPromise = (async () => {
      const all = [];
      for (let page = 1; page <= 20; page++) {
        const res = await establishmentsAPI.getAll({ page, limit: 50 });
        const items = Array.isArray(res) ? res : res?.establishments || [];
        all.push(...items);
        if (!res?.pagination?.has_more || !items.length) break;
      }
      return all
        .filter((v) => Number(v.latitude) && Number(v.longitude) && (v.status === undefined || v.status === "active"))
        .map((v) => ({ id: Number(v.id), name: v.name, logo: v.avatar || v.logo || null, lat: Number(v.latitude), lng: Number(v.longitude) }));
    })().catch(() => { storesPromise = null; return []; });
  }
  return storesPromise;
}

const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const near = (a, b) => Math.abs(a.lat - b.lat) < 0.00006 && Math.abs(a.lng - b.lng) < 0.00006; // ≈ 6 m

/**
 * Ajoute les commerces à une carte Leaflet. exclude : points déjà marqués autrement (ex. commerce de la commande).
 * Retourne une fonction pour les retirer.
 */
export function addStoresLayer(map, { exclude = [], minZoom = 14 } = {}) {
  const L = window.L;
  if (!map || !L) return () => {};
  const layer = L.layerGroup();
  let off = false;
  const sync = () => { if (off) return; if (map.getZoom() >= minZoom) { if (!map.hasLayer(layer)) layer.addTo(map); } else if (map.hasLayer(layer)) map.removeLayer(layer); };
  loadStores().then((stores) => {
    if (off) return;
    const skip = exclude.filter((p) => p && p.lat != null).map((p) => ({ lat: Number(p.lat), lng: Number(p.lng) }));
    stores.filter((s) => !skip.some((p) => near(p, s))).forEach((s) => {
      const img = s.logo ? `background:#fff center/cover no-repeat url(&quot;${esc(s.logo)}&quot;)` : "background:#00B492";
      const html = `<div class="lp-store" style="${img}">${s.logo ? "" : esc((s.name || "?")[0])}</div>`;
      L.marker([s.lat, s.lng], { icon: L.divIcon({ html, className: "", iconSize: [30, 30], iconAnchor: [15, 15] }), keyboard: false, zIndexOffset: -500 })
        .bindTooltip(esc(s.name), { direction: "top", offset: [0, -16], className: "lp-tip" }).addTo(layer);
    });
    sync();
  });
  map.on("zoomend", sync);
  return () => { off = true; map.off("zoomend", sync); layer.remove(); };
}
