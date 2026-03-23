import { useState } from "react";

function VAnalyticsScr({onBack}){
  const [period,setPeriod]=useState("week");
  const data={
    week:{views:1245,orders:28,conversion:"2.2%",avgBasket:"18 500 F",revenue:"518 000 F",returning:"34%"},
    month:{views:4820,orders:112,conversion:"2.3%",avgBasket:"19 200 F",revenue:"2 150 000 F",returning:"41%"},
  };
  const d=data[period];

  const topProducts=[
    {name:"Galaxy A54",views:342,orders:12,revenue:"2 220 000 F"},
    {name:"Robe Wax",views:289,orders:18,revenue:"450 000 F"},
    {name:"Poulet DG",views:456,orders:45,revenue:"247 500 F"},
    {name:"Écouteurs Pro",views:198,orders:8,revenue:"280 000 F"},
  ];
  const sources=[{name:"Recherche",pct:42},{name:"Accueil",pct:28},{name:"Partage",pct:18},{name:"QR Code",pct:12}];
  const srcColors=["#F97316","#3B82F6","#10B981","#F59E0B"];

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>📊 Analytics</h2><div style={{width:38}}/></div>

    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {[["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} onClick={()=>setPeriod(k)} style={{flex:1,padding:8,borderRadius:10,border:period===k?"2px solid #F97316":"1px solid var(--border)",background:period===k?"rgba(249,115,22,0.06)":"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",color:period===k?"#F97316":"var(--text)",fontFamily:"inherit"}}>{l}</button>)}
    </div>

    {/* KPIs */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:14}}>
      {[["👁️",d.views,"Vues"],["🛍️",d.orders,"Commandes"],["📈",d.conversion,"Conversion"],["🧺",d.avgBasket,"Panier moy."],["💰",d.revenue,"Revenus"],["🔄",d.returning,"Clients fidèles"]].map(([ic,v,l])=>
        <div key={l} style={{padding:"10px 8px",textAlign:"center",background:"var(--card)",border:"1px solid var(--border)",borderRadius:12}}>
          <div style={{fontSize:12}}>{ic}</div><div style={{fontSize:13,fontWeight:700,marginTop:2}}>{v}</div><div style={{fontSize:9,color:"var(--muted)"}}>{l}</div>
        </div>)}
    </div>

    {/* Top products */}
    <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>🏆 Produits les + performants</div>
      {topProducts.map((p,i)=>(
        <div key={p.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:i?"1px solid var(--border)":"none"}}>
          <div><div style={{fontSize:13,fontWeight:600}}>{i+1}. {p.name}</div><div style={{fontSize:10,color:"var(--muted)"}}>{p.views} vues · {p.orders} ventes</div></div>
          <span style={{fontSize:12,fontWeight:700,color:"#F97316"}}>{p.revenue}</span>
        </div>
      ))}
    </div>

    {/* Traffic sources */}
    <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>📍 Sources de trafic</div>
      {sources.map((s,i)=>(
        <div key={s.name} style={{marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
            <span style={{fontWeight:500}}>{s.name}</span><span style={{color:"var(--muted)"}}>{s.pct}%</span>
          </div>
          <div style={{height:5,borderRadius:3,background:"var(--light)"}}>
            <div style={{width:`${s.pct}%`,height:"100%",borderRadius:3,background:srcColors[i]}}/>
          </div>
        </div>
      ))}
    </div>
  </div>);
}
export default VAnalyticsScr;
