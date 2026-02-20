import { useState } from "react";

function CurrencyScr({onBack}){
  const [cur,setCur]=useState("XAF");
  const curs=[["XAF","🇨🇬","Franc CFA (FCFA)"],["USD","🇺🇸","Dollar US ($)"],["EUR","🇪🇺","Euro (€)"]];
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Devise</h2><div style={{width:38}}/></div>
    {curs.map(([k,f,n])=><div key={k} className="setting-item" style={{cursor:"pointer",border:cur===k?"2px solid #6366F1":"1px solid #E8E6E1"}} onClick={()=>setCur(k)}><span style={{fontSize:22}}>{f}</span><span className="si-t">{n}</span>{cur===k&&<span style={{color:"#6366F1",fontWeight:700}}>✓</span>}</div>)}
    <div className="info-box yellow" style={{marginTop:14}}><span>💡</span><span>Les prix seront convertis automatiquement. Taux de référence : BEAC.</span></div>
    <button className="btn-primary" style={{marginTop:14}} onClick={onBack}>Enregistrer</button>
  </div>);
}

/* ── PASSWORD ── */

export default CurrencyScr;
