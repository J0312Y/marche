import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import { D_HISTORY } from "../../data/driverData";
import { fmt } from "../../utils/helpers";

function DrHistoryScr({onBack}){
  const [period,setPeriod]=useState("week");
  const [expanded,setExpanded]=useState(null);
  const [statusFilter,setStatusFilter]=useState("all");

  const weeklyData=[8500,12000,6500,15000,9200,18000,11500];
  const monthlyData=[52000,68000,45000,72000];
  const weekDays=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const monthWeeks=["S1","S2","S3","S4"];

  const chartData=period==="week"?weeklyData:monthlyData;
  const chartLabels=period==="week"?weekDays:monthWeeks;
  const maxEarn=Math.max(...chartData);
  const totalPeriod=chartData.reduce((a,b)=>a+b,0);
  const fmtK=(n)=>n>=1000?(n/1000).toFixed(0)+"k":n;
  const totalEarned=D_HISTORY.reduce((s,h)=>s+h.fee+h.tip,0);
  const totalDeliveries=D_HISTORY.length;
  const avgRating=(D_HISTORY.reduce((s,h)=>s+(h.rating||4.5),0)/D_HISTORY.length).toFixed(1);

  const filtered=statusFilter==="all"?D_HISTORY:D_HISTORY.filter(h=>h.status===statusFilter);
  const completed=D_HISTORY.filter(h=>h.status==="done").length;
  const cancelled=D_HISTORY.filter(h=>h.status==="cancelled").length;

  return(<PullToRefresh onRefresh={async()=>{toast.success("Historique actualisé 📦")}}><div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Historique</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 16px 14px"}}>

      {/* Period selector */}
      <div style={{display:"flex",gap:4,background:"var(--light)",borderRadius:12,padding:3,marginBottom:12}}>
        {[["today","Aujourd'hui"],["week","Semaine"],["month","Mois"],["all","Tout"]].map(([k,l])=>
          <button key={k} onClick={()=>setPeriod(k)} style={{flex:1,padding:8,borderRadius:10,border:"none",background:period===k?"var(--card)":"transparent",fontSize:11,fontWeight:period===k?700:500,cursor:"pointer",fontFamily:"inherit",color:period===k?"var(--text)":"var(--muted)",boxShadow:period===k?"0 1px 3px rgba(0,0,0,.08)":"none"}}>{l}</button>
        )}
      </div>

      {/* Summary cards */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,textAlign:"center"}}>
          <div style={{fontSize:10,color:"var(--muted)"}}>Gains</div>
          <div style={{fontSize:18,fontWeight:800,color:"#F97316",marginTop:2}}>{fmt(period==="all"?totalEarned:totalPeriod)}</div>
        </div>
        <div style={{flex:1,padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,textAlign:"center"}}>
          <div style={{fontSize:10,color:"var(--muted)"}}>Livraisons</div>
          <div style={{fontSize:18,fontWeight:800,color:"var(--text)",marginTop:2}}>{period==="all"?totalDeliveries:period==="week"?7:period==="month"?28:2}</div>
        </div>
        <div style={{flex:1,padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,textAlign:"center"}}>
          <div style={{fontSize:10,color:"var(--muted)"}}>Note moy.</div>
          <div style={{fontSize:18,fontWeight:800,color:"#F59E0B",marginTop:2}}>⭐ {avgRating}</div>
        </div>
      </div>

      {/* Chart */}
      {period!=="all"&&<div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:14,fontWeight:700}}>💰 Gains — {period==="today"?"Aujourd'hui":period==="week"?"Cette semaine":"Ce mois"}</span>
          <span style={{fontSize:13,fontWeight:700,color:"#F97316"}}>{fmt(totalPeriod)}</span>
        </div>
        <div style={{display:"flex",alignItems:"flex-end",gap:period==="month"?12:6,height:100}}>
          {chartData.map((v,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <span style={{fontSize:9,fontWeight:600,color:"#F97316"}}>{fmtK(v)}</span>
            <div style={{width:"100%",background:"linear-gradient(180deg,#F97316,#FDBA74)",borderRadius:6,height:Math.max(8,(v/maxEarn)*80),transition:"height .3s"}}/>
            <span style={{fontSize:9,color:"var(--muted)"}}>{chartLabels[i]}</span>
          </div>)}
        </div>
      </div>}

      {/* Status filter */}
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["all","Toutes ("+D_HISTORY.length+")"],["done","✅ Livrées ("+completed+")"],["cancelled","❌ Annulées ("+cancelled+")"]].map(([k,l])=>
          <button key={k} onClick={()=>setStatusFilter(k)} style={{padding:"6px 10px",borderRadius:8,border:statusFilter===k?"2px solid #F97316":"1px solid var(--border)",background:statusFilter===k?"rgba(249,115,22,0.04)":"var(--card)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:statusFilter===k?"#F97316":"var(--muted)",flexShrink:0}}>{l}</button>
        )}
      </div>

      {/* Delivery list */}
      {filtered.map((h,i)=>{
        const isOpen=expanded===i;
        return(<div key={i} onClick={()=>setExpanded(isOpen?null:i)} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:40,height:40,borderRadius:12,background:h.status==="done"?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{h.status==="done"?"✅":"❌"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{h.ref} · {h.client}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{h.vendor} · {h.date}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:14,fontWeight:700,color:"#F97316"}}>{fmt(h.fee+h.tip)}</div>
              {h.tip>0&&<div style={{fontSize:10,color:"#F59E0B"}}>+{fmt(h.tip)} tip</div>}
            </div>
          </div>
          {isOpen&&<div style={{marginTop:10,paddingTop:10,borderTop:"1px solid var(--border)"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,fontSize:12}}>
              <span style={{color:"var(--muted)"}}>📍 {h.distance}</span>
              <span style={{color:"var(--muted)"}}>⏱️ {h.duration||"15 min"}</span>
              <span style={{color:"var(--muted)"}}>💰 Course: {fmt(h.fee)}</span>
              {h.tip>0&&<span style={{color:"#F59E0B"}}>🎁 Pourboire: {fmt(h.tip)}</span>}
              {h.rating&&<span style={{color:"#F59E0B"}}>⭐ {h.rating}/5</span>}
              {h.payment==="cash"&&<span style={{color:"#F59E0B"}}>💵 Cash</span>}
            </div>
          </div>}
        </div>);
      })}

      {filtered.length===0&&<div style={{textAlign:"center",padding:"30px 0"}}><div style={{fontSize:36,marginBottom:8}}>📭</div><div style={{fontSize:13,color:"var(--muted)"}}>Aucune livraison dans cette catégorie</div></div>}
    </div>
  </div></PullToRefresh>);
}

export default DrHistoryScr;
