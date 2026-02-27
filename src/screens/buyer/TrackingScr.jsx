import { useState, useEffect } from "react";
import MapView from "../../components/MapView";

function TrackingScr({onBack,go}){
  const pickup={lat:-4.262,lng:15.278};
  const dest={lat:-4.277,lng:15.283};
  // Simulate driver moving
  const [driverPos,setDriverPos]=useState({lat:-4.268,lng:15.280});
  useEffect(()=>{
    const iv=setInterval(()=>{
      setDriverPos(p=>({
        lat:p.lat-(0.0003+Math.random()*0.0002),
        lng:p.lng+(0.0001+Math.random()*0.0001),
      }));
    },3000);
    return ()=>clearInterval(iv);
  },[]);

  const markers=[
    {lat:pickup.lat,lng:pickup.lng,emoji:"📍",label:"Retrait"},
    {lat:dest.lat,lng:dest.lng,emoji:"🏠",label:"Livraison"},
  ];
  const route=[pickup,driverPos,dest];

  return(<>
    <MapView
      center={[-4.270,15.281]}
      zoom={15}
      markers={markers}
      route={route}
      routeColor="#6366F1"
      driverPos={driverPos}
      style={{height:260}}
    >
      <div style={{position:"absolute",top:12,left:12,zIndex:1000}}>
        <button onClick={onBack} style={{width:38,height:38,borderRadius:12,background:"#fff",border:"none",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      </div>
      <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",zIndex:1000,background:"#fff",padding:"8px 16px",borderRadius:12,boxShadow:"0 2px 12px rgba(0,0,0,.1)",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>🟢 En route · 12 min</div>
    </MapView>
    <div className="scr" style={{padding:20}}>
      <div className="track-driver"><div className="td-av">🧑</div><div className="td-info"><h4>Patrick Moukala</h4><p>🛵 Honda PCX · BZ-4521</p><div className="td-r">⭐ 4.8 · 342 livraisons</div></div></div>
      <div className="track-actions"><button className="ta-call" onClick={()=>alert("📞 Appel...")}>📞 Appeler</button><button className="ta-chat" onClick={()=>go("chatDriver")}>💬 Discuter</button></div>
      <div className="eta-box"><h4>Livraison en cours</h4><div className="eta-bar"><div className="eta-fill" style={{width:"65%"}}/></div><div className="eta-info"><span>Départ: <b>Marché Total</b></span><span>Arrivée: <b>~12 min</b></span></div></div>
      <div className="track-detail"><span className="tdi">📦</span><div className="tdt"><h5>#LMK-2026-0214</h5><p>3 articles · 231 500 FCFA</p></div></div>
      <div className="track-detail"><span className="tdi">📍</span><div className="tdt"><h5>Retrait</h5><p>Marché Total, Brazzaville</p></div></div>
      <div className="track-detail"><span className="tdi">🏠</span><div className="tdt"><h5>Livraison</h5><p>Quartier Bacongo, Rue 14</p></div></div>
    </div>
  </>);
}

export default TrackingScr;
