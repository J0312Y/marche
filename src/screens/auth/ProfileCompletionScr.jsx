import { useState } from "react";

function ProfileCompletionScr({onDone,provider}){
  const [step,setStep]=useState(0);
  return(
    <div className="auth" style={{justifyContent:"flex-start",paddingTop:40}}>
      {provider&&<div style={{textAlign:"center",marginBottom:16}}>
        <div style={{display:"inline-flex",padding:"6px 16px",borderRadius:10,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.15)",fontSize:12,color:"#10B981",fontWeight:600}}>✅ Connecté via {provider==="google"?"Google":provider==="apple"?"Apple":"Facebook"}</div>
      </div>}
      <h2>Complétez votre profil</h2>
      <div className="sub" style={{marginBottom:20}}>Pour vous offrir la meilleure expérience</div>

      {step===0&&<>
        <div className="field"><label>Prénom</label><input placeholder="Joeldy"/></div>
        <div className="field"><label>Nom de famille</label><input placeholder="Tsina"/></div>
        {provider&&<div className="field"><label>Numéro de téléphone</label>
          <div style={{display:"flex",gap:8}}><div style={{padding:"10px 12px",borderRadius:12,border:"1px solid #E8E6E1",background:"#F5F4F1",fontSize:13,fontWeight:600,flexShrink:0}}>🇨🇬 +242</div><input placeholder="06X XXX XXX" type="tel" style={{flex:1}}/></div>
        </div>}
        <button className="btn-primary" onClick={()=>setStep(1)}>Continuer</button>
      </>}

      {step===1&&<>
        <div className="field"><label>Ville</label>
          <select defaultValue="brazzaville" style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1px solid #E8E6E1",fontSize:14,fontFamily:"inherit",color:"#191815",background:"#fff"}}>
            <option value="brazzaville">Brazzaville</option>
            <option value="pointe-noire">Pointe-Noire</option>
            <option value="dolisie">Dolisie</option>
            <option value="nkayi">Nkayi</option>
            <option value="oyo">Oyo</option>
            <option value="ouesso">Ouesso</option>
          </select>
        </div>
        <div className="field"><label>Quartier</label><input placeholder="Ex: Bacongo, Poto-Poto..."/></div>
        <div className="field"><label>Adresse (optionnel)</label><input placeholder="Rue, N°..."/></div>
        <button className="btn-primary" onClick={onDone}>🚀 Commencer</button>
        <button className="btn-outline" style={{marginTop:8}} onClick={onDone}>Passer pour l'instant</button>
      </>}

      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:20}}>{[0,1].map(i=><div key={i} style={{width:step===i?24:8,height:8,borderRadius:4,background:step>=i?"#6366F1":"#E8E6E1",transition:"all .3s"}}/>)}</div>
    </div>
  );
}

/* 5 ── HOME ── */

export default ProfileCompletionScr;
