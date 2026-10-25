import ChatThread from "../../components/ChatThread";

// data : objet boutique (VendorScr), { vendorName, vendorAvatar, establishment_id } (fiche produit)
// ou { orderId, name, avatar } (suivi de commande : conversation liée à la commande)
function ChatVendorScr({ vendor, onBack }) {
  const establishmentId = vendor?.establishment_id || (vendor?.convId || vendor?.orderId ? null : vendor?.id);
  const target = vendor?.convId ? { convId: vendor.convId }
    : vendor?.orderId ? { order_id: vendor.orderId, with: "vendor" }
    : establishmentId ? { establishment_id: establishmentId } : null;
  return (
    <ChatThread
      target={target}
      title={vendor?.vendorName || vendor?.name}
      subtitle="Boutique"
      avatar={vendor?.logo || vendor?.avatar || null}
      onBack={onBack}
      quickReplies={["Ce produit est-il disponible ?", "Vous livrez dans mon quartier ?", "Quels sont vos horaires ?"]}
    />
  );
}

export default ChatVendorScr;
