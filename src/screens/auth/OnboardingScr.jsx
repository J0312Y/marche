import { useState, useEffect, useRef, useCallback } from "react";

const SLIDES = [
  {
    photo: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=1200&fit=crop",
    icon: "🛍️",
    title: "Tout le Congo en une app",
    desc: "Restaurants, boutiques, pharmacies, pâtisseries, supermarchés et services — commandez et faites-vous livrer à Brazzaville et Pointe-Noire.",
    color: "#F97316",
  },
  {
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1200&fit=crop",
    icon: "🍽️",
    title: "Commandez, achetez, réservez",
    desc: "Des milliers de commerces vérifiés : restaurants, boutiques de mode, boulangeries, pressing et plus encore.",
    color: "#F97316",
  },
  {
    photo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1200&fit=crop",
    icon: "💳",
    title: "Paiement Mobile Money",
    desc: "Payez facilement avec Airtel Money ou MTN MoMo. Sécurisé et instantané via Kolo Pay.",
    color: "#F59E0B",
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
    if(paused||animating||s>=2) return;
    setProgress(0);
    let elapsed=0;
    timerRef.current=setInterval(()=>{
      elapsed+=TICK;
      setProgress(Math.min((elapsed/SLIDE_DURATION)*100,100));
      if(elapsed>=SLIDE_DURATION){
        clearInterval(timerRef.current);
        goToSlide(s+1);
      }
    },TICK);
    return()=>clearInterval(timerRef.current);
  },[s,paused,animating]);

  useEffect(()=>{if(s===2) setProgress(100)},[s]);

  const goToSlide=useCallback((idx)=>{
    if(animating||idx===s||idx<0||idx>2)return;
    clearInterval(timerRef.current);
    setAnimating(true);
    setTimeout(()=>{setS(idx);setProgress(0);setAnimating(false)},250);
  },[s,animating]);

  const onTouchStart=(e)=>{touchStartX.current=e.touches[0].clientX;setPaused(true)};
  const onTouchEnd=(e)=>{
    const diff=touchStartX.current-e.changedTouches[0].clientX;
    setPaused(false);
    if(Math.abs(diff)>50){
      if(diff>0&&s<2) goToSlide(s+1);
      else if(diff<0&&s>0) goToSlide(s-1);
    }
  };

  const slide=SLIDES[s];
  const remaining=s<2?Math.ceil(((100-progress)/100)*SLIDE_DURATION/1000):0;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"var(--bg, #FAF9F6)"}}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* ═══ IMAGE SECTION — 60% ═══ */}
      <div style={{flex:"0 0 58%",position:"relative",overflow:"hidden",borderRadius:"0 0 28px 28px"}}>
        {/* Fallback color */}
        <div style={{position:"absolute",inset:0,background:slide.color}}/>
        {/* Photo */}
        <div style={{
          position:"absolute",inset:0,
          backgroundImage:`url(${slide.photo})`,backgroundSize:"cover",backgroundPosition:"center",
          opacity:animating?0:(imgLoaded[s]?1:0),transition:"opacity .4s ease",
        }}/>
        {/* Bottom gradient for smooth transition to white */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(transparent, var(--bg, #FAF9F6))"}}/>

        {/* Skip button */}
        {s<2&&<div style={{position:"absolute",top:14,right:14,zIndex:11}}>
          <button onClick={onDone} style={{padding:"5px 14px",borderRadius:20,background:"rgba(255,255,255,.2)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.25)",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Passer</button>
        </div>}

        {/* Tap zones */}
        <div onClick={()=>s>0&&goToSlide(s-1)} style={{position:"absolute",left:0,top:40,bottom:0,width:"25%",zIndex:3,cursor:s>0?"pointer":"default"}}/>
        <div onClick={()=>s<2?goToSlide(s+1):null} style={{position:"absolute",right:0,top:40,bottom:0,width:"25%",zIndex:3,cursor:s<2?"pointer":"default"}}/>

        {/* Pause indicator */}
        {paused&&s<2&&<div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",zIndex:5,opacity:.5}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
            <div style={{width:10,height:16,display:"flex",gap:3}}><div style={{width:3,borderRadius:2,background:"var(--card)",height:"100%"}}/><div style={{width:3,borderRadius:2,background:"var(--card)",height:"100%"}}/></div>
          </div>
        </div>}

        {/* Icon floating over the gradient */}
        <div style={{
          position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",zIndex:5,
          width:52,height:52,borderRadius:16,
          background:"var(--card, #fff)",border:"1px solid var(--border, #E8E6E1)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,
          boxShadow:"0 4px 20px rgba(0,0,0,.08)",
          opacity:animating?0:1,transition:"opacity .2s",
        }}>{slide.icon}</div>
      </div>

      {/* ═══ TEXT SECTION — 40% on white ═══ */}
      <div style={{
        flex:1,padding:"20px 24px 24px",display:"flex",flexDirection:"column",
        opacity:animating?0:1,transform:animating?"translateY(8px)":"translateY(0)",
        transition:"all .3s ease",
      }}>
        {/* Title */}
        <h2 style={{fontSize:22,fontWeight:800,letterSpacing:-.5,color:"var(--text, #191815)",marginBottom:8,lineHeight:1.2,textAlign:"center"}}>
          {slide.title}
        </h2>

        {/* Description */}
        <p style={{fontSize:13,color:"var(--sub, #5E5B53)",lineHeight:1.7,textAlign:"center",marginBottom:"auto",maxWidth:320,marginLeft:"auto",marginRight:"auto"}}>
          {slide.desc}
        </p>

        {/* Dots */}
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:16,marginTop:16}}>
          {SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>goToSlide(i)} style={{
              width:i===s?24:8,height:8,borderRadius:4,
              background:i===s?slide.color:"var(--border, #E8E6E1)",
              cursor:"pointer",transition:"all .3s ease",
            }}/>
          ))}
        </div>

        {/* Button */}
        {s<2?(
          <button onClick={()=>goToSlide(s+1)} style={{
            width:"100%",padding:"14px 0",borderRadius:14,border:"none",
            background:slide.color,color:"#fff",fontSize:15,fontWeight:700,
            cursor:"pointer",fontFamily:"inherit",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            boxShadow:`0 4px 16px ${slide.color}33`,
          }}>
            Suivant <span style={{fontSize:11,opacity:.7}}>({remaining}s)</span>
          </button>
        ):(
          <div>
            <button onClick={onDone} style={{
              width:"100%",padding:"14px 0",borderRadius:14,border:"none",
              background:"#F97316",color:"#fff",fontSize:15,fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",
              boxShadow:"0 4px 16px rgba(249,115,22,.25)",
            }}>
              🚀 Commencer
            </button>
            <div style={{textAlign:"center",marginTop:12,fontSize:12,color:"var(--muted, #908C82)"}}>
              Déjà un compte ? <span style={{color:"var(--text)",fontWeight:700,cursor:"pointer"}} onClick={onDone}>Se connecter</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingScr;
