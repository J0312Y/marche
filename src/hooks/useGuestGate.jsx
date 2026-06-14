import { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import GuestPrompt from "../components/GuestPrompt";

/**
 * useGuestGate — hook to gate actions behind authentication.
 * 
 * Usage:
 *   const { gate, GateUI } = useGuestGate(go);
 *   
 *   <button onClick={() => gate("checkout", () => doCheckout())}>Order</button>
 *   <GateUI/>
 */
export function useGuestGate(go) {
  const { isGuest, exitGuestToLogin } = useApp();
  const [prompt, setPrompt] = useState(null);

  // gate("reason", callback) — runs callback if authenticated, else shows prompt
  const gate = useCallback((reason, callback) => {
    if (isGuest) {
      setPrompt({ reason, callback });
    } else {
      callback?.();
    }
  }, [isGuest]);

  const handleLogin = useCallback(() => {
    setPrompt(null);
    exitGuestToLogin();
  }, [exitGuestToLogin]);

  const close = useCallback(() => setPrompt(null), []);

  const GateUI = useCallback(() => prompt ? (
    <GuestPrompt reason={prompt.reason} onClose={close} onLogin={handleLogin} />
  ) : null, [prompt, close, handleLogin]);

  return { gate, GateUI, isGuest };
}

export default useGuestGate;
