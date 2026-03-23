import { useState } from "react";
import { fmt } from "../../utils/helpers";

function VShopsScr({go,onBack}){
  const [shops,setShops]=useState([
    {id:"s1",name:"Ma Boutique Congo",type:"boutique",typeIcon:"🏪",location:"Brazzaville, Bacongo",logo:"👔",status:"active",revenue:457800,orders:48,products:32,rating:4.6,views:1240,clients:186,returns:2,created:"Jan 2026"},
    {id:"s2",name:"Chez Mama Ngudi",type:"restaurant",typeIcon:"🍽️",location:"Pointe-Noire, Centre",logo:"🍽️",status:"active",revenue:285000,orders:31,products:18,rating:4.4,views:890,clients:124,returns:1,created:"Fév 2026"},
    {id:"s3",name:"Congo Tech Store",type:"boutique",typeIcon:"🏪",location:"Brazzaville, Centre",logo:"💻",status:"pending",revenue:0,orders:0,products:5,rating:0,views:0,clients:0,returns:0,created:"Fév 2026"},
  ]);
  const active=shops.filter(s=>s.status==="active");
  const totalRev=active.reduce((s,sh)=>s+sh.revenue,0);
  const totalOrders=active.reduce((s,sh)=>s+sh.orders,0);
  const totalProducts=active.reduce((s,sh)=>s+sh.products,0);
  const totalViews=active.reduce((s,sh)=>s+sh.views,0);
  const totalClients=active.reduce((s,sh)=>s+sh.clients,0);
  const avgRating=active.length?(active.reduce((s,sh)=>s+sh.rating,0)/active.length).toFixed(1):0;
  const totalReturns=active.reduce((s,sh)=>s+sh.returns,0);
  const commission=Math.round(totalRev*0.02);
  const [showStats,setShowStats]=useState(false);

  return(<div className="scr">
    <div className="appbar"><button onClick={onBack}>←</button><h2>Mes établissements</h2><button style={{width:38,height:38,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("vAddShop")}>+</button></div>

    {/* Enterprise overall banner */}
    <div style={{margin:"0 20px 14px",padding:16,background:"rgba(249,115,22,0.06)",borderRadius:16,color:"var(--text)",border:"1px solid rgba(249,115,22,0.2)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div><div style={{fontSize:11,color:"var(--muted)"}}>Plan Enterprise · Vue globale</div><div style={{fontSize:22,fontWeight:700,marginTop:2}}>{fmt(totalRev)}</div><div style={{fontSize:11,color:"var(--muted)"}}>Chiffre d'affaires total</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:700}}>{shops.length}</div><div style={{fontSize:11,color:"var(--muted)"}}>boutiques</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
        {[["📦",totalOrders,"Cmd"],["🛍️",totalProducts,"Prod."],["👁️",totalViews,"Vues"],["⭐",avgRating,"Note"]].map(([i,v,l])=><div key={l} style={{padding:8,background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,textAlign:"center"}}>
          <div style={{fontSize:14,fontWeight:700}}>{v}</div>
          <div style={{fontSize:9,color:"var(--muted)"}}>{l}</div>
        </div>)}
      </div>
      <button style={{width:"100%",marginTop:10,padding:8,borderRadius:8,border:"none",background:"var(--card)",border:"1px solid var(--border)",color:"#F97316",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowStats(!showStats)}>{showStats?"▲ Masquer les détails":"▼ Voir les statistiques détaillées"}</button>
    </div>

    {/* Expanded stats */}
    {showStats&&<div style={{margin:"0 20px 14px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        {[["💰","CA net (après commission)",fmt(totalRev-commission),"↑ 18% vs mois dernier","#10B981"],
          ["💳","Commission Lamuka (2%)",fmt(commission),"Déduite automatiquement","#F59E0B"],
          ["👥","Clients uniques",totalClients,"↑ 24%","#F97316"],
          ["🔄","Retours",totalReturns,totalReturns<5?"Excellent":"À surveiller",totalReturns<5?"#10B981":"#EF4444"],
        ].map(([i,l,v,t,c])=><div key={l} style={{padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14}}>
          <div style={{fontSize:16,marginBottom:4}}>{i}</div>
          <div style={{fontSize:16,fontWeight:700}}>{v}</div>
          <div style={{fontSize:10,color:"var(--muted)"}}>{l}</div>
          <div style={{fontSize:10,color:c,fontWeight:600,marginTop:4}}>{t}</div>
        </div>)}
      </div>

      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:10}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Performance par boutique</div>
        {active.map(sh=><div key={sh.id} style={{display:"flex",alignItems:"center",gap:10,padding:8,borderBottom:"1px solid var(--border)"}}>
          <span style={{fontSize:16}}>{sh.typeIcon}</span>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{sh.name}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700,color:"#F97316"}}>{fmt(sh.revenue)}</div><div style={{fontSize:9,color:"var(--muted)"}}>{sh.orders} cmd · ⭐ {sh.rating}</div></div>
        </div>)}
      </div>

      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Répartition du CA</div>
        {active.map(sh=>{const pct=totalRev>0?Math.round(sh.revenue/totalRev*100):0;return(
          <div key={sh.id} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}><span style={{fontWeight:600}}>{sh.typeIcon} {sh.name}</span><span style={{color:"var(--muted)"}}>{pct}%</span></div>
            <div style={{height:8,background:"var(--light)",borderRadius:4,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#F97316,#FB923C)",borderRadius:4}}/></div>
          </div>
        )})}
      </div>
    </div>}

    {/* Shop list */}
    <div style={{padding:"0 16px"}}>
      {shops.map(sh=><div key={sh.id} style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:12,cursor:"pointer"}} onClick={()=>go("vShopDetail",sh)}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:48,height:48,borderRadius:14,background:sh.status==="active"?"linear-gradient(135deg,#F97316,#FB923C)":"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{sh.logo}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><h4 style={{fontSize:15,fontWeight:700}}>{sh.name}</h4>
              <span style={{padding:"2px 8px",borderRadius:6,background:sh.status==="active"?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.1)",color:sh.status==="active"?"#10B981":"#F59E0B",fontSize:10,fontWeight:700}}>{sh.status==="active"?"Active":"En attente"}</span>
            </div>
            <p style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{sh.typeIcon} {sh.type==="restaurant"?"Restaurant":"Boutique"} · 📍 {sh.location}</p>
          </div>
          <span style={{fontSize:16,color:"var(--muted)"}}>›</span>
        </div>
        {sh.status==="active"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
          {[["💰",fmt(sh.revenue),"CA"],["📦",sh.orders,"Cmd"],["🛍️",sh.products,"Prod."],["⭐",sh.rating||"—","Note"]].map(([i,v,l])=><div key={l} style={{textAlign:"center",padding:8,background:"var(--light)",borderRadius:10}}>
            <div style={{fontSize:12,fontWeight:700}}>{v}</div>
            <div style={{fontSize:9,color:"var(--muted)"}}>{l}</div>
          </div>)}
        </div>}
        {sh.status==="pending"&&<div className="info-box yellow" style={{margin:0,padding:"8px 12px"}}><span>⏳</span><span style={{fontSize:11}}>En cours de vérification · Documents soumis le {sh.created}</span></div>}
      </div>)}
    </div>

    <div style={{padding:"0 16px 20px"}}><button className="btn-primary" onClick={()=>go("vAddShop")}>+ Créer un nouvel établissement</button></div>
  </div>);
}

/* V18b ── SHOP TEAM TAB (sub-component) ── */

export default VShopsScr;
