import ChatThread from "../../components/ChatThread";

function DrChatVendorScr({ delivery: dl, onBack }) {
  const vendor = typeof dl?.vendor === "object" ? dl.vendor : { name: dl?.establishment_name || dl?.vendor };
  return (
    <ChatThread
      target={dl?.order_id ? { order_id: dl.order_id, with: "vendor" } : null}
      title={vendor?.name}
      subtitle={dl?.ref ? "Commande " + dl.ref : "Commerce"}
      avatar={vendor?.logo || null}
      phone={vendor?.phone}
      onBack={onBack}
      quickReplies={["J'arrive pour le retrait", "Le colis est-il prêt ?"]}
    />
  );
}

export default DrChatVendorScr;
