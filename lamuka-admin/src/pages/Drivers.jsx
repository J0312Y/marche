import { useState } from "react";
import api from "../api";
import { useLoad, usePaged, useAction, PageHead, Toolbar, Tabs, Table, Pager, Badge, Drawer, Rows, Confirm, Btn, fmt, num, dt, ago, fullName, phone } from "../ui";
import Docs from "../Docs";

const VEHICLE = { moto: "Moto", voiture: "Voiture", car: "Voiture", velo: "Vélo", bike: "Vélo", pied: "À pied", foot: "À pied" };

function DriverDrawer({ id, onClose, onChanged }) {
  const { data, reload } = useLoad(() => api.get(`/admin/drivers/${id}`), [id]);
  const { run, busy } = useAction();
  const [ask, setAsk] = useState(null);
  const [file, setFile] = useState(null);
  const d = data?.driver || {};
  const act = async (what, why) => {
    const ok = { verify: "Livreur validé", reject: "Demande refusée", suspend: "Livreur suspendu", activate: "Livreur réactivé" }[what];
    if (await run(() => api.put(`/admin/drivers/${id}/${what}`, why ? { reason: why } : {}), ok)) { setAsk(null); reload(); onChanged(); }
  };
  return (
    <Drawer title={fullName(d.first_name, d.last_name) || "Livreur"} onClose={onClose} footer={data && <>
      {d.status === "pending" && <><Btn kind="danger" onClick={() => setAsk("reject")}>Refuser</Btn><Btn disabled={!file?.complete} title={file?.complete ? "" : "Dossier incomplet"} onClick={() => setAsk("verify")}>Valider le livreur</Btn></>}
      {d.status === "active" && <Btn kind="danger" onClick={() => setAsk("suspend")}>Suspendre</Btn>}
      {d.status === "suspended" && <Btn onClick={() => setAsk("activate")}>Réactiver</Btn>}
    </>}>
      {!data ? <p className="muted">Chargement…</p> : <>
        {d.status === "rejected" && <p className="review-note">Refusé{d.review_note ? ` : ${d.review_note}` : ""}. Le livreur peut corriger son dossier et le renvoyer depuis l'app.</p>}
        <div className="drawer-status"><Badge s={d.status} />{String(d.is_available) === "1" ? <Badge tone="ok">En ligne</Badge> : <Badge tone="mut">Hors ligne</Badge>}</div>
        <Rows items={[
          ["Téléphone", phone(d.phone)],
          ["Véhicule", [VEHICLE[d.vehicle_type] || d.vehicle_type, d.vehicle_brand].filter(Boolean).join(" · ")],
          ["Plaque", d.vehicle_plate || "—"],
          ["Livraisons", num(data.stats?.total_deliveries ?? d.total_deliveries)],
          ["Gains", fmt(data.stats?.total_earned ?? d.total_earned)],
          ["Note", Number(d.avg_rating) > 0 ? `${Number(d.avg_rating).toFixed(1)} / 5` : "Pas encore de note"],
          ["Dernière position", d.current_lat ? `${Number(d.current_lat).toFixed(4)}, ${Number(d.current_lng).toFixed(4)} · ${ago(d.last_location_update)}` : "Jamais envoyée"],
          ["Inscrit le", dt(d.created_at, false)],
        ]} />
        <h4 className="sub-h">Pièces justificatives</h4>
        <Docs userId={d.user_id} role="driver" onState={setFile} />
      </>}
      {ask === "verify" && <Confirm title="Valider ce livreur ?" text="Les pièces encore « à vérifier » seront marquées conformes. Il pourra passer en ligne et accepter des courses." confirm="Valider" busy={busy} onCancel={() => setAsk(null)} onConfirm={() => act("verify")} />}
      {ask === "reject" && <Confirm title="Refuser la demande ?" danger reason="required" text="Le livreur voit le motif dans l'application, corrige les pièces signalées et renvoie sa demande." confirm="Refuser" busy={busy} onCancel={() => setAsk(null)} onConfirm={(w) => act("reject", w)} />}
      {ask === "suspend" && <Confirm title="Suspendre ce livreur ?" danger text="Il ne reçoit plus de courses jusqu'à sa réactivation." confirm="Suspendre" busy={busy} onCancel={() => setAsk(null)} onConfirm={() => act("suspend")} />}
      {ask === "activate" && <Confirm title="Réactiver ce livreur ?" text="Il pourra de nouveau accepter des courses." confirm="Réactiver" busy={busy} onCancel={() => setAsk(null)} onConfirm={() => act("activate")} />}
    </Drawer>
  );
}

export default function Drivers({ onChanged }) {
  const [status, setStatus] = useState("");
  const [online, setOnline] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const list = usePaged("/admin/drivers", "drivers", { status, search, online: online ? 1 : "" });
  return (
    <div className="page">
      <PageHead title="Livreurs" sub="Inscriptions à valider, disponibilité et activité" />
      <Tabs value={status} onChange={setStatus} items={[["", "Tous"], ["pending", "À valider"], ["active", "Actifs"], ["suspended", "Suspendus"], ["rejected", "Refusés"]]} />
      <Toolbar onSearch={setSearch} placeholder="Nom, téléphone ou plaque">
        <label className="check"><input type="checkbox" checked={online} onChange={(e) => setOnline(e.target.checked)} />En ligne seulement</label>
      </Toolbar>
      <Table {...list} onRow={(d) => setOpen(d.id)} empty="Aucun livreur." cols={[
        { k: "name", label: "Livreur", render: (d) => <div className="who"><span>{(d.first_name || "?")[0]}</span><div><b>{fullName(d.first_name, d.last_name)}</b><small className="block">{phone(d.phone)}</small></div></div> },
        { k: "veh", label: "Véhicule", render: (d) => <>{VEHICLE[d.vehicle_type] || d.vehicle_type}<small className="block">{d.vehicle_plate || ""}</small></> },
        { k: "status", label: "Statut", render: (d) => <Badge s={d.status} /> },
        { k: "docs", label: "Dossier", render: (d) => d.status === "active" || d.status === "suspended" ? <span className="muted">—</span> : Number(d.docs_refused) > 0 ? <Badge tone="bad">À refaire</Badge> : <Badge tone={Number(d.docs_count) >= 3 ? "ok" : "warn"}>{d.docs_count || 0} pièce{Number(d.docs_count) > 1 ? "s" : ""}</Badge> },
        { k: "online", label: "Disponibilité", render: (d) => String(d.is_available) === "1" ? <Badge tone="ok">En ligne</Badge> : <Badge tone="mut">Hors ligne</Badge> },
        { k: "deliveries", label: "Livraisons", right: true, render: (d) => num(d.total_deliveries) },
        { k: "earned", label: "Gains", right: true, render: (d) => fmt(d.total_earned) },
      ]} />
      <Pager {...list} />
      {open && <DriverDrawer id={open} onClose={() => setOpen(null)} onChanged={() => { list.reload(); onChanged?.(); }} />}
    </div>
  );
}
