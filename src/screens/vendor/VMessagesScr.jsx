import ConversationList from "../../components/ConversationList";
import Icon from "../../components/Icon";

/** Messages du commerce : clients et livreurs (conversations réelles). */
function VMessagesScr({ go, onBack }) {
  return (
    <div className="t-scr gray" style={{ minHeight: "100%" }}>
      <div className="t-head">{onBack && <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>}<h1>Messages</h1></div>
      <ConversationList onOpen={(c) => go(c.type === "vendor_driver" ? "vDriverChat" : "vChat", c.type === "vendor_driver" ? { convId: c.convId, name: c.name, avatar: c.photo } : c)} emptyText="Aucun message pour l'instant." />
    </div>
  );
}

export default VMessagesScr;
