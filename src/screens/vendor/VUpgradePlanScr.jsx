import { useState } from "react";

function VUpgradePlanScr({onBack,onUpgrade}){
  const [plan,setPlan]=useState("pro");
  const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:20,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>🎉</div><h3 style={{fontSize:18,fontWeight:700}}>Plan mis à jour !</h3><p style={{fontSize:14,color:"#6366F1",fontWeight:700,marginTop:8}}>Plan {plan==="pro"?"Pro":"Enterprise"} activé</p><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Toutes les fonctionnalités sont maintenant débloquées.</p><button className="btn-primary" style={{marginTop:20}} onClick={()=>{onUpgrade(plan);onBack()}}>✅ Retour à la boutique</button></div></div>);
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Changer de plan</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:48,marginBottom:8}}>⬆️</div><h3 style={{fontSize:18,fontWeight:700}}>Boostez votre boutique</h3><p style={{fontSize:13,color:"#908C82"}}>Choisissez le plan qui correspond à vos ambitions</p></div>
      <div style={{padding:16,background:"#F5F4F1",borderRadius:16,marginBottom:14,opacity:.5}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h4 style={{fontSize:16,fontWeight:700}}>Starter</h4><span style={{fontSize:13,color:"#908C82"}}>Plan actuel</span></div>
        <p style={{fontSize:12,color:"#908C82",marginTop:4}}>10 produits · 8% commission · Stats basiques</p>
      </div>
      {[["pro","Pro","15 000 FCFA/mois","Le plus populaire",["Produits illimités","4% commission","Analytics avancés","Badge vérifié ✓","Support prioritaire","Promotions"]],
        ["enterprise","Enterprise","45 000 FCFA/mois","Pour les grandes boutiques",["Multi-boutiques","2% commission","API complète","Manager dédié","Dashboard personnalisé","Rapports avancés"]]
      ].map(([k,n,pr,tag,f])=><div key={k} onClick={()=>setPlan(k)} style={{padding:16,background:"#fff",border:plan===k?"2px solid #6366F1":"1px solid #E8E6E1",borderRadius:16,marginBottom:14,cursor:"pointer",position:"relative"}}>
        {k==="pro"&&<span style={{position:"absolute",top:-10,right:16,padding:"3px 10px",borderRadius:8,background:"#6366F1",color:"#fff",fontSize:10,fontWeight:700}}>⭐ Recommandé</span>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h4 style={{fontSize:16,fontWeight:700}}>{n}</h4><span style={{fontSize:14,fontWeight:700,color:"#6366F1"}}>{pr}</span></div>
        <p style={{fontSize:12,color:"#908C82",marginTop:4}}>{tag}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{f.map(x=><span key={x} style={{padding:"4px 10px",borderRadius:8,background:"rgba(99,102,241,0.06)",color:"#6366F1",fontSize:10,fontWeight:600}}>✓ {x}</span>)}</div>
      </div>)}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}><button className="btn-primary" onClick={()=>setDone(true)}>⬆️ Passer au plan {plan==="pro"?"Pro":"Enterprise"}</button></div>
  </div>);
}

/* ═══════════════════════════════
   DRIVER SCREENS (10)
   ═══════════════════════════════ */

/* D1 ── DRIVER DASHBOARD ── */

export default VUpgradePlanScr;
