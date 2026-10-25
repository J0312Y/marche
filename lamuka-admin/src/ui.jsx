/** Briques d'interface du panneau d'administration + petits utilitaires. */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import api from "./api";

// ── Formats ──
export const fmt = (n) => `${Math.round(Number(n) || 0).toLocaleString("fr-FR").replace(/ | /g, " ")} F`;
export const num = (n) => (Number(n) || 0).toLocaleString("fr-FR").replace(/ | /g, " ");
export const dt = (s, withTime = true) => {
  if (!s) return "—";
  const d = new Date(String(s).replace(" ", "T"));
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", ...(d.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}) }) + (withTime ? " · " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "");
};
export const ago = (s) => {
  if (!s) return "—";
  const m = Math.round((Date.now() - new Date(String(s).replace(" ", "T"))) / 60000);
  if (m < 1) return "à l'instant"; if (m < 60) return `il y a ${m} min`;
  const h = Math.round(m / 60); if (h < 24) return `il y a ${h} h`;
  return dt(s, false);
};
export const fullName = (a, b) => [a, b].filter(Boolean).join(" ") || "—";
export const phone = (p) => (p ? String(p).replace(/^\+242(\d{3})(\d{3})(\d{3})$/, "+242 $1 $2 $3") : "—");

// ── Statuts ──
const TONES = {
  pending: ["En attente", "warn"], confirmed: ["Acceptée", "info"], preparing: ["En préparation", "info"], ready: ["Prête", "info"],
  assigned: ["Livreur assigné", "info"], pickup_arrived: ["Au commerce", "info"], picked_up: ["En livraison", "acc"], delivering: ["En livraison", "acc"],
  delivered: ["Livrée", "ok"], cancelled: ["Annulée", "bad"], refunded: ["Remboursée", "mut"],
  active: ["Actif", "ok"], suspended: ["Suspendu", "bad"], rejected: ["Refusé", "bad"], banned: ["Banni", "bad"], inactive: ["Inactif", "mut"],
  paid: ["Payée", "ok"], failed: ["Échec", "bad"],
};
export function Badge({ s, children, tone }) {
  const [label, t] = TONES[s] || [s || "—", "mut"];
  return <span className={"badge " + (tone || t)}>{children || label}</span>;
}

// ── Notifications à l'écran ──
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((msg, type = "ok") => {
    const id = Math.random();
    setItems((x) => [...x, { id, msg, type }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 3200);
  }, []);
  return <ToastCtx.Provider value={push}>{children}<div className="toasts">{items.map((i) => <div key={i.id} className={"toast " + i.type}>{i.msg}</div>)}</div></ToastCtx.Provider>;
}

// ── Chargement de données ──
export function useLoad(fn, deps = []) {
  const [state, set] = useState({ data: null, loading: true, error: null });
  const seq = useRef(0); // seule la réponse de la dernière requête compte (recherche tapée vite, démontage)
  const load = useCallback(async () => {
    const n = ++seq.current;
    set((s) => ({ ...s, loading: true, error: null }));
    try { const d = await fn(); if (n === seq.current) set({ data: d, loading: false, error: null }); }
    catch (e) { if (n === seq.current) set({ data: null, loading: false, error: e.message }); }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load(); return () => { seq.current++; }; }, [load]);
  return { ...state, reload: load };
}

/** Liste paginée d'une route admin : { rows, total, page, setPage, loading, reload } */
export function usePaged(path, key, params = {}, limit = 25) {
  const [page, setPage] = useState(1);
  const pk = JSON.stringify(params);
  useEffect(() => { setPage(1); }, [pk]);
  const r = useLoad(() => api.get(path, { ...params, page, limit }), [path, pk, page]);
  const d = r.data || {};
  return { rows: Array.isArray(d) ? d : d[key] || [], total: Number(d.total) || 0, page, setPage, limit, loading: r.loading, error: r.error, reload: r.reload };
}

/** Exécute une action serveur avec message de réussite / d'erreur */
export function useAction() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const run = async (fn, ok) => {
    setBusy(true);
    try { const r = await fn(); if (ok) toast(ok); return r ?? true; }
    catch (e) { toast(e.message || "Action impossible", "bad"); return false; }
    finally { setBusy(false); }
  };
  return { run, busy };
}

// ── Composants ──
export const Btn = ({ kind = "pri", size, children, ...p }) => <button className={`btn ${kind}${size ? " " + size : ""}`} {...p}>{children}</button>;

export function PageHead({ title, sub, children }) {
  return <div className="page-head"><div><h1>{title}</h1>{sub && <p>{sub}</p>}</div><div className="page-actions">{children}</div></div>;
}

export function Stat({ label, value, sub, icon: Ic, tone }) {
  return (
    <div className={"stat" + (tone ? " " + tone : "")}>
      <div className="stat-top"><span>{label}</span>{Ic && <i><Ic size={18} /></i>}</div>
      <b>{value}</b>
      {sub && <small>{sub}</small>}
    </div>
  );
}

export function Card({ title, action, children, pad = true, className = "" }) {
  return <section className={"card " + className}>{(title || action) && <header><h3>{title}</h3>{action}</header>}<div className={pad ? "card-b" : ""}>{children}</div></section>;
}

export function Toolbar({ search, onSearch, placeholder = "Rechercher…", children }) {
  const [v, setV] = useState(search || "");
  useEffect(() => { const t = setTimeout(() => onSearch?.(v.trim()), 350); return () => clearTimeout(t); }, [v]); // eslint-disable-line
  return (
    <div className="toolbar">
      {onSearch && <label className="search"><Search size={16} /><input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} /></label>}
      {children}
    </div>
  );
}

export function Tabs({ value, onChange, items }) {
  return <div className="tabs">{items.map(([k, l, n]) => <button key={k} className={value === k ? "on" : ""} onClick={() => onChange(k)}>{l}{n ? <em>{n}</em> : null}</button>)}</div>;
}

export function Table({ cols, rows, loading, error, empty = "Rien à afficher.", onRow }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{cols.map((c) => <th key={c.k} style={{ width: c.w, textAlign: c.right ? "right" : undefined }}>{c.label}</th>)}</tr></thead>
        <tbody>
          {loading && !rows.length ? <tr><td colSpan={cols.length} className="cell-info"><Loader2 className="spin" size={18} /> Chargement…</td></tr>
            : error ? <tr><td colSpan={cols.length} className="cell-info bad">{error}</td></tr>
            : !rows.length ? <tr><td colSpan={cols.length} className="cell-info">{empty}</td></tr>
            : rows.map((r, i) => <tr key={r.id ?? r.key ?? i} onClick={onRow ? () => onRow(r) : undefined} className={onRow ? "click" : ""}>{cols.map((c) => <td key={c.k} style={{ textAlign: c.right ? "right" : undefined }}>{c.render ? c.render(r) : r[c.k] ?? "—"}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

export function Pager({ page, total, limit, setPage }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (total <= limit) return total ? <div className="pager"><span>{num(total)} résultat{total > 1 ? "s" : ""}</span></div> : null;
  return (
    <div className="pager">
      <span>{num((page - 1) * limit + 1)}–{num(Math.min(total, page * limit))} sur {num(total)}</span>
      <button disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Page précédente"><ChevronLeft size={18} /></button>
      <button disabled={page >= pages} onClick={() => setPage(page + 1)} aria-label="Page suivante"><ChevronRight size={18} /></button>
    </div>
  );
}

export function Drawer({ title, onClose, children, footer }) {
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <header><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Fermer"><X size={20} /></button></header>
        <div className="drawer-b">{children}</div>
        {footer && <footer>{footer}</footer>}
      </aside>
    </div>
  );
}

export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="overlay center" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Fermer"><X size={20} /></button></header>
        <div className="modal-b">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}

/** Demande de confirmation (avec motif facultatif) */
export function Confirm({ title, text, danger, reason, confirm = "Confirmer", onCancel, onConfirm, busy }) {
  const [why, setWhy] = useState("");
  return (
    <Modal title={title} onClose={onCancel} footer={<><Btn kind="ghost" onClick={onCancel}>Annuler</Btn><Btn kind={danger ? "danger" : "pri"} disabled={busy || (reason === "required" && !why.trim())} onClick={() => onConfirm(why.trim())}>{busy ? "…" : confirm}</Btn></>}>
      <p className="muted">{text}</p>
      {reason && <label className="field"><span>Motif {reason === "required" ? "" : "(facultatif)"}</span><textarea rows={3} value={why} onChange={(e) => setWhy(e.target.value)} /></label>}
    </Modal>
  );
}

/** Choix d'une image avec aperçu (le format final est fait par le serveur) */
export function ImagePick({ label, hint, current, shape = "round", onPick, busy, onRemove }) {
  const inputRef = useRef(null);
  return (
    <div className="img-pick">
      <div className={"img-prev " + shape}>{current ? <img src={current} alt="" /> : <span>Aucune image</span>}</div>
      <div>
        <b>{label}</b>
        {hint && <p className="muted small">{hint}</p>}
        <div className="inline" style={{ marginTop: 8 }}>
          <Btn kind="ghost" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>{busy ? "Envoi…" : current ? "Remplacer" : "Choisir une image"}</Btn>
          {onRemove && <Btn kind="link" disabled={busy} onClick={onRemove}>Retirer</Btn>}
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) onPick(f); }} />
      </div>
    </div>
  );
}

export const Field =({ label, children, hint }) => <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;

export function Rows({ items }) {
  return <dl className="rows">{items.filter(Boolean).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v ?? "—"}</dd></div>)}</dl>;
}
