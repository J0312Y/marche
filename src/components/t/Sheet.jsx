import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import useBackClose from "../../hooks/useBackClose";

// Hauteur du clavier mémorisée (pour faire monter la feuille dès qu'un champ est touché)
const KB = { h: (() => { try { return Number(localStorage.getItem("lk-kb-h")) || 0; } catch { return 0; } })() };
const saveKb = (h) => { KB.h = h; try { localStorage.setItem("lk-kb-h", String(h)); } catch { /* stockage indisponible */ } };

/**
 * Feuille qui monte du bas (style Toters) : fond assombri, poignée, fermeture au tap à l'extérieur.
 */
export default function Sheet({ open = true, onClose, children, maxHeight, title }) {
  useBackClose(open, onClose);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  // Clavier (téléphone) : Android ne réduit la page qu'une fois le clavier sorti ; sans rien faire, la feuille
  // disparaît dessous un instant puis saute. On la fait monter avec le clavier dès son ouverture, puis on
  // rend la main quand la page a été réduite (sans mouvement visible).
  const sheetRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    // hauteur pleine (clavier fermé) ; décalage = partie du clavier que la page réduite ne compense pas encore
    let off = false, subs = [], kb = 0;
    let full = window.innerHeight;
    const set = (anim) => {
      const el = sheetRef.current; if (!el) return;
      full = Math.max(full, window.innerHeight);
      const shrink = full - window.innerHeight;
      el.style.transition = anim ? "bottom .28s cubic-bezier(.2,.8,.2,1)" : "none";
      // Page déjà réduite : elle compense tout le clavier → feuille posée en bas. La hauteur annoncée par Android
      // inclut la barre de navigation (≈ 29 px) : la soustraire laissait la barre d'onglets visible sous la feuille.
      if (shrink > 40) { saveKb(shrink); el.style.bottom = "0px"; return; }
      el.style.bottom = kb + "px";
    };
    const onResize = () => set(false);
    const onFocus = (e) => { if (KB.h && /INPUT|TEXTAREA/.test(e.target.tagName) && window.innerHeight >= full - 40) { kb = KB.h; set(true); } };
    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        const { Keyboard } = await import("@capacitor/keyboard");
        if (off) return;
        subs.push(await Keyboard.addListener("keyboardWillShow", (i) => { kb = KB.h || i.keyboardHeight || 0; set(true); }));
        subs.push(await Keyboard.addListener("keyboardWillHide", () => { kb = 0; set(false); }));
        window.addEventListener("resize", onResize);
        // dès qu'un champ de la feuille prend la main, on monte avec la hauteur du clavier déjà connue
        sheetRef.current?.addEventListener("focusin", onFocus);
      } catch { /* clavier natif indisponible (web) */ }
    })();
    const el = sheetRef.current;
    return () => { off = true; subs.forEach((x) => x.remove()); window.removeEventListener("resize", onResize); el?.removeEventListener("focusin", onFocus); };
  }, [open]);
  if (!open) return null;
  // Rendue au niveau de l'écran entier : la feuille recouvre aussi la barre d'onglets (comme Toters)
  const host = typeof document !== "undefined" ? document.querySelector(".phone") : null;
  const ui = (
    <>
      <div className="t-sheet-bg" onClick={onClose} />
      <div className="t-sheet" ref={sheetRef} style={maxHeight ? { maxHeight } : undefined} role="dialog" aria-modal="true">
        <div className="grab" />
        {title && <div style={{ padding: "10px 20px 4px", fontSize: 20, fontWeight: 700 }}>{title}</div>}
        <div className="content">{children}</div>
      </div>
    </>
  );
  return host ? createPortal(ui, host) : ui;
}
