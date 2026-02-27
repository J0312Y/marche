import { useState, useEffect } from "react";
import { P, VENDORS } from "../../data";
import Img from "../../components/Img";
import { fmt, disc } from "../../utils/helpers";

function FlashScr({go,onBack,favs,toggleFav,isFav}){
  const [t,setT]=useState({h:2,m:14,s:37});
  useEffect(()=>{const i=setInterval(()=>setT(p=>{let s=p.s-1,m=p.m,h=p.h;if(s<0){s=59;m--}if(m<0){m=59;h--}if(h<0){h=0;m=0;s=0}return{h,m,s}}),1000);return()=>clearInterval(i)},[]);
  const promos=P.filter(p=>p.old);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Offres Flash ⚡</h2><div style={{width:38}}/></div>
    <div className="flash-banner"><div><h3>⚡ Vente Flash</h3><p>Se termine dans</p></div><div className="flash-timer"><div className="ft">{String(t.h).padStart(2,"0")}</div><div className="ft">{String(t.m).padStart(2,"0")}</div><div className="ft">{String(t.s).padStart(2,"0")}</div></div></div>
    <div className="pgrid">{promos.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/><span className="badge">-{disc(p)}%</span></div><div className="pbody"><h4>{p.name}</h4><div className="pp">{fmt(p.price)}<span className="po">{fmt(p.old)}</span></div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating}</div></div></div>)}</div>
  </div>);
}

/* 9 ── NEARBY VENDORS MAP ── */

export default FlashScr;
