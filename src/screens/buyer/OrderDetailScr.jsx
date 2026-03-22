import { useState } from "react";
import toast from "../../utils/toast";

const STEPS=["Confirmée","En préparation","En livraison","Livrée"];

function OrderDetailScr({order:o,onBack,go}){
  const [cancelled,setCancelled]=useState(false);
  const [showCancel,setShowCancel]=useState(false);
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
            <div style={{width:26,height:26,borderRadius:"50%",background:done?"#10B981":active?"#6366F1":"var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:done||active?"var(--card)":"var(--muted)",fontWeight:700,flexShrink:0,boxShadow:active?"0 0 0 4px rgba(99,102,241,0.15)":"none"}}>
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
      {o.items.map((item,i)=><div key={i} style={{padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,fontSize:14,fontWeight:500,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:20}}>{item.split(" ")[0]}</span>
        <span>{item.split(" ").slice(1).join(" ")}</span>
      </div>)}
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
      {sc==="done"&&!cancelled&&<button onClick={()=>go("rateDriver",{name:"Patrick Moukala"})} style={{padding:14,borderRadius:14,border:"none",background:"#F59E0B",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>⭐ Évaluer le livreur</button>}
      {canCancel&&<button onClick={()=>setShowCancel(true)} style={{padding:14,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✕ Annuler la commande</button>}
    </div>

    {/* Cancel modal */}
    {showCancel&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowCancel(false)}>
      <div style={{background:"var(--card)",borderRadius:20,padding:24,maxWidth:340,width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:40,marginBottom:10}}>⚠️</div>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:6}}>Annuler cette commande ?</h3>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:6,lineHeight:1.5}}>
          {o.ref} — {o.total} FCFA
        </p>
        <p style={{fontSize:12,color:"var(--muted)",marginBottom:14}}>Le remboursement sera effectué sous 24-48h sur votre Mobile Money.</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setShowCancel(false)} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Non</button>
          <button onClick={()=>{setCancelled(true);setShowCancel(false);toast.success("Commande annulée avec succès 📦")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Oui, annuler</button>
        </div>
      </div>
    </div>}
  </div>);
}

export default OrderDetailScr;
