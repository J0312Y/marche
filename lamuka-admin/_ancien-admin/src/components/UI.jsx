import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import {
  Check, X, AlertTriangle, Info, Search, MailOpen, Download, FileText,
  User, Camera, Trash2, Save, Lock, Paperclip, Send, ChevronLeft, ChevronRight
} from "lucide-react";

// ═══════════════════════════════════════════
// TOAST NOTIFICATION SYSTEM
// ═══════════════════════════════════════════
const ToastCtx = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);
  const stableToast = useCallback((msg, type) => addToast(msg, type), [addToast]);
  stableToast.success = (msg) => addToast(msg, "success");
  stableToast.error = (msg) => addToast(msg, "error");
  stableToast.warning = (msg) => addToast(msg, "warning");
  stableToast.info = (msg) => addToast(msg, "info");
  return (
    <ToastCtx.Provider value={stableToast}>
      {children}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, maxWidth: 380 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ padding: "12px 18px", borderRadius: 12, background: t.type === "success" ? "#10B981" : t.type === "error" ? "#EF4444" : t.type === "warning" ? "#F59E0B" : "#3B82F6", color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", animation: "toastIn 0.3s ease", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "flex", alignItems: "center" }}>{t.type === "success" ? <Check size={14} /> : t.type === "error" ? <X size={14} /> : t.type === "warning" ? <AlertTriangle size={14} /> : <Info size={14} />}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() { return useContext(ToastCtx); }

// ═══════════════════════════════════════════
// CONFIRM MODAL
// ═══════════════════════════════════════════
export function ConfirmModal({ open, title, message, confirmText = "Confirmer", cancelText = "Annuler", danger = false, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>{title}</h3><button className="modal-close" onClick={onCancel}><X size={16} /></button></div>
        <div className="modal-body"><p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{message}</p></div>
        <div className="modal-footer">
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>{confirmText}</button>
          <button className="btn btn-outline" onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PAGINATION
// ═══════════════════════════════════════════
export function Pagination({ page, totalPages, onPageChange, lang = "fr" }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "16px 0" }}>
      <button className="btn btn-sm btn-ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={14} /> {lang === "fr" ? "Préc" : "Prev"}</button>
      {start > 1 && <><button className="btn btn-sm btn-ghost" onClick={() => onPageChange(1)}>1</button>{start > 2 && <span style={{ color: "var(--text-3)", fontSize: 12 }}>…</span>}</>}
      {pages.map(p => (<button key={p} className={`btn btn-sm ${p === page ? "btn-primary" : "btn-ghost"}`} onClick={() => onPageChange(p)} style={{ minWidth: 34 }}>{p}</button>))}
      {end < totalPages && <>{end < totalPages - 1 && <span style={{ color: "var(--text-3)", fontSize: 12 }}>…</span>}<button className="btn btn-sm btn-ghost" onClick={() => onPageChange(totalPages)}>{totalPages}</button></>}
      <button className="btn btn-sm btn-ghost" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>{lang === "fr" ? "Suiv" : "Next"} <ChevronRight size={14} /></button>
    </div>
  );
}

// ═══════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════
export function EmptyState({ icon = <MailOpen size={40} />, title, subtitle }) {
  return (<div className="empty"><div className="empty-icon">{icon}</div><div className="empty-text">{title}</div>{subtitle && <div className="empty-hint">{subtitle}</div>}</div>);
}

// ═══════════════════════════════════════════
// STATUS BADGE
// ═══════════════════════════════════════════
const BADGE_MAP = {
  active: "badge-success", approved: "badge-success", completed: "badge-success", delivered: "badge-success", resolved: "badge-success", closed: "badge-success", refunded: "badge-success",
  pending: "badge-warning", preparing: "badge-warning", in_progress: "badge-warning", review: "badge-warning", processing: "badge-warning",
  suspended: "badge-danger", banned: "badge-danger", cancelled: "badge-danger", failed: "badge-danger", rejected: "badge-danger", open: "badge-danger", escalated: "badge-danger",
  new: "badge-info", shipped: "badge-info", starter: "badge-info",
  pro: "badge-primary", enterprise: "badge-warning",
};
export function StatusBadge({ status, label }) {
  return <span className={`badge ${BADGE_MAP[status] || "badge-neutral"}`}>{label || status}</span>;
}

// ═══════════════════════════════════════════
// SEARCH + FILTER BAR
// ═══════════════════════════════════════════
export function SearchBar({ value, onChange, placeholder, children }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 340 }}>
        <input className="form-input" style={{ paddingLeft: 34 }} placeholder={placeholder || "Rechercher..."} value={value} onChange={e => onChange(e.target.value)} />
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", color: "var(--text-3)" }}><Search size={14} /></span>
      </div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════
// DETAIL DRAWER (side panel)
// ═══════════════════════════════════════════
export function DetailDrawer({ open, onClose, title, width, children, footer }) {
  if (!open) return null;
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200, backdropFilter: "blur(2px)" }} onClick={onClose} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: width || "min(480px, 90vw)", background: "var(--surface)", zIndex: 201, boxShadow: "-8px 0 30px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", animation: "slideRight 0.25s ease" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>{children}</div>
        {footer && <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, justifyContent: "flex-end" }}>{footer}</div>}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════
// STAT MINI CARD
// ═══════════════════════════════════════════
export function StatMini({ icon, value, label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color || "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px" }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--text-3)" }}>{label}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// DATE RANGE PICKER
// ═══════════════════════════════════════════
export function DateRangePicker({ startDate, endDate, onStartChange, onEndChange, lang = "fr" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input type="date" className="form-input" style={{ width: 150, padding: "6px 10px", fontSize: 12 }} value={startDate} onChange={e => onStartChange(e.target.value)} />
      <span style={{ color: "var(--text-3)", fontSize: 12 }}>→</span>
      <input type="date" className="form-input" style={{ width: 150, padding: "6px 10px", fontSize: 12 }} value={endDate} onChange={e => onEndChange(e.target.value)} />
    </div>
  );
}

// ═══════════════════════════════════════════
// BULK SELECT BAR
// ═══════════════════════════════════════════
export function BulkBar({ selected, total, onSelectAll, onClear, children, lang = "fr" }) {
  if (selected === 0) return null;
  return (
    <div style={{ padding: "10px 16px", background: "var(--primary-light)", borderRadius: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", animation: "fadeIn 0.2s ease" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>
        {selected} {lang === "fr" ? "sélectionné(s)" : "selected"}
      </span>
      {selected < total && <button className="btn btn-sm btn-ghost" onClick={onSelectAll}>{lang === "fr" ? "Tout sélectionner" : "Select all"} ({total})</button>}
      <button className="btn btn-sm btn-ghost" onClick={onClear}><X size={13} style={{ marginRight: 2 }} /> {lang === "fr" ? "Annuler" : "Cancel"}</button>
      <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════
// EXPORT BUTTONS (CSV & PDF)
// ═══════════════════════════════════════════
export function ExportButtons({ data, filename = "export", columns, lang = "fr" }) {
  const exportCSV = () => {
    if (!data || !data.length) return;
    const cols = columns || Object.keys(data[0]);
    const header = cols.join(",");
    const rows = data.map(row => cols.map(c => {
      const val = String(row[c] ?? "").replace(/"/g, '""');
      return val.includes(",") ? `"${val}"` : val;
    }).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${filename}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    // Simple HTML-to-print PDF
    if (!data || !data.length) return;
    const cols = columns || Object.keys(data[0]);
    const html = `<html><head><style>body{font-family:sans-serif;font-size:12px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:6px 10px;text-align:left}th{background:#f5f5f5;font-weight:700}h1{font-size:16px;margin-bottom:10px}</style></head><body><h1>${filename}</h1><p>${new Date().toLocaleDateString(lang)}</p><table><thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${data.map(row => `<tr>${cols.map(c => `<td>${row[c] ?? ""}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.print();
  };

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button className="btn btn-sm btn-outline" onClick={exportCSV}><Download size={13} style={{ marginRight: 4 }} /> CSV</button>
      <button className="btn btn-sm btn-outline" onClick={exportPDF}><FileText size={13} style={{ marginRight: 4 }} /> PDF</button>
    </div>
  );
}

// ═══════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════
export function Skeleton({ rows = 5, cols = 4 }) {
  return (
    <div style={{ padding: 20 }}>
      {Array(rows).fill(0).map((_, r) => (
        <div key={r} style={{ display: "flex", gap: 16, marginBottom: 16, animation: "pulse 1.5s infinite" }}>
          {Array(cols).fill(0).map((_, c) => (
            <div key={c} style={{ flex: c === 0 ? 2 : 1, height: 16, borderRadius: 6, background: "var(--surface-2)" }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// BREADCRUMBS
// ═══════════════════════════════════════════
export function Breadcrumbs({ items, onNavigate }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 13 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ color: "var(--text-3)" }}>/</span>}
          {i < items.length - 1 ? (
            <button className="btn btn-ghost" style={{ padding: "2px 6px", fontSize: 13 }} onClick={() => onNavigate(item.page)}>
              {item.label}
            </button>
          ) : (
            <span style={{ fontWeight: 600, color: "var(--text)" }}>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// ADD USER MODAL
// ═══════════════════════════════════════════
export function AddUserModal({ open, onClose, onAdd, lang = "fr" }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "client", password: "" });
  if (!open) return null;
  const valid = form.name.trim() && form.email.trim() && form.phone.trim() && form.password.trim();
  const handleSubmit = () => {
    if (!valid) return;
    onAdd({ ...form, id: "u" + Date.now(), status: "active", orders: 0, lastActive: lang === "fr" ? "Maintenant" : "Now" });
    setForm({ name: "", email: "", phone: "", role: "client", password: "" });
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><User size={18} /> {lang === "fr" ? "Ajouter un utilisateur" : "Add User"}</h3><button className="modal-close" onClick={onClose}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{lang === "fr" ? "Nom complet" : "Full Name"} *</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Jean Moukala" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jean@mail.com" />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === "fr" ? "Téléphone" : "Phone"} *</label>
              <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+242 06 XXX XXX" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">{lang === "fr" ? "Rôle" : "Role"}</label>
              <select className="form-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ cursor: "pointer" }}>
                <option value="client">Client</option>
                <option value="vendor">{lang === "fr" ? "Commerçant" : "Vendor"}</option>
                <option value="driver">{lang === "fr" ? "Livreur" : "Driver"}</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{lang === "fr" ? "Mot de passe" : "Password"} *</label>
              <input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" disabled={!valid} onClick={handleSubmit}><Check size={14} style={{ marginRight: 4 }} /> {lang === "fr" ? "Créer l'utilisateur" : "Create User"}</button>
          <button className="btn btn-outline" onClick={onClose}>{lang === "fr" ? "Annuler" : "Cancel"}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ADMIN PROFILE MODAL
// ═══════════════════════════════════════════
export function AdminProfileModal({ open, onClose, profile, onSave, lang = "fr" }) {
  const [form, setForm] = useState(profile || { name: "", email: "", phone: "", role: "Super Admin", avatar: null, currentPassword: "", newPassword: "" });
  const fileRef = useRef(null);
  useEffect(() => { if (profile) setForm({ ...profile, currentPassword: "", newPassword: "" }); }, [profile]);
  if (!open) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert(lang === "fr" ? "Taille max : 2 Mo" : "Max size: 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const removePhoto = () => setForm(f => ({ ...f, avatar: null }));
  const initials = form.name?.split(" ").map(n => n[0]).join("").substring(0, 2) || "AD";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><User size={18} /> {lang === "fr" ? "Mon profil" : "My Profile"}</h3><button className="modal-close" onClick={onClose}><X size={16} /></button></div>
        <div className="modal-body">
          {/* Avatar upload */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ position: "relative" }}>
              {form.avatar ? (
                <img src={form.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: 20, objectFit: "cover", border: "3px solid var(--primary-light)" }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: 20, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 26 }}>
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                style={{ position: "absolute", bottom: -4, right: -4, width: 28, height: 28, borderRadius: 8, background: "var(--primary)", color: "#fff", border: "2px solid var(--surface)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}
                title={lang === "fr" ? "Changer la photo" : "Change photo"}
              ><Camera size={13} /></button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{form.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-3)" }}>{form.role || "Super Admin"}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <button className="btn btn-sm btn-outline" onClick={() => fileRef.current?.click()}>
                  <Camera size={13} style={{ marginRight: 4 }} /> {lang === "fr" ? "Changer photo" : "Change photo"}
                </button>
                {form.avatar && (
                  <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={removePhoto}>
                    <Trash2 size={13} style={{ marginRight: 4 }} /> {lang === "fr" ? "Supprimer" : "Remove"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">{lang === "fr" ? "Nom complet" : "Full Name"}</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === "fr" ? "Téléphone" : "Phone"}</label>
              <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">{lang === "fr" ? "Rôle / Titre" : "Role / Title"}</label>
              <input className="form-input" value={form.role || ""} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Super Admin" />
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "20px 0" }} />
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Lock size={15} /> {lang === "fr" ? "Changer le mot de passe" : "Change Password"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">{lang === "fr" ? "Mot de passe actuel" : "Current Password"}</label>
              <input className="form-input" type="password" value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === "fr" ? "Nouveau mot de passe" : "New Password"}</label>
              <input className="form-input" type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} placeholder="••••••••" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={() => { onSave(form); onClose(); }}><Save size={14} style={{ marginRight: 4 }} /> {lang === "fr" ? "Enregistrer" : "Save"}</button>
          <button className="btn btn-outline" onClick={onClose}>{lang === "fr" ? "Annuler" : "Cancel"}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SUPPORT THREAD (Chat-like)
// ═══════════════════════════════════════════
export function SupportThread({ messages, onSend, lang = "fr" }) {
  const [text, setText] = useState("");
  const fileRef = useRef(null);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert(lang === "fr" ? "Taille max : 5 Mo" : "Max size: 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const isImage = file.type.startsWith("image/");
      onSend(isImage ? `[IMAGE] ${file.name}` : `[DOCUMENT] ${file.name}`, {
        type: isImage ? "image" : "document", name: file.name, size: (file.size / 1024).toFixed(0) + " KB",
        data: isImage ? reader.result : null,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "admin" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            <div style={{
              maxWidth: "75%", padding: "10px 14px", borderRadius: 14,
              background: m.from === "admin" ? "var(--primary)" : "var(--surface-2)",
              color: m.from === "admin" ? "#fff" : "var(--text)",
              borderBottomRightRadius: m.from === "admin" ? 4 : 14,
              borderBottomLeftRadius: m.from === "admin" ? 14 : 4,
            }}>
              {/* Attachment */}
              {m.attachment && m.attachment.type === "image" && m.attachment.data && (
                <img src={m.attachment.data} alt={m.attachment.name} style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 6 }} />
              )}
              {m.attachment && m.attachment.type === "document" && (
                <div style={{ padding: "8px 12px", background: "rgba(0,0,0,0.1)", borderRadius: 8, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "flex", alignItems: "center" }}><Paperclip size={18} /></span>
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{m.attachment.name}</div><div style={{ fontSize: 10, opacity: 0.7 }}>{m.attachment.size}</div></div>
                </div>
              )}
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: m.from === "admin" ? "right" : "left" }}>
                {m.from === "admin" ? "Vous" : m.sender} · {m.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
        <button className="btn btn-sm btn-ghost" onClick={() => fileRef.current?.click()} title={lang === "fr" ? "Joindre un fichier" : "Attach file"}>
          <Paperclip size={16} />
        </button>
        <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{ display: "none" }} onChange={handleFileUpload} />
        <input className="form-input" style={{ flex: 1 }} value={text} onChange={e => setText(e.target.value)}
          placeholder={lang === "fr" ? "Tapez votre réponse..." : "Type your reply..."}
          onKeyDown={e => { if (e.key === "Enter" && text.trim()) { onSend(text); setText(""); } }}
        />
        <button className="btn btn-primary" disabled={!text.trim()} onClick={() => { onSend(text); setText(""); }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// DOCUMENT VIEWER MODAL
// ═══════════════════════════════════════════
export function DocumentViewer({ open, onClose, doc, lang = "fr" }) {
  if (!open || !doc) return null;
  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 300 }}>
      <div className="modal" style={{ maxWidth: 720, maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><FileText size={18} /> {doc.name || "Document"}</h3>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body" style={{ padding: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {doc.file ? (
            <img src={doc.file} alt={doc.name} style={{ width: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: 0 }} />
          ) : (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}>
              <div style={{ marginBottom: 12, color: "var(--text-3)" }}><FileText size={48} /></div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{lang === "fr" ? "Document non soumis" : "Document not submitted"}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>{lang === "fr" ? "Ce document n'a pas encore été téléversé par l'utilisateur." : "This document has not been uploaded yet."}</div>
            </div>
          )}
        </div>
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-3)" }}>
          <div>{doc.size} · {doc.date}</div>
          <button className="btn btn-outline" onClick={onClose}>{lang === "fr" ? "Fermer" : "Close"}</button>
        </div>
      </div>
    </div>
  );
}
