import { useState } from "react";
import { usePaged, PageHead, Toolbar, Tabs, Table, Pager, Badge, Btn, fmt, dt, fullName, phone } from "../ui";
import { AssignDriver } from "./Deliveries";

export default function Errands() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [assign, setAssign] = useState(null);
  const list = usePaged("/admin/errands", "errands", { status, search });
  return (
    <div className="page">
      <PageHead title="Coursier" sub="Envois de colis et achats faits par un coursier" />
      <Tabs value={status} onChange={setStatus} items={[["", "Toutes"], ["pending", "Sans coursier"], ["assigned", "En cours"], ["picked_up", "Vers le destinataire"], ["delivered", "Livrées"], ["cancelled", "Annulées"]]} />
      <Toolbar onSearch={setSearch} placeholder="Référence (CRS-…), nom ou téléphone du client" />
      <Table {...list} empty="Aucune course coursier." cols={[
        { k: "ref", label: "Course", render: (e) => <><b>{e.ref}</b><small className="block">{dt(e.created_at)}</small></> },
        { k: "type", label: "Type", render: (e) => <>{e.type === "buy" ? "Achat" : "Envoi de colis"}<small className="block">{e.type === "buy" ? e.store_name : (e.description || "").slice(0, 40)}</small></> },
        { k: "client", label: "Client", render: (e) => <>{fullName(e.client_first_name, e.client_last_name)}<small className="block">{phone(e.client_phone)}</small></> },
        { k: "route", label: "Trajet", render: (e) => <>{e.pickup_address || "—"}<small className="block">→ {e.dropoff_address}</small></> },
        { k: "driver", label: "Coursier", render: (e) => e.driver_name ? <>{e.driver_name}<small className="block">{phone(e.driver_phone)}</small></> : <span className="muted">—</span> },
        { k: "status", label: "Statut", render: (e) => <Badge s={e.status} /> },
        { k: "fee", label: "Montant", right: true, render: (e) => <>{fmt(e.delivery_fee)}{Number(e.items_cost) > 0 && <small className="block">+ achats {fmt(e.items_cost)}</small>}</> },
        // Confier la course à un livreur, ou en changer tant qu'elle n'est pas récupérée
        { k: "act", label: "", render: (e) => ["pending", "assigned"].includes(e.status) ? <Btn size="sm" kind={e.driver_id ? "ghost" : undefined} onClick={(x) => { x.stopPropagation(); setAssign(e); }}>{e.driver_id ? "Changer" : "Attribuer"}</Btn> : null },
      ]} />
      <Pager {...list} />
      {assign && <AssignDriver title={`${assign.driver_id ? "Changer le coursier de" : "Attribuer"} la course ${assign.ref}`}
        sub={`${assign.pickup_address || assign.store_name || "—"} → ${assign.dropoff_address} · ${fmt(assign.delivery_fee)}${assign.driver_name ? ` · actuellement : ${assign.driver_name}` : ""}`}
        url={`/admin/errands/${assign.id}/assign`} currentId={assign.driver_id}
        onClose={() => setAssign(null)} onDone={() => { setAssign(null); list.reload(); }} />}
    </div>
  );
}
