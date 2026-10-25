import { useState, useMemo } from "react";
import { Gem, BarChart3, Wallet, Clock, TrendingDown, X as XIcon, Check, Eye, Download } from "lucide-react";
import { useI18n } from "../i18n";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { ADMIN_STATS as S, REVENUE_CHART, TRANSACTIONS, fmtCFA, fmt } from "../data";
import { useToast, ConfirmModal, Pagination, SearchBar, StatusBadge, DateRangePicker, ExportButtons } from "../components/UI";

const PAYMENT_BREAKDOWN = [
  { name: "Airtel Money", value: 18500000, color: "#EF4444" },
  { name: "MTN MoMo", value: 14200000, color: "#F59E0B" },
  { name: "Orange Money", value: 10800000, color: "#F97316" },
  { name: "Kolo Wallet", value: 5000000, color: "#6366F1" },
];

const SUBSCRIPTIONS = [
  { vendor: "Grill Master", plan: "pro", amount: 15000, method: "Airtel", date: "2026-02-28", nextDate: "2026-03-28", status: "active" },
  { vendor: "Mode Afrique", plan: "pro", amount: 15000, method: "MTN", date: "2026-02-25", nextDate: "2026-03-25", status: "active" },
  { vendor: "Supermarché Central", plan: "enterprise", amount: 50000, method: "Orange", date: "2026-02-20", nextDate: "2026-03-20", status: "active" },
  { vendor: "TechZone Congo", plan: "pro", amount: 15000, method: "Airtel", date: "2026-02-15", nextDate: "2026-03-15", status: "active" },
  { vendor: "Pharma Santé", plan: "starter", amount: 0, method: "—", date: "2026-01-10", nextDate: "—", status: "active" },
];

const PER_PAGE = 6;

export default function FinancePage() {
  const { t, lang } = useI18n();
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [approveConfirm, setApproveConfirm] = useState(null);
  const [view, setView] = useState("transactions"); // transactions | subscriptions

  const filtered = useMemo(() => {
    let list = tab === "all" ? transactions : transactions.filter(tx => tx.type === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(tx => tx.vendor.toLowerCase().includes(q) || tx.type.includes(q) || tx.method.toLowerCase().includes(q));
    }
    return list;
  }, [transactions, tab, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const approveWithdrawal = (id) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: "completed" } : tx));
    toast.success(lang === "fr" ? "Retrait approuvé" : "Withdrawal approved");
    setApproveConfirm(null);
  };

  const exportData = filtered.map(tx => ({ vendor: tx.vendor, type: tx.type, amount: tx.amount, method: tx.method, status: tx.status, date: tx.date }));
  const totalPending = transactions.filter(tx => tx.status === "pending").reduce((s, tx) => s + tx.amount, 0);

  return (
    <div className="fade-in">
      <h1 className="page-title">{t("finance")}</h1>
      <p className="page-subtitle">{transactions.filter(tx => tx.status === "pending").length} {lang === "fr" ? "retraits en attente" : "pending withdrawals"}</p>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[[<Gem size={18} />, fmtCFA(S.totalRevenue * 3.8), "GMV", "+18.5%"],
          [<BarChart3 size={18} />, fmtCFA(Math.round(S.totalRevenue * 0.38)), lang === "fr" ? "Frais plateforme (10%)" : "Platform fees (10%)", "+15.2%"],
          [<Wallet size={18} />, fmtCFA(Math.round(S.totalRevenue * 0.25)), lang === "fr" ? "Revenu net" : "Net revenue", "+22.1%"],
          [<Clock size={18} />, fmtCFA(totalPending), lang === "fr" ? "Retraits en attente" : "Pending payouts", ""]
        ].map(([ic, val, lab, trend], i) => (
          <div key={i} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ display: "flex", alignItems: "center" }}>{ic}</span>
              {trend && <span className="badge badge-success" style={{ fontSize: 11 }}>{trend}</span>}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>{val}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>{lab}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">{lang === "fr" ? "Revenus mensuels" : "Monthly Revenue"}</span></div>
          <div className="card-body"><div className="chart-wrapper">
            <ResponsiveContainer><AreaChart data={REVENUE_CHART}><defs><linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366F1" stopOpacity={.15} /><stop offset="95%" stopColor="#6366F1" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" /><XAxis dataKey="name" tick={{ fontSize: 11, fill: "#908C82" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: "#908C82" }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1e6).toFixed(1) + "M"} /><Tooltip formatter={v => fmtCFA(v)} contentStyle={{ borderRadius: 10, border: "1px solid #E8E6E1", fontSize: 12 }} /><Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#gR)" /></AreaChart></ResponsiveContainer>
          </div></div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">{lang === "fr" ? "Répartition paiements" : "Payment Breakdown"}</span></div>
          <div className="card-body"><div className="chart-wrapper">
            <ResponsiveContainer><PieChart><Pie data={PAYMENT_BREAKDOWN} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" labelLine={false}>
              {PAYMENT_BREAKDOWN.map((p, i) => <Cell key={i} fill={p.color} />)}
            </Pie><Legend wrapperStyle={{ fontSize: 11 }} formatter={(value) => value} /><Tooltip formatter={v => fmtCFA(v)} contentStyle={{ borderRadius: 10, border: "1px solid #E8E6E1", fontSize: 12 }} /></PieChart></ResponsiveContainer>
          </div></div>
        </div>
      </div>

      {/* View toggle */}
      <div className="tab-bar" style={{ marginBottom: 16 }}>
        <button className={`tab-btn ${view === "transactions" ? "active" : ""}`} onClick={() => setView("transactions")}>
          {lang === "fr" ? "Transactions" : "Transactions"}
        </button>
        <button className={`tab-btn ${view === "subscriptions" ? "active" : ""}`} onClick={() => setView("subscriptions")}>
          {lang === "fr" ? "Abonnements" : "Subscriptions"} ({SUBSCRIPTIONS.length})
        </button>
      </div>

      {view === "transactions" && (<>
        <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder={lang === "fr" ? "Rechercher vendeur, méthode..." : "Search vendor, method..."}>
          <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
          <div className="tab-bar" style={{ marginBottom: 0 }}>
            {[
              ["all", t("all")],
              ["commission", <span style={{ display: "flex", alignItems: "center", gap: 4 }}><BarChart3 size={14} />{lang === "fr" ? "Commission" : "Commission"}</span>],
              ["subscription", <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Gem size={14} />{lang === "fr" ? "Abonnement" : "Subscription"}</span>],
              ["withdrawal", <span style={{ display: "flex", alignItems: "center", gap: 4 }}><TrendingDown size={14} />{lang === "fr" ? "Retrait" : "Withdrawal"}</span>],
            ].map(([k, l]) => (
              <button key={k} className={`tab-btn ${tab === k ? "active" : ""}`} onClick={() => { setTab(k); setPage(1); }}>{l}</button>
            ))}
          </div>
          <ExportButtons data={exportData} filename="transactions-lamuka" columns={["vendor", "type", "amount", "method", "status", "date"]} lang={lang} />
        </SearchBar>

        <div className="card">
          <div className="data-table-wrapper"><table className="data-table"><thead><tr>
            <th>Type</th><th>{lang === "fr" ? "Commerçant" : "Vendor"}</th><th>{lang === "fr" ? "Montant" : "Amount"}</th>
            <th>{lang === "fr" ? "Méthode" : "Method"}</th><th>Date</th><th>{lang === "fr" ? "Statut" : "Status"}</th><th>Actions</th>
          </tr></thead><tbody>
            {paginated.map(tx => (
              <tr key={tx.id}>
                <td><span className={`badge ${tx.type === "commission" ? "badge-info" : tx.type === "subscription" ? "badge-primary" : "badge-warning"}`}>{tx.type}</span></td>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{tx.vendor}</td>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 13, color: tx.type === "withdrawal" ? "var(--danger)" : "var(--success)" }}>
                  {tx.type === "withdrawal" ? "-" : "+"}{fmtCFA(tx.amount)}
                </td>
                <td style={{ fontSize: 12 }}>{tx.method}</td>
                <td style={{ fontSize: 12, color: "var(--text-3)" }}>{tx.date}</td>
                <td><StatusBadge status={tx.status} /></td>
                <td>
                  {tx.type === "withdrawal" && tx.status === "pending" && (
                    <button className="btn btn-sm btn-success" onClick={() => setApproveConfirm(tx)}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Check size={14} />{t("approve")}</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody></table></div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />
        </div>
      </>)}

      {view === "subscriptions" && (
        <div className="card">
          <div className="card-header"><span className="card-title">{lang === "fr" ? "Abonnements actifs" : "Active Subscriptions"}</span></div>
          <div className="data-table-wrapper"><table className="data-table"><thead><tr>
            <th>{lang === "fr" ? "Commerçant" : "Vendor"}</th><th>Plan</th><th>{lang === "fr" ? "Montant" : "Amount"}</th>
            <th>{lang === "fr" ? "Méthode" : "Method"}</th><th>{lang === "fr" ? "Prochain" : "Next"}</th><th>{lang === "fr" ? "Statut" : "Status"}</th>
          </tr></thead><tbody>
            {SUBSCRIPTIONS.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{s.vendor}</td>
                <td><StatusBadge status={s.plan} /></td>
                <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{s.amount > 0 ? fmtCFA(s.amount) + "/mo" : "Gratuit"}</td>
                <td>{s.method}</td>
                <td style={{ fontSize: 12, color: "var(--text-3)" }}>{s.nextDate}</td>
                <td><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      <ConfirmModal open={!!approveConfirm} title={lang === "fr" ? "Approuver ce retrait ?" : "Approve withdrawal?"}
        message={approveConfirm ? `${approveConfirm.vendor} — ${fmtCFA(approveConfirm.amount)} via ${approveConfirm.method}` : ""}
        confirmText={lang === "fr" ? "Approuver" : "Approve"}
        confirmIcon={<Check size={14} />}
        onConfirm={() => approveWithdrawal(approveConfirm.id)}
        onCancel={() => setApproveConfirm(null)} />
    </div>
  );
}
