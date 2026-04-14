import InvoiceView from "../../components/InvoiceView";
import { P } from "../../data";
import CreditNoteView from "../../components/CreditNoteView";
import { useState } from "react";
import toast from "../../utils/toast";

const STEPS=["Confirmée","En préparation","En livraison","Livrée"];

const findPhoto=(itemStr)=>{const name=itemStr.split(" ").slice(1).join(" ").replace(/ x\d+$/,"");const p=P.find(x=>x.name.includes(name)||name.includes(x.name));return p?.photo||null};

function OrderDetailScr({order:o,onBack,go}){
  const [cancelled,setCancelled]=useState(false);
  const [showInvoice,setShowInvoice]=useState(false);
  const [showCreditNote,setShowCreditNote]=useState(false);
  const [showCancel,setShowCancel]=useState(false);
  const [ratingPrompt,setRatingPrompt]=useState(false);
  const [stars,setStars]=useState(0);
  const [refundMethod,setRefundMethod]=useState(null);
  const [refundPhone,setRefundPhone]=useState("");
  const status=cancelled?"Annulée":(o.status||"");
  const sc=cancelled?"cancel":(o.sc||"");

  const currentStep=o.prog?o.prog.filter(x=>x===1).length:0;
  const canCancel=!cancelled&&(sc==="ship"||sc==="prep");

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>

    {/* Status + date */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <span className={`ost ${sc}`} style={{fontSize:13}}>{status}</span>
      <span style={{fontSize:12,color:"var(--muted)"}}>{o.date}</span>
    </div>

    {/* Timeline */}
    {!cancelled&&<div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:12}}>
      {STEPS.map((s,i)=>{
        const done=i<currentStep;const active=i===currentStep-1;
        return(<div key={s} style={{display:"flex",gap:12,marginBottom:i<3?4:0}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:done?"#10B981":active?"#F97316":"var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:done||active?"var(--card)":"var(--muted)",fontWeight:700,flexShrink:0,boxShadow:active?"0 0 0 4px rgba(249,115,22,0.15)":"none"}}>
              {done?"✓":i+1}
            </div>
            {i<3&&<div style={{width:2,height:20,background:done?"#10B981":"var(--border)"}}/>}
          </div>
          <div style={{paddingTop:3}}>
            <div style={{fontSize:13,fontWeight:active?700:done?600:400,color:done||active?"var(--text)":"var(--muted)"}}>{s}</div>
          </div>
        </div>);
      })}
    </div>}

    {/* Cancelled banner */}
    {cancelled&&<div style={{padding:16,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16,marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
      <span style={{fontSize:24}}>❌</span>
      <div>
        <div style={{fontSize:14,fontWeight:700,color:"#EF4444"}}>Commande annulée</div>
        <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Remboursement sous 24-48h</div>
      </div>
    </div>}

    {/* Items */}
    <div style={{marginBottom:12}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Articles</div>
      {o.items.map((item,i)=>{const ph=findPhoto(item);return<div key={i} style={{padding:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,fontSize:14,fontWeight:500,display:"flex",alignItems:"center",gap:10}}>
        {ph?<img src={ph} style={{width:40,height:40,borderRadius:10,objectFit:"cover",flexShrink:0}} alt=""/>:<div style={{width:40,height:40,borderRadius:10,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16,opacity:.4}}>📦</span></div>}
        <span>{item.replace(/^[^\s]+ /,"")}</span>
      </div>})}
    </div>

    {/* Summary */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:12}}>
      <div className="cs-row"><span>Sous-total</span><b>{o.total} FCFA</b></div>
      <div className="cs-row"><span>Livraison</span><b>2 500 FCFA</b></div>
      <div className="cs-row tot"><span>Total</span><span className="ctp">{parseInt(o.total.replace(/\s/g,""))+2500} FCFA</span></div>
    </div>

    {/* Actions */}
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {sc==="ship"&&<button className="btn-primary" onClick={()=>go("tracking")}>📍 Suivre ma livraison</button>}
      {sc==="ship"&&<button style={{padding:14,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("chatDriver")}>💬 Contacter le livreur</button>}
      {sc==="done"&&!cancelled&&<button onClick={()=>go("returnOrder",o)} style={{padding:14,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>↩️ Retour / Remboursement</button>}
      {sc==="done"&&!cancelled&&!ratingPrompt&&<button onClick={()=>setRatingPrompt(true)} style={{padding:14,borderRadius:14,border:"2px solid #F59E0B",background:"rgba(245,158,11,0.04)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#F59E0B"}}>⭐ Évaluez votre expérience</button>}
      {ratingPrompt&&<div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,animation:"fadeIn .3s ease"}}>
        <div style={{textAlign:"center",marginBottom:12}}><div style={{fontSize:28,marginBottom:4}}>⭐</div><div style={{fontSize:15,fontWeight:700}}>Comment était votre expérience ?</div></div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:14}}>{[1,2,3,4,5].map(s=><span key={s} onClick={()=>setStars(s)} style={{fontSize:32,cursor:"pointer",opacity:s<=stars?1:.25,transition:"all .15s"}}>{s<=stars?"⭐":"☆"}</span>)}</div>
        {stars>0&&<div style={{display:"flex",gap:8}}>
          <button onClick={()=>setRatingPrompt(false)} style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Plus tard</button>
          <button onClick={()=>{setRatingPrompt(false);toast.success("Merci pour votre évaluation ⭐");go("rateDriver",{name:"Patrick Moukala"})}} style={{flex:1,padding:10,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Envoyer {stars}/5</button>
        </div>}
      </div>}
      {sc==="done"&&!cancelled&&!ratingPrompt&&false&&<button onClick={()=>go("rateDriver",{name:"Patrick Moukala"})} style={{padding:14,borderRadius:14,border:"none",background:"#F59E0B",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>⭐ Évaluer le livreur</button>}
      <button onClick={()=>setShowInvoice(true)} style={{padding:14,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>🧾 Voir le reçu original</button>
      {cancelled&&<button onClick={()=>setShowCreditNote(true)} style={{padding:14,borderRadius:14,border:"1px solid rgba(16,185,129,0.3)",background:"rgba(16,185,129,0.04)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#10B981"}}>💸 Voir l'avoir (remboursement)</button>}
      {showInvoice&&<InvoiceView order={{id:o.ref,client:"Joeldy Tsina",vendor:o.vendor||"Lamuka Market",amount:parseInt(String(o.total).replace(/\s/g,""))||0,items:o.items?.map(it=>{const parts=it.split(" x");const name=parts[0].replace(/^[^a-zA-ZÀ-ÿ]+ /,"");const qty=parts[1]?parseInt(parts[1]):1;return{name,qty,price:Math.round((parseInt(String(o.total).replace(/\s/g,""))||0)/o.items.length)}})||[{name:"Article",qty:1,price:parseInt(String(o.total).replace(/\s/g,""))||0}],delivery:1500,payment:o.payment||"airtel",status:o.sc==="cancel"?"cancelled":o.sc==="fail"?"failed":o.sc==="done"?"delivered":"preparing",isGroup:o.isGroup,groupMembers:o.groupMembers,refundMethod:refundMethod||null}} onClose={()=>setShowInvoice(false)}/>}
      {showCreditNote&&<CreditNoteView order={{id:o.ref,client:"Joeldy Tsina",vendor:o.vendor||"Lamuka Market",amount:parseInt(String(o.total).replace(/\s/g,""))||0,items:o.items?.map(it=>{const parts=it.split(" x");const name=parts[0].replace(/^[^a-zA-ZÀ-ÿ]+ /,"");const qty=parts[1]?parseInt(parts[1]):1;return{name,qty,price:Math.round((parseInt(String(o.total).replace(/\s/g,""))||0)/o.items.length)}})||[{name:"Article",qty:1,price:parseInt(String(o.total).replace(/\s/g,""))||0}],delivery:1500,payment:o.payment||"airtel",cancelReason:"Annulation client"}} refundMethod={refundMethod} onClose={()=>setShowCreditNote(false)}/>}
      {canCancel&&<button onClick={()=>setShowCancel(true)} style={{padding:14,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✕ Annuler la commande</button>}
    </div>

    {/* Cancel modal */}
    {showCancel&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeInFast .2s ease"}} onClick={()=>setShowCancel(false)}>
      <div style={{background:"var(--card)",borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:500,maxHeight:"85vh",overflowY:"auto",animation:"slideUp .3s cubic-bezier(.4,0,.2,1)"}} onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:10}}>⚠️</div>
          <h3 style={{fontSize:17,fontWeight:700,marginBottom:6}}>Annuler cette commande ?</h3>
          <p style={{fontSize:13,color:"var(--muted)",marginBottom:4,lineHeight:1.5}}>{o.ref} — {o.total} FCFA</p>
        </div>

        <div style={{fontSize:14,fontWeight:700,marginTop:14,marginBottom:10}}>Mode de remboursement</div>
        {[["wallet","💰","Wallet Lamuka","Crédit instantané — utilisez-le pour vos prochains achats"],["momo","📱","Mobile Money","Remboursement sous 24-48h sur votre numéro"]].map(([k,ic,n,desc])=>(
          <div key={k} onClick={()=>setRefundMethod(k)} style={{display:"flex",alignItems:"center",gap:12,padding:14,borderRadius:14,border:refundMethod===k?"2px solid #F97316":"1px solid var(--border)",background:refundMethod===k?"rgba(249,115,22,0.04)":"var(--card)",marginBottom:8,cursor:"pointer"}}>
            <div style={{width:40,height:40,borderRadius:12,background:refundMethod===k?"rgba(249,115,22,0.08)":"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{ic}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:refundMethod===k?700:500}}>{n}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{desc}</div>
            </div>
            {refundMethod===k&&<span style={{color:"#F97316",fontWeight:700,fontSize:16}}>✓</span>}
          </div>
        ))}

        {refundMethod==="momo"&&<div style={{marginTop:4}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>Numéro de remboursement</div>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",border:"1px solid var(--border)",borderRadius:12,background:"var(--light)"}}>
            <span style={{fontSize:13,fontWeight:600,flexShrink:0}}>+242</span>
            <input value={refundPhone} onChange={e=>{const v=e.target.value.replace(/[^0-9]/g,"").slice(0,9);setRefundPhone(v)}} placeholder="06X XXX XXX" type="tel" maxLength={11} style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",fontFamily:"inherit",color:"var(--text)"}}/>
          </div>
        </div>}

        <div style={{display:"flex",gap:10,marginTop:16}}>
          <button onClick={()=>{setShowCancel(false);setRefundMethod(null)}} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Non</button>
          <button disabled={!refundMethod||(refundMethod==="momo"&&refundPhone.replace(/\s/g,"").length!==9)} onClick={()=>{setCancelled(true);setShowCancel(false);toast.success(refundMethod==="wallet"?"💰 "+o.total+" FCFA crédité sur votre wallet":"📱 Remboursement envoyé sous 24-48h")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:refundMethod?"#EF4444":"var(--border)",color:refundMethod?"#fff":"var(--muted)",fontSize:13,fontWeight:700,cursor:refundMethod?"pointer":"not-allowed",fontFamily:"inherit"}}>Annuler et rembourser</button>
        </div>
      </div>
    </div>}
  </div>);
}

export default OrderDetailScr;
