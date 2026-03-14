import { useState, useEffect, useRef, useCallback } from "react";

const SLIDES = [
  {
    photo: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=1200&fit=crop",
    icon: "🛍️",
    title: "Tout le Congo en une app",
    desc: "Restaurants, boutiques, pharmacies, pâtisseries, supermarchés et services — commandez et faites-vous livrer à Brazzaville et Pointe-Noire.",
  },
  {
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1200&fit=crop",
    icon: "🍽️",
    title: "Commandez, achetez, réservez",
    desc: "Des milliers de commerces vérifiés : restaurants, boutiques de mode, boulangeries, pressing et plus encore.",
  },
  {
    photo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1200&fit=crop",
    icon: "💳",
    title: "Paiement Mobile Money",
    desc: "Payez facilement avec Airtel Money ou MTN MoMo. Sécurisé et instantané via Kolo Pay.",
  },
];

const SLIDE_DURATION = 4000;
const TICK = 50;

function OnboardingScr({onDone}){
  const [s,setS]=useState(0);
  const [progress,setProgress]=useState(0);
  const [paused,setPaused]=useState(false);
  const [animating,setAnimating]=useState(false);
  const [imgLoaded,setImgLoaded]=useState({});
  const timerRef=useRef(null);
  const touchStartX=useRef(0);

  useEffect(()=>{
    SLIDES.forEach((slide,i)=>{
      const img=new Image();
      img.onload=()=>setImgLoaded(p=>({...p,[i]:true}));
      img.src=slide.photo;
    });
  },[]);

  // Auto-advance — stops at last slide
  useEffect(()=>{
    if(paused||animating||s>=2) return; // Don't auto-advance on last slide
    setProgress(0);
    let elapsed=0;
    timerRef.current=setInterval(()=>{
      elapsed+=TICK;
      const pct=Math.min((elapsed/SLIDE_DURATION)*100,100);
      setProgress(pct);
      if(elapsed>=SLIDE_DURATION){
        clearInterval(timerRef.current);
        goToSlide(s+1);
      }
    },TICK);
    return()=>clearInterval(timerRef.current);
  },[s,paused,animating]);

  // On last slide, fill progress bar fully
  useEffect(()=>{
    if(s===2) setProgress(100);
  },[s]);

  const goToSlide=useCallback((idx)=>{
    if(animating||idx===s||idx<0||idx>2)return;
    clearInterval(timerRef.current);
    setAnimating(true);
    setTimeout(()=>{
      setS(idx);
      setProgress(0);
      setAnimating(false);
    },250);
  },[s,animating]);

  // Touch/swipe
  const onTouchStart=(e)=>{touchStartX.current=e.touches[0].clientX;setPaused(true)};
  const onTouchEnd=(e)=>{
    const diff=touchStartX.current-e.changedTouches[0].clientX;
    setPaused(false);
    if(Math.abs(diff)>50){
      if(diff>0&&s<2) goToSlide(s+1);
      else if(diff<0&&s>0) goToSlide(s-1);
    }
  };

  const onPointerDown=()=>setPaused(true);
  const onPointerUp=()=>setPaused(false);

  const slide=SLIDES[s];
  const remaining=s<2?Math.ceil(((100-progress)/100)*SLIDE_DURATION/1000):0;

  return(
    <div style={{position:"relative",width:"100%",height:"100%",overflow:"hidden",background:"#000"}}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      onPointerDown={onPointerDown} onPointerUp={onPointerUp}>

      {/* Fullscreen image */}
      <div style={{position:"absolute",inset:0,background:"#111",transition:"opacity .4s"}}>
        {/* Fallback color */}
        <div style={{position:"absolute",inset:0,background:s===0?"#4F46E5":s===1?"#047857":"#B45309"}}/>
        {/* Photo */}
        <div style={{
          position:"absolute",inset:0,
          backgroundImage:`url(${slide.photo})`,
          backgroundSize:"cover",backgroundPosition:"center",
          opacity:animating?0:(imgLoaded[s]?1:0),
          transition:"opacity .4s ease",
        }}/>
        {/* Dark overlay gradient — stronger at bottom for text readability */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.85) 100%)"}}/>
      </div>

      {/* Progress bars */}
      <div style={{position:"absolute",top:0,left:0,right:0,zIndex:10,display:"flex",gap:4,padding:"14px 16px"}}>
        {SLIDES.map((_,i)=>(
          <div key={i} style={{flex:1,height:3,borderRadius:2,background:"rgba(255,255,255,.25)",overflow:"hidden"}}>
            <div style={{
              height:"100%",borderRadius:2,background:"#fff",
              width:i<s?"100%":i===s?`${progress}%`:"0%",
              transition:i===s?"none":"width .3s ease",
            }}/>
          </div>
        ))}
      </div>

      {/* Top bar: counter + skip */}
      <div style={{position:"absolute",top:28,left:16,right:16,zIndex:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:12,color:"rgba(255,255,255,.6)",fontWeight:600}}>{s+1}/3</span>
        {s<2&&<button onClick={onDone} style={{
          padding:"6px 16px",borderRadius:20,
          background:"rgba(255,255,255,.15)",backdropFilter:"blur(8px)",
          border:"1px solid rgba(255,255,255,.2)",
          color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",
        }}>Passer</button>}
      </div>

      {/* Tap zones */}
      <div onClick={()=>s>0&&goToSlide(s-1)} style={{position:"absolute",left:0,top:50,bottom:200,width:"25%",zIndex:3,cursor:s>0?"pointer":"default"}}/>
      <div onClick={()=>s<2?goToSlide(s+1):null} style={{position:"absolute",right:0,top:50,bottom:200,width:"25%",zIndex:3,cursor:s<2?"pointer":"default"}}/>

      {/* Pause indicator */}
      {paused&&s<2&&<div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",zIndex:5,opacity:.5}}>
        <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
          <div style={{width:12,height:18,display:"flex",gap:3}}>
            <div style={{width:4,borderRadius:2,background:"#fff",height:"100%"}}/>
            <div style={{width:4,borderRadius:2,background:"#fff",height:"100%"}}/>
          </div>
        </div>
      </div>}

      {/* Content overlay — at bottom, on top of image */}
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,zIndex:6,
        padding:"0 24px 34px",
        opacity:animating?0:1,transform:animating?"translateY(15px)":"translateY(0)",
        transition:"all .3s ease",
      }}>
        {/* Icon */}
        <div style={{
          width:56,height:56,borderRadius:18,
          background:"rgba(255,255,255,.15)",backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,.2)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:28,marginBottom:16,
          boxShadow:"0 8px 32px rgba(0,0,0,.2)",
        }}>
          {slide.icon}
        </div>

        {/* Title */}
        <h2 style={{fontSize:26,fontWeight:800,color:"#fff",letterSpacing:-.5,lineHeight:1.15,marginBottom:10,textShadow:"0 2px 8px rgba(0,0,0,.3)"}}>
          {slide.title}
        </h2>

        {/* Description */}
        <p style={{fontSize:14,color:"rgba(255,255,255,.8)",lineHeight:1.7,marginBottom:24,maxWidth:340}}>
          {slide.desc}
        </p>

        {/* Dots */}
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>goToSlide(i)} style={{
              width:i===s?24:8,height:8,borderRadius:4,
              background:i===s?"#fff":"rgba(255,255,255,.3)",
              cursor:"pointer",transition:"all .3s ease",
            }}/>
          ))}
        </div>

        {/* Button */}
        {s<2?(
          <button onClick={()=>goToSlide(s+1)} style={{
            width:"100%",padding:"16px 0",borderRadius:16,border:"none",
            background:"rgba(255,255,255,.15)",backdropFilter:"blur(12px)",
            border:"1px solid rgba(255,255,255,.25)",
            color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          }}>
            Suivant <span style={{fontSize:12,opacity:.6}}>({remaining}s)</span>
          </button>
        ):(
          <div>
            <button onClick={onDone} style={{
              width:"100%",padding:"16px 0",borderRadius:16,border:"none",
              background:"#fff",
              color:"#191815",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              boxShadow:"0 4px 20px rgba(0,0,0,.2)",
              marginBottom:12,
            }}>
              🚀 Commencer
            </button>
            <div style={{textAlign:"center",fontSize:13,color:"rgba(255,255,255,.6)"}}>
              Déjà un compte ? <span style={{color:"#fff",fontWeight:600,cursor:"pointer",textDecoration:"underline"}} onClick={onDone}>Se connecter</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingScr;
