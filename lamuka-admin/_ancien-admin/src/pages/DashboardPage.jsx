import { useState } from "react";
import { Wallet, Package, Store, Users, Shield, Bike, FolderOpen, Image, ClipboardList, UtensilsCrossed, Cake, Pill, ShoppingCart, Wrench, AlertTriangle, Star, Rocket } from "lucide-react";
import { useI18n } from "../i18n";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ADMIN_STATS as S, REVENUE_CHART, ORDER_CHART, RECENT_ACTIVITY, COMMERCE_STATS, fmt, fmtCFA } from "../data";

const COMMERCE_ICONS = { boutique: <Store size={20} />, restaurant: <UtensilsCrossed size={20} />, patisserie: <Cake size={20} />, pharmacie: <Pill size={20} />, supermarche: <ShoppingCart size={20} />, service: <Wrench size={20} /> };
const ACTIVITY_ICONS = { "🏪": <Store size={18} />, "💰": <Wallet size={18} />, "📦": <Package size={18} />, "⚠️": <AlertTriangle size={18} />, "⭐": <Star size={18} />, "🚀": <Rocket size={18} /> };

export default function DashboardPage({ onNavigate }) {
  const { t, lang } = useI18n();
  const [period, setPeriod] = useState("month");

  return (
    <div className="fade-in">
      <h1 className="page-title">{t("welcome")}, Joeldy</h1>
      <p className="page-subtitle">
        {lang === "fr" ? "Voici un aperçu de Lamuka Market aujourd'hui" : "Here's an overview of Lamuka Market today"}
      </p>

      {/* ═══ KPI CARDS ═══ */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: "var(--primary-light)" }}><Wallet size={20} /></div>
            <span className="stat-trend up">+{S.growthRevenue}%</span>
          </div>
          <div className="stat-value">{fmtCFA(S.totalRevenue)}</div>
          <div className="stat-label">{t("totalRevenue")}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: "var(--success-light)" }}><Package size={20} /></div>
            <span className="stat-trend up">+{S.growthOrders}%</span>
          </div>
          <div className="stat-value">{fmt(S.totalOrders)}</div>
          <div className="stat-label">{t("totalOrders")}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: "var(--warning-light)" }}><Store size={20} /></div>
            <span className="stat-trend up">+{S.growthVendors}%</span>
          </div>
          <div className="stat-value">{S.activeVendors}</div>
          <div className="stat-label">{t("activeVendors")}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: "var(--info-light)" }}><Users size={20} /></div>
            <span className="stat-trend up">+{S.growthUsers}%</span>
          </div>
          <div className="stat-value">{fmt(S.activeUsers)}</div>
          <div className="stat-label">{t("activeUsers")}</div>
        </div>
      </div>

      {/* ═══ QUICK STATS ═══ */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderLeft: "3px solid var(--warning)" }}>
          <div className="stat-value" style={{ fontSize: 22 }}>{S.pendingApprovals}</div>
          <div className="stat-label">{t("pendingApprovals")}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: "3px solid var(--danger)" }}>
          <div className="stat-value" style={{ fontSize: 22 }}>{S.openTickets}</div>
          <div className="stat-label">{t("openTickets")}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: "3px solid var(--success)" }}>
          <div className="stat-value" style={{ fontSize: 22 }}>{S.newSignups}</div>
          <div className="stat-label">{t("newSignups")}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: "3px solid var(--info)" }}>
          <div className="stat-value" style={{ fontSize: 22 }}>{S.avgDeliveryTime} {t("min")}</div>
          <div className="stat-label">{t("avgDeliveryTime")}</div>
        </div>
      </div>

      {/* ═══ CHARTS ═══ */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">{t("revenueChart")}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["week", "month", "year"].map(p => (
                <button key={p} className={`btn btn-sm ${period === p ? "btn-primary" : "btn-ghost"}`} onClick={() => setPeriod(p)}>
                  {t(p === "week" ? "thisWeek" : p === "month" ? "thisMonth" : "thisYear")}
                </button>
              ))}
            </div>
          </div>
          <div className="card-body">
            <div className="chart-wrapper">
              <ResponsiveContainer>
                <AreaChart data={REVENUE_CHART}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#908C82" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#908C82" }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000000).toFixed(1) + "M"} />
                  <Tooltip formatter={(v) => fmtCFA(v)} contentStyle={{ borderRadius: 10, border: "1px solid #E8E6E1", fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#gRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">{lang === "fr" ? "Commandes / semaine" : "Orders / week"}</span>
          </div>
          <div className="card-body">
            <div className="chart-wrapper">
              <ResponsiveContainer>
                <BarChart data={ORDER_CHART}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#908C82" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#908C82" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E8E6E1", fontSize: 12 }} />
                  <Bar dataKey="orders" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM SECTION ═══ */}
      <div className="grid-2">
        {/* Commerce types breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">{t("byCommerce")}</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {COMMERCE_STATS.map(c => (
              <div key={c.type} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ display: "flex", alignItems: "center", color: "var(--primary)" }}>{COMMERCE_ICONS[c.type] || <Store size={20} />}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{c.count} {lang === "fr" ? "établissements" : "shops"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{fmtCFA(c.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">{t("recentActivity")}</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ display: "flex", alignItems: "center", color: "var(--text-2)" }}>{ACTIVITY_ICONS[a.icon] || <Package size={18} />}</span>
                <div style={{ flex: 1, fontSize: 13 }}>{lang === "fr" ? a.text : a.textEn}</div>
                <span style={{ fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ QUICK ACTIONS ═══ */}
      {onNavigate && (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <span className="card-title">{t("quickActions")}</span>
          </div>
          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
              {[
                [<Store size={18} />, lang === "fr" ? "Valider commerçants" : "Approve vendors", "vendors"],
                [<Package size={18} />, lang === "fr" ? "Voir commandes" : "View orders", "orders"],
                [<Wallet size={18} />, lang === "fr" ? "Retraits en attente" : "Pending withdrawals", "finance"],
                [<Shield size={18} />, lang === "fr" ? "Tickets support" : "Support tickets", "moderation"],
                [<Bike size={18} />, lang === "fr" ? "Gérer livreurs" : "Manage drivers", "drivers"],
                [<FolderOpen size={18} />, lang === "fr" ? "Catégories" : "Categories", "categories"],
                [<Image size={18} />, lang === "fr" ? "Bannières promo" : "Promo banners", "banners"],
                [<ClipboardList size={18} />, lang === "fr" ? "Journal d'activité" : "Activity log", "activityLog"],
              ].map(([icon, label, target]) => (
                <button key={target} className="btn btn-outline" style={{ justifyContent: "flex-start", padding: "12px 14px" }} onClick={() => onNavigate(target)}>
                  <span style={{ display: "flex", alignItems: "center" }}>{icon}</span> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
