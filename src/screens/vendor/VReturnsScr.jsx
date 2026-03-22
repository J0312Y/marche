import { useState } from "react";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";
function VReturnsScr({onBack}){
  const [returns,setReturns]=useState([
    {id:1,ref:"#RET-2026-0421",order:"#LMK-0210",client:"Marie K.",product:"Sac à Main Cuir",amount:42000,reason:"Produit différent de la photo",desc:"La couleur est plus foncée que sur la photo.",photos:["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop"],date:"14 Fév",status:"pending"},
    {id:2,ref:"#RET-2026-0398",order:"#LMK-0205",client:"Patrick M.",product:"Chemise Bogolan",amount:18000,reason:"Taille incorrecte",desc:"Commandé M, reçu S.",photos:[],date:"10 Fév",status:"approved"},
    {id:3,ref:"#RET-2026-0370",order:"#LMK-0198",client:"David T.",product:"Écouteurs Bluetooth",amount:35000,reason:"Produit défectueux",desc:"L'oreillette droite ne fonctionne pas.",photos:[],date:"5 Fév",status:"refused"},
  ]);
  const [tab,setTab]=useState("pending");
  const tabs={pending:returns.filter(r=>r.status==="pending"),approved:returns.filter(r=>r.status==="approved"),refused:returns.filter(r=>r.status==="refused")};
  const shown=tabs[tab]||[];
  const act=(id,status)=>{setReturns(prev=>prev.map(r=>r.id===id?{...r,status}:r));toast.success(status==="approved"?"Retour approuvé ✅":"Retour refusé ❌")};
  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>↩️ Retours ({tabs.pending.length})</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",gap:0,marginBottom:12,background:"var(--light)",borderRadius:12,padding:3}}>
      {[["pending","En attente ("+tabs.pending.length+")"],["approved","Approuvés"],["refused","Refusés"]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:tab===k?"var(--card)":"transparent",color:tab===k?"var(--text)":"var(--muted)",fontSize:11,fontWeight:tab===k?700:500,cursor:"pointer",fontFamily:"inherit",boxShadow:tab===k?"0 1px 4px rgba(0,0,0,.06)":"none"}}>{l}</button>)}
    </div>
    {shown.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36}}>{tab==="pending"?"📭":"✅"}</div><div style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Aucun retour {tab}</div></div>}
    {shown.map(r=><div key={r.id} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,fontWeight:700}}>{r.ref}</span><span style={{padding:"3px 8px",borderRadius:6,background:r.status==="pending"?"rgba(245,158,11,0.08)":r.status==="approved"?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)",color:r.status==="pending"?"#F59E0B":r.status==="approved"?"#10B981":"#EF4444",fontSize:10,fontWeight:700}}>{r.status==="pending"?"En attente":r.status==="approved"?"Approuvé":"Refusé"}</span></div>
      <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{r.product}</div>
      <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>👤 {r.client} · {r.date} · Commande {r.order}</div>
      <div style={{fontSize:12,color:"var(--sub)",marginBottom:4}}>📋 {r.reason}</div>
      {r.desc&&<div style={{fontSize:11,color:"var(--muted)",marginBottom:6,fontStyle:"italic"}}>"{r.desc}"</div>}
      {r.photos.length>0&&<div style={{display:"flex",gap:6,marginBottom:8}}>{r.photos.map((p,i)=><img key={i} src={p} style={{width:48,height:48,borderRadius:8,objectFit:"cover"}} alt=""/>)}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:14,fontWeight:700,color:"#F97316"}}>{fmt(r.amount)}</span>
        {r.status==="pending"&&<div style={{display:"flex",gap:6}}>
          <button onClick={()=>act(r.id,"refused")} style={{padding:"6px 14px",borderRadius:10,border:"1px solid rgba(239,68,68,.15)",background:"transparent",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✕ Refuser</button>
          <button onClick={()=>act(r.id,"approved")} style={{padding:"6px 14px",borderRadius:10,border:"none",background:"#F59E0B",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓ Approuver</button>
        </div>}
      </div>
    </div>)}
  </div>);
}
export default VReturnsScr;
