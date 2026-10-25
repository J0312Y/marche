import ChatThread from "../../components/ChatThread";

function VDriverChatScr({ delivery: d, onBack }) {
  const orderId = d?.order_id || d?.orderId;
  return (
    <ChatThread
      target={d?.convId ? { convId: d.convId } : orderId ? { order_id: orderId, with: "driver" } : null}
      title={typeof d?.driver === "string" ? d.driver : d?.name}
      subtitle={d?.ref ? "Livraison " + d.ref : "Livreur"}
      avatar={d?.driverAv || d?.avatar}
      phone={d?.phone}
      onBack={onBack}
      accent="#6366F1"
    />
  );
}

export default VDriverChatScr;
