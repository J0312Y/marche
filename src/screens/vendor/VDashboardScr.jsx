import { useState } from "react";
import { V_ORDERS, V_STATS } from "../../data/vendorData";
import { fmt } from "../../utils/helpers";

function VDashboardScr({go}){
  const [period,setPeriod]=useState("week");
  const d=period==="today"?V_STATS.today:period==="week"?V_STATS.week:V_STATS.month;
  const maxBar=Math.max(...V_STATS.chartWeek);
  const days=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const newOrders=V_ORDERS.filter(o=>o.status==="new").length;
  return(<div className="scr">
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px 0"}}><div><div style={{fontSize:12,color:"#908C82"}}>Bonjour 👋</div><div style={{fontSize:20,fontWeight:700,letterSpacing:-.5}}>Mon Commerce</div></div><div className="hdr-r"><div className="hdr-btn" onClick={()=>go("vNotif")}>🔔{newOrders>0&&<div className="notif-badge"/>}</div></div></div>
    <div className="vd-period" style={{marginTop:14}}>{[["today","Aujourd'hui"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>
    <div className="vd-stats">
      <div className="vd-stat"><div className="vs-icon">💰</div><div className="vs-val">{fmt(d.revenue)}</div><div className="vs-lbl">Chiffre d'affaires</div><div className="vs-trend up">↑ 23%</div></div>
      <div className="vd-stat"><div className="vs-icon">📦</div><div className="vs-val">{d.orders}</div><div className="vs-lbl">Commandes</div>{newOrders>0&&<div className="vs-trend up">{newOrders} nouvelle{newOrders>1?"s":""}</div>}</div>
      <div className="vd-stat"><div className="vs-icon">👁️</div><div className="vs-val">{d.visitors}</div><div className="vs-lbl">Visiteurs</div><div className="vs-trend up">↑ 12%</div></div>
      <div className="vd-stat"><div className="vs-icon">⭐</div><div className="vs-val">4.6</div><div className="vs-lbl">Note moyenne</div><div className="vs-trend up">↑ 0.2</div></div>
    </div>
    <div className="vd-chart"><h4>Ventes de la semaine <span onClick={()=>go("vStats")}>Voir tout →</span></h4><div className="chart-bars">{V_STATS.chartWeek.map((v,i)=><div key={i} className="chart-bar" style={{height:`${(v/maxBar)*100}%`}}><div className="cb-tip">{fmt(v*1000)}</div></div>)}</div><div className="chart-labels">{days.map(d=><span key={d}>{d}</span>)}</div></div>
    <div className="vd-top"><h4>Top Produits</h4>{V_STATS.topProducts.map((p,i)=><div key={i} className="vd-top-item"><div className={`rank ${i===0?"g":""}`}>{i+1}</div><div className="ti-info"><h5>{p.name}</h5><p>{p.sold} vendus</p></div><div className="ti-rev">{fmt(p.revenue)}</div></div>)}</div>
    <div style={{padding:"16px 20px"}}><div className="info-box yellow"><span>⚠️</span><span><b>Sac à Main Cuir</b> — Stock faible (3 restants). <b style={{color:"#6366F1",cursor:"pointer"}} onClick={()=>go("vProducts")}>Réapprovisionner →</b></span></div></div>
  </div>);
}

/* V2 ── VENDOR ORDERS LIST ── */

export default VDashboardScr;
