import ChatThread from "../../components/ChatThread";

function DrChatClientScr({ delivery: dl, onBack }) {
  const client = typeof dl?.client === "object" ? dl.client : { name: dl?.client_name || dl?.client };
  return (
    <ChatThread
      target={dl?.order_id ? { order_id: dl.order_id, with: "client" } : null}
      title={client?.name}
      subtitle={dl?.ref ? "Commande " + dl.ref : "Client"}
      phone={client?.phone}
      onBack={onBack}
      quickReplies={["Je suis en route", "Je suis arrivé", "Où êtes-vous exactement ?"]}
    />
  );
}

export default DrChatClientScr;
