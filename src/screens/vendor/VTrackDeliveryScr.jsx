

function VTrackDeliveryScr({delivery:d,go,onBack}){
  const steps=[
    {label:"Commande prête",time:"14:05",done:true},
    {label:"Livreur assigné",time:"14:08",done:true},
    {label:"Colis récupéré",time:"14:15",done:d.progress>30},
    {label:"En route",time:d.progress>40?"14:20":"—",done:d.progress>50},
    {label:"Livré au client",time:"—",done:false},
  ];
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="track-map" style={{height:200}}>
      <div className="map-grid"/><div className="map-road"/><div className="map-route"/>
      <div className="map-pin" style={{top:"calc(45% - 16px)",left:"13%"}}>📍</div>
      <div className="map-driver">🛵</div>
      <div className="map-pin" style={{top:"calc(45% - 16px)",left:"48%"}}>🏠</div>
      <div className="map-label">🟢 {d.status} · {d.eta} restantes</div>
      <div style={{position:"absolute",top:12,left:12}}><button onClick={onBack} style={{width:38,height:38,borderRadius:12,background:"#fff",border:"none",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button></div>
    </div>
    <div className="scr" style={{padding:20}}>
      {/* Driver info */}
      <div className="track-driver"><div className="td-av">{d.driverAv}</div><div className="td-info"><h4>{d.driver}</h4><p>→ {d.client}</p><div className="td-r">{d.addr}</div></div></div>

      {/* Actions */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#10B981",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>alert("📞 Appel vers "+d.driver)}>📞 Appeler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>go("vDriverChat",d)}>💬 Message</button>
      </div>

      {/* Progress */}
      <div className="eta-box"><h4>Progression</h4><div className="eta-bar"><div className="eta-fill" style={{width:`${d.progress}%`}}/></div><div className="eta-info"><span>Départ</span><span><b>~{d.eta}</b></span></div></div>

      {/* Timeline */}
      <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Suivi étapes</div>
        {steps.map((s,i)=><div key={i} style={{display:"flex",gap:12,marginBottom:i<steps.length-1?0:0}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:s.done?"#10B981":"#E8E6E1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700,flexShrink:0}}>{s.done?"✓":i+1}</div>
            {i<steps.length-1&&<div style={{width:2,height:28,background:s.done?"#10B981":"#E8E6E1",margin:"4px 0"}}/>}
          </div>
          <div style={{paddingBottom:i<steps.length-1?16:0}}>
            <div style={{fontSize:13,fontWeight:600,color:s.done?"#191815":"#908C82"}}>{s.label}</div>
            <div style={{fontSize:11,color:"#908C82"}}>{s.time}</div>
          </div>
        </div>)}
      </div>
    </div>
  </div>);
}

/* V12d ── VENDOR ↔ DRIVER CHAT ── */

export default VTrackDeliveryScr;
