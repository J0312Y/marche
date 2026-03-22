import { useState, useEffect } from "react";
import { registerShareSheet } from "../utils/share";
import toast from "../utils/toast";

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
      toast.success("Lien copié ! 📋");
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
    { icon: "💬", label: "WhatsApp", color: "#25D366", action: () => openLink("whatsapp") },
    { icon: "✉️", label: "SMS", color: "#F97316", action: () => openLink("sms") },
    { icon: "📨", label: "Telegram", color: "#0088cc", action: () => openLink("telegram") },
    { icon: "📧", label: "Email", color: "#EA580C", action: () => openLink("email") },
    { icon: "📋", label: "Copier le lien", color: "var(--muted)", action: copyLink },
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
            🔗 {data.url}
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
