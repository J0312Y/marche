import { useState, useEffect, useMemo, useCallback } from "react";
import { useI18n } from "../i18n";
import { useToast, StatusBadge } from "../components/UI";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Map, Bike, Store, User, Globe, Link, X as XIcon } from "lucide-react";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;

// Custom SVG icons for map markers
const SVG_BIKE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`;
const SVG_STORE = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>`;
const SVG_USER = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

const makeIcon = (svg, color, size = 32) => L.divIcon({
  className: "",
  html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">${svg}</div>`,
  iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2],
});

const DRIVER_ICON_ACTIVE = makeIcon(SVG_BIKE, "#6366F1", 36);
const DRIVER_ICON_AVAIL = makeIcon(SVG_BIKE, "#10B981", 36);
const VENDOR_ICON = makeIcon(SVG_STORE, "#10B981", 30);
const CLIENT_ICON = makeIcon(SVG_USER, "#F59E0B", 26);

// Brazzaville center
const CENTER = [-4.2634, 15.2429];

// Simulated data
const DRIVER_POS = [
  { id: "d1", name: "Jean Moukala", lat: -4.2580, lng: 15.2480, status: "delivering", order: "#LMK-0912", speed: "35 km/h", phone: "+242 04 321 678" },
  { id: "d2", name: "Sylvie Massamba", lat: -4.2720, lng: 15.2350, status: "available", order: null, speed: "0 km/h", phone: "+242 06 789 456" },
  { id: "d3", name: "Patrick Mbou", lat: -4.2650, lng: 15.2510, status: "delivering", order: "#LMK-0888", speed: "22 km/h", phone: "+242 06 444 555" },
];

const VENDOR_POS = [
  { id: "v1", name: "Chez Mama Ngudi", type: "restaurant", lat: -4.2612, lng: 15.2442, orders: 5, zone: "Bacongo" },
  { id: "v2", name: "Mode Afrique", type: "boutique", lat: -4.2690, lng: 15.2398, orders: 3, zone: "Poto-Poto" },
  { id: "v3", name: "Supermarché Central", type: "supermarche", lat: -4.2555, lng: 15.2465, orders: 8, zone: "Moungali" },
  { id: "v4", name: "Pharma Santé", type: "pharmacie", lat: -4.2745, lng: 15.2488, orders: 2, zone: "Ouenzé" },
  { id: "v5", name: "Grill Master", type: "restaurant", lat: -4.2600, lng: 15.2530, orders: 4, zone: "Bacongo" },
];

const CLIENT_POS = [
  { id: "c1", name: "Celine N.", lat: -4.2595, lng: 15.2515, waitingSince: "10 min" },
  { id: "c2", name: "Patrick O.", lat: -4.2680, lng: 15.2370, waitingSince: "25 min" },
  { id: "c3", name: "Marie K.", lat: -4.2560, lng: 15.2490, waitingSince: "5 min" },
  { id: "c4", name: "Paul M.", lat: -4.2730, lng: 15.2420, waitingSince: "15 min" },
];

// Animate driver positions
function AnimatedMarker({ position, icon, children }) {
  return <Marker position={position} icon={icon}>{children}</Marker>;
}

export default function LiveMapPage() {
  const { lang } = useI18n();
  const toast = useToast();
  const [layer, setLayer] = useState("all");
  const [assignments, setAssignments] = useState({});
  const [assignModal, setAssignModal] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(iv);
  }, []);

  const driverPositions = useMemo(() => DRIVER_POS.map(d => ({
    ...d,
    lat: d.lat + Math.sin(tick * 0.5 + d.lat * 100) * 0.001,
    lng: d.lng + Math.cos(tick * 0.3 + d.lng * 100) * 0.001,
  })), [tick]);

  const showDrivers = layer === "all" || layer === "drivers";
  const showVendors = layer === "all" || layer === "vendors";
  const showClients = layer === "all" || layer === "clients";

  const assignDriverToVendor = (vendorId, vendorName, driverName) => {
    setAssignments(prev => ({ ...prev, [vendorId]: driverName }));
    toast.success(lang === "fr" ? `${driverName} assigné à ${vendorName}` : `${driverName} assigned to ${vendorName}`);
    setAssignModal(null);
  };

  // Delivery routes
  const routes = useMemo(() => {
    return Object.entries(assignments).map(([vid, dName]) => {
      const v = VENDOR_POS.find(x => x.id === vid);
      const d = driverPositions.find(x => x.name === dName);
      if (!v || !d) return null;
      return { from: [d.lat, d.lng], to: [v.lat, v.lng] };
    }).filter(Boolean);
  }, [assignments, driverPositions]);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}><Map size={22} /> {lang === "fr" ? "Carte en temps réel" : "Live Map"}</h1>
          <p className="page-subtitle">{DRIVER_POS.length} {lang === "fr" ? "livreurs" : "drivers"} · {VENDOR_POS.length} {lang === "fr" ? "commerçants" : "vendors"} · {CLIENT_POS.length} clients</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ background: "rgba(239,68,68,0.9)", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "pulse 1.5s infinite" }} /> LIVE
          </div>
          <div className="tab-bar" style={{ marginBottom: 0 }}>
            {[["all", <Globe size={14} />], ["drivers", <Bike size={14} />], ["vendors", <Store size={14} />], ["clients", <User size={14} />]].map(([k, l]) => (
              <button key={k} className={`tab-btn ${layer === k ? "active" : ""}`} onClick={() => setLayer(k)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card" style={{ padding: 14, borderLeft: "3px solid #6366F1" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ display: "flex" }}><Bike size={18} /></span>
            <div style={{ display: "flex", gap: 4 }}>
              <span className="badge badge-primary" style={{ fontSize: 10 }}>{driverPositions.filter(d => d.status === "delivering").length} {lang === "fr" ? "en course" : "active"}</span>
              <span className="badge badge-success" style={{ fontSize: 10 }}>{driverPositions.filter(d => d.status === "available").length} {lang === "fr" ? "dispo" : "free"}</span>
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{driverPositions.length} {lang === "fr" ? "Livreurs" : "Drivers"}</div>
        </div>
        <div className="stat-card" style={{ padding: 14, borderLeft: "3px solid #10B981" }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{VENDOR_POS.reduce((s, v) => s + v.orders, 0)}</div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>{lang === "fr" ? "Commandes actives" : "Active orders"}</div>
        </div>
        <div className="stat-card" style={{ padding: 14, borderLeft: "3px solid #F59E0B" }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{CLIENT_POS.length} clients</div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>{lang === "fr" ? "En attente" : "Waiting"}</div>
        </div>
        <div className="stat-card" style={{ padding: 14, borderLeft: "3px solid #EF4444" }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{Object.keys(assignments).length}</div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>{lang === "fr" ? "Assignations" : "Assignments"}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, minHeight: 600 }}>
        {/* ═══ REAL MAP ═══ */}
        <div className="card" style={{ overflow: "hidden", padding: 0, display: "flex", flexDirection: "column" }}>
          <MapContainer center={CENTER} zoom={14} style={{ height: "100%", width: "100%", flex: 1 }} zoomControl={true}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />

            {/* Driver markers */}
            {showDrivers && driverPositions.map(d => (
              <AnimatedMarker key={d.id} position={[d.lat, d.lng]} icon={d.status === "delivering" ? DRIVER_ICON_ACTIVE : DRIVER_ICON_AVAIL}>
                <Popup><div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{d.name}</div>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>{d.phone}</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                    <span style={{ padding: "2px 8px", borderRadius: 6, background: d.status === "delivering" ? "#6366F1" : "#10B981", color: "#fff", fontSize: 11 }}>
                      {d.status === "delivering" ? (lang === "fr" ? "En livraison" : "Delivering") : (lang === "fr" ? "Disponible" : "Available")}
                    </span>
                    <span style={{ fontSize: 11, color: "#666" }}>{d.speed}</span>
                  </div>
                  {d.order && <div style={{ fontSize: 12 }}>{lang === "fr" ? "Commande" : "Order"}: <strong>{d.order}</strong></div>}
                </div></Popup>
              </AnimatedMarker>
            ))}

            {/* Vendor markers */}
            {showVendors && VENDOR_POS.map(v => (
              <Marker key={v.id} position={[v.lat, v.lng]} icon={VENDOR_ICON}>
                <Popup><div style={{ minWidth: 200 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{v.name}</div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{v.zone} · {v.type}</div>
                  <div style={{ fontSize: 12, marginBottom: 6 }}>{v.orders} {lang === "fr" ? "commandes actives" : "active orders"}</div>
                  {assignments[v.id] && <div style={{ padding: "4px 8px", background: "#e8f5e9", borderRadius: 6, fontSize: 11, marginBottom: 6 }}>{assignments[v.id]}</div>}
                  <button onClick={() => setAssignModal(v)} style={{ padding: "6px 12px", borderRadius: 8, background: "#6366F1", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, width: "100%" }}>
                    {lang === "fr" ? "Assigner livreur" : "Assign Driver"}
                  </button>
                </div></Popup>
              </Marker>
            ))}

            {/* Client markers */}
            {showClients && CLIENT_POS.map(c => (
              <Marker key={c.id} position={[c.lat, c.lng]} icon={CLIENT_ICON}>
                <Popup><div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{lang === "fr" ? "En attente depuis" : "Waiting since"} {c.waitingSince}</div>
                </div></Popup>
              </Marker>
            ))}

            {/* Assignment routes */}
            {routes.map((r, i) => (
              <Polyline key={i} positions={[r.from, r.to]} pathOptions={{ color: "#6366F1", weight: 3, dashArray: "8 6", opacity: 0.7 }} />
            ))}
          </MapContainer>
        </div>

        {/* ═══ SIDEBAR ═══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Drivers List */}
          <div className="card" style={{ flex: 1, overflow: "hidden" }}>
            <div className="card-header"><span className="card-title" style={{ display: "flex", alignItems: "center", gap: 6 }}><Bike size={16} /> {lang === "fr" ? "Livreurs" : "Drivers"}</span></div>
            <div style={{ overflowY: "auto", maxHeight: 260 }}>
              {driverPositions.map(d => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>{d.order || (lang === "fr" ? "Disponible" : "Available")}</div>
                  </div>
                  <span className={`badge ${d.status === "delivering" ? "badge-primary" : "badge-success"}`} style={{ fontSize: 10 }}>
                    {d.speed}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div className="card">
            <div className="card-header"><span className="card-title" style={{ display: "flex", alignItems: "center", gap: 6 }}><Link size={16} /> {lang === "fr" ? "Assignations" : "Assignments"}</span></div>
            <div style={{ padding: 12 }}>
              {Object.keys(assignments).length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--text-3)", textAlign: "center", padding: 12 }}>
                  {lang === "fr" ? "Cliquez un commerçant sur la carte pour assigner." : "Click a vendor on the map to assign."}
                </div>
              ) : (
                Object.entries(assignments).map(([vid, driver]) => {
                  const v = VENDOR_POS.find(x => x.id === vid);
                  return (
                    <div key={vid} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                      <span>{v?.name?.substring(0, 18)}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{driver.split(" ")[0]}</span>
                        <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)", fontSize: 10, padding: 2 }} onClick={() => setAssignments(prev => { const n = { ...prev }; delete n[vid]; return n; })}>✗</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="card" style={{ padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{lang === "fr" ? "Légende" : "Legend"}</div>
            {[["#6366F1", lang === "fr" ? "Livreur en course" : "Delivering"], ["#10B981", lang === "fr" ? "Livreur disponible" : "Available"], ["#10B981", lang === "fr" ? "Commerçant" : "Vendor"], ["#F59E0B", "Client"]].map(([c, l], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, padding: "3px 0" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><Bike size={18} /> {lang === "fr" ? "Assigner à" : "Assign to"} {assignModal.name}</h3><button className="modal-close" onClick={() => setAssignModal(null)}><XIcon size={16} /></button></div>
            <div className="modal-body">
              <div style={{ display: "grid", gap: 8 }}>
                {DRIVER_POS.map(d => (
                  <button key={d.id} className="btn btn-outline" style={{ justifyContent: "flex-start", padding: "12px 14px" }} onClick={() => assignDriverToVendor(assignModal.id, assignModal.name, d.name)}>
                    <span style={{ fontWeight: 700 }}>{d.name}</span>
                    <span className={`badge ${d.status === "delivering" ? "badge-primary" : "badge-success"}`} style={{ marginLeft: 8, fontSize: 10 }}>
                      {d.status === "delivering" ? (lang === "fr" ? "En course" : "Busy") : (lang === "fr" ? "Dispo" : "Free")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
