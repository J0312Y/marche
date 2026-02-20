import { useState } from "react";

function LanguageScr({onBack}){
  const [lang,setLang]=useState("fr");
  const langs=[["fr","🇫🇷","Français"],["en","🇬🇧","English"],["ln","🇨🇬","Lingala"],["kg","🇨🇬","Kikongo"]];
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Langue</h2><div style={{width:38}}/></div>
    {langs.map(([k,f,n])=><div key={k} className="setting-item" style={{cursor:"pointer",border:lang===k?"2px solid #6366F1":"1px solid #E8E6E1"}} onClick={()=>setLang(k)}><span style={{fontSize:22}}>{f}</span><span className="si-t">{n}</span>{lang===k&&<span style={{color:"#6366F1",fontWeight:700}}>✓</span>}</div>)}
    <button className="btn-primary" style={{marginTop:14}} onClick={onBack}>Enregistrer</button>
  </div>);
}

/* ── CURRENCY ── */

export default LanguageScr;
