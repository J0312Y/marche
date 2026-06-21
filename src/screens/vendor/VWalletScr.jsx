import { useState, useEffect } from "react";
import { fmt } from "../../utils/helpers";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";

// ═══════════════════════════════════════════════════════
//  MOCK DATA — to be replaced by backend later
// ═══════════════════════════════════════════════════════

const COMMISSION_RATE = 0.10; // 10%

const MOCK_DATA = {
  // Current month aggregates
  thisMonth: {
    grossRevenue: 1450000,
    ordersCount: 87,
    commissionRate: 0.10,
    commissionDue: 145000,
    invoiceDueDate: "2026-07-05",
    invoiceStatus: "pending", // pending | paid | overdue
    monthLabel: "Juin 2026",
  },
  today: { revenue: 84000, orders: 5 },
  thisWeek: { revenue: 320000, orders: 18 },

  // Last 8 transactions (from MoMo payments)
  recentTransactions: [
    { id: "tx1", orderRef: "#LMK-2026-0214", date: "2026-06-21 10:42", customer: "Marie K.", paymentMethod: "airtel", grossAmount: 28000, commission: 2800, driverFee: 1500, netToVendor: 23700, status: "received" },
    { id: "tx2", orderRef: "#LMK-2026-0213", date: "2026-06-21 09:18", customer: "David T.", paymentMethod: "mtn", grossAmount: 15500, commission: 1550, driverFee: 1500, netToVendor: 12450, status: "received" },
    { id: "tx3", orderRef: "#LMK-2026-0212", date: "2026-06-21 08:55", customer: "Jeanne O.", paymentMethod: "cash", grossAmount: 9000, commission: 900, driverFee: 1500, netToVendor: 6600, status: "received" },
    { id: "tx4", orderRef: "#LMK-2026-0211", date: "2026-06-20 18:34", customer: "Patrick M.", paymentMethod: "airtel", grossAmount: 42000, commission: 4200, driverFee: 2000, netToVendor: 35800, status: "received" },
    { id: "tx5", orderRef: "#LMK-2026-0210", date: "2026-06-20 16:12", customer: "Grace M.", paymentMethod: "airtel", grossAmount: 12500, commission: 1250, driverFee: 1500, netToVendor: 9750, status: "received" },
    { id: "tx6", orderRef: "#LMK-2026-0209", date: "2026-06-20 14:08", customer: "Alain M.", paymentMethod: "mtn", grossAmount: 8500, commission: 850, driverFee: 1500, netToVendor: 6150, status: "refunded" },
    { id: "tx7", orderRef: "#LMK-2026-0208", date: "2026-06-20 11:45", customer: "Cecile M.", paymentMethod: "cash", grossAmount: 19000, commission: 1900, driverFee: 1500, netToVendor: 15600, status: "received" },
    { id: "tx8", orderRef: "#LMK-2026-0207", date: "2026-06-20 09:22", customer: "Jean-Paul N.", paymentMethod: "airtel", grossAmount: 31500, commission: 3150, driverFee: 1500, netToVendor: 26850, status: "received" },
  ],

  // Past monthly invoices
  pastInvoices: [
    { id: "INV-2026-05", month: "Mai 2026", gross: 1320000, commission: 132000, status: "paid", paidAt: "2026-06-04" },
    { id: "INV-2026-04", month: "Avril 2026", gross: 1180000, commission: 118000, status: "paid", paidAt: "2026-05-03" },
    { id: "INV-2026-03", month: "Mars 2026", gross: 980000, commission: 98000, status: "paid", paidAt: "2026-04-04" },
    { id: "INV-2026-02", month: "Février 2026", gross: 750000, commission: 75000, status: "paid", paidAt: "2026-03-05" },
  ],
};

// ═══════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════

const fmtNum = (n) => Math.round(n).toLocaleString("fr-FR").replace(/,/g, " ");
const fmtDate = (iso) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long" });

function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
}

const METHOD_INFO = {
  airtel: { label: "Airtel Money", color: "#EF4444", iconBg: "rgba(239,68,68,0.1)" },
  mtn:    { label: "MTN MoMo",     color: "#F59E0B", iconBg: "rgba(245,158,11,0.1)" },
  cash:   { label: "Cash",         color: "#10B981", iconBg: "rgba(16,185,129,0.1)" },
};

// ═══════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════

function VWalletScr({ go, onBack }) {
  const [tab, setTab] = useState("transactions");
  const [payingCommission, setPayingCommission] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const data = MOCK_DATA;
  const { thisMonth, today, thisWeek, recentTransactions, pastInvoices } = data;

  // Calculate days until invoice due
  const dueDays = daysUntil(thisMonth.invoiceDueDate);
  const isOverdue = dueDays < 0;
  const isUrgent = dueDays <= 3 && dueDays >= 0;

  // Net revenue (already received via MoMo)
  const netReceived = thisMonth.grossRevenue - thisMonth.commissionDue;

  const handlePayCommission = () => {
    if (!selectedMethod) {
      toast.error("Choisissez un moyen de paiement");
      return;
    }
    setPayingCommission(true);
    setTimeout(() => {
      setPayingCommission(false);
      setPaymentDone(true);
      setTimeout(() => {
        setShowPayModal(false);
        setPaymentDone(false);
        toast.success(`Commission de ${fmtNum(thisMonth.commissionDue)} F payée à Lamuka`);
      }, 1200);
    }, 1300);
  };

  return (
    <div className="scr" style={{ background: "#F9FAFB", paddingBottom: 24 }}>
      
      {/* ═══ HEADER ═══ */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#fff",
        borderBottom: "0.5px solid var(--border)",
        padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={() => onBack && onBack()} style={{
          width: 36, height: 36, borderRadius: 10,
          border: "1px solid var(--border)", background: "var(--card)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="arrow_left" size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3, color: "var(--text)" }}>Revenus & Commissions</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{thisMonth.monthLabel}</div>
        </div>
      </div>

      <div style={{ padding: 14 }}>

        {/* ═══ HERO CARD : Revenu brut du mois ═══ */}
        <div style={{
          background: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
          borderRadius: 18, padding: 18,
          color: "#fff", marginBottom: 14,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "linear-gradient(135deg, rgba(249,115,22,0.18), transparent)" }}/>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500, letterSpacing: 0.5 }}>REVENU BRUT · {thisMonth.monthLabel.toUpperCase()}</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4, letterSpacing: -0.8 }}>
              {fmtNum(thisMonth.grossRevenue)} <span style={{ fontSize: 16, opacity: 0.7, fontWeight: 600 }}>FCFA</span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="package" size={11} color="#fff"/>
              {thisMonth.ordersCount} commandes encaissées via MoMo
            </div>

            {/* Mini breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
              <div style={{ padding: "8px 10px", background: "rgba(255,255,255,0.08)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, opacity: 0.7, fontWeight: 500 }}>NET REÇU</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{fmtNum(netReceived)} F</div>
                <div style={{ fontSize: 9, opacity: 0.65, marginTop: 1 }}>déjà dans vos MoMo</div>
              </div>
              <div style={{ padding: "8px 10px", background: "rgba(249,115,22,0.18)", borderRadius: 10, border: "1px solid rgba(249,115,22,0.3)" }}>
                <div style={{ fontSize: 9, opacity: 0.85, fontWeight: 500 }}>COMMISSION À PAYER</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2, color: "#FB923C" }}>{fmtNum(thisMonth.commissionDue)} F</div>
                <div style={{ fontSize: 9, opacity: 0.85, marginTop: 1 }}>{(thisMonth.commissionRate * 100).toFixed(0)}% du brut</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ COMMISSION DUE CARD ═══ */}
        <div style={{
          background: isOverdue ? "linear-gradient(135deg, #EF4444, #DC2626)"
                    : isUrgent ? "linear-gradient(135deg, #F59E0B, #D97706)"
                    : "linear-gradient(135deg, #F97316, #EA580C)",
          borderRadius: 16, padding: 14,
          color: "#fff", marginBottom: 14,
          boxShadow: `0 8px 22px ${isOverdue ? "rgba(239,68,68,0.3)" : "rgba(249,115,22,0.28)"}`,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: "rgba(255,255,255,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon name="document" size={18} color="#fff"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.2 }}>Facture commission</div>
                {isOverdue && <span style={{ padding: "2px 7px", background: "rgba(0,0,0,0.25)", borderRadius: 5, fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>EN RETARD</span>}
                {isUrgent && !isOverdue && <span style={{ padding: "2px 7px", background: "rgba(255,255,255,0.25)", borderRadius: 5, fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>BIENTÔT DUE</span>}
              </div>
              <div style={{ fontSize: 11, opacity: 0.9, marginBottom: 8 }}>
                {isOverdue
                  ? `En retard depuis ${Math.abs(dueDays)} jour${Math.abs(dueDays) > 1 ? "s" : ""}`
                  : `À payer avant le ${fmtDate(thisMonth.invoiceDueDate)} · dans ${dueDays} jour${dueDays > 1 ? "s" : ""}`}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{fmtNum(thisMonth.commissionDue)} <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 600 }}>FCFA</span></div>
                <button onClick={() => setShowPayModal(true)} style={{
                  padding: "8px 14px", borderRadius: 10,
                  border: "none", background: "#fff",
                  color: isOverdue ? "#DC2626" : "#EA580C",
                  fontSize: 12, fontWeight: 800,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 5,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}>
                  <Icon name="check_circle" size={13} color={isOverdue ? "#DC2626" : "#EA580C"}/>
                  Payer maintenant
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MINI STATS ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <div style={{ background: "var(--card)", borderRadius: 12, border: "0.5px solid var(--border)", padding: 12 }}>
            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 500 }}>AUJOURD'HUI</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginTop: 2 }}>{fmtNum(today.revenue)} F</div>
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{today.orders} commandes</div>
          </div>
          <div style={{ background: "var(--card)", borderRadius: 12, border: "0.5px solid var(--border)", padding: 12 }}>
            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 500 }}>CETTE SEMAINE</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginTop: 2 }}>{fmtNum(thisWeek.revenue)} F</div>
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{thisWeek.orders} commandes</div>
          </div>
        </div>

        {/* ═══ INFO BOX : Modèle de paiement ═══ */}
        <div style={{
          background: "rgba(59,130,246,0.04)",
          border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: 12, padding: 12, marginBottom: 14,
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <Icon name="info" size={14} color="#3B82F6"/>
          <div style={{ fontSize: 11, color: "#1F2937", lineHeight: 1.5, flex: 1 }}>
            <b style={{ color: "#1D4ED8" }}>Vos clients vous paient directement</b> via Mobile Money. Lamuka facture sa commission une fois par mois.
          </div>
        </div>

        {/* ═══ TABS ═══ */}
        <div style={{ display: "flex", gap: 4, background: "#F3F4F6", padding: 3, borderRadius: 10, marginBottom: 12 }}>
          {[
            { id: "transactions", label: `Transactions (${recentTransactions.length})` },
            { id: "invoices", label: `Factures (${pastInvoices.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "7px 0", borderRadius: 8, border: "none",
              background: tab === t.id ? "var(--card)" : "transparent",
              color: tab === t.id ? "var(--text)" : "var(--muted)",
              fontSize: 11, fontWeight: tab === t.id ? 700 : 600,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: tab === t.id ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ═══ TRANSACTIONS TAB ═══ */}
        {tab === "transactions" && (
          <div style={{ background: "var(--card)", borderRadius: 14, border: "0.5px solid var(--border)", overflow: "hidden" }}>
            {recentTransactions.map((tx, i) => {
              const method = METHOD_INFO[tx.paymentMethod] || METHOD_INFO.cash;
              const isRefund = tx.status === "refunded";
              return (
                <div key={tx.id} style={{
                  padding: 12,
                  borderBottom: i < recentTransactions.length - 1 ? "0.5px solid var(--border)" : "none",
                  opacity: isRefund ? 0.7 : 1,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9,
                      background: method.iconBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon name="coin" size={14} color={method.color}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: "monospace" }}>{tx.orderRef}</span>
                        {isRefund && <span style={{ padding: "1px 6px", background: "rgba(239,68,68,0.12)", color: "#DC2626", borderRadius: 4, fontSize: 9, fontWeight: 800 }}>REMBOURSÉ</span>}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1 }}>
                        {tx.customer} · {tx.date.slice(11)} · {method.label}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 14, fontWeight: 800,
                      color: isRefund ? "#DC2626" : "#10B981",
                      fontVariantNumeric: "tabular-nums",
                      textDecoration: isRefund ? "line-through" : "none",
                    }}>
                      {isRefund ? "−" : "+"}{fmtNum(tx.netToVendor)} F
                    </div>
                  </div>
                  {/* Breakdown */}
                  <div style={{ paddingLeft: 42, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>
                      <span>Brut</span>
                      <div style={{ fontWeight: 600, color: "var(--text)", marginTop: 1 }}>{fmtNum(tx.grossAmount)} F</div>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>
                      <span>− Commission</span>
                      <div style={{ fontWeight: 600, color: "#F97316", marginTop: 1 }}>{fmtNum(tx.commission)} F</div>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>
                      <span>− Livreur</span>
                      <div style={{ fontWeight: 600, color: "#3B82F6", marginTop: 1 }}>{fmtNum(tx.driverFee)} F</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ INVOICES TAB ═══ */}
        {tab === "invoices" && (
          <div style={{ background: "var(--card)", borderRadius: 14, border: "0.5px solid var(--border)", overflow: "hidden" }}>
            {pastInvoices.map((inv, i) => (
              <div key={inv.id} style={{
                padding: 14,
                borderBottom: i < pastInvoices.length - 1 ? "0.5px solid var(--border)" : "none",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "rgba(16,185,129,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon name="check_circle" size={16} color="#10B981"/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{inv.month}</div>
                    <span style={{ padding: "1px 6px", background: "rgba(16,185,129,0.1)", color: "#047857", borderRadius: 4, fontSize: 9, fontWeight: 800, letterSpacing: 0.3 }}>PAYÉE</span>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
                    CA {fmtNum(inv.gross / 1000)}K F · Payée le {fmtDate(inv.paidAt)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>
                    {fmtNum(inv.commission)} F
                  </div>
                  <button onClick={() => toast.success("Reçu téléchargé")} style={{
                    fontSize: 10, color: "#3B82F6", fontWeight: 600,
                    background: "transparent", border: "none", padding: 0, marginTop: 2,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>Voir reçu →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ PAY COMMISSION MODAL ═══ */}
      {showPayModal && (
        <div onClick={() => !payingCommission && setShowPayModal(false)} style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 200,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          animation: "fadeInFast .2s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: "100%", maxWidth: 500,
            background: "var(--card)",
            borderRadius: "20px 20px 0 0",
            padding: "16px 18px 22px",
            animation: "slideUp .25s cubic-bezier(.4,0,.2,1)",
            maxHeight: "92%", overflowY: "auto",
            boxSizing: "border-box",
          }}>
            <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

            {paymentDone ? (
              <div style={{ padding: "30px 16px", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#10B981,#059669)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}>
                  <Icon name="check" size={32} color="#fff"/>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Commission payée !</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{fmtNum(thisMonth.commissionDue)} F · {thisMonth.monthLabel}</div>
              </div>
            ) : (
              <>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 14px" }}/>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#F97316,#EA580C)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10, boxShadow: "0 6px 20px rgba(249,115,22,0.25)" }}>
                    <Icon name="document" size={24} color="#fff"/>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", letterSpacing: -0.2 }}>Payer la commission</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>Facture {thisMonth.monthLabel}</div>
                </div>

                {/* Amount */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(249,115,22,0.06), transparent)",
                  border: "1px solid rgba(249,115,22,0.2)",
                  borderRadius: 12, padding: 14, marginBottom: 14,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 0.5, fontWeight: 600 }}>MONTANT À PAYER</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#EA580C", margin: "4px 0", letterSpacing: -0.5 }}>
                    {fmtNum(thisMonth.commissionDue)} <span style={{ fontSize: 14, opacity: 0.85 }}>FCFA</span>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>
                    10% de {fmtNum(thisMonth.grossRevenue)} F · {thisMonth.ordersCount} commandes
                  </div>
                </div>

                {/* Payment method picker */}
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 6 }}>MOYEN DE PAIEMENT</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
                  {["airtel", "mtn"].map(m => {
                    const info = METHOD_INFO[m];
                    const selected = selectedMethod === m;
                    return (
                      <button key={m} onClick={() => setSelectedMethod(m)} style={{
                        padding: "12px 6px", borderRadius: 11,
                        border: selected ? `1.5px solid ${info.color}` : "1px solid var(--border)",
                        background: selected ? `${info.color}10` : "var(--card)",
                        color: selected ? info.color : "var(--text)",
                        fontSize: 11, fontWeight: selected ? 700 : 600,
                        cursor: "pointer", fontFamily: "inherit",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                      }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: info.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon name="coin" size={14} color={info.color}/>
                        </div>
                        {info.label}
                      </button>
                    );
                  })}
                </div>

                <div style={{
                  padding: "9px 11px", borderRadius: 9,
                  background: "rgba(59,130,246,0.05)",
                  border: "1px solid rgba(59,130,246,0.15)",
                  marginBottom: 14,
                  display: "flex", alignItems: "flex-start", gap: 7,
                }}>
                  <Icon name="info" size={12} color="#3B82F6"/>
                  <div style={{ fontSize: 10, color: "#1D4ED8", lineHeight: 1.5 }}>
                    Vous recevrez un SMS de validation de votre opérateur pour confirmer le paiement à Lamuka.
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => !payingCommission && setShowPayModal(false)} disabled={payingCommission} style={{
                    flex: 1, padding: "12px 0", borderRadius: 12,
                    border: "1px solid var(--border)", background: "var(--card)",
                    color: "var(--text)", fontSize: 12, fontWeight: 600,
                    cursor: payingCommission ? "not-allowed" : "pointer",
                    fontFamily: "inherit", opacity: payingCommission ? 0.5 : 1,
                  }}>Annuler</button>
                  <button
                    onClick={handlePayCommission}
                    disabled={payingCommission || !selectedMethod}
                    style={{
                      flex: 1.6, padding: "12px 0", borderRadius: 12,
                      border: "none",
                      background: (!selectedMethod || payingCommission) ? "#E5E7EB" : "linear-gradient(135deg,#F97316,#EA580C)",
                      color: (!selectedMethod || payingCommission) ? "var(--muted)" : "#fff",
                      fontSize: 12, fontWeight: 700,
                      cursor: (!selectedMethod || payingCommission) ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      boxShadow: (!selectedMethod || payingCommission) ? "none" : "0 4px 14px rgba(249,115,22,0.25)",
                    }}
                  >
                    {payingCommission ? <><div className="spinner" style={{ width: 13, height: 13 }}/>Paiement...</> : <>Payer {fmtNum(thisMonth.commissionDue)} F</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VWalletScr;
