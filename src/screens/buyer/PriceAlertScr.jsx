import { useState } from "react";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";
function PriceAlertScr({onBack}){
  const [alerts]=useState([
    {id:1,name:"Galaxy A54",price:185000,target:160000,photo:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=80&h=80&fit=crop",active:true},
    {id:2,name:"Riz Parfumé 25kg",price:18000,target:15000,photo:"https://images.unsplash.com/photo-1516684732162-798a0062be99?w=80&h=80&fit=crop",active:true},
    {id:3,name:"Sac à Main Cuir",price:42000,target:35000,photo:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop",active:false},
  ]);
  const [alertsList,setAlerts]=useState(alerts);
  const toggle=(id)=>{setAlerts(prev=>prev.map(a=>a.id===id?{...a,active:!a.active}:a));toast.success("Alerte mise à jour 🔔")};
  const remove=(id)=>{setAlerts(prev=>prev.filter(a=>a.id!==id));toast.success("Alerte supprimée")};
  return(<div className="scr" style={{padding:16,paddingBottom:80}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>🔔 Alertes de prix</h2><div style={{width:38}}/></div>
    <p style={{fontSize:13,color:"var(--muted)",marginBottom:14}}>Recevez une notification quand le prix baisse.</p>
    {alertsList.map(a=><div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
      <div style={{width:48,height:48,borderRadius:12,overflow:"hidden",flexShrink:0}}><img src={a.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600}}>{a.name}</div>
        <div style={{fontSize:11,color:"var(--muted)"}}>Actuel: {fmt(a.price)}</div>
        <div style={{fontSize:11,color:"#10B981",fontWeight:600}}>Alerte: ≤ {fmt(a.target)}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
        <div className={`toggle ${a.active?"on":""}`} onClick={()=>toggle(a.id)} style={{transform:"scale(.8)"}}/>
        <button onClick={()=>remove(a.id)} style={{fontSize:10,color:"#EF4444",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>✕</button>
      </div>
    </div>)}
    {alertsList.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36}}>🔔</div><div style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Aucune alerte de prix</div><div style={{fontSize:11,color:"var(--sub)",marginTop:4}}>Ajoutez une alerte depuis la fiche produit</div></div>}
  </div>);
}
export default PriceAlertScr;
