import { useState, useRef } from "react";

/**
 * FavButton — animated heart with pop + floating hearts on like
 */
function FavButton({ productId, toggleFav, isFav, size = "md" }) {
  const active = isFav(productId);
  const [bursts, setBursts] = useState([]);
  const burstIdRef = useRef(0);
  const s = size === "sm" ? 28 : 32;
  const iconSize = size === "sm" ? 16 : 18;

  const handleClick = (e) => {
    e.stopPropagation();
    const willActivate = !active;
    toggleFav(productId);
    if (willActivate) {
      // Spawn 3 floating hearts only when liking (not unliking)
      const id = burstIdRef.current++;
      const newBursts = [0, 1, 2].map(i => ({
        id: `${id}-${i}`,
        angle: -90 + (i - 1) * 30,  // tighter spread
        delay: i * 0.04,
      }));
      setBursts(prev => [...prev, ...newBursts]);
      setTimeout(() => {
        setBursts(prev => prev.filter(b => !newBursts.find(n => n.id === b.id)));
      }, 700);
    }
  };

  return (
    <span
      className={`fav ${active ? "fav-active" : ""}`}
      onClick={handleClick}
      style={{
        width: s, height: s,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <style>{`
        .fav-active { animation: heartPop .4s cubic-bezier(.34,1.56,.64,1) }
        @keyframes heartPop {
          0% { transform: scale(1) }
          40% { transform: scale(1.4) }
          100% { transform: scale(1) }
        }
        @keyframes heartFloat {
          0% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(0) }
          25% { opacity: 1; transform: translate(-50%,-50%) rotate(var(--a)) translateY(-6px) scale(1) }
          100% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--a)) translateY(-30px) scale(.4) }
        }
      `}</style>
      <span style={{ position: "relative", zIndex: 2, display: "inline-flex", color: active ? "#EF4444" : "#6B7280" }}>
        {active ? (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        ) : (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        )}
      </span>
      {bursts.map(b => (
        <span key={b.id} style={{
          position: "absolute", top: "50%", left: "50%",
          color: "#EF4444", pointerEvents: "none",
          animation: `heartFloat .6s ease-out ${b.delay}s both`,
          "--a": `${b.angle}deg`,
          display: "inline-flex",
          zIndex: 1,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </span>
      ))}
    </span>
  );
}

export default FavButton;
