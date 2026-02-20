import { useState, useEffect } from "react";

function OTPScr({onDone}){
  const [timer,setTimer]=useState(45);
  useEffect(()=>{const t=setInterval(()=>setTimer(p=>p>0?p-1:0),1000);return()=>clearInterval(t)},[]);
  return(
    <div className="auth">
      <h2>Vérification OTP</h2>
      <div className="sub">Entrez le code envoyé au +242 064 XXX XXX</div>
      <div className="otp-inputs">
        {[1,2,3,4].map(i=><input key={i} className="otp-box" maxLength={1} defaultValue={i<=2?String(i+2):""}/>)}
      </div>
      <div className="otp-timer">{timer>0?<>Renvoyer le code dans <b>00:{String(timer).padStart(2,"0")}</b></>:<b style={{color:"#6366F1",cursor:"pointer"}}>Renvoyer le code</b>}</div>
      <button className="btn-primary" onClick={onDone}>Vérifier</button>
    </div>
  );
}

/* 4b ── PROFILE COMPLETION (after OTP or social) ── */

export default OTPScr;
