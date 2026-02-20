import { useState } from "react";

function PasswordScr({onBack}){
  const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Mot de passe</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>✅</div><h3 style={{fontSize:18,fontWeight:700}}>Mot de passe modifié</h3><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Votre mot de passe a été mis à jour avec succès.</p><button className="btn-primary" style={{marginTop:20}} onClick={onBack}>OK</button></div>
  </div>);
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Mot de passe</h2><div style={{width:38}}/></div>
    <div className="field"><label>Mot de passe actuel</label><input type="password" placeholder="••••••••"/></div>
    <div className="field"><label>Nouveau mot de passe</label><input type="password" placeholder="Min. 8 caractères"/></div>
    <div className="field"><label>Confirmer</label><input type="password" placeholder="Répéter le mot de passe"/></div>
    <button className="btn-primary" style={{marginTop:10}} onClick={()=>setDone(true)}>Modifier le mot de passe</button>
  </div>);
}

/* ── RECHARGE WALLET ── */

export default PasswordScr;
