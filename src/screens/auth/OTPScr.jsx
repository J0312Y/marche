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
          <div style={{width:56,height:56,borderRadius:16,background:provider==="google"?"rgba(66,133,244,0.08)":provider==="apple"?"rgba(0,0,0,0.05)":"rgba(24,119,242,0.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28}}>
            {provider==="google"?"G":provider==="apple"?"":provider==="facebook"?"f":""}
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
