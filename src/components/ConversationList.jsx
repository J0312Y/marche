/**
 * ConversationList — liste des vraies conversations de l'utilisateur (API /chat/conversations)
 */
import Icon from "./Icon";
import { useLoad } from "../hooks/useData";
import chatAPI from "../api/chat";
import { SkeletonList } from "./Loading";

const TYPE_LABEL = { client_vendor: "Boutique", client_driver: "Livraison", vendor_driver: "Livraison" };

const fmtWhen = (d) => {
  if (!d) return "";
  const t = new Date(String(d).replace(" ", "T"));
  if (isNaN(t)) return "";
  const today = new Date();
  if (t.toDateString() === today.toDateString()) return `${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}`;
  return t.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

export const mapConversation = (c) => ({
  convId: c.id,
  name: c.other_name || "Utilisateur",
  photo: c.other_avatar || null,
  lastMsg: c.last_message || "Nouvelle conversation",
  time: fmtWhen(c.last_message_at || c.created_at),
  type: c.type,
  orderId: c.order_id || null,
});

export default function ConversationList({ onOpen, emptyText = "Aucune conversation pour l'instant." }) {
  const { data, loading, error } = useLoad(() => chatAPI.getConversations());
  const list = (Array.isArray(data) ? data : []).map(mapConversation);

  if (loading) return <div style={{ padding: 16 }}><SkeletonList count={4} /></div>;
  if (error) return <div className="t-card tk-box t-sub" style={{ textAlign: "center" }}>{error}</div>;
  if (list.length === 0) return <div style={{ textAlign: "center", padding: "56px 24px" }}>
    <Icon name="chat" size={36} color="var(--t-mut)" />
    <div className="t-sub" style={{ marginTop: 10, fontSize: 14 }}>{emptyText}</div>
  </div>;

  return (
    <div className="t-card tk-box" style={{ padding: "0 16px" }}>
      {list.map((c, i) => (
        <div key={c.convId} onClick={() => onOpen(c)} role="button" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderTop: i ? "1px solid var(--t-line)" : "none", cursor: "pointer" }}>
          <span className="tk-av" style={{ width: 48, height: 48, fontSize: 18 }}>{c.photo ? <img src={c.photo} alt="" /> : c.name.charAt(0).toUpperCase()}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <b style={{ flex: 1, fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</b>
              <span className="t-mut" style={{ flexShrink: 0 }}>{c.time}</span>
            </div>
            <div className="t-sub" style={{ marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{TYPE_LABEL[c.type] ? TYPE_LABEL[c.type] + " · " : ""}{c.lastMsg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
