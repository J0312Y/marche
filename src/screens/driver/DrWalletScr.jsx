import { useState } from "react";
import { useLoad } from "../../hooks";
import Icon from "../../components/Icon";
import driver from "../../services/driverService";

const fmt = (n) => Math.round(n || 0).toLocaleString("fr-FR") + " F";
const fmtDate = (d) => { if (!d) return ""; const t = new Date(String(d).replace(" ", "T")); return isNaN(t) ? "" : t.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }); };

/**
 * Gains du livreur — données réelles :
 *  - gains par période (API /driver/stats)
 *  - solde et mouvements du portefeuille (API /driver/wallet)
 *  - dernières courses livrées (API /driver/deliveries/history)
 */
function DrWalletScr({ go, onBack }) {
  const [period, setPeriod] = useState("week");
  const { data: walletData, loading, error } = useLoad(() => driver.getWallet());
  const { data: statsData } = useLoad(() => driver.getStats(period), [period]);
  const { data: historyData } = useLoad(() => driver.getHistory());

  const balance = parseFloat(walletData?.wallet?.balance) || 0;
  const transactions = walletData?.transactions || [];
  const earned = parseFloat(statsData?.stats?.total_earned) || 0;
  const count = parseInt(statsData?.stats?.total_deliveries) || 0;
  const history = (Array.isArray(historyData) ? historyData : historyData?.deliveries || []).slice(0, 5);

  return (<div className="scr" style={{ paddingBottom: 20 }}>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Mes gains</h2><div style={{ width: 38 }} /></div>

    <div style={{ padding: "0 16px" }}>
      {error && <div className="info-box yellow" style={{ marginBottom: 12 }}><span><Icon name="info" size={16} /></span><span style={{ fontSize: 12 }}>{error}</span></div>}

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[["today", "Aujourd'hui"], ["week", "Semaine"], ["month", "Mois"]].map(([k, l]) =>
          <button key={k} onClick={() => setPeriod(k)} style={{ flex: 1, padding: 9, borderRadius: 10, border: period === k ? "2px solid #F97316" : "1px solid var(--border)", background: period === k ? "rgba(249,115,22,0.06)" : "var(--card)", color: period === k ? "#F97316" : "var(--text)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>)}
      </div>

      <div style={{ background: "linear-gradient(135deg,#F97316,#EA580C)", borderRadius: 18, padding: 18, color: "#fff", marginBottom: 12 }}>
        <div style={{ fontSize: 11, opacity: .85 }}>Gains sur la période</div>
        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>{fmt(earned)}</div>
        <div style={{ fontSize: 12, opacity: .9, marginTop: 4 }}>{count} course{count > 1 ? "s" : ""} livrée{count > 1 ? "s" : ""}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 12 }}>
        <div><div style={{ fontSize: 11, color: "var(--muted)" }}>Solde du portefeuille</div><div style={{ fontSize: 18, fontWeight: 800 }}>{loading ? "…" : fmt(balance)}</div></div>
        <Icon name="wallet" size={20} />
      </div>

      <div className="info-box blue" style={{ marginBottom: 14 }}><span><Icon name="info" size={16} /></span><span style={{ fontSize: 11 }}>Pour une commande payée en espèces, vous encaissez le montant auprès du client et reversez au vendeur la part qui lui revient (montant de la commande moins vos frais de livraison).</span></div>

      <div style={{ fontSize: 14, fontWeight: 700, margin: "6px 0 8px" }}>Dernières courses</div>
      {history.length === 0 && <div style={{ textAlign: "center", padding: "20px 10px", color: "var(--muted)", fontSize: 13 }}>Aucune course terminée pour l'instant.</div>}
      {history.map(h => (
        <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
          <div><div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>#{h.ref || h.order_id}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{fmtDate(h.delivered_at)}</div></div>
          <b style={{ color: "#10B981" }}>+ {fmt(h.driver_earning || h.fee)}</b>
        </div>
      ))}

      <div style={{ fontSize: 14, fontWeight: 700, margin: "18px 0 8px" }}>Mouvements du portefeuille</div>
      {transactions.length === 0 && <div style={{ textAlign: "center", padding: "20px 10px", color: "var(--muted)", fontSize: 13 }}>Aucun mouvement pour l'instant.</div>}
      {transactions.map(t => {
        const credit = t.type === "credit";
        return (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
            <div><div style={{ fontSize: 13, fontWeight: 600 }}>{t.description || (credit ? "Crédit" : "Débit")}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{fmtDate(t.created_at)}</div></div>
            <b style={{ color: credit ? "#10B981" : "#EF4444" }}>{credit ? "+" : "−"} {fmt(t.amount)}</b>
          </div>
        );
      })}
    </div>
  </div>);
}

export default DrWalletScr;
