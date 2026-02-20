import { useState } from "react";
import { P } from "../../data";
import { fmt, disc } from "../../utils/helpers";

function VendorScr({vendor:v,go,onBack}){
  const [following,setFollowing]=useState(false);
  const [fCount,setFC]=useState(v.followers);
  const vp=P.filter(p=>p.vendor===v.name);
  const toggleFollow=()=>{setFollowing(f=>!f);setFC(c=>following?c-1:c+1)};
  return(<div className="scr">
    <div className="vp-head"><div style={{position:"absolute",top:12,left:12}}><button onClick={onBack} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",fontSize:16,cursor:"pointer"}}>←</button></div>
      <div className="vp-av">{v.avatar}</div><h2 style={{fontSize:20,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{v.name}{v.verified&&<span style={{fontSize:14}}>✓</span>}</h2><p style={{fontSize:12,opacity:.7,marginTop:3}}>📍 {v.loc}</p></div>
    <div className="vp-stats"><div className="vps r"><div className="vsi">⭐</div><b>{v.rating}</b><span>Note</span></div><div className="vps p"><div className="vsi">🛍️</div><b>{v.products}</b><span>Produits</span></div><div className="vps f"><div className="vsi">👥</div><b>{fCount}</b><span>Abonnés</span></div></div>
    <div style={{padding:"0 20px",fontSize:14,color:"#5E5B53",marginBottom:14,lineHeight:1.6}}>{v.desc}</div>
    <div className="vp-btns"><button className="vb1" style={following?{background:"#fff",color:"#6366F1",border:"1px solid #6366F1"}:{}} onClick={toggleFollow}>{following?"✓ Suivi":"+ Suivre"}</button><button className="vb2" onClick={()=>go("chatVendor",v)}>💬 Contacter</button></div>
    <div style={{padding:"0 20px",marginBottom:14}}><h3 style={{fontSize:16,fontWeight:700}}>Produits ({vp.length})</h3></div>
    <div className="pgrid">{vp.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><span className="pe">{p.img}</span>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pp">{fmt(p.price)}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating}</div></div></div>)}</div>
  </div>);
}

/* 31 ── VENDOR REGISTRATION ── */

export default VendorScr;
