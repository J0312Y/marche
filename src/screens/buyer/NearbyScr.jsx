import { useState } from "react";
import { VENDORS } from "../../data";

function NearbyScr({go,onBack}){
  const [sel,setSel]=useState(VENDORS[0]);
  const pins=[{v:VENDORS[0],top:"30%",left:"25%"},{v:VENDORS[1],top:"55%",left:"60%"},{v:VENDORS[2],top:"25%",left:"65%"},{v:VENDORS[3],top:"60%",left:"30%"}];
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Commerces proches</h2><div style={{width:38}}/></div>
    <div className="nv-map">
      <div className="map-grid"/>
      <div className="nv-me" style={{top:"45%",left:"48%"}}/>
      {pins.map((p,i)=><div key={i} className="nv-pin" style={{top:p.top,left:p.left}} onClick={()=>setSel(p.v)}>{p.v.logo?<img src={p.v.logo} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} alt=""/>:p.v.avatar}</div>)}
      <div className="nv-popup">
        <div className="npav" style={sel.logo?{overflow:"hidden",padding:0}:{}}>{sel.logo?<img src={sel.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:sel.avatar}</div>
        <div className="npi"><h4>{sel.name}{sel.verified&&<span style={{color:"#6366F1",fontSize:12}}> ✓</span>}</h4><p>📍 {sel.loc} · ⭐ {sel.rating} · {sel.products} {sel.type==="restaurant"?"plats":sel.type==="service"?"services":"articles"}</p></div>
        <button onClick={()=>go("vendor",sel)}>Voir</button>
      </div>
    </div>
    <div className="scr" style={{padding:16}}>
      <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>{VENDORS.length} commerces à proximité</div>
      {VENDORS.map(v=><div key={v.id} className="vcard" style={{marginBottom:8}} onClick={()=>go("vendor",v)}><div className="vav" style={v.logo?{overflow:"hidden",padding:0}:{}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:v.avatar}</div><div className="vi"><h4>{v.name}{v.verified&&<span className="vf">✓</span>}</h4><div className="vloc">📍 {v.loc}{v.eta&&<span style={{marginLeft:6,color:"#10B981",fontWeight:600}}>🕐 {v.eta}</span>}</div><div className="vst">⭐ <b>{v.rating}</b> · {v.products} {v.type==="restaurant"?"plats":v.type==="service"?"services":"produits"}</div></div></div>)}
    </div>
  </div>);
}

/* 10 ── PRODUCT DETAIL ── */

export default NearbyScr;
