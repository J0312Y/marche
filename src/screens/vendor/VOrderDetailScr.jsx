import InvoiceView from "../../components/InvoiceView";
import CreditNoteView from "../../components/CreditNoteView";
import { useState } from "react";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";
import toast from "../../utils/toast";

function VOrderDetailScr({order:o,onBack,go}){
  const [showInvoice,setShowInvoice]=useState(false);
  const [showCreditNote,setShowCreditNote]=useState(false);
  const [status,setStatus]=useState(o.status);
  const [showRefuse,setShowRefuse]=useState(false);
  const [cashStatus,setCashStatus]=useState(null); // null | "received" | "pending" | "dispute"
  const statusMap={new:"Nouvelle",preparing:"En préparation",shipped:"Expédiée",delivered:"Livrée",refused:"Refusée"};
  const next={new:"preparing",preparing:"shipped",shipped:"delivered"};
  const nextLabel={new:"✅ Accepter",preparing:"📦 Marquer prête",shipped:"🚚 Confirmer livraison"};

  if(status==="refused")return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"40px 0"}}><div style={{width:70,height:70,borderRadius:"50%",background:"rgba(239,68,68,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:32}}>✕</div>
      <h3 style={{fontSize:18,fontWeight:700,color:"#EF4444"}}>Commande refusée</h3>
      <p style={{fontSize:13,color:"var(--muted)",marginTop:6}}>{o.ref} · {o.client}</p>
      <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Le client sera notifié et remboursé.</p>
      <button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour</button>
      <button onClick={()=>setShowInvoice(true)} style={{padding:14,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)",marginTop:8}}>🧾 Générer le reçu</button>
      {showCreditNote&&<CreditNoteView order={{id:o?.ref||"CMD-0891",client:o?.client||"Marie Koumba",vendor:"Ma Boutique",amount:o?.total||25000,items:o?.items?.map(it=>({name:it.name,qty:it.qty,price:it.price}))||[{name:"Article",qty:1,price:o?.total||25000}],delivery:1500,payment:o?.payment||"airtel",cancelReason:status==="refused"?"Refusé par le vendeur":"Annulation"}} refundMethod="wallet" onClose={()=>setShowCreditNote(false)}/>}
    {showInvoice&&<InvoiceView order={{id:o?.ref||"LMK-0891",client:o?.client||"Marie Koumba",vendor:o?.vendor||"Mode Afrique",amount:o?.total||25000,items:o?.items?.map(it=>({name:it.name,qty:it.qty,price:it.price,sides:it.sides}))||[{name:"Article",qty:1,price:o?.total||25000}],delivery:1500,payment:o?.payment||"airtel",status:o?.status||"new"}} onClose={()=>setShowInvoice(false)}/>}
    </div>
  </div>);

  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span className={`vo-status ${status}`} style={{fontSize:13}}>{statusMap[status]}</span><span style={{fontSize:12,color:"var(--muted)"}}>{o.date}</span></div>
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>👤 Client</div>
      {[["Nom",o.client],["Téléphone",o.phone],["Adresse",o.addr],["Paiement",o.payment==="cash"?"💵 Cash à la livraison":o.payment]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border)",fontSize:13}}><span style={{color:"var(--muted)"}}>{l}</span><b>{v}</b></div>)}
      {o.isGroup&&<div style={{marginTop:8,padding:10,background:"rgba(59,130,246,0.04)",borderRadius:10,border:"1px solid rgba(59,130,246,0.1)"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#3B82F6",marginBottom:6}}>🤝 Commande de groupe — {o.groupMembers?.length||0} participants</div>
        {o.groupMembers?.map((m,mi)=><div key={mi} style={{padding:"6px 0",borderBottom:mi<o.groupMembers.length-1?"1px solid var(--border)":"none"}}>
          <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>{m.name}</div>
          {m.items?.map((it,ii)=><div key={ii} style={{fontSize:11,color:"var(--sub)",paddingLeft:10}}>• {it.name} ×{it.qty} — {fmt(it.price*(it.qty||1))}</div>)}
        </div>)}
      </div>}
    </div>
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>📦 Articles</div>
      {o.items.map((it,i)=><div key={i}><div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:it.sides?.length?"none":"1px solid var(--border)"}}><Img src={it.photo} emoji={it.img} style={{width:44,height:44,borderRadius:8,flexShrink:0}} fit="cover"/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{it.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>x{it.qty}</div></div><div style={{fontSize:13,fontWeight:700,color:"#F97316"}}>{fmt(it.price*it.qty)}</div></div>{it.sides?.length>0&&<div style={{padding:"4px 0 8px 54px",borderBottom:"1px solid var(--border)"}}>{it.sides.map((s,si)=><div key={si} style={{fontSize:11,color:"var(--sub)",display:"flex",justifyContent:"space-between",padding:"1px 0"}}><span>↳ {s.img} {s.name}{s.qty>1?" ×"+s.qty:""}</span><span style={{color:s.price>0?"#F97316":"#10B981"}}>{s.price>0?"+"+fmt(s.price*(s.qty||1)):"Gratuit"}</span></div>)}</div>}</div>)}
      {o.note&&<div style={{padding:"8px 10px",background:"rgba(59,130,246,0.04)",borderRadius:8,marginTop:8,fontSize:11,color:"#3B82F6"}}><b>📝 Note client :</b> {o.note}</div>}
      <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,fontSize:16,fontWeight:700}}><span>Total</span><span style={{color:"#F97316"}}>{fmt(o.total)}</span></div>
    </div>

    {/* Refuse confirmation */}
    {showRefuse&&<div style={{padding:16,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,color:"#EF4444",marginBottom:8}}>⚠️ Confirmer le refus ?</div>
      <p style={{fontSize:12,color:"var(--sub)",marginBottom:12}}>Le client sera notifié et remboursé automatiquement. Cette action est irréversible.</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowRefuse(false)}>Annuler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setStatus("refused");toast.success("Commande refusée ❌")}}>✕ Confirmer le refus</button>
      </div>
    </div>}

    {/* Cash payment handling */}
    {o.payment==="cash"&&status==="delivered"&&!cashStatus&&<div style={{padding:16,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:16,marginBottom:14,animation:"fadeIn .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <span style={{fontSize:22}}>💵</span>
        <div><div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Paiement cash en attente</div><div style={{fontSize:11,color:"var(--muted)"}}>Le livreur doit vous reverser via Mobile Money</div></div>
      </div>
      <div style={{padding:12,background:"var(--card)",borderRadius:12,border:"1px solid var(--border)",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:"var(--muted)"}}>Total commande</span><b>{fmt(o.total)}</b></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4,color:"#10B981"}}><span>− Frais livraison</span><b>- {fmt(2000)}</b></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:800,paddingTop:6,borderTop:"1px solid var(--border)",color:"#F97316"}}><span>Montant attendu</span><span>{fmt(o.total-2000)}</span></div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={()=>{setCashStatus("received");toast.success("✅ Paiement confirmé — commission de "+fmt(Math.round(o.total*0.05))+" déduite du wallet")}} style={{width:"100%",padding:12,borderRadius:12,border:"none",background:"#10B981",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✅ J'ai reçu le paiement</button>
        <button onClick={()=>{setCashStatus("pending");toast.info("⏳ Rappel envoyé au livreur")}} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid #F59E0B",background:"transparent",color:"#F59E0B",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>⏳ Pas encore reçu — Rappeler le livreur</button>
        <button onClick={()=>{setCashStatus("dispute");toast.error("🚨 Litige signalé — Support Lamuka contacté")}} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>❌ Signaler un problème</button>
      </div>
    </div>}

    {/* Cash confirmed */}
    {o.payment==="cash"&&cashStatus==="received"&&<div style={{padding:12,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:14,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:22}}>✅</span>
      <div><div style={{fontSize:13,fontWeight:600,color:"#10B981"}}>Paiement cash confirmé</div><div style={{fontSize:11,color:"var(--muted)"}}>Commission de {fmt(Math.round(o.total*0.05))} déduite du wallet</div></div>
    </div>}

    {/* Cash pending reminder */}
    {o.payment==="cash"&&cashStatus==="pending"&&<div style={{padding:12,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:14,marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <span style={{fontSize:18}}>⏳</span>
        <div style={{fontSize:13,fontWeight:600,color:"#F59E0B"}}>Rappel envoyé au livreur</div>
      </div>
      <div style={{fontSize:11,color:"var(--muted)",marginBottom:10}}>Si le livreur ne reverse pas sous 24h, il sera automatiquement sanctionné.</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>{setCashStatus("received");toast.success("✅ Paiement confirmé")}} style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#10B981",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✅ Reçu maintenant</button>
        <button onClick={()=>{setCashStatus("dispute");toast.error("🚨 Litige ouvert")}} style={{flex:1,padding:10,borderRadius:10,border:"1px solid #EF4444",background:"transparent",color:"#EF4444",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>❌ Ouvrir litige</button>
      </div>
    </div>}

    {/* Cash dispute */}
    {o.payment==="cash"&&cashStatus==="dispute"&&<div style={{padding:12,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:14,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:22}}>🚨</span>
      <div><div style={{fontSize:13,fontWeight:600,color:"#EF4444"}}>Litige en cours</div><div style={{fontSize:11,color:"var(--muted)"}}>L'équipe Lamuka va traiter votre dossier sous 24-48h.</div></div>
    </div>}

    {status!=="delivered"&&!showRefuse&&<div className="vo-actions">
      <button className={status==="new"?"vo-accept":status==="preparing"?"vo-prepare":"vo-ship"} onClick={()=>setStatus(next[status])}>{nextLabel[status]}</button>
      {status==="new"&&<button className="vo-reject" onClick={()=>setShowRefuse(true)}>✕ Refuser</button>}
    </div>}
    {(status==="preparing"||status==="shipped")&&<button style={{marginTop:10,width:"100%",padding:12,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>go("vAssignDriver",{...o,currentStatus:status})}>🚚 Assigner un livreur</button>}
  </div>);
}

/* V4 ── VENDOR PRODUCTS ── */

export default VOrderDetailScr;
