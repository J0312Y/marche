import { useEffect, useState } from "react";

function SplashScr({onDone}){
  const [show,setShow]=useState(false);
  useEffect(()=>{setTimeout(()=>setShow(true),100);const t=setTimeout(onDone,2500);return()=>clearTimeout(t)},[]);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",background:"var(--bg)",textAlign:"center",position:"relative",overflow:"hidden"}}>

      {/* Logo icon */}
      <div style={{
        width:100,height:100,borderRadius:28,
        background:"linear-gradient(135deg,#F97316,#FB923C)",
        display:"flex",alignItems:"center",justifyContent:"center",
        marginBottom:24,
        boxShadow:"0 12px 40px rgba(249,115,22,.25)",
        transform:show?"scale(1)":"scale(0.5)",
        opacity:show?1:0,
        transition:"all .6s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <path d="M20 20h3l5 22h14l5-16H26" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="29" cy="48" r="3" fill="#fff"/>
          <circle cx="41" cy="48" r="3" fill="#fff"/>
        </svg>
      </div>

      {/* Brand name */}
      <h1 style={{
        fontSize:28,fontWeight:800,letterSpacing:-1,marginBottom:6,
        color:"var(--text)",
        opacity:show?1:0,transform:show?"translateY(0)":"translateY(16px)",
        transition:"all .5s ease .2s",
      }}>
        Lamuka Market
      </h1>
      <p style={{
        fontSize:13,color:"var(--muted)",
        opacity:show?1:0,transform:show?"translateY(0)":"translateY(12px)",
        transition:"all .5s ease .35s",letterSpacing:.3,
      }}>
        Le Marketplace du Congo 🇨🇬
      </p>

      {/* Loader */}
      <div style={{
        marginTop:48,width:28,height:28,
        border:"3px solid var(--border)",
        borderTopColor:"#F97316",
        borderRadius:"50%",
        animation:"spin 1s linear infinite",
        opacity:show?1:0,transition:"opacity .5s ease .5s",
      }}/>
    </div>
  );
}

export default SplashScr;
