import toast from "../../utils/toast";
import { USER_AVATAR } from "../../data/images";
import ImageCropper from "../../components/ImageCropper";
import { useState, useEffect } from "react";
import Icon from "../../components/Icon";
import { useLoad, useAction } from "../../hooks/useData";
import { buyer as buyerService } from "../../services";
import authService from "../../services/authService";
import { useApp } from "../../context/AppContext";

function EditProfileScr({onBack}){
  const { user, setUser } = useApp();
  const { data: profile, reload: reloadProfile } = useLoad(() => buyerService.getProfile());
  const { run, loading: saving } = useAction();
  const { run: runUpload, loading: uploading } = useAction();

  const [epName,setEpName]=useState("");
  const [epEmail,setEpEmail]=useState("");
  const [epPhone,setEpPhone]=useState("");
  const [epCity,setEpCity]=useState("");
  const [epBio,setEpBio]=useState("");
  const [avatar, setAvatar] = useState(null);
  const [cropSrc,setCropSrc]=useState(null);
  const [errors,setErrors]=useState({});

  // Populate form once profile loads
  useEffect(() => {
    if (!profile) return;
    setEpName([profile.first_name, profile.last_name].filter(Boolean).join(" ") || "");
    setEpEmail(profile.email || "");
    setEpPhone(profile.phone?.replace("+242","") || "");
    setEpCity(profile.city || "");
    setEpBio(profile.bio || "");
    setAvatar(profile.avatar || null);
  }, [profile]);

  const clr=(k)=>setErrors(p=>{const n={...p};delete n[k];return n});

  const handleCropConfirm = async (croppedBase64) => {
    setCropSrc(null);
    // Show preview immediately
    setAvatar(croppedBase64);
    // Convert base64 to File and upload
    try {
      const res = await fetch(croppedBase64);
      const blob = await res.blob();
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const result = await runUpload(() => authService.uploadAvatar(file));
      if (result?.avatar) {
        setAvatar(result.avatar);
        setUser(prev => prev ? { ...prev, avatar: result.avatar } : prev);
      }
      toast.success("Photo de profil mise à jour");
    } catch {
      toast.error("Erreur lors de l'upload de la photo");
    }
  };

  const save = async () => {
    const e={};
    if(!epName.trim())e.name="Nom requis";
    if(!epEmail.trim())e.email="Email requis";
    if(epPhone.replace(/\s/g,"").length!==9)e.phone="9 chiffres requis";
    if(!epCity.trim())e.city="Ville requise";
    setErrors(e);
    if(Object.keys(e).length){toast.error("Remplissez les champs obligatoires");return}
    try {
      const [firstName, ...rest] = epName.trim().split(" ");
      const updated = await run(() => buyerService.updateProfile({
        first_name: firstName,
        last_name: rest.join(" "),
        email: epEmail,
        phone: epPhone,
        city: epCity,
        bio: epBio,
      }));
      if (updated) setUser(prev => prev ? { ...prev, ...updated } : prev);
      toast.success("Profil sauvegardé");
      setTimeout(onBack, 800);
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const displayAvatar = avatar || USER_AVATAR;

  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Modifier profil</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:14}}>
      <div className="prof-av" style={{margin:"0 auto 10px",overflow:"hidden",padding:0,cursor:"pointer",position:"relative"}} onClick={()=>document.getElementById("av-upload")?.click()}>
        <img src={displayAvatar} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
        {uploading&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center"}}><div className="spinner" style={{width:20,height:20,borderColor:"rgba(255,255,255,0.3)",borderTopColor:"#fff"}}/></div>}
      </div>
      <input id="av-upload" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>setCropSrc(r.result);r.readAsDataURL(f);e.target.value=""}}}/>
      <span style={{fontSize:13,color:"#F97316",fontWeight:600,cursor:"pointer"}} onClick={()=>document.getElementById("av-upload")?.click()}>Changer la photo</span>
    </div>
    <div className="field"><label>Nom <span style={{color:"#EF4444"}}>*</span></label><input value={epName} onChange={e=>{setEpName(e.target.value);clr("name")}}/>{errors.name&&<div className="err-msg">{errors.name}</div>}</div>
    <div className="field"><label>Email <span style={{color:"#EF4444"}}>*</span></label><input value={epEmail} onChange={e=>{setEpEmail(e.target.value);clr("email")}}/>{errors.email&&<div className="err-msg">{errors.email}</div>}</div>
    <div className="field"><label>Téléphone <span style={{color:"#EF4444"}}>*</span></label><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,fontWeight:600,flexShrink:0}}>+242</span><input value={epPhone} onChange={e=>{const v=e.target.value.replace(/[^0-9]/g,"").slice(0,9);setEpPhone(v);clr("phone")}} placeholder="06X XXX XXX" type="tel" maxLength={11}/></div>{errors.phone&&<div className="err-msg">{errors.phone}</div>}</div>
    <div className="field-row"><div className="field"><label>Ville <span style={{color:"#EF4444"}}>*</span></label><input value={epCity} onChange={e=>{setEpCity(e.target.value);clr("city")}}/>{errors.city&&<div className="err-msg">{errors.city}</div>}</div><div className="field"><label>Pays <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="Congo CG"/></div></div>
    <div className="field"><label>Bio <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><textarea rows={3} value={epBio} onChange={e=>setEpBio(e.target.value)}/></div>
    {cropSrc&&<ImageCropper src={cropSrc} shape="circle" onCancel={()=>setCropSrc(null)} onConfirm={handleCropConfirm}/>}
    <button className="btn-primary" disabled={saving} onClick={save}>{saving?"Sauvegarde...":"Enregistrer"}</button>
  </div>);
}

export default EditProfileScr;
