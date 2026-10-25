import NotificationList from "../../components/NotificationList";

function VNotifScr({ onBack, go }) {
  return <NotificationList onBack={onBack} openTarget={(n) => n.data?.order_id ? { label: "Voir la commande", onClick: () => go("vOrderDetail", { id: n.data.order_id }) } : null} />;
}

export default VNotifScr;
