import InvoiceView from "../../components/InvoiceView";
import P from "../../data/products";
import CreditNoteView from "../../components/CreditNoteView";
import SuccessAnimation from "../../components/SuccessAnimation";
import { useState } from "react";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";
import { saveMod } from "../../utils/orderMods";

const STEPS=["Confirmée","En préparation","En livraison","Livrée"];

const findPhoto=(itemStr)=>{const name=itemStr.split(" ").slice(1).join(" ").replace(/ x\d+$/,"");const p=P.find(x=>x.name.includes(name)||name.includes(x.name));return p?.photo||null};

function OrderDetailScr({order:o,onBack,go}){
  const [cancelling,setCancelling]=useState(false);
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

  // ═══ MODIFY ORDER STATE ═══
  const [showModify,setShowModify]=useState(false);
  const [modifyItems,setModifyItems]=useState([]);
  const [modifyConfirming,setModifyConfirming]=useState(false);
  const [modifyDone,setModifyDone]=useState(false);
  const [modifyPayMethod,setModifyPayMethod]=useState(null);

  // Can modify if order is active and not yet delivered
  const canModify=!cancelled && (sc==="prep"||sc==="ship"||sc==="confirmed"||sc==="");

  // Parse items: "Pain x3" -> {name:"Pain", qty:3, origQty:3}
  const parseItemStr=(str)=>{
    const m=str.match(/^(.+?)\s+x(\d+)\s*$/);
    if(m) return {name:m[1].trim(), qty:parseInt(m[2],10), origQty:parseInt(m[2],10)};
    return {name:str.trim(), qty:1, origQty:1};
  };

  // Estimate unit price = total / total units (rough but workable)
  const totalNum=parseInt(String(o.total||"0").replace(/\s/g,""))||0;
  const itemsParsed=(o.items||[]).map(parseItemStr);
  const totalUnits=itemsParsed.reduce((s,i)=>s+i.origQty,0)||1;
  const unitPrice=Math.round(totalNum/totalUnits);

  // Modification fee depends on order status
  const getModifyFee=()=>{
    if(sc==="ship") return 1500; // En livraison — le livreur fait demi-tour
    if(sc==="prep") return 500;  // En préparation — le vendeur ajuste
    return 0;                    // Confirmée — gratuit
  };

  const openModify=()=>{
    setModifyItems(itemsParsed.map(i=>({...i})));
    setModifyPayMethod(o.payment||null);
    setShowModify(true);
  };

  const adjustQty=(idx,delta)=>{
    setModifyItems(prev=>prev.map((it,i)=>{
      if(i!==idx) return it;
      const newQty=Math.max(0,it.qty+delta);
      return {...it,qty:newQty};
    }));
  };

  // Compute new totals
  const newSubtotal=modifyItems.reduce((s,it)=>s+(it.qty*unitPrice),0);
  const modifyFee=getModifyFee();
  const newTotal=newSubtotal+modifyFee;
  const diff=newTotal-totalNum;
  // Sign: positive = client owes, negative = refund

  const confirmModify=()=>{
    if(diff>0 && !modifyPayMethod){
      toast.error("Choisissez un moyen de paiement");
      return;
    }
    setModifyConfirming(true);
    setTimeout(()=>{
      // Save modification to shared storage so vendor + driver can see it
      saveMod(o.ref, {
        modifiedAt: new Date().toISOString(),
        orderRef: o.ref,
        vendor: o.vendor,
        oldItems: itemsParsed,
        newItems: modifyItems,
        oldTotal: totalNum,
        newSubtotal,
        modifyFee,
        newTotal,
        diff,
        paymentMethod: modifyPayMethod,
        orderStatus: sc, // prep / ship / etc
        status: "pending", // pending → vendor_ack → driver_ack → complete
      });

      setModifyConfirming(false);
      setModifyDone(true);
      setTimeout(()=>{
        setShowModify(false);
        setModifyDone(false);
        toast.success(diff>0 ? `Commande modifiée — ${fmtNum(diff)} FCFA débités` : diff<0 ? `Commande modifiée — Remboursement de ${fmtNum(-diff)} FCFA en cours` : "Commande modifiée");
      },1100);
    },1100);
  };

  const fmtNum=(n)=>n.toLocaleString("fr-FR").replace(/,/g," ");

  const currentStep=o.prog?o.prog.filter(x=>x===1).length:0;
  const canCancel=!cancelled&&(sc==="ship"||sc==="prep");

  if(cancelling)return<SuccessAnimation type="warning" title="Commande annulée" subtitle={o.ref} hint="Remboursement en cours..." duration={0}/>;

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
              {done?"":i+1}
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
      <span style={{fontSize:24}}><Icon name="x_circle" size={18}/></span>
      <div>
        <div style={{fontSize:14,fontWeight:700,color:"#EF4444"}}>Commande annulée</div>
        <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Remboursement sous 24-48h</div>
      </div>
    </div>}

    {/* Items */}
    {/* Reorder CTA — for delivered orders */}
    {(o.status==="delivered"||o.status==="completed"||!o.status)&&<div style={{margin:"16px 16px 8px",padding:14,background:"linear-gradient(135deg,rgba(249,115,22,0.06),rgba(249,115,22,0.02))",border:"1px solid rgba(249,115,22,0.2)",borderRadius:14,display:"flex",alignItems:"center",gap:12}}>
      <div style={{fontSize:28}}></div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:700}}>Commander à nouveau ?</div>
        <div style={{fontSize:11,color:"var(--muted)"}}>Les mêmes articles en 1 clic</div>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>{go("subscriptions")}} style={{padding:"8px 12px",borderRadius:10,border:"1px solid var(--border)",background:"transparent",color:"var(--text)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Icon name="repeat" size={16}/>{" "}M'abonner</button>
        <button onClick={()=>{toast.success("Articles ajoutés au panier !");setTimeout(()=>go("cart"),800)}} style={{padding:"8px 14px",borderRadius:10,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Recommander</button>
      </div>
    </div>}

    <div style={{marginBottom:12}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Articles</div>
      {o.items.map((item,i)=>{const ph=findPhoto(item);return<div key={i} style={{padding:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,fontSize:14,fontWeight:500,display:"flex",alignItems:"center",gap:10}}>
        {ph?<img src={ph} style={{width:40,height:40,borderRadius:10,objectFit:"cover",flexShrink:0}} alt=""/>:<div style={{width:40,height:40,borderRadius:10,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16,opacity:.4}}><Icon name="package" size={18}/></span></div>}
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
      {sc==="ship"&&<button className="btn-primary" onClick={()=>go("tracking")}><Icon name="location" size={16}/>{" "}Suivre ma livraison</button>}
      {sc==="ship"&&<button style={{padding:14,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("chatDriver")}><Icon name="chat" size={16}/>{" "}Contacter le livreur</button>}
      {sc==="done"&&!cancelled&&<button onClick={()=>go("returnOrder",o)} style={{padding:14,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>↩️ Retour / Remboursement</button>}
      {sc==="done"&&!cancelled&&!ratingPrompt&&<button onClick={()=>setRatingPrompt(true)} style={{padding:14,borderRadius:14,border:"2px solid #F59E0B",background:"rgba(245,158,11,0.04)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#F59E0B"}}><Icon name="star_full" size={16}/>{" "}Évaluez votre expérience</button>}
      {ratingPrompt&&<div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,animation:"fadeIn .3s ease"}}>
        <div style={{textAlign:"center",marginBottom:12}}><div style={{fontSize:28,marginBottom:4}}><Icon name="star_full" size={18}/></div><div style={{fontSize:15,fontWeight:700}}>Comment était votre expérience ?</div></div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:14}}>{[1,2,3,4,5].map(s=><span key={s} onClick={()=>setStars(s)} style={{fontSize:32,cursor:"pointer",opacity:s<=stars?1:.25,transition:"all .15s"}}><></></span>)}</div>
        {stars>0&&<div style={{display:"flex",gap:8}}>
          <button onClick={()=>setRatingPrompt(false)} style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Plus tard</button>
          <button onClick={()=>{setRatingPrompt(false);toast.success("Merci pour votre évaluation");go("rateDriver",{name:"Patrick Moukala"})}} style={{flex:1,padding:10,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Envoyer {stars}/5</button>
        </div>}
      </div>}
      {sc==="done"&&!cancelled&&!ratingPrompt&&false&&<button onClick={()=>go("rateDriver",{name:"Patrick Moukala"})} style={{padding:14,borderRadius:14,border:"none",background:"#F59E0B",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Icon name="star_full" size={16}/>{" "}Évaluer le livreur</button>}
      <button onClick={()=>setShowInvoice(true)} style={{padding:14,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}><Icon name="receipt" size={16}/>{" "}Voir le reçu original</button>
      {cancelled&&<button onClick={()=>setShowCreditNote(true)} style={{padding:14,borderRadius:14,border:"1px solid rgba(16,185,129,0.3)",background:"rgba(16,185,129,0.04)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#10B981"}}> Voir l'avoir (remboursement)</button>}
      {showInvoice&&<InvoiceView order={{id:o.ref,client:"Joeldy Tsina",vendor:o.vendor||"Lamuka Market",amount:parseInt(String(o.total).replace(/\s/g,""))||0,items:o.items?.map(it=>{const parts=it.split(" x");const name=parts[0].replace(/^[^a-zA-ZÀ-ÿ]+ /,"");const qty=parts[1]?parseInt(parts[1]):1;return{name,qty,price:Math.round((parseInt(String(o.total).replace(/\s/g,""))||0)/o.items.length)}})||[{name:"Article",qty:1,price:parseInt(String(o.total).replace(/\s/g,""))||0}],delivery:1500,payment:o.payment||"airtel",status:o.sc==="cancel"?"cancelled":o.sc==="fail"?"failed":o.sc==="done"?"delivered":"preparing",isGroup:o.isGroup,groupMembers:o.groupMembers,refundMethod:refundMethod||null}} onClose={()=>setShowInvoice(false)}/>}
      {showCreditNote&&<CreditNoteView order={{id:o.ref,client:"Joeldy Tsina",vendor:o.vendor||"Lamuka Market",amount:parseInt(String(o.total).replace(/\s/g,""))||0,items:o.items?.map(it=>{const parts=it.split(" x");const name=parts[0].replace(/^[^a-zA-ZÀ-ÿ]+ /,"");const qty=parts[1]?parseInt(parts[1]):1;return{name,qty,price:Math.round((parseInt(String(o.total).replace(/\s/g,""))||0)/o.items.length)}})||[{name:"Article",qty:1,price:parseInt(String(o.total).replace(/\s/g,""))||0}],delivery:1500,payment:o.payment||"airtel",cancelReason:"Annulation client"}} refundMethod={refundMethod} onClose={()=>setShowCreditNote(false)}/>}
      {canModify&&<button onClick={openModify} style={{padding:14,borderRadius:14,border:"1px solid rgba(59,130,246,0.3)",background:"rgba(59,130,246,0.04)",color:"#3B82F6",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Icon name="edit" size={14} color="#3B82F6"/> Modifier la commande{(sc==="prep"||sc==="ship")&&<span style={{fontSize:10,padding:"2px 6px",background:"rgba(59,130,246,0.12)",borderRadius:4,fontWeight:700}}>+{getModifyFee()} F</span>}</button>}
      {canCancel&&<button onClick={()=>setShowCancel(true)} style={{padding:14,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}> Annuler la commande</button>}
    </div>

    {/* ═══ MODIFY ORDER MODAL ═══ */}
    {showModify&&<div onClick={()=>!modifyConfirming&&!modifyDone&&setShowModify(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",zIndex:120,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeInFast .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"var(--card)",borderRadius:"20px 20px 0 0",padding:"16px 18px 20px",width:"100%",maxWidth:500,maxHeight:"92%",overflowY:"auto",animation:"slideUp .25s cubic-bezier(.4,0,.2,1)",boxSizing:"border-box"}}>
        <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

        {modifyDone ? (
          <div style={{padding:"30px 16px",textAlign:"center"}}>
            <div style={{width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,#10B981,#059669)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14,boxShadow:"0 8px 24px rgba(16,185,129,0.3)"}}>
              <Icon name="check" size={32} color="#fff"/>
            </div>
            <div style={{fontSize:16,fontWeight:800,color:"var(--text)",marginBottom:4}}>Modification confirmée</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>Le vendeur a été notifié</div>
          </div>
        ) : (<>
          {/* Drag handle */}
          <div style={{width:36,height:4,borderRadius:2,background:"var(--border)",margin:"0 auto 14px"}}/>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,#3B82F6,#2563EB)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="edit" size={20} color="#fff"/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:"var(--text)",letterSpacing:-0.2}}>Modifier la commande</div>
              <div style={{fontSize:11,color:"var(--muted)"}}>Ajustez les quantités</div>
            </div>
            <button onClick={()=>setShowModify(false)} style={{width:32,height:32,borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} aria-label="Fermer">
              <Icon name="close" size={14}/>
            </button>
          </div>

          {/* Status warning if prep or ship */}
          {(sc==="prep"||sc==="ship") && (
            <div style={{padding:"10px 12px",borderRadius:10,background:sc==="ship"?"rgba(245,158,11,0.08)":"rgba(59,130,246,0.06)",border:`1px solid ${sc==="ship"?"rgba(245,158,11,0.2)":"rgba(59,130,246,0.15)"}`,marginBottom:12,display:"flex",alignItems:"flex-start",gap:8}}>
              <Icon name={sc==="ship"?"alert_triangle":"info"} size={14} color={sc==="ship"?"#F59E0B":"#3B82F6"}/>
              <div style={{fontSize:11,color:sc==="ship"?"#B45309":"#1D4ED8",lineHeight:1.5,flex:1}}>
                {sc==="ship"
                  ? <>Votre commande est en route. Modifier maintenant entraînera des <b>frais supplémentaires de {fmtNum(getModifyFee())} FCFA</b> (le livreur devra faire demi-tour).</>
                  : <>Votre commande est en préparation. La modification coûte <b>{fmtNum(getModifyFee())} FCFA</b>.</>
                }
              </div>
            </div>
          )}

          {/* Items list */}
          <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:0.5,marginBottom:6}}>ARTICLES</div>
          <div style={{background:"var(--light)",borderRadius:12,padding:10,marginBottom:12}}>
            {modifyItems.map((it,idx)=>{
              const removed=it.qty===0;
              const changed=it.qty!==it.origQty;
              return(
                <div key={idx} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 6px",borderBottom:idx<modifyItems.length-1?"1px solid var(--border)":"none",opacity:removed?0.5:1}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textDecoration:removed?"line-through":"none"}}>{it.name}</div>
                    <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>
                      {fmtNum(unitPrice)} F l'unité
                      {changed&&<span style={{marginLeft:6,padding:"1px 5px",background:removed?"rgba(239,68,68,0.12)":"rgba(59,130,246,0.12)",color:removed?"#DC2626":"#3B82F6",borderRadius:3,fontSize:9,fontWeight:700}}>
                        {removed?"SUPPRIMÉ":it.qty>it.origQty?`+${it.qty-it.origQty}`:`-${it.origQty-it.qty}`}
                      </span>}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                    <button onClick={()=>adjustQty(idx,-1)} disabled={it.qty<=0} style={{width:28,height:28,borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",cursor:it.qty<=0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:it.qty<=0?0.4:1,fontFamily:"inherit",fontWeight:700,color:"var(--text)"}}>−</button>
                    <div style={{width:24,textAlign:"center",fontSize:13,fontWeight:700,color:"var(--text)"}}>{it.qty}</div>
                    <button onClick={()=>adjustQty(idx,1)} style={{width:28,height:28,borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",fontWeight:700,color:"var(--text)"}}>+</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing summary */}
          <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:12,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)",marginBottom:6}}>
              <span>Ancien total</span>
              <span>{fmtNum(totalNum)} F</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--text)",marginBottom:6}}>
              <span>Nouveau sous-total</span>
              <span style={{fontWeight:600}}>{fmtNum(newSubtotal)} F</span>
            </div>
            {modifyFee>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#F59E0B",marginBottom:6}}>
              <span>Frais de modification</span>
              <span style={{fontWeight:600}}>+{fmtNum(modifyFee)} F</span>
            </div>}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:800,color:"var(--text)",borderTop:"1px solid var(--border)",paddingTop:8,marginTop:2}}>
              <span>Nouveau total</span>
              <span>{fmtNum(newTotal)} F</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,color:diff>0?"#EF4444":diff<0?"#10B981":"var(--muted)",marginTop:6,padding:"6px 10px",background:diff>0?"rgba(239,68,68,0.06)":diff<0?"rgba(16,185,129,0.06)":"var(--light)",borderRadius:8}}>
              <span>{diff>0?"À payer en plus":diff<0?"Remboursement":"Pas de différence"}</span>
              <span>{diff>0?"+":diff<0?"−":""}{fmtNum(Math.abs(diff))} F</span>
            </div>
          </div>

          {/* Payment method if extra to pay */}
          {diff>0 && (<>
            <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:0.5,marginBottom:6}}>PAYER LE SUPPLÉMENT VIA</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:14}}>
              {[
                {id:"airtel",label:"Airtel",color:"#EF4444"},
                {id:"mtn",label:"MTN",color:"#F59E0B"},
                {id:"cash",label:"Cash",color:"#10B981"},
              ].map(m=>{
                const selected=modifyPayMethod===m.id;
                return(
                  <button key={m.id} onClick={()=>setModifyPayMethod(m.id)} style={{padding:"9px 4px",borderRadius:9,border:selected?`1.5px solid ${m.color}`:"1px solid var(--border)",background:selected?`${m.color}10`:"var(--card)",color:selected?m.color:"var(--text)",fontSize:11,fontWeight:selected?700:600,cursor:"pointer",fontFamily:"inherit"}}>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </>)}

          {/* Buttons */}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowModify(false)} disabled={modifyConfirming} style={{flex:1,padding:"12px 0",borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",color:"var(--text)",fontSize:12,fontWeight:600,cursor:modifyConfirming?"not-allowed":"pointer",fontFamily:"inherit",opacity:modifyConfirming?0.5:1}}>
              Annuler
            </button>
            <button
              onClick={confirmModify}
              disabled={modifyConfirming || (diff>0 && !modifyPayMethod) || modifyItems.every((it,i)=>it.qty===it.origQty)}
              style={{
                flex:1.5,padding:"12px 0",borderRadius:12,border:"none",
                background:(modifyConfirming||(diff>0 && !modifyPayMethod)||modifyItems.every((it,i)=>it.qty===it.origQty))?"#E5E7EB":"#3B82F6",
                color:(modifyConfirming||(diff>0 && !modifyPayMethod)||modifyItems.every((it,i)=>it.qty===it.origQty))?"var(--muted)":"#fff",
                fontSize:12,fontWeight:700,
                cursor:(modifyConfirming||(diff>0 && !modifyPayMethod)||modifyItems.every((it,i)=>it.qty===it.origQty))?"not-allowed":"pointer",
                fontFamily:"inherit",
                display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              }}
            >
              {modifyConfirming ? <><div className="spinner" style={{width:13,height:13}}/>Traitement...</> :
               diff>0 ? <>Confirmer et payer {fmtNum(diff)} F</> :
               diff<0 ? <>Confirmer (remboursement {fmtNum(-diff)} F)</> :
               <>Confirmer</>}
            </button>
          </div>
        </>)}
      </div>
    </div>}

    {/* Cancel modal */}
    {showCancel&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeInFast .2s ease"}} onClick={()=>setShowCancel(false)}>
      <div style={{background:"var(--card)",borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:500,maxHeight:"85vh",overflowY:"auto",animation:"slideUp .3s cubic-bezier(.4,0,.2,1)"}} onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:10}}>️</div>
          <h3 style={{fontSize:17,fontWeight:700,marginBottom:6}}>Annuler cette commande ?</h3>
          <p style={{fontSize:13,color:"var(--muted)",marginBottom:4,lineHeight:1.5}}>{o.ref} — {o.total} FCFA</p>
        </div>

        <div style={{fontSize:14,fontWeight:700,marginTop:14,marginBottom:10}}>Mode de remboursement</div>
        {[["wallet","","Wallet Lamuka","Crédit instantané — utilisez-le pour vos prochains achats"],["momo","","Mobile Money","Remboursement sous 24-48h sur votre numéro"]].map(([k,ic,n,desc])=>(
          <div key={k} onClick={()=>setRefundMethod(k)} style={{display:"flex",alignItems:"center",gap:12,padding:14,borderRadius:14,border:refundMethod===k?"2px solid #F97316":"1px solid var(--border)",background:refundMethod===k?"rgba(249,115,22,0.04)":"var(--card)",marginBottom:8,cursor:"pointer"}}>
            <div style={{width:40,height:40,borderRadius:12,background:refundMethod===k?"rgba(249,115,22,0.08)":"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{ic}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:refundMethod===k?700:500}}>{n}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{desc}</div>
            </div>
            {refundMethod===k&&<span style={{color:"#F97316",fontWeight:700,fontSize:16}}></span>}
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
          <button disabled={!refundMethod||(refundMethod==="momo"&&refundPhone.replace(/\s/g,"").length!==9)} onClick={()=>{setCancelling(true);setShowCancel(false);setTimeout(()=>{setCancelling(false);setCancelled(true)},1700)}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:refundMethod?"#EF4444":"var(--border)",color:refundMethod?"#fff":"var(--muted)",fontSize:13,fontWeight:700,cursor:refundMethod?"pointer":"not-allowed",fontFamily:"inherit"}}>Annuler et rembourser</button>
        </div>
      </div>
    </div>}
  </div>);
}

export default OrderDetailScr;
