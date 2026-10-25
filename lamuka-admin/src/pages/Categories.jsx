import { useState } from "react";
import { Plus } from "lucide-react";
import api from "../api";
import { art3d } from "../../../src/config/art3d";
import { useLoad, useAction, PageHead, Toolbar, Table, Badge, Modal, Confirm, Btn, Field, ImagePick } from "../ui";
import { TYPES } from "./Stores";

const ALL_TYPES = { all: "Tous les commerces", ...TYPES };
const uploaded = (c) => c?.image && c.image.includes("/uploads/categories/");
/** Même règle que l'app : image envoyée ici > illustration intégrée à l'app > ancienne image */
const visual = (c) => (uploaded(c) ? c.image : art3d(c?.name) || c?.image || null);
const source = (c) => (uploaded(c) ? "Image envoyée" : art3d(c?.name) ? "Illustration de l'app" : c?.image ? "Ancienne image" : "Aucune image");

function Edit({ cat, parents, onClose, onDone }) {
  const [f, setF] = useState({ name: cat?.name || "", commerce_type: cat?.commerce_type || "restaurant", parent_id: cat?.parent_id || "", sort_order: cat?.sort_order ?? 0, is_active: cat ? String(cat.is_active) === "1" : true });
  const [img, setImg] = useState(cat?.image || null);
  const { run, busy } = useAction();
  const save = async () => {
    const body = { ...f, name: f.name.trim(), parent_id: f.parent_id || null, sort_order: Number(f.sort_order) || 0, is_active: f.is_active ? 1 : 0 };
    if (!body.name) return;
    if (await run(() => (cat ? api.put(`/admin/categories/${cat.id}`, body) : api.post("/admin/categories", body)), cat ? "Catégorie modifiée" : "Catégorie créée")) onDone();
  };
  const pick = async (file) => {
    const r = await run(() => api.upload(`/admin/categories/${cat.id}/image`, "image", file), "Image enregistrée");
    if (r?.url) setImg(r.url);
  };
  const remove = async () => { if (await run(() => api.del(`/admin/categories/${cat.id}/image`), "Image retirée")) setImg(null); };
  const shown = { ...cat, name: f.name, image: img };
  return (
    <Modal title={cat ? "Modifier la catégorie" : "Nouvelle catégorie"} onClose={onClose} footer={<><Btn kind="ghost" onClick={cat ? onDone : onClose}>{cat ? "Fermer" : "Annuler"}</Btn><Btn disabled={busy || !f.name.trim()} onClick={save}>Enregistrer</Btn></>}>
      <Field label="Nom"><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoFocus={!cat} /></Field>
      {cat ? <ImagePick label={`Visuel dans l'app · ${source(shown)}`} current={visual(shown)} busy={busy} onPick={pick} onRemove={uploaded(shown) ? remove : null}
        hint="JPG, PNG ou WebP, 200 px minimum. Le serveur retire les marges blanches, centre le sujet et met l'image au format carré. Idéal : un objet détouré sur fond blanc ou transparent." />
        : <p className="muted small">Enregistrez la catégorie, puis rouvrez-la pour ajouter une image.</p>}
      <Field label="Type de commerce"><select value={f.commerce_type} onChange={(e) => setF({ ...f, commerce_type: e.target.value })}>{Object.entries(ALL_TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
      <Field label="Catégorie parente (facultatif)"><select value={f.parent_id || ""} onChange={(e) => setF({ ...f, parent_id: e.target.value })}><option value="">Aucune</option>{parents.filter((p) => p.id !== cat?.id).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
      <div className="form-grid">
        <Field label="Ordre d'affichage"><input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: e.target.value })} /></Field>
        <label className="check" style={{ alignSelf: "end", paddingBottom: 12 }}><input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} />Visible dans l'application</label>
      </div>
    </Modal>
  );
}

export default function Categories() {
  const { data, loading, error, reload } = useLoad(() => api.get("/admin/categories"), []);
  const { run, busy } = useAction();
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const all = Array.isArray(data) ? data : [];
  const rows = all.filter((c) => (!type || c.commerce_type === type) && (!search || c.name.toLowerCase().includes(search.toLowerCase())));
  const parentName = (id) => all.find((c) => String(c.id) === String(id))?.name;
  return (
    <div className="page">
      <PageHead title="Catégories" sub="Rayons et cuisines proposés aux commerces, et leur visuel dans l'app"><Btn onClick={() => setEdit({})}><Plus size={18} />Nouvelle catégorie</Btn></PageHead>
      <Toolbar onSearch={setSearch} placeholder="Nom de la catégorie">
        <select value={type} onChange={(e) => setType(e.target.value)}><option value="">Tous les types</option>{Object.entries(ALL_TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      </Toolbar>
      <Table rows={rows} loading={loading} error={error} empty="Aucune catégorie." onRow={(c) => setEdit(c)} cols={[
        { k: "name", label: "Catégorie", render: (c) => <div className="who">{visual(c) ? <img className="cat-ic" src={visual(c)} alt="" /> : <span>{c.name[0]}</span>}<div><b>{c.name}</b>{c.parent_id && <small className="block">dans {parentName(c.parent_id) || "—"}</small>}</div></div> },
        { k: "src", label: "Visuel", render: (c) => <span className={uploaded(c) ? "" : "muted"}>{source(c)}</span> },
        { k: "type", label: "Type de commerce", render: (c) => ALL_TYPES[c.commerce_type] || c.commerce_type },
        { k: "sort_order", label: "Ordre", right: true },
        { k: "active", label: "Visibilité", render: (c) => String(c.is_active) === "1" ? <Badge tone="ok">Visible</Badge> : <Badge tone="mut">Masquée</Badge> },
        { k: "x", label: "", render: (c) => <Btn kind="link" onClick={(e) => { e.stopPropagation(); setDel(c); }}>Supprimer</Btn> },
      ]} />
      {edit && <Edit cat={edit.id ? edit : null} parents={all.filter((c) => !c.parent_id)} onClose={() => setEdit(null)} onDone={() => { setEdit(null); reload(); }} />}
      {del && <Confirm title={`Supprimer « ${del.name} » ?`} danger text="La suppression est refusée si des articles l'utilisent. Pour la retirer de l'application sans rien perdre, rendez-la plutôt invisible." confirm="Supprimer" busy={busy} onCancel={() => setDel(null)} onConfirm={async () => { if (await run(() => api.del(`/admin/categories/${del.id}`), "Catégorie supprimée")) { setDel(null); reload(); } }} />}
    </div>
  );
}
