import { useState, useEffect } from "react";

const SLIDES = [
  {
    photo: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=600&fit=crop",
    icon: "🛍️",
    title: "Tout le Congo en une app",
    desc: "Restaurants, boutiques, pharmacies, pâtisseries, supermarchés et services — commandez et faites-vous livrer à Brazzaville et Pointe-Noire.",
    gradient: "linear-gradient(135deg,#6366F1,#A855F7)",
  },
  {
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop",
    icon: "🍽️",
    title: "Commandez, achetez, réservez",
    desc: "Des milliers de commerces vérifiés : restaurants, boutiques de mode, boulangeries, pressing et plus encore.",
    gradient: "linear-gradient(135deg,#10B981,#059669)",
  },
  {
    photo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop",
    icon: "💳",
    title: "Paiement Mobile Money",
    desc: "Payez facilement avec Airtel Money, MTN MoMo ou Orange Money. Sécurisé et instantané via Kolo Pay.",
    gradient: "linear-gradient(135deg,#F59E0B,#D97706)",
  },
];

function OnboardingScr({onDone}){
  const [s,setS]=useState(0);
  const [animating,setAnimating]=useState(false);
  const [imgLoaded,setImgLoaded]=useState({});

  // Preload images
  useEffect(()=>{
    SLIDES.forEach((slide,i)=>{
      const img=new Image();
      img.onload=()=>setImgLoaded(p=>({...p,[i]:true}));
      img.src=slide.photo;
    });
  },[]);

  const goNext=()=>{
    if(animating)return;
    setAnimating(true);
    setTimeout(()=>{
      if(s<2)setS(s+1); else onDone();
      setAnimating(false);
    },300);
  };

  const slide=SLIDES[s];

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#FAF9F6",overflow:"hidden"}}>
      {/* Image section */}
      <div style={{flex:1,position:"relative",overflow:"hidden",minHeight:0}}>
        {/* Background gradient */}
        <div style={{position:"absolute",inset:0,background:slide.gradient,transition:"background .5s ease"}}/>

        {/* Real photo */}
        <div style={{
          position:"absolute",inset:0,
          backgroundImage:`url(${slide.photo})`,
          backgroundSize:"cover",backgroundPosition:"center",
          opacity:imgLoaded[s]?1:0,
          transition:"opacity .5s ease",
        }}/>

        {/* Overlay gradient */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 50%,rgba(0,0,0,0.5) 100%)"}}/>

        {/* Decorative circles */}
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
        <div style={{position:"absolute",bottom:40,left:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>

        {/* Icon badge */}
        <div style={{
          position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",
          width:64,height:64,borderRadius:20,
          background:"rgba(255,255,255,.9)",backdropFilter:"blur(12px)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:32,boxShadow:"0 8px 32px rgba(0,0,0,.15)",
          zIndex:2,
          opacity:animating?0:1,
          transition:"opacity .2s, transform .3s",
        }}>
          {slide.icon}
        </div>

        {/* Skip button */}
        {s<2&&<button onClick={onDone} style={{
          position:"absolute",top:16,right:16,zIndex:5,
          padding:"6px 16px",borderRadius:20,
          background:"rgba(255,255,255,.2)",backdropFilter:"blur(8px)",
          border:"1px solid rgba(255,255,255,.3)",
          color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",
        }}>Passer</button>}

        {/* Slide counter */}
        <div style={{position:"absolute",top:16,left:16,zIndex:5,fontSize:12,color:"rgba(255,255,255,.6)",fontWeight:600}}>
          {s+1}/3
        </div>
      </div>

      {/* Content section */}
      <div style={{
        padding:"28px 24px 30px",textAlign:"center",
        opacity:animating?0:1,transform:animating?"translateY(10px)":"translateY(0)",
        transition:"all .3s ease",
      }}>
        <h2 style={{fontSize:24,fontWeight:800,letterSpacing:-.5,color:"#191815",marginBottom:10,lineHeight:1.2}}>
          {slide.title}
        </h2>
        <p style={{fontSize:14,color:"#5E5B53",lineHeight:1.7,marginBottom:24,maxWidth:320,marginLeft:"auto",marginRight:"auto"}}>
          {slide.desc}
        </p>

        {/* Dots */}
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>
          {SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>setS(i)} style={{
              width:i===s?24:8,height:8,borderRadius:4,
              background:i===s?"#6366F1":"#E8E6E1",
              cursor:"pointer",transition:"all .3s ease",
            }}/>
          ))}
        </div>

        {/* Main button */}
        <button onClick={goNext} style={{
          width:"100%",padding:"16px 0",borderRadius:16,border:"none",
          background:"linear-gradient(135deg,#6366F1,#8B5CF6)",
          color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
          boxShadow:"0 4px 20px rgba(99,102,241,.3)",
          transition:"transform .15s",
        }}>
          {s<2?"Suivant →":"🚀 Commencer"}
        </button>

        {/* Login link on last slide */}
        {s===2&&<div style={{marginTop:14,fontSize:13,color:"#908C82"}}>
          Déjà un compte ? <span style={{color:"#6366F1",fontWeight:600,cursor:"pointer"}} onClick={onDone}>Se connecter</span>
        </div>}
      </div>
    </div>
  );
}

export default OnboardingScr;
