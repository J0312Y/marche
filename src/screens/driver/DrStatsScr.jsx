import { useState } from "react";
import { D_STATS } from "../../data/driverData";
import { fmt } from "../../utils/helpers";

function DrStatsScr({onBack}){
  const [period,setPeriod]=useState("week");
  const d=D_STATS[period];
  const chartData=[85,120,95,160,140,110,180];
  const maxBar=Math.max(...chartData);
  return(<div className="scr" style={{paddingBottom:80}}><div className="appbar"><button onClick={onBack}>←</button><h2>Statistiques</h2><div style={{width:38}}/></div>
    <div className="vd-period">{[["today","Jour"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>
    <div className="vd-stats">
      <div className="vd-stat"><div className="vs-icon">📦</div><div className="vs-val">{d.deliveries}</div><div className="vs-lbl">Livraisons</div><div className="vs-trend up">↑ 15%</div></div>
      <div className="vd-stat"><div className="vs-icon">💰</div><div className="vs-val">{fmt(d.earned)}</div><div className="vs-lbl">Gagné</div><div className="vs-trend up">↑ 23%</div></div>
      <div className="vd-stat"><div className="vs-icon">📏</div><div className="vs-val">{d.distance} km</div><div className="vs-lbl">Distance</div></div>
      <div className="vd-stat"><div className="vs-icon">⏱️</div><div className="vs-val">{d.hours}h</div><div className="vs-lbl">En ligne</div></div>
    </div>
    <div className="vd-chart"><h4>Livraisons par jour</h4><div className="chart-bars">{chartData.map((v,i)=><div key={i} className="chart-bar" style={{height:`${(v/maxBar)*100}%`,background:"linear-gradient(180deg,#10B981,#059669)"}}><div className="cb-tip">{v} FCFA</div></div>)}</div><div className="chart-labels">{["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map(d=><span key={d}>{d}</span>)}</div></div>
    <div style={{padding:"0 20px"}}><div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Performance</div>
      {[{label:"Taux d'acceptation",val:"92%",pct:92,color:"#10B981"},{label:"Livraisons à temps",val:"88%",pct:88,color:"#6366F1"},{label:"Satisfaction client",val:"4.8/5",pct:96,color:"#F59E0B"}].map(s=><div key={s.label} style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{fontWeight:600}}>{s.label}</span><span style={{color:"#908C82"}}>{s.val}</span></div>
        <div style={{height:6,background:"#E8E6E1",borderRadius:3,overflow:"hidden"}}><div style={{width:`${s.pct}%`,height:"100%",background:s.color,borderRadius:3}}/></div>
      </div>)}
    </div></div>
  </div>);
}

/* D14 ── DRIVER SETTINGS ── */

export default DrStatsScr;
