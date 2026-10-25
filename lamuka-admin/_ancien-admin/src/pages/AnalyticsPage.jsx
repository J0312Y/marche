import { useState } from "react";
import { Target, ShoppingCart, RefreshCw, TrendingUp } from "lucide-react";
import { useI18n } from "../i18n";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { ADMIN_STATS as S, USER_GROWTH, ORDER_CHART, COMMERCE_STATS, fmtCFA, fmt } from "../data";
import { DateRangePicker, ExportButtons } from "../components/UI";

const TOP_ARTICLES = [
  { name: "Robe Wax Moderne", vendor: "Mode Afrique", qty: 89, revenue: 2225000 },
  { name: "Poulet DG", vendor: "Chez Mama Ngudi", qty: 234, revenue: 1287000 },
  { name: "Pack Eau 6L", vendor: "Supermarché Central", qty: 456, revenue: 1596000 },
  { name: "Doliprane 500mg", vendor: "Pharma Santé", qty: 312, revenue: 936000 },
  { name: "Gâteau Chocolat", vendor: "Pâtisserie Délice", qty: 67, revenue: 1675000 },
];

const ZONE_STATS = [
  { zone: "Bacongo", orders: 312, revenue: 8500000 },
  { zone: "Poto-Poto", orders: 289, revenue: 7200000 },
  { zone: "Moungali", orders: 245, revenue: 6800000 },
  { zone: "Ouenzé", orders: 198, revenue: 5100000 },
  { zone: "Talangaï", orders: 176, revenue: 4500000 },
  { zone: "Mfilou", orders: 134, revenue: 3200000 },
  { zone: "Makélékélé", orders: 112, revenue: 2800000 },
];

const FUNNEL = [
  { step: "Visiteurs", stepEn: "Visitors", value: 12400 },
  { step: "Ajout panier", stepEn: "Add to cart", value: 3720 },
  { step: "Checkout", stepEn: "Checkout", value: 1860 },
  { step: "Paiement", stepEn: "Payment", value: 1488 },
  { step: "Commande", stepEn: "Order", value: 1340 },
];

const HOURLY = [
  { h: "6h", v: 5 }, { h: "7h", v: 12 }, { h: "8h", v: 25 }, { h: "9h", v: 38 },
  { h: "10h", v: 52 }, { h: "11h", v: 65 }, { h: "12h", v: 85 }, { h: "13h", v: 72 },
  { h: "14h", v: 58 }, { h: "15h", v: 48 }, { h: "16h", v: 55 }, { h: "17h", v: 78 },
  { h: "18h", v: 92 }, { h: "19h", v: 88 }, { h: "20h", v: 65 }, { h: "21h", v: 42 },
  { h: "22h", v: 18 }, { h: "23h", v: 8 },
];

export default function AnalyticsPage() {
  const { t, lang } = useI18n();
  const [period, setPeriod] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const convRate = S.totalOrders ? ((S.totalOrders / 12400) * 100).toFixed(1) : "3.8";

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h1 className="page-title">{t("analytics")}</h1>
          <p className="page-subtitle">KPIs & {lang === "fr" ? "tendances" : "trends"}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div className="tab-bar" style={{ marginBottom: 0 }}>
            {[["day", lang === "fr" ? "Jour" : "Day"], ["week", lang === "fr" ? "Semaine" : "Week"], ["month", lang === "fr" ? "Mois" : "Month"]].map(([k, l]) => (
              <button key={k} className={`tab-btn ${period === k ? "active" : ""}`} onClick={() => setPeriod(k)}>{l}</button>
            ))}
          </div>
          <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
          <ExportButtons data={[
            { metric: "Conversion", value: convRate + "%", trend: "+0.5%" },
            { metric: lang === "fr" ? "Panier moyen" : "Avg Basket", value: "32 500 F", trend: "+8.2%" },
            { metric: lang === "fr" ? "Rétention" : "Retention", value: "64%", trend: "+3.1%" },
            ...TOP_ARTICLES.map(a => ({ article: a.name, vendor: a.vendor, qty: a.qty, revenue: a.revenue })),
            ...ZONE_STATS.map(z => ({ zone: z.zone, orders: z.orders, revenue: z.revenue })),
          ]} filename={lang === "fr" ? "rapport-analytics-lamuka" : "analytics-report-lamuka"} lang={lang} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          [<Target size={18} />, convRate + "%", "Conversion", "+0.5%"],
          [<ShoppingCart size={18} />, fmtCFA(32500), lang === "fr" ? "Panier moyen" : "Avg Basket", "+8.2%"],
          [<RefreshCw size={18} />, "64%", lang === "fr" ? "Rétention" : "Retention", "+3.1%"],
          [<TrendingUp size={18} />, "+" + S.growthUsers + "%", lang === "fr" ? "Croissance" : "Growth", ""],
        ].map(([ic, v, l, trend], i) => (
          <div key={i} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{ic}</span>
              {trend && <span className="badge badge-success" style={{ fontSize: 11 }}>{trend}</span>}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>{v}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">{lang === "fr" ? "Croissance utilisateurs" : "User Growth"}</span></div>
          <div className="card-body"><div className="chart-wrapper">
            <ResponsiveContainer><AreaChart data={USER_GROWTH}><defs>
              <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366F1" stopOpacity={.12} /><stop offset="95%" stopColor="#6366F1" stopOpacity={0} /></linearGradient>
              <linearGradient id="gV2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={.12} /><stop offset="95%" stopColor="#F59E0B" stopOpacity={0} /></linearGradient>
            </defs><CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" /><XAxis dataKey="name" tick={{ fontSize: 11, fill: "#908C82" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: "#908C82" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E8E6E1", fontSize: 12 }} /><Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="clients" name="Clients" stroke="#6366F1" strokeWidth={2} fill="url(#gC)" />
              <Area type="monotone" dataKey="vendors" name={lang === "fr" ? "Commerçants" : "Vendors"} stroke="#F59E0B" strokeWidth={2} fill="url(#gV2)" />
              <Area type="monotone" dataKey="drivers" name={lang === "fr" ? "Livreurs" : "Drivers"} stroke="#10B981" strokeWidth={2} fill="transparent" />
            </AreaChart></ResponsiveContainer>
          </div></div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">{lang === "fr" ? "Commandes par heure" : "Orders by Hour"}</span></div>
          <div className="card-body"><div className="chart-wrapper">
            <ResponsiveContainer><BarChart data={HOURLY}><CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" /><XAxis dataKey="h" tick={{ fontSize: 10, fill: "#908C82" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: "#908C82" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} /><Bar dataKey="v" name={lang === "fr" ? "Commandes" : "Orders"} fill="#6366F1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
          </div></div>
        </div>
      </div>

      {/* Funnel + Zones */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Conversion Funnel */}
        <div className="card">
          <div className="card-header"><span className="card-title">{lang === "fr" ? "Entonnoir de conversion" : "Conversion Funnel"}</span></div>
          <div className="card-body">
            {FUNNEL.map((f, i) => {
              const pct = ((f.value / FUNNEL[0].value) * 100).toFixed(0);
              const dropoff = i > 0 ? ((1 - f.value / FUNNEL[i - 1].value) * 100).toFixed(0) : 0;
              return (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{lang === "fr" ? f.step : f.stepEn}</span>
                    <span>
                      <strong>{fmt(f.value)}</strong>
                      <span style={{ color: "var(--text-3)", marginLeft: 6 }}>({pct}%)</span>
                      {i > 0 && <span style={{ color: "var(--danger)", marginLeft: 6, fontSize: 11 }}>-{dropoff}%</span>}
                    </span>
                  </div>
                  <div style={{ height: 8, background: "var(--surface-2)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: pct + "%", background: `hsl(${240 - i * 15}, 80%, 65%)`, borderRadius: 4, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Zone stats */}
        <div className="card">
          <div className="card-header"><span className="card-title">{lang === "fr" ? "Commandes par zone" : "Orders by Zone"}</span></div>
          <div className="card-body"><div className="chart-wrapper">
            <ResponsiveContainer><BarChart data={ZONE_STATS} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" /><XAxis type="number" tick={{ fontSize: 10, fill: "#908C82" }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="zone" width={90} tick={{ fontSize: 11, fill: "#908C82" }} axisLine={false} tickLine={false} /><Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} /><Bar dataKey="orders" fill="#6366F1" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer>
          </div></div>
        </div>
      </div>

      {/* Top Articles + Commerce Types */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><span className="card-title">Top 5 {lang === "fr" ? "articles vendus" : "best sellers"}</span></div>
          <div className="data-table-wrapper"><table className="data-table"><thead><tr><th>Article</th><th>{lang === "fr" ? "Commerçant" : "Vendor"}</th><th>{lang === "fr" ? "Qté" : "Qty"}</th><th>{lang === "fr" ? "Revenus" : "Revenue"}</th></tr></thead><tbody>
            {TOP_ARTICLES.map((a, i) => (
              <tr key={i}><td style={{ fontWeight: 600, fontSize: 13 }}><span style={{ color: "var(--text-3)", marginRight: 6 }}>#{i + 1}</span>{a.name}</td><td style={{ fontSize: 12, color: "var(--text-2)" }}>{a.vendor}</td><td>{a.qty}</td><td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 12 }}>{fmtCFA(a.revenue)}</td></tr>
            ))}
          </tbody></table></div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">{lang === "fr" ? "Revenus par type" : "Revenue by Type"}</span></div>
          <div className="card-body">
            {COMMERCE_STATS.map(c => {
              const maxRev = Math.max(...COMMERCE_STATS.map(x => x.revenue));
              return (
                <div key={c.type} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                  <span style={{ fontSize: 18, width: 28 }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                      <span style={{ fontWeight: 600 }}>{c.label}</span>
                      <span style={{ fontFamily: "var(--font-mono)" }}>{fmtCFA(c.revenue)}</span>
                    </div>
                    <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: ((c.revenue / maxRev) * 100) + "%", background: "var(--primary)", borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
