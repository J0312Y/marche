import { useState } from "react";
import toast from "../../utils/toast";
import PullToRefresh from "../../components/PullToRefresh";

function OrdersScr({go}){
  const [orders,setOrders]=useState([
    {ref:"#LMK-2026-0214",date:"14 Fév 2026",status:"En livraison",sc:"ship",total:"231 500",vendor:"Tech Congo",items:["📱 Galaxy A54","🥬 Panier Bio x3"],prog:[1,1,1,0]},
    {ref:"#LMK-2026-0210",date:"10 Fév 2026",status:"Livré",sc:"done",total:"42 000",vendor:"Mode Afrique",items:["👜 Sac Cuir"],prog:[1,1,1,1]},
    {ref:"#LMK-2026-0205",date:"5 Fév 2026",status:"Livré",sc:"done",total:"18 000",vendor:"Mode Afrique",items:["👔 Chemise Bogolan"],prog:[1,1,1,1]},
    {ref:"#LMK-2026-0201",date:"1 Fév 2026",status:"En préparation",sc:"prep",total:"5 500",vendor:"Chez Mama Ngudi",items:["🍗 Poulet DG"],prog:[1,1,0,0],payment:"cash"},
    {ref:"#LMK-2026-0198",date:"28 Jan 2026",status:"Annulée",sc:"cancel",total:"15 000",vendor:"Tech Congo",items:["🎧 Écouteurs Bluetooth"],prog:[1,0,0,0],payment:"mtn"},
  ]);
  const [cancelConfirm,setCancelConfirm]=useState(null);
  const [reorderConfirm,setReorderConfirm]=useState(null);

  const cancelOrder=(ref)=>{
    setOrders(prev=>prev.map(o=>o.ref===ref?{...o,status:"Annulée",sc:"cancel"}:o));
    setCancelConfirm(null);
    toast.success("Commande annulée — Remboursement sous 24-48h 💸");
  };

  const reorder=(o)=>{
    const newRef="#LMK-2026-"+String(Math.floor(Math.random()*9000+1000));
    const newOrder={...o,ref:newRef,date:new Date().toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"}),status:"En préparation",sc:"prep",prog:[1,1,0,0]};
    setOrders(prev=>[newOrder,...prev]);
    setReorderConfirm(null);
    toast.success("Commande recréée ! Confirmez le paiement 🛍️");
    // Navigate to checkout with the reorder
    setTimeout(()=>go("orderDetail",newOrder),300);
  };

  const [tab,setTab]=useState("active");
  const active=orders.filter(o=>o.sc==="ship"||o.sc==="prep");
  const done=orders.filter(o=>o.sc==="done");
  const cancelled=orders.filter(o=>o.sc==="cancel");
  const shown=tab==="active"?active:tab==="done"?done:cancelled;

  return(<><PullToRefresh onRefresh={async()=>{toast.success("Commandes actualisées 📦")}}><div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><h2>Mes commandes ({orders.length})</h2></div>

    {/* Tabs */}
    <div style={{display:"flex",gap:0,marginBottom:12,background:"var(--light)",borderRadius:12,padding:3}}>
      {[["active","En cours",active.length],["done","Livrées",done.length],["cancelled","Annulées",cancelled.length]].map(([k,l,c])=>(
        <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:tab===k?"var(--card)":"transparent",color:tab===k?"var(--text)":"var(--muted)",fontSize:11,fontWeight:tab===k?700:500,cursor:"pointer",fontFamily:"inherit",boxShadow:tab===k?"0 1px 4px rgba(0,0,0,.06)":"none"}}>{l} ({c})</button>
      ))}
    </div>

    {shown.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36,marginBottom:8}}>{tab==="active"?"📦":tab==="done"?"✅":"❌"}</div><div style={{fontSize:13,color:"var(--muted)"}}>Aucune commande {tab==="active"?"en cours":tab==="done"?"livrée":"annulée"}</div></div>}

    {shown.map(o=><div key={o.ref} className="ocard" onClick={()=>go("orderDetail",o)}>
      <div className="ocard-h"><h4>{o.ref}</h4><div style={{display:"flex",gap:4,alignItems:"center"}}>{o.payment==="cash"&&<span style={{padding:"2px 6px",borderRadius:5,background:"rgba(245,158,11,0.08)",color:"#F59E0B",fontSize:9,fontWeight:700}}>💵</span>}<span className={`ost ${o.sc}`}>{o.status}</span></div></div>
      <div className="odate">{o.date}</div>
      <div style={{fontSize:13,color:"var(--sub)",marginBottom:10}}>{o.items.join(" · ")}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:15,fontWeight:700,color:"#F97316"}}>{o.total} FCFA</span>
        <div style={{display:"flex",gap:6}}>
          {o.sc==="ship"&&<button style={{padding:"6px 12px",borderRadius:8,background:"rgba(249,115,22,0.08)",fontSize:11,fontWeight:600,color:"#F97316",cursor:"pointer",border:"none",fontFamily:"inherit"}} onClick={e=>{e.stopPropagation();go("tracking")}}>📍 Suivre</button>}
          {o.sc==="done"&&<button style={{padding:"6px 12px",borderRadius:8,background:"rgba(16,185,129,0.08)",fontSize:11,fontWeight:600,color:"#10B981",cursor:"pointer",border:"1px solid rgba(249,115,22,0.15)",fontFamily:"inherit"}} onClick={e=>{e.stopPropagation();setReorderConfirm(o)}}>🔄 Recommander</button>}
          {(o.sc==="ship"||o.sc==="prep")&&<button style={{padding:"6px 12px",borderRadius:8,background:"rgba(239,68,68,0.06)",fontSize:11,fontWeight:600,color:"#EF4444",cursor:"pointer",border:"1px solid rgba(239,68,68,0.15)",fontFamily:"inherit"}} onClick={e=>{e.stopPropagation();setCancelConfirm(o)}}>✕ Annuler</button>}
        </div>
      </div>
    </div>)}</div>
    </PullToRefresh>

    {/* Cancel modal */}
    {cancelConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setCancelConfirm(null)}>
      <div style={{background:"var(--card)",borderRadius:20,padding:24,maxWidth:340,width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:40,marginBottom:10}}>⚠️</div>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:6}}>Annuler la commande ?</h3>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:14}}>{cancelConfirm.ref} — {cancelConfirm.total} FCFA<br/>Remboursement sous 24-48h.</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setCancelConfirm(null)} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Non</button>
          <button onClick={()=>cancelOrder(cancelConfirm.ref)} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Oui, annuler</button>
        </div>
      </div>
    </div>}

    {/* Reorder modal */}
    {reorderConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setReorderConfirm(null)}>
      <div style={{background:"var(--card)",borderRadius:20,padding:24,maxWidth:340,width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:40,marginBottom:10}}>🔄</div>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:6}}>Recommander ?</h3>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:8}}>Les mêmes articles seront ajoutés :</p>
        <div style={{textAlign:"left",marginBottom:14}}>
          {reorderConfirm.items.map((item,i)=><div key={i} style={{padding:"6px 0",fontSize:13,borderBottom:i<reorderConfirm.items.length-1?"1px solid var(--border)":"none"}}>{item}</div>)}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,fontWeight:700,fontSize:14}}>
            <span>Total</span><span style={{color:"#F97316"}}>{reorderConfirm.total} FCFA</span>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setReorderConfirm(null)} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
          <button onClick={()=>reorder(reorderConfirm)} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🛍️ Commander</button>
        </div>
      </div>
    </div>}
  </>);
}

export default OrdersScr;
