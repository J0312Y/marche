import { setLanguage } from "../../utils/i18n";
import { useApp } from "../../context/AppContext";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";

function SettingsScr({onBack,go}){
  const { darkMode, toggleDark } = useApp();
  return(<div className="scr" style={{paddingBottom:20}}><div className="appbar"><button onClick={onBack}>←</button><h2>Paramètres</h2><div style={{width:38}}/></div>
    <div className="setting-group"><h4>Général</h4>
      <div className="setting-item" onClick={()=>go("language")} style={{cursor:"pointer"}}><span className="si-i"><Icon name="globe" size={18}/></span><span className="si-t">Langue</span><span className="si-v">Français</span><span style={{color:"var(--muted)"}}>›</span></div>
      <div className="setting-item"><span className="si-i"><Icon name="moon" size={18}/></span><span className="si-t">Mode sombre</span><div className={`toggle ${darkMode?"on":""}`} onClick={()=>{toggleDark();toast.success(darkMode?"Mode clair activé ":"Mode sombre activé")}}/></div>
    </div>
    <div className="setting-group"><h4>Légal</h4>
      <div className="setting-item" onClick={()=>go("terms")} style={{cursor:"pointer"}}><span className="si-i"><Icon name="document" size={18}/></span><span className="si-t">Conditions générales</span><span style={{color:"var(--muted)"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("privacy")} style={{cursor:"pointer"}}><span className="si-i"><Icon name="key" size={18}/></span><span className="si-t">Politique de confidentialité</span><span style={{color:"var(--muted)"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("help")} style={{cursor:"pointer"}}><span className="si-i"><Icon name="help" size={18}/></span><span className="si-t">Centre d'aide</span><span style={{color:"var(--muted)"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("about")} style={{cursor:"pointer"}}><span className="si-i"><Icon name="info" size={18}/></span><span className="si-t">À propos</span><span style={{color:"var(--muted)"}}>›</span></div>
    </div>
  </div>);
}

export default SettingsScr;
