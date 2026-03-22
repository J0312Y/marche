import { useState } from "react";
import Select from "../../components/Select";
import toast from "../../utils/toast";

function VAddDriverScr({onBack}){
  const [drvName,setDrvName]=useState("");
  const [drvPhone,setDrvPhone]=useState("");
  const [drvErrors,setDrvErrors]=useState({});
  const validateDrv=()=>{
    const e={};
    if(!drvName.trim()) e.name="Nom requis";
    if(!drvPhone.trim()) e.phone="Téléphone requis";
    setDrvErrors(e);
    if(Object.keys(e).length){toast.error("Remplissez les champs obligatoires");return false}
    return true;
  };
  const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:16,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>✅</div><h3 style={{fontSize:18,fontWeight:700}}>Invitation envoyée !</h3><p style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Le livreur recevra un SMS et une notification pour rejoindre votre réseau.</p><button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour</button></div></div>);
  return(<><div className="appbar"><button onClick={onBack}>←</button><h2>Ajouter un livreur</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:16}}>
      <div style={{textAlign:"center",marginBottom:14}}><div style={{width:64,height:64,borderRadius:18,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:32}}>🛵</div><p style={{fontSize:13,color:"var(--muted)"}}>Invitez un livreur à rejoindre votre réseau de livraison</p></div>
      <div className="field"><label>Nom complet <span style={{color:"#EF4444"}}>*</span></label><input value={drvName} onChange={e=>setDrvName(e.target.value)} placeholder="Ex: Patrick Moukala"/>{drvErrors.name&&<div className="err-msg">{drvErrors.name}</div>}</div>
      <div className="field"><label>Téléphone <span style={{color:"#EF4444"}}>*</span></label><input value={drvPhone} onChange={e=>setDrvPhone(e.target.value)} placeholder="+242 06X XXX XXX" type="tel"/>{drvErrors.phone&&<div className="err-msg">{drvErrors.phone}</div>}</div>
      <div className="field"><label>Email <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><input placeholder="livreur@email.com" type="email"/></div>
      <div className="field"><label>Type de véhicule <span style={{color:"#EF4444"}}>*</span></label><Select value="moto" onChange={()=>{}} options={[{value:"moto",label:"🛵 Moto / Scooter"},{value:"voiture",label:"🚗 Voiture"},{value:"velo",label:"🚲 Vélo"}]}/></div>
      <div className="field"><label>Zone de livraison <span style={{color:"#EF4444"}}>*</span></label><Select value="Brazzaville Sud" onChange={()=>{}} options={["Brazzaville Sud","Brazzaville Centre","Brazzaville Nord","Pointe-Noire"]}/></div>
      <div className="info-box blue" style={{marginTop:10}}><span>📱</span><span>Le livreur recevra un SMS d'invitation avec un lien pour créer son compte Lamuka.</span></div>
      <div style={{paddingTop:24,paddingBottom:16}}><button className="btn-primary" onClick={()=>{setDone(true);validateDrv()&&toast.success("Invitation envoyée au livreur 🛵")}}>📤 Envoyer l'invitation</button></div>
    </div>
  </>);
}

export default VAddDriverScr;
