/**
 * NotificationList — notifications réelles (API /notifications) + bannières reçues pendant la session
 * Partagé par les espaces acheteur, vendeur et livreur.
 */
import { useState, useEffect } from "react";
import Icon from "./Icon";
import toast from "../utils/toast";
import { useLoad } from "../hooks/useData";
import notifAPI from "../api/notifications";
import { getNotifications, onNotifChange, markPushRead, markAllRead as markAllPushRead } from "../utils/notifStore";
import { SkeletonList } from "./Loading";
import { useApp } from "../context/AppContext";

const parseData = (d) => { if (!d) return {}; if (typeof d === "object") return d; try { return JSON.parse(d); } catch { return {}; } };

const when = (d) => {
  if (!d) return "";
  const t = new Date(String(d).replace(" ", "T"));
  if (isNaN(t)) return "";
  const min = Math.floor((Date.now() - t.getTime()) / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  if (min < 1440) return `Il y a ${Math.floor(min / 60)} h`;
  return t.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

const fromApi = (n) => ({
  id: n.id,
  title: n.title || "Lamuka Market",
  body: n.body || "",
  icon: n.icon || "",
  type: n.type,
  data: parseData(n.data),
  time: when(n.created_at),
  read: String(n.is_read) === "1" || n.is_read === true,
});

/**
 * openTarget(n) : renvoie { label, onClick } pour l'action liée (ex. ouvrir la commande) ou null
 */
export default function NotificationList({ onBack, openTarget }) {
  const { setUnreadCount } = useApp();
  const { data, loading, error } = useLoad(() => notifAPI.getAll());
  const [apiItems, setApiItems] = useState(null);
  const [pushItems, setPushItems] = useState(getNotifications());
  const [expanded, setExpanded] = useState(null);
  useEffect(() => onNotifChange(setPushItems), []);

  const list = apiItems || (Array.isArray(data) ? data : data?.notifications || []).map(fromApi);
  const items = [...pushItems.map(p => ({ ...p, id: p.id, read: p.read })), ...list];
  const unread = items.filter(n => !n.read).length;

  useEffect(() => { setUnreadCount?.(list.filter(n => !n.read).length); }, [list.length, unread]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = (n) => {
    setExpanded(expanded === n.id ? null : n.id);
    if (n.read) return;
    if (n.fromPush) { markPushRead(n.id); return; }
    setApiItems(list.map(x => x.id === n.id ? { ...x, read: true } : x));
    notifAPI.read(n.id).catch(() => {});
  };

  const readAll = async () => {
    try { await notifAPI.readAll(); }
    catch (err) { toast.error(err.message || "Impossible de tout marquer comme lu"); return; }
    setApiItems(list.map(x => ({ ...x, read: true })));
    markAllPushRead();
    toast.success("Toutes les notifications sont lues");
  };

  return (<div className="scr">
    <div className="appbar">
      <button onClick={() => onBack && onBack()}>←</button>
      <h2>Notifications {unread > 0 && <span style={{ fontSize: 13, color: "#F97316", fontWeight: 600 }}>({unread})</span>}</h2>
      {unread > 0 ? <button onClick={readAll} style={{ fontSize: 11, color: "#F97316", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", width: "auto" }}>Tout lire</button> : <div style={{ width: 38 }} />}
    </div>

    {loading ? <SkeletonList count={5} /> : error && items.length === 0 ? (
      <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--muted)", fontSize: 13 }}><Icon name="info" size={22} /><div style={{ marginTop: 8 }}>{error}</div></div>
    ) : items.length === 0 ? (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Icon name="bell" size={28} />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: "10px 0 4px" }}>Aucune notification</h3>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Vous serez notifié ici de l'avancement de vos commandes.</p>
      </div>
    ) : (
      <div style={{ paddingBottom: 20 }}>
        {items.map(n => {
          const isOpen = expanded === n.id;
          const target = !n.fromPush && openTarget ? openTarget(n) : null;
          return (
            <div key={n.id} onClick={() => open(n)} style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer", background: !n.read ? "rgba(249,115,22,0.03)" : "transparent" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: !n.read ? "rgba(249,115,22,0.08)" : "var(--light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {n.icon || <Icon name="bell" size={18} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: n.read ? 500 : 700 }}>{n.title}</span>
                    <span style={{ fontSize: 10, color: "var(--muted)", flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.5, whiteSpace: isOpen ? "pre-line" : "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.body}</div>
                  {isOpen && target && <button onClick={(e) => { e.stopPropagation(); target.onClick(); }} style={{ marginTop: 10, padding: "8px 14px", borderRadius: 10, border: "none", background: "#F97316", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{target.label}</button>}
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316", flexShrink: 0, marginTop: 6 }} />}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>);
}
