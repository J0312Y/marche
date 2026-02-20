import { useEffect } from "react";

function SplashScr({onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2200);return()=>clearTimeout(t)},[]);
  return <div className="splash"><div className="logo">🛒</div><h1>Lamuka Market</h1><p>Le Marketplace du Congo 🇨🇬</p><div className="loader"/></div>
}

/* 2 ── ONBOARDING ── */

export default SplashScr;
