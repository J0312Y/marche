import { useEffect, useState } from "react";

/**
 * ApiErrorBanner — shown when backend is unreachable (500, 503, timeout, network)
 * Sits at top of phone, dismissible, with retry callback
 * 
 * Usage: <ApiErrorBanner visible={hasApiError} onRetry={retryAction} />
 */
function ApiErrorBanner({ visible, onRetry, message }) {
  const [show, setShow] = useState(visible);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (visible && !dismissed) setShow(true);
    if (!visible) {
      setShow(false);
      setDismissed(false);
    }
  }, [visible, dismissed]);

  if (!show) return null;

  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0,
      zIndex: 9997,
      background: "linear-gradient(180deg, #F97316 0%, #EA580C 100%)",
      color: "#fff",
      padding: "10px 14px",
      display: "flex", alignItems: "center", gap: 10,
      fontSize: 12, fontWeight: 600,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      animation: "slideDownApi .25s ease",
    }}>
      <style>{`
        @keyframes slideDownApi {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      
      <div style={{ flex: 1, lineHeight: 1.35 }}>
        {message || "Connexion au serveur impossible"}
      </div>
      
      {onRetry && (
        <button onClick={onRetry} style={{
          padding: "5px 10px",
          background: "rgba(255,255,255,0.22)",
          border: "none",
          borderRadius: 6,
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          flexShrink: 0,
        }}>Réessayer</button>
      )}
      
      <button onClick={() => setDismissed(true)} style={{
        padding: 4,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        opacity: 0.85,
      }} aria-label="Fermer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

export default ApiErrorBanner;
