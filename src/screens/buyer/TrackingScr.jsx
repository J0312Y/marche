import { triggerPush } from "../../components/PushBanner";
import LiveMap from "../../components/LiveMap";
import { useState, useEffect } from "react";
import toast from "../../utils/toast";
import { DRIVER_PHOTO } from "../../data/images";
import MapView from "../../components/MapView";

const STEPS=[
  {icon:"✅",label:"Commande confirmée",time:"14:42",done:true},
  {icon:"👨‍🍳",label:"Préparation en cours",time:"14:48",done:true},
  {icon:"📦",label:"Colis récupéré",time:"15:02",done:true},
  {icon:"🛵",label:"En route vers vous",time:"15:10",done:false,active:true},
  {icon:"🏠",label:"Livré",time:"~15:22",done:false},
];

const ITEMS=[
  {name:"Galaxy A54",emoji:"📱",qty:1,price:185000},
  {name:"Panier Bio Légumes",emoji:"🥬",qty:3,price:4500},
  {name:"Chemise Bogolan",emoji:"👔",qty:1,price:18000},
];

function TrackingScr({onBack,go}){
  const pickup={lat:-4.262,lng:15.278};
  const dest={lat:-4.277,lng:15.283};
  const [driverPos,setDriverPos]=useState({lat:-4.268,lng:15.280});
  const [eta,setEta]=useState(12);
  const [progress,setProgress]=useState(65);

  useEffect(()=>{
    const iv=setInterval(()=>{
      setDriverPos(p=>({lat:p.lat-(0.0003+Math.random()*0.0002),lng:p.lng+(0.0001+Math.random()*0.0001)}));
      setEta(e=>Math.max(1,e-Math.random()*0.5));
      setProgress(p=>Math.min(95,p+Math.random()*2));
    },3000);
    return ()=>clearInterval(iv);
  },[]);

  const markers=[
    {lat:pickup.lat,lng:pickup.lng,emoji:"📍",label:"Retrait"},
    {lat:dest.lat,lng:dest.lng,emoji:"🏠",label:"Livraison"},
  ];
  const route=[pickup,driverPos,dest];
  const sub=ITEMS.reduce((s,i)=>s+i.price*i.qty,0);

  return(<>
    {/* Map */}
    <MapView center={[-4.270,15.281]} zoom={15} markers={markers} route={route} routeColor="#F97316" driverPos={driverPos} style={{height:220}}>
      <div style={{position:"absolute",top:10,left:10,zIndex:1000}}>
        <button onClick={onBack} style={{width:40,height:40,borderRadius:14,background:"rgba(255,255,255,0.85)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.4)",boxShadow:"0 4px 16px rgba(0,0,0,0.12)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
      </div>
      {/* Live ETA badge */}
      <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",zIndex:1000,background:"var(--card)",padding:"8px 16px",borderRadius:14,boxShadow:"0 4px 16px rgba(0,0,0,.12)",display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap"}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:"#10B981",animation:"blink 1.5s infinite"}}/>
        <span style={{fontSize:13,fontWeight:700}}>En route</span>
        <span style={{fontSize:12,color:"var(--muted)"}}>·</span>
        <span style={{fontSize:13,fontWeight:700,color:"#F97316"}}>{Math.ceil(eta)} min</span>
      </div>
    </MapView>

    <div className="scr" style={{padding:16}}>
      {/* Driver card */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:12}}>
        <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#10B981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,position:"relative",overflow:"hidden"}}>
          <img src={DRIVER_PHOTO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
          <div style={{position:"absolute",bottom:-2,right:-2,width:14,height:14,borderRadius:"50%",background:"#10B981",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"var(--card)"}}/>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:700}}>Patrick Moukala</div>
          <div style={{fontSize:11,color:"var(--muted)",display:"flex",alignItems:"center",gap:6,marginTop:2}}>
            <span>🛵 Honda PCX</span><span>·</span><span>BZ-4521</span>
          </div>
          <div style={{fontSize:11,color:"#F59E0B",marginTop:2}}>⭐ 4.8 · 342 livraisons</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>toast.info("📞 Appel en cours...")} style={{width:40,height:40,borderRadius:12,border:"none",background:"#F59E0B",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>📞</button>
          <button onClick={()=>go("chatDriver")} style={{width:40,height:40,borderRadius:12,border:"none",background:"#F97316",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>💬</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:13,fontWeight:700}}>Progression</span>
          <span style={{fontSize:12,fontWeight:700,color:"#F97316"}}>{Math.round(progress)}%</span>
        </div>
        <div style={{height:6,background:"var(--border)",borderRadius:3,overflow:"hidden",marginBottom:8}}>
          <div style={{width:`${progress}%`,height:"100%",background:"linear-gradient(90deg,#F97316,#FB923C)",borderRadius:3,transition:"width 1s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)"}}>
          <span>📍 Marché Total</span>
          <span>🏠 Bacongo, Rue 14</span>
        </div>
      </div>

      {/* Timeline */}
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Suivi en temps réel</div>
        {STEPS.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:i<STEPS.length-1?0:0}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:28,height:28,borderRadius:8,background:s.done?"#10B981":s.active?"#F97316":"var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:s.done||s.active?"var(--card)":"var(--muted)",flexShrink:0,boxShadow:s.active?"0 0 0 4px rgba(249,115,22,.15)":"none"}}>
                {s.done?"✓":s.icon}
              </div>
              {i<STEPS.length-1&&<div style={{width:2,height:18,background:s.done?"#10B981":"var(--border)"}}/>}
            </div>
            <div style={{paddingTop:4,paddingBottom:i<STEPS.length-1?8:0}}>
              <div style={{fontSize:12,fontWeight:s.active?700:s.done?600:400,color:s.done||s.active?"var(--text)":"var(--muted)"}}>{s.label}</div>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{s.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Order items */}
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:13,fontWeight:700}}>Articles ({ITEMS.length})</span>
          <span style={{fontSize:12,fontWeight:600,fontFamily:"monospace",color:"var(--muted)"}}>#LMK-2026-0214</span>
        </div>
        {ITEMS.map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:i?"1px solid var(--border)":"none"}}>
            <div style={{width:36,height:36,borderRadius:10,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{item.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600}}>{item.qty > 1 ? `${item.qty}× ` : ""}{item.name}</div>
            </div>
            <div style={{fontSize:12,fontWeight:700,color:"#F97316"}}>{(item.price*item.qty).toLocaleString()} F</div>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid var(--border)",marginTop:8}}>
          <span style={{fontSize:12,color:"var(--muted)"}}>Livraison</span>
          <span style={{fontSize:12,fontWeight:600}}>2 500 F</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:6}}>
          <span style={{fontSize:14,fontWeight:700}}>Total</span>
          <span style={{fontSize:14,fontWeight:700,color:"#F97316"}}>{(sub+2500).toLocaleString()} FCFA</span>
        </div>
      </div>

      {/* Delivery address */}
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Adresse de livraison</div>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:18}}>🏠</span>
          <div>
            <div style={{fontSize:13,fontWeight:600}}>Quartier Bacongo, Rue 14, N°42</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Brazzaville, Congo 🇨🇬</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Paiement : Airtel Money ✅</div>
          </div>
        </div>
      </div>

      {/* Help */}
      <div style={{display:"flex",gap:8,paddingBottom:20}}>
        <button onClick={()=>toast.info("Support contacté")} style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>🆘 Aide</button>
        <button onClick={()=>toast.info("Partage du suivi...")} style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>📤 Partager</button>
      </div>
    </div>
  </>);
}

export default TrackingScr;
