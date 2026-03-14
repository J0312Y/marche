import { useState } from "react";

function DrSettingsScr({onBack,go}){
  const [pushN,setPushN]=useState(true);const [sound,setSound]=useState(true);const [autoAccept,setAutoAccept]=useState(false);const [lang,setLang]=useState("fr");
  return(<div className="scr" style={{paddingBottom:80}}><div className="appbar"><button onClick={onBack}>←</button><h2>Paramètres</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 16px"}}>
      <div className="setting-group"><div className="setting-label">Général</div>
        <div className="setting-item"><span className="si-i">🌐</span><span className="si-t">Langue</span><select value={lang} onChange={e=>setLang(e.target.value)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid #E8E6E1",fontSize:12,fontFamily:"inherit",background:"#fff"}}><option value="fr">Français</option><option value="en">English</option><option value="ln">Lingala</option></select></div>
      </div>
      <div className="setting-group"><div className="setting-label">Notifications</div>
        <div className="setting-item"><span className="si-i">🔔</span><span className="si-t">Notifications push</span><div className={`toggle ${pushN?"on":""}`} onClick={()=>setPushN(!pushN)}/></div>
        <div className="setting-item"><span className="si-i">🔊</span><span className="si-t">Son nouvelles commandes</span><div className={`toggle ${sound?"on":""}`} onClick={()=>setSound(!sound)}/></div>
      </div>
      <div className="setting-group"><div className="setting-label">Livraison</div>
        <div className="setting-item"><span className="si-i">⚡</span><span className="si-t">Acceptation automatique</span><div className={`toggle ${autoAccept?"on":""}`} onClick={()=>setAutoAccept(!autoAccept)}/></div>
        <div className="info-box yellow" style={{margin:"8px 0"}}><span>💡</span><span>Si activé, les livraisons proches seront acceptées automatiquement.</span></div>
      </div>
      <div className="setting-group"><div className="setting-label">Sécurité</div>
        <div className="setting-item" onClick={()=>go("password")} style={{cursor:"pointer"}}><span className="si-i">🔒</span><span className="si-t">Changer mot de passe</span><span className="mi-c">›</span></div>
        <div className="setting-item"><span className="si-i">🆔</span><span className="si-t">Vérification d'identité</span><span style={{padding:"3px 8px",borderRadius:6,background:"rgba(16,185,129,0.1)",color:"#10B981",fontSize:11,fontWeight:600}}>Vérifié</span></div>
      </div>
      <div className="setting-group"><div className="setting-label">Légal</div>
        <div className="setting-item" onClick={()=>go("terms")} style={{cursor:"pointer"}}><span className="si-i">📋</span><span className="si-t">Conditions d'utilisation</span><span className="mi-c">›</span></div>
        <div className="setting-item" onClick={()=>go("privacy")} style={{cursor:"pointer"}}><span className="si-i">🔐</span><span className="si-t">Politique de confidentialité</span><span className="mi-c">›</span></div>
      </div>
    </div>
  </div>);
}

/* D15 ── DRIVER HELP ── */

export default DrSettingsScr;
