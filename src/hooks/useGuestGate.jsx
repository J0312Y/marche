import { useCallback } from "react";
import { useApp } from "../context/AppContext";

/**
 * useGuestGate — exécute une action seulement si l'utilisateur est connecté.
 * Invité : la feuille de connexion s'ouvre, puis l'action est lancée une fois connecté (comme Toters).
 *
 *   const { gate, GateUI } = useGuestGate(go);
 *   <button onClick={() => gate("checkout", () => doCheckout())}>Commander</button>
 *   <GateUI/>   (conservé pour compatibilité : n'affiche plus rien)
 */
export function useGuestGate() {
  const { isGuest, requireLogin } = useApp();
  const gate = useCallback((reason, callback) => requireLogin(reason, callback), [requireLogin]);
  const GateUI = useCallback(() => null, []);
  return { gate, GateUI, isGuest };
}

export default useGuestGate;
