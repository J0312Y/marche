/**
 * BackButton — Glassmorphism back button that's always visible
 * on any background (dark images, light images, solid colors)
 */
function BackButton({ onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 40, height: 40, borderRadius: 14,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04) inset",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .15s",
        flexShrink: 0,
        ...style,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>
  );
}

function FavButton({ active, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 40, height: 40, borderRadius: 14,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: active ? "#EF4444" : "var(--muted)",
        fontSize: 17,
        transition: "all .15s",
        flexShrink: 0,
        ...style,
      }}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}

export { BackButton, FavButton };
export default BackButton;
