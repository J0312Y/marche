import { useState, useEffect } from "react";

/**
 * LiveMap — Animated map mockup for delivery tracking
 * Shows driver moving between pickup and delivery points
 */
function LiveMap({ pickup, destination, driverPos, status = "delivering", style = {} }) {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (status !== "delivering") return;
    const iv = setInterval(() => setPos(p => p >= 100 ? 0 : p + 0.5), 50);
    return () => clearInterval(iv);
  }, [status]);

  const mapBg = "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 30%, #a5d6a7 50%, #c8e6c9 70%, #e8f5e9 100%)";

  return (
    <div style={{ position: "relative", height: 220, background: mapBg, borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", ...style }}>
      {/* Grid streets */}
      {[30, 55, 80].map(y => <div key={`h${y}`} style={{ position: "absolute", top: `${y}%`, left: 0, right: 0, height: 2, background: "rgba(255,255,255,.6)" }} />)}
      {[25, 50, 75].map(x => <div key={`v${x}`} style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,.6)" }} />)}

      {/* Route line */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M 60 170 Q 120 100 200 80 Q 280 60 340 50" stroke="#F97316" strokeWidth="3" strokeDasharray="8 4" fill="none" opacity="0.6" />
        {/* Animated route progress */}
        <path d="M 60 170 Q 120 100 200 80 Q 280 60 340 50" stroke="#F97316" strokeWidth="3" fill="none"
          strokeDasharray="300" strokeDashoffset={300 - (pos * 3)} />
      </svg>

      {/* Pickup point */}
      <div style={{ position: "absolute", left: "12%", bottom: "15%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ padding: "3px 8px", background: "#fff", borderRadius: 8, fontSize: 9, fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,.15)", marginBottom: 4, whiteSpace: "nowrap" }}>
          {pickup || "📦 Commerce"}
        </div>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F97316", border: "2px solid #fff", boxShadow: "0 2px 4px rgba(0,0,0,.2)" }} />
      </div>

      {/* Destination point */}
      <div style={{ position: "absolute", right: "8%", top: "15%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ padding: "3px 8px", background: "#fff", borderRadius: 8, fontSize: 9, fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,.15)", marginBottom: 4, whiteSpace: "nowrap" }}>
          {destination || "🏠 Livraison"}
        </div>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981", border: "2px solid #fff", boxShadow: "0 2px 4px rgba(0,0,0,.2)" }} />
      </div>

      {/* Driver moving */}
      {status === "delivering" && (
        <div style={{
          position: "absolute",
          left: `${12 + pos * 0.72}%`,
          bottom: `${15 + Math.sin(pos * 0.03) * 40 + pos * 0.35}%`,
          transform: "translate(-50%, 50%)",
          transition: "left .05s linear, bottom .05s linear",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#F97316", border: "3px solid #fff",
            boxShadow: "0 4px 16px rgba(249,115,22,.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>
            🛵
          </div>
        </div>
      )}

      {/* Status badge */}
      <div style={{ position: "absolute", top: 10, left: 10, padding: "4px 10px", background: status === "delivering" ? "#F97316" : status === "delivered" ? "#10B981" : "var(--card)", color: status === "delivering" || status === "delivered" ? "#fff" : "var(--text)", borderRadius: 8, fontSize: 10, fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
        {status === "delivering" ? "🛵 En route" : status === "delivered" ? "✅ Livré" : status === "pickup" ? "📦 Retrait" : "⏳ En attente"}
      </div>
    </div>
  );
}

export default LiveMap;
