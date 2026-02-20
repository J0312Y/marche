/**
 * StatusBar - iPhone 16 Pro status bar + Dynamic Island
 * @param {object} modeBadge - {bg, label} ou null
 */
function StatusBar({ modeBadge }) {
  return (
    <div style={{ position: "relative", padding: "14px 28px 8px", flexShrink: 0, background: "transparent", zIndex: 20 }}>
      <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 124, height: 36, background: "#000", borderRadius: 20, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,.15) inset" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#1c1c3a,#0a0a14)", border: "1.5px solid #1a1a2e", marginLeft: 36 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -.3, width: 54, fontVariantNumeric: "tabular-nums" }}>9:41</span>
        <div style={{ width: 124 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, width: 72, justifyContent: "flex-end" }}>
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="1" fill="#191815"/><rect x="4.5" y="5.5" width="3" height="6.5" rx="1" fill="#191815"/><rect x="9" y="3" width="3" height="9" rx="1" fill="#191815"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#191815"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.5c-2.7 0-5.15 1.1-6.93 2.87l1.42 1.42A7.65 7.65 0 018 4.5c2.12 0 4.05.86 5.51 2.29l1.42-1.42A9.69 9.69 0 008 2.5z" fill="#191815" opacity=".95"/><path d="M8 6c-1.66 0-3.17.67-4.24 1.76l1.41 1.41A3.98 3.98 0 018 8c1.1 0 2.1.45 2.83 1.17l1.41-1.41A5.97 5.97 0 008 6z" fill="#191815" opacity=".95"/><circle cx="8" cy="11" r="1.2" fill="#191815"/></svg>
          <svg width="28" height="13" viewBox="0 0 28 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#191815" strokeWidth="1" opacity=".35"/><rect x="2" y="2" width="19.5" height="9" rx="2.5" fill="#191815"/><path d="M25 4.5c.8.4 1.3 1.1 1.3 2s-.5 1.6-1.3 2V4.5z" fill="#191815" opacity=".4"/></svg>
        </div>
      </div>
      {modeBadge && <div style={{ textAlign: "center", marginTop: 4 }}><span style={{ padding: "2px 10px", borderRadius: 8, background: modeBadge.bg, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: .5 }}>{modeBadge.label}</span></div>}
    </div>
  );
}

export default StatusBar;
