import { useState } from "react";
import { fmt } from "../../utils/helpers";

function DrDeliveryScr({delivery:dl,go,onBack}){
  const [step,setStep]=useState(dl.status==="active"?2:0); // 0=accepted,1=atPickup,2=inTransit,3=arriving
  const stepLabels=["Accepté","Au retrait","En route","Arrivé"];
  const stepActions=["🚀 En route vers le vendeur","📦 Colis récupéré","🏠 Arrivé chez le client","✅ Confirmer livraison"];
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    {/* Map */}
    <div className="dr-nav-map">
      <div className="map-grid"/><div className="dr-nav-road"/><div className="dr-nav-road2"/><div className="dr-nav-route"/>
      <div className="dr-nav-me">🛵</div>
      <div className="dr-nav-dest" style={{top:"28%",left:step<2?"65%":"75%"}}>{step<2?"🏪":"🏠"}</div>
      <div className="dr-nav-dir">{step<2?"↗ Tourner à droite · 200m":"↗ Tout droit · 450m"}</div>
      <div style={{position:"absolute",top:12,left:12}}><button onClick={onBack} style={{width:38,height:38,borderRadius:12,background:"#fff",border:"none",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button></div>
    </div>

    <div className="scr" style={{padding:20}}>
      {/* Step bar */}
      <div className="dr-step-bar" style={{marginBottom:4}}>
        {stepLabels.map((_,i)=><div key={i} style={{display:"contents"}}>{i>0&&<div className={`dr-step-line ${step>=i?"done":""}`}/>}<div className={`dr-step-dot ${step>i?"done":step===i?"cur":""}`}>{step>i?"✓":i+1}</div></div>)}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#908C82",marginBottom:16}}>{stepLabels.map((l,i)=><span key={l} style={step===i?{color:"#10B981",fontWeight:700}:{}}>{l}</span>)}</div>

      {/* Current destination */}
      <div style={{padding:16,background:step<2?"rgba(99,102,241,0.04)":"rgba(16,185,129,0.04)",border:"1px solid "+(step<2?"rgba(99,102,241,0.15)":"rgba(16,185,129,0.15)"),borderRadius:16,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:step<2?"#6366F1":"#10B981",marginBottom:8}}>{step<2?"📍 RETRAIT":"🏠 LIVRAISON"}</div>
        {step<2?<>
          <div style={{fontSize:15,fontWeight:700,marginBottom:2}}>{dl.pickup}</div>
          <div style={{fontSize:13,color:"#908C82"}}>{dl.vendor.name} · {dl.ref}</div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drChatVendor",dl)}>💬 Commerce</button>
            <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#10B981",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>alert("📞 "+dl.vendor.name)}>📞</button>
          </div>
        </>:<>
          <div style={{fontSize:15,fontWeight:700,marginBottom:2}}>{dl.client.name}</div>
          <div style={{fontSize:13,color:"#908C82"}}>{dl.client.addr}</div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#10B981",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drChatClient",dl)}>💬 Client</button>
            <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#3B82F6",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("drNavigation",dl)}>🗺️</button>
            <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#10B981",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>alert("📞 "+dl.client.name)}>📞</button>
          </div>
        </>}
      </div>

      {/* Vendor contact - always visible */}
      {step>=2&&<div style={{padding:14,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:14,marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{dl.vendor.avatar}</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{dl.vendor.name}</div><div style={{fontSize:11,color:"#908C82"}}>Commerce · {dl.pickup}</div></div>
        <button style={{padding:"8px 14px",borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drChatVendor",dl)}>💬</button>
        <button style={{padding:"8px 10px",borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:14,cursor:"pointer"}} onClick={()=>alert("📞 "+dl.vendor.name)}>📞</button>
      </div>}

      {/* Order info */}
      <div style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>📦 Commande {dl.ref}</div>
        {dl.items.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",fontSize:12}}><span>{it.img}</span><span style={{flex:1}}>{it.name} x{it.qty}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #F5F4F1",marginTop:6,fontSize:13}}><span style={{color:"#908C82"}}>Total commande</span><b style={{color:"#6366F1"}}>{fmt(dl.total)}</b></div>
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:4,fontSize:12}}><span style={{color:"#908C82"}}>Votre gain</span><b style={{color:"#10B981"}}>{fmt(dl.fee+dl.tip)}{dl.tip>0?` (dont ${fmt(dl.tip)} pourboire)`:""}</b></div>
      </div>

      {/* Estimated info */}
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        {[["📏",dl.distance],["⏱️",dl.eta],["💰",fmt(dl.fee)]].map(([i,v])=><div key={i} style={{flex:1,padding:12,background:"#F5F4F1",borderRadius:12,textAlign:"center"}}><div style={{fontSize:16}}>{i}</div><div style={{fontSize:12,fontWeight:700,marginTop:2}}>{v}</div></div>)}
      </div>
    </div>

    {/* Bottom action */}
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}>
      {step<3?<button style={{width:"100%",padding:14,borderRadius:14,border:"none",background:step<2?"#6366F1":"#10B981",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setStep(step+1)}>{stepActions[step]}</button>
      :<button style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#10B981",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drConfirm",dl)}>✅ Confirmer la livraison</button>}
    </div>
  </div>);
}

/* D3 ── DELIVERY CONFIRMATION ── */

export default DrDeliveryScr;
