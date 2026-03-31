import toast from "../../utils/toast";
import { USER_AVATAR } from "../../data/images";
import { useState, useRef } from "react";


function EditProfileScr({onBack}){
  const [epName,setEpName]=useState("Joeldy Tsina");
  const [epEmail,setEpEmail]=useState("joeldytsina94@gmail.com");
  const [epPhone,setEpPhone]=useState("064 663 469");
  const [epCity,setEpCity]=useState("Brazzaville");
  const [epBio,setEpBio]=useState("");
  const [errors,setErrors]=useState({});
  const clr=(k)=>setErrors(p=>{const n={...p};delete n[k];return n});
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Modifier profil</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:14}}><div className="prof-av" style={{margin:"0 auto 10px",overflow:"hidden",padding:0,cursor:"pointer"}} onClick={()=>document.getElementById("av-upload")?.click()}><img id="av-img" src={USER_AVATAR} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div><input id="av-upload" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>{document.getElementById("av-img").src=r.result;toast.success("Photo mise à jour 📸")};r.readAsDataURL(f)}}}/><span style={{fontSize:13,color:"#F97316",fontWeight:600,cursor:"pointer"}} onClick={()=>document.getElementById("av-upload")?.click()}>Changer la photo</span></div>
    <div className="field"><label>Nom <span style={{color:"#EF4444"}}>*</span></label><input value={epName} onChange={e=>{setEpName(e.target.value);clr("name")}}/>{errors.name&&<div className="err-msg">{errors.name}</div>}</div>
    <div className="field"><label>Email <span style={{color:"#EF4444"}}>*</span></label><input value={epEmail} onChange={e=>{setEpEmail(e.target.value);clr("email")}}/>{errors.email&&<div className="err-msg">{errors.email}</div>}</div>
    <div className="field"><label>Téléphone <span style={{color:"#EF4444"}}>*</span></label><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,fontWeight:600,flexShrink:0}}>+242</span><input value={epPhone} onChange={e=>{const v=e.target.value.replace(/[^0-9]/g,"").slice(0,9);setEpPhone(v);clr("phone")}} placeholder="06X XXX XXX" type="tel" maxLength={11}/></div>{errors.phone&&<div className="err-msg">{errors.phone}</div>}</div>
    <div className="field-row"><div className="field"><label>Ville <span style={{color:"#EF4444"}}>*</span></label><input value={epCity} onChange={e=>{setEpCity(e.target.value);clr("city")}}/>{errors.city&&<div className="err-msg">{errors.city}</div>}</div><div className="field"><label>Pays <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="Congo 🇨🇬"/></div></div>
    <div className="field"><label>Bio <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><textarea rows={3} value={epBio} onChange={e=>setEpBio(e.target.value)}/></div>
    <button className="btn-primary" onClick={()=>{const e={};if(!epName.trim())e.name="Nom requis";if(!epEmail.trim())e.email="Email requis";if(epPhone.replace(/\s/g,"").length!==9)e.phone="9 chiffres requis";if(!epCity.trim())e.city="Ville requise";setErrors(e);if(Object.keys(e).length){toast.error("Remplissez les champs obligatoires");return}toast.success("Profil sauvegardé ✅");setTimeout(onBack,800)}}>Enregistrer</button>
  </div>);
}

/* 26 ── ADDRESSES ── */

export default EditProfileScr;
