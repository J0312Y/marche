import { useState } from "react";
import toast from "../../utils/toast";

function OrdersScr({go}){
  const [orders,setOrders]=useState([
    {ref:"#LMK-2026-0214",date:"14 Fév 2026",status:"En livraison",sc:"ship",total:"231 500",items:["📱 Galaxy A54","🥬 Panier Bio x3"],prog:[1,1,1,0]},
    {ref:"#LMK-2026-0210",date:"10 Fév 2026",status:"Livré",sc:"done",total:"42 000",items:["👜 Sac Cuir"],prog:[1,1,1,1]},
    {ref:"#LMK-2026-0205",date:"5 Fév 2026",status:"Livré",sc:"done",total:"18 000",items:["👔 Chemise Bogolan"],prog:[1,1,1,1]},
    {ref:"#LMK-2026-0201",date:"1 Fév 2026",status:"En préparation",sc:"prep",total:"5 500",items:["🍗 Poulet DG"],prog:[1,1,0,0]},
  ]);
  const [cancelConfirm,setCancelConfirm]=useState(null);

  const cancelOrder=(ref)=>{
    setOrders(prev=>prev.map(o=>o.ref===ref?{...o,status:"Annulée",sc:"cancel"}:o));toast.success("Commande annulée. Remboursement sous 24-48h 💸");
    setCancelConfirm(null);toast.success("Commande annulée — Remboursement sous 24-48h 💸");
  };

  return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><h2>Mes commandes</h2></div>
    {orders.map(o=><div key={o.ref} className="ocard" onClick={()=>go("orderDetail",o)}>
      <div className="ocard-h"><h4>{o.ref}</h4><span className={`ost ${o.sc}`}>{o.status}</span></div>
      <div className="odate">{o.date}</div>
      <div style={{fontSize:13,color:"#5E5B53",marginBottom:10}}>{o.items.join(" · ")}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:16,fontWeight:700,color:"#6366F1"}}>{o.total} FCFA</span>
        <div style={{display:"flex",gap:6}}>
          {o.sc==="ship"&&<button style={{padding:"6px 14px",borderRadius:8,background:"rgba(99,102,241,0.08)",fontSize:11,fontWeight:600,color:"#6366F1",cursor:"pointer",border:"none",fontFamily:"inherit"}} onClick={e=>{e.stopPropagation();go("tracking")}}>📍 Suivre</button>}
          {(o.sc==="ship"||o.sc==="prep")&&<button style={{padding:"6px 14px",borderRadius:8,background:"rgba(239,68,68,0.06)",fontSize:11,fontWeight:600,color:"#EF4444",cursor:"pointer",border:"1px solid rgba(239,68,68,0.15)",fontFamily:"inherit"}} onClick={e=>{e.stopPropagation();setCancelConfirm(o)}}>✕ Annuler</button>}
        </div>
      </div>
    </div>)}

    {/* Cancel confirmation */}
    {cancelConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setCancelConfirm(null)}>
      <div style={{background:"#fff",borderRadius:20,padding:24,maxWidth:340,width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:40,marginBottom:10}}>⚠️</div>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:6}}>Annuler la commande ?</h3>
        <p style={{fontSize:13,color:"#908C82",marginBottom:14,lineHeight:1.5}}>
          La commande {cancelConfirm.ref} sera annulée. Le remboursement sera effectué sous 24-48h.
        </p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setCancelConfirm(null)} style={{flex:1,padding:12,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Non, garder</button>
          <button onClick={()=>cancelOrder(cancelConfirm.ref)} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Oui, annuler</button>
        </div>
      </div>
    </div>}
  </div>);
}

export default OrdersScr;
