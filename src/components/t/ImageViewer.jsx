import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import useBackClose from "../../hooks/useBackClose";

/**
 * Visionneuse plein écran (comme Toters) : fond blanc, ✕ en haut à gauche, photo centrée,
 * vignettes en bas. Pincer ou double-toucher pour zoomer, glisser pour se déplacer ;
 * sans zoom, un glissement horizontal passe à la photo suivante.
 */
export default function ImageViewer({ photos, start = 0, alt = "", onClose }) {
  const list = photos.filter(Boolean);
  const [i, setI] = useState(Math.min(start, list.length - 1));
  useBackClose(true, onClose);
  const imgRef = useRef(null);
  const g = useRef({ s: 1, x: 0, y: 0 });         // zoom et déplacement actuels
  const t = useRef(null);                         // geste en cours
  const lastTap = useRef(0);

  const apply = (anim) => {
    const el = imgRef.current; if (!el) return;
    el.style.transition = anim ? "transform .25s cubic-bezier(.2,.8,.2,1)" : "none";
    el.style.transform = `translate3d(${g.current.x}px,${g.current.y}px,0) scale(${g.current.s})`;
  };
  const reset = (anim = true) => { g.current = { s: 1, x: 0, y: 0 }; apply(anim); };
  useEffect(() => { reset(false); }, [i]);

  const dist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  const clamp = () => {
    const el = imgRef.current; if (!el) return;
    const { s } = g.current;
    if (s <= 1) { reset(); return; }
    const mx = (el.offsetWidth * (s - 1)) / 2, my = (el.offsetHeight * (s - 1)) / 2;
    g.current.x = Math.max(-mx, Math.min(mx, g.current.x));
    g.current.y = Math.max(-my, Math.min(my, g.current.y));
    apply(true);
  };

  const onStart = (e) => {
    const ts = e.touches;
    if (ts.length === 2) t.current = { pinch: true, d: dist(ts[0], ts[1]), s: g.current.s };
    else if (ts.length === 1) t.current = { x0: ts[0].clientX, y0: ts[0].clientY, x: g.current.x, y: g.current.y, moved: false };
  };
  const onMove = (e) => {
    const ts = e.touches, c = t.current; if (!c) return;
    if (c.pinch && ts.length === 2) {
      g.current.s = Math.max(1, Math.min(4, c.s * (dist(ts[0], ts[1]) / c.d)));
      apply(false);
    } else if (!c.pinch && ts.length === 1) {
      const dx = ts[0].clientX - c.x0, dy = ts[0].clientY - c.y0;
      if (Math.abs(dx) + Math.abs(dy) > 6) c.moved = true;
      if (g.current.s > 1) { g.current.x = c.x + dx; g.current.y = c.y + dy; apply(false); }
      else c.dx = dx;
    }
  };
  const onEnd = (e) => {
    const c = t.current; if (!c || e.touches.length) return;
    t.current = null;
    if (c.pinch) { clamp(); return; }
    if (g.current.s > 1) { if (c.moved) { clamp(); return; } }
    else if (c.moved && Math.abs(c.dx || 0) > 60 && list.length > 1) {
      setI((k) => Math.max(0, Math.min(list.length - 1, k + (c.dx < 0 ? 1 : -1))));
      return;
    }
    // double toucher : zoom ×2.5 sur le point touché / retour
    if (!c.moved) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        if (g.current.s > 1) reset();
        else {
          const el = imgRef.current, r = el.getBoundingClientRect(), s = 2.5;
          g.current = { s, x: (r.left + r.width / 2 - c.x0) * (s - 1), y: (r.top + r.height / 2 - c.y0) * (s - 1) };
          clamp();
        }
        lastTap.current = 0;
      } else lastTap.current = now;
    }
  };

  return (
    <div className="t-iv">
      <div className="t-iv-top">
        <button className="t-round-btn" onClick={onClose} aria-label="Fermer"><Icon name="close" size={22} /></button>
      </div>
      <div className="t-iv-stage" onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}>
        <img ref={imgRef} src={list[i]} alt={alt} draggable={false} />
      </div>
      <div className="t-iv-thumbs">
        {list.map((u, k) => (
          <button key={u + k} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Photo ${k + 1}`}>
            <img src={u} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
