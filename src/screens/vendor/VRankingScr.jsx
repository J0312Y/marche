import { useState } from "react";

const RANKINGS=[
  {rank:1,name:"Tech Congo",avatar:"🏪",score:9850,orders:342,rating:4.9,badge:"🥇"},
  {rank:2,name:"Mode Afrique",avatar:"👔",score:8720,orders:289,rating:4.8,badge:"🥈"},
  {rank:3,name:"Chez Mama Ngudi",avatar:"🍽️",score:8100,orders:456,rating:4.9,badge:"🥉"},
  {rank:4,name:"Pâtisserie La Congolaise",avatar:"🧁",score:7200,orders:198,rating:4.7,badge:""},
  {rank:5,name:"Super U Bacongo",avatar:"🛒",score:6800,orders:523,rating:4.5,badge:""},
  {rank:6,name:"Ma Boutique",avatar:"🏬",score:5400,orders:128,rating:4.6,badge:"⭐",isMe:true},
];

function VRankingScr({onBack}){
  const [period,setPeriod]=useState("month");
  const me=RANKINGS.find(r=>r.isMe);
  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>🏆 Classement</h2><div style={{width:38}}/></div>

    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {[["week","Semaine"],["month","Mois"],["year","Année"]].map(([k,l])=><button key={k} onClick={()=>setPeriod(k)} style={{flex:1,padding:8,borderRadius:10,border:period===k?"2px solid #F97316":"1px solid var(--border)",background:period===k?"rgba(249,115,22,0.06)":"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:period===k?"#F97316":"var(--text)"}}>{l}</button>)}
    </div>

    {/* My position */}
    {me&&<div style={{padding:14,background:"rgba(249,115,22,0.04)",border:"2px solid #F97316",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:12,color:"var(--muted)",marginBottom:4}}>Votre position</div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{fontSize:24,fontWeight:800,color:"#F97316"}}>#{me.rank}</div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{me.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{me.score} pts · {me.orders} ventes · ⭐ {me.rating}</div></div>
      </div>
    </div>}

    {/* Top 3 podium */}
    <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:8,marginBottom:18,height:120}}>
      {[RANKINGS[1],RANKINGS[0],RANKINGS[2]].map((r,i)=>{const heights=[80,110,65];return(
        <div key={r.rank} style={{textAlign:"center",width:80}}>
          <div style={{fontSize:24,marginBottom:4}}>{r.avatar}</div>
          <div style={{fontSize:10,fontWeight:700,marginBottom:4}}>{r.name.split(" ")[0]}</div>
          <div style={{height:heights[i],background:i===1?"linear-gradient(180deg,#F59E0B,rgba(245,158,11,0.3))":i===0?"linear-gradient(180deg,#C0C0C0,rgba(192,192,192,0.3))":"linear-gradient(180deg,#CD7F32,rgba(205,127,50,0.3))",borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:20}}>{r.badge}</span>
          </div>
        </div>
      )})}
    </div>

    {/* Full list */}
    {RANKINGS.map(r=>(
      <div key={r.rank} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:r.isMe?"rgba(249,115,22,0.04)":"var(--card)",border:r.isMe?"1px solid #F97316":"1px solid var(--border)",borderRadius:12,marginBottom:6}}>
        <div style={{width:28,fontSize:14,fontWeight:800,color:r.rank<=3?["","#F59E0B","#C0C0C0","#CD7F32"][r.rank]:"var(--muted)",textAlign:"center"}}>{r.badge||r.rank}</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{r.name}{r.isMe&&<span style={{fontSize:10,color:"#F97316",marginLeft:4}}>← Vous</span>}</div><div style={{fontSize:10,color:"var(--muted)"}}>{r.score} pts · {r.orders} ventes · ⭐ {r.rating}</div></div>
      </div>
    ))}
  </div>);
}
export default VRankingScr;
