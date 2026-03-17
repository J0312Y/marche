import { useState } from "react";
import toast from "../../utils/toast";
function ReturnScr({onBack,order}){
  const [reason,setReason]=useState("");const [desc,setDesc]=useState("");const [photos,setPhotos]=useState([]);const [done,setDone]=useState(false);
  const reasons=["Produit défectueux","Produit différent de la photo","Taille incorrecte","Produit endommagé à la livraison","Erreur de commande","Autre"];
  const submit=()=>{if(!reason){toast.error("Sélectionnez une raison");return}setDone(true);toast.success("Demande envoyée ✅")};
  const addPhoto=(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setPhotos(p=>[...p,r.result]);r.readAsDataURL(f);e.target.value=""};
  if(done)return(<div className="scr" style={{padding:16,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%"}}><div style={{fontSize:56,marginBottom:14}}>✅</div><h2 style={{fontSize:20,fontWeight:700,marginBottom:6}}>Demande envoyée</h2><p style={{fontSize:13,color:"var(--muted)",marginBottom:8}}>Nous traiterons votre demande sous 24-48h. Vous recevrez une notification.</p><p style={{fontSize:12,color:"var(--sub)"}}>Réf: #RET-2026-{Math.floor(Math.random()*9000+1000)}</p><button className="btn-primary" style={{marginTop:20,maxWidth:280}} onClick={onBack}>Retour</button></div>);
  return(<div className="scr" style={{padding:16,paddingBottom:80}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>Retour / Remboursement</h2><div style={{width:38}}/></div>
    {order&&<div style={{padding:12,background:"var(--light)",borderRadius:14,marginBottom:14,fontSize:12,color:"var(--sub)"}}><b>Commande {order.ref}</b> · {order.date}</div>}
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Raison du retour</div>
    {reasons.map(r=><div key={r} onClick={()=>setReason(r)} style={{padding:12,background:reason===r?"rgba(99,102,241,0.06)":"var(--card)",border:reason===r?"2px solid #6366F1":"1px solid var(--border)",borderRadius:12,marginBottom:8,fontSize:13,cursor:"pointer",fontWeight:reason===r?600:400,color:reason===r?"#6366F1":"var(--text)"}}>{reason===r&&"✓ "}{r}</div>)}
    <div className="field" style={{marginTop:10}}><label>Description (optionnel)</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Décrivez le problème..." rows={3} style={{width:"100%",padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:12,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box",color:"var(--text)"}}/></div>
    <div style={{marginBottom:14}}>
      <label style={{fontSize:12,fontWeight:600,color:"var(--sub)",display:"block",marginBottom:6}}>Photos (optionnel)</label>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {photos.map((p,i)=><div key={i} style={{width:60,height:60,borderRadius:10,overflow:"hidden"}}><img src={p} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>)}
        {photos.length<4&&<div onClick={()=>document.getElementById("ret-photo")?.click()} style={{width:60,height:60,borderRadius:10,border:"2px dashed var(--border)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:20}}>📷</div>}
        <input id="ret-photo" type="file" accept="image/*" style={{display:"none"}} onChange={addPhoto}/>
      </div>
    </div>
    <div style={{padding:12,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)",borderRadius:12,marginBottom:14,fontSize:11,color:"var(--sub)",lineHeight:1.5}}>⏱️ Remboursement sous 3-5 jours ouvrés après validation. Crédité sur votre wallet Kolo Pay.</div>
    <button className="btn-primary" onClick={submit}>📤 Envoyer la demande</button>
  </div>);
}
export default ReturnScr;
