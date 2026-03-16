import { useState } from "react";
import { fmt } from "../../utils/helpers";
import toast from "../../utils/toast";

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
      <p style={{fontSize:14,color:"var(--sub)",marginBottom:4}}>{dl.ref} livré à <b>{dl.client.name}</b></p>
      <div style={{display:"flex",justifyContent:"center",gap:20,margin:"20px 0",padding:16,background:"var(--light)",borderRadius:16}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#10B981"}}>{fmt(dl.fee)}</div><div style={{fontSize:11,color:"var(--muted)"}}>Course</div></div>
        {dl.tip>0&&<div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#F59E0B"}}>{fmt(dl.tip)}</div><div style={{fontSize:11,color:"var(--muted)"}}>Pourboire</div></div>}
        <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#6366F1"}}>{fmt(dl.fee+dl.tip)}</div><div style={{fontSize:11,color:"var(--muted)"}}>Total gagné</div></div>
      </div>
      <button className="btn-primary" style={{background:"#10B981"}} onClick={onBack}>🏠 Retour au dashboard</button>
    </div>
  </div>);

  return(<>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Confirmer livraison</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:16}}>
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontSize:48,marginBottom:8}}>📦</div>
        <h3 style={{fontSize:18,fontWeight:700}}>Livraison à {dl.client.name}</h3>
        <p style={{fontSize:13,color:"var(--muted)"}}>{dl.client.addr}</p>
      </div>

      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Méthode de confirmation</div>
      <div className="dr-confirm-options">
        {[["code","🔢","Code PIN"],["photo","📸","Photo"],["signature","✍️","Signature"]].map(([k,i,l])=>
          <div key={k} className={`dr-confirm-opt ${method===k?"on":""}`} onClick={()=>setMethod(k)}>
            <div className="dco-icon">{i}</div><div className="dco-label">{l}</div>
          </div>)}
      </div>

      {method==="code"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>Demandez le code à 4 chiffres au client</p>
        <div className="otp-inputs">{[0,1,2,3].map(i=><input key={i} className="otp-box" maxLength={1} onChange={e=>{const v=code.split("");v[i]=e.target.value;setCode(v.join(""))}} style={{width:52,height:58,borderColor:code.length>=4?"#10B981":"#E8E6E1"}}/>)}</div>
      </div>}

      {method==="photo"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>Prenez une photo du colis remis au client</p>
        <input id="dr-photo-confirm" type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{
          const f=e.target.files?.[0];if(!f)return;
          const reader=new FileReader();
          reader.onload=()=>{setPhotoTaken(reader.result);toast.success("Photo prise 📸")};
          reader.readAsDataURL(f);e.target.value="";
        }}/>
        {!photoTaken?<div onClick={()=>document.getElementById("dr-photo-confirm")?.click()} style={{height:160,background:"var(--light,#F5F4F1)",border:"2px dashed var(--border,#E8E6E1)",borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <div style={{width:56,height:56,borderRadius:16,background:"rgba(16,185,129,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:6}}>📷</div>
          <div style={{fontSize:13,fontWeight:600,color:"var(--muted,#908C82)"}}>Appuyer pour prendre la photo</div>
        </div>
        :<div style={{height:160,borderRadius:18,overflow:"hidden",position:"relative",border:"2px solid #10B981"}}>
          <img src={photoTaken} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
          <div style={{position:"absolute",top:8,right:8,padding:"4px 10px",borderRadius:8,background:"#10B981",color:"#fff",fontSize:10,fontWeight:700}}>✅ Photo prise</div>
          <div onClick={()=>setPhotoTaken(false)} style={{position:"absolute",bottom:8,right:8,padding:"4px 10px",borderRadius:8,background:"rgba(239,68,68,.9)",color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer"}}>🗑️ Reprendre</div>
        </div>}
      </div>}

      {method==="signature"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>Le client signe sur l'écran</p>
        {!signed?<div onClick={()=>setSigned(true)} style={{height:140,background:"var(--card)",border:"2px dashed #E8E6E1",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <div style={{fontSize:13,color:"var(--muted)"}}>✍️ Appuyer ici pour signer</div>
        </div>
        :<div style={{height:140,background:"rgba(16,185,129,0.04)",border:"2px solid #10B981",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{fontFamily:"cursive",fontSize:24,color:"var(--text)",opacity:.6}}>Marie Koumba</div>
          <div onClick={()=>setSigned(false)} style={{position:"absolute",bottom:8,right:8,fontSize:11,color:"#EF4444",cursor:"pointer",fontWeight:600}}>🗑️ Effacer</div>
          <div style={{position:"absolute",top:8,right:8}}><span style={{padding:"3px 8px",borderRadius:6,background:"rgba(16,185,129,0.1)",color:"#10B981",fontSize:10,fontWeight:600}}>✓ Signé</span></div>
        </div>}
      </div>}

      {!method&&<div className="info-box yellow" style={{marginTop:14}}><span>💡</span><span>Choisissez une méthode de confirmation pour valider la livraison</span></div>}

      <div style={{paddingTop:24,paddingBottom:16}}>
        <button className="btn-primary" style={{background:method?"#10B981":"#E8E6E1",color:method?"var(--card)":"#908C82"}} onClick={()=>{if(method){setDone(true);toast.success("Livraison confirmée 🎉")}}} disabled={!method}>✅ Valider la livraison</button>
      </div>
    </div>
  </>);
}

/* D4 ── GPS NAVIGATION ── */

export default DrConfirmScr;
