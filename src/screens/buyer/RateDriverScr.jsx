import { useState } from "react";
import toast from "../../utils/toast";
import { DRIVER_PHOTO } from "../../data/images";

function RateDriverScr({onBack,onDone,driver={}}){
  const [rating,setRating]=useState(0);
  const [tip,setTip]=useState(0);
  const [comment,setComment]=useState("");
  const [done,setDone]=useState(false);
  const driverName=driver?.name||"Patrick Moukala";

  const submit=()=>{
    if(rating===0)return;
    setDone(true);
    toast.success("Merci pour votre évaluation ! ⭐");
  };

  if(done) return(<div className="scr" style={{padding:16,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",height:"100%"}}>
    <div style={{fontSize:64,marginBottom:14}}>🎉</div>
    <h2 style={{fontSize:20,fontWeight:700,marginBottom:6}}>Merci !</h2>
    <p style={{fontSize:14,color:"var(--muted)",marginBottom:8}}>Votre évaluation aide {driverName} et les autres clients.</p>
    <div style={{fontSize:28,color:"#F59E0B",marginBottom:14}}>{"★".repeat(rating)}</div>
    {tip>0&&<div style={{padding:"8px 16px",borderRadius:10,background:"rgba(16,185,129,0.06)",color:"#10B981",fontSize:13,fontWeight:600,marginBottom:14}}>🎁 Pourboire de {tip.toLocaleString()} FCFA envoyé</div>}
    <button className="btn-primary" style={{maxWidth:280}} onClick={onDone||onBack}>Retour à l'accueil</button>
  </div>);

  return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:14}}><button onClick={onBack}>←</button><h2>Évaluer la livraison</h2><div style={{width:38}}/></div>

    {/* Driver card */}
    <div style={{textAlign:"center",marginBottom:20}}>
      <div style={{width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,#10B981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 10px",overflow:"hidden"}}><img src={DRIVER_PHOTO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
      <h3 style={{fontSize:17,fontWeight:700}}>{driverName}</h3>
      <p style={{fontSize:12,color:"var(--muted)"}}>🛵 Honda PCX · BZ-4521</p>
    </div>

    {/* Rating */}
    <div style={{textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>Comment était la livraison ?</div>
      <div style={{display:"flex",justifyContent:"center",gap:8}}>
        {[1,2,3,4,5].map(s=>(
          <button key={s} onClick={()=>setRating(s)} style={{width:48,height:48,borderRadius:14,border:rating>=s?"2px solid #F59E0B":"1px solid var(--border)",background:rating>=s?"rgba(245,158,11,0.08)":"var(--card)",cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>{rating>=s?"★":"☆"}</button>
        ))}
      </div>
      {rating>0&&<div style={{fontSize:13,color:"#F59E0B",fontWeight:600,marginTop:8}}>{["","Mauvais 😞","Passable 😐","Bien 🙂","Très bien 😊","Excellent 🤩"][rating]}</div>}
    </div>

    {/* Tip */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>🎁 Laisser un pourboire (optionnel)</div>
      <div style={{display:"flex",gap:8}}>
        {[0,200,500,1000].map(t=>(
          <button key={t} onClick={()=>setTip(t)} style={{flex:1,padding:"10px 0",borderRadius:12,border:tip===t?"2px solid #10B981":"1px solid var(--border)",background:tip===t?"rgba(16,185,129,0.06)":"var(--card)",color:tip===t?"#10B981":"var(--sub)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t===0?"Aucun":`${t} F`}</button>
        ))}
      </div>
    </div>

    {/* Comment */}
    <div style={{marginBottom:20}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>💬 Commentaire (optionnel)</div>
      <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Le livreur était ponctuel et sympa..." rows={3} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:13,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
    </div>

    <button onClick={submit} disabled={rating===0} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:rating>0?"#6366F1":"var(--border)",color:rating>0?"var(--card)":"var(--muted)",fontSize:15,fontWeight:700,cursor:rating>0?"pointer":"not-allowed",fontFamily:"inherit"}}>
      {rating===0?"Sélectionnez une note":"Envoyer l'évaluation ⭐"}
    </button>
  </div>);
}
export default RateDriverScr;
