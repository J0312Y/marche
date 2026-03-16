import { useState } from "react";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonStats } from "../../components/Loading";
import { fmt } from "../../utils/helpers";

const CHART_LABELS={
  today:["8h","9h","10h","11h","12h","14h","16h"],
  week:["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],
  month:["Sem 1","Sem 2","Sem 3","Sem 4"],
};

const fmtChart=(v)=>{
  if(v>=1000000) return (v/1000000).toFixed(1)+"M";
  if(v>=1000) return Math.round(v/1000)+"k";
  return String(v);
};

function VStatsScr({onBack}){
  const [period,setPeriod]=useState("week");
  const { data: V_STATS, loading } = useLoad(() => vendor.getReports(period), [period]);
  if(loading||!V_STATS) return <div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Statistiques</h2><div style={{width:38}}/></div><SkeletonStats/></div>;

  const s=V_STATS[period]||V_STATS.week||V_STATS;
  const chart=period==="month"?(V_STATS.chartMonth||V_STATS.chartWeek||[]):(V_STATS.chartWeek||[]);
  const maxBar=Math.max(...chart,1);
  const labels=CHART_LABELS[period]||CHART_LABELS.week;
  const tp=V_STATS.topProducts||[];
  const chartTotal=chart.reduce((a,b)=>a+b,0);

  return(<div className="scr" style={{padding:16,paddingBottom:80}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>📈 Statistiques</h2><div style={{width:38}}/></div>

    <div className="vo-filter" style={{padding:0,marginBottom:14}}>{[["today","Aujourd'hui"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>

    {/* Stats 2x2 */}
    <div className="vd-stats" style={{padding:0}}>
      <div className="vd-stat">
        <div className="vs-icon">💰</div>
        <div className="vs-val">{fmt(s?.revenue||0)}</div>
        <div className="vs-lbl">Revenus</div>
        <div className="vs-trend up">↑ 23%</div>
      </div>
      <div className="vd-stat">
        <div className="vs-icon">📦</div>
        <div className="vs-val">{s?.orders||0}</div>
        <div className="vs-lbl">Commandes</div>
        <div className="vs-trend up">↑ 18%</div>
      </div>
      <div className="vd-stat">
        <div className="vs-icon">👁️</div>
        <div className="vs-val">{s?.visitors||0}</div>
        <div className="vs-lbl">Visiteurs</div>
        <div className="vs-trend up">↑ 12%</div>
      </div>
      <div className="vd-stat">
        <div className="vs-icon">⭐</div>
        <div className="vs-val">4.6</div>
        <div className="vs-lbl">Note moyenne</div>
        <div className="vs-trend up">↑ 0.2</div>
      </div>
    </div>

    {/* Chart */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:18,marginBottom:14}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:4}}>
        {period==="today"?"Ventes par heure":period==="week"?"Ventes par jour":"Ventes par semaine"}
      </h4>
      <div style={{fontSize:11,color:"var(--muted)",marginBottom:12}}>
        Total période: {fmt(chartTotal)} · Moy: {fmt(Math.round(chartTotal/Math.max(chart.length,1)))}
      </div>
      <div className="chart-bars">
        {chart.map((v,i)=><div key={i} className="chart-bar" style={{height:`${(v/maxBar)*100}%`}}>
          <div className="cb-tip">{fmtChart(v)} FCFA</div>
        </div>)}
      </div>
      <div className="chart-labels">{labels.slice(0,chart.length).map(d=><span key={d}>{d}</span>)}</div>
    </div>

    {/* Performance */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:18,marginBottom:14}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:14}}>📊 Performance</h4>
      {[
        {label:"Taux de conversion",val:"3.2%",pct:32,color:"#6366F1"},
        {label:"Panier moyen",val:fmt(Math.round((s?.revenue||0)/Math.max(s?.orders||1,1))),pct:65,color:"#10B981"},
        {label:"Satisfaction client",val:"4.6/5",pct:92,color:"#F59E0B"},
        {label:"Taux de retour",val:"2.1%",pct:21,color:"#EF4444"},
      ].map(m=><div key={m.label} style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
          <span style={{fontWeight:600}}>{m.label}</span>
          <span style={{color:"var(--muted)"}}>{m.val}</span>
        </div>
        <div style={{height:6,background:"var(--border)",borderRadius:3,overflow:"hidden"}}>
          <div style={{width:`${m.pct}%`,height:"100%",background:m.color,borderRadius:3,transition:"width .5s ease"}}/>
        </div>
      </div>)}
    </div>

    {/* Top Products */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:18,marginBottom:14}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:14}}>🏆 Top Produits</h4>
      {tp.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderTop:i?"1px solid #F5F4F1":"none"}}>
        <div style={{width:28,height:28,borderRadius:8,background:i===0?"linear-gradient(135deg,#F59E0B,#D97706)":i===1?"linear-gradient(135deg,#94A3B8,#64748B)":"linear-gradient(135deg,#D97706,#B45309)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:800,flexShrink:0}}>{i+1}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600}}>{p.name}</div>
          <div style={{fontSize:12,color:"var(--muted)"}}>{p.sold} vendus</div>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:"#6366F1"}}>{fmt(p.revenue)}</div>
      </div>)}
    </div>

    {/* Revenue breakdown */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:18}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:14}}>💰 Résumé financier</h4>
      {[
        ["Revenus bruts",fmt(s?.revenue||0),"#191815"],
        ["Commission Lamuka (4%)","-"+fmt(Math.round((s?.revenue||0)*0.04)),"#EF4444"],
        ["Frais de livraison","Inclus","#908C82"],
        ["Revenus nets",fmt(Math.round((s?.revenue||0)*0.96)),"#10B981"],
      ].map(([l,v,c],i)=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:i?"1px solid #F5F4F1":"none",fontSize:13,...(i===3?{fontWeight:700}:{})}}>
        <span style={{color:i===3?c:"#5E5B53"}}>{l}</span>
        <b style={{color:c}}>{v}</b>
      </div>)}
    </div>
  </div>);
}

export default VStatsScr;
