import InvoiceView from "../../components/InvoiceView";
import CreditNoteView from "../../components/CreditNoteView";
import { useState, useEffect } from "react";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";
import toast from "../../utils/toast";
import SuccessAnimation from "../../components/SuccessAnimation";
import Icon from "../../components/Icon";
import { getMod, updateModStatus, computeDiff, timeAgo } from "../../utils/orderMods";

function VOrderDetailScr({order:o,onBack,go}){
  const [acceptingOrder,setAcceptingOrder]=useState(false);
  const [refusingOrder,setRefusingOrder]=useState(false);
  const [showInvoice,setShowInvoice]=useState(false);
  const [showCreditNote,setShowCreditNote]=useState(false);
  const [status,setStatus]=useState(o.status);
  const [showRefuse,setShowRefuse]=useState(false);
  const [cashStatus,setCashStatus]=useState(null);

  // ═══ MODIFICATION FROM CLIENT ═══
  const [mod, setMod] = useState(() => getMod(o.ref));
  const [showModDetails, setShowModDetails] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.ref === o.ref) setMod(getMod(o.ref));
    };
    window.addEventListener("order-mod-updated", handler);
    return () => window.removeEventListener("order-mod-updated", handler);
  }, [o.ref]);

  const acceptMod = () => {
    updateModStatus(o.ref, "vendor_ack");
    setMod(getMod(o.ref));
    toast.success("Modification acceptée — Le livreur est notifié");
  };

  const refuseMod = () => {
    updateModStatus(o.ref, "refused");
    setMod(getMod(o.ref));
    toast.error("Modification refusée — Le client sera remboursé");
  };

  const fmtNum = (n) => n.toLocaleString("fr-FR").replace(/,/g, " ");

  const statusMap={new:"Nouvelle",preparing:"En préparation",shipped:"Expédiée",delivered:"Livrée",refused:"Refusée"};
  const next={new:"preparing",preparing:"shipped",shipped:"delivered"};
  const nextLabel={new:"Accepter",preparing:"Marquer prête",shipped:"Confirmer livraison"};

  if(status==="refused")return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"40px 0"}}><div style={{width:70,height:70,borderRadius:"50%",background:"rgba(239,68,68,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:32}}></div>
      <h3 style={{fontSize:18,fontWeight:700,color:"#EF4444"}}>Commande refusée</h3>
      <p style={{fontSize:13,color:"var(--muted)",marginTop:6}}>{o.ref} · {o.client}</p>
      <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Le client sera notifié et remboursé.</p>
      <button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour</button>
      <button onClick={()=>setShowInvoice(true)} style={{padding:14,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)",marginTop:8}}><Icon name="receipt" size={16}/>{" "}Générer le reçu</button>
      {showCreditNote&&<CreditNoteView order={{id:o?.ref||"CMD-0891",client:o?.client||"Marie Koumba",vendor:"Ma Boutique",amount:o?.total||25000,items:o?.items?.map(it=>({name:it.name,qty:it.qty,price:it.price}))||[{name:"Article",qty:1,price:o?.total||25000}],delivery:1500,payment:o?.payment||"airtel",cancelReason:status==="refused"?"Refusé par le vendeur":"Annulation"}} refundMethod="wallet" onClose={()=>setShowCreditNote(false)}/>}
    {showInvoice&&<InvoiceView order={{id:o?.ref||"LMK-0891",client:o?.client||"Marie Koumba",vendor:o?.vendor||"Mode Afrique",amount:o?.total||25000,items:o?.items?.map(it=>({name:it.name,qty:it.qty,price:it.price,sides:it.sides}))||[{name:"Article",qty:1,price:o?.total||25000}],delivery:1500,payment:o?.payment||"airtel",status:o?.status||"new"}} onClose={()=>setShowInvoice(false)}/>}
    </div>
  </div>);

  if(acceptingOrder)return<SuccessAnimation title="Commande acceptée !" subtitle={o.ref} hint="En préparation..." duration={0}/>;
  if(refusingOrder)return<SuccessAnimation type="error" title="Commande refusée" subtitle={o.ref} hint="Le client sera notifié" duration={0}/>;

  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span className={`vo-status ${status}`} style={{fontSize:13}}>{statusMap[status]}</span><span style={{fontSize:12,color:"var(--muted)"}}>{o.date}</span></div>

    {/* ═══ MODIFICATION BANNER ═══ */}
    {mod && mod.status === "pending" && (() => {
      const diff = computeDiff(mod.oldItems || [], mod.newItems || []);
      return (
        <div style={{
          padding:14, borderRadius:14, marginBottom:14,
          background:"linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))",
          border:"1.5px solid rgba(59,130,246,0.3)",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:11,background:"linear-gradient(135deg,#3B82F6,#2563EB)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="edit" size={17} color="#fff"/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:800,color:"#1D4ED8",letterSpacing:-0.2}}>Le client a modifié la commande</div>
              <div style={{fontSize:11,color:"#3B82F6"}}>{timeAgo(mod.modifiedAt)}</div>
            </div>
          </div>

          {/* Diff summary */}
          <div style={{background:"var(--card)",borderRadius:10,padding:10,marginBottom:10}}>
            {diff.updated.length > 0 && diff.updated.map((u, i) => (
              <div key={"u"+i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"var(--text)",padding:"3px 0"}}>
                <span style={{padding:"1px 6px",background:u.change.startsWith("+")?"rgba(59,130,246,0.12)":"rgba(245,158,11,0.12)",color:u.change.startsWith("+")?"#3B82F6":"#B45309",borderRadius:4,fontSize:9,fontWeight:700,minWidth:24,textAlign:"center"}}>{u.change}</span>
                <span style={{flex:1}}>{u.name}</span>
                <span style={{color:"var(--muted)",fontSize:10}}>{u.oldQty} → {u.newQty}</span>
              </div>
            ))}
            {diff.removed.length > 0 && diff.removed.map((r, i) => (
              <div key={"r"+i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"var(--text)",padding:"3px 0"}}>
                <span style={{padding:"1px 6px",background:"rgba(239,68,68,0.12)",color:"#DC2626",borderRadius:4,fontSize:9,fontWeight:700,minWidth:24,textAlign:"center"}}>−</span>
                <span style={{flex:1,textDecoration:"line-through"}}>{r.name}</span>
                <span style={{color:"#DC2626",fontSize:10}}>SUPPRIMÉ</span>
              </div>
            ))}
            {diff.added.length > 0 && diff.added.map((a, i) => (
              <div key={"a"+i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"var(--text)",padding:"3px 0"}}>
                <span style={{padding:"1px 6px",background:"rgba(16,185,129,0.12)",color:"#10B981",borderRadius:4,fontSize:9,fontWeight:700,minWidth:24,textAlign:"center"}}>+</span>
                <span style={{flex:1}}>{a.name}</span>
                <span style={{color:"#10B981",fontSize:10}}>NOUVEAU x{a.qty}</span>
              </div>
            ))}
          </div>

          {/* Money summary */}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6,color:"var(--text)"}}>
            <span style={{color:"var(--muted)"}}>Ancien total</span>
            <span>{fmtNum(mod.oldTotal)} F</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6,color:"var(--text)"}}>
            <span style={{color:"var(--muted)"}}>Nouveau total</span>
            <span style={{fontWeight:700}}>{fmtNum(mod.newTotal)} F</span>
          </div>
          {mod.modifyFee > 0 && (
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8,padding:"6px 8px",background:"rgba(245,158,11,0.08)",borderRadius:6}}>
              <span style={{color:"#B45309",fontWeight:600}}>💰 Frais de modif (votre part)</span>
              <span style={{color:"#B45309",fontWeight:700}}>+{fmtNum(Math.round(mod.modifyFee * 0.5))} F</span>
            </div>
          )}

          {/* Actions */}
          <div style={{display:"flex",gap:6,marginTop:10}}>
            <button onClick={refuseMod} style={{
              flex:1, padding:"10px 0", borderRadius:10,
              border:"1px solid rgba(239,68,68,0.3)", background:"transparent",
              color:"#DC2626", fontSize:11, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit"
            }}>
              Refuser
            </button>
            <button onClick={acceptMod} style={{
              flex:2, padding:"10px 0", borderRadius:10,
              border:"none", background:"#3B82F6",
              color:"#fff", fontSize:11, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit",
              display:"flex", alignItems:"center", justifyContent:"center", gap:5,
              boxShadow:"0 2px 8px rgba(59,130,246,0.25)"
            }}>
              <Icon name="check" size={12} color="#fff"/>
              Accepter la modification
            </button>
          </div>
        </div>
      );
    })()}

    {/* Modification already accepted banner */}
    {mod && (mod.status === "vendor_ack" || mod.status === "driver_ack" || mod.status === "complete") && (
      <div style={{
        padding:"10px 12px", borderRadius:10, marginBottom:14,
        background:"rgba(16,185,129,0.06)",
        border:"1px solid rgba(16,185,129,0.2)",
        display:"flex", alignItems:"center", gap:8,
      }}>
        <Icon name="check_circle" size={14} color="#10B981"/>
        <div style={{flex:1,fontSize:11,color:"#047857",fontWeight:600}}>
          Modification acceptée · Nouveau total : {fmtNum(mod.newTotal)} F
        </div>
      </div>
    )}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}><Icon name="user" size={16}/>{" "}Client</div>
      {[["Nom",o.client],["Téléphone",o.phone],["Adresse",o.addr],["Paiement",o.payment==="cash"?"Cash à la livraison":o.payment]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border)",fontSize:13}}><span style={{color:"var(--muted)"}}>{l}</span><b>{v}</b></div>)}
      {o.isGroup&&<div style={{marginTop:8,padding:10,background:"rgba(59,130,246,0.04)",borderRadius:10,border:"1px solid rgba(59,130,246,0.1)"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#3B82F6",marginBottom:6}}><Icon name="handshake" size={16}/>{" "}Commande de groupe — {o.groupMembers?.length||0} participants</div>
        {o.groupMembers?.map((m,mi)=><div key={mi} style={{padding:"6px 0",borderBottom:mi<o.groupMembers.length-1?"1px solid var(--border)":"none"}}>
          <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>{m.name}</div>
          {m.items?.map((it,ii)=><div key={ii} style={{display:"flex",alignItems:"center",gap:6,paddingLeft:10,padding:"3px 0 3px 10px"}}><div style={{width:22,height:22,borderRadius:5,overflow:"hidden",flexShrink:0}}><Img src={it.photo} emoji={it.img} style={{width:"100%",height:"100%"}} fit="cover"/></div><span style={{flex:1,fontSize:11,color:"var(--sub)"}}>{it.name} ×{it.qty}</span><span style={{fontSize:11,fontWeight:600,color:"#F97316"}}>{fmt(it.price*(it.qty||1))}</span></div>)}
        </div>)}
      </div>}
    </div>
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}><Icon name="package" size={16}/>{" "}Articles</div>
      {o.items.map((it,i)=><div key={i}><div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:it.sides?.length?"none":"1px solid var(--border)"}}><Img src={it.photo} emoji={it.img} style={{width:44,height:44,borderRadius:8,flexShrink:0}} fit="cover"/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{it.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>x{it.qty}</div></div><div style={{fontSize:13,fontWeight:700,color:"#F97316"}}>{fmt(it.price*it.qty)}</div></div>{it.sides?.length>0&&<div style={{padding:"4px 0 8px 54px",borderBottom:"1px solid var(--border)"}}>{it.sides.map((s,si)=><div key={si} style={{fontSize:11,color:"var(--sub)",display:"flex",justifyContent:"space-between",padding:"1px 0"}}><span>↳ {s.img} {s.name}{s.qty>1?"×"+s.qty:""}</span><span style={{color:s.price>0?"#F97316":"#10B981"}}>{s.price>0?"+"+fmt(s.price*(s.qty||1)):"Gratuit"}</span></div>)}</div>}</div>)}
      {o.note&&<div style={{padding:"8px 10px",background:"rgba(59,130,246,0.04)",borderRadius:8,marginTop:8,fontSize:11,color:"#3B82F6"}}><b> Note client :</b> {o.note}</div>}
      <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,fontSize:16,fontWeight:700}}><span>Total</span><span style={{color:"#F97316"}}>{fmt(o.total)}</span></div>
    </div>

    {/* Refuse confirmation */}
    {showRefuse&&<div style={{padding:16,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,color:"#EF4444",marginBottom:8}}>️ Confirmer le refus ?</div>
      <p style={{fontSize:12,color:"var(--sub)",marginBottom:12}}>Le client sera notifié et remboursé automatiquement. Cette action est irréversible.</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowRefuse(false)}>Annuler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setRefusingOrder(true);setTimeout(()=>{setStatus("refused");setRefusingOrder(false)},1500)}}> Confirmer le refus</button>
      </div>
    </div>}

    {/* Cash payment handling */}
    {o.payment==="cash"&&status==="delivered"&&!cashStatus&&<div style={{padding:16,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:16,marginBottom:14,animation:"fadeIn .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <span style={{fontSize:22}}><Icon name="wallet" size={18}/></span>
        <div><div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Paiement cash en attente</div><div style={{fontSize:11,color:"var(--muted)"}}>Le livreur doit vous reverser via Mobile Money</div></div>
      </div>
      <div style={{padding:12,background:"var(--card)",borderRadius:12,border:"1px solid var(--border)",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:"var(--muted)"}}>Total commande</span><b>{fmt(o.total)}</b></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4,color:"#10B981"}}><span>− Frais livraison</span><b>- {fmt(2000)}</b></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:800,paddingTop:6,borderTop:"1px solid var(--border)",color:"#F97316"}}><span>Montant attendu</span><span>{fmt(o.total-2000)}</span></div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={()=>{setCashStatus("received");toast.success("Paiement confirmé — commission de "+fmt(Math.round(o.total*0.05))+" déduite du wallet")}} style={{width:"100%",padding:12,borderRadius:12,border:"none",background:"#10B981",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Icon name="check_circle" size={16}/>{" "}J'ai reçu le paiement</button>
        <button onClick={()=>{setCashStatus("pending");toast.info("⏳ Rappel envoyé au livreur")}} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid #F59E0B",background:"transparent",color:"#F59E0B",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>⏳ Pas encore reçu — Rappeler le livreur</button>
        <button onClick={()=>{setCashStatus("dispute");toast.error("Litige signalé — Support Lamuka contacté")}} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Icon name="x_circle" size={16}/>{" "}Signaler un problème</button>
      </div>
    </div>}

    {/* Cash confirmed */}
    {o.payment==="cash"&&cashStatus==="received"&&<div style={{padding:12,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:14,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:22}}><Icon name="check_circle" size={18}/></span>
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
        <button onClick={()=>{setCashStatus("received");toast.success("Paiement confirmé")}} style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#10B981",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Icon name="check_circle" size={16}/>{" "}Reçu maintenant</button>
        <button onClick={()=>{setCashStatus("dispute");toast.error("Litige ouvert")}} style={{flex:1,padding:10,borderRadius:10,border:"1px solid #EF4444",background:"transparent",color:"#EF4444",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}><Icon name="x_circle" size={16}/>{" "}Ouvrir litige</button>
      </div>
    </div>}

    {/* Cash dispute */}
    {o.payment==="cash"&&cashStatus==="dispute"&&<div style={{padding:12,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:14,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:22}}></span>
      <div><div style={{fontSize:13,fontWeight:600,color:"#EF4444"}}>Litige en cours</div><div style={{fontSize:11,color:"var(--muted)"}}>L'équipe Lamuka va traiter votre dossier sous 24-48h.</div></div>
    </div>}

    {status!=="delivered"&&!showRefuse&&<div className="vo-actions">
      <button className={status==="new"?"vo-accept":status==="preparing"?"vo-prepare":"vo-ship"} onClick={()=>setStatus(next[status])}>{nextLabel[status]}</button>
      {status==="new"&&<button className="vo-reject" onClick={()=>setShowRefuse(true)}> Refuser</button>}
    </div>}
    {(status==="preparing"||status==="shipped")&&<button style={{marginTop:10,width:"100%",padding:12,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>go("vAssignDriver",{...o,currentStatus:status})}><Icon name="truck" size={16}/>{" "}Assigner un livreur</button>}
  </div>);
}

/* V4 ── VENDOR PRODUCTS ── */

export default VOrderDetailScr;
