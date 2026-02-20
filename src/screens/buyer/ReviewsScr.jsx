import { useState } from "react";
import { REVIEWS } from "../../data";

function ReviewsScr({product:p,onBack}){
  const avg=p.rating;const dist=[60,25,10,3,2];
  const [writing,setWriting]=useState(false);
  const [userRating,setUserRating]=useState(0);
  const [userText,setUserText]=useState("");
  const [userReviews,setUserReviews]=useState([]);
  const [submitted,setSubmitted]=useState(false);

  const submitReview=()=>{
    if(userRating===0)return;
    setUserReviews(r=>[{name:"Moi",rating:userRating,text:userText,date:"Aujourd'hui",avatar:"😊"},...r]);
    setWriting(false);setUserRating(0);setUserText("");setSubmitted(true);
    setTimeout(()=>setSubmitted(false),3000);
  };

  const allReviews=[...userReviews,...REVIEWS];

  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Avis ({p.reviews+userReviews.length})</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:40,fontWeight:700,color:"#191815"}}>{avg}</div>
      <div style={{fontSize:16,color:"#F59E0B",marginBottom:4}}>{"★".repeat(Math.floor(avg))}{"☆".repeat(5-Math.floor(avg))}</div>
      <div style={{fontSize:12,color:"#908C82"}}>{p.reviews+userReviews.length} avis vérifiés</div>
    </div>
    <div style={{marginBottom:20}}>{dist.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:12,width:12}}>{5-i}</span><span style={{fontSize:12}}>⭐</span><div style={{flex:1,height:6,background:"#E8E6E1",borderRadius:3,overflow:"hidden"}}><div style={{width:`${d}%`,height:"100%",background:i===0?"#F59E0B":"#E8E6E1",borderRadius:3}}/></div><span style={{fontSize:11,color:"#908C82",width:30,textAlign:"right"}}>{d}%</span></div>)}</div>

    {/* Write review button / form */}
    {!writing?<button onClick={()=>setWriting(true)} style={{width:"100%",padding:"14px 0",borderRadius:14,border:"2px solid #6366F1",background:"rgba(99,102,241,0.04)",cursor:"pointer",fontSize:14,fontWeight:700,color:"#6366F1",fontFamily:"inherit",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>✏️ Écrire un avis</button>

    :<div style={{padding:16,background:"#fff",borderRadius:18,border:"1px solid #E8E6E1",marginBottom:20,boxShadow:"0 2px 10px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h4 style={{fontSize:15,fontWeight:700}}>Votre avis</h4>
        <span style={{fontSize:12,color:"#908C82",cursor:"pointer"}} onClick={()=>{setWriting(false);setUserRating(0);setUserText("")}}>✕ Annuler</span>
      </div>

      {/* Star selection */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:"#908C82",marginBottom:8}}>Note</div>
        <div style={{display:"flex",gap:6}}>
          {[1,2,3,4,5].map(s=><button key={s} onClick={()=>setUserRating(s)} style={{width:44,height:44,borderRadius:12,border:userRating>=s?"2px solid #F59E0B":"1px solid #E8E6E1",background:userRating>=s?"rgba(245,158,11,0.08)":"#fff",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>{userRating>=s?"★":"☆"}</button>)}
        </div>
        {userRating>0&&<div style={{fontSize:12,color:"#F59E0B",fontWeight:600,marginTop:6}}>{["","Mauvais","Passable","Bien","Très bien","Excellent"][userRating]}</div>}
      </div>

      {/* Comment */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:"#908C82",marginBottom:8}}>Commentaire (optionnel)</div>
        <textarea value={userText} onChange={e=>setUserText(e.target.value)} placeholder="Partagez votre expérience..." rows={3} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid #E8E6E1",fontSize:13,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
      </div>

      {/* Submit */}
      <button onClick={submitReview} disabled={userRating===0} style={{width:"100%",padding:"12px 0",borderRadius:12,border:"none",background:userRating>0?"#6366F1":"#E8E6E1",color:userRating>0?"#fff":"#908C82",fontSize:14,fontWeight:700,cursor:userRating>0?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .2s"}}>
        {userRating===0?"Sélectionnez une note":"Publier mon avis ⭐"}
      </button>
    </div>}

    {/* Success toast */}
    {submitted&&<div style={{padding:12,background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:12,marginBottom:14,display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:600,color:"#10B981"}}>✅ Avis publié avec succès !</div>}

    {/* All reviews */}
    {allReviews.map((r,i)=><div key={i} className="review-card" style={r.name==="Moi"?{border:"2px solid rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.02)"}:{}}><div className="review-top"><div className="rav">{r.avatar}</div><div style={{flex:1}}><h4 style={{fontSize:14,fontWeight:600}}>{r.name}{r.name==="Moi"&&<span style={{fontSize:10,color:"#6366F1",marginLeft:6,fontWeight:700}}>VOUS</span>}</h4></div><span className="rd">{r.date}</span></div><div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>{r.text&&<div className="review-text">{r.text}</div>}</div>)}
  </div>);
}

/* 14 ── COUPONS ── */

export default ReviewsScr;
