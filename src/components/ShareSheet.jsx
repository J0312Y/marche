import { useState, useEffect } from "react";
import { registerShareSheet } from "../utils/share";
import toast from "../utils/toast";
import Icon from "./Icon";

function ShareSheet() {
  const [data, setData] = useState(null);

  useEffect(() => {
    registerShareSheet((shareData) => setData(shareData));
    return () => registerShareSheet(null);
  }, []);

  if (!data) return null;

  const close = () => setData(null);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(data.url || data.text);
      toast.success("Lien copié !");
    } catch {
      toast.info(data.url || data.text);
    }
    close();
  };

  const openLink = (base) => {
    const text = encodeURIComponent(data.text || data.title);
    const url = encodeURIComponent(data.url || "");
    const links = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      sms: `sms:?body=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      email: `mailto:?subject=${encodeURIComponent(data.title || "")}&body=${text}%20${url}`,
    };
    window.open(links[base], "_blank");
    close();
  };

  const options = [
    {
      label: "WhatsApp",
      bg: "#25D366",
      action: () => openLink("whatsapp"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 32 32" fill="#fff">
          <path d="M16 2C8.27 2 2 8.27 2 16c0 2.78.81 5.37 2.2 7.55L2 30l6.6-2.16C10.74 29.21 13.3 30 16 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm7.13 17.1c-.4-.2-2.32-1.14-2.68-1.27-.36-.13-.62-.2-.88.2-.26.4-1.03 1.27-1.27 1.53-.23.26-.46.3-.86.1-.4-.2-1.67-.62-3.18-1.96-1.18-1.05-1.97-2.35-2.2-2.75-.23-.4-.02-.62.17-.82.18-.18.4-.46.6-.7.2-.23.26-.4.4-.66.13-.26.06-.5-.03-.7-.1-.2-.88-2.12-1.21-2.91-.32-.76-.64-.66-.88-.67h-.75c-.26 0-.66.1-1 .5-.34.4-1.31 1.28-1.31 3.11 0 1.83 1.34 3.6 1.53 3.86.2.26 2.64 4.03 6.4 5.65.9.39 1.6.62 2.14.8.9.29 1.71.25 2.36.15.72-.11 2.32-.95 2.65-1.87.32-.92.32-1.7.23-1.87-.1-.17-.36-.27-.76-.47z"/>
        </svg>
      ),
    },
    {
      label: "SMS",
      bg: "#F97316",
      action: () => openLink("sms"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      ),
    },
    {
      label: "Telegram",
      bg: "#0088cc",
      action: () => openLink("telegram"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
          <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.95 7.166c-1.747.737-1.74 1.764-.317 2.2l4.34 1.353 9.86-6.27c.467-.27.91-.117.55.235l-7.97 7.36-.31 4.39c.69 0 .997-.32 1.39-.7l3.34-3.246 6.94 5.12c1.28.71 2.197.34 2.516-1.18l4.561-21.394c.42-1.825-.703-2.624-1.825-2.249z"/>
        </svg>
      ),
    },
    {
      label: "Email",
      bg: "#EA580C",
      action: () => openLink("email"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
    },
    {
      label: "Facebook",
      bg: "#1877F2",
      action: () => openLink("facebook"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "Copier le lien",
      bg: "#6B7280",
      action: copyLink,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      ),
    },
  ];

  return (
    <div onClick={close} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
      zIndex: 150, display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", background: "var(--card)", borderRadius: "20px 20px 0 0",
        padding: "12px 16px 24px", animation: "shareUp .25s ease",
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 14px" }} />

        {/* Title */}
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Partager</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {data.title}
        </div>

        {/* Share options */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 14 }}>
          {options.map(o => (
            <div key={o.label} onClick={o.action} style={{ textAlign: "center", cursor: "pointer", padding: "6px 0" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: o.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 8, margin: "0 auto 8px",
                transition: "transform .1s",
                boxShadow: `0 4px 12px ${o.bg}40`,
              }}>
                {o.icon}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--sub)" }}>{o.label}</div>
            </div>
          ))}
        </div>

        {/* URL preview */}
        {data.url && (
          <div onClick={copyLink} style={{
            padding: "10px 14px", background: "var(--light)", borderRadius: 12,
            fontSize: 11, color: "var(--muted)", overflow: "hidden", whiteSpace: "nowrap",
            textOverflow: "ellipsis", cursor: "pointer", marginBottom: 10,
          }}>
             {data.url}
          </div>
        )}

        {/* Cancel */}
        <button onClick={close} style={{
          width: "100%", padding: 12, borderRadius: 14,
          border: "1px solid var(--border)", background: "var(--card)",
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          color: "var(--text)",
        }}>
          Annuler
        </button>
      </div>
    </div>
  );
}

export default ShareSheet;
