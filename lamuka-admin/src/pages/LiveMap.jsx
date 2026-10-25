import { useEffect } from "react";
import { MapContainer, CircleMarker, Tooltip, Polyline } from "react-leaflet";
import Basemap from "../Basemap";
import api from "../api";
import { useLoad, PageHead, Card, Badge, Btn, ago, fullName, phone } from "../ui";

const CENTER = [-4.2634, 15.2429];
const ACTIVE = ["assigned", "pickup_arrived", "picked_up", "delivering"];

/** Livreurs en ligne et courses en cours, rafraîchis toutes les 15 s (positions envoyées par l'application). */
export default function LiveMap() {
  const drivers = useLoad(() => api.get("/admin/drivers", { online: 1, status: "active", limit: 50 }), []);
  const deliveries = useLoad(() => api.get("/admin/deliveries", { limit: 50 }), []);
  useEffect(() => { const t = setInterval(() => { drivers.reload(); deliveries.reload(); }, 15000); return () => clearInterval(t); }, [drivers.reload, deliveries.reload]);

  const ds = drivers.data?.drivers || [];
  const active = (deliveries.data?.deliveries || []).filter((d) => ACTIVE.includes(d.status));
  const busy = new Map(active.filter((d) => d.driver_id).map((d) => [String(d.driver_id), d]));
  const located = ds.filter((d) => d.current_lat);

  return (
    <div className="page full">
      <PageHead title="Carte en direct" sub={`${ds.length} livreur${ds.length > 1 ? "s" : ""} en ligne · ${active.length} course${active.length > 1 ? "s" : ""} en cours · actualisation toutes les 15 s`}>
        <Btn kind="ghost" onClick={() => { drivers.reload(); deliveries.reload(); }}>Actualiser</Btn>
      </PageHead>
      <div className="map-layout">
        <div className="map-box">
          <MapContainer center={CENTER} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
            <Basemap />
            {active.map((d) => d.pickup_lat && d.dropoff_lat && <Polyline key={"r" + d.id} positions={[[+d.pickup_lat, +d.pickup_lng], [+d.dropoff_lat, +d.dropoff_lng]]} pathOptions={{ color: "#0F2B25", weight: 2, dashArray: "6 6", opacity: 0.5 }} />)}
            {active.map((d) => d.pickup_lat && <CircleMarker key={"p" + d.id} center={[+d.pickup_lat, +d.pickup_lng]} radius={6} pathOptions={{ color: "#fff", weight: 2, fillColor: "#0F2B25", fillOpacity: 1 }}><Tooltip>{d.establishment_name} · {d.ref}</Tooltip></CircleMarker>)}
            {active.map((d) => d.dropoff_lat && <CircleMarker key={"d" + d.id} center={[+d.dropoff_lat, +d.dropoff_lng]} radius={6} pathOptions={{ color: "#fff", weight: 2, fillColor: "#F5A524", fillOpacity: 1 }}><Tooltip>Client {d.client_name || ""} · {d.ref}</Tooltip></CircleMarker>)}
            {located.map((d) => {
              const job = busy.get(String(d.id));
              return <CircleMarker key={"v" + d.id} center={[+d.current_lat, +d.current_lng]} radius={9} pathOptions={{ color: "#fff", weight: 3, fillColor: job ? "#2563EB" : "#00B492", fillOpacity: 1 }}>
                <Tooltip>{fullName(d.first_name, d.last_name)} · {job ? `en course ${job.ref}` : "disponible"} · {ago(d.last_location_update)}</Tooltip>
              </CircleMarker>;
            })}
          </MapContainer>
          <div className="legend"><span><i style={{ background: "#00B492" }} />Livreur disponible</span><span><i style={{ background: "#2563EB" }} />Livreur en course</span><span><i style={{ background: "#0F2B25" }} />Commerce</span><span><i style={{ background: "#F5A524" }} />Client</span></div>
        </div>
        <Card title="Livreurs en ligne" pad={false} className="map-side">
          {!ds.length ? <p className="muted pad">{drivers.loading ? "Chargement…" : "Aucun livreur en ligne."}</p> :
            <ul className="side-list">{ds.map((d) => {
              const job = busy.get(String(d.id));
              return <li key={d.id}><span className="av">{(d.first_name || "?")[0]}</span><div><b>{fullName(d.first_name, d.last_name)}</b><small className="block">{phone(d.phone)} · {d.current_lat ? `position ${ago(d.last_location_update)}` : "pas de position"}</small></div>{job ? <Badge tone="info">{job.ref}</Badge> : <Badge tone="ok">Libre</Badge>}</li>;
            })}</ul>}
        </Card>
      </div>
    </div>
  );
}
