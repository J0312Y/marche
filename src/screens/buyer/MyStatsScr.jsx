import { useState } from "react";

const fmt = (n) => n?.toLocaleString("fr-FR") + " FCFA";

function MyStatsScr({ onBack }) {
  const stats = {
    totalSpent: 345000, orders: 12, avgBasket: 28750,
    since: "Janvier 2025", favCategory: "Mode", favVendor: "Mode Afrique",
    savedWithPromos: 42000, loyaltyPoints: 1250,
    monthlySpending: [12000, 28000, 45000, 32000, 18000, 56000, 67000, 42000, 38000, 0, 0, 0],
    topCategories: [
      { name: "👗 Mode", amount: 145000, pct: 42 },
      { name: "🍽️ Restaurants", amount: 89000, pct: 26 },
      { name: "📱 Électronique", amount: 67000, pct: 19 },
      { name: "💊 Pharmacie", amount: 44000, pct: 13 },
    ],
  };
  const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  const max = Math.max(...stats.monthlySpending);

  return (
    <div className="scr" style={{ padding: 16, paddingBottom: 20 }}>
      <div className="appbar"><button onClick={onBack}>←</button><h2>Mes statistiques</h2><div style={{ width: 38 }} /></div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: 20, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#F97316" }}>{fmt(stats.totalSpent)}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>dépensés depuis {stats.since}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
          {[["📦", stats.orders, "Commandes"], ["🧺", fmt(stats.avgBasket), "Panier moy."], ["⭐", stats.loyaltyPoints, "Points"]].map(([ic, v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16 }}>{ic}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{v}</div>
              <div style={{ fontSize: 9, color: "var(--muted)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly chart */}
      <div style={{ padding: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📈 Dépenses mensuelles</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 80 }}>
          {stats.monthlySpending.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: "100%", height: max > 0 ? `${(v / max) * 100}%` : 0, background: v > 0 ? "linear-gradient(180deg,#F97316,rgba(249,115,22,0.2))" : "var(--border)", borderRadius: "3px 3px 0 0", minHeight: v > 0 ? 4 : 2 }} />
              <span style={{ fontSize: 7, color: "var(--muted)" }}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top categories */}
      <div style={{ padding: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🏷️ Catégories préférées</div>
        {stats.topCategories.map((cat, i) => (
          <div key={cat.name} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{cat.name}</span>
              <span style={{ color: "var(--muted)" }}>{fmt(cat.amount)} · {cat.pct}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "var(--light)" }}>
              <div style={{ width: `${cat.pct}%`, height: "100%", borderRadius: 3, background: i === 0 ? "#F97316" : i === 1 ? "#F59E0B" : i === 2 ? "#10B981" : "var(--muted)", transition: "width .5s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Fun facts */}
      <div style={{ padding: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>🎉 En bref</div>
        {[
          ["🏪", "Vendeur préféré", stats.favVendor],
          ["💰", "Économisé avec les promos", fmt(stats.savedWithPromos)],
          ["📅", "Membre depuis", stats.since],
          ["🛍️", "Catégorie #1", stats.favCategory],
        ].map(([ic, l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
            <span style={{ color: "var(--muted)" }}>{ic} {l}</span>
            <b>{v}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyStatsScr;
