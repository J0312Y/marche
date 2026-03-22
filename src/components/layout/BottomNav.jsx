/**
 * BottomNav - Barre de navigation inférieure avec FAB panier
 * @param {Array} tabs - [{icon, label}]
 * @param {number} activeTab - Index actif
 * @param {function} onTab - Callback(index)
 * @param {string} mode - "buyer" | "vendor" | "driver"
 */
function BottomNav({ tabs, activeTab, onTab, mode = "buyer" }) {
  return (
    <div className="bnav">
      {tabs.map((t, i) => {
        const isCart = mode === "buyer" && i === 2;
        const isActive = activeTab === i;
        if (isCart) return (
          <button key={i} onClick={() => onTab(i)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit",
            marginTop: -28, position: "relative", zIndex: 10
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: isActive ? "linear-gradient(135deg,#F97316,#EA580C)" : "linear-gradient(135deg,#F97316,#FDBA74)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              boxShadow: isActive ? "0 6px 20px rgba(249,115,22,.45)" : "0 4px 14px rgba(249,115,22,.3)",
              border: "4px solid #fff", transition: "all .2s"
            }}>🛍️</div>
            <span style={{ fontSize: 9, fontWeight: 600, color: isActive ? "#F97316" : "var(--muted)", marginTop: 1 }}>
              {isActive && t.label}
            </span>
          </button>
        );
        return (
          <button key={i} className={`bni ${isActive ? "on" : ""}`} onClick={() => onTab(i)}>
            <span className="bico">{t.icon}</span>
            {isActive && t.label}
          </button>
        );
      })}
    </div>
  );
}

export default BottomNav;
