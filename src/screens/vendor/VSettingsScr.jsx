import { setLanguage } from "../../utils/i18n";
import { useState } from "react";
import Select from "../../components/Select";
import { useApp } from "../../context/AppContext";
import { VENDOR_LOGO_DEFAULT } from "../../data/images";
import toast from "../../utils/toast";

function VSettingsScr({onBack,go}){
  const { darkMode, toggleDark } = useApp();
  const [pushOrder,setPushOrder]=useState(true);
  const [pushReview,setPushReview]=useState(true);
  const [pushStock,setPushStock]=useState(true);
  const [pushPromo,setPushPromo]=useState(false);
  const [emailReport,setEmailReport]=useState(true);
  const [sound,setSound]=useState(true);
  const {setLang:ctxSetLang,lang:currentLang}=useApp();
  const [lang,setLang]=useState(currentLang||"fr");
  return(<div className="scr" style={{paddingBottom:20}}><div className="appbar"><button onClick={onBack}>←</button><h2>Paramètres boutique</h2><div style={{width:38}}/></div>
    <div className="vs-header"><div className="vs-logo" style={{overflow:"hidden",padding:0}}><img src={VENDOR_LOGO_DEFAULT} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div><h3 style={{fontSize:18,fontWeight:700}}>Mon Commerce</h3><p style={{fontSize:12,color:"var(--muted)"}}>Mode & Accessoires africains</p><div className="edit-logo" onClick={()=>document.getElementById("vset-logo")?.click()}>📸 Changer le logo</div><input id="vset-logo" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){toast.success("Logo mis à jour 📸")}}}/></div>
    <div style={{padding:"0 16px"}}>
      <div className="field"><label>Nom de l'établissement</label><input defaultValue="Mon Commerce"/></div>
      <div className="field"><label>Description</label><textarea rows={3} defaultValue="Vêtements et accessoires africains modernes. Wax, Bogolan, Cuir artisanal."/></div>
      <div className="field-row"><div className="field"><label>Téléphone</label><input defaultValue="+242 064 663 469"/></div><div className="field"><label>Email</label><input defaultValue="joeldytsina94@gmail.com"/></div></div>
      <div className="field"><label>Adresse physique</label><input defaultValue="Marché Total, Stand 42, Brazzaville"/></div>
      <div className="field-row"><div className="field"><label>Horaires</label><input defaultValue="8h - 18h"/></div><div className="field"><label>Jours</label><input defaultValue="Lun - Sam"/></div></div>
      <div className="field"><label>Zones de livraison</label><input defaultValue="Brazzaville, Pointe-Noire"/></div>
      <div className="field"><label>Politique de retour</label><textarea rows={2} defaultValue="Retour accepté sous 7 jours. Produit en état d'origine."/></div>
      <div style={{fontSize:14,fontWeight:700,margin:"10px 0"}}>Réseaux sociaux</div>
      <div className="field"><label>Instagram</label><input defaultValue="@joeldyofficiel"/></div>
      <div className="field"><label>Facebook</label><input placeholder="URL de votre page"/></div>
    </div>
    <div>
      <div className="setting-group"><div className="setting-label">Général</div>
        <div className="setting-item"><span className="si-i">🌐</span><span className="si-t">Langue</span><Select value={lang} onChange={v=>{setLang(v);setLanguage(v);ctxSetLang(v)}} options={[{value:"fr",label:"🇫🇷 Français"},{value:"en",label:"🇬🇧 English"},{value:"ln",label:"🇨🇬 Lingala"}]}/></div>
      </div>
      <div className="setting-group"><div className="setting-label">Notifications push</div>
        <div className="setting-item"><span className="si-i">📦</span><span className="si-t">Nouvelles commandes</span><div className={`toggle ${pushOrder?"on":""}`} onClick={()=>setPushOrder(!pushOrder)}/></div>
        <div className="setting-item"><span className="si-i">⭐</span><span className="si-t">Avis clients</span><div className={`toggle ${pushReview?"on":""}`} onClick={()=>setPushReview(!pushReview)}/></div>
        <div className="setting-item"><span className="si-i">⚠️</span><span className="si-t">Alertes stock faible</span><div className={`toggle ${pushStock?"on":""}`} onClick={()=>setPushStock(!pushStock)}/></div>
        <div className="setting-item"><span className="si-i">🏷️</span><span className="si-t">Fin de promotions</span><div className={`toggle ${pushPromo?"on":""}`} onClick={()=>setPushPromo(!pushPromo)}/></div>
        <div className="setting-item"><span className="si-i">🔊</span><span className="si-t">Son de notification</span><div className={`toggle ${sound?"on":""}`} onClick={()=>setSound(!sound)}/></div>
      </div>
      <div className="setting-group"><div className="setting-label">Email</div>
        <div className="setting-item"><span className="si-i">📧</span><span className="si-t">Rapport hebdomadaire</span><div className={`toggle ${emailReport?"on":""}`} onClick={()=>setEmailReport(!emailReport)}/></div>
      </div>
      <div className="setting-group"><div className="setting-label">Sécurité</div>
        <div className="setting-item" onClick={()=>go("password")} style={{cursor:"pointer"}}><span className="si-i">🔒</span><span className="si-t">Changer mot de passe</span><span className="mi-c">›</span></div>
      </div>
      <div className="setting-group"><div className="setting-label">Légal</div>
        <div className="setting-item" onClick={()=>go("terms")} style={{cursor:"pointer"}}><span className="si-i">📄</span><span className="si-t">Conditions générales</span><span className="mi-c">›</span></div>
        <div className="setting-item" onClick={()=>go("privacy")} style={{cursor:"pointer"}}><span className="si-i">🔐</span><span className="si-t">Politique de confidentialité</span><span className="mi-c">›</span></div>
      </div>
    </div>
    <div style={{padding:"0 20px 20px"}}><button className="btn-primary" onClick={()=>toast.success("Paramètres sauvegardés ✅")}>💾 Enregistrer</button></div>
  </div>);
}

/* V15 ── VENDOR REPORTS ── */

export default VSettingsScr;
