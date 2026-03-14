import { useEffect, useState } from "react";

function SplashScr({onDone}){
  const [show,setShow]=useState(false);
  useEffect(()=>{setTimeout(()=>setShow(true),100);const t=setTimeout(onDone,2500);return()=>clearTimeout(t)},[]);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",background:"linear-gradient(135deg,#6366F1 0%,#8B5CF6 40%,#A855F7 100%)",color:"#fff",textAlign:"center",position:"relative",overflow:"hidden"}}>
      {/* Background decorations */}
      <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
      <div style={{position:"absolute",bottom:-40,left:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
      <div style={{position:"absolute",top:"30%",left:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.03)"}}/>

      {/* Logo */}
      <div style={{
        width:110,height:110,borderRadius:32,
        background:"rgba(255,255,255,.15)",backdropFilter:"blur(10px)",
        display:"flex",alignItems:"center",justifyContent:"center",
        marginBottom:24,
        boxShadow:"0 20px 60px rgba(0,0,0,.15)",
        transform:show?"scale(1)":"scale(0.5)",
        opacity:show?1:0,
        transition:"all .6s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <div style={{fontSize:52}}>🛒</div>
      </div>

      {/* Text */}
      <h1 style={{fontSize:32,fontWeight:800,letterSpacing:-1.5,marginBottom:6,opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all .6s ease .2s"}}>
        Lamuka Market
      </h1>
      <p style={{fontSize:14,opacity:show?.7:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all .6s ease .35s",letterSpacing:.3}}>
        Le Marketplace du Congo 🇨🇬
      </p>

      {/* Loader */}
      <div style={{marginTop:48,width:36,height:36,border:"3px solid rgba(255,255,255,.2)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 1s linear infinite",opacity:show?1:0,transition:"opacity .6s ease .5s"}}/>
    </div>
  );
}

export default SplashScr;
