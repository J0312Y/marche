import { useState } from "react";
import { V_ORDERS } from "../../data/vendorData";
import { fmt } from "../../utils/helpers";

function VOrdersScr({go,onBack}){
  const [filter,setFilter]=useState("all");
  const statusMap={new:"Nouvelle",preparing:"En préparation",shipped:"Expédiée",delivered:"Livrée"};
  const counts={all:V_ORDERS.length,new:V_ORDERS.filter(o=>o.status==="new").length,preparing:V_ORDERS.filter(o=>o.status==="preparing").length,shipped:V_ORDERS.filter(o=>o.status==="shipped").length,delivered:V_ORDERS.filter(o=>o.status==="delivered").length};
  const filtered=filter==="all"?V_ORDERS:V_ORDERS.filter(o=>o.status===filter);
  return(<div className="scr">
    <div className="appbar">{onBack&&<button onClick={onBack}>←</button>}<h2>Commandes</h2><button onClick={()=>go("vNotif")}>🔔</button></div>
    <div className="vo-filter">{[["all","Toutes"],["new","🆕 Nouvelles"],["preparing","⏳ En prép."],["shipped","🚚 Expédiées"],["delivered","✅ Livrées"]].map(([k,l])=><button key={k} className={filter===k?"on":""} onClick={()=>setFilter(k)}>{l} ({counts[k]})</button>)}</div>
    <div style={{padding:"0 20px 100px"}}>{filtered.map(o=><div key={o.id} className="vo-card" onClick={()=>go("vOrderDetail",o)}>
      <div className="vo-head"><h4>{o.ref}</h4><span className={`vo-status ${o.status}`}>{statusMap[o.status]}</span></div>
      <div className="vo-client">👤 {o.client}</div><div className="vo-date">{o.date} · {o.payment}</div>
      <div className="vo-items">{o.items.map((it,i)=><span key={i} className="vo-item">{it.img} {it.name} x{it.qty}</span>)}</div>
      <div className="vo-foot"><span className="vo-total">{fmt(o.total)}</span><span className="vo-pay">{o.payment}</span></div>
    </div>)}</div>
  </div>);
}

/* V3 ── VENDOR ORDER DETAIL ── */

export default VOrdersScr;
