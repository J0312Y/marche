import { useState, useEffect } from "react";

function OTPScr({onDone, provider}){
  const [timer,setTimer]=useState(45);
  const [code,setCode]=useState(["","","","","",""]);
  const [error,setError]=useState("");
  useEffect(()=>{const t=setInterval(()=>setTimer(p=>p>0?p-1:0),1000);return()=>clearInterval(t)},[]);

  const isSocial = !!provider;
  const providerName = provider==="google"?"Google":provider==="apple"?"Apple":provider==="facebook"?"Facebook":"";
  const providerEmail = provider==="google"?"j***@gmail.com":provider==="apple"?"j***@icloud.com":"j***@facebook.com";

  const handleInput=(val,idx)=>{
    const v=val.replace(/\D/g,"").slice(0,1);
    const next=[...code];
    next[idx]=v;
    setCode(next);
    setError("");
    if(v&&idx<5){
      const el=document.querySelector(`[data-otp="${idx+1}"]`);
      el?.focus();
    }
  };

  const handleVerify=()=>{
    const full=code.join("");
    if(full.length<6){setError("Entrez les 6 chiffres du code");return}
    onDone();
  };

  return(
    <div className="auth">
      {isSocial?<>
        <div style={{textAlign:"center",marginBottom:8}}>
          <div style={{width:56,height:56,borderRadius:16,background:"var(--card)",border:"2px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28}}>
            {provider==="google"?<svg width="24" height="24" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>:provider==="apple"?<svg width="24" height="24" viewBox="0 0 24 24" fill="#000"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>:<svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
          </div>
          <h2 style={{fontSize:22}}>Vérification {providerName}</h2>
        </div>
        <div className="sub">Un code de vérification a été envoyé à votre email<br/><b style={{color:"var(--text)"}}>{providerEmail}</b></div>
      </>:<>
        <h2>Vérification OTP</h2>
        <div className="sub">Entrez le code envoyé par SMS au<br/><b style={{color:"var(--text)"}}>+242 064 XXX XXX</b></div>
      </>}

      <div style={{display:"flex",gap:8,justifyContent:"center",margin:"20px 0 8px"}}>
        {code.map((v,i)=><input key={i} data-otp={i} value={v} onChange={e=>handleInput(e.target.value,i)} onKeyDown={e=>{if(e.key==="Backspace"&&!v&&i>0){const el=document.querySelector(`[data-otp="${i-1}"]`);el?.focus()}}} style={{width:44,height:52,borderRadius:12,border:error?"2px solid #EF4444":v?"2px solid #F97316":"2px solid var(--border)",background:"var(--light)",textAlign:"center",fontSize:22,fontWeight:700,fontFamily:"inherit",color:"var(--text)",outline:"none",transition:"border .15s"}} maxLength={1} inputMode="numeric" autoComplete="one-time-code"/>)}
      </div>

      {error&&<div style={{fontSize:12,color:"#EF4444",textAlign:"center",marginBottom:8}}>{error}</div>}

      <div style={{textAlign:"center",fontSize:13,color:"var(--muted)",marginBottom:20}}>
        {timer>0?<>Renvoyer le code dans <b style={{color:"var(--text)"}}>00:{String(timer).padStart(2,"0")}</b></>
        :<b style={{color:"var(--text)",cursor:"pointer",fontWeight:700}} onClick={()=>setTimer(45)}>Renvoyer le code</b>}
      </div>

      <button className="btn-primary" onClick={handleVerify}>Vérifier</button>

      {isSocial&&<p style={{textAlign:"center",fontSize:11,color:"var(--muted)",marginTop:16}}>
        Vérifiez vos spams si vous ne trouvez pas le code.<br/>
        Le code expire dans 10 minutes.
      </p>}
    </div>
  );
}

export default OTPScr;
