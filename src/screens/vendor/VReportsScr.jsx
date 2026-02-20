import { useState } from "react";

function VReportsScr({onBack}){
  const [month,setMonth]=useState("Février");
  const [exported,setExported]=useState({});
  const monthData={
    "Janvier":{brut:"1 820 000",comm:"72 800",net:"1 747 200",orders:41,avg:"44 390"},
    "Février":{brut:"2 150 000",comm:"86 000",net:"2 064 000",orders:52,avg:"41 346"},
    "Mars":{brut:"890 000",comm:"35 600",net:"854 400",orders:22,avg:"40 454"},
  };
  const d=monthData[month];
  const reports=[
    {id:"sales",icon:"📊",title:"Rapport des ventes",desc:"Détail des ventes par article et période",format:"PDF / Excel"},
    {id:"tax",icon:"💰",title:"Rapport fiscal",desc:"Revenus, commissions, TVA mensuelle",format:"PDF"},
    {id:"stock",icon:"📦",title:"Rapport de stock",desc:"Inventaire, mouvements, alertes",format:"Excel"},
    {id:"invoice",icon:"🧾",title:"Factures Lamuka",desc:"Commissions et frais de plateforme",format:"PDF"},
    {id:"perf",icon:"📈",title:"Performance boutique",desc:"Taux de conversion, visites, panier moyen",format:"PDF"},
  ];
  const doExport=(id)=>{setExported(e=>({...e,[id]:"loading"}));setTimeout(()=>setExported(e=>({...e,[id]:"done"})),1500);setTimeout(()=>setExported(e=>{const n={...e};delete n[id];return n}),4000)};
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Rapports & Exports</h2><div style={{width:38}}/></div>
    <div className="vd-period">{["Janvier","Février","Mars"].map(m=><button key={m} className={month===m?"on":""} onClick={()=>setMonth(m)}>{m}</button>)}</div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>📋 Résumé {month}</div>
      {[["Revenus bruts",d.brut+" FCFA"],["Commissions (4%)",d.comm+" FCFA"],["Revenus nets",d.net+" FCFA"],["Nombre de commandes",d.orders],["Panier moyen",d.avg+" FCFA"]].map(([l,v],i)=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<4?"1px solid #F5F4F1":"none",fontSize:13,...(i===2?{fontWeight:700,color:"#10B981"}:{})}}><span style={{color:i===2?"#10B981":"#908C82"}}>{l}</span><b>{v}</b></div>)}
    </div>
    {reports.map(r=><div key={r.id} className="rpt-card">
      <div className="rpt-icon">{r.icon}</div>
      <div className="rpt-info"><h4>{r.title}</h4><p>{r.desc} · {r.format}</p></div>
      {exported[r.id]==="loading"?<button className="rpt-dl" style={{background:"#F5F4F1",color:"#908C82",minWidth:80}}>⏳ Export...</button>
      :exported[r.id]==="done"?<button className="rpt-dl" style={{background:"rgba(16,185,129,0.1)",color:"#10B981",borderColor:"rgba(16,185,129,0.2)",minWidth:80}}>✅ Prêt</button>
      :<button className="rpt-dl" onClick={()=>doExport(r.id)}>Exporter</button>}
    </div>)}
  </div>);
}

/* V16 ── VENDOR SUPPORT ── */

export default VReportsScr;
