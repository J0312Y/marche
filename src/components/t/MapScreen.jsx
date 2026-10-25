import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Écran « carte plein écran » (suivi client, livraison du livreur, course coursier) :
 * la carte occupe tout l'écran ; un panneau posé en bas montre l'essentiel (peek) et se tire vers le haut
 * pour le détail (children). Glisser ou toucher la poignée l'ouvre / le referme ; la carte reste utilisable au-dessus.
 * map(padBottom) : rend la carte en sachant quelle hauteur le panneau cache (pour cadrer le trajet au-dessus).
 * top : boutons flottants en haut ; footer : bouton d'action fixe sous le panneau.
 */
export default function MapScreen({ map, top, peek, children, footer }) {
  const rootRef = useRef(null);
  const peekRef = useRef(null);
  const [peekH, setPeekH] = useState(220);
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState(null); // { y0, h0, h }
  const fullH = () => (rootRef.current?.clientHeight || 700) * 0.86;

  // Hauteur du panneau fermé = poignée + contenu « peek » (mesurée, suit les changements de contenu)
  useLayoutEffect(() => {
    const el = peekRef.current; if (!el) return;
    const upd = () => setPeekH(Math.round(el.offsetHeight + 22));
    upd();
    const ro = new ResizeObserver(upd); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => { if (!children) setOpen(false); }, [children]);

  const h = drag ? drag.h : open ? fullH() : peekH;
  const start = (e) => { if (!children) return; setDrag({ y0: e.clientY, h0: open ? fullH() : peekH, h: open ? fullH() : peekH, moved: false }); };
  const move = (e) => {
    if (!drag) return;
    const dy = drag.y0 - e.clientY;
    setDrag({ ...drag, h: Math.max(peekH - 30, Math.min(fullH(), drag.h0 + dy)), moved: drag.moved || Math.abs(dy) > 6 });
  };
  const end = () => {
    if (!drag) return;
    if (!drag.moved) setOpen(!open); // simple toucher : bascule
    else setOpen(drag.h > (peekH + fullH()) / 2);
    setDrag(null);
  };

  return (
    <div className="tm-root">
      <div className="tm-stage" ref={rootRef}>
        <div className="tm-map">{map(peekH)}</div>
        {top && <div className="tm-top">{top}</div>}
        <div className={"tm-panel" + (open ? " open" : "") + (drag ? " drag" : "")} style={{ height: h }}>
          <div className="tm-grab" onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); start(e); }} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
            role={children ? "button" : undefined} aria-label={children ? (open ? "Réduire" : "Voir le détail") : undefined}>
            {children && <span />}
          </div>
          <div className="tm-body" style={{ overflowY: open && !drag ? "auto" : "hidden" }}>
            <div ref={peekRef}>{peek}</div>
            {children && <div className="tm-more">{children}</div>}
          </div>
        </div>
      </div>
      {footer && <div className="tm-foot">{footer}</div>}
    </div>
  );
}
