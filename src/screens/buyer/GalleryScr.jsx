import { useState, useRef } from "react";
import Img from "../../components/Img";

function GalleryScr({product:p,onClose}){
  const photos=p.photos||[p.photo];
  const [idx,setIdx]=useState(0);
  const [zoom,setZoom]=useState(1);
  const [pos,setPos]=useState({x:0,y:0});
  const lastTap=useRef(0);
  const touchStart=useRef({x:0,y:0});

  const resetZoom=()=>{setZoom(1);setPos({x:0,y:0})};
  const next=()=>{resetZoom();setIdx(i=>i<photos.length-1?i+1:0)};
  const prev=()=>{resetZoom();setIdx(i=>i>0?i-1:photos.length-1)};

  // Double tap to zoom
  const handleTap=(e)=>{
    const now=Date.now();
    if(now-lastTap.current<300){
      // Double tap
      if(zoom>1) resetZoom();
      else setZoom(2.5);
    }
    lastTap.current=now;
  };

  // Drag when zoomed
  const handleTouchStart=(e)=>{
    if(zoom<=1)return;
    const t=e.touches[0];
    touchStart.current={x:t.clientX-pos.x,y:t.clientY-pos.y};
  };
  const handleTouchMove=(e)=>{
    if(zoom<=1)return;
    e.preventDefault();
    const t=e.touches[0];
    setPos({x:t.clientX-touchStart.current.x,y:t.clientY-touchStart.current.y});
  };

  return(<div style={{position:"fixed",inset:0,background:"#000",zIndex:200,display:"flex",flexDirection:"column"}}>
    {/* Header */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",color:"#fff",flexShrink:0}}>
      <span style={{fontSize:13,fontWeight:600}}>{idx+1} / {photos.length}</span>
      <span style={{fontSize:13,fontWeight:500,opacity:.7}}>{p.name}</span>
      <button onClick={onClose} style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
    </div>

    {/* Image area */}
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}
      onClick={handleTap} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
      {/* Nav arrows */}
      {photos.length>1&&zoom<=1&&<>
        <button onClick={(e)=>{e.stopPropagation();prev()}} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:18,cursor:"pointer",zIndex:5,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <button onClick={(e)=>{e.stopPropagation();next()}} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:18,cursor:"pointer",zIndex:5,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      </>}
      <div style={{transform:`scale(${zoom}) translate(${pos.x/zoom}px,${pos.y/zoom}px)`,transition:zoom===1?"transform .3s ease":"none",maxWidth:"100%",maxHeight:"100%"}}>
        <Img src={photos[idx]} emoji={p.img} style={{width:"100%",maxHeight:"70vh",objectFit:"contain"}} fit="contain" bg="#000"/>
      </div>
    </div>

    {/* Zoom controls */}
    <div style={{display:"flex",justifyContent:"center",gap:10,padding:"8px 0",flexShrink:0}}>
      <button onClick={()=>setZoom(z=>Math.max(1,z-0.5))} style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,.1)",border:"none",color:"#fff",fontSize:16,cursor:"pointer"}}>−</button>
      <div style={{display:"flex",alignItems:"center",fontSize:12,color:"rgba(255,255,255,.5)",fontWeight:600,minWidth:50,justifyContent:"center"}}>{Math.round(zoom*100)}%</div>
      <button onClick={()=>setZoom(z=>Math.min(5,z+0.5))} style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,.1)",border:"none",color:"#fff",fontSize:16,cursor:"pointer"}}>+</button>
      {zoom>1&&<button onClick={resetZoom} style={{padding:"0 12px",height:36,borderRadius:12,background:"rgba(255,255,255,.1)",border:"none",color:"#fff",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reset</button>}
    </div>

    {/* Dots */}
    {photos.length>1&&<div style={{display:"flex",justifyContent:"center",gap:6,paddingBottom:16,flexShrink:0}}>
      {photos.map((_,i)=><div key={i} onClick={()=>{resetZoom();setIdx(i)}} style={{width:i===idx?20:8,height:8,borderRadius:4,background:i===idx?"#fff":"rgba(255,255,255,.3)",cursor:"pointer",transition:"all .3s"}}/>)}
    </div>}

    {/* Hint */}
    <div style={{textAlign:"center",paddingBottom:12,fontSize:10,color:"rgba(255,255,255,.3)"}}>Double-tap pour zoomer · +/− pour ajuster</div>
  </div>);
}
export default GalleryScr;
