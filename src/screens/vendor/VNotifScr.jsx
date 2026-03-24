import { useState, useEffect } from "react";
import { getNotifications, onNotifChange } from "../../utils/notifStore";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonList } from "../../components/Loading";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";

const DETAILS = {
  0: { full: "Commande #CMD-0891 de Marie Koumba\n\nArticles :\n• Robe Wax Moderne × 2 — 50 000 FCFA\n• Sac à Main Cuir × 1 — 42 000 FCFA\n\nTotal : 92 000 FCFA\nPaiement : Airtel Money ✅\nAdresse : Bacongo, Rue 14, N°42", action: "vOrdersList", actionLabel: "📦 Voir la commande" },
  1: { full: "Paiement confirmé par MTN MoMo.\n\nCommande : #CMD-0890\nMontant : 18 000 FCFA\nClient : Patrick Mbemba\nFrais Lamuka (4%) : 720 FCFA\nNet reçu : 17 280 FCFA\n\nLe montant sera disponible dans votre portefeuille sous 24h.", action: "vWallet", actionLabel: "💰 Voir le portefeuille" },
  2: { full: "Marie K. a noté votre boutique :\n\n⭐⭐⭐⭐⭐ (5/5)\n\"Robe magnifique ! Qualité au top. Je recommande cette boutique à 100%.\"\n\nProduit : Robe Wax Moderne\nDate : 14 Fév 2026", action: "vReviews", actionLabel: "⭐ Voir les avis" },
  3: { full: "Attention ! Le produit suivant est bientôt en rupture :\n\n👜 Sac à Main Cuir\nStock actuel : 3 unités\nVentes ce mois : 12 unités\n\nAu rythme actuel, rupture estimée dans 5 jours. Pensez à réapprovisionner.", action: "vProducts", actionLabel: "📦 Gérer le stock" },
  4: { full: "Résumé de la semaine (7-14 Fév) :\n\n💰 Revenus : 583 000 FCFA (+23%)\n📦 Commandes : 14 (+18%)\n👁️ Visiteurs : 412 (+12%)\n⭐ Note : 4.6/5\n\n🏆 Meilleur article : Sac à Main Cuir (8 ventes)\n📈 Votre boutique est dans le Top 5 de Brazzaville !", action: "vStats", actionLabel: "📈 Voir les statistiques" },
};

function VNotifScr({onBack,go}){
  const { data: rawNotifs, loading } = useLoad(() => vendor.getNotifications());
  const [notifs,setNotifs]=useState(null);
  const [expanded,setExpanded]=useState(null);
  const [pushNotifs,setPushNotifs]=useState(getNotifications());
  useEffect(()=>onNotifChange(setPushNotifs),[]);

  const pushItems=pushNotifs.map(p=>({id:p.id,icon:p.icon,title:p.title,desc:p.body,time:p.time,read:p.read}));
  const items=[...pushItems,...(notifs||(rawNotifs||[]))];
  const unreadCount=items.filter(n=>!n.read).length;

  const markRead=(idx)=>setNotifs((notifs||rawNotifs||[]).map((n,i)=>i===idx?{...n,read:true}:n));
  const markAllRead=()=>{setNotifs((notifs||rawNotifs||[]).map(n=>({...n,read:true})));toast.success("Tout marqué comme lu ✅")};

  const handleClick=(n,idx)=>{
    if(!n.read) markRead(idx);
    setExpanded(expanded===idx?null:idx);
  };

  return(<PullToRefresh onRefresh={async()=>{toast.success("Notifications actualisées 🔔")}}><div className="scr">
    <div className="appbar">
      <button onClick={onBack}>←</button>
      <h2>Notifications {unreadCount>0&&<span style={{fontSize:13,color:"#F97316",fontWeight:600}}>({unreadCount})</span>}</h2>
      {unreadCount>0&&<button onClick={markAllRead} style={{fontSize:11,color:"#F97316",fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Tout lire</button>}
    </div>

    {loading?<SkeletonList count={5}/>:items.length===0?(
      <div style={{textAlign:"center",padding:"60px 16px"}}><div style={{fontSize:48,marginBottom:10}}>🔔</div><h3 style={{fontSize:16,fontWeight:700}}>Aucune notification</h3><p style={{fontSize:13,color:"var(--muted)"}}>Les nouvelles commandes et mises à jour apparaîtront ici</p></div>
    ):(
      <div style={{paddingBottom:20}}>
        {items.map((n,idx)=>{
          const isOpen=expanded===idx;
          const detail=DETAILS[idx];
          return(
            <div key={idx} onClick={()=>handleClick(n,idx)} style={{
              padding:"12px 16px",borderBottom:"1px solid var(--border)",cursor:"pointer",
              background:!n.read?"rgba(249,115,22,0.03)":"transparent",
            }}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"#F97316",flexShrink:0,marginTop:8}}/>}
                <div style={{width:42,height:42,borderRadius:12,background:!n.read?"rgba(249,115,22,0.08)":"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <h4 style={{fontSize:13,fontWeight:!n.read?700:600,color:"var(--text)",margin:0}}>{n.title}</h4>
                    <span style={{fontSize:10,color:"var(--muted)",flexShrink:0,marginLeft:6}}>{isOpen?"▾":"›"}</span>
                  </div>
                  <p style={{fontSize:12,color:"var(--sub)",margin:"2px 0 0",lineHeight:1.4}}>{n.desc}</p>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>{n.time}</div>
                </div>
              </div>

              {isOpen&&detail&&(
                <div style={{marginTop:10,marginLeft:!n.read?20:0,padding:12,background:"var(--light)",borderRadius:12,border:"1px solid var(--border)"}}>
                  <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.7,whiteSpace:"pre-line"}}>{detail.full}</div>
                  {detail.action&&go&&(
                    <button onClick={e=>{e.stopPropagation();go(detail.action)}} style={{marginTop:10,width:"100%",padding:"10px 0",borderRadius:10,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                      {detail.actionLabel}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div></PullToRefresh>);
}

export default VNotifScr;
