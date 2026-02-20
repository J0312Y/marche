import { useState } from "react";
import { V_STATS } from "../../data/vendorData";
import { fmt } from "../../utils/helpers";

function VStatsScr({onBack}){
  const [period,setPeriod]=useState("week");
  const maxBar=Math.max(...V_STATS.chartWeek);
  const days=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  return(<div className="scr" style={{paddingBottom:80}}><div className="appbar"><button onClick={onBack}>←</button><h2>Statistiques</h2><div style={{width:38}}/></div>
    <div className="vd-period">{[["today","Jour"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>
    <div className="vd-stats">
      <div className="vd-stat"><div className="vs-icon">💰</div><div className="vs-val">{fmt(V_STATS[period].revenue)}</div><div className="vs-lbl">Revenus</div><div className="vs-trend up">↑ 23%</div></div>
      <div className="vd-stat"><div className="vs-icon">📦</div><div className="vs-val">{V_STATS[period].orders}</div><div className="vs-lbl">Commandes</div><div className="vs-trend up">↑ 8%</div></div>
      <div className="vd-stat"><div className="vs-icon">👁️</div><div className="vs-val">{V_STATS[period].visitors}</div><div className="vs-lbl">Visiteurs</div><div className="vs-trend up">↑ 12%</div></div>
      <div className="vd-stat"><div className="vs-icon">📈</div><div className="vs-val">3.2%</div><div className="vs-lbl">Taux conversion</div><div className="vs-trend down">↓ 0.4%</div></div>
    </div>
    <div className="vd-chart"><h4>Ventes par jour</h4><div className="chart-bars">{V_STATS.chartWeek.map((v,i)=><div key={i} className="chart-bar" style={{height:`${(v/maxBar)*100}%`}}><div className="cb-tip">{fmt(v*1000)}</div></div>)}</div><div className="chart-labels">{days.map(d=><span key={d}>{d}</span>)}</div></div>
    <div style={{padding:"0 20px"}}><div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Revenus par catégorie</div>
      {[{cat:"Mode",pct:65,color:"#6366F1"},{cat:"Beauté",pct:20,color:"#A855F7"},{cat:"Accessoires",pct:15,color:"#F59E0B"}].map(c=><div key={c.cat} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{fontWeight:600}}>{c.cat}</span><span style={{color:"#908C82"}}>{c.pct}%</span></div><div style={{height:6,background:"#E8E6E1",borderRadius:3,overflow:"hidden"}}><div style={{width:`${c.pct}%`,height:"100%",background:c.color,borderRadius:3}}/></div></div>)}
    </div></div>
    <div className="vd-top" style={{margin:"16px 20px"}}><h4>Top Produits</h4>{V_STATS.topProducts.map((p,i)=><div key={i} className="vd-top-item"><div className={`rank ${i===0?"g":""}`}>{i+1}</div><div className="ti-info"><h5>{p.name}</h5><p>{p.sold} vendus</p></div><div className="ti-rev">{fmt(p.revenue)}</div></div>)}</div>
  </div>);
}

/* V8 ── VENDOR MESSAGES ── */

export default VStatsScr;
