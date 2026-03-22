import { useState } from "react";
import toast from "../../utils/toast";
function VQAScr({onBack}){
  const [questions,setQuestions]=useState([
    {id:1,product:"Robe Wax Moderne",client:"Marie K.",q:"Est-ce que cette robe existe en rouge ?",date:"14 Fév",answered:false,a:""},
    {id:2,product:"Sac à Main Cuir",client:"Patrick M.",q:"Le cuir est-il véritable ?",date:"12 Fév",answered:true,a:"Oui, 100% cuir véritable artisanal congolais."},
    {id:3,product:"Chemise Bogolan",client:"David T.",q:"Disponible en taille XXL ?",date:"10 Fév",answered:false,a:""},
    {id:4,product:"Galaxy A54",client:"Grace M.",q:"La garantie est de combien ?",date:"8 Fév",answered:true,a:"Garantie 12 mois, retour sous 7 jours si défaut."},
  ]);
  const [replyTo,setReplyTo]=useState(null);const [replyText,setReplyText]=useState("");
  const [tab,setTab]=useState("pending");
  const pending=questions.filter(q=>!q.answered);const answered=questions.filter(q=>q.answered);
  const shown=tab==="pending"?pending:answered;
  const submitReply=(id)=>{if(!replyText.trim())return;setQuestions(prev=>prev.map(q=>q.id===id?{...q,answered:true,a:replyText.trim()}:q));setReplyTo(null);setReplyText("");toast.success("Réponse publiée ✅")};
  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>❓ Questions ({pending.length} en attente)</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",gap:0,marginBottom:12,background:"var(--light)",borderRadius:12,padding:3}}>
      {[["pending","En attente ("+pending.length+")"],["answered","Répondues ("+answered.length+")"]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:tab===k?"var(--card)":"transparent",color:tab===k?"var(--text)":"var(--muted)",fontSize:11,fontWeight:tab===k?700:500,cursor:"pointer",fontFamily:"inherit",boxShadow:tab===k?"0 1px 4px rgba(0,0,0,.06)":"none"}}>{l}</button>)}
    </div>
    {shown.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36}}>✅</div><div style={{fontSize:13,color:"var(--muted)",marginTop:6}}>{tab==="pending"?"Aucune question en attente":"Aucune réponse"}</div></div>}
    {shown.map(q=><div key={q.id} style={{padding:14,background:"var(--card)",border:replyTo===q.id?"2px solid #6366F1":"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
      <div style={{fontSize:10,color:"var(--muted)",marginBottom:6}}>📦 {q.product} · {q.client} · {q.date}</div>
      <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>❓ {q.q}</div>
      {q.answered&&<div style={{padding:10,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:12,fontSize:12,color:"var(--sub)"}}><span style={{color:"#6366F1",fontWeight:600}}>↩️ Vous :</span> {q.a}</div>}
      {!q.answered&&replyTo!==q.id&&<button onClick={()=>{setReplyTo(q.id);setReplyText("")}} style={{padding:"7px 14px",borderRadius:10,border:"1px solid #6366F1",background:"transparent",color:"#6366F1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>↩️ Répondre</button>}
      {replyTo===q.id&&<div style={{marginTop:8}}><textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Votre réponse..." rows={2} style={{width:"100%",padding:10,borderRadius:12,border:"1px solid var(--border)",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box",color:"var(--text)",background:"var(--light)",resize:"vertical"}}/>
        <div style={{display:"flex",gap:8,marginTop:6}}><button onClick={()=>setReplyTo(null)} style={{flex:1,padding:8,borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Annuler</button><button onClick={()=>submitReply(q.id)} style={{flex:1,padding:8,borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Publier</button></div></div>}
    </div>)}
  </div>);
}
export default VQAScr;
