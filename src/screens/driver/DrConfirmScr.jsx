import { useState } from "react";
import { fmt } from "../../utils/helpers";

function DrConfirmScr({delivery:dl,go,onBack}){
  const [method,setMethod]=useState(null);
  const [code,setCode]=useState("");
  const [photoTaken,setPhotoTaken]=useState(false);
  const [signed,setSigned]=useState(false);
  const [done,setDone]=useState(false);

  if(done)return(<div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"}}>
    <div style={{textAlign:"center",padding:"40px 24px"}}>
      <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:48,animation:"splash-pop .5s ease"}}>🎉</div>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:6}}>Livraison terminée !</h2>
      <p style={{fontSize:14,color:"#5E5B53",marginBottom:4}}>{dl.ref} livré à <b>{dl.client.name}</b></p>
      <div style={{display:"flex",justifyContent:"center",gap:20,margin:"20px 0",padding:16,background:"#F5F4F1",borderRadius:16}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#10B981"}}>{fmt(dl.fee)}</div><div style={{fontSize:11,color:"#908C82"}}>Course</div></div>
        {dl.tip>0&&<div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#F59E0B"}}>{fmt(dl.tip)}</div><div style={{fontSize:11,color:"#908C82"}}>Pourboire</div></div>}
        <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#6366F1"}}>{fmt(dl.fee+dl.tip)}</div><div style={{fontSize:11,color:"#908C82"}}>Total gagné</div></div>
      </div>
      <button className="btn-primary" style={{background:"#10B981"}} onClick={onBack}>🏠 Retour au dashboard</button>
    </div>
  </div>);

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Confirmer livraison</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:48,marginBottom:8}}>📦</div>
        <h3 style={{fontSize:18,fontWeight:700}}>Livraison à {dl.client.name}</h3>
        <p style={{fontSize:13,color:"#908C82"}}>{dl.client.addr}</p>
      </div>

      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Méthode de confirmation</div>
      <div className="dr-confirm-options">
        {[["code","🔢","Code PIN"],["photo","📸","Photo"],["signature","✍️","Signature"]].map(([k,i,l])=>
          <div key={k} className={`dr-confirm-opt ${method===k?"on":""}`} onClick={()=>setMethod(k)}>
            <div className="dco-icon">{i}</div><div className="dco-label">{l}</div>
          </div>)}
      </div>

      {method==="code"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"#908C82",marginBottom:10}}>Demandez le code à 4 chiffres au client</p>
        <div className="otp-inputs">{[0,1,2,3].map(i=><input key={i} className="otp-box" maxLength={1} onChange={e=>{const v=code.split("");v[i]=e.target.value;setCode(v.join(""))}} style={{width:52,height:58,borderColor:code.length>=4?"#10B981":"#E8E6E1"}}/>)}</div>
      </div>}

      {method==="photo"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"#908C82",marginBottom:10}}>Prenez une photo du colis remis au client</p>
        {!photoTaken?<div onClick={()=>setPhotoTaken(true)} style={{height:160,background:"#F5F4F1",border:"2px dashed #E8E6E1",borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <div style={{fontSize:40,marginBottom:6}}>📷</div>
          <div style={{fontSize:13,fontWeight:600,color:"#908C82"}}>Appuyer pour prendre la photo</div>
        </div>
        :<div style={{height:160,background:"rgba(16,185,129,0.04)",border:"2px solid #10B981",borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{fontSize:40,marginBottom:6}}>✅</div>
          <div style={{fontSize:13,fontWeight:600,color:"#10B981"}}>Photo prise avec succès</div>
          <div onClick={()=>setPhotoTaken(false)} style={{position:"absolute",bottom:8,right:8,fontSize:11,color:"#EF4444",cursor:"pointer",fontWeight:600}}>🗑️ Reprendre</div>
        </div>}
      </div>}

      {method==="signature"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"#908C82",marginBottom:10}}>Le client signe sur l'écran</p>
        {!signed?<div onClick={()=>setSigned(true)} style={{height:140,background:"#fff",border:"2px dashed #E8E6E1",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <div style={{fontSize:13,color:"#908C82"}}>✍️ Appuyer ici pour signer</div>
        </div>
        :<div style={{height:140,background:"rgba(16,185,129,0.04)",border:"2px solid #10B981",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{fontFamily:"cursive",fontSize:24,color:"#191815",opacity:.6}}>Marie Koumba</div>
          <div onClick={()=>setSigned(false)} style={{position:"absolute",bottom:8,right:8,fontSize:11,color:"#EF4444",cursor:"pointer",fontWeight:600}}>🗑️ Effacer</div>
          <div style={{position:"absolute",top:8,right:8}}><span style={{padding:"3px 8px",borderRadius:6,background:"rgba(16,185,129,0.1)",color:"#10B981",fontSize:10,fontWeight:600}}>✓ Signé</span></div>
        </div>}
      </div>}

      {!method&&<div className="info-box yellow" style={{marginTop:14}}><span>💡</span><span>Choisissez une méthode de confirmation pour valider la livraison</span></div>}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}>
      <button className="btn-primary" style={{background:method?"#10B981":"#E8E6E1",color:method?"#fff":"#908C82"}} onClick={()=>method&&setDone(true)} disabled={!method}>✅ Valider la livraison</button>
    </div>
  </div>);
}

/* D4 ── GPS NAVIGATION ── */

export default DrConfirmScr;
