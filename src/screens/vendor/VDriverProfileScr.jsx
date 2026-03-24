import toast from "../../utils/toast";


function VDriverProfileScr({driver:d,go,onBack}){
  const history=[
    {ref:"#CMD-0889",client:"Celine Nzaba",date:"14 Fév",duration:"28 min",rating:5},
    {ref:"#CMD-0885",client:"David Tsaty",date:"12 Fév",duration:"32 min",rating:5},
    {ref:"#CMD-0878",client:"Paul Nkaya",date:"8 Fév",duration:"45 min",rating:4},
    {ref:"#CMD-0870",client:"Marie Koumba",date:"5 Fév",duration:"22 min",rating:5},
  ];
  return(<div className="scr" style={{paddingBottom:20}}>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Profil livreur</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"10px 20px 20px"}}>
      <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:32}}>{d.avatar}</div>
      <h2 style={{fontSize:20,fontWeight:700}}>{d.name}</h2>
      <p style={{fontSize:13,color:"var(--muted)",marginTop:2}}>{d.vehicle} · {d.plate}</p>
      <p style={{fontSize:12,color:"var(--muted)"}}>📍 {d.zone} · 📱 {d.phone}</p>
      <span className={`del-status ${d.status==="available"?"available":d.status==="busy"?"busy":""}`} style={d.status==="offline"?{background:"rgba(0,0,0,0.05)",color:"var(--muted)",display:"inline-block",marginTop:8}:{display:"inline-block",marginTop:8}}>{d.status==="available"?"🟢 Disponible":d.status==="busy"?"🟡 Occupé":"⚫ Hors ligne"}</span>
    </div>
    <div className="vp-stats" style={{padding:"0 16px",marginBottom:12}}>
      <div className="vps r"><div className="vsi">⭐</div><b>{d.rating}</b><span>Note</span></div>
      <div className="vps p"><div className="vsi">📦</div><b>{d.deliveries}</b><span>Livraisons</span></div>
      <div className="vps f"><div className="vsi">⏱️</div><b>31 min</b><span>Temps moy.</span></div>
    </div>
    <div style={{display:"flex",gap:10,padding:"0 16px",marginBottom:12}}>
      <button style={{flex:1,padding:12,borderRadius:14,border:"none",background:"#F59E0B",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>window.location.href="tel:+242064663469"}>📞 Appeler</button>
      <button style={{flex:1,padding:12,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>go("vDriverChat",{driver:d.name,driverAv:d.avatar})}>💬 Message</button>
    </div>
    {d.status==="available"&&<div style={{padding:"0 16px",marginBottom:12}}>
      <div className="info-box green"><span>✅</span><span>{d.name} est disponible pour une livraison. Assignez-le depuis le détail d'une commande.</span></div>
    </div>}
    <div style={{padding:"0 16px"}}><div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Historique récent</div>
      {history.map((h,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
        <div style={{width:32,height:32,borderRadius:8,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✅</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{h.ref} → {h.client}</div><div style={{fontSize:11,color:"var(--muted)"}}>{h.date} · {h.duration}</div></div>
        <span style={{fontSize:12,color:"#F59E0B"}}>{"★".repeat(h.rating)}</span>
      </div>)}
    </div>
  </div>);
}

/* V12c ── VENDOR TRACK DELIVERY ── */

export default VDriverProfileScr;
