import { useState } from "react";
import { useI18n } from "../i18n";
import { fmtCFA, fmt } from "../data";
import { StatusBadge, Breadcrumbs } from "../components/UI";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Wallet, Package, Star, Calendar, Pause, Play, ArrowLeft, Check, X as XIcon } from "lucide-react";

const REVENUE_DATA = [{ m: "Sep", r: 80000 }, { m: "Oct", r: 120000 }, { m: "Nov", r: 180000 }, { m: "Déc", r: 150000 }, { m: "Jan", r: 220000 }, { m: "Fév", r: 280000 }];
const ARTICLES = [
  { id: 1, name: "Robe Wax Moderne", price: 25000, stock: 12, sold: 89, rating: 4.7, active: true },
  { id: 2, name: "Sac Cuir Tressé", price: 42000, stock: 5, sold: 34, rating: 4.5, active: true },
  { id: 3, name: "Boucles Perles", price: 8000, stock: 0, sold: 156, rating: 4.8, active: false },
  { id: 4, name: "Sandales Ankara", price: 18000, stock: 22, sold: 67, rating: 4.3, active: true },
];
const ORDERS = [
  { ref: "#LMK-0912", client: "Celine Nzaba", total: 92000, status: "delivered", date: "28 Fév" },
  { ref: "#LMK-0888", client: "Patrick Okamba", total: 42000, status: "shipped", date: "27 Fév" },
  { ref: "#LMK-0856", client: "Marie Kongo", total: 25000, status: "delivered", date: "26 Fév" },
  { ref: "#LMK-0834", client: "Jean Batchi", total: 18000, status: "delivered", date: "25 Fév" },
];
const REVIEWS = [
  { user: "Celine N.", rating: 5, text: "Superbe qualité, livraison rapide !", date: "28 Fév" },
  { user: "Patrick O.", rating: 4, text: "Bon produit mais emballage moyen", date: "27 Fév" },
  { user: "Aminata D.", rating: 5, text: "J'adore, je recommande !", date: "25 Fév" },
];

export default function VendorDetailPage({ vendor, onBack, onNavigate }) {
  const { lang } = useI18n();
  const [tab, setTab] = useState("overview");

  if (!vendor) return null;

  return (
    <div className="fade-in">
      <Breadcrumbs items={[
        { label: lang === "fr" ? "Commerçants" : "Vendors", page: "vendors" },
        { label: vendor.name }
      ]} onNavigate={onNavigate} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 20 }}>
            {vendor.name?.[0]}
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>{vendor.name}</h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <StatusBadge status={vendor.status} />
              <StatusBadge status={vendor.plan} />
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>{vendor.owner}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {vendor.status === "active"
            ? <button className="btn btn-outline" style={{ color: "var(--danger)" }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Pause size={14} />{lang === "fr" ? "Suspendre" : "Suspend"}</span></button>
            : <button className="btn btn-success"><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Play size={14} />{lang === "fr" ? "Réactiver" : "Reactivate"}</span></button>}
          <button className="btn btn-outline" onClick={onBack}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><ArrowLeft size={14} />{lang === "fr" ? "Retour" : "Back"}</span></button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[[<Wallet size={20} />, fmtCFA(vendor.revenue || 850000), lang === "fr" ? "Revenus totaux" : "Total Revenue"],
          [<Package size={20} />, String(vendor.orders || 234), lang === "fr" ? "Commandes" : "Orders"],
          [<Star size={20} />, String(vendor.rating || 4.7), "Rating"],
          [<Calendar size={20} />, vendor.date || "2025-11-10", lang === "fr" ? "Inscrit le" : "Since"]
        ].map(([ic, v, l], i) => (
          <div key={i} className="stat-card" style={{ padding: 16 }}>
            <span style={{ display: "flex", alignItems: "center" }}>{ic}</span>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{v}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        {[["overview", lang === "fr" ? "Aperçu" : "Overview"], ["articles", "Articles"], ["orders", lang === "fr" ? "Commandes" : "Orders"], ["reviews", lang === "fr" ? "Avis" : "Reviews"], ["docs", "Documents"]].map(([k, l]) => (
          <button key={k} className={`tab-btn ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><span className="card-title">{lang === "fr" ? "Revenus mensuels" : "Monthly Revenue"}</span></div>
            <div className="card-body"><div className="chart-wrapper" style={{ height: 200 }}>
              <ResponsiveContainer><AreaChart data={REVENUE_DATA}><defs><linearGradient id="gVD" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366F1" stopOpacity={.15} /><stop offset="95%" stopColor="#6366F1" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" /><XAxis dataKey="m" tick={{ fontSize: 11, fill: "#908C82" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: "#908C82" }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000) + "K"} /><Tooltip formatter={v => fmtCFA(v)} contentStyle={{ borderRadius: 10, border: "1px solid #E8E6E1", fontSize: 12 }} /><Area type="monotone" dataKey="r" stroke="#6366F1" strokeWidth={2} fill="url(#gVD)" /></AreaChart></ResponsiveContainer>
            </div></div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">{lang === "fr" ? "Informations" : "Information"}</span></div>
            <div className="card-body">
              {[
                [lang === "fr" ? "Propriétaire" : "Owner", vendor.owner],
                [lang === "fr" ? "Type" : "Type", vendor.type],
                ["Plan", vendor.plan],
                [lang === "fr" ? "Téléphone" : "Phone", "+242 06 XXX XXX"],
                ["Email", vendor.owner?.split(" ")[0]?.toLowerCase() + "@mail.com"],
                [lang === "fr" ? "Zone" : "Zone", "Bacongo, Brazzaville"],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: 12, color: "var(--text-3)" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Articles */}
      {tab === "articles" && (
        <div className="card">
          <div className="data-table-wrapper"><table className="data-table"><thead><tr><th>Article</th><th>{lang === "fr" ? "Prix" : "Price"}</th><th>Stock</th><th>{lang === "fr" ? "Vendus" : "Sold"}</th><th><Star size={14} /></th><th>{lang === "fr" ? "Actif" : "Active"}</th></tr></thead><tbody>
            {ARTICLES.map(a => (
              <tr key={a.id}><td style={{ fontWeight: 600 }}>{a.name}</td><td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{fmtCFA(a.price)}</td><td><span className={`badge ${a.stock > 0 ? "badge-success" : "badge-danger"}`}>{a.stock}</span></td><td>{a.sold}</td><td>{a.rating}</td><td><span className={`badge ${a.active ? "badge-success" : "badge-neutral"}`}>{a.active ? "✓" : "—"}</span></td></tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <div className="card">
          <div className="data-table-wrapper"><table className="data-table"><thead><tr><th>Réf</th><th>Client</th><th>Total</th><th>{lang === "fr" ? "Statut" : "Status"}</th><th>Date</th></tr></thead><tbody>
            {ORDERS.map((o, i) => (
              <tr key={i}><td style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 12 }}>{o.ref}</td><td>{o.client}</td><td style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{fmtCFA(o.total)}</td><td><StatusBadge status={o.status} /></td><td style={{ fontSize: 12, color: "var(--text-3)" }}>{o.date}</td></tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {/* Reviews */}
      {tab === "reviews" && (
        <div className="card">
          <div style={{ padding: 0 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>{r.user} <span style={{ display: "flex", alignItems: "center", gap: 1, color: "var(--warning)" }}>{Array.from({ length: r.rating }, (_, i) => <Star key={i} size={11} fill="currentColor" />)}</span></span>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>{r.date}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {tab === "docs" && (
        <div className="card">
          <div className="card-body">
            {[
              [lang === "fr" ? "Registre de commerce" : "Business License", true, "RC-BZV-2025-0456"],
              ["NIU", true, "NIU-2025-00789"],
              [lang === "fr" ? "Pièce d'identité" : "ID Card", true, "CNI-CG-XXXX"],
              [lang === "fr" ? "Photo établissement" : "Shop Photo", true, "photo_shop.jpg"],
              [lang === "fr" ? "Certificat sanitaire" : "Health Certificate", vendor.type === "restaurant", vendor.type === "restaurant" ? "CS-2025-012" : "—"],
            ].map(([name, ok, ref], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: ok ? "var(--success-light)" : "var(--danger-light)", borderRadius: 12, marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{ref}</div>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: ok ? "var(--success)" : "var(--danger)" }}>{ok ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
