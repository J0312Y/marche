import { useState } from "react";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonList } from "../../components/Loading";
import { CHAT_AVATARS } from "../../data/images";
import toast from "../../utils/toast";

function VReviewsScr({onBack}){
  const { data, loading } = useLoad(() => vendor.getReviews());
  const raw = data?.reviews || data || [];
  const [reviews,setReviews]=useState(null);
  const [replyingTo,setReplyingTo]=useState(null);
  const [replyText,setReplyText]=useState("");
  const [filter,setFilter]=useState("all");

  const items=reviews||raw;
  const avg=items.length>0?(items.reduce((s,r)=>s+r.rating,0)/items.length).toFixed(1):"0";
  const filtered=filter==="all"?items:filter==="unreplied"?items.filter(r=>!r.replied):items.filter(r=>r.replied);

  const submitReply=(idx)=>{
    if(!replyText.trim())return;
    const updated=(reviews||raw).map((r,i)=>i===idx?{...r,replied:true,reply:replyText.trim()}:r);
    setReviews(updated);
    setReplyingTo(null);
    setReplyText("");
    toast.success("Réponse publiée ✅");
  };

  return(<div className="scr" style={{padding:16,paddingBottom:80}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>Avis clients ({items.length})</h2><div style={{width:38}}/></div>

    {loading?<SkeletonList count={4}/>:<>
      {/* Summary */}
      <div style={{display:"flex",alignItems:"center",gap:14,padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:12}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:28,fontWeight:800,color:"#191815"}}>{avg}</div>
          <div style={{fontSize:12,color:"#F59E0B"}}>{"★".repeat(Math.floor(avg))}</div>
        </div>
        <div style={{flex:1,fontSize:12,color:"#908C82"}}>
          <div>{items.length} avis au total</div>
          <div style={{marginTop:2}}>{items.filter(r=>!r.replied).length} en attente de réponse</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["all","Tous"],["unreplied","Sans réponse"],["replied","Répondus"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{padding:"6px 14px",borderRadius:20,border:filter===k?"1px solid #6366F1":"1px solid #E8E6E1",background:filter===k?"rgba(99,102,241,0.06)":"#fff",color:filter===k?"#6366F1":"#5E5B53",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>

      {/* Reviews */}
      {filtered.map((r,i)=>{
        const realIdx=(reviews||raw).indexOf(r);
        return(
        <div key={i} style={{padding:14,background:"#fff",border:replyingTo===realIdx?"2px solid #6366F1":"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:10,overflow:"hidden"}}><img src={CHAT_AVATARS[["client","femme1","homme1","femme2"][i%4]]} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
              <div>
                <b style={{fontSize:13}}>{r.client}</b>
                <div style={{fontSize:10,color:"#908C82"}}>{r.date}</div>
              </div>
            </div>
            <div style={{color:"#F59E0B",fontSize:12}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
          </div>

          {/* Review text */}
          <div style={{fontSize:12,color:"#5E5B53",lineHeight:1.5,marginBottom:6}}>{r.text}</div>
          <div style={{fontSize:11,color:"#908C82",display:"flex",alignItems:"center",gap:4}}>📦 {r.product}</div>

          {/* Existing reply */}
          {r.replied&&r.reply&&(
            <div style={{marginTop:10,padding:10,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"#6366F1",marginBottom:4}}>↩️ Votre réponse</div>
              <div style={{fontSize:12,color:"#5E5B53",lineHeight:1.5}}>{r.reply}</div>
            </div>
          )}

          {/* Reply form */}
          {replyingTo===realIdx?(
            <div style={{marginTop:10}}>
              <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Votre réponse au client..." rows={3} style={{width:"100%",padding:10,borderRadius:12,border:"1px solid #E8E6E1",fontSize:12,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <button onClick={()=>{setReplyingTo(null);setReplyText("")}} style={{flex:1,padding:8,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
                <button onClick={()=>submitReply(realIdx)} disabled={!replyText.trim()} style={{flex:1,padding:8,borderRadius:10,border:"none",background:replyText.trim()?"#6366F1":"#E8E6E1",color:replyText.trim()?"#fff":"#908C82",fontSize:11,fontWeight:700,cursor:replyText.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>Publier ↩️</button>
              </div>
            </div>
          ):(
            !r.replied&&<button onClick={()=>{setReplyingTo(realIdx);setReplyText("")}} style={{marginTop:8,padding:"7px 14px",borderRadius:10,border:"1px solid #6366F1",background:"transparent",color:"#6366F1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>↩️ Répondre</button>
          )}
        </div>);
      })}
    </>}
  </div>);
}

export default VReviewsScr;
