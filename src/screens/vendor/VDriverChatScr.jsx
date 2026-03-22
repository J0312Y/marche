import toast from "../../utils/toast";
import { useState, useEffect, useRef } from "react";
import { DRIVER_PHOTO } from "../../data/images";

function VDriverChatScr({delivery:d,onBack}){
  const now=()=>{const t=new Date();return `${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`};
  const driverName=d.driver||d.name||"Livreur";
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");const ref=useRef(null);const fileRef=useRef(null);const [typing,setTyping]=useState(false);const [viewImg,setViewImg]=useState(null);

  useEffect(()=>{setTimeout(()=>{setMsgs([{from:"bot",text:`Bonjour ! C'est ${driverName}, votre livreur. Je suis en route pour récupérer la commande 📦`,time:now(),isWelcome:true}])},500);return()=>{}},[]);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs,typing]);

  const quickReplies=["La commande est prête","Où êtes-vous ?","Attention fragile","Merci !"];
  const botReplies=["J'arrive dans 5 min !","Compris, je fais attention.","D'accord noté !","Pas de souci.","Je suis devant le magasin !"];

  const sendMsg=(text)=>{const msg=text||inp.trim();if(!msg)return;setMsgs(p=>[...p,{from:"user",text:msg,time:now()}]);setInp("");setTyping(true);setTimeout(()=>{setTyping(false);setMsgs(p=>[...p,{from:"bot",text:botReplies[Math.floor(Math.random()*botReplies.length)],time:now()}])},800+Math.random()*600)};

  const handleFileUpload=(e)=>{const file=e.target.files?.[0];if(!file||file.size>5*1024*1024)return;const reader=new FileReader();reader.onload=()=>{const isImg=file.type.startsWith("image/");setMsgs(p=>[...p,{from:"user",text:isImg?"":"📎 "+file.name,time:now(),attachment:{type:isImg?"image":"file",url:isImg?reader.result:null,name:file.name,size:(file.size/1024).toFixed(0)+" KB"}}]);setTyping(true);setTimeout(()=>{setTyping(false);setMsgs(p=>[...p,{from:"bot",text:isImg?"Photo reçue ! 📸":"Fichier reçu ! 📄",time:now()}])},1000)};reader.readAsDataURL(file);e.target.value=""};

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><div style={{position:"relative"}}><div className="ch-av" style={{overflow:"hidden",padding:0}}><img src={DRIVER_PHOTO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div><div style={{position:"absolute",bottom:-1,right:-1,width:10,height:10,borderRadius:"50%",background:"#10B981",border:"2px solid #fff"}}/></div><div className="ch-info"><h4>{driverName}</h4><p style={{fontSize:11,color:"var(--muted)"}}>🟢 En ligne · 📍 Talangaï · 🛵 Livreur</p></div><button className="ch-call" onClick={()=>toast.info("📞 Appel")}>📞</button></div>
    <div className="chat-body" ref={ref}>
      {msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>
        {m.isWelcome&&<div style={{width:24,height:24,borderRadius:6,overflow:"hidden",marginBottom:4}}><img src={DRIVER_PHOTO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>}
        {m.attachment&&m.attachment.type==="image"&&m.attachment.url&&<img src={m.attachment.url} alt="" onClick={()=>setViewImg(m.attachment.url)} style={{maxWidth:"100%",maxHeight:180,borderRadius:10,marginBottom:4,cursor:"pointer"}}/>}
        {m.attachment&&m.attachment.type==="file"&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"rgba(0,0,0,.05)",borderRadius:10,marginBottom:4}}><span style={{fontSize:20}}>📄</span><div><div style={{fontSize:12,fontWeight:600}}>{m.attachment.name}</div><div style={{fontSize:10,opacity:.7}}>{m.attachment.size}</div></div></div>}
        {m.text&&<span>{m.text}</span>}<div className="msg-time">{m.time}</div>
      </div>)}
      {typing&&<div className="msg bot"><span className="typing-dots"><span style={{animation:"blink 1.2s infinite"}}>●</span><span style={{animation:"blink 1.2s infinite",animationDelay:".2s"}}>●</span><span style={{animation:"blink 1.2s infinite",animationDelay:".4s"}}>●</span></span></div>}
      {msgs.length===1&&msgs[0].isWelcome&&<div style={{display:"flex",gap:6,flexWrap:"wrap",padding:"8px 0"}}>{quickReplies.map(q=><button key={q} onClick={()=>sendMsg(q)} style={{padding:"8px 14px",borderRadius:20,border:"1px solid #6366F1",background:"rgba(99,102,241,0.04)",color:"#6366F1",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{q}</button>)}</div>}
    </div>
    <div className="chat-input"><button className="chat-attach" onClick={()=>fileRef.current?.click()}>📎</button><input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{display:"none"}} onChange={handleFileUpload}/><input placeholder="Message au livreur..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/><button onClick={()=>sendMsg()}>➤</button></div>
    {viewImg&&<div onClick={()=>setViewImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:20}}><img src={viewImg} alt="" style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:12,objectFit:"contain"}}/></div>}
  </div>);
}
export default VDriverChatScr;
