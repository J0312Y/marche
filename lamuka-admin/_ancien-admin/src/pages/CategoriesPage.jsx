import { useState } from "react";
import { Store, UtensilsCrossed, Cake, Pill, ShoppingCart, Wrench, Package, FolderOpen, Pencil, Trash2, Save, X as XIcon, Shirt, Smartphone, Sparkles, Home, Coffee, Beer, Croissant, Droplets, ShoppingBag, Dumbbell, Music, PawPrint, Leaf, Baby, Car, BookOpen, Gamepad2 } from "lucide-react";
import { useI18n } from "../i18n";
import { CATEGORIES } from "../dataExtended";
import { useToast, ConfirmModal, EmptyState } from "../components/UI";

const TYPES = [
  { value: "boutique", label: "Boutique", icon: <Store size={14} /> },
  { value: "restaurant", label: "Restaurant", icon: <UtensilsCrossed size={14} /> },
  { value: "patisserie", label: "Pâtisserie", icon: <Cake size={14} /> },
  { value: "pharmacie", label: "Pharmacie", icon: <Pill size={14} /> },
  { value: "supermarche", label: "Supermarché", icon: <ShoppingCart size={14} /> },
  { value: "service", label: "Service", icon: <Wrench size={14} /> },
];

const ICON_OPTIONS = [
  { name: "shirt", component: <Shirt size={20} /> },
  { name: "smartphone", component: <Smartphone size={20} /> },
  { name: "sparkles", component: <Sparkles size={20} /> },
  { name: "home", component: <Home size={20} /> },
  { name: "utensils-crossed", component: <UtensilsCrossed size={20} /> },
  { name: "coffee", component: <Coffee size={20} /> },
  { name: "cake", component: <Cake size={20} /> },
  { name: "croissant", component: <Croissant size={20} /> },
  { name: "pill", component: <Pill size={20} /> },
  { name: "droplets", component: <Droplets size={20} /> },
  { name: "shopping-cart", component: <ShoppingCart size={20} /> },
  { name: "shopping-bag", component: <ShoppingBag size={20} /> },
  { name: "wrench", component: <Wrench size={20} /> },
  { name: "beer", component: <Beer size={20} /> },
  { name: "gamepad2", component: <Gamepad2 size={20} /> },
  { name: "book-open", component: <BookOpen size={20} /> },
  { name: "dumbbell", component: <Dumbbell size={20} /> },
  { name: "music", component: <Music size={20} /> },
  { name: "paw-print", component: <PawPrint size={20} /> },
  { name: "leaf", component: <Leaf size={20} /> },
  { name: "baby", component: <Baby size={20} /> },
  { name: "car", component: <Car size={20} /> },
];

const getIconComponent = (name, size = 22) => {
  const found = ICON_OPTIONS.find(ic => ic.name === name);
  if (found) return <span style={{ display: "flex", color: "var(--text-2)" }}>{found.component}</span>;
  return <Package size={size} />;
};

export default function CategoriesPage() {
  const { t, lang } = useI18n();
  const toast = useToast();
  const [cats, setCats] = useState(CATEGORIES);
  const [typeFilter, setTypeFilter] = useState("all");
  const [modal, setModal] = useState(null); // null | {mode: "create"} | {mode: "edit", cat: {...}}
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("package");
  const [formType, setFormType] = useState("boutique");

  const filtered = typeFilter === "all" ? cats : cats.filter(c => c.type === typeFilter);

  const openCreate = () => {
    setFormName(""); setFormIcon("package"); setFormType("boutique");
    setModal({ mode: "create" });
  };

  const openEdit = (cat) => {
    setFormName(cat.name); setFormIcon(cat.icon); setFormType(cat.type);
    setModal({ mode: "edit", cat });
  };

  const saveCategory = () => {
    if (!formName.trim()) return;
    if (modal.mode === "create") {
      const newCat = { id: Date.now(), name: formName.trim(), icon: formIcon, type: formType, articles: 0, sort: cats.length, active: true };
      setCats(prev => [...prev, newCat]);
      toast.success(lang === "fr" ? `Catégorie "${formName}" créée` : `Category "${formName}" created`);
    } else {
      setCats(prev => prev.map(c => c.id === modal.cat.id ? { ...c, name: formName.trim(), icon: formIcon, type: formType } : c));
      toast.success(lang === "fr" ? "Catégorie modifiée" : "Category updated");
    }
    setModal(null);
  };

  const toggleActive = (id) => {
    setCats(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCategory = (id) => {
    setCats(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
    toast.success(lang === "fr" ? "Catégorie supprimée" : "Category deleted");
  };

  const moveUp = (id) => {
    setCats(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx <= 0) return prev;
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr.map((c, i) => ({ ...c, sort: i }));
    });
  };

  const moveDown = (id) => {
    setCats(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr.map((c, i) => ({ ...c, sort: i }));
    });
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 className="page-title">{lang === "fr" ? "Catégories" : "Categories"}</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ {lang === "fr" ? "Nouvelle catégorie" : "New category"}</button>
      </div>
      <p className="page-subtitle">{cats.length} {lang === "fr" ? "catégories · " : "categories · "}{cats.filter(c => c.active).length} {lang === "fr" ? "actives" : "active"}</p>

      <div className="tab-bar" style={{ marginBottom: 20 }}>
        <button className={`tab-btn ${typeFilter === "all" ? "active" : ""}`} onClick={() => setTypeFilter("all")}>{t("all")} ({cats.length})</button>
        {TYPES.map(tp => {
          const count = cats.filter(c => c.type === tp.value).length;
          return <button key={tp.value} className={`tab-btn ${typeFilter === tp.value ? "active" : ""}`} onClick={() => setTypeFilter(tp.value)} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{tp.icon}{tp.label} ({count})</button>;
        })}
      </div>

      <div className="card">
        {filtered.length === 0 ? <EmptyState icon={<FolderOpen size={40} />} title={lang === "fr" ? "Aucune catégorie" : "No categories"} /> : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr><th style={{ width: 50 }}>#</th><th>{lang === "fr" ? "Catégorie" : "Category"}</th><th>Type</th><th>Articles</th><th>{t("status")}</th><th style={{ width: 140 }}>{lang === "fr" ? "Ordre" : "Order"}</th><th>{t("actions")}</th></tr></thead>
              <tbody>
                {filtered.map((c, idx) => (
                  <tr key={c.id} style={{ opacity: c.active ? 1 : 0.5 }}>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>{idx + 1}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ display: "flex", alignItems: "center" }}>{getIconComponent(c.icon)}</span>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </div>
                    </td>
                    <td><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{TYPES.find(tp => tp.value === c.type)?.icon}{TYPES.find(tp => tp.value === c.type)?.label || c.type}</span></td>
                    <td>{c.articles}</td>
                    <td>
                      <button className={`btn btn-sm ${c.active ? "btn-success" : "btn-outline"}`} onClick={() => toggleActive(c.id)} style={{ minWidth: 70 }}>
                        {c.active ? "✓ ON" : "OFF"}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => moveUp(c.id)} disabled={idx === 0}>↑</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => moveDown(c.id)} disabled={idx === filtered.length - 1}>↓</button>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                        <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => setDeleteConfirm(c)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.mode === "create" ? (lang === "fr" ? "Nouvelle catégorie" : "New category") : (lang === "fr" ? "Modifier la catégorie" : "Edit category")}</h3>
              <button className="modal-close" onClick={() => setModal(null)}><XIcon size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">{lang === "fr" ? "Nom" : "Name"}</label>
                <input className="form-input" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Ex: Mode, Plats, Médicaments..." />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" value={formType} onChange={e => setFormType(e.target.value)}>
                  {TYPES.map(tp => <option key={tp.value} value={tp.value}>{tp.label}</option>)}

                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{lang === "fr" ? "Icône" : "Icon"}</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ICON_OPTIONS.map(ic => (
                    <button key={ic.name} onClick={() => setFormIcon(ic.name)} style={{
                      width: 40, height: 40, borderRadius: 10, border: formIcon === ic.name ? "2px solid var(--primary)" : "1px solid var(--border)",
                      background: formIcon === ic.name ? "var(--primary-light)" : "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)",
                    }}>{ic.component}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={saveCategory} disabled={!formName.trim()}>{t("save")}</button>
              <button className="btn btn-outline" onClick={() => setModal(null)}>{t("cancel")}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteConfirm}
        title={lang === "fr" ? "Supprimer cette catégorie ?" : "Delete this category?"}
        message={`${deleteConfirm?.name} (${deleteConfirm?.articles} articles)`}
        confirmText={t("delete")}
        danger
        onConfirm={() => deleteCategory(deleteConfirm?.id)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
