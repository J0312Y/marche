import { useEffect } from "react";
import { useMap, TileLayer } from "react-leaflet";
import L from "leaflet";

// Même fond de carte que l'application : tuiles vectorielles de Brazzaville servies par le site (/tiles/bzv.pmtiles),
// style clair et sobre ; ailleurs (autre ville), fond OpenStreetMap.
const BOUNDS = [15.12, -4.37, 15.37, -4.0];
const PMTILES = (import.meta.env.VITE_TILES_URL || "/tiles/bzv.pmtiles");

function Vector() {
  const map = useMap();
  useEffect(() => {
    let layer = null, osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }), off = false;
    const inside = (c) => c.lng >= BOUNDS[0] && c.lng <= BOUNDS[2] && c.lat >= BOUNDS[1] && c.lat <= BOUNDS[3];
    const sync = () => {
      const v = layer && inside(map.getCenter());
      if (v) { if (map.hasLayer(osm)) map.removeLayer(osm); if (!map.hasLayer(layer)) layer.addTo(map); }
      else { if (layer && map.hasLayer(layer)) map.removeLayer(layer); if (!map.hasLayer(osm)) osm.addTo(map); }
    };
    window.L = window.L || L; // protomaps-leaflet s'appuie sur Leaflet global
    // Fichier de carte absent (ex. panneau lancé seul en local) : on garde le fond OpenStreetMap
    fetch(PMTILES, { method: "HEAD" }).then((r) => { if (!r.ok || /html/.test(r.headers.get("content-type") || "")) throw new Error("tuiles " + r.status); })
      .then(() => Promise.all([import("protomaps-leaflet"), import("@protomaps/basemaps")])).then(([{ leafletLayer, paintRules, labelRules }, { namedFlavor }]) => {
      if (off) return;
      const f = { ...namedFlavor("light"), background: "#F2F2EF", earth: "#F2F2EF", buildings: "#E5E5E1" };
      layer = leafletLayer({ url: PMTILES, paintRules: paintRules(f), labelRules: labelRules(f, "fr"), backgroundColor: f.background, maxDataZoom: 15 });
      sync();
    }).catch(() => sync());
    sync();
    map.on("moveend", sync);
    return () => { off = true; map.off("moveend", sync); if (layer) map.removeLayer(layer); map.removeLayer(osm); };
  }, [map]);
  return null;
}

export default function Basemap() { return <Vector />; }
export { TileLayer };
