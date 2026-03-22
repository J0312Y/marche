import { useState } from "react";
import toast from "../../utils/toast";

function PasswordScr({onBack}){
  const [pwCurrent,setPwCurrent]=useState("");
  const [pwNew,setPwNew]=useState("");
  const [pwConfirm,setPwConfirm]=useState("");
  const [pwErrors,setPwErrors]=useState({});
  const clrP=(k)=>setPwErrors(p=>{const n={...p};delete n[k];return n});
  const validatePw=()=>{
    const e={};
    if(!pwCurrent.trim()) e.current="Mot de passe actuel requis";
    if(!pwNew.trim()) e.newpw="Nouveau mot de passe requis";
    else if(pwNew.length<8) e.newpw="Min. 8 caractères";
    if(!pwConfirm.trim()) e.confirm="Confirmation requise";
    else if(pwNew!==pwConfirm) e.confirm="Les mots de passe ne correspondent pas";
    setPwErrors(e);
    if(Object.keys(e).length){toast.error("Corrigez les erreurs");return false}
    return true;
  };
  const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Mot de passe</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>✅</div><h3 style={{fontSize:18,fontWeight:700}}>Mot de passe modifié</h3><p style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Votre mot de passe a été mis à jour avec succès.</p><button className="btn-primary" style={{marginTop:20}} onClick={onBack}>OK</button></div>
  </div>);
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Mot de passe</h2><div style={{width:38}}/></div>
    <div className="field"><label>Mot de passe actuel <span style={{color:"#EF4444"}}>*</span></label><input type="password" value={pwCurrent} onChange={e=>{setPwCurrent(e.target.value);clrP("current")}} placeholder="••••••••"/>{pwErrors.current&&<div className="err-msg">{pwErrors.current}</div>}</div>
    <div className="field"><label>Nouveau mot de passe <span style={{color:"#EF4444"}}>*</span></label><input type="password" value={pwNew} onChange={e=>{setPwNew(e.target.value);clrP("newpw")}} placeholder="Min. 8 caractères"/>{pwErrors.newpw&&<div className="err-msg">{pwErrors.newpw}</div>}</div>
    <div className="field"><label>Confirmer <span style={{color:"#EF4444"}}>*</span></label><input type="password" value={pwConfirm} onChange={e=>{setPwConfirm(e.target.value);clrP("confirm")}} placeholder="Répéter le mot de passe"/>{pwErrors.confirm&&<div className="err-msg">{pwErrors.confirm}</div>}</div>
    <button className="btn-primary" style={{marginTop:10}} onClick={()=>{setDone(true);toast.success("Mot de passe modifié 🔒")}}>Modifier le mot de passe</button>
  </div>);
}

/* ── RECHARGE WALLET ── */

export default PasswordScr;
