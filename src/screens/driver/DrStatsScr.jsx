import { useState } from "react";
import { useLoad } from "../../hooks";
import Icon from "../../components/Icon";
import { fmt } from "../../utils/helpers";
import driver from "../../services/driverService";

// Statistiques réelles du livreur (API /driver/stats : livraisons terminées et gains)
function DrStatsScr({onBack}){
  const [period,setPeriod]=useState("week");
  const { data: statsData, loading, error } = useLoad(() => driver.getStats(period), [period]);
  const s = statsData?.stats || {};
  const profile = statsData?.driver || {};
  const deliveries = parseInt(s.total_deliveries) || 0;
  const earned = parseFloat(s.total_earned) || 0;
  const avg = parseFloat(s.avg_earning) || 0;
  const rating = parseFloat(profile.avg_rating) || 0;

  return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Statistiques</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",gap:6,marginBottom:14}}>{[["today","Aujourd'hui"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} onClick={()=>setPeriod(k)} style={{flex:1,padding:10,borderRadius:12,border:period===k?"2px solid #F97316":"1px solid var(--border)",background:period===k?"rgba(249,115,22,0.04)":"var(--card)",color:period===k?"#F97316":"var(--text)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}</div>

    {loading ? <div style={{display:"flex",justifyContent:"center",padding:40}}><div className="spinner"/></div> : <>
      {error&&<div className="info-box yellow" style={{marginBottom:12}}><span><Icon name="info" size={16}/></span><span style={{fontSize:12}}>{error}</span></div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[["package",deliveries,"Livraisons"],["money",fmt(earned),"Gains"],["coin",fmt(avg),"Gain moyen / course"],["star_full",rating?rating.toFixed(1)+" / 5":"—","Note moyenne"]].map(([ic,v,l])=>
          <div key={l} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,textAlign:"center"}}>
            <Icon name={ic} size={18}/><div style={{fontSize:18,fontWeight:700,marginTop:4}}>{v}</div><div style={{fontSize:11,color:"var(--muted)"}}>{l}</div>
          </div>)}
      </div>
      <div style={{fontSize:12,color:"var(--muted)",textAlign:"center"}}>Total depuis l'inscription : {parseInt(profile.total_deliveries)||0} livraison{(parseInt(profile.total_deliveries)||0)>1?"s":""}</div>
    </>}
  </div>);
}
export default DrStatsScr;
