import toast from "../../utils/toast";
import { useState } from "react";
import Img from "../../components/Img";
import MapView from "../../components/MapView";
import { fmt } from "../../utils/helpers";

function DrDeliveryScr({delivery:dl,go,onBack}){
  const [step,setStep]=useState(dl.status==="active"?2:0);
  const stepLabels=["Accepté","Au retrait","En route","Arrivé"];
  const stepActions=["🚀 En route vers le vendeur","📦 Colis récupéré","🏠 Arrivé chez le client","✅ Confirmer livraison"];
  const pickup={lat:-4.262,lng:15.278};
  const client=dl.client?.lat?{lat:dl.client.lat,lng:dl.client.lng}:{lat:-4.277,lng:15.283};
  const driverPos=step<2?{lat:-4.265,lng:15.280}:{lat:(pickup.lat+client.lat)/2,lng:(pickup.lng+client.lng)/2};
  const markers=[
    {lat:pickup.lat,lng:pickup.lng,emoji:"🏪",label:step<2?"Retrait":undefined},
    {lat:client.lat,lng:client.lng,emoji:"🏠",label:step>=2?"Client":undefined},
  ];
  return(<>
    {/* Map */}
    <MapView center={[driverPos.lat,driverPos.lng]} zoom={15} markers={markers} driverPos={driverPos}
      route={[pickup,driverPos,client]} routeColor="#10B981" style={{height:280}}>
      <div style={{position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",zIndex:1000,background:"#F59E0B",color:"#fff",padding:"8px 18px",borderRadius:12,fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(16,185,129,.3)",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
        {step<2?"↗ Vers le commerce · 200m":"↗ Vers le client · 450m"}
      </div>
      <div style={{position:"absolute",top:12,left:12,zIndex:1000}}><button onClick={onBack} style={{width:40,height:40,borderRadius:14,background:"rgba(255,255,255,0.85)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.4)",boxShadow:"0 4px 16px rgba(0,0,0,0.12)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button></div>
    </MapView>

    <div className="scr" style={{padding:16}}>
      {/* Step bar */}
      <div className="dr-step-bar" style={{marginBottom:4}}>
        {stepLabels.map((_,i)=><div key={i} style={{display:"contents"}}>{i>0&&<div className={`dr-step-line ${step>=i?"done":""}`}/>}<div className={`dr-step-dot ${step>i?"done":step===i?"cur":""}`}>{step>i?"✓":i+1}</div></div>)}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--muted)",marginBottom:12}}>{stepLabels.map((l,i)=><span key={l} style={step===i?{color:"#10B981",fontWeight:700}:{}}>{l}</span>)}</div>

      {/* Current destination */}
      <div style={{padding:16,background:step<2?"rgba(99,102,241,0.04)":"rgba(16,185,129,0.04)",border:"1px solid "+(step<2?"rgba(99,102,241,0.15)":"rgba(16,185,129,0.15)"),borderRadius:16,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:step<2?"#6366F1":"#10B981",marginBottom:8}}>{step<2?"📍 RETRAIT":"🏠 LIVRAISON"}</div>
        {step<2?<>
          <div style={{fontSize:15,fontWeight:700,marginBottom:2}}>{dl.pickup}</div>
          <div style={{fontSize:13,color:"var(--muted)"}}>{dl.vendor.name} · {dl.ref}</div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drChatVendor",dl)}>💬 Commerce</button>
            <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#F59E0B",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>toast.info("📞 "+dl.vendor.name)}>📞</button>
          </div>
        </>:<>
          <div style={{fontSize:15,fontWeight:700,marginBottom:2}}>{dl.client.name}</div>
          <div style={{fontSize:13,color:"var(--muted)"}}>{dl.client.addr}</div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#F59E0B",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drChatClient",dl)}>💬 Client</button>
            <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#3B82F6",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("drNavigation",dl)}>🗺️</button>
            <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#F59E0B",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>toast.info("📞 "+dl.client.name)}>📞</button>
          </div>
        </>}
      </div>

      {/* Vendor contact - always visible */}
      {step>=2&&<div style={{padding:14,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:14,marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:12,overflow:"hidden",background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{dl.vendor.logo?<img src={dl.vendor.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:dl.vendor.avatar}</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{dl.vendor.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>Commerce · {dl.pickup}</div></div>
        <button style={{padding:"8px 14px",borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drChatVendor",dl)}>💬</button>
        <button style={{padding:"8px 10px",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:14,cursor:"pointer"}} onClick={()=>toast.info("📞 "+dl.vendor.name)}>📞</button>
      </div>}

      {/* Order info */}
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>📦 Commande {dl.ref}</div>
        {dl.items.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",fontSize:12}}><Img src={it.photo} emoji={it.img} style={{width:24,height:24,borderRadius:4,flexShrink:0}} fit="cover"/><span style={{flex:1}}>{it.name} x{it.qty}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid var(--border)",marginTop:6,fontSize:13}}><span style={{color:"var(--muted)"}}>Total commande</span><b style={{color:"#6366F1"}}>{fmt(dl.total)}</b></div>
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:4,fontSize:12}}><span style={{color:"var(--muted)"}}>Votre gain</span><b style={{color:"#10B981"}}>{fmt(dl.fee+dl.tip)}{dl.tip>0?` (dont ${fmt(dl.tip)} pourboire)`:""}</b></div>
      </div>

      {/* Estimated info */}
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        {[["📏",dl.distance],["⏱️",dl.eta],["💰",fmt(dl.fee)]].map(([i,v])=><div key={i} style={{flex:1,padding:12,background:"var(--light)",borderRadius:12,textAlign:"center"}}><div style={{fontSize:16}}>{i}</div><div style={{fontSize:12,fontWeight:700,marginTop:2}}>{v}</div></div>)}
      </div>

      {/* Bottom action - inside scroll */}
      <div style={{paddingTop:20,paddingBottom:16}}>
        {step<3?<button style={{width:"100%",padding:14,borderRadius:14,border:"none",background:step<2?"#6366F1":"#10B981",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setStep(step+1)}>{stepActions[step]}</button>
        :<button style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#F59E0B",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drConfirm",dl)}>✅ Confirmer la livraison</button>}
      </div>
    </div>
  </>);
}

/* D3 ── DELIVERY CONFIRMATION ── */

export default DrDeliveryScr;
