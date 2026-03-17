import { useState } from "react";
import toast from "../../utils/toast";
import { fmt, getVendorPromo } from "../../utils/helpers";
import { useData } from "../../hooks";

function CheckoutScr({onBack,onDone,cart=[],appliedCoupon,setAppliedCoupon}){
  const [step,setStep]=useState(0);const [momo,setMomo]=useState("airtel");const [ok,setOk]=useState(false);const [saveAddr,setSaveAddr]=useState(true);const [schedule,setSchedule]=useState("now");const [schedDate,setSchedDate]=useState("");const [schedTime,setSchedTime]=useState("10:00-12:00");
  const momos=[{k:"airtel",n:"Airtel Money",e:"🔴"},{k:"mtn",n:"MTN MoMo",e:"🟡"},{k:"kolo",n:"Kolo Pay",e:"🟣"}];
  const { VENDORS } = useData();

  const getItem=(c)=>c.product||c;
  const getPrice=(c)=>{const p=getItem(c);const vp=getVendorPromo(p,VENDORS);return vp?vp.promoPrice:(p.price||0)};
  const sub=cart.reduce((s,c)=>s+getPrice(c)*(c.qty||1),0)||228500;
  const del=2500;
  const discountAmount=appliedCoupon?(appliedCoupon.free?0:Math.round(sub*appliedCoupon.discount/100)):0;
  const freeDelivery=appliedCoupon?.free||false;
  const finalDelivery=freeDelivery?0:del;
  const total=sub-discountAmount+finalDelivery;

  const handleConfirm=()=>{
    setOk(true);toast.success("Commande confirmée ! 🎉");if(saveAddr)toast.info("Adresse sauvegardée 📍");
    if(setAppliedCoupon) setAppliedCoupon(null);
  };

  return(<>
    <div className="appbar"><button onClick={()=>step>0?setStep(step-1):onBack?.()}>←</button><h2>Paiement</h2><div style={{width:38}}/></div>
    <div className="steps">{["Adresse","Paiement","Confirmer"].map((s,i)=><div key={s} style={{display:"contents"}}>{i>0&&<div className={`sline ${step>=i?"on":""}`}/>}<div className="step-col"><div className={`sdot ${step>i?"on":step>=i?"on":""}`}>{step>i?"✓":i+1}</div><div className={`slbl ${step>=i?"on":""}`}>{s}</div></div></div>)}</div>
    <div className="scr" style={{padding:16}}>
      {step===0&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:14}}>Adresse de livraison</h3>
        <div className="field"><label>Nom complet</label><input defaultValue="Joeldy Tsina"/></div>
        <div className="field"><label>Téléphone</label><input defaultValue="+242 064 663 469"/></div>
        <div className="field"><label>Adresse</label><input placeholder="Quartier, Rue, N°"/></div>
        <div className="field-row"><div className="field"><label>Ville</label><input defaultValue="Brazzaville"/></div><div className="field"><label>Pays</label><input defaultValue="Congo 🇨🇬"/></div></div>
        <div style={{marginTop:12,fontSize:13,fontWeight:700,marginBottom:8}}>📅 Quand livrer ?</div>
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          {[["now","🚀 Maintenant"],["later","📅 Programmer"]].map(([k,l])=><button key={k} onClick={()=>setSchedule(k)} style={{flex:1,padding:10,borderRadius:12,border:schedule===k?"2px solid #6366F1":"1px solid var(--border)",background:schedule===k?"rgba(99,102,241,0.06)":"var(--card)",fontSize:12,fontWeight:schedule===k?700:500,color:schedule===k?"#6366F1":"var(--text)",cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
        </div>
        {schedule==="later"&&<div className="field-row"><div className="field"><label>Date</label><input type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)}/></div><div className="field"><label>Créneau</label><select value={schedTime} onChange={e=>setSchedTime(e.target.value)}><option>08:00-10:00</option><option>10:00-12:00</option><option>12:00-14:00</option><option>14:00-16:00</option><option>16:00-18:00</option><option>18:00-20:00</option></select></div></div>}
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}><div className={`toggle ${saveAddr?"on":""}`} onClick={()=>setSaveAddr(!saveAddr)} style={{transform:"scale(.8)"}}/><span style={{fontSize:12,color:"var(--muted)"}}>Sauvegarder cette adresse</span></div></>}

      {step===1&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:6}}>Mode de paiement</h3><p style={{fontSize:13,color:"var(--muted)",marginBottom:14}}>Mobile Money</p>
        {momos.map(m=><div key={m.k} className={`momo ${momo===m.k?"on":""}`} onClick={()=>setMomo(m.k)}><span className="me">{m.e}</span><span className="mn">{m.n}</span>{momo===m.k&&<span className="mc">✓</span>}</div>)}
        <div className="field" style={{marginTop:18}}><label>Numéro</label><input placeholder="+242 06X XXX XXX"/></div></>}

      {step===2&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:14}}>Résumé</h3>
        <div className="confirm-card" style={{cursor:"pointer"}} onClick={()=>setStep(0)}><span className="cci">📍</span><div className="ccb"><small>Livraison {schedule==="later"?`· ${schedDate} ${schedTime}`:""}</small><p>Brazzaville, Congo 🇨🇬</p></div><span className="cce" style={{color:"#6366F1",fontWeight:600}}>✏️</span></div>
        <div className="confirm-card" style={{cursor:"pointer"}} onClick={()=>setStep(1)}><span className="cci">📱</span><div className="ccb"><small>Paiement</small><p>{momos.find(m=>m.k===momo)?.n}</p></div><span className="cce" style={{color:"#6366F1",fontWeight:600}}>✏️</span></div>

        {/* Applied coupon */}
        {appliedCoupon&&<div className="confirm-card" style={{background:"rgba(16,185,129,0.04)",border:"1px solid rgba(16,185,129,0.15)"}}><span className="cci">🏷️</span><div className="ccb"><small>Code promo</small><p style={{color:"#10B981",fontWeight:600}}>{appliedCoupon.code} — {appliedCoupon.free?"Livraison gratuite":`-${appliedCoupon.discount}%`}</p></div></div>}

        <div style={{marginTop:16}}>
          <div className="cs-row"><span>Sous-total</span><b>{fmt(sub)}</b></div>
          {discountAmount>0&&<div className="cs-row" style={{color:"#10B981"}}><span>🏷️ {appliedCoupon.code} (-{appliedCoupon.discount}%)</span><b>-{fmt(discountAmount)}</b></div>}
          <div className="cs-row">
            <span>Livraison</span>
            {freeDelivery?<span><b style={{textDecoration:"line-through",color:"var(--muted)"}}>{fmt(del)}</b><b style={{color:"#10B981",marginLeft:6}}>GRATUIT</b></span>:<b>{fmt(del)}</b>}
          </div>
          <div className="cs-row tot"><span>Total</span><span className="ctp">{fmt(total)}</span></div>
          {(discountAmount>0||freeDelivery)&&<div style={{textAlign:"center",fontSize:11,color:"#10B981",fontWeight:600,marginTop:4}}>🎉 Économie : {fmt(discountAmount+(freeDelivery?del:0))}</div>}
        </div></>}

      <div style={{paddingTop:24,paddingBottom:16}}><button className="btn-primary" onClick={()=>step<2?setStep(step+1):handleConfirm()}>{step===2?"Confirmer le paiement":"Continuer"}</button></div>
    </div>

    {ok&&<div className="success-modal"><div className="success-box"><div className="si">✅</div><h2>Commande confirmée !</h2><p>Vérifiez votre téléphone pour le paiement.</p><div className="ref">#LMK-2026-0214</div>
      {appliedCoupon&&<div style={{fontSize:12,color:"#10B981",fontWeight:600,marginTop:8}}>🏷️ Code {appliedCoupon.code} appliqué</div>}
      <button className="btn-primary" onClick={onDone}>Retour à l'accueil</button></div></div>}
  </>);
}

export default CheckoutScr;
