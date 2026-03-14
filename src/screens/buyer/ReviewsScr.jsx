import { useState, useRef } from "react";
import { useLoad } from "../../hooks";
import { social } from "../../services";

function ReviewsScr({product:p,onBack}){
  const { data: reviewData } = useLoad(() => social.getArticleReviews(p.id));
  const REVIEWS = reviewData?.reviews || reviewData || [];
  
  const [writing,setWriting]=useState(false);
  const [userRating,setUserRating]=useState(0);
  const [userText,setUserText]=useState("");
  const [userPhotos,setUserPhotos]=useState([]);
  const [userReviews,setUserReviews]=useState([]);
  const [submitted,setSubmitted]=useState(false);
  const [viewImg,setViewImg]=useState(null);
  const fileRef=useRef(null);

  const handlePhotoUpload=(e)=>{
    const files=Array.from(e.target.files||[]);
    files.forEach(file=>{
      if(file.size>5*1024*1024)return;
      const reader=new FileReader();
      reader.onload=()=>setUserPhotos(prev=>[...prev,{url:reader.result,name:file.name}]);
      reader.readAsDataURL(file);
    });
    e.target.value="";
  };

  const removePhoto=(idx)=>setUserPhotos(prev=>prev.filter((_,i)=>i!==idx));

  const submitReview=()=>{
    if(userRating===0)return;
    setUserReviews(r=>[{name:"Moi",rating:userRating,text:userText,date:"Aujourd'hui",avatar:"😊",photos:userPhotos.map(p=>p.url)},...r]);
    setWriting(false);setUserRating(0);setUserText("");setUserPhotos([]);setSubmitted(true);
    setTimeout(()=>setSubmitted(false),3000);
  };

  const allReviews=[...userReviews,...REVIEWS];

  // Dynamic avg and distribution — recalculates when user adds a review
  const allRatings=allReviews.map(r=>r.rating);
  const totalCount=Math.max(allRatings.length, p.reviews||0)+userReviews.length-(allRatings.length>0?allRatings.length:0);
  const avg=allRatings.length>0?+(allRatings.reduce((s,r)=>s+r,0)/allRatings.length).toFixed(1):p.rating;
  const dist=[5,4,3,2,1].map(star=>{
    const count=allRatings.filter(r=>Math.round(r)===star).length;
    return allRatings.length>0?Math.round((count/allRatings.length)*100):(star===5?60:star===4?25:star===3?10:star===2?3:2);
  });

  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Avis ({p.reviews+userReviews.length})</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:40,fontWeight:700,color:"#191815"}}>{avg}</div>
      <div style={{fontSize:16,color:"#F59E0B",marginBottom:4}}>{"★".repeat(Math.floor(avg))}{"☆".repeat(5-Math.floor(avg))}</div>
      <div style={{fontSize:12,color:"#908C82"}}>{p.reviews+userReviews.length} avis vérifiés</div>
    </div>
    <div style={{marginBottom:20}}>{dist.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:12,width:12}}>{5-i}</span><span style={{fontSize:12}}>⭐</span><div style={{flex:1,height:6,background:"#E8E6E1",borderRadius:3,overflow:"hidden"}}><div style={{width:`${d}%`,height:"100%",background:d>0?"#F59E0B":"#E8E6E1",borderRadius:3,transition:"width .3s"}}/></div><span style={{fontSize:11,color:"#908C82",width:30,textAlign:"right"}}>{d}%</span></div>)}</div>

    {/* Write review button / form */}
    {!writing?<button onClick={()=>setWriting(true)} style={{width:"100%",padding:"14px 0",borderRadius:14,border:"2px solid #6366F1",background:"rgba(99,102,241,0.04)",cursor:"pointer",fontSize:14,fontWeight:700,color:"#6366F1",fontFamily:"inherit",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>✏️ Écrire un avis</button>

    :<div style={{padding:16,background:"#fff",borderRadius:18,border:"1px solid #E8E6E1",marginBottom:20,boxShadow:"0 2px 10px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h4 style={{fontSize:15,fontWeight:700}}>Votre avis</h4>
        <span style={{fontSize:12,color:"#908C82",cursor:"pointer"}} onClick={()=>{setWriting(false);setUserRating(0);setUserText("");setUserPhotos([])}}>✕ Annuler</span>
      </div>

      {/* Star selection */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:"#908C82",marginBottom:8}}>Note *</div>
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

      {/* Photo upload */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:"#908C82",marginBottom:8}}>Photos (optionnel)</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {userPhotos.map((ph,i)=>(
            <div key={i} style={{position:"relative",width:68,height:68,borderRadius:12,overflow:"hidden",border:"1px solid #E8E6E1"}}>
              <img src={ph.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <button onClick={()=>removePhoto(i)} style={{position:"absolute",top:2,right:2,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,.6)",color:"#fff",border:"none",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
          ))}
          {userPhotos.length<4&&(
            <button onClick={()=>fileRef.current?.click()} style={{width:68,height:68,borderRadius:12,border:"2px dashed #E8E6E1",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,color:"#908C82",fontSize:10,fontFamily:"inherit"}}>
              <span style={{fontSize:18}}>📷</span>
              Ajouter
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handlePhotoUpload}/>
        <div style={{fontSize:11,color:"#C4C1BA",marginTop:4}}>Max 4 photos · 5 Mo chacune</div>
      </div>

      {/* Submit */}
      <button onClick={submitReview} disabled={userRating===0} style={{width:"100%",padding:"12px 0",borderRadius:12,border:"none",background:userRating>0?"#6366F1":"#E8E6E1",color:userRating>0?"#fff":"#908C82",fontSize:14,fontWeight:700,cursor:userRating>0?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .2s"}}>
        {userRating===0?"Sélectionnez une note":"Publier mon avis ⭐"}
      </button>
    </div>}

    {/* Success toast */}
    {submitted&&<div style={{padding:12,background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:12,marginBottom:14,display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:600,color:"#10B981"}}>✅ Avis publié avec succès !</div>}

    {/* All reviews */}
    {allReviews.map((r,i)=><div key={i} className="review-card" style={r.name==="Moi"?{border:"2px solid rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.02)"}:{}}>
      <div className="review-top">
        <div className="rav">{r.avatar}</div>
        <div style={{flex:1}}><h4 style={{fontSize:14,fontWeight:600}}>{r.name}{r.name==="Moi"&&<span style={{fontSize:10,color:"#6366F1",marginLeft:6,fontWeight:700}}>VOUS</span>}</h4></div>
        <span className="rd">{r.date}</span>
      </div>
      <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
      {r.text&&<div className="review-text">{r.text}</div>}
      {/* Review photos */}
      {r.photos&&r.photos.length>0&&(
        <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
          {r.photos.map((ph,j)=>(
            <img key={j} src={ph} alt="" onClick={()=>setViewImg(ph)} style={{width:64,height:64,borderRadius:10,objectFit:"cover",cursor:"pointer",border:"1px solid #E8E6E1"}}/>
          ))}
        </div>
      )}
    </div>)}

    {/* Image fullscreen viewer */}
    {viewImg&&(
      <div onClick={()=>setViewImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:20}}>
        <img src={viewImg} alt="" style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:12,objectFit:"contain"}}/>
        <button style={{position:"absolute",top:20,right:20,width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,.2)",border:"none",color:"#fff",fontSize:20,cursor:"pointer"}}>✕</button>
      </div>
    )}
  </div>);
}

export default ReviewsScr;
