import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { addNotification } from "../utils/notifStore";

let showPushBanner = null;

export function registerPushBanner(handler) { showPushBanner = handler; }
export function triggerPush(data) { showPushBanner?.(data); }

function PushBanner() {
  const { go } = useApp();
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    registerPushBanner((d) => {
      const parsed = typeof d === "string" ? { icon: "🔔", title: "Lamuka Market", body: d } : d;
      setData(parsed);
      addNotification(parsed);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
      setTimeout(() => setData(null), 4500);
    });
    return () => registerPushBanner(null);
  }, []);

  if (!data) return null;

  return (
    <div onClick={() => { setVisible(false); if(data.onTap) data.onTap(); else if(go) go("notif"); }} style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      transform: visible ? "translateY(0)" : "translateY(-100%)",
      transition: "transform .35s cubic-bezier(.4,0,.2,1)",
      padding: "44px 16px 12px", cursor: "pointer",
      background: "var(--card)", borderBottom: "1px solid var(--border)",
      boxShadow: "0 4px 20px rgba(0,0,0,.12)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(249,115,22,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{data.icon || "🛒"}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{data.title}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{data.body}</div>
        </div>
        <span style={{ fontSize: 10, color: "var(--muted)", flexShrink: 0 }}>maintenant</span>
      </div>
    </div>
  );
}

export default PushBanner;
