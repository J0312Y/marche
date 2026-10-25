import { useEffect, useRef } from "react";

// Pile des éléments ouverts (feuilles, fiches, recherches) : le bouton retour d'Android ferme le dernier ouvert
const stack = [];

/** Le bouton retour ferme le dernier élément ouvert ; renvoie true s'il a été pris en charge. */
export function handleBackInStack() {
  const top = stack[stack.length - 1];
  if (!top) return false;
  top.current?.();
  return true;
}

/** Tant que `open` est vrai, le bouton retour appelle `close` (au lieu de changer d'écran). */
export default function useBackClose(open, close) {
  const ref = useRef(close);
  ref.current = close;
  useEffect(() => {
    if (!open || !close) return;
    stack.push(ref);
    return () => { const i = stack.lastIndexOf(ref); if (i >= 0) stack.splice(i, 1); };
  }, [open, !close]);
}
