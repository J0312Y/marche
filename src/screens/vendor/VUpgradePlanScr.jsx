import { useState } from "react";
import toast from "../../utils/toast";
import PayLogo from "../../components/PayLogos";
import { validatePayPhone, getPhonePlaceholder, isPayPhoneValid } from "../../utils/phoneValidation";

function VUpgradePlanScr({onBack,onUpgrade,currentPlan="starter"}){
  const plans=[
    ["starter","Starter","Gratuit","Pour démarrer",["10 articles max","8% commission","Support email","Stats basiques"]],
    ["pro","Pro","15 000 FCFA/mois","Le plus populaire",["Articles illimités","4% commission","Analytics avancés","Badge vérifié ✓","Support prioritaire","Promotions"]],
    ["enterprise","Enterprise","45 000 FCFA/mois","Pour les grandes boutiques",["Multi-établissements","2% commission","API complète","🌐 Site web","Manager dédié","🌟 Thèmes","📧 Email Marketing","💰 Remises auto","📊 Analytics","🔗 Domaine custom","📤 Import/Export","🌍 SEO"]]
  ];
  const planOrder={starter:0,pro:1,enterprise:2};
  const upgradeable=plans.filter(([k])=>planOrder[k]>planOrder[currentPlan]);
  const [plan,setPlan]=useState(upgradeable.length>0?upgradeable[0][0]:"enterprise");
  const [done,setDone]=useState(false);
  const [showPay,setShowPay]=useState(false);
  const [payMethod,setPayMethod]=useState("airtel");
  const [payPhone,setPayPhone]=useState("");
  const [paying,setPaying]=useState(false);
  const [payDone,setPayDone]=useState(false);
  const [payPhoneErr,setPayPhoneErr]=useState("");
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
      <div style={{paddingTop:24,paddingBottom:16}}><button className="btn-primary" style={{background:plan==="enterprise"?"linear-gradient(135deg,#F59E0B,#D97706)":undefined}} onClick={()=>setShowPay(true)}>💳 Passer au plan {plan==="pro"?"Pro":"Enterprise"}</button></div>
    </div>

    {showPay&&<div onClick={()=>!paying&&setShowPay(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:340,background:"var(--card)",borderRadius:20,padding:20}}>
        {payDone?<div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:48,marginBottom:12}}>✅</div>
          <h3 style={{fontSize:18,fontWeight:700}}>Paiement confirmé !</h3>
          <p style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Plan {plan==="pro"?"Pro":"Enterprise"} activé</p>
        </div>:<>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:32,marginBottom:6}}>💳</div>
            <h3 style={{fontSize:16,fontWeight:700}}>Paiement — Plan {plan==="pro"?"Pro":"Enterprise"}</h3>
          </div>
          <div style={{padding:14,background:"var(--light)",borderRadius:14,textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:10,color:"var(--muted)"}}>Montant mensuel</div>
            <div style={{fontSize:26,fontWeight:800,color:plan==="enterprise"?"#F59E0B":"#F97316"}}>{plan==="pro"?"15 000":"45 000"} F</div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>Renouvelé chaque mois · Annulable à tout moment</div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {[["airtel","Airtel Money"],["mtn","MTN MoMo"],["kolo","Kolo Pay"]].map(([k,n])=>(
              <div key={k} onClick={()=>{setPayMethod(k);setPayPhoneErr("")}} style={{flex:1,padding:"8px 4px",textAlign:"center",borderRadius:10,border:payMethod===k?"2px solid #F97316":"1px solid var(--border)",background:payMethod===k?"rgba(249,115,22,0.06)":"var(--card)",cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"center"}}><PayLogo method={k} size={24}/></div><div style={{fontSize:9,fontWeight:600,marginTop:2}}>{n}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",border:"1px solid var(--border)",borderRadius:12,background:"var(--light)",marginBottom:12}}>
            <span style={{fontSize:13,fontWeight:600,flexShrink:0}}>+242</span>
            <input value={payPhone} onChange={e=>{const v=e.target.value.replace(/[^0-9]/g,"").slice(0,9);setPayPhone(v);setPayPhoneErr("")}} placeholder={getPhonePlaceholder(payMethod)} type="tel" maxLength={11} style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",fontFamily:"inherit",color:"var(--text)"}}/>
          </div>
          {payPhoneErr&&<div style={{fontSize:11,color:"#EF4444",marginTop:4}}>{payPhoneErr}</div>}
          <div style={{padding:10,background:"rgba(59,130,246,0.06)",borderRadius:10,fontSize:11,color:"var(--muted)",marginBottom:14,lineHeight:1.5}}>
            📱 Validez le paiement depuis l'app {payMethod==="airtel"?"Airtel Money":payMethod==="mtn"?"MTN MoMo":"Kolo Pay"}.
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowPay(false)} disabled={paying} style={{flex:1,padding:11,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Annuler</button>
            <button onClick={()=>{const err=validatePayPhone(payPhone,payMethod);if(err){setPayPhoneErr(err);return}setPaying(true);setTimeout(()=>{setPaying(false);setPayDone(true);setTimeout(()=>{setShowPay(false);setDone(true)},1500)},3000)}} disabled={paying||!isPayPhoneValid(payPhone,payMethod)} style={{flex:1,padding:11,borderRadius:12,border:"none",background:isPayPhoneValid(payPhone,payMethod)?(plan==="enterprise"?"linear-gradient(135deg,#F59E0B,#D97706)":"#F97316"):"var(--border)",color:isPayPhoneValid(payPhone,payMethod)?"#fff":"var(--muted)",fontSize:13,fontWeight:700,cursor:isPayPhoneValid(payPhone,payMethod)?"pointer":"not-allowed",fontFamily:"inherit"}}>
              {paying?"⏳ Validation...":"💳 Payer "+(plan==="pro"?"15 000":"45 000")+" F"}
            </button>
          </div>
        </>}
      </div>
    </div>}
  </>);
}

/* ═══════════════════════════════
   DRIVER SCREENS (10)
   ═══════════════════════════════ */

/* D1 ── DRIVER DASHBOARD ── */

/* Payment handled in modal within component */
export default VUpgradePlanScr;
