import { useState } from "react";
import { VENDORS } from "../../data";
import MapView from "../../components/MapView";

function NearbyScr({go,onBack}){
  const [sel,setSel]=useState(VENDORS[0]);
  const markers=VENDORS.filter(v=>v.lat&&v.lng).map(v=>({
    lat:v.lat,lng:v.lng,
    emoji:v.logo?undefined:(v.type==="restaurant"?"🍽️":"🏪"),
    popup:`<b>${v.name}</b><br/>⭐ ${v.rating} · ${v.products} articles`,
  }));

  return(<>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Commerces proches</h2><div style={{width:38}}/></div>
    <MapView
      center={[-4.265,15.285]}
      zoom={14}
      markers={markers}
      style={{height:320}}
    >
      {/* Selected vendor popup */}
      <div style={{position:"absolute",bottom:12,left:12,right:12,zIndex:1000,background:"#fff",padding:12,borderRadius:16,boxShadow:"0 4px 20px rgba(0,0,0,.12)",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:12,overflow:"hidden",background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
          {sel.logo?<img src={sel.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:sel.avatar}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <h4 style={{fontSize:13,fontWeight:700,marginBottom:2}}>{sel.name}{sel.verified&&<span style={{color:"#6366F1",fontSize:11}}> ✓</span>}</h4>
          <p style={{fontSize:11,color:"#908C82",margin:0}}>⭐ {sel.rating} · {sel.products} {sel.type==="restaurant"?"plats":"articles"}</p>
        </div>
        <button onClick={()=>go("vendor",sel)} style={{padding:"8px 14px",borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Voir</button>
      </div>
    </MapView>
    <div className="scr" style={{padding:16}}>
      <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>{VENDORS.length} commerces à proximité</div>
      {VENDORS.map(v=><div key={v.id} className="vcard" style={{marginBottom:8}} onClick={()=>{setSel(v);go("vendor",v)}}><div className="vav" style={v.logo?{overflow:"hidden",padding:0}:{}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:v.avatar}</div><div className="vi"><h4>{v.name}{v.verified&&<span className="vf">✓</span>}</h4><div className="vloc">📍 {v.loc}{v.eta&&<span style={{marginLeft:6,color:"#10B981",fontWeight:600}}>🕐 {v.eta}</span>}</div><div className="vst">⭐ <b>{v.rating}</b> · {v.products} {v.type==="restaurant"?"plats":v.type==="service"?"services":"produits"}</div></div></div>)}
    </div>
  </>);
}

export default NearbyScr;
