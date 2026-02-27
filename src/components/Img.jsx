import { useState, useRef, useEffect } from "react";

/**
 * Professional image component like Amazon/Alibaba
 * - Lazy loading with IntersectionObserver
 * - Shimmer placeholder while loading
 * - Smooth fade-in on load
 * - Fallback emoji on error
 * - object-fit: cover/contain support
 * - White background for product shots
 */
function Img({ src, alt="", emoji, fit="cover", bg="#F5F4F1", style={}, className="", onClick }){
  const [status, setStatus] = useState("idle"); // idle | loading | loaded | error
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  // Lazy load via IntersectionObserver
  useEffect(()=>{
    if(!ref.current) return;
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ setVisible(true); obs.disconnect(); }
    }, { rootMargin:"200px" });
    obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);

  // When visible, start loading
  useEffect(()=>{
    if(!visible || !src) return;
    setStatus("loading");
    const img = new Image();
    img.onload = ()=> setStatus("loaded");
    img.onerror = ()=> setStatus("error");
    img.src = src;
  },[visible, src]);

  const showEmoji = !src || status==="error" || status==="idle";

  return(
    <div
      ref={ref}
      className={`app-img ${className}`}
      onClick={onClick}
      style={{
        background: bg,
        position:"relative",
        overflow:"hidden",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        pointerEvents: onClick ? "auto" : "none",
        ...style
      }}
    >
      {/* Shimmer while loading */}
      {status==="loading"&&<div className="img-shimmer"/>}

      {/* Real image */}
      {(status==="loaded")&&<img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width:"100%",
          height:"100%",
          objectFit: fit,
          display:"block",
          animation:"imgFadeIn .3s ease"
        }}
      />}

      {/* Emoji fallback */}
      {showEmoji&&<span style={{fontSize: style.height>200?96:style.height>100?52:32, userSelect:"none"}}>{emoji||"📦"}</span>}
    </div>
  );
}

export default Img;
