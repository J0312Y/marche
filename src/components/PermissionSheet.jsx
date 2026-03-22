import { useState, useEffect } from "react";

/**
 * PermissionSheet — bottom sheet asking for permission before accessing device features
 * Usage: <PermissionSheet type="location" onAllow={()=>{}} onDeny={()=>{}} />
 */
const PERMS = {
  location: { icon: "📍", title: "Localisation", desc: "Pour trouver les boutiques et livreurs près de vous, et estimer les frais de livraison.", benefit: "Livraison plus rapide et précise" },
  camera: { icon: "📸", title: "Appareil photo", desc: "Pour scanner les QR codes, prendre des photos de vos produits et documents.", benefit: "Scanner et photographier facilement" },
  notifications: { icon: "🔔", title: "Notifications", desc: "Pour suivre vos commandes en temps réel, recevoir les promos et offres spéciales.", benefit: "Ne manquez aucune commande" },
  microphone: { icon: "🎙️", title: "Microphone", desc: "Pour envoyer des messages vocaux dans le chat.", benefit: "Communiquer plus rapidement" },
};

function PermissionSheet({ type, onAllow, onDeny }) {
  const perm = PERMS[type];
  if (!perm) return null;

  return (
    <div onClick={onDeny} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 150, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: "var(--card)", borderRadius: "20px 20px 0 0", padding: "16px 20px 28px", animation: "shareUp .25s ease" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 18px" }} />

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(249,115,22,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px" }}>{perm.icon}</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Autoriser {perm.title.toLowerCase()} ?</h3>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, maxWidth: 280, margin: "0 auto" }}>{perm.desc}</p>
        </div>

        <div style={{ padding: "10px 14px", background: "rgba(249,115,22,0.04)", borderRadius: 12, border: "1px solid rgba(249,115,22,0.12)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>✨</span>
          <span style={{ fontSize: 12, color: "var(--sub)", fontWeight: 500 }}>{perm.benefit}</span>
        </div>

        <button onClick={onAllow} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: "#F97316", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>
          Autoriser
        </button>
        <button onClick={onDeny} style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          Plus tard
        </button>
      </div>
    </div>
  );
}

export default PermissionSheet;
