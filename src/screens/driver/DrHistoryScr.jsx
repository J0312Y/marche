import { useState } from "react";
import { D_HISTORY } from "../../data/driverData";
import { fmt } from "../../utils/helpers";

function DrHistoryScr({onBack}){
  const totalEarned=D_HISTORY.reduce((s,h)=>s+h.fee+h.tip,0);
  const [expanded,setExpanded]=useState(null);

  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Historique</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 10px",display:"flex",gap:10}}>
      <div style={{flex:1,padding:14,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.12)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"#10B981"}}>{D_HISTORY.length}</div><div style={{fontSize:11,color:"var(--muted)"}}>Livraisons</div></div>
      <div style={{flex:1,padding:14,background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.12)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"#6366F1"}}>{fmt(totalEarned)}</div><div style={{fontSize:11,color:"var(--muted)"}}>Total gagné</div></div>
      <div style={{flex:1,padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.12)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"#F59E0B"}}>4.8</div><div style={{fontSize:11,color:"var(--muted)"}}>Note moy.</div></div>
    </div>

    <div style={{padding:"0 16px 80px"}}>{D_HISTORY.map(h=>{
      const isOpen=expanded===h.id;
      return(<div key={h.id} style={{background:"var(--card)",border:isOpen?"2px solid #6366F1":"1px solid #E8E6E1",borderRadius:16,marginBottom:10,overflow:"hidden",transition:"all .2s"}}>
        {/* Summary — always visible */}
        <div onClick={()=>setExpanded(isOpen?null:h.id)} style={{padding:14,cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:14,fontWeight:700}}>{h.ref}</span>
            <span style={{fontSize:14,fontWeight:700,color:"#10B981"}}>+{fmt(h.fee+h.tip)}</span>
          </div>
          <div style={{fontSize:13,color:"var(--sub)",marginBottom:4}}>{h.vendor} → {h.client}</div>
          <div style={{display:"flex",gap:10,fontSize:11,color:"var(--muted)",flexWrap:"wrap"}}>
            <span>📅 {h.date}</span><span>⏱️ {h.duration}</span><span>📏 {h.distance}</span>
            <span style={{color:"#F59E0B"}}>{"★".repeat(h.rating)}</span>
            {h.tip>0&&<span style={{color:"#F59E0B"}}>🎁 {fmt(h.tip)}</span>}
          </div>
        </div>

        {/* Expanded details */}
        {isOpen&&<div style={{padding:"0 14px 14px",borderTop:"1px solid var(--border)"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
            <div style={{padding:10,background:"var(--light)",borderRadius:10}}>
              <div style={{fontSize:10,color:"var(--muted)",marginBottom:2}}>Course</div>
              <div style={{fontSize:13,fontWeight:600}}>{fmt(h.fee)}</div>
            </div>
            <div style={{padding:10,background:h.tip>0?"rgba(245,158,11,0.06)":"#F5F4F1",borderRadius:10}}>
              <div style={{fontSize:10,color:"var(--muted)",marginBottom:2}}>Pourboire</div>
              <div style={{fontSize:13,fontWeight:600,color:h.tip>0?"#F59E0B":"#908C82"}}>{h.tip>0?fmt(h.tip):"—"}</div>
            </div>
          </div>

          {/* Route */}
          <div style={{marginTop:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <div style={{width:24,height:24,borderRadius:6,background:"rgba(99,102,241,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>📍</div>
              <div><div style={{fontSize:12,fontWeight:600}}>Récupération</div><div style={{fontSize:11,color:"var(--muted)"}}>{h.vendor}</div></div>
            </div>
            <div style={{width:2,height:12,background:"var(--border)",marginLeft:11}}/>
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:6}}>
              <div style={{width:24,height:24,borderRadius:6,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🏠</div>
              <div><div style={{fontSize:12,fontWeight:600}}>Livraison</div><div style={{fontSize:11,color:"var(--muted)"}}>{h.client}</div></div>
            </div>
          </div>

          {/* Details */}
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:11,color:"var(--muted)"}}>Distance</div><div style={{fontSize:13,fontWeight:700}}>{h.distance}</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:11,color:"var(--muted)"}}>Durée</div><div style={{fontSize:13,fontWeight:700}}>{h.duration}</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:11,color:"var(--muted)"}}>Note</div><div style={{fontSize:13,fontWeight:700,color:"#F59E0B"}}>{"★".repeat(h.rating)} {h.rating}/5</div></div>
          </div>
        </div>}
      </div>);
    })}</div>
  </div>);
}

export default DrHistoryScr;
