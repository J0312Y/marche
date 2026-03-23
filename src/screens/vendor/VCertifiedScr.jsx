import { useState } from "react";
import toast from "../../utils/toast";

function VCertifiedScr({onBack}){
  const [badge,setBadge]=useState("gold");
  const BADGES=[
    {id:"gold",name:"Or",icon:"🥇",color:"#F59E0B",benefits:["Position #1 dans les recherches","Badge doré visible partout","Vitrine premium sur l'accueil","Support prioritaire 2h"]},
    {id:"diamond",name:"Diamant",icon:"💎",color:"#3B82F6",benefits:["Tout le badge Or","Page boutique personnalisée","Bannière sponsorisée gratuite","Manager dédié","Accès beta features"]},
  ];
  const sel=BADGES.find(b=>b.id===badge);

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>💎 Boutique Certifiée</h2><div style={{width:38}}/></div>

    <div style={{textAlign:"center",padding:"16px 0 20px"}}>
      <div style={{fontSize:48,marginBottom:8}}>{sel.icon}</div>
      <h3 style={{fontSize:20,fontWeight:800,color:sel.color}}>Badge {sel.name}</h3>
      <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Démarquez-vous de la concurrence</p>
    </div>

    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {BADGES.map(b=>(
        <div key={b.id} onClick={()=>setBadge(b.id)} style={{flex:1,padding:14,textAlign:"center",borderRadius:14,border:badge===b.id?`2px solid ${b.color}`:"1px solid var(--border)",background:badge===b.id?b.color+"08":"var(--card)",cursor:"pointer"}}>
          <div style={{fontSize:28}}>{b.icon}</div>
          <div style={{fontSize:13,fontWeight:700,marginTop:4,color:badge===b.id?b.color:"var(--text)"}}>{b.name}</div>
        </div>
      ))}
    </div>

    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Avantages inclus</div>
      {sel.benefits.map((b,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderTop:i?"1px solid var(--border)":"none"}}>
          <span style={{color:sel.color,fontSize:14}}>✓</span>
          <span style={{fontSize:13}}>{b}</span>
        </div>
      ))}
    </div>

    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Aperçu du badge</div>
      <div style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>Voici comment votre boutique apparaîtra</div>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:12,background:"var(--light)",borderRadius:12}}>
        <div style={{width:40,height:40,borderRadius:12,background:sel.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏪</div>
        <div><div style={{fontSize:14,fontWeight:700}}>Ma Boutique <span style={{color:sel.color}}>{sel.icon}</span></div><div style={{fontSize:11,color:"var(--muted)"}}>Boutique certifiée {sel.name} · ⭐ 4.8</div></div>
      </div>
    </div>

    <button onClick={()=>toast.success(sel.icon+" Badge "+sel.name+" activé !")} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:sel.color,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Activer le badge {sel.name}</button>
  </div>);
}
export default VCertifiedScr;
