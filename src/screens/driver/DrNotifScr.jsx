import { useState, useEffect } from "react";
import { getNotifications, onNotifChange, markPushRead, markAllRead as markAllPushRead } from "../../utils/notifStore";
import { D_NOTIFS } from "../../data/driverData";
import toast from "../../utils/toast";

function DrNotifScr({onBack}){
  const [notifs,setNotifs]=useState(D_NOTIFS.map((n,i)=>({...n,id:i})));
  const [expanded,setExpanded]=useState(null);
  const [pushNotifs,setPushNotifs]=useState(getNotifications());
  useEffect(()=>onNotifChange(setPushNotifs),[]);

  const markRead=(id)=>setNotifs(prev=>prev.map(n=>n.id===id?{...n,read:true}:n));
  const markAllRead=()=>{setNotifs(prev=>prev.map(n=>({...n,read:true})));markAllPushRead();toast.success('Toutes les notifications lues ✅')};
  const unreadCount=notifs.filter(n=>!n.read).length+pushNotifs.filter(n=>!n.read).length;

  const details={
    0:"Commande #CMD-0891 de Mode Afrique.\nClient: Marie Koumba\nAdresse: Bacongo, Rue 14\nArticles: Robe Wax (×2), Sac Cuir (×1)\nTotal: 92 000 FCFA\nFrais livraison: 2 500 FCFA",
    1:"Virement reçu sur votre compte Airtel Money.\nMontant: 2 500 FCFA\nRéférence: PAY-2026-0891\nSolde actuel: 198 000 FCFA",
    2:"David Tsaty vous a évalué après la livraison #CMD-0885.\nNote: ★★★★★ (5/5)\nCommentaire: 'Livreur très rapide et professionnel !'",
    3:"Félicitations ! Vous avez atteint 10 livraisons cette semaine.\nBonus: +5 000 FCFA crédité automatiquement.\nContinuez comme ça pour débloquer le bonus suivant à 20 livraisons !",
    4:"Les tarifs de livraison à Pointe-Noire seront mis à jour le 1er Mars 2026.\nZone centre: 2 000 FCFA → 2 500 FCFA\nZone périphérie: 3 000 FCFA → 3 500 FCFA\nConsultez la section Zones pour plus de détails.",
  };

  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Notifications {unreadCount>0&&<span style={{fontSize:12,color:"#F97316",fontWeight:600}}>({unreadCount})</span>}</h2>
    {unreadCount>0&&<button onClick={markAllRead} style={{fontSize:12,color:"#F97316",fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Tout lire</button>}</div>
    <div style={{padding:"0 0 20px"}}>
      {[...pushNotifs.map(p=>({id:p.id,icon:p.icon,title:p.title,desc:p.body,body:p.body,time:p.time,read:p.read,fromPush:true})),...notifs].map((n)=>{
        const isOpen=expanded===n.id;
        return(<div key={n.id} onClick={()=>{setExpanded(isOpen?null:n.id);if(!n.read){if(n.fromPush)markPushRead(n.id);else markRead(n.id)}}} style={{padding:"14px 20px",borderBottom:"1px solid var(--border)",cursor:"pointer",background:!n.read?"rgba(249,115,22,0.03)":"transparent",transition:"background .2s"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:!n.read?"rgba(249,115,22,0.08)":"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <h4 style={{fontSize:14,fontWeight:!n.read?700:600,color:"var(--text)",margin:0}}>{n.title}</h4>
                {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"#F97316",flexShrink:0,marginTop:5}}/>}
              </div>
              <p style={{fontSize:12,color:"var(--sub)",margin:"2px 0 0"}}>{n.desc}</p>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>{n.time}</div>
            </div>
          </div>
          {/* Expanded details */}
          {isOpen&&(details[n.id]||n.fromPush)&&<div style={{marginTop:10,marginLeft:52,padding:12,background:"var(--light)",borderRadius:12,fontSize:12,color:"var(--sub)",lineHeight:1.6,whiteSpace:"pre-line"}}>
            {details[n.id]||n.body||n.desc}
          </div>}
        </div>);
      })}
    </div>
  </div>);
}

export default DrNotifScr;
