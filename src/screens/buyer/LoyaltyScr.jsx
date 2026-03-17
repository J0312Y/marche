import { fmt } from "../../utils/helpers";
function LoyaltyScr({onBack}){
  const points=3450;const level=points>=5000?"Gold":points>=2000?"Silver":"Bronze";
  const nextLevel=points>=5000?null:points>=2000?5000:2000;
  const pct=nextLevel?Math.round((points/(nextLevel))*100):100;
  const history=[{label:"Commande #LMK-0214",pts:"+185",date:"14 Fév"},{label:"Avis publié",pts:"+50",date:"12 Fév"},{label:"Coupon utilisé",pts:"-500",date:"10 Fév"},{label:"Commande #LMK-0210",pts:"+42",date:"10 Fév"},{label:"Bonus parrainage",pts:"+200",date:"8 Fév"},{label:"Commande #LMK-0205",pts:"+18",date:"5 Fév"}];
  const rewards=[[500,"Livraison gratuite"],[1000,"500 FCFA de réduction"],[2000,"Badge Silver 🥈"],[3000,"1 500 FCFA de réduction"],[5000,"Badge Gold 🥇 + livraison gratuite x5"]];
  return(<div className="scr" style={{padding:16,paddingBottom:80}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>Fidélité</h2><div style={{width:38}}/></div>
    <div style={{padding:20,background:"linear-gradient(135deg,#F59E0B,#D97706)",borderRadius:20,color:"#fff",textAlign:"center",marginBottom:14}}>
      <div style={{fontSize:14,opacity:.8}}>Vos points</div>
      <div style={{fontSize:36,fontWeight:800}}>{points.toLocaleString()}</div>
      <div style={{fontSize:13,fontWeight:600}}>Niveau {level} {level==="Gold"?"🥇":level==="Silver"?"🥈":"🥉"}</div>
      {nextLevel&&<div style={{marginTop:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,opacity:.7,marginBottom:4}}><span>{points}</span><span>{nextLevel.toLocaleString()} pts</span></div><div style={{height:6,background:"rgba(255,255,255,.2)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:"#fff",borderRadius:3}}/></div></div>}
    </div>
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Récompenses</div>
    {rewards.map(([pts,label])=><div key={pts} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}><div style={{width:40,textAlign:"center",fontSize:12,fontWeight:700,color:points>=pts?"#10B981":"var(--muted)"}}>{points>=pts?"✅":pts}</div><span style={{flex:1,fontSize:13,color:points>=pts?"var(--text)":"var(--muted)"}}>{label}</span></div>)}
    <div style={{fontSize:14,fontWeight:700,margin:"14px 0 10px"}}>Historique</div>
    {history.map((h,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)",fontSize:12}}><div><span style={{fontWeight:600}}>{h.label}</span><div style={{color:"var(--muted)",fontSize:11,marginTop:1}}>{h.date}</div></div><b style={{color:h.pts.startsWith("+")?  "#10B981":"#EF4444"}}>{h.pts} pts</b></div>)}
    <div style={{marginTop:14,padding:14,background:"var(--light)",borderRadius:14,fontSize:11,color:"var(--sub)",lineHeight:1.5}}>💡 Gagnez 1 point par 1 000 FCFA dépensé. 50 pts bonus par avis. 200 pts par parrainage.</div>
  </div>);
}
export default LoyaltyScr;
