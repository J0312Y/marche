import { useApp } from "../../context/AppContext";
import GuestBlockedView from "../../components/GuestBlockedView";
import ConversationList from "../../components/ConversationList";
import Icon from "../../components/Icon";

function ChatListScr({go,onBack}){
  const { isGuest, setTab, setScreen } = useApp();
  if (isGuest) return (<GuestBlockedView
      icon="chat"
      title="Discutez avec les vendeurs"
      subtitle="Connectez-vous pour poser vos questions aux vendeurs et suivre vos conversations."
      benefits={["Messages avec vendeurs", "Support livreurs", "Historique sauvegardé"]}
      accent="#10B981"
      onGoHome={()=>{setScreen(null);setTab(0)}}
    />);

  return(<div className="t-scr gray" style={{ minHeight: "100%" }}>
    <div className="t-head">{onBack && <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>}<h1>Messages</h1></div>
    <ConversationList onOpen={(c)=>c.type==="client_vendor"?go("chatVendor",{convId:c.convId,name:c.name,avatar:c.photo}):go("chatDriver",{convId:c.convId,name:c.name,avatar:c.photo})} emptyText="Aucune conversation. Contactez une boutique depuis une fiche produit."/>
  </div>);
}

export default ChatListScr;
