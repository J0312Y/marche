/** Pièces justificatives d'une demande commerçant / livreur : vignettes, agrandissement, conforme / à refaire. */
import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Clock3, ImageOff } from "lucide-react";
import api, { getToken } from "./api";
import { useLoad, useAction, Modal, Btn, Field, dt } from "./ui";

const BASE = import.meta.env.VITE_API_URL || "http://localhost/lamuka-api/api/v1";

/** Photo protégée : chargée avec la session administrateur */
function useDocImage(id) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let url = null, alive = true;
    fetch(`${BASE}/admin/documents/${id}/file`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => (r.ok ? r.blob() : null)).then((b) => { if (b && alive) { url = URL.createObjectURL(b); setSrc(url); } }).catch(() => {});
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [id]);
  return src;
}

const STATE = {
  accepted: [CheckCircle2, "Conforme", "ok"],
  refused: [AlertTriangle, "À refaire", "bad"],
  pending: [Clock3, "À vérifier", "warn"],
};

function DocCard({ d, label, onOpen }) {
  const src = useDocImage(d.id);
  const [Ic, txt, tone] = STATE[d.status] || STATE.pending;
  return (
    <button className="doc" onClick={() => onOpen(d, src)}>
      <span className="doc-img">{src ? <img src={src} alt={label} /> : <ImageOff size={20} />}</span>
      <b>{label}</b>
      <span className={"badge " + tone}><Ic size={13} style={{ marginRight: 4 }} />{txt}</span>
    </button>
  );
}

function Viewer({ d, src, label, onClose, onDone }) {
  const { run, busy } = useAction();
  const [refuse, setRefuse] = useState(false);
  const [note, setNote] = useState(d.note || "");
  const decide = async (status) => {
    if (await run(() => api.put(`/admin/documents/${d.id}`, { status, note: status === "refused" ? note.trim() : undefined }), status === "accepted" ? "Pièce conforme" : "Pièce à refaire")) onDone();
  };
  return (
    <Modal title={label} onClose={onClose} footer={refuse
      ? <><Btn kind="ghost" onClick={() => setRefuse(false)}>Retour</Btn><Btn kind="danger" disabled={busy || !note.trim()} onClick={() => decide("refused")}>Demander une nouvelle photo</Btn></>
      : <><Btn kind="danger" onClick={() => setRefuse(true)}>À refaire</Btn><Btn disabled={busy} onClick={() => decide("accepted")}>Conforme</Btn></>}>
      <div className="doc-view">{src ? <img src={src} alt={label} /> : <p className="muted">Chargement…</p>}</div>
      <p className="muted small">Envoyée {dt(d.created_at)}{d.reviewed_at ? ` · vérifiée ${dt(d.reviewed_at)}` : ""}</p>
      {refuse && <Field label="Ce qui ne va pas (le demandeur le verra)"><textarea rows={2} autoFocus value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. : photo floue, coins coupés, pièce expirée…" /></Field>}
    </Modal>
  );
}

/** Bloc à placer dans la fiche : renvoie aussi l'état du dossier via onState */
export default function Docs({ userId, role, onState }) {
  const { data, reload } = useLoad(() => api.get("/admin/documents", { user_id: userId, role }), [userId, role]);
  const [open, setOpen] = useState(null);
  useEffect(() => { if (data) onState?.(data); }, [data]); // eslint-disable-line
  if (!data) return <p className="muted">Chargement des pièces…</p>;
  const by = Object.fromEntries(data.documents.map((d) => [d.type, d]));
  const all = [...data.required.map((t) => [t, true]), ...data.optional.map((t) => [t, false])];
  return (
    <>
      <div className="docs">
        {all.map(([t, req]) => by[t]
          ? <DocCard key={t} d={by[t]} label={data.labels[t]} onOpen={(d, src) => setOpen({ d, src, label: data.labels[t] })} />
          : <div key={t} className="doc empty"><span className="doc-img"><ImageOff size={20} /></span><b>{data.labels[t]}</b><span className={"badge " + (req ? "bad" : "mut")}>{req ? "Manquante" : "Facultative"}</span></div>)}
      </div>
      <p className={"small " + (data.complete ? "muted" : "bad")} style={{ marginTop: 10 }}>
        {data.complete ? "Dossier complet. Ouvrez chaque pièce pour la vérifier (les pièces non vérifiées sont marquées conformes à la validation)."
          : `Dossier incomplet : ${[...data.missing.map((t) => data.labels[t].toLowerCase() + " manquante"), ...data.refused.map((t) => data.labels[t].toLowerCase() + " à refaire")].join(", ")}. La validation est impossible tant qu'il manque une pièce.`}
      </p>
      {open && <Viewer {...open} onClose={() => setOpen(null)} onDone={() => { setOpen(null); reload(); }} />}
    </>
  );
}
