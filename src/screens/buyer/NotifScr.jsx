import GuestBlockedView from "../../components/GuestBlockedView";
import NotificationList from "../../components/NotificationList";
import { useApp, openBroadcast } from "../../context/AppContext";
import { useData } from "../../hooks";

// Bouton d'un message envoyé depuis le panneau, selon sa destination
const BROADCAST_LABEL = { store: "Voir le commerce", screen: "Ouvrir", url: "Ouvrir le lien" };

function NotifScr({ onBack, go }) {
  const { isGuest, setTab, setScreen } = useApp();
  const { P } = useData();
  if (isGuest) return (<GuestBlockedView
      icon="bell"
      title="Restez informé"
      subtitle="Connectez-vous pour recevoir les notifications de commandes, promos et messages."
      benefits={["Promos exclusives", "Mises à jour commandes", "Messages vendeurs"]}
      accent="#F97316"
      onGoHome={()=>{setScreen(null);setTab(0)}}
    />);

  const target = (n) => {
    const d = n.data || {};
    if (d.order_id) return { label: "Voir la commande", onClick: () => go("tracking", { id: d.order_id }) };
    // Question / réponse sur un article : ouvrir la fiche (onglet Questions)
    if (d.type === "question" && d.article_id) {
      const p = P.find((x) => Number(x.id) === Number(d.article_id));
      return { label: "Voir la question", onClick: () => (p ? go("detail", p) : go("vendor", { id: d.establishment_id })) };
    }
    if (d.type === "broadcast" && BROADCAST_LABEL[d.action_type]) {
      return { label: BROADCAST_LABEL[d.action_type], onClick: () => openBroadcast(d, { nav: go, buyer: true, toCourier: () => { setScreen(null); setTab(2); } }) };
    }
    return null;
  };
  return <NotificationList onBack={onBack} openTarget={target} />;
}

export default NotifScr;
