import { useEffect, useMemo, useState } from "react";
import { MapContainer, Polygon, Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import Basemap from "../Basemap";
import L from "leaflet";
import { Plus, Search } from "lucide-react";
import api from "../api";
import { useLoad, useAction, PageHead, Card, Badge, Confirm, Btn, Field, fmt, num } from "../ui";

const BRAZZA = [-4.2634, 15.2429];
const dot = (cls) => L.divIcon({ className: "zn-dot " + cls, iconSize: [14, 14], iconAnchor: [7, 7] });
const VERTEX = dot("v"), QUARTER = dot("q"), PENDING = dot("p");

// Point le plus proche d'un segment (coordonnées traitées comme un plan à l'échelle d'une ville)
function segDist(p, a, b) {
  const [px, py] = p, [ax, ay] = a, [bx, by] = b;
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
  return (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2;
}
/** Ajoute le point sur le côté le plus proche (le tracé reste propre quand on complète un contour) */
function insertPoint(poly, p) {
  if (poly.length < 3) return [...poly, p];
  let best = 0, bd = Infinity;
  for (let i = 0; i < poly.length; i++) { const d = segDist(p, poly[i], poly[(i + 1) % poly.length]); if (d < bd) { bd = d; best = i; } }
  return [...poly.slice(0, best + 1), p, ...poly.slice(best + 1)];
}
const r6 = (n) => Math.round(n * 1e6) / 1e6;

function Clicks({ onClick }) { useMapEvents({ click: (e) => onClick([r6(e.latlng.lat), r6(e.latlng.lng)]) }); return null; }
function Fly({ to }) { const map = useMap(); useEffect(() => { if (to) map.flyTo(to.c, to.z || 12, { duration: 0.6 }); }, [to, map]); return null; }

/** Recherche d'un lieu pour centrer la carte (OpenStreetMap) */
function PlaceSearch({ onFound }) {
  const [q, setQ] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const go = async (e) => {
    e.preventDefault(); if (!q.trim()) return; setBusy(true); setErr("");
    try {
      const r = await (await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=fr&q=${encodeURIComponent(q.trim())}`)).json();
      if (r?.[0]) onFound({ c: [Number(r[0].lat), Number(r[0].lon)], z: 12 }); else setErr("Lieu introuvable");
    } catch { setErr("Recherche impossible"); }
    setBusy(false);
  };
  return <form className="zn-search" onSubmit={go}><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Centrer la carte sur… (ex. : Pointe-Noire)" /><Btn kind="ghost" size="sm" disabled={busy}>{busy ? "…" : "Aller"}</Btn>{err && <small className="bad">{err}</small>}</form>;
}

export default function Zones() {
  const { data, loading, error, reload } = useLoad(() => api.get("/admin/zones"), []);
  const { run, busy } = useAction();
  const zones = data?.zones || [];
  const defaults = data?.defaults || { base_fee: 1000, per_km: 500 };
  const [selId, setSelId] = useState(null);        // ville choisie, « new » = nouvelle ville
  const [mode, setMode] = useState("shape");       // shape | quarters
  const [poly, setPoly] = useState([]);            // contour en cours d'édition
  const [form, setForm] = useState({ name: "", own: false, base_fee: "", per_km: "", is_active: false });
  const [pending, setPending] = useState(null);    // nouveau quartier : { lat, lng, name }
  const [fly, setFly] = useState(null);
  const [del, setDel] = useState(null);
  const sel = selId === "new" ? null : zones.find((z) => String(z.id) === String(selId));

  // Ville choisie → formulaire et contour
  useEffect(() => {
    if (selId === "new") { setPoly([]); setForm({ name: "", own: false, base_fee: "", per_km: "", is_active: false }); setMode("shape"); return; }
    if (!sel) return;
    setPoly(sel.polygon.map((p) => [Number(p[0]), Number(p[1])]));
    setForm({ name: sel.name, own: sel.base_fee !== null || sel.per_km !== null, base_fee: sel.base_fee ?? "", per_km: sel.per_km ?? "", is_active: String(sel.is_active) === "1" });
    setPending(null);
  }, [selId, data]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!selId && zones.length) setSelId(zones[0].id); }, [zones, selId]);
  useEffect(() => { if (sel) setFly({ c: [Number(sel.center_lat), Number(sel.center_lng)], z: 12 }); }, [selId]); // eslint-disable-line react-hooks/exhaustive-deps

  const dirtyShape = sel ? JSON.stringify(poly) !== JSON.stringify(sel.polygon.map((p) => [Number(p[0]), Number(p[1])])) : poly.length > 0;
  const fees = (b, k) => `${fmt(b)} + ${fmt(k)}/km`;
  const body = () => ({
    name: form.name.trim(), polygon: poly, is_active: form.is_active ? 1 : 0,
    base_fee: form.own && form.base_fee !== "" ? Number(form.base_fee) : null, per_km: form.own && form.per_km !== "" ? Number(form.per_km) : null,
  });
  const save = async () => {
    if (selId === "new") {
      const r = await run(() => api.post("/admin/zones", body()), "Ville ajoutée");
      if (r?.id) { await reload(); setSelId(r.id); setMode("quarters"); }
    } else if (await run(() => api.put(`/admin/zones/${sel.id}`, body()), "Ville enregistrée")) reload();
  };
  const onMap = (p) => {
    if (mode === "shape") setPoly((x) => insertPoint(x, p));
    else if (sel) setPending({ lat: p[0], lng: p[1], name: pending?.name || "" });
  };
  const addQuarter = async (e) => {
    e.preventDefault();
    if (await run(() => api.post(`/admin/zones/${sel.id}/quarters`, { name: pending.name.trim(), lat: pending.lat, lng: pending.lng }), "Quartier ajouté")) { setPending(null); reload(); }
  };
  const moveQuarter = async (q, ll) => { if (await run(() => api.put(`/admin/zones/quarters/${q.id}`, { lat: r6(ll.lat), lng: r6(ll.lng) }), "Quartier déplacé")) reload(); else reload(); };
  const [ren, setRen] = useState(null); // { id, name } quartier en cours de renommage
  const renameQuarter = async (e) => {
    e.preventDefault();
    if (await run(() => api.put(`/admin/zones/quarters/${ren.id}`, { name: ren.name.trim() }), "Quartier renommé")) { setRen(null); reload(); }
  };
  const center = useMemo(() => (zones[0] ? [Number(zones[0].center_lat), Number(zones[0].center_lng)] : BRAZZA), [zones]);
  const ok = form.name.trim().length >= 2 && poly.length >= 3;

  return (
    <div className="page full">
      <PageHead title="Zones de livraison" sub="Villes desservies : contour sur la carte, quartiers et frais de livraison propres"><Btn onClick={() => setSelId("new")}><Plus size={18} />Ajouter une ville</Btn></PageHead>
      {error && <p className="err">{error}</p>}
      <div className="zn-grid">
        <div className="zn-side">
          {loading && !zones.length ? <p className="muted">Chargement…</p> : zones.map((z) => (
            <button key={z.id} className={"zn-city" + (String(selId) === String(z.id) ? " on" : "")} onClick={() => setSelId(z.id)}>
              <div className="inline between"><b>{z.name}</b>{String(z.is_active) === "1" ? <Badge tone="ok">Ouverte</Badge> : <Badge tone="mut">Fermée</Badge>}</div>
              <small>{z.base_fee !== null || z.per_km !== null ? "Frais propres : " + fees(z.base_fee ?? defaults.base_fee, z.per_km ?? defaults.per_km) : "Frais par défaut : " + fees(defaults.base_fee, defaults.per_km)}</small>
              <small>{num(z.quarters.length)} quartier{z.quarters.length > 1 ? "s" : ""} · {num(z.stores)} commerce{z.stores > 1 ? "s" : ""} · {num(z.addresses)} adresse{z.addresses > 1 ? "s" : ""} client · {num(z.drivers)} livreur{z.drivers > 1 ? "s" : ""}</small>
            </button>
          ))}
          {selId === "new" && <div className="zn-city on"><b>Nouvelle ville</b><small>Tracez son contour sur la carte</small></div>}

          {(sel || selId === "new") && <Card title={selId === "new" ? "Nouvelle ville" : sel.name}>
            <div className="stack wide">
              <Field label="Nom de la ville"><input value={form.name} maxLength={80} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex. : Pointe-Noire" /></Field>
              <label className="check"><input type="checkbox" checked={form.own} onChange={(e) => setForm({ ...form, own: e.target.checked })} />Frais de livraison propres à cette ville</label>
              {form.own ? <div className="form-grid">
                <Field label="Frais de base"><div className="money"><input type="number" min="0" step="50" value={form.base_fee} placeholder={String(defaults.base_fee)} onChange={(e) => setForm({ ...form, base_fee: e.target.value })} /><span>F</span></div></Field>
                <Field label="Par kilomètre"><div className="money"><input type="number" min="0" step="50" value={form.per_km} placeholder={String(defaults.per_km)} onChange={(e) => setForm({ ...form, per_km: e.target.value })} /><span>F</span></div></Field>
              </div> : <p className="muted small">Frais par défaut (Paramètres) : {fees(defaults.base_fee, defaults.per_km)}.</p>}
              {form.own && <p className="muted small">Exemple : 3 km = {fmt(Math.ceil(((Number(form.base_fee || defaults.base_fee)) + 3 * Number(form.per_km || defaults.per_km)) / 500) * 500)} (arrondi aux 500 F supérieurs).</p>}
              <label className="check"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />Ouverte aux commandes</label>
              {!form.is_active && <p className="muted small">Fermée : les clients de cette ville voient « nous ne livrons pas ici ». Pratique pour préparer une ville avant son ouverture.</p>}
              <div className="inline">
                <Btn disabled={busy || !ok} onClick={save}>{selId === "new" ? "Créer la ville" : "Enregistrer"}</Btn>
                {sel && String(sel.is_active) !== "1" && <Btn kind="link" onClick={() => setDel(sel)}>Supprimer</Btn>}
              </div>
              {!ok && <p className="muted small">{poly.length < 3 ? `Contour : ${poly.length} point${poly.length > 1 ? "s" : ""} sur 3 minimum.` : "Donnez un nom à la ville."}</p>}
            </div>
          </Card>}

          {sel && <Card title={`Quartiers (${sel.quarters.length})`}>
            <p className="muted small">Ils apparaissent dans la recherche « Où livrer ? » de l'app et dans le choix des quartiers des livreurs. Pour en ajouter, passez en mode « Quartiers » et touchez la carte.</p>
            <ul className="zn-q">{sel.quarters.map((q) => <li key={q.id}>{ren?.id === q.id
              ? <form className="zn-ren" onSubmit={renameQuarter}><input autoFocus value={ren.name} maxLength={80} onChange={(e) => setRen({ ...ren, name: e.target.value })} /><button className="btn link" disabled={busy || ren.name.trim().length < 2}>OK</button><button type="button" className="btn link" onClick={() => setRen(null)}>Annuler</button></form>
              : <><span>{q.name}</span><button className="btn link" onClick={() => setRen({ id: q.id, name: q.name })}>Renommer</button><button className="btn link bad" onClick={async () => { if (await run(() => api.del(`/admin/zones/quarters/${q.id}`), "Quartier supprimé")) reload(); }}>Supprimer</button></>}</li>)}</ul>
          </Card>}
        </div>

        <div className="zn-mapcol">
          <div className="zn-tools">
            <div className="seg">{[["shape", "Contour"], ["quarters", "Quartiers"]].map(([k, l]) => <button key={k} disabled={k === "quarters" && !sel} className={mode === k ? "on" : ""} onClick={() => setMode(k)}>{l}</button>)}</div>
            <PlaceSearch onFound={setFly} />
          </div>
          <p className="muted small zn-help">{mode === "shape"
            ? "Touchez la carte pour ajouter un point au contour ; faites glisser un point pour le déplacer ; touchez-le pour le retirer. Les autres villes sont en gris."
            : "Touchez la carte à l'emplacement du quartier, donnez-lui un nom. Faites glisser un quartier pour le déplacer."}</p>
          <div className="zn-map">
            <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
              <Basemap />
              <Fly to={fly} />
              <Clicks onClick={onMap} />
              {zones.filter((z) => String(z.id) !== String(selId) && z.polygon.length >= 3).map((z) => <Polygon key={z.id} positions={z.polygon} pathOptions={{ color: "#8A9A94", weight: 1.5, fillOpacity: 0.08, dashArray: String(z.is_active) === "1" ? null : "4 4" }}><Tooltip sticky>{z.name}</Tooltip></Polygon>)}
              {poly.length >= 2 && <Polygon positions={poly} pathOptions={{ color: "#00B492", weight: 2.5, fillOpacity: 0.15 }} />}
              {mode === "shape" && poly.map((p, i) => <Marker key={i + ":" + p.join()} position={p} icon={VERTEX} draggable
                eventHandlers={{ dragend: (e) => { const ll = e.target.getLatLng(); setPoly((x) => x.map((q, k) => (k === i ? [r6(ll.lat), r6(ll.lng)] : q))); }, click: () => setPoly((x) => (x.length > 3 ? x.filter((_, k) => k !== i) : x)) }} />)}
              {sel && sel.quarters.map((q) => <Marker key={"q" + q.id} position={[Number(q.lat), Number(q.lng)]} icon={QUARTER} draggable={mode === "quarters"} eventHandlers={{ dragend: (e) => moveQuarter(q, e.target.getLatLng()) }}><Tooltip direction="top" offset={[0, -6]} permanent={mode === "quarters"}>{q.name}</Tooltip></Marker>)}
              {pending && <Marker position={[pending.lat, pending.lng]} icon={PENDING} />}
            </MapContainer>
          </div>
          {mode === "shape" && dirtyShape && sel && <div className="zn-bar"><span>Contour modifié ({poly.length} points)</span><Btn kind="ghost" size="sm" onClick={() => setPoly(sel.polygon.map((p) => [Number(p[0]), Number(p[1])]))}>Annuler</Btn><Btn size="sm" disabled={busy || poly.length < 3} onClick={save}>Enregistrer le contour</Btn></div>}
          {mode === "shape" && selId === "new" && poly.length > 0 && <div className="zn-bar"><span>{poly.length} point{poly.length > 1 ? "s" : ""}</span><Btn kind="ghost" size="sm" onClick={() => setPoly([])}>Effacer le tracé</Btn></div>}
          {pending && <form className="zn-bar" onSubmit={addQuarter}><span>Nouveau quartier</span><input autoFocus value={pending.name} maxLength={80} onChange={(e) => setPending({ ...pending, name: e.target.value })} placeholder="Nom du quartier" /><Btn kind="ghost" size="sm" type="button" onClick={() => setPending(null)}>Annuler</Btn><Btn size="sm" disabled={busy || pending.name.trim().length < 2}>Ajouter</Btn></form>}
        </div>
      </div>
      {del && <Confirm title={`Supprimer ${del.name} ?`} danger confirm="Supprimer" busy={busy} text="La ville et ses quartiers sont supprimés. Les commandes passées ne changent pas." onCancel={() => setDel(null)}
        onConfirm={async () => { if (await run(() => api.del(`/admin/zones/${del.id}`), "Ville supprimée")) { setDel(null); setSelId(null); reload(); } }} />}
    </div>
  );
}
