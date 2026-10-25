import { useEffect } from "react";

/** Écran de lancement (comme Toters) : vert plein, nom en blanc, prolonge l'écran natif sans coupure. */
function SplashScr({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 900); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "#00B492", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#fff", fontFamily: "'Segoe UI', 'Noto Sans', system-ui, sans-serif", fontStyle: "italic", fontWeight: 700, fontSize: 46, letterSpacing: -1 }}>lamuka</span>
    </div>
  );
}

export default SplashScr;
