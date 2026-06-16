import { useEffect, useState } from "react";

/**
 * OfflineBanner — sticky banner at top of app when user is offline
 * Detects via navigator.onLine + online/offline events
 * Also shows a temporary "Back online" confirmation
 */
function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  const [justBackOnline, setJustBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setJustBackOnline(true);
      setTimeout(() => setJustBackOnline(false), 3000);
    };
    const handleOffline = () => {
      setOnline(false);
      setJustBackOnline(false);
    };
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online && !justBackOnline) return null;

  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0,
      zIndex: 9998,
      background: online ? "#10B981" : "#EF4444",
      color: "#fff",
      padding: "10px 16px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      fontSize: 13, fontWeight: 700,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      animation: "slideDown .25s ease",
    }}>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes pulse-banner {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
      
      {online ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Connexion rétablie
        </>
      ) : (
        <>
          <div style={{ animation: "pulse-banner 1.4s ease-in-out infinite" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"/>
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
              <line x1="12" y1="20" x2="12.01" y2="20"/>
            </svg>
          </div>
          Pas de connexion Internet
        </>
      )}
    </div>
  );
}

export default OfflineBanner;
