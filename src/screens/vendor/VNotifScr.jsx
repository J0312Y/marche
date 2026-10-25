import NotificationList from "../../components/NotificationList";

function VNotifScr({ onBack, go }) {
  return <NotificationList onBack={onBack} openTarget={(n) => n.data?.order_id ? { label: "Voir la commande", onClick: () => go("vOrderDetail", { id: n.data.order_id }) }
    : n.data?.type === "question" ? { label: "Voir la question", onClick: () => go("vQuestions") }
    : n.data?.type === "settlement" ? { label: "Voir mes relevés", onClick: () => go("vStatements") } : null} />;
}

export default VNotifScr;
