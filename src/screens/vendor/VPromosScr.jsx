import { V_PROMOS } from "../../data/vendorData";

function VPromosScr({go,onBack}){
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Promotions</h2><button style={{width:38,height:38,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("vCreatePromo")}>+</button></div>
    {V_PROMOS.map(p=><div key={p.id} className="promo-card">
      <div className="promo-head"><h4><span className="active-dot"/> {p.name}</h4><span style={{fontSize:20,fontWeight:700,color:"#6366F1"}}>{p.discount}%</span></div>
      <div className="promo-meta"><span>📅 {p.start} → {p.end}</span><span>🛍️ {p.products}</span>{p.code&&<span>🏷️ {p.code}</span>}</div>
      <div className="promo-bar"><div className="pbar-fill" style={{width:`${Math.min(p.used/50*100,100)}%`}}/></div>
      <div className="promo-usage"><span>{p.used} utilisations</span><span>Objectif: 50</span></div>
    </div>)}
    <button className="btn-primary" style={{marginTop:10}} onClick={()=>go("vCreatePromo")}>+ Créer une promotion</button>
  </div>);
}

/* ── CREATE PROMO ── */

export default VPromosScr;
