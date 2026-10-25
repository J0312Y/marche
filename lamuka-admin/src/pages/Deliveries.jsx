import { useState } from "react";
import api from "../api";
import { useLoad, usePaged, useAction, PageHead, Tabs, Table, Pager, Badge, Modal, Btn, fmt, dt, fullName, phone } from "../ui";

/**
 * Confier une course (commande ou coursier) à un livreur, ou en changer tant qu'elle n'est pas récupérée.
 * Par défaut les livreurs en ligne ; « Tous les livreurs validés » pour joindre aussi ceux hors ligne.
 */
export function AssignDriver({ title, sub, url, currentId, onClose, onDone }) {
  const [all, setAll] = useState(false);
  const { data } = useLoad(() => api.get("/admin/drivers", { status: "active", ...(all ? {} : { online: 1 }), limit: 100 }), [all]);
  const { run, busy } = useAction();
  const [pick, setPick] = useState(null);
  const drivers = (data?.drivers || []).filter((x) => Number(x.id) !== Number(currentId));
  const go = async () => { if (await run(() => api.put(url, { driver_id: pick }), currentId ? "Livreur changé" : "Livreur attribué")) onDone(); };
  return (
    <Modal title={title} onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Annuler</Btn><Btn disabled={!pick || busy} onClick={go}>{currentId ? "Changer de livreur" : "Attribuer"}</Btn></>}>
      <p className="muted">{sub}</p>
      <div className="seg" style={{ margin: "10px 0" }}>
        <button className={!all ? "on" : ""} onClick={() => { setAll(false); setPick(null); }}>En ligne</button>
        <button className={all ? "on" : ""} onClick={() => { setAll(true); setPick(null); }}>Tous les livreurs validés</button>
      </div>
      {!data ? <p className="muted">Chargement…</p> : !drivers.length ? <p className="muted">{all ? "Aucun autre livreur validé." : "Aucun livreur en ligne pour le moment."}</p> :
        <div className="pick-list">{drivers.map((x) => (
          <label key={x.id} className={pick === x.id ? "on" : ""}><input type="radio" name="drv" checked={pick === x.id} onChange={() => setPick(x.id)} />
            <span><b>{fullName(x.first_name, x.last_name)}</b>{Number(x.is_available) !== 1 && <span className="muted small"> · hors ligne</span>}<small className="block">{phone(x.phone)} · {x.vehicle_type} · {x.total_deliveries} livraisons</small></span></label>
        ))}</div>}
    </Modal>
  );
}

// Changer de livreur : possible jusqu'au retrait de la commande
const canAssign = (d) => ["pending", "assigned", "pickup_arrived"].includes(d.status) && ["confirmed", "preparing", "ready", "assigned"].includes(d.order_status) && (d.status !== "pending" || !d.driver_id);

export default function Deliveries({ onChanged }) {
  const [status, setStatus] = useState("");
  const [assign, setAssign] = useState(null);
  const list = usePaged("/admin/deliveries", "deliveries", { status });
  return (
    <div className="page">
      <PageHead title="Livraisons" sub="Courses des commandes : qui livre, où et à quelle étape" />
      <Tabs value={status} onChange={setStatus} items={[["", "Toutes"], ["pending", "Sans livreur"], ["assigned", "Vers le commerce"], ["picked_up", "Vers le client"], ["delivered", "Livrées"], ["cancelled", "Annulées"]]} />
      <Table {...list} empty="Aucune livraison." cols={[
        { k: "ref", label: "Commande", render: (d) => <><b>{d.ref}</b><small className="block">{dt(d.created_at)}</small></> },
        { k: "route", label: "Trajet", render: (d) => <>{d.establishment_name}<small className="block">→ {d.dropoff_address || "—"}{d.distance_km ? ` · ${Number(d.distance_km).toFixed(1)} km` : ""}</small></> },
        { k: "client", label: "Client", render: (d) => <>{d.client_name || "—"}<small className="block">{phone(d.client_phone)}</small></> },
        { k: "driver", label: "Livreur", render: (d) => d.driver_name ? <>{d.driver_name}<small className="block">{phone(d.driver_phone)}</small></> : <span className="muted">—</span> },
        { k: "status", label: "Étape", render: (d) => <Badge s={d.status} /> },
        { k: "gain", label: "Gain livreur", right: true, render: (d) => fmt(d.driver_earning || d.fee) },
        { k: "act", label: "", render: (d) => canAssign(d) ? <Btn size="sm" kind={d.driver_id ? "ghost" : undefined} onClick={(e) => { e.stopPropagation(); setAssign(d); }}>{d.driver_id ? "Changer" : "Attribuer"}</Btn> : null },
      ]} />
      <Pager {...list} />
      {assign && <AssignDriver title={`${assign.driver_id ? "Changer le livreur de" : "Attribuer"} la commande ${assign.ref}`}
        sub={`${assign.establishment_name} → ${assign.dropoff_address || "client"} · gain ${fmt(assign.driver_earning || assign.fee)}${assign.driver_name ? ` · actuellement : ${assign.driver_name}` : ""}`}
        url={`/admin/deliveries/${assign.id}/assign`} currentId={assign.driver_id}
        onClose={() => setAssign(null)} onDone={() => { setAssign(null); list.reload(); onChanged?.(); }} />}
    </div>
  );
}
