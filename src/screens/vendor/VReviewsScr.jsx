import { useState } from "react";
import { V_REVIEWS } from "../../data/vendorData";

function VReviewsScr({onBack}){
  const [replyTo,setReplyTo]=useState(null);
  const [replyText,setReplyText]=useState("");
  const [reviews,setReviews]=useState(V_REVIEWS.map(r=>({...r})));
  const submitReply=(i)=>{if(!replyText.trim())return;const r=[...reviews];r[i]={...r[i],replied:true,reply:replyText};setReviews(r);setReplyTo(null);setReplyText("")};
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Avis clients</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:40,fontWeight:700}}>4.6</div><div style={{fontSize:16,color:"#F59E0B"}}>★★★★★</div><div style={{fontSize:12,color:"#908C82"}}>{reviews.length} avis</div></div>
    {reviews.map((r,i)=><div key={i} className="review-card">
      <div className="review-top"><div className="rav">{r.client[0]}</div><div style={{flex:1}}><h4 style={{fontSize:14,fontWeight:600}}>{r.client}</h4><p style={{fontSize:11,color:"#908C82",margin:0}}>{r.product}</p></div><span style={{fontSize:11,color:"#908C82"}}>{r.date}</span></div>
      <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
      <div className="review-text">{r.text}</div>
      {r.replied&&<div style={{marginTop:10,padding:10,background:"#F5F4F1",borderRadius:10,fontSize:12}}><b>Votre réponse :</b> {r.reply}</div>}
      {!r.replied&&replyTo!==i&&<button style={{marginTop:8,padding:"6px 14px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,color:"#6366F1",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setReplyTo(i);setReplyText("")}}>💬 Répondre</button>}
      {replyTo===i&&<div style={{marginTop:10,padding:12,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.15)",borderRadius:12}}>
        <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={`Répondre à ${r.client}...`} rows={3} style={{width:"100%",padding:10,borderRadius:10,border:"1px solid #E8E6E1",fontSize:12,fontFamily:"inherit",resize:"none",background:"#fff"}}/>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setReplyTo(null);setReplyText("")}}>Annuler</button>
          <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:replyText.trim()?"#6366F1":"#E8E6E1",color:replyText.trim()?"#fff":"#908C82",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>submitReply(i)}>Envoyer</button>
        </div>
      </div>}
    </div>)}
  </div>);
}

/* V11 ── VENDOR PROMOTIONS ── */

export default VReviewsScr;
