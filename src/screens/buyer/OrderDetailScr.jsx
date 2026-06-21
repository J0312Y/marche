import InvoiceView from "../../components/InvoiceView";
import P from "../../data/products";
import CreditNoteView from "../../components/CreditNoteView";
import SuccessAnimation from "../../components/SuccessAnimation";
import { useState, useMemo } from "react";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";
import { saveMod } from "../../utils/orderMods";
import { getOrderPin } from "../../utils/deliveryPin";
import { useData } from "../../hooks";

const STEPS=["Confirmée","En préparation","En livraison","Livrée"];
const STEP_ICONS=["check_circle","package","truck","gift"];

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
  const [showAddArticle,setShowAddArticle]=useState(false);
  const [addArticleSearch,setAddArticleSearch]=useState("");

  // Pull vendor products for "add article" feature
  const { P } = useData();
  const vendorProducts = useMemo(() => {
    if (!o.vendor || !P) return [];
    return P.filter(p => p.vendor === o.vendor).slice(0, 50);
  }, [o.vendor, P]);

  // Can modify if order is active and not yet delivered
  const canModify=!cancelled && (sc==="prep"||sc==="ship"||sc==="confirmed"||sc==="");

  // Parse items: "Pain x3" -> {name:"Pain", qty:3, origQty:3, price:..., isNew:false}
  const parseItemStr=(str)=>{
    const m=str.match(/^(.+?)\s+x(\d+)\s*$/);
    if(m) return {name:m[1].trim(), qty:parseInt(m[2],10), origQty:parseInt(m[2],10), isNew:false};
    return {name:str.trim(), qty:1, origQty:1, isNew:false};
  };

  // Estimate unit price = total / total units (rough but workable for legacy items)
  const totalNum=parseInt(String(o.total||"0").replace(/\s/g,""))||0;
  const itemsParsed=(o.items||[]).map(parseItemStr);
  const totalUnits=itemsParsed.reduce((s,i)=>s+i.origQty,0)||1;
  const estimatedUnitPrice=Math.round(totalNum/totalUnits);
  // Assign estimated price to each original item
  const itemsWithPrice = itemsParsed.map(it => ({...it, price: estimatedUnitPrice}));

  // Modification fee depends on order status
  const getModifyFee=()=>{
    if(sc==="ship") return 1500; // En livraison — le livreur fait demi-tour
    if(sc==="prep") return 500;  // En préparation — le vendeur ajuste
    return 0;                    // Confirmée — gratuit
  };

  const openModify=()=>{
    setModifyItems(itemsWithPrice.map(i=>({...i})));
    setModifyPayMethod(o.payment||null);
    setShowAddArticle(false);
    setAddArticleSearch("");
    setShowModify(true);
  };

  const adjustQty=(idx,delta)=>{
    setModifyItems(prev=>prev.map((it,i)=>{
      if(i!==idx) return it;
      const newQty=Math.max(0,it.qty+delta);
      return {...it,qty:newQty};
    }));
  };

  const addArticleFromProduct=(product)=>{
    setModifyItems(prev=>{
      // If already in list, just increment qty
      const existingIdx = prev.findIndex(it => it.name === product.name);
      if (existingIdx >= 0) {
        return prev.map((it, i) => i === existingIdx ? {...it, qty: it.qty + 1} : it);
      }
      // Otherwise add as new item
      return [...prev, {
        name: product.name,
        qty: 1,
        origQty: 0,
        price: product.price,
        isNew: true,
      }];
    });
    setShowAddArticle(false);
    setAddArticleSearch("");
    toast.success(`${product.name} ajouté`);
  };

  const filteredVendorProducts = useMemo(() => {
    if (!addArticleSearch) return vendorProducts;
    const q = addArticleSearch.toLowerCase();
    return vendorProducts.filter(p => p.name.toLowerCase().includes(q));
  }, [vendorProducts, addArticleSearch]);

  // Compute new totals (use each item's individual price)
  const newSubtotal=modifyItems.reduce((s,it)=>s+(it.qty*(it.price||estimatedUnitPrice)),0);
  const modifyFee=getModifyFee();
  const newTotal=newSubtotal+modifyFee;
  const diff=newTotal-totalNum;
  // Sign: positive = client owes, negative = refund

  // Check if anything changed
  const hasChanges = modifyItems.some(it => it.qty !== it.origQty) || modifyItems.some(it => it.isNew && it.qty > 0);

  const confirmModify=()=>{
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
        paymentMethod: "cash",
        orderStatus: sc,
        status: "pending",
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
        const iconColor = done || active ? "#fff" : "var(--muted)";
        return(<div key={s} style={{display:"flex",gap:12,marginBottom:i<3?4:0}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{
              width:32,height:32,borderRadius:"50%",
              background:done?"#10B981":active?"#F97316":"var(--light)",
              border: !done && !active ? "1.5px dashed var(--border)" : "none",
              display:"flex",alignItems:"center",justifyContent:"center",
              flexShrink:0,
              boxShadow:active?"0 0 0 4px rgba(249,115,22,0.15)":done?"0 2px 6px rgba(16,185,129,0.2)":"none",
              transition:"all .2s",
            }}>
              {done ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <Icon name={STEP_ICONS[i]} size={15} color={iconColor}/>
              )}
            </div>
            {i<3&&<div style={{width:2,height:20,background:done?"#10B981":"var(--border)",borderRadius:1}}/>}
          </div>
          <div style={{paddingTop:6}}>
            <div style={{fontSize:13,fontWeight:active?700:done?600:500,color:done||active?"var(--text)":"var(--muted)"}}>{s}</div>
            {active && (
              <div style={{fontSize:11,color:"#F97316",fontWeight:600,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#F97316",animation:"pulse-dot 1.5s ease-in-out infinite"}}/>
                En cours
              </div>
            )}
          </div>
        </div>);
      })}
      <style>{`@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}`}</style>
    </div>}

    {/* Delivery PIN — show when order is being prepared or shipped */}
    {!cancelled && (sc==="ship"||sc==="prep") && (() => {
      const pin = getOrderPin(o.ref);
      return (
        <div style={{
          background:"linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
          borderRadius:16,
          padding:"14px 14px 12px",
          marginBottom:12,
          color:"#fff",
          boxShadow:"0 8px 22px rgba(249,115,22,0.28)",
          position:"relative",
          overflow:"hidden",
        }}>
          <div style={{position:"absolute",top:-25,right:-25,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
          <div style={{position:"relative",zIndex:2}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:28,height:28,borderRadius:8,background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name="shield" size={13} color="#fff"/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:0.4,opacity:0.95}}>CODE DE LIVRAISON</div>
                <div style={{fontSize:9,opacity:0.85,marginTop:1}}>Donnez ce code au livreur à l'arrivée</div>
              </div>
            </div>
            <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:6}}>
              {pin.split("").map((d,i)=>(
                <div key={i} style={{
                  width:44, height:54, borderRadius:11,
                  background:"rgba(255,255,255,0.96)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:26,fontWeight:800,color:"#EA580C",
                  fontFamily:"monospace",letterSpacing:-1,
                  boxShadow:"0 3px 10px rgba(0,0,0,0.12)",
                }}>{d}</div>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:10,opacity:0.92,marginTop:4}}>
              <Icon name="info" size={10} color="#fff"/>
              Ne le partagez avec personne d'autre
            </div>
          </div>
        </div>
      );
    })()}

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
      {o.items.map((item,i)=>{
        const ph=findPhoto(item);
        const parsed=parseItemStr(item);
        const linePrice=parsed.qty*estimatedUnitPrice;
        return(
          <div key={i} style={{padding:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
            {ph?<img src={ph} style={{width:40,height:40,borderRadius:10,objectFit:"cover",flexShrink:0}} alt=""/>:<div style={{width:40,height:40,borderRadius:10,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16,opacity:.4}}><Icon name="package" size={18}/></span></div>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.replace(/^[^\s]+ /,"")}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>
                {parsed.qty} × {fmtNum(estimatedUnitPrice)} F
              </div>
            </div>
            <div style={{
              fontSize:13,fontWeight:700,color:"var(--text)",
              fontVariantNumeric:"tabular-nums",
              flexShrink:0,minWidth:62,textAlign:"right"
            }}>{fmtNum(linePrice)} F</div>
          </div>
        );
      })}
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
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:0.5}}>ARTICLES</div>
            {!showAddArticle && vendorProducts.length > 0 && (
              <button onClick={()=>setShowAddArticle(true)} style={{
                padding:"4px 9px",borderRadius:7,
                border:"1px solid rgba(59,130,246,0.3)",background:"rgba(59,130,246,0.06)",
                color:"#3B82F6",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                display:"flex",alignItems:"center",gap:4
              }}>
                <Icon name="plus" size={10} color="#3B82F6"/>Ajouter un article
              </button>
            )}
          </div>

          {/* Add article picker (vendor catalog) */}
          {showAddArticle && (
            <div style={{
              background:"var(--card)",
              border:"1.5px solid #3B82F6",
              borderRadius:12,
              padding:10,
              marginBottom:10,
              animation:"fadeInFast .2s ease",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <Icon name="search" size={14} color="var(--muted)"/>
                <input
                  type="text"
                  value={addArticleSearch}
                  onChange={e => setAddArticleSearch(e.target.value)}
                  placeholder={`Chercher chez ${o.vendor}...`}
                  autoFocus
                  style={{
                    flex:1,border:"none",background:"transparent",
                    fontSize:12,color:"var(--text)",fontFamily:"inherit",outline:"none"
                  }}
                />
                <button onClick={()=>{setShowAddArticle(false);setAddArticleSearch("");}} style={{
                  width:24,height:24,borderRadius:6,
                  border:"1px solid var(--border)",background:"var(--card)",
                  cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"
                }}>
                  <Icon name="close" size={11}/>
                </button>
              </div>
              <div style={{maxHeight:180,overflowY:"auto"}}>
                {filteredVendorProducts.length === 0 ? (
                  <div style={{padding:"14px 8px",textAlign:"center",fontSize:11,color:"var(--muted)"}}>
                    {addArticleSearch ? "Aucun article trouvé" : "Aucun article disponible chez ce vendeur"}
                  </div>
                ) : filteredVendorProducts.map(p => {
                  const alreadyAdded = modifyItems.find(it => it.name === p.name);
                  return (
                    <div key={p.id} onClick={()=>addArticleFromProduct(p)} style={{
                      display:"flex",alignItems:"center",gap:8,
                      padding:"7px 6px",
                      borderRadius:8,
                      cursor:"pointer",
                      background:alreadyAdded?"rgba(59,130,246,0.04)":"transparent",
                      transition:"background .1s",
                    }} onMouseEnter={e=>{if(!alreadyAdded)e.currentTarget.style.background="var(--light)"}} onMouseLeave={e=>{if(!alreadyAdded)e.currentTarget.style.background="transparent"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {p.name}
                        </div>
                        <div style={{fontSize:9,color:"var(--muted)",marginTop:1}}>
                          {fmtNum(p.price)} F l'unité
                          {alreadyAdded && <span style={{marginLeft:6,color:"#3B82F6",fontWeight:700}}>· déjà ajouté</span>}
                        </div>
                      </div>
                      <div style={{
                        width:24,height:24,borderRadius:7,
                        background:"#3B82F6",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        flexShrink:0
                      }}>
                        <Icon name="plus" size={12} color="#fff"/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modify items list */}
          <div style={{background:"var(--light)",borderRadius:12,padding:10,marginBottom:12}}>
            {modifyItems.map((it,idx)=>{
              const removed=it.qty===0;
              const changed=it.qty!==it.origQty;
              const lineTotal = it.qty * (it.price || estimatedUnitPrice);
              return(
                <div key={idx} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 6px",borderBottom:idx<modifyItems.length-1?"1px solid var(--border)":"none",opacity:removed?0.5:1}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textDecoration:removed?"line-through":"none",flex:1,minWidth:0}}>{it.name}</div>
                      {changed && (
                        <span style={{padding:"1px 5px",background:removed?"rgba(239,68,68,0.12)":it.isNew?"rgba(16,185,129,0.12)":"rgba(59,130,246,0.12)",color:removed?"#DC2626":it.isNew?"#10B981":"#3B82F6",borderRadius:3,fontSize:9,fontWeight:700,flexShrink:0}}>
                          {removed?"SUPPRIMÉ":it.isNew?"NOUVEAU":it.qty>it.origQty?`+${it.qty-it.origQty}`:`-${it.origQty-it.qty}`}
                        </span>
                      )}
                    </div>
                    <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>
                      {fmtNum(it.price || estimatedUnitPrice)} F l'unité
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                    <button onClick={()=>adjustQty(idx,-1)} disabled={it.qty<=0} style={{width:26,height:26,borderRadius:7,border:"1px solid var(--border)",background:"var(--card)",cursor:it.qty<=0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:it.qty<=0?0.4:1,fontFamily:"inherit",fontWeight:700,color:"var(--text)"}}>−</button>
                    <div style={{width:20,textAlign:"center",fontSize:12,fontWeight:700,color:"var(--text)"}}>{it.qty}</div>
                    <button onClick={()=>adjustQty(idx,1)} style={{width:26,height:26,borderRadius:7,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",fontWeight:700,color:"var(--text)"}}>+</button>
                  </div>
                  {/* Per-item total on the right */}
                  <div style={{
                    minWidth:62,textAlign:"right",
                    fontSize:12,fontWeight:700,
                    color:removed?"var(--muted)":"var(--text)",
                    textDecoration:removed?"line-through":"none",
                    fontVariantNumeric:"tabular-nums",
                  }}>
                    {fmtNum(lineTotal)} F
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
            <div style={{
              padding:"12px",borderRadius:12,
              background:"linear-gradient(135deg, rgba(16,185,129,0.06), transparent)",
              border:"1px solid rgba(16,185,129,0.2)",
              marginBottom:14,
              display:"flex",alignItems:"center",gap:10,
            }}>
              <div style={{width:36,height:36,borderRadius:10,background:"#10B981",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="cash" size={17} color="#fff"/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:"#047857"}}>Paiement au livreur</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>
                  Préparez <b>{fmtNum(diff)} F</b> supplémentaires en cash pour le livreur lors de la livraison.
                </div>
              </div>
            </div>
          </>)}

          {/* Buttons */}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowModify(false)} disabled={modifyConfirming} style={{flex:1,padding:"12px 0",borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",color:"var(--text)",fontSize:12,fontWeight:600,cursor:modifyConfirming?"not-allowed":"pointer",fontFamily:"inherit",opacity:modifyConfirming?0.5:1}}>
              Annuler
            </button>
            <button
              onClick={confirmModify}
              disabled={modifyConfirming || !hasChanges}
              style={{
                flex:1.5,padding:"12px 0",borderRadius:12,border:"none",
                background:(modifyConfirming||!hasChanges)?"#E5E7EB":"#3B82F6",
                color:(modifyConfirming||!hasChanges)?"var(--muted)":"#fff",
                fontSize:12,fontWeight:700,
                cursor:(modifyConfirming||!hasChanges)?"not-allowed":"pointer",
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
