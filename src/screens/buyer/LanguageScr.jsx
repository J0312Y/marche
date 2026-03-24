import { useState } from "react";
import { useApp } from "../../context/AppContext";
import toast from "../../utils/toast";

function LanguageScr({onBack}){
  const { setLang:ctxSetLang } = useApp();
  const [lang,setLang]=useState("fr");
  const langs=[["fr","🇫🇷","Français"],["en","🇬🇧","English"],["ln","🇨🇬","Lingala"],["kg","🇨🇬","Kikongo"]];
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Langue</h2><div style={{width:38}}/></div>
    {langs.map(([k,f,n])=><div key={k} className="setting-item" style={{cursor:"pointer",border:lang===k?"2px solid #F97316":"1px solid var(--border)"}} onClick={()=>setLang(k)}><span style={{fontSize:22}}>{f}</span><span className="si-t">{n}</span>{lang===k&&<span style={{color:"#F97316",fontWeight:700}}>✓</span>}</div>)}
    <button className="btn-primary" style={{marginTop:14}} onClick={()=>{ctxSetLang(lang);toast.success(lang==="fr"?"Langue mise à jour : Français 🇫🇷":lang==="en"?"Language updated: English 🇬🇧":lang==="ln"?"Monoko ebongwani: Lingala 🇨🇬":"Ndinga ebaluki: Kikongo 🇨🇬");onBack()}}>Enregistrer</button>
  </div>);
}

/* ── CURRENCY ── */

export default LanguageScr;
