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
    { icon: <svg width="22" height="22" viewBox="0 0 32 32" fill="#fff"><path d="M16 2C8.27 2 2 8.27 2 16c0 2.78.81 5.37 2.2 7.55L2 30l6.6-2.16C10.74 29.21 13.3 30 16 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm0 25.5c-2.4 0-4.65-.7-6.54-1.92l-.47-.28-4.85 1.58 1.58-4.72-.31-.5C4.2 19.74 3.5 17.92 3.5 16 3.5 9.1 9.1 3.5 16 3.5S28.5 9.1 28.5 16 22.9 28.5 16 28.5zm7.13-9.4c-.4-.2-2.32-1.14-2.68-1.27-.36-.13-.62-.2-.88.2-.26.4-1.03 1.27-1.27 1.53-.23.26-.46.3-.86.1-.4-.2-1.67-.62-3.18-1.96-1.18-1.05-1.97-2.35-2.2-2.75-.23-.4-.02-.62.17-.82.18-.18.4-.46.6-.7.2-.23.26-.4.4-.66.13-.26.06-.5-.03-.7-.1-.2-.88-2.12-1.21-2.91-.32-.76-.64-.66-.88-.67h-.75c-.26 0-.66.1-1 .5-.34.4-1.31 1.28-1.31 3.11 0 1.83 1.34 3.6 1.53 3.86.2.26 2.64 4.03 6.4 5.65.9.39 1.6.62 2.14.8.9.29 1.71.25 2.36.15.72-.11 2.32-.95 2.65-1.87.32-.92.32-1.7.23-1.87-.1-.17-.36-.27-.76-.47z"/></svg>, label: "WhatsApp", color: "#25D366", action: () => openLink("whatsapp") },
    { icon: "️", label: "SMS", color: "#F97316", action: () => openLink("sms") },
    { icon: "", label: "Telegram", color: "#0088cc", action: () => openLink("telegram") },
    { icon: "", label: "Email", color: "#EA580C", action: () => openLink("email") },
    { icon: "", label: "Copier le lien", color: "var(--muted)", action: copyLink },
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
                width: 48, height: 48, borderRadius: 14,
                background: "var(--light)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 6, margin: "0 auto 6px",
                transition: "transform .1s",
              }}>
                <Icon name={o.icon} size={20}/>
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
