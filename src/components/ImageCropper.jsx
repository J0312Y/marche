import { useState, useRef, useEffect, useCallback } from "react";

/**
 * ImageCropper — drag to reposition, zoom slider, circle/square/rect
 * Props: src (base64), onConfirm(croppedBase64), onCancel, shape ("circle"|"square"|"rect")
 */
function ImageCropper({ src, onConfirm, onCancel, shape = "square" }) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const SIZE = shape === "rect" ? 280 : 240;
  const H = shape === "rect" ? 180 : SIZE;
  const OUT = 400;
  const OUT_H = shape === "rect" ? Math.round(OUT * H / SIZE) : OUT;

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const s = Math.max(SIZE / img.width, H / img.height) * 1.05;
      setScale(s);
      setPos({ x: (SIZE - img.width * s) / 2, y: (H - img.height * s) / 2 });
      setImgLoaded(true);
    };
    img.src = src;
  }, [src]);

  const onStart = useCallback((cx, cy) => {
    setDragging(true);
    dragRef.current = { x: cx - pos.x, y: cy - pos.y };
  }, [pos]);

  const onMove = useCallback((cx, cy) => {
    if (!dragging) return;
    setPos({ x: cx - dragRef.current.x, y: cy - dragRef.current.y });
  }, [dragging]);

  const onEnd = () => setDragging(false);

  const confirm = () => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = canvasRef.current;
    canvas.width = OUT;
    canvas.height = OUT_H;
    const ctx = canvas.getContext("2d");

    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(OUT / 2, OUT_H / 2, OUT / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    const sx = OUT / SIZE;
    const sy = OUT_H / H;
    ctx.drawImage(img, pos.x * sx, pos.y * sy, img.width * scale * sx, img.height * scale * sy);
    onConfirm(canvas.toDataURL("image/jpeg", 0.92));
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", zIndex: 99999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeInFast .2s ease" }}
      onClick={e => e.stopPropagation()}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
        {shape === "circle" ? "📷 Ajuster la photo de profil" : shape === "rect" ? "📷 Recadrer la photo" : "📷 Recadrer l'image"}
      </div>

      {/* Crop zone */}
      <div
        style={{
          width: SIZE, height: H, overflow: "hidden", position: "relative",
          borderRadius: shape === "circle" ? "50%" : 16,
          border: "2px solid rgba(255,255,255,.3)", background: "#111",
          touchAction: "none", cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={e => onStart(e.clientX, e.clientY)}
        onMouseMove={e => onMove(e.clientX, e.clientY)}
        onMouseUp={onEnd} onMouseLeave={onEnd}
        onTouchStart={e => { const t = e.touches[0]; onStart(t.clientX, t.clientY); }}
        onTouchMove={e => { e.preventDefault(); const t = e.touches[0]; onMove(t.clientX, t.clientY); }}
        onTouchEnd={onEnd}
      >
        {imgLoaded && imgRef.current && (
          <img src={src} alt="" draggable={false} style={{
            position: "absolute", left: pos.x, top: pos.y,
            width: imgRef.current.width * scale,
            height: imgRef.current.height * scale,
            pointerEvents: "none", userSelect: "none",
          }} />
        )}
      </div>

      {/* Guide */}
      <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11, marginTop: 8 }}>
        ☝️ Glissez pour repositionner
      </div>

      {/* Zoom */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0 20px" }}>
        <span style={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>−</span>
        <input type="range" min={0.2} max={3.5} step={0.02} value={scale}
          onChange={e => {
            const ns = parseFloat(e.target.value);
            const cx = SIZE / 2, cy = H / 2;
            const dx = (cx - pos.x) / scale;
            const dy = (cy - pos.y) / scale;
            setScale(ns);
            setPos({ x: cx - dx * ns, y: cy - dy * ns });
          }}
          style={{ width: 180, accentColor: "#F97316" }}
        />
        <span style={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>+</span>
        <span style={{ color: "rgba(255,255,255,.4)", fontSize: 10, minWidth: 32 }}>{Math.round(scale * 100)}%</span>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onCancel} style={{ padding: "12px 28px", borderRadius: 14, border: "1px solid rgba(255,255,255,.2)", background: "transparent", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
        <button onClick={confirm} style={{ padding: "12px 28px", borderRadius: 14, border: "none", background: "#F97316", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✅ Confirmer</button>
      </div>
    </div>
  );
}

export default ImageCropper;
