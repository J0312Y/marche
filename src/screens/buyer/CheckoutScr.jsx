import DatePicker from "../../components/DatePicker";
import { useState } from "react";
import Select from "../../components/Select";
import toast from "../../utils/toast";
import PayLogo from "../../components/PayLogos";
import { validatePayPhone, getPhonePlaceholder } from "../../utils/phoneValidation";
import { fmt, getVendorPromo } from "../../utils/helpers";
import { useData } from "../../hooks";

function CheckoutScr({onBack,onDone,cart=[],appliedCoupon,setAppliedCoupon}){
  const [step,setStep]=useState(0);const [momo,setMomo]=useState("airtel");const [ok,setOk]=useState(false);
  const [ckAddr,setCkAddr]=useState("");
  const [ckPhone,setCkPhone]=useState("064663469");
  const [ckPhoneErr,setCkPhoneErr]=useState("");const [saveAddr,setSaveAddr]=useState(true);
  const [giftCode,setGiftCode]=useState("");
  const [giftApplied,setGiftApplied]=useState(null);const [schedule,setSchedule]=useState("now");const [schedDate,setSchedDate]=useState("");const [schedTime,setSchedTime]=useState("10:00-12:00");
  const momos=[{k:"airtel",n:"Airtel Money"},{k:"mtn",n:"MTN MoMo"},{k:"kolo",n:"Kolo Pay"},{k:"cash",n:"Paiement à la livraison"}];
  const { VENDORS } = useData();

  const getItem=(c)=>c.product||c;
  const getPrice=(c)=>{const p=getItem(c);const vp=getVendorPromo(p,VENDORS);return vp?vp.promoPrice:(p.price||0)};
  const sub=cart.reduce((s,c)=>s+(getPrice(c)+(c.sidesTotal||0))*(c.qty||1),0)||228500;
  const del=2500;
  const discountAmount=appliedCoupon?(appliedCoupon.free?0:Math.round(sub*appliedCoupon.discount/100)):0;
  const freeDelivery=appliedCoupon?.free||false;
  const finalDelivery=freeDelivery?0:del;
  const giftDeduct=giftApplied?Math.min(giftApplied.remaining,sub-discountAmount+finalDelivery):0;
  const total=Math.max(0,sub-discountAmount+finalDelivery-giftDeduct);

  const validateStep0=()=>{
    if(!ckAddr.trim()&&step===0){toast.error("Entrez votre adresse de livraison");return false}
    return true;
  };
  const validateCheckout=()=>{if(!momo){toast.error("Choisissez un moyen de paiement");return false}return true};
  const handleConfirm=()=>{
    setOk(true);toast.success("Commande confirmée ! 🎉");if(saveAddr)toast.info("Adresse sauvegardée 📍");
    if(setAppliedCoupon) setAppliedCoupon(null);
  };

  return(<>
    <div className="appbar"><button onClick={()=>step>0?setStep(step-1):onBack?.()}>←</button><h2>Paiement</h2><div style={{width:38}}/></div>
    <div className="steps">{["Adresse","Paiement","Confirmer"].map((s,i)=><div key={s} style={{display:"contents"}}>{i>0&&<div className={`sline ${step>=i?"on":""}`}/>}<div className="step-col"><div className={`sdot ${step>i?"on":step>=i?"on":""}`}>{step>i?"✓":i+1}</div><div className={`slbl ${step>=i?"on":""}`}>{s}</div></div></div>)}</div>
    <div className="scr" style={{padding:16}}>
      {step===0&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:14}}>Adresse de livraison</h3>
        <div className="field"><label>Nom complet <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="Joeldy Tsina"/></div>
        <div className="field"><label>Téléphone <span style={{color:"#EF4444"}}>*</span></label><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,fontWeight:600,flexShrink:0}}>+242</span><input value={ckPhone} onChange={e=>{const v=e.target.value.replace(/[^0-9]/g,"").slice(0,9);setCkPhone(v);setCkPhoneErr("")}} placeholder="06X XXX XXX" type="tel" maxLength={11}/></div>{ckPhoneErr&&<div className="err-msg">{ckPhoneErr}</div>}</div>
        <div className="field"><label>Adresse <span style={{color:"#EF4444"}}>*</span></label><input value={ckAddr} onChange={e=>setCkAddr(e.target.value)} placeholder="Quartier, Rue, N°"/></div>
        <div className="field-row"><div className="field"><label>Ville <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="Brazzaville"/></div><div className="field"><label>Pays</label><input defaultValue="Congo 🇨🇬"/></div></div>
        <div style={{marginTop:12,fontSize:13,fontWeight:700,marginBottom:8}}>📅 Quand livrer ?</div>
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          {[["now","🚀 Maintenant"],["later","📅 Programmer"]].map(([k,l])=><button key={k} onClick={()=>setSchedule(k)} style={{flex:1,padding:10,borderRadius:12,border:schedule===k?"2px solid #F97316":"1px solid var(--border)",background:schedule===k?"rgba(249,115,22,0.06)":"var(--card)",fontSize:12,fontWeight:schedule===k?700:500,color:schedule===k?"#F97316":"var(--text)",cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
        </div>
        {schedule==="later"&&<div className="field-row"><div className="field"><label>Date</label><DatePicker value={schedDate} onChange={setSchedDate}/></div><div className="field"><label>Créneau</label><Select value={schedTime} onChange={setSchedTime} options={["08:00-10:00","10:00-12:00","12:00-14:00","14:00-16:00","16:00-18:00","18:00-20:00"]}/></div></div>}
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}><div className={`toggle ${saveAddr?"on":""}`} onClick={()=>setSaveAddr(!saveAddr)} style={{transform:"scale(.8)"}}/><span style={{fontSize:12,color:"var(--muted)"}}>Sauvegarder cette adresse</span></div></>}

      {step===1&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:6}}>Mode de paiement</h3><p style={{fontSize:13,color:"var(--muted)",marginBottom:14}}>Choisissez comment payer</p>
        {momos.map(m=><div key={m.k} className={`momo ${momo===m.k?"on":""}`} onClick={()=>setMomo(m.k)}><span className="me"><PayLogo method={m.k} size={22}/></span><span className="mn">{m.n}</span>{momo===m.k&&<span className="mc">✓</span>}</div>)}
        {momo==="cash"?<div style={{marginTop:14,padding:14,background:"rgba(59,130,246,0.06)",borderRadius:14,fontSize:12,color:"var(--muted)",lineHeight:1.6}}>
          <div style={{fontWeight:700,color:"var(--text)",marginBottom:4}}>💵 Paiement en espèces</div>
          Payez directement au livreur à la réception de votre commande. Le montant exact sera demandé — préparez la monnaie si possible.
        </div>
        :<div className="field" style={{marginTop:18}}><label>Numéro <span style={{color:"#EF4444"}}>*</span></label><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,fontWeight:600,flexShrink:0}}>+242</span><input value={ckPhone} onChange={e=>{const v=e.target.value.replace(/[^0-9]/g,"").slice(0,9);setCkPhone(v);setCkPhoneErr("")}} placeholder="06X XXX XXX" type="tel" maxLength={11}/></div>{ckPhoneErr&&<div className="err-msg">{ckPhoneErr}</div>}</div>}
      </>}

      {step===2&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:14}}>Résumé</h3>
        <div className="confirm-card" style={{cursor:"pointer"}} onClick={()=>setStep(0)}><span className="cci">📍</span><div className="ccb"><small>Livraison {schedule==="later"?`· ${schedDate} ${schedTime}`:""}</small><p>Brazzaville, Congo 🇨🇬</p></div><span className="cce" style={{color:"#F97316",fontWeight:600}}>✏️</span></div>
        <div className="confirm-card" style={{cursor:"pointer"}} onClick={()=>setStep(1)}><span className="cci">{momo==="cash"?"💵":"📱"}</span><div className="ccb"><small>Paiement</small><p>{momos.find(m=>m.k===momo)?.n}</p></div><span className="cce" style={{color:"#F97316",fontWeight:600}}>✏️</span></div>

        {/* Applied coupon */}
        {/* Gift card code input */}
        <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>🎁 Code carte cadeau / promo</div>
          {giftApplied?<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><span style={{fontFamily:"monospace",fontWeight:700,fontSize:13}}>{giftApplied.code}</span><span style={{fontSize:11,color:"#10B981",marginLeft:6}}>-{fmt(giftDeduct)}</span></div>
            <button onClick={()=>setGiftApplied(null)} style={{padding:"3px 8px",borderRadius:6,border:"1px solid var(--border)",background:"var(--card)",fontSize:10,cursor:"pointer",fontFamily:"inherit",color:"var(--muted)"}}>✕</button>
          </div>
          :<div style={{display:"flex",gap:6}}>
            <input value={giftCode} onChange={e=>setGiftCode(e.target.value.toUpperCase())} placeholder="GIFT-XXXX" style={{flex:1,padding:"8px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--light)",fontSize:13,fontWeight:600,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase"}}/>
            <button onClick={()=>{
              if(!giftCode.trim()){toast.error("Entrez un code");return}
              const codes=JSON.parse(localStorage.getItem("lk-gift-wallet")||"[]");
              const found=codes.find(c=>c.code.toLowerCase()===giftCode.trim().toLowerCase());
              if(found&&found.remaining>0){setGiftApplied(found);toast.success("🎁 -"+fmt(found.remaining)+" appliqués !")}
              else{
                const allCodes=JSON.parse(localStorage.getItem("lk-gift-codes")||"[]");
                const direct=allCodes.find(c=>c.code.toLowerCase()===giftCode.trim().toLowerCase());
                if(direct&&direct.remaining>0){setGiftApplied(direct);toast.success("🎁 -"+fmt(direct.remaining)+" appliqués !")}
                else{toast.error("Code invalide ou expiré")}
              }
              setGiftCode("")
            }} style={{padding:"8px 14px",borderRadius:8,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>OK</button>
          </div>}
        </div>
        {appliedCoupon&&<div className="confirm-card" style={{background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.15)"}}><span className="cci">🏷️</span><div className="ccb"><small>Code promo</small><p style={{color:"#F97316",fontWeight:600}}>{appliedCoupon.code} — {appliedCoupon.free?"Livraison gratuite":`-${appliedCoupon.discount}%`}</p></div></div>}

        <div style={{marginTop:16}}>
          <div className="cs-row"><span>Sous-total</span><b>{fmt(sub)}</b></div>
          {discountAmount>0&&<div className="cs-row" style={{color:"#F59E0B"}}><span>🏷️ {appliedCoupon.code} (-{appliedCoupon.discount}%)</span><b>-{fmt(discountAmount)}</b></div>}
          <div className="cs-row">
            <span>Livraison</span>
            {freeDelivery?<span><b style={{textDecoration:"line-through",color:"var(--muted)"}}>{fmt(del)}</b><b style={{color:"#F59E0B",marginLeft:6}}>GRATUIT</b></span>:<b>{fmt(del)}</b>}
          </div>
          {giftDeduct>0&&<div className="cs-row" style={{color:"#10B981"}}><span>🎁 Carte cadeau</span><b>-{fmt(giftDeduct)}</b></div>}
          <div className="cs-row tot"><span>Total</span><span className="ctp">{fmt(total)}</span></div>
          {(discountAmount>0||freeDelivery)&&<div style={{textAlign:"center",fontSize:11,color:"#F59E0B",fontWeight:600,marginTop:4}}>🎉 Économie : {fmt(discountAmount+(freeDelivery?del:0))}</div>}
        </div></>}

      <div style={{paddingTop:24,paddingBottom:16}}><button className="btn-primary" onClick={()=>{if(step===0&&!validateStep0())return;if(step===1&&momo!=="cash"){const err=validatePayPhone(ckPhone,momo);if(err){setCkPhoneErr(err);return}}if(step===2){if(validateCheckout())handleConfirm()}else setStep(step+1)}}>{step===2?"Confirmer le paiement":"Continuer"}</button></div>
    </div>

    {ok&&<div className="success-modal"><div className="success-box bounce-in"><div className="si">✅</div><h2>Commande confirmée !</h2><p>{momo==="cash"?"Préparez le montant exact pour le livreur.":"Vérifiez votre téléphone pour le paiement."}</p><div className="ref">#LMK-2026-0214</div>
      {appliedCoupon&&<div style={{fontSize:12,color:"#F97316",fontWeight:600,marginTop:8}}>🏷️ Code {appliedCoupon.code} appliqué</div>}
      <button className="btn-primary" onClick={onDone}>Retour à l'accueil</button></div></div>}
  </>);
}

export default CheckoutScr;
