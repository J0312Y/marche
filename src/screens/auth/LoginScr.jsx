import { useState } from "react";

function LoginScr({onDone,onSocial}){
  const [legal,setLegal]=useState(null);
  const [socialLoading,setSocialLoading]=useState(null);
  const doSocial=(provider)=>{setSocialLoading(provider);setTimeout(()=>{setSocialLoading(null);onSocial(provider)},1500)};
  if(legal)return legal==="terms"?<TermsScr onBack={()=>setLegal(null)}/>:<PrivacyScr onBack={()=>setLegal(null)}/>;
  return(
    <div className="auth">
      <div style={{textAlign:"center",margin:"20px 0 30px"}}><span style={{fontSize:48}}>🛒</span></div>
      <h2>Bienvenue !</h2>
      <div className="sub">Connectez-vous pour accéder au marketplace</div>
      <div className="phone-input">
        <div className="prefix">🇨🇬 +242</div>
        <input placeholder="06X XXX XXX" type="tel"/>
      </div>
      <button className="btn-primary" onClick={onDone}>Continuer</button>
      <div className="divider">ou continuer avec</div>
      <div className="social-btns">
        <button className="social-btn" onClick={()=>doSocial("google")} style={socialLoading==="google"?{background:"rgba(66,133,244,0.08)",borderColor:"#4285F4"}:{}}>{socialLoading==="google"?<span style={{display:"flex",alignItems:"center",gap:6}}><span className="loader" style={{width:14,height:14,borderWidth:2}}/>Connexion...</span>:<><span style={{fontSize:16}}>🔵</span> <span>Google</span></>}</button>
        <button className="social-btn" onClick={()=>doSocial("apple")} style={socialLoading==="apple"?{background:"rgba(0,0,0,0.04)",borderColor:"#333"}:{}}>{socialLoading==="apple"?<span style={{display:"flex",alignItems:"center",gap:6}}><span className="loader" style={{width:14,height:14,borderWidth:2}}/>Connexion...</span>:<><span style={{fontSize:16}}>⚫</span> <span>Apple</span></>}</button>
        <button className="social-btn" onClick={()=>doSocial("facebook")} style={socialLoading==="facebook"?{background:"rgba(24,119,242,0.08)",borderColor:"#1877F2"}:{}}>{socialLoading==="facebook"?<span style={{display:"flex",alignItems:"center",gap:6}}><span className="loader" style={{width:14,height:14,borderWidth:2}}/>Connexion...</span>:<><span style={{fontSize:16}}>🔷</span> <span>Facebook</span></>}</button>
      </div>
      <p style={{textAlign:"center",fontSize:12,color:"#908C82",marginTop:24}}>En continuant, vous acceptez nos <b style={{color:"#6366F1",cursor:"pointer"}} onClick={()=>setLegal("terms")}>Conditions</b> et <b style={{color:"#6366F1",cursor:"pointer"}} onClick={()=>setLegal("privacy")}>Politique de confidentialité</b></p>
    </div>
  );
}

/* 4 ── OTP ── */

export default LoginScr;
