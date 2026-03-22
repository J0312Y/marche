import { useState } from "react";
import Select from "../../components/Select";
import toast from "../../utils/toast";
import { USER_AVATAR } from "../../data/images";

function ProfileCompletionScr({onDone,provider}){
  const [step,setStep]=useState(0);
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [phone,setPhone]=useState("");
  const [city,setCity]=useState("brazzaville");
  const [quartier,setQuartier]=useState("");
  const [address,setAddress]=useState("");
  const [errors,setErrors]=useState({});

  const clr=(k)=>setErrors(p=>{const n={...p};delete n[k];return n});
  const validate0=()=>{
    const e={};
    if(!firstName.trim()) e.firstName="Prénom requis";
    if(!lastName.trim()) e.lastName="Nom requis";
    if(provider&&!phone.trim()) e.phone="Numéro requis";
    setErrors(e);
    if(Object.keys(e).length){toast.error("Remplissez les champs obligatoires");return false}
    return true;
  };
  const validate1=()=>{
    const e={};
    if(!city) e.city="Ville requise";
    if(!quartier.trim()) e.quartier="Quartier requis";
    setErrors(e);
    if(Object.keys(e).length){toast.error("Remplissez les champs obligatoires");return false}
    return true;
  };

  return(
    <div className="auth" style={{justifyContent:"flex-start",paddingTop:40}}>
      {provider&&<div style={{textAlign:"center",marginBottom:12}}>
        <div style={{display:"inline-flex",padding:"6px 16px",borderRadius:10,background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.15)",fontSize:12,color:"#10B981",fontWeight:600}}>✅ Connecté via {provider==="google"?"Google":provider==="apple"?"Apple":"Facebook"}</div>
      </div>}
      <div style={{textAlign:"center",marginBottom:10}}><div style={{width:72,height:72,borderRadius:20,overflow:"hidden",margin:"0 auto 8px",border:"3px solid #E8E6E1",cursor:"pointer"}} onClick={()=>document.getElementById("pc-avatar")?.click()}><img id="pc-av-img" src={USER_AVATAR} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div><input id="pc-avatar" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>{document.getElementById("pc-av-img").src=r.result};r.readAsDataURL(f)}}}/><span style={{fontSize:12,color:"#F97316",fontWeight:600,cursor:"pointer"}} onClick={()=>document.getElementById("pc-avatar")?.click()}>Ajouter une photo</span></div>
      <h2>Complétez votre profil</h2>
      <div className="sub" style={{marginBottom:14}}>Pour vous offrir la meilleure expérience</div>

      {step===0&&<>
        <div className={`field${errors.firstName?" err":""}`}><label>Prénom <span style={{color:"#EF4444"}}>*</span></label><input value={firstName} onChange={e=>{setFirstName(e.target.value);clr("firstName")}} placeholder="Joeldy"/>{errors.firstName&&<div className="err-msg">{errors.firstName}</div>}</div>
        <div className={`field${errors.lastName?" err":""}`}><label>Nom de famille <span style={{color:"#EF4444"}}>*</span></label><input value={lastName} onChange={e=>{setLastName(e.target.value);clr("lastName")}} placeholder="Tsina"/>{errors.lastName&&<div className="err-msg">{errors.lastName}</div>}</div>
        {provider&&<div className={`field${errors.phone?" err":""}`}><label>Numéro de téléphone <span style={{color:"#EF4444"}}>*</span></label>
          <div style={{display:"flex",gap:8}}><div style={{padding:"10px 12px",borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:13,fontWeight:600,flexShrink:0}}>🇨🇬 +242</div><input value={phone} onChange={e=>{setPhone(e.target.value);clr("phone")}} placeholder="06X XXX XXX" type="tel" style={{flex:1}}/></div>
          {errors.phone&&<div className="err-msg">{errors.phone}</div>}
        </div>}
        <button className="btn-primary" onClick={()=>{if(validate0())setStep(1)}}>Continuer</button>
        <button className="btn-outline" style={{marginTop:8}} onClick={onDone}>Passer pour l'instant</button>
      </>}

      {step===1&&<>
        <div className={`field${errors.city?" err":""}`}><label>Ville <span style={{color:"#EF4444"}}>*</span></label>
          <Select value={city} onChange={v=>{setCity(v);clr("city")}} placeholder="Choisir une ville" options={[{value:"brazzaville",label:"Brazzaville"},{value:"pointe-noire",label:"Pointe-Noire"},{value:"dolisie",label:"Dolisie"},{value:"nkayi",label:"Nkayi"},{value:"oyo",label:"Oyo"},{value:"ouesso",label:"Ouesso"}]}/>
          {errors.city&&<div className="err-msg">{errors.city}</div>}
        </div>
        <div className={`field${errors.quartier?" err":""}`}><label>Quartier <span style={{color:"#EF4444"}}>*</span></label><input value={quartier} onChange={e=>{setQuartier(e.target.value);clr("quartier")}} placeholder="Ex: Bacongo, Poto-Poto..."/>{errors.quartier&&<div className="err-msg">{errors.quartier}</div>}</div>
        <div className="field"><label>Adresse <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Rue, N°..."/></div>
        <button className="btn-primary" onClick={()=>{if(validate1())onDone()}}>🚀 Commencer</button>
      </>}

      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:20}}>{[0,1].map(i=><div key={i} style={{width:step===i?24:8,height:8,borderRadius:4,background:step>=i?"#F97316":"var(--border)",transition:"all .3s"}}/>)}</div>
    </div>
  );
}

export default ProfileCompletionScr;
