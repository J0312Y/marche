import { D_HISTORY } from "../../data/driverData";
import { fmt } from "../../utils/helpers";

function DrHistoryScr({onBack}){
  const totalEarned=D_HISTORY.reduce((s,h)=>s+h.fee+h.tip,0);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Historique</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 10px",display:"flex",gap:10}}>
      <div style={{flex:1,padding:14,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.12)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"#10B981"}}>{D_HISTORY.length}</div><div style={{fontSize:11,color:"#908C82"}}>Livraisons</div></div>
      <div style={{flex:1,padding:14,background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.12)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"#6366F1"}}>{fmt(totalEarned)}</div><div style={{fontSize:11,color:"#908C82"}}>Total gagné</div></div>
      <div style={{flex:1,padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.12)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"#F59E0B"}}>4.8</div><div style={{fontSize:11,color:"#908C82"}}>Note moy.</div></div>
    </div>
    <div style={{padding:"0 20px 80px"}}>{D_HISTORY.map(h=><div key={h.id} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:14,fontWeight:700}}>{h.ref}</span><span style={{fontSize:14,fontWeight:700,color:"#10B981"}}>+{fmt(h.fee+h.tip)}</span></div>
      <div style={{fontSize:13,color:"#5E5B53",marginBottom:4}}>{h.vendor} → {h.client}</div>
      <div style={{display:"flex",gap:10,fontSize:11,color:"#908C82",flexWrap:"wrap"}}><span>📅 {h.date}</span><span>⏱️ {h.duration}</span><span>📏 {h.distance}</span><span style={{color:"#F59E0B"}}>{"★".repeat(h.rating)}</span>{h.tip>0&&<span style={{color:"#F59E0B"}}>🎁 {fmt(h.tip)} pourboire</span>}</div>
    </div>)}</div>
  </div>);
}

/* D8 ── DRIVER WALLET ── */

export default DrHistoryScr;
