import { useState } from "react";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";
import { useAction } from "../../hooks/useData";
import driverService from "../../services/driverService";

function DrRateVendorScr({onBack,vendor,delivery}){
  const v=vendor||{name:"—",avatar:""};
  const [rating,setRating]=useState(0);
  const [tags,setTags]=useState([]);
  const [comment,setComment]=useState("");
  const { run: runRate, loading: submitting } = useAction();

  const TAG_OPTIONS=["Rapide","Colis bien emballé","Agréable","Attente trop longue","Colis mal emballé","Difficile à trouver"];
  const toggleTag=(t)=>setTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);

  const handleSubmit = async () => {
    try {
      const deliveryId = delivery?.id;
      const fullComment = tags.length > 0 ? `${tags.join(", ")}${comment ? " — " + comment : ""}` : comment;
      if (deliveryId) {
        await runRate(() => driverService.rateVendor(deliveryId, rating, fullComment));
      }
      toast.success("Merci pour votre évaluation");
      setTimeout(onBack, 800);
    } catch {
      toast.error("Erreur lors de l'envoi de l'évaluation");
    }
  };

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Évaluer le commerce</h2><div style={{width:38}}/></div>

    <div style={{textAlign:"center",padding:"16px 0 20px"}}>
      <div style={{width:56,height:56,borderRadius:16,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 10px"}}>{v.avatar}</div>
      <div style={{fontSize:16,fontWeight:700}}>{v.name}</div>
      <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Comment était le retrait ?</div>
    </div>

    {/* Stars */}
    <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:20}}>
      {[1,2,3,4,5].map(s=>(
        <div key={s} onClick={()=>setRating(s)} style={{fontSize:36,cursor:"pointer",transition:"transform .15s",transform:rating>=s?"scale(1.1)":"scale(1)",filter:rating>=s?"none":"grayscale(1) opacity(0.3)"}}><Icon name="star_full" size={18}/></div>
      ))}
    </div>
    {rating>0&&<div style={{textAlign:"center",fontSize:13,color:"var(--muted)",marginBottom:16}}>{["","Très mauvais","Mauvais","Correct","Bon","Excellent"][rating]}</div>}

    {/* Tags */}
    {rating>0&&<>
      <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Qu'avez-vous apprécié ?</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {TAG_OPTIONS.map(t=>(
          <div key={t} onClick={()=>toggleTag(t)} style={{padding:"6px 14px",borderRadius:20,border:tags.includes(t)?"2px solid #F97316":"1px solid var(--border)",background:tags.includes(t)?"rgba(249,115,22,0.06)":"var(--card)",fontSize:12,fontWeight:500,cursor:"pointer",color:tags.includes(t)?"#F97316":"var(--text)"}}>{t}</div>
        ))}
      </div>

      <div className="field"><label>Commentaire (optionnel)</label>
        <textarea rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Détails sur votre expérience..." style={{width:"100%",padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:13,fontFamily:"inherit",color:"var(--text)",resize:"none",outline:"none"}}/>
      </div>

      <button onClick={handleSubmit} disabled={submitting} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:submitting?"var(--border)":"#F97316",color:submitting?"var(--muted)":"#fff",fontSize:15,fontWeight:700,cursor:submitting?"not-allowed":"pointer",fontFamily:"inherit",marginTop:8}}>{submitting?"Envoi...":"Envoyer l'évaluation"}</button>
    </>}
  </div>);
}
export default DrRateVendorScr;
