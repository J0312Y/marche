import { useState } from "react";
import { Tag, Image, Save, Pause, Play, Pencil, Trash2, X as XIcon } from "lucide-react";
import { useI18n } from "../i18n";
import { BANNERS } from "../dataExtended";
import { useToast, ConfirmModal, EmptyState } from "../components/UI";
import { fmt } from "../data";

const POSITION_LABELS = { fr: { home_top: "Accueil — Haut", home_middle: "Accueil — Milieu", home_bottom: "Accueil — Bas" }, en: { home_top: "Home — Top", home_middle: "Home — Middle", home_bottom: "Home — Bottom" } };

export default function BannersPage() {
  const { lang } = useI18n();
  const toast = useToast();
  const [banners, setBanners] = useState(BANNERS);
  const [editing, setEditing] = useState(null); // null = list, "new" = create, banner obj = edit
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [form, setForm] = useState({ title: "", icon: "", link: "", position: "home_top", start: "", end: "" });

  const startEdit = (b) => {
    setForm({ title: b.title, icon: b.image, link: b.link, position: b.position, start: b.start, end: b.end });
    setEditing(b);
  };

  const startCreate = () => {
    setForm({ title: "", icon: "", link: "", position: "home_top", start: "", end: "" });
    setEditing("new");
  };

  const saveForm = () => {
    if (!form.title.trim()) return;
    if (editing === "new") {
      setBanners(prev => [...prev, { id: "b" + Date.now(), title: form.title, image: form.icon, link: form.link, position: form.position, active: true, start: form.start, end: form.end, clicks: 0 }]);
      toast.success(lang === "fr" ? "Bannière créée" : "Banner created");
    } else {
      setBanners(prev => prev.map(b => b.id === editing.id ? { ...b, title: form.title, image: form.icon, link: form.link, position: form.position, start: form.start, end: form.end } : b));
      toast.success(lang === "fr" ? "Bannière modifiée" : "Banner updated");
    }
    setEditing(null);
  };

  const toggleActive = (id) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    toast.info(lang === "fr" ? "Statut mis à jour" : "Status updated");
  };

  const deleteBanner = (id) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    setDeleteConfirm(null);
    toast.success(lang === "fr" ? "Bannière supprimée" : "Banner deleted");
  };

  // Form view
  if (editing !== null) {
    return (
      <div className="fade-in">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button className="btn btn-ghost" onClick={() => setEditing(null)}>← {lang === "fr" ? "Retour" : "Back"}</button>
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            {editing === "new" ? (lang === "fr" ? "Nouvelle bannière" : "New Banner") : (lang === "fr" ? "Modifier bannière" : "Edit Banner")}
          </h1>
        </div>

        <div className="card">
          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">{lang === "fr" ? "Titre" : "Title"} *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={lang === "fr" ? "Ex: Soldes de Mars" : "Ex: March Sales"} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}><Tag size={16} /> {lang === "fr" ? "Icône / Emoji" : "Icon / Emoji"}</label>
                <input className="form-input" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === "fr" ? "Position" : "Position"}</label>
                <select className="form-input" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={{ cursor: "pointer" }}>
                  {Object.entries(POSITION_LABELS[lang]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">{lang === "fr" ? "Lien" : "Link"}</label>
                <input className="form-input" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="/promo/mars" />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === "fr" ? "Date début" : "Start date"}</label>
                <input className="form-input" type="date" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === "fr" ? "Date fin" : "End date"}</label>
                <input className="form-input" type="date" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
              </div>
            </div>

            {/* Preview */}
            <div style={{ marginTop: 24 }}>
              <div className="form-label">{lang === "fr" ? "Aperçu" : "Preview"}</div>
              <div style={{ background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", borderRadius: 16, padding: 24, color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{form.icon ? <span style={{ fontSize: 40 }}>{form.icon}</span> : <Image size={40} />}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{form.title || "..."}</div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>{form.link || "/"}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={saveForm} disabled={!form.title.trim()}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Save size={14} /> {lang === "fr" ? "Enregistrer" : "Save"}</span>
              </button>
              <button className="btn btn-outline" onClick={() => setEditing(null)}>
                {lang === "fr" ? "Annuler" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h1 className="page-title">{lang === "fr" ? "Bannières" : "Banners"}</h1>
        <button className="btn btn-primary" onClick={startCreate}>+ {lang === "fr" ? "Nouvelle bannière" : "New Banner"}</button>
      </div>
      <p className="page-subtitle">{lang === "fr" ? "Gérez les bannières promotionnelles de l'accueil" : "Manage promotional banners on the homepage"}</p>

      {banners.length === 0 ? (
        <div className="card"><EmptyState icon={<Image size={40} />} title={lang === "fr" ? "Aucune bannière" : "No banners"} subtitle={lang === "fr" ? "Créez votre première bannière" : "Create your first banner"} /></div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {banners.map(b => (
            <div key={b.id} className="card" style={{ opacity: b.active ? 1 : 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 20 }}>
                {/* Icon preview */}
                <div style={{ width: 60, height: 60, borderRadius: 14, background: b.active ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                  {b.image}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{b.title}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 12 }}>
                    <span className={`badge ${b.active ? "badge-success" : "badge-neutral"}`}>
                      {b.active ? (lang === "fr" ? "Actif" : "Active") : (lang === "fr" ? "Inactif" : "Inactive")}
                    </span>
                    <span className="badge badge-info">{POSITION_LABELS[lang]?.[b.position]}</span>
                    <span style={{ color: "var(--text-3)" }}>{b.start} → {b.end}</span>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ textAlign: "center", minWidth: 80 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)" }}>{fmt(b.clicks)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>clicks</div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button className={`btn btn-sm ${b.active ? "btn-outline" : "btn-success"}`} onClick={() => toggleActive(b.id)}>
                    {b.active ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => startEdit(b)}><Pencil size={14} /></button>
                  <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => setDeleteConfirm(b)}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteConfirm}
        title={lang === "fr" ? "Supprimer cette bannière ?" : "Delete this banner?"}
        message={deleteConfirm?.title}
        confirmText={lang === "fr" ? "Supprimer" : "Delete"}
        danger
        onConfirm={() => deleteBanner(deleteConfirm?.id)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
