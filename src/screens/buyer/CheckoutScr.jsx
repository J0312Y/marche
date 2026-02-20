import { useState } from "react";

function CheckoutScr({onDone}){
  const [step,setStep]=useState(0);const [momo,setMomo]=useState("airtel");const [ok,setOk]=useState(false);
  const momos=[{k:"airtel",n:"Airtel Money",e:"🔴"},{k:"mtn",n:"MTN MoMo",e:"🟡"},{k:"kolo",n:"Kolo Pay",e:"🟣"}];
  return(<div style={{display:"flex",flexDirection:"column",height:"100%",position:"relative"}}>
    <div className="appbar"><button onClick={()=>step>0?setStep(step-1):null}>←</button><h2>Paiement</h2><div style={{width:38}}/></div>
    <div className="steps">{["Adresse","Paiement","Confirmer"].map((s,i)=><div key={s} style={{display:"contents"}}>{i>0&&<div className={`sline ${step>=i?"on":""}`}/>}<div className="step-col"><div className={`sdot ${step>i?"on":step>=i?"on":""}`}>{step>i?"✓":i+1}</div><div className={`slbl ${step>=i?"on":""}`}>{s}</div></div></div>)}</div>
    <div className="scr" style={{padding:20}}>
      {step===0&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:18}}>Adresse de livraison</h3>
        <div className="field"><label>Nom complet</label><input defaultValue="Joeldy Tsina"/></div>
        <div className="field"><label>Téléphone</label><input defaultValue="+242 064 663 469"/></div>
        <div className="field"><label>Adresse</label><input placeholder="Quartier, Rue, N°"/></div>
        <div className="field-row"><div className="field"><label>Ville</label><input defaultValue="Brazzaville"/></div><div className="field"><label>Pays</label><input defaultValue="Congo 🇨🇬"/></div></div></>}
      {step===1&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:6}}>Mode de paiement</h3><p style={{fontSize:13,color:"#908C82",marginBottom:18}}>Mobile Money</p>
        {momos.map(m=><div key={m.k} className={`momo ${momo===m.k?"on":""}`} onClick={()=>setMomo(m.k)}><span className="me">{m.e}</span><span className="mn">{m.n}</span>{momo===m.k&&<span className="mc">✓</span>}</div>)}
        <div className="field" style={{marginTop:18}}><label>Numéro</label><input placeholder="+242 06X XXX XXX"/></div></>}
      {step===2&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:18}}>Résumé</h3>
        <div className="confirm-card" style={{cursor:"pointer"}} onClick={()=>setStep(0)}><span className="cci">📍</span><div className="ccb"><small>Livraison</small><p>Brazzaville, Congo 🇨🇬</p></div><span className="cce" style={{color:"#6366F1",fontWeight:600}}>✏️ Modifier</span></div>
        <div className="confirm-card" style={{cursor:"pointer"}} onClick={()=>setStep(1)}><span className="cci">📱</span><div className="ccb"><small>Paiement</small><p>{momos.find(m=>m.k===momo)?.n}</p></div><span className="cce" style={{color:"#6366F1",fontWeight:600}}>✏️ Modifier</span></div>
        <div style={{marginTop:16}}><div className="cs-row"><span>Sous-total</span><b>228 500 FCFA</b></div><div className="cs-row"><span>Livraison</span><b>2 500 FCFA</b></div><div className="cs-row tot"><span>Total</span><span className="ctp">231 500 FCFA</span></div></div></>}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}><button className="btn-primary" onClick={()=>step<2?setStep(step+1):setOk(true)}>{step===2?"Confirmer le paiement":"Continuer"}</button></div>
    {ok&&<div className="success-modal"><div className="success-box"><div className="si">✅</div><h2>Commande confirmée !</h2><p>Vérifiez votre téléphone pour le paiement.</p><div className="ref">#LMK-2026-0214</div><button className="btn-primary" onClick={onDone}>Retour à l'accueil</button></div></div>}
  </div>);
}

/* 17 ── ORDERS ── */

export default CheckoutScr;
