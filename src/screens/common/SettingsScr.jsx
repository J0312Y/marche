import { useState } from "react";

function SettingsScr({onBack,go}){
  const [notif,setNotif]=useState(true);const [dark,setDark]=useState(false);const [bio,setBio]=useState(true);
  return(<div className="scr" style={{paddingBottom:80}}><div className="appbar"><button onClick={onBack}>←</button><h2>Paramètres</h2><div style={{width:38}}/></div>
    <div className="setting-group"><h4>Général</h4>
      <div className="setting-item" onClick={()=>go("language")} style={{cursor:"pointer"}}><span className="si-i">🌐</span><span className="si-t">Langue</span><span className="si-v">Français</span><span style={{color:"#908C82"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("currency")} style={{cursor:"pointer"}}><span className="si-i">💰</span><span className="si-t">Devise</span><span className="si-v">FCFA</span><span style={{color:"#908C82"}}>›</span></div>
      <div className="setting-item"><span className="si-i">🌙</span><span className="si-t">Mode sombre</span><div className={`toggle ${dark?"on":""}`} onClick={()=>setDark(!dark)}/></div>
    </div>
    <div className="setting-group"><h4>Notifications</h4>
      <div className="setting-item"><span className="si-i">🔔</span><span className="si-t">Push notifications</span><div className={`toggle ${notif?"on":""}`} onClick={()=>setNotif(!notif)}/></div>
      <div className="setting-item"><span className="si-i">📧</span><span className="si-t">Email notifications</span><div className="toggle on"/></div>
    </div>
    <div className="setting-group"><h4>Sécurité</h4>
      <div className="setting-item"><span className="si-i">🔒</span><span className="si-t">Authentification biométrique</span><div className={`toggle ${bio?"on":""}`} onClick={()=>setBio(!bio)}/></div>
      <div className="setting-item" onClick={()=>go("password")} style={{cursor:"pointer"}}><span className="si-i">🔑</span><span className="si-t">Changer le mot de passe</span><span style={{color:"#908C82"}}>›</span></div>
    </div>
    <div className="setting-group"><h4>Légal</h4>
      <div className="setting-item" onClick={()=>go("terms")} style={{cursor:"pointer"}}><span className="si-i">📄</span><span className="si-t">Conditions générales</span><span style={{color:"#908C82"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("privacy")} style={{cursor:"pointer"}}><span className="si-i">🔐</span><span className="si-t">Politique de confidentialité</span><span style={{color:"#908C82"}}>›</span></div>
    </div>
  </div>);
}

/* 28 ── HELP / FAQ ── */

export default SettingsScr;
