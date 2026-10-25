import ChatThread from "../../components/ChatThread";

function VChatScr({ chat: c, onBack }) {
  return (
    <ChatThread
      target={c?.convId ? { convId: c.convId } : c?.orderId ? { order_id: c.orderId, with: "client" } : null}
      title={c?.name}
      avatar={c?.photo || c?.avatar}
      onBack={onBack}
    />
  );
}

export default VChatScr;
