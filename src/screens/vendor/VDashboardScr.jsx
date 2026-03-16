import { useState } from "react";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonDashboard } from "../../components/Loading";
import PullToRefresh from "../../components/PullToRefresh";
import { fmt } from "../../utils/helpers";

const CHART_LABELS={
  today:["8h","9h","10h","11h","12h","14h","16h"],
  week:["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],
  month:["Sem 1","Sem 2","Sem 3","Sem 4"],
};

function VDashboardScr({go}){
  const [period,setPeriod]=useState("week");
  const { data, loading, reload } = useLoad(() => vendor.getDashboard(period), [period]);
  if(loading||!data) return <div className="scr" style={{padding:16}}><h2 style={{marginBottom:12}}>📊 Tableau de bord</h2><SkeletonDashboard/></div>;
  const { stats:s, new_orders:newOrders, chart=[], top_products:topProducts=[] } = data;
  const maxBar=Math.max(...chart,1);
  const labels=CHART_LABELS[period]||CHART_LABELS.week;
  const lowStock={name:"Sac à Main Cuir",stock:3};

  const fmtChart=(v)=>{
    if(v>=1000000) return (v/1000000).toFixed(1)+"M";
    if(v>=1000) return Math.round(v/1000)+"k";
    return String(v);
  };

  return(<PullToRefresh onRefresh={reload}><div className="scr" style={{padding:16,paddingBottom:100}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><h2>📊 Tableau de bord</h2><button onClick={()=>go("vNotif")}>🔔</button></div>
    <div className="vo-filter" style={{padding:0,marginBottom:14}}>{[["today","Aujourd'hui"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>

    {newOrders>0&&<div className="vd-alert" style={{margin:"0 0 14px"}} onClick={()=>go("vOrdersList")}><span>🆕</span> {newOrders} nouvelle{newOrders>1?"s":""} commande{newOrders>1?"s":""} !</div>}

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

    {/* Chart with real amounts */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:18,marginBottom:14}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        {period==="today"?"Ventes aujourd'hui":period==="week"?"Ventes de la semaine":"Ventes du mois"}
        <span style={{fontSize:12,color:"#6366F1",fontWeight:600,cursor:"pointer"}} onClick={()=>go("vStats")}>Voir tout →</span>
      </h4>
      <div style={{fontSize:11,color:"var(--muted)",marginBottom:12}}>
        Total: {fmt(chart.reduce((a,b)=>a+b,0))}
      </div>
      <div className="chart-bars">
        {chart.map((v,i)=><div key={i} className="chart-bar" style={{height:`${(v/maxBar)*100}%`}}>
          <div className="cb-tip">{fmtChart(v)} FCFA</div>
        </div>)}
      </div>
      <div className="chart-labels">{labels.slice(0,chart.length).map(d=><span key={d}>{d}</span>)}</div>
    </div>

    {/* Top Products */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:18,marginBottom:14}}>
      <h4 style={{fontSize:15,fontWeight:700,marginBottom:14}}>Top Produits</h4>
      {topProducts.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderTop:i?"1px solid #F5F4F1":"none"}}>
        <div style={{width:28,height:28,borderRadius:8,background:i===0?"linear-gradient(135deg,#F59E0B,#D97706)":i===1?"linear-gradient(135deg,#94A3B8,#64748B)":"linear-gradient(135deg,#D97706,#B45309)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:800,flexShrink:0}}>{i+1}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600}}>{p.name}</div>
          <div style={{fontSize:12,color:"var(--muted)"}}>{p.sold} vendus</div>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:"#6366F1"}}>{fmt(p.revenue)}</div>
      </div>)}
    </div>

    {/* Quick Actions */}
    <div className="vd-quick" style={{padding:0,margin:"0 0 14px"}}>{[["vProducts","📦","Articles"],["vOrdersList","📋","Commandes"],["vReviews","⭐","Avis"],["vStats","📈","Stats"],["vWallet","💰","Wallet"],["vPromos","🏷️","Promos"]].map(([k,i,l])=><div key={k} className="vdq" onClick={()=>go(k)}><span>{i}</span><div>{l}</div></div>)}</div>

    {lowStock&&<div style={{padding:16,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)",borderRadius:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>go("vProducts")}>
      <span style={{fontSize:24}}>⚠️</span>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:600}}>{lowStock.name} — Stock faible ({lowStock.stock} restants).</div>
        <div style={{fontSize:12,color:"#F59E0B",fontWeight:600,marginTop:2}}>Réapprovisionner →</div>
      </div>
    </div>}
  </div></PullToRefresh>);
}

export default VDashboardScr;