import { useState } from "react";
import { D_DELIVERIES, D_HISTORY, D_STATS } from "../../data/driverData";
import { fmt } from "../../utils/helpers";

function DrDashboardScr({go}){
  const [online,setOnline]=useState(true);
  const [period,setPeriod]=useState("today");
  const [dismissed,setDismissed]=useState(false);
  const d=D_STATS[period];
  const pending=dismissed?null:D_DELIVERIES.find(x=>x.status==="pending");
  const active=D_DELIVERIES.find(x=>x.status==="active");
  return(<div className="scr">
    <div className="dr-hero">
      <div className="dr-top"><div style={{display:"flex",alignItems:"center",gap:12}}><div className="dr-av">🧑</div><div><div className="dr-name">Patrick Moukala</div><div className="dr-sub">🛵 Honda PCX · BZ-4521</div></div></div><div className="hdr-btn" style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff"}} onClick={()=>go("drNotif")}>🔔</div></div>
      <div className="dr-toggle-bar" onClick={()=>setOnline(!online)}><div className={`dt-dot ${online?"on":"off"}`}/><span>{online?"En ligne — Prêt à livrer":"Hors ligne"}</span><div className={`toggle ${online?"on":""}`}/></div>
      <div className="dr-stats"><div className="dr-stat"><b>{d.deliveries}</b><span>Livraisons</span></div><div className="dr-stat"><b>{fmt(d.earned)}</b><span>Gagné</span></div><div className="dr-stat"><b>{d.distance} km</b><span>Distance</span></div></div>
    </div>
    <div className="vd-period" style={{marginTop:0}}>{[["today","Aujourd'hui"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>

    {/* Pending request */}
    {pending&&<><div className="sec" style={{marginTop:10}}><h3>🆕 Nouvelle demande</h3></div>
    <div className="dr-request">
      <div className="dr-req-head"><h4>Livraison <span className="dr-new">NOUVEAU</span></h4><div className="dr-req-fee">{fmt(pending.fee+pending.tip)}</div></div>
      <div className="dr-req-route">
        <div className="dr-req-point"><div className="drp-icon drp-pickup">📍</div><div style={{flex:1}}><div style={{fontWeight:600}}>{pending.pickup}</div><div style={{fontSize:11,color:"#908C82"}}>{pending.vendor.name}</div></div></div>
        <div className="dr-req-line"/>
        <div className="dr-req-point"><div className="drp-icon drp-drop">🏠</div><div style={{flex:1}}><div style={{fontWeight:600}}>{pending.client.addr.split(",")[0]}</div><div style={{fontSize:11,color:"#908C82"}}>{pending.client.name}</div></div></div>
      </div>
      <div className="dr-req-meta"><span>📏 {pending.distance}</span><span>⏱️ ~{pending.eta}</span><span>📦 {pending.items.length} article{pending.items.length>1?"s":""}</span><span>💰 {fmt(pending.total)}</span></div>
      <div className="dr-req-actions"><button className="dr-decline" onClick={()=>setDismissed(true)}>Refuser</button><button className="dr-accept" onClick={()=>go("drDelivery",{...pending,status:"pickup"})}>✅ Accepter</button></div>
    </div></>}

    {/* Active delivery */}
    {active&&<><div className="sec" style={{marginTop:6}}><h3>📦 En cours</h3></div>
    <div className="dr-active" onClick={()=>go("drDelivery",active)}>
      <div className="dr-active-head"><h4>{active.ref}</h4><div className="dr-st">En livraison</div></div>
      <div style={{fontSize:13,color:"#5E5B53",marginBottom:8}}>{active.vendor.name} → {active.client.name}</div>
      <div className="dr-step-bar">
        <div className="dr-step-dot done">✓</div><div className="dr-step-line done"/>
        <div className="dr-step-dot done">✓</div><div className="dr-step-line done"/>
        <div className="dr-step-dot cur">3</div><div className="dr-step-line"/>
        <div className="dr-step-dot">4</div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#908C82"}}><span>Accepté</span><span>Récupéré</span><span style={{color:"#6366F1",fontWeight:600}}>En route</span><span>Livré</span></div>
    </div></>}

    {/* Quick stats */}
    <div className="sec" style={{marginTop:6}}><h3>Dernières livraisons</h3><span onClick={()=>go("drHistory")}>Voir tout</span></div>
    <div style={{padding:"0 20px 100px"}}>{D_HISTORY.slice(0,3).map(h=><div key={h.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #F5F4F1"}}>
      <div style={{width:36,height:36,borderRadius:10,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✅</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{h.vendor} → {h.client}</div><div style={{fontSize:11,color:"#908C82"}}>{h.date} · {h.duration} · {h.distance}</div></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:"#10B981"}}>+{fmt(h.fee+h.tip)}</div><div style={{fontSize:11,color:"#F59E0B"}}>{"★".repeat(h.rating)}</div></div>
    </div>)}</div>
  </div>);
}

/* D2 ── ACTIVE DELIVERY (multi-step) ── */

export default DrDashboardScr;
