import { useState } from "react";
import { useApp } from "../../context/AppContext";
import toast from "../../utils/toast";

function SettingsScr({onBack,go}){
  const { darkMode, toggleDark } = useApp();
  const [notif,setNotif]=useState(true);const [bio,setBio]=useState(true);const [emailNotif,setEmailNotif]=useState(true);
  return(<div className="scr" style={{paddingBottom:80}}><div className="appbar"><button onClick={onBack}>←</button><h2>Paramètres</h2><div style={{width:38}}/></div>
    <div className="setting-group"><h4>Général</h4>
      <div className="setting-item" onClick={()=>go("language")} style={{cursor:"pointer"}}><span className="si-i">🌐</span><span className="si-t">Langue</span><span className="si-v">Français</span><span style={{color:"var(--muted)"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("currency")} style={{cursor:"pointer"}}><span className="si-i">💰</span><span className="si-t">Devise</span><span className="si-v">FCFA</span><span style={{color:"var(--muted)"}}>›</span></div>
      <div className="setting-item"><span className="si-i">🌙</span><span className="si-t">Mode sombre</span><div className={`toggle ${darkMode?"on":""}`} onClick={()=>{toggleDark();toast.success(darkMode?"Mode clair activé ☀️":"Mode sombre activé 🌙")}}/></div>
    </div>
    <div className="setting-group"><h4>Notifications</h4>
      <div className="setting-item"><span className="si-i">🔔</span><span className="si-t">Push notifications</span><div className={`toggle ${notif?"on":""}`} onClick={()=>{setNotif(!notif);toast.success(notif?"Notifications désactivées":"Notifications activées 🔔")}}/></div>
      <div className="setting-item"><span className="si-i">📧</span><span className="si-t">Email notifications</span><div className={`toggle ${emailNotif?"on":""}`} onClick={()=>{setEmailNotif(!emailNotif);toast.success(emailNotif?"Emails désactivés":"Emails activés 📧")}}/></div>
    </div>
    <div className="setting-group"><h4>Sécurité</h4>
      <div className="setting-item"><span className="si-i">🔒</span><span className="si-t">Authentification biométrique</span><div className={`toggle ${bio?"on":""}`} onClick={()=>{setBio(!bio);toast.success(bio?"Biométrie désactivée":"Biométrie activée 🔒")}}/></div>
      <div className="setting-item" onClick={()=>go("password")} style={{cursor:"pointer"}}><span className="si-i">🔑</span><span className="si-t">Changer le mot de passe</span><span style={{color:"var(--muted)"}}>›</span></div>
    </div>
    <div className="setting-group"><h4>Légal</h4>
      <div className="setting-item" onClick={()=>go("terms")} style={{cursor:"pointer"}}><span className="si-i">📄</span><span className="si-t">Conditions générales</span><span style={{color:"var(--muted)"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("privacy")} style={{cursor:"pointer"}}><span className="si-i">🔐</span><span className="si-t">Politique de confidentialité</span><span style={{color:"var(--muted)"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("help")} style={{cursor:"pointer"}}><span className="si-i">❓</span><span className="si-t">Centre d'aide</span><span style={{color:"var(--muted)"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("about")} style={{cursor:"pointer"}}><span className="si-i">ℹ️</span><span className="si-t">À propos</span><span style={{color:"var(--muted)"}}>›</span></div>
    </div>
  </div>);
}

export default SettingsScr;
