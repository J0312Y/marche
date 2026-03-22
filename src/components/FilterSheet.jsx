import { useState } from "react";

/**
 * FilterSheet — Advanced filters bottom sheet for search
 */
function FilterSheet({ onClose, onApply, initialFilters = {} }) {
  const [priceMin, setPriceMin] = useState(initialFilters.priceMin || "");
  const [priceMax, setPriceMax] = useState(initialFilters.priceMax || "");
  const [minRating, setMinRating] = useState(initialFilters.minRating || 0);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || "popular");
  const [promoOnly, setPromoOnly] = useState(initialFilters.promoOnly || false);
  const [freeDelivery, setFreeDelivery] = useState(initialFilters.freeDelivery || false);

  const hasFilters = priceMin || priceMax || minRating > 0 || sortBy !== "popular" || promoOnly || freeDelivery;

  const reset = () => { setPriceMin(""); setPriceMax(""); setMinRating(0); setSortBy("popular"); setPromoOnly(false); setFreeDelivery(false); };

  const apply = () => {
    onApply({ priceMin: priceMin ? Number(priceMin) : null, priceMax: priceMax ? Number(priceMax) : null, minRating, sortBy, promoOnly, freeDelivery });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 150, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxHeight: "80vh", overflowY: "auto", background: "var(--card)", borderRadius: "20px 20px 0 0", padding: "12px 20px 28px", animation: "shareUp .25s ease" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 14px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Filtres</h3>
          {hasFilters && <button onClick={reset} style={{ padding: "4px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Réinitialiser</button>}
        </div>

        {/* Tri */}
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--sub)", marginBottom: 8 }}>Trier par</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {[["popular", "🔥 Populaires"], ["price_asc", "💰 Prix ↑"], ["price_desc", "💰 Prix ↓"], ["rating", "⭐ Mieux notés"], ["newest", "🆕 Récents"], ["promo", "🏷️ Promos"]].map(([k, l]) => (
            <button key={k} onClick={() => setSortBy(k)} style={{
              padding: "8px 14px", borderRadius: 10,
              border: sortBy === k ? "2px solid #F97316" : "1px solid var(--border)",
              background: sortBy === k ? "rgba(249,115,22,0.06)" : "var(--card)",
              color: sortBy === k ? "#F97316" : "var(--sub)",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{l}</button>
          ))}
        </div>

        {/* Prix */}
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--sub)", marginBottom: 8 }}>Fourchette de prix (FCFA)</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={priceMin} onChange={e => setPriceMin(e.target.value.replace(/\D/g, ""))} placeholder="Min" type="text" inputMode="numeric" style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--light)", fontSize: 14, fontFamily: "inherit", color: "var(--text)", outline: "none" }} />
          <span style={{ alignSelf: "center", color: "var(--muted)" }}>—</span>
          <input value={priceMax} onChange={e => setPriceMax(e.target.value.replace(/\D/g, ""))} placeholder="Max" type="text" inputMode="numeric" style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--light)", fontSize: 14, fontFamily: "inherit", color: "var(--text)", outline: "none" }} />
        </div>

        {/* Quick price ranges */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {[["0", "5000", "< 5 000"], ["5000", "15000", "5k - 15k"], ["15000", "50000", "15k - 50k"], ["50000", "", "50k+"]].map(([min, max, l]) => (
            <button key={l} onClick={() => { setPriceMin(min); setPriceMax(max); }} style={{
              padding: "6px 12px", borderRadius: 8,
              border: priceMin === min && priceMax === max ? "1px solid #F97316" : "1px solid var(--border)",
              background: priceMin === min && priceMax === max ? "rgba(249,115,22,0.06)" : "var(--card)",
              color: priceMin === min && priceMax === max ? "#F97316" : "var(--muted)",
              fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{l} F</button>
          ))}
        </div>

        {/* Note minimum */}
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--sub)", marginBottom: 8 }}>Note minimum</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[0, 3, 3.5, 4, 4.5].map(r => (
            <button key={r} onClick={() => setMinRating(r)} style={{
              padding: "8px 14px", borderRadius: 10,
              border: minRating === r ? "2px solid #F59E0B" : "1px solid var(--border)",
              background: minRating === r ? "rgba(245,158,11,0.06)" : "var(--card)",
              color: minRating === r ? "#F59E0B" : "var(--sub)",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{r === 0 ? "Tous" : `${r}★+`}</button>
          ))}
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {[["promoOnly", "🏷️ En promo uniquement", promoOnly, setPromoOnly], ["freeDelivery", "🚚 Livraison gratuite", freeDelivery, setFreeDelivery]].map(([k, label, val, setVal]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
              <div className={`toggle${val ? " on" : ""}`} onClick={() => setVal(!val)}><div /></div>
            </div>
          ))}
        </div>

        {/* Apply */}
        <button onClick={apply} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: "#F97316", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
}

export default FilterSheet;
