import toast from "../../utils/toast";


function EditProfileScr({onBack}){
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Modifier profil</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:14}}><div className="prof-av" style={{margin:"0 auto 10px"}}>J</div><span style={{fontSize:13,color:"#6366F1",fontWeight:600,cursor:"pointer"}}>Changer la photo</span></div>
    <div className="field"><label>Nom</label><input defaultValue="Joeldy Tsina"/></div>
    <div className="field"><label>Email</label><input defaultValue="joeldytsina94@gmail.com"/></div>
    <div className="field"><label>Téléphone</label><input defaultValue="+242 064 663 469"/></div>
    <div className="field-row"><div className="field"><label>Ville</label><input defaultValue="Brazzaville"/></div><div className="field"><label>Pays</label><input defaultValue="Congo 🇨🇬"/></div></div>
    <div className="field"><label>Bio</label><textarea rows={3} defaultValue="Fondateur de Lamuka Tech 🇨🇬"/></div>
    <button className="btn-primary" onClick={()=>{toast.success("Profil sauvegardé ✅");setTimeout(onBack,800)}}>Enregistrer</button>
  </div>);
}

/* 26 ── ADDRESSES ── */

export default EditProfileScr;
