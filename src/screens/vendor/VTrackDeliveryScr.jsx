import MapView from "../../components/MapView";

function VTrackDeliveryScr({delivery:d,go,onBack}){
  const pickup={lat:-4.262,lng:15.278};
  const dest={lat:-4.277,lng:15.283};
  const driverPos={lat:-4.270,lng:15.281};
  const steps=[
    {label:"Commande prête",time:"14:05",done:true},
    {label:"Livreur assigné",time:"14:08",done:true},
    {label:"Colis récupéré",time:"14:15",done:d.progress>30},
    {label:"En route",time:d.progress>40?"14:20":"—",done:d.progress>50},
    {label:"Livré au client",time:"—",done:false},
  ];
  const markers=[
    {lat:pickup.lat,lng:pickup.lng,emoji:"📍",label:"Retrait"},
    {lat:dest.lat,lng:dest.lng,emoji:"🏠",label:"Client"},
  ];
  return(<>
    <MapView center={[driverPos.lat,driverPos.lng]} zoom={15} markers={markers} driverPos={driverPos}
      route={[pickup,driverPos,dest]} routeColor="#6366F1" style={{height:200}}>
      <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",zIndex:1000,background:"#fff",padding:"8px 16px",borderRadius:12,boxShadow:"0 2px 12px rgba(0,0,0,.1)",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>🟢 {d.status} · {d.eta} restantes</div>
      <div style={{position:"absolute",top:12,left:12,zIndex:1000}}><button onClick={onBack} style={{width:38,height:38,borderRadius:12,background:"#fff",border:"none",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button></div>
    </MapView>
    <div className="scr" style={{padding:20}}>
      <div className="track-driver"><div className="td-av">{d.driverAv}</div><div className="td-info"><h4>{d.driver}</h4><p>→ {d.client}</p><div className="td-r">{d.addr}</div></div></div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#10B981",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>alert("📞 Appel vers "+d.driver)}>📞 Appeler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>go("vDriverChat",d)}>💬 Message</button>
      </div>
      <div className="eta-box"><h4>Progression</h4><div className="eta-bar"><div className="eta-fill" style={{width:`${d.progress}%`}}/></div><div className="eta-info"><span>Départ</span><span><b>~{d.eta}</b></span></div></div>
      <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Suivi étapes</div>
        {steps.map((s,i)=><div key={i} style={{display:"flex",gap:12}}>
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
  </>);
}

export default VTrackDeliveryScr;
