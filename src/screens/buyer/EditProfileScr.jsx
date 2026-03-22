import toast from "../../utils/toast";
import { USER_AVATAR } from "../../data/images";
import { useState, useRef } from "react";


function EditProfileScr({onBack}){
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Modifier profil</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:14}}><div className="prof-av" style={{margin:"0 auto 10px",overflow:"hidden",padding:0,cursor:"pointer"}} onClick={()=>document.getElementById("av-upload")?.click()}><img id="av-img" src={USER_AVATAR} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div><input id="av-upload" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>{document.getElementById("av-img").src=r.result;toast.success("Photo mise à jour 📸")};r.readAsDataURL(f)}}}/><span style={{fontSize:13,color:"#F97316",fontWeight:600,cursor:"pointer"}} onClick={()=>document.getElementById("av-upload")?.click()}>Changer la photo</span></div>
    <div className="field"><label>Nom <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="Joeldy Tsina"/></div>
    <div className="field"><label>Email <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="joeldytsina94@gmail.com"/></div>
    <div className="field"><label>Téléphone <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="+242 064 663 469"/></div>
    <div className="field-row"><div className="field"><label>Ville <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="Brazzaville"/></div><div className="field"><label>Pays <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="Congo 🇨🇬"/></div></div>
    <div className="field"><label>Bio <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><textarea rows={3} defaultValue="Fondateur de Lamuka Tech 🇨🇬"/></div>
    <button className="btn-primary" onClick={()=>{toast.success("Profil sauvegardé ✅");setTimeout(onBack,800)}}>Enregistrer</button>
  </div>);
}

/* 26 ── ADDRESSES ── */

export default EditProfileScr;
