import { useState } from "react";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";

function VOrderDetailScr({order:o,onBack,go}){
  const [status,setStatus]=useState(o.status);
  const [showRefuse,setShowRefuse]=useState(false);
  const statusMap={new:"Nouvelle",preparing:"En préparation",shipped:"Expédiée",delivered:"Livrée",refused:"Refusée"};
  const next={new:"preparing",preparing:"shipped",shipped:"delivered"};
  const nextLabel={new:"✅ Accepter",preparing:"📦 Marquer prête",shipped:"🚚 Confirmer livraison"};

  if(status==="refused")return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"40px 0"}}><div style={{width:70,height:70,borderRadius:"50%",background:"rgba(239,68,68,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:32}}>✕</div>
      <h3 style={{fontSize:18,fontWeight:700,color:"#EF4444"}}>Commande refusée</h3>
      <p style={{fontSize:13,color:"#908C82",marginTop:6}}>{o.ref} · {o.client}</p>
      <p style={{fontSize:12,color:"#908C82",marginTop:4}}>Le client sera notifié et remboursé.</p>
      <button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour aux commandes</button>
    </div>
  </div>);

  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span className={`vo-status ${status}`} style={{fontSize:13}}>{statusMap[status]}</span><span style={{fontSize:12,color:"#908C82"}}>{o.date}</span></div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>👤 Client</div>
      {[["Nom",o.client],["Téléphone",o.phone],["Adresse",o.addr],["Paiement",o.payment]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #F5F4F1",fontSize:13}}><span style={{color:"#908C82"}}>{l}</span><b>{v}</b></div>)}
    </div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>📦 Articles</div>
      {o.items.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #F5F4F1"}}><Img src={it.photo} emoji={it.img} style={{width:44,height:44,borderRadius:8,flexShrink:0}} fit="cover"/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{it.name}</div><div style={{fontSize:11,color:"#908C82"}}>x{it.qty}</div></div><div style={{fontSize:13,fontWeight:700,color:"#6366F1"}}>{fmt(it.price*it.qty)}</div></div>)}
      <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,fontSize:16,fontWeight:700}}><span>Total</span><span style={{color:"#6366F1"}}>{fmt(o.total)}</span></div>
    </div>

    {/* Refuse confirmation */}
    {showRefuse&&<div style={{padding:16,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,color:"#EF4444",marginBottom:8}}>⚠️ Confirmer le refus ?</div>
      <p style={{fontSize:12,color:"#5E5B53",marginBottom:12}}>Le client sera notifié et remboursé automatiquement. Cette action est irréversible.</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowRefuse(false)}>Annuler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setStatus("refused")}>✕ Confirmer le refus</button>
      </div>
    </div>}

    {status!=="delivered"&&!showRefuse&&<div className="vo-actions">
      <button className={status==="new"?"vo-accept":status==="preparing"?"vo-prepare":"vo-ship"} onClick={()=>setStatus(next[status])}>{nextLabel[status]}</button>
      {status==="new"&&<button className="vo-reject" onClick={()=>setShowRefuse(true)}>✕ Refuser</button>}
    </div>}
    {(status==="preparing"||status==="shipped")&&<button style={{marginTop:10,width:"100%",padding:12,borderRadius:14,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>go("vAssignDriver",{...o,currentStatus:status})}>🚚 Assigner un livreur</button>}
  </div>);
}

/* V4 ── VENDOR PRODUCTS ── */

export default VOrderDetailScr;
