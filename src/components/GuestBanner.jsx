import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "./Icon";

/**
 * GuestBanner — Subtle banner shown to guests, dismissible per session
 */
function GuestBanner({ go }) {
  const { isGuest, exitGuestToLogin } = useApp();
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem("lk-guest-banner-dismissed") === "1"; } catch { return false; }
  });

  if (!isGuest || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem("lk-guest-banner-dismissed", "1"); } catch {}
  };

  return (
    <div style={{
      margin: "8px 16px 12px",
      padding: "10px 12px",
      background: "linear-gradient(90deg, rgba(249,115,22,0.08), rgba(249,115,22,0.04))",
      border: "1px solid rgba(249,115,22,0.2)",
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: "rgba(249,115,22,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#F97316", flexShrink: 0,
      }}>
        <Icon name="info" size={16} color="#F97316"/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1F2E" }}>Mode visiteur</div>
        <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 1 }}>Connectez-vous pour acheter et sauvegarder votre panier</div>
      </div>
      <button onClick={() => exitGuestToLogin()} style={{
        padding: "6px 12px", borderRadius: 8, border: "none",
        background: "#F97316", color: "#fff",
        fontSize: 11, fontWeight: 700, cursor: "pointer",
        fontFamily: "inherit", flexShrink: 0,
      }}>
        Se connecter
      </button>
      <button onClick={dismiss} style={{
        width: 24, height: 24, padding: 0, borderRadius: 6, border: "none",
        background: "transparent", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--muted)", flexShrink: 0,
      }}>
        <Icon name="close" size={14} color="var(--muted)"/>
      </button>
    </div>
  );
}

export default GuestBanner;
