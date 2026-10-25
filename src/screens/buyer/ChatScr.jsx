import ChatThread from "../../components/ChatThread";

// data : { orderId, name, avatar, phone } ou { convId, name, avatar }
function ChatScr({ data, onBack }) {
  const target = data?.convId ? { convId: data.convId } : data?.orderId ? { order_id: data.orderId, with: "driver" } : null;
  return (
    <ChatThread
      target={target}
      title={data?.name}
      subtitle={data?.convId ? null : "Votre livreur"}
      avatar={data?.avatar}
      phone={data?.phone}
      onBack={onBack}
      quickReplies={["Où êtes-vous ?", "Je suis devant chez moi", "Merci !"]}
    />
  );
}

export default ChatScr;
