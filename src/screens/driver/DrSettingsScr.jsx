import { useState } from "react";
import { setLanguage } from "../../utils/i18n";
import Select from "../../components/Select";
import { useApp } from "../../context/AppContext";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";

function DrSettingsScr({onBack,go}){
  const { darkMode, toggleDark } = useApp();
  const {setLang:ctxSetLang,lang:currentLang}=useApp();
  const [lang,setLang]=useState(currentLang||"fr");

  return(<div className="scr" style={{paddingBottom:20}}><div className="appbar"><button onClick={onBack}>←</button><h2>Paramètres</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 16px"}}>
      <div className="setting-group"><div className="setting-label">Général</div>
        <div className="setting-item"><span className="si-i"><Icon name="globe" size={18}/></span><span className="si-t">Langue</span><Select value={lang} onChange={v=>{setLang(v);setLanguage(v);ctxSetLang(v)}} options={[{value:"fr",label:"FR Français"},{value:"en",label:"GB English"},{value:"ln",label:"CG Lingala"}]}/></div>
        <div className="setting-item"><span className="si-i"><Icon name="moon" size={18}/></span><span className="si-t">Mode sombre</span><div className={`toggle ${darkMode?"on":""}`} onClick={()=>{toggleDark();toast.success(darkMode?"Mode clair ":"Mode sombre")}}/></div>
      </div>
      <div className="setting-group"><div className="setting-label">Légal</div>
        <div className="setting-item" onClick={()=>go("terms")} style={{cursor:"pointer"}}><span className="si-i"><Icon name="document" size={18}/></span><span className="si-t">Conditions d'utilisation</span><span className="mi-c">›</span></div>
        <div className="setting-item" onClick={()=>go("privacy")} style={{cursor:"pointer"}}><span className="si-i"><Icon name="key" size={18}/></span><span className="si-t">Politique de confidentialité</span><span className="mi-c">›</span></div>
      </div>
    </div>
  </div>);
}

export default DrSettingsScr;
