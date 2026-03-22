import { useState } from "react";
import toast from "../../utils/toast";

function VUpgradePlanScr({onBack,onUpgrade,currentPlan="starter"}){
  const plans=[
    ["starter","Starter","Gratuit","Pour démarrer",["10 articles max","8% commission","Support email","Stats basiques"]],
    ["pro","Pro","15 000 FCFA/mois","Le plus populaire",["Articles illimités","4% commission","Analytics avancés","Badge vérifié ✓","Support prioritaire","Promotions"]],
    ["enterprise","Enterprise","45 000 FCFA/mois","Pour les grandes boutiques",["Multi-établissements","2% commission","API complète","🌐 Site web personnalisé","Manager dédié","Dashboard personnalisé","Rapports avancés"]]
  ];
  const planOrder={starter:0,pro:1,enterprise:2};
  const upgradeable=plans.filter(([k])=>planOrder[k]>planOrder[currentPlan]);
  const [plan,setPlan]=useState(upgradeable.length>0?upgradeable[0][0]:"enterprise");
  const [done,setDone]=useState(false);
  const currentInfo=plans.find(([k])=>k===currentPlan);

  if(done)return(<div className="scr" style={{padding:16,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>🎉</div><h3 style={{fontSize:18,fontWeight:700}}>Plan mis à jour !</h3><p style={{fontSize:14,fontWeight:700,marginTop:8,color:plan==="enterprise"?"#F59E0B":"#F97316"}}>Plan {plan==="pro"?"Pro":"Enterprise"} activé</p><p style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Toutes les fonctionnalités sont maintenant débloquées.</p><button className="btn-primary" style={{marginTop:20}} onClick={()=>{onUpgrade(plan);onBack()}}>✅ Retour à la boutique</button></div></div>);
  return(<><div className="appbar"><button onClick={onBack}>←</button><h2>Changer de plan</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:16}}>
      <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:48,marginBottom:8}}>⬆️</div><h3 style={{fontSize:18,fontWeight:700}}>Boostez votre commerce</h3><p style={{fontSize:13,color:"var(--muted)"}}>Choisissez le plan qui correspond à vos ambitions</p></div>
      {currentInfo&&<div style={{padding:16,background:"var(--light)",borderRadius:16,marginBottom:14,opacity:.5}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h4 style={{fontSize:16,fontWeight:700}}>{currentInfo[1]}</h4><span style={{fontSize:13,color:"var(--muted)"}}>Plan actuel</span></div>
        <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>{currentInfo[4].join(" · ")}</p>
      </div>}
      {upgradeable.map(([k,n,pr,tag,f])=><div key={k} onClick={()=>setPlan(k)} style={{padding:16,background:"var(--card)",border:plan===k?"2px solid "+(k==="enterprise"?"#F59E0B":"#F97316"):"2px solid var(--border)",borderRadius:16,marginBottom:14,cursor:"pointer",position:"relative"}}>
        {k==="pro"&&currentPlan==="starter"&&<span style={{position:"absolute",top:-10,right:16,padding:"3px 10px",borderRadius:8,background:"#F97316",color:"#fff",fontSize:10,fontWeight:700}}>⭐ Recommandé</span>}
        {k==="enterprise"&&currentPlan==="pro"&&<span style={{position:"absolute",top:-10,right:16,padding:"3px 10px",borderRadius:8,background:"#F59E0B",color:"#fff",fontSize:10,fontWeight:700}}>🚀 Recommandé</span>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h4 style={{fontSize:16,fontWeight:700}}>{n}</h4><span style={{fontSize:14,fontWeight:700,color:k==="enterprise"?"#F59E0B":"#F97316"}}>{pr}</span></div>
        <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>{tag}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{f.map(x=><span key={x} style={{padding:"4px 10px",borderRadius:8,background:k==="enterprise"?"rgba(245,158,11,0.06)":"rgba(249,115,22,0.06)",color:k==="enterprise"?"#F59E0B":"#F97316",fontSize:10,fontWeight:600}}>✓ {x}</span>)}</div>
      </div>)}
      <div style={{paddingTop:24,paddingBottom:16}}><button className="btn-primary" style={{background:plan==="enterprise"?"linear-gradient(135deg,#F59E0B,#D97706)":undefined}} onClick={()=>setDone(true)}>⬆️ Passer au plan {plan==="pro"?"Pro":"Enterprise"}</button></div>
    </div>
  </>);
}

/* ═══════════════════════════════
   DRIVER SCREENS (10)
   ═══════════════════════════════ */

/* D1 ── DRIVER DASHBOARD ── */

export default VUpgradePlanScr;
