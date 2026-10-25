import { useState } from "react";
import { Plus } from "lucide-react";
import api from "../api";
import { useLoad, useAction, PageHead, Table, Badge, Modal, Confirm, Btn, Field, fmt, num, dt } from "../ui";

const TYPE = { percentage: "Pourcentage", fixed: "Montant fixe", free_delivery: "Livraison offerte" };
const value = (c) => c.type === "percentage" ? `−${Number(c.value)} %` : c.type === "fixed" ? `−${fmt(c.value)}` : "Livraison offerte";

function Edit({ c, onClose, onDone }) {
  const [f, setF] = useState({
    code: c?.code || "", type: c?.type || "percentage", value: c?.value ?? 10, min_order: c?.min_order ?? 0, max_discount: c?.max_discount ?? "",
    max_uses: c?.max_uses ?? "", per_user_limit: c?.per_user_limit ?? 1, expires_at: (c?.expires_at || "").slice(0, 10), is_active: c ? String(c.is_active) === "1" : true,
  });
  const { run, busy } = useAction();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const save = async () => {
    const body = {
      code: f.code.trim().toUpperCase(), type: f.type, value: f.type === "free_delivery" ? 0 : Number(f.value) || 0,
      min_order: Number(f.min_order) || 0, max_discount: f.max_discount === "" ? null : Number(f.max_discount), max_uses: f.max_uses === "" ? null : Number(f.max_uses),
      per_user_limit: Number(f.per_user_limit) || 1, expires_at: f.expires_at ? f.expires_at + " 23:59:59" : null, is_active: f.is_active ? 1 : 0,
    };
    if (await run(() => (c ? api.put(`/admin/coupons/${c.id}`, body) : api.post("/admin/coupons", body)), c ? "Code modifié" : "Code créé")) onDone();
  };
  const ok = f.code.trim().length >= 3 && f.expires_at && (f.type === "free_delivery" || Number(f.value) > 0) && !(f.type === "percentage" && Number(f.value) > 100);
  return (
    <Modal title={c ? `Modifier ${c.code}` : "Nouveau code promo"} onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Annuler</Btn><Btn disabled={busy || !ok} onClick={save}>Enregistrer</Btn></>}>
      <div className="form-grid">
        <Field label="Code"><input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, "") })} placeholder="BIENVENUE" autoFocus /></Field>
        <Field label="Type"><select value={f.type} onChange={set("type")}>{Object.entries(TYPE).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        {f.type !== "free_delivery" && <Field label={f.type === "percentage" ? "Réduction (%)" : "Réduction (F)"}><input type="number" min="0" value={f.value} onChange={set("value")} /></Field>}
        {f.type === "percentage" && <Field label="Réduction maximum (F)" hint="Vide = pas de plafond"><input type="number" min="0" value={f.max_discount} onChange={set("max_discount")} /></Field>}
        <Field label="Commande minimum (F)"><input type="number" min="0" value={f.min_order} onChange={set("min_order")} /></Field>
        <Field label="Utilisations au total" hint="Vide = illimité"><input type="number" min="1" value={f.max_uses} onChange={set("max_uses")} /></Field>
        <Field label="Par client"><input type="number" min="1" value={f.per_user_limit} onChange={set("per_user_limit")} /></Field>
        <Field label="Valable jusqu'au"><input type="date" value={f.expires_at} onChange={set("expires_at")} /></Field>
      </div>
      <label className="check"><input type="checkbox" checked={f.is_active} onChange={set("is_active")} />Code actif</label>
    </Modal>
  );
}

export default function Coupons() {
  const { data, loading, error, reload } = useLoad(() => api.get("/admin/coupons"), []);
  const { run, busy } = useAction();
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const rows = Array.isArray(data) ? data : [];
  const expired = (c) => c.expires_at && new Date(c.expires_at.replace(" ", "T")) < new Date();
  return (
    <div className="page">
      <PageHead title="Codes promo" sub="Codes valables dans tous les commerces (créés par Lamuka) et codes des commerces"><Btn onClick={() => setEdit({})}><Plus size={18} />Nouveau code</Btn></PageHead>
      <Table rows={rows} loading={loading} error={error} empty="Aucun code promo." onRow={(c) => setEdit(c)} cols={[
        { k: "code", label: "Code", render: (c) => <><b className="mono">{c.code}</b>{c.description && <small className="block">{c.description}</small>}</> },
        { k: "value", label: "Réduction", render: value },
        { k: "where", label: "Valable", render: (c) => c.establishment_id ? `Commerce n° ${c.establishment_id}` : "Tous les commerces" },
        { k: "used", label: "Utilisé", right: true, render: (c) => `${num(c.used_count)}${c.max_uses ? " / " + num(c.max_uses) : ""}` },
        { k: "exp", label: "Jusqu'au", render: (c) => c.expires_at ? dt(c.expires_at, false) : "—" },
        { k: "st", label: "État", render: (c) => String(c.is_active) !== "1" ? <Badge tone="mut">Désactivé</Badge> : expired(c) ? <Badge tone="bad">Expiré</Badge> : <Badge tone="ok">Actif</Badge> },
        { k: "x", label: "", render: (c) => <Btn kind="link" onClick={(e) => { e.stopPropagation(); setDel(c); }}>Supprimer</Btn> },
      ]} />
      {edit && <Edit c={edit.id ? edit : null} onClose={() => setEdit(null)} onDone={() => { setEdit(null); reload(); }} />}
      {del && <Confirm title={`Supprimer le code ${del.code} ?`} danger text="Les commandes déjà passées avec ce code ne changent pas." confirm="Supprimer" busy={busy} onCancel={() => setDel(null)} onConfirm={async () => { if (await run(() => api.del(`/admin/coupons/${del.id}`), "Code supprimé")) { setDel(null); reload(); } }} />}
    </div>
  );
}
