import toast from "../../utils/toast";
import { useState, useEffect } from "react";
import MapView from "../../components/MapView";

function DrNavigationScr({delivery:dl,go,onBack}){
  const client=dl.client?.lat?{lat:dl.client.lat,lng:dl.client.lng}:{lat:-4.277,lng:15.283};
  const [driverPos,setDriverPos]=useState({lat:-4.265,lng:15.280});

  // Simulate movement toward client
  useEffect(()=>{
    const iv=setInterval(()=>{
      setDriverPos(p=>({
        lat:p.lat+(client.lat-p.lat)*0.03+(Math.random()-0.5)*0.0001,
        lng:p.lng+(client.lng-p.lng)*0.03+(Math.random()-0.5)*0.0001,
      }));
    },2500);
    return ()=>clearInterval(iv);
  },[]);

  const markers=[
    {lat:client.lat,lng:client.lng,emoji:"🏠"},
  ];

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <MapView
      center={[driverPos.lat,driverPos.lng]}
      zoom={16}
      markers={markers}
      driverPos={driverPos}
      route={[driverPos,client]}
      routeColor="#F97316"
      style={{flex:1}}
    >
      {/* Turn direction */}
      <div style={{position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",zIndex:1000,background:"#F59E0B",color:"#fff",padding:"8px 18px",borderRadius:12,fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(16,185,129,.3)",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
        ↗ Tourner à droite · 200m
      </div>
      {/* Top bar */}
      <div style={{position:"absolute",top:12,left:12,right:12,display:"flex",justifyContent:"space-between",zIndex:1000}}>
        <button onClick={onBack} style={{width:40,height:40,borderRadius:14,background:"rgba(255,255,255,0.85)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.4)",boxShadow:"0 4px 16px rgba(0,0,0,0.12)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
        <div style={{padding:"8px 14px",borderRadius:12,background:"var(--card)",boxShadow:"0 2px 8px rgba(0,0,0,.1)",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>⏱️ {dl.eta} · {dl.distance}</div>
      </div>
      {/* Bottom info */}
      <div style={{position:"absolute",bottom:16,left:16,right:16,zIndex:1000,background:"var(--card)",padding:14,borderRadius:16,boxShadow:"0 4px 20px rgba(0,0,0,.12)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏠</div>
          <div style={{flex:1}}><h3 style={{fontSize:15,fontWeight:700,marginBottom:2}}>{dl.client.name}</h3><p style={{fontSize:12,color:"var(--muted)",margin:0}}>{dl.client.addr}</p></div>
          <div style={{display:"flex",gap:6}}>
            <button style={{width:38,height:38,borderRadius:10,border:"none",background:"#F59E0B",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>toast.info("📞 Appel")}>📞</button>
            <button style={{width:38,height:38,borderRadius:10,border:"none",background:"#F97316",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("drChatClient",dl)}>💬</button>
          </div>
        </div>
      </div>
    </MapView>
  </div>);
}

export default DrNavigationScr;
