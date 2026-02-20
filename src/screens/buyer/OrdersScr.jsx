

function OrdersScr({go}){
  const orders=[{ref:"#LMK-2026-0214",date:"14 Fév 2026",status:"En livraison",sc:"ship",total:"231 500",items:["📱 Galaxy A54","🥬 Panier Bio x3"],prog:[1,1,1,0]},{ref:"#LMK-2026-0210",date:"10 Fév 2026",status:"Livré",sc:"done",total:"42 000",items:["👜 Sac Cuir"],prog:[1,1,1,1]},{ref:"#LMK-2026-0205",date:"5 Fév 2026",status:"Livré",sc:"done",total:"18 000",items:["👔 Chemise Bogolan"],prog:[1,1,1,1]}];
  return(<div className="scr" style={{padding:20}}>
    <div className="appbar" style={{padding:0,marginBottom:16}}><h2>Mes commandes</h2></div>
    {orders.map(o=><div key={o.ref} className="ocard" onClick={()=>go("orderDetail",o)}>
      <div className="ocard-h"><h4>{o.ref}</h4><span className={`ost ${o.sc}`}>{o.status}</span></div>
      <div className="odate">{o.date}</div>
      <div style={{fontSize:13,color:"#5E5B53",marginBottom:10}}>{o.items.join(" · ")}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:16,fontWeight:700,color:"#6366F1"}}>{o.total} FCFA</span>
        {o.sc==="ship"&&<button style={{padding:"6px 14px",borderRadius:8,background:"rgba(99,102,241,0.08)",fontSize:11,fontWeight:600,color:"#6366F1",cursor:"pointer",border:"none",fontFamily:"inherit"}} onClick={e=>{e.stopPropagation();go("tracking")}}>📍 Suivre</button>}
      </div>
    </div>)}
  </div>);
}

/* 18 ── ORDER DETAIL ── */

export default OrdersScr;
