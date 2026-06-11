import { useEffect } from "react";

/**
 * SuccessAnimation — full-screen animated overlay
 *
 * Props:
 * - type: "success" | "error" | "warning" | "info" (default: success)
 * - title: Main title
 * - subtitle: Optional subtitle
 * - hint: Optional third line
 * - duration: Auto-dismiss after N ms (default 1600). 0 = no auto-dismiss
 * - onDone: Called when animation finishes
 * - color: Override background color
 * - icon: Custom JSX icon (overrides default check/x)
 */
function SuccessAnimation({
  type = "success",
  title = "Succès !",
  subtitle,
  hint,
  color,
  duration = 1600,
  onDone,
  icon,
}) {
  // Color presets per type
  const presets = {
    success: { bg: "#10B981", iconStroke: "#10B981" },
    error:   { bg: "#EF4444", iconStroke: "#EF4444" },
    warning: { bg: "#F59E0B", iconStroke: "#F59E0B" },
    info:    { bg: "#3B82F6", iconStroke: "#3B82F6" },
  };
  const cfg = presets[type] || presets.success;
  const bg = color || cfg.bg;

  useEffect(() => {
    if (duration > 0 && onDone) {
      const t = setTimeout(onDone, duration);
      return () => clearTimeout(t);
    }
  }, [duration, onDone]);

  // Default icons
  const defaultIcon = type === "error" || type === "warning" ? (
    // X icon for error / refuse / cancel
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <path d="M18 18 L42 42" stroke={cfg.iconStroke} strokeWidth="6" strokeLinecap="round"
        strokeDasharray="36" style={{ animation: "saDraw .4s ease-out .25s both" }} />
      <path d="M42 18 L18 42" stroke={cfg.iconStroke} strokeWidth="6" strokeLinecap="round"
        strokeDasharray="36" style={{ animation: "saDraw .4s ease-out .45s both" }} />
    </svg>
  ) : type === "info" ? (
    // i icon for info
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="18" r="3.5" fill={cfg.iconStroke} style={{ animation: "saDraw .3s ease-out .2s both" }} />
      <path d="M30 28 L30 44" stroke={cfg.iconStroke} strokeWidth="6" strokeLinecap="round"
        strokeDasharray="20" style={{ animation: "saDraw .4s ease-out .35s both" }} />
    </svg>
  ) : (
    // Default: checkmark for success
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <path d="M15 30 L26 41 L46 19" stroke={cfg.iconStroke} strokeWidth="6"
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60"
        style={{ animation: "saDraw .5s ease-out .3s both" }} />
    </svg>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: bg, zIndex: 10000,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", animation: "saFade .25s ease",
    }}>
      <style>{`
        @keyframes saFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes saPop {
          0% { transform: scale(0) rotate(-45deg); opacity: 0 }
          50% { transform: scale(1.2) rotate(0) }
          100% { transform: scale(1) rotate(0); opacity: 1 }
        }
        @keyframes saDraw { from { stroke-dashoffset: 60 } to { stroke-dashoffset: 0 } }
        @keyframes saRise {
          0% { opacity: 0; transform: translateY(20px) }
          100% { opacity: 1; transform: translateY(0) }
        }
        @keyframes saRipple {
          0% { transform: scale(.3); opacity: .7 }
          100% { transform: scale(2.5); opacity: 0 }
        }
        @keyframes saShake {
          0%,100% { transform: translateX(0) }
          20%,60% { transform: translateX(-6px) }
          40%,80% { transform: translateX(6px) }
        }
      `}</style>

      {/* Ripples */}
      <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", border: "3px solid rgba(255,255,255,.5)", animation: "saRipple 1.5s ease-out infinite" }} />
      <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", border: "3px solid rgba(255,255,255,.5)", animation: "saRipple 1.5s ease-out infinite .4s" }} />

      {/* White circle with icon */}
      <div style={{
        width: 120, height: 120, borderRadius: "50%", background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: type === "error" ? "saPop .5s cubic-bezier(.34,1.56,.64,1), saShake .4s ease-in-out .5s" : "saPop .5s cubic-bezier(.34,1.56,.64,1)",
        boxShadow: "0 12px 40px rgba(0,0,0,.2)",
      }}>
        {icon || defaultIcon}
      </div>

      {/* Texts */}
      <div style={{ marginTop: 24, color: "#fff", fontSize: 24, fontWeight: 800, textAlign: "center", padding: "0 32px", animation: "saRise .4s ease-out .5s both" }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ marginTop: 6, color: "rgba(255,255,255,.85)", fontSize: 14, fontWeight: 500, textAlign: "center", padding: "0 32px", animation: "saRise .4s ease-out .65s both" }}>
          {subtitle}
        </div>
      )}
      {hint && (
        <div style={{ marginTop: 18, color: "rgba(255,255,255,.7)", fontSize: 12, fontWeight: 500, textAlign: "center", padding: "0 32px", animation: "saRise .4s ease-out .85s both" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export default SuccessAnimation;
