import { useState, useRef } from "react";
import Icon from "./Icon";

/**
 * FavButton — animated heart with pop + floating hearts on like
 */
function FavButton({ productId, toggleFav, isFav, size = "md" }) {
  const active = isFav(productId);
  const [bursts, setBursts] = useState([]);
  const burstIdRef = useRef(0);
  const s = size === "sm" ? 28 : 32;
  const fs = size === "sm" ? 12 : 14;

  const handleClick = (e) => {
    e.stopPropagation();
    const willActivate = !active;
    toggleFav(productId);
    if (willActivate) {
      // Create floating hearts only when liking (not unliking)
      const id = burstIdRef.current++;
      const newBursts = [0, 1, 2].map(i => ({
        id: `${id}-${i}`,
        angle: -90 + (i - 1) * 35,
        delay: i * 0.05,
      }));
      setBursts(prev => [...prev, ...newBursts]);
      setTimeout(() => {
        setBursts(prev => prev.filter(b => !newBursts.find(n => n.id === b.id)));
      }, 800);
    }
  };

  return (
    <span
      className={`fav ${active ? "fav-active" : ""}`}
      onClick={handleClick}
      style={{
        width: s, height: s, fontSize: active ? fs + 2 : fs,
        color: active ? "#EF4444" : "inherit",
        position: "relative", overflow: "visible",
      }}
    >
      <style>{`
        .fav-active { animation: heartPop .4s cubic-bezier(.34,1.56,.64,1) }
        @keyframes heartPop {
          0% { transform: scale(1) }
          40% { transform: scale(1.45) }
          100% { transform: scale(1) }
        }
        @keyframes heartFloat {
          0% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(0) }
          20% { opacity: 1; transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(1) }
          100% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--a)) translateY(-40px) scale(.4) }
        }
      `}</style>
      <span style={{ position: "relative", zIndex: 2 }}>{active ? "" : ""}</span>
      {bursts.map(b => (
        <span key={b.id} style={{
          position: "absolute", top: "50%", left: "50%",
          fontSize: 14, color: "#EF4444", pointerEvents: "none",
          animation: `heartFloat .7s ease-out ${b.delay}s both`,
          "--a": `${b.angle}deg`,
        }}></span>
      ))}
    </span>
  );
}

export default FavButton;
