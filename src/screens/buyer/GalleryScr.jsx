import { useState } from "react";
import Img from "../../components/Img";

function GalleryScr({product:p,onClose}){
  const imgs=p.imgs||[p.img];const [idx,setIdx]=useState(0);
  return(<div className="gallery">
    <div className="gallery-count">{idx+1}/{imgs.length}</div>
    <button className="gallery-close" onClick={onClose}>✕</button>
    {imgs.length>1&&<><button className="gallery-nav l" onClick={()=>setIdx(i=>i>0?i-1:imgs.length-1)}>‹</button><button className="gallery-nav r" onClick={()=>setIdx(i=>i<imgs.length-1?i+1:0)}>›</button></>}
    <div className="gallery-img"><Img src={p.photos?.[idx]} emoji={imgs[idx]} style={{width:"100%",height:"100%"}} fit="contain" bg="#000"/></div>
    <div className="gallery-dots">{imgs.map((_,i)=><span key={i} className={i===idx?"on":""}/>)}</div>
  </div>);
}

/* 12 ── COMPARE ── */

export default GalleryScr;
