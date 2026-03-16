import toast from "../../utils/toast";
import { useState, useEffect, useRef } from "react";
import { VENDOR_LOGO_DEFAULT } from "../../data/images";

function ChatVendorScr({onBack,vendorName,vendorAvatar,vendor}){
  const now=()=>{const t=new Date();return `${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`};
  const vName=vendorName||vendor?.vendorName||vendor?.name||"Chez Mama Ngudi";const vAv=vendorAvatar||vendor?.vendorAvatar||vendor?.avatar||"🍽️";
  const vInfo={name:vName,avatar:vAv,online:true,zone:"Bacongo",lastSeen:"En ligne"};
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");const ref=useRef(null);const fileRef=useRef(null);const [typing,setTyping]=useState(false);

  useEffect(()=>{
    const timer=setTimeout(()=>{
      setMsgs([{from:"bot",text:`Bienvenue chez ${vInfo.name} ! 🎉\nComment puis-je vous aider ?`,time:now(),isWelcome:true}]);
    },600);
    return ()=>clearTimeout(timer);
  },[]);

  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs,typing]);

  const quickReplies=["Horaires d'ouverture ?","Vous livrez où ?","Un produit est disponible ?","Modes de paiement ?"];

  const botResponses={
    "Horaires d'ouverture ?":"Nous sommes ouverts de 8h à 22h, 7j/7 ! ⏰",
    "Vous livrez où ?":"Nous livrons dans tout Brazzaville ! Bacongo, Poto-Poto, Moungali, Ouenzé... 🚚",
    "Un produit est disponible ?":"Bien sûr ! Quel produit cherchez-vous ? 🔍",
    "Modes de paiement ?":"Nous acceptons Airtel Money, MTN MoMo et paiement à la livraison 💳",
  };

  const fallbackResponses=[
    "Merci pour votre message ! Un membre de notre équipe vous répond bientôt. 😊",
    "Bonne question ! Laissez-moi vérifier et je reviens vers vous. 🔍",
    "Bien noté ! On s'en occupe. 👍",
    "Merci de votre intérêt ! N'hésitez pas à passer commande. 🛍️",
  ];

  const send=(text)=>{
    const msg=text||inp.trim();
    if(!msg)return;
    setMsgs(p=>[...p,{from:"user",text:msg,time:now()}]);
    setInp("");
    setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      const reply=botResponses[msg]||fallbackResponses[Math.floor(Math.random()*fallbackResponses.length)];
      setMsgs(p=>[...p,{from:"bot",text:reply,time:now()}]);
    },800+Math.random()*600);
  };

  const handleFileUpload=(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    if(file.size>5*1024*1024){toast.error("Fichier trop volumineux (max 5 Mo) ⚠️");return;}
    const reader=new FileReader();
    reader.onload=()=>{
      const isImage=file.type.startsWith("image/");
      setMsgs(p=>[...p,{from:"user",text:isImage?"":"📎 "+file.name,time:now(),
        attachment:{type:isImage?"image":"file",url:isImage?reader.result:null,name:file.name,size:(file.size/1024).toFixed(0)+" KB"}}]);
      setTyping(true);
      setTimeout(()=>{
        setTyping(false);
        setMsgs(p=>[...p,{from:"bot",text:isImage?"Photo bien reçue ! 📸":"Document reçu, merci ! 📄",time:now()}]);
      },1000);
    };
    reader.readAsDataURL(file);
    e.target.value="";
  };

  const [viewImg,setViewImg]=useState(null);

  return(<>
    <div className="chat-head">
      <button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#191815" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
      <div style={{position:"relative"}}>
        <div className="ch-av" style={{overflow:"hidden",padding:0}}><img src={VENDOR_LOGO_DEFAULT} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
        <div style={{position:"absolute",bottom:-1,right:-1,width:10,height:10,borderRadius:"50%",background:vInfo.online?"#10B981":"var(--muted)",border:"2px solid #fff"}}/>
      </div>
      <div className="ch-info">
        <h4>{vInfo.name}</h4>
        <p style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"var(--muted)"}}>
          <span style={{color:vInfo.online?"#10B981":"var(--muted)",fontWeight:600}}>{vInfo.online?"🟢 En ligne":"⚪ Hors ligne"}</span>
          <span>·</span>
          <span>📍 {vInfo.zone}</span>
        </p>
      </div>
      <button className="ch-call">📞</button>
    </div>

    <div className="chat-body" ref={ref}>
      {msgs.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"var(--muted)"}}><div style={{fontSize:36,marginBottom:8}}>{vInfo.avatar}</div><div style={{fontSize:13}}>Connexion avec {vInfo.name}...</div></div>}

      {msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>
        {m.isWelcome&&<div style={{width:28,height:28,borderRadius:8,overflow:"hidden",marginBottom:6}}><img src={VENDOR_LOGO_DEFAULT} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>}
        {m.attachment&&m.attachment.type==="image"&&m.attachment.url&&(
          <img src={m.attachment.url} alt="" onClick={()=>setViewImg(m.attachment.url)} style={{maxWidth:"100%",maxHeight:180,borderRadius:10,marginBottom:4,cursor:"pointer"}}/>
        )}
        {m.attachment&&m.attachment.type==="file"&&(
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:m.from==="user"?"rgba(255,255,255,.15)":"rgba(0,0,0,.05)",borderRadius:10,marginBottom:4}}>
            <span style={{fontSize:20}}>📄</span>
            <div><div style={{fontSize:12,fontWeight:600}}>{m.attachment.name}</div><div style={{fontSize:10,opacity:.7}}>{m.attachment.size}</div></div>
          </div>
        )}
        {m.text&&m.text.split("\n").map((line,j)=><span key={j}>{line}{j<m.text.split("\n").length-1&&<br/>}</span>)}
        <div className="msg-time">{m.time}</div>
      </div>)}

      {typing&&<div className="msg bot"><span className="typing-dots">
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0s"}}>●</span>
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0.2s"}}>●</span>
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0.4s"}}>●</span>
      </span></div>}

      {msgs.length===1&&msgs[0].isWelcome&&<div style={{display:"flex",gap:6,flexWrap:"wrap",padding:"8px 0"}}>
        {quickReplies.map(q=><button key={q} onClick={()=>send(q)} style={{padding:"8px 14px",borderRadius:20,border:"1px solid #6366F1",background:"rgba(99,102,241,0.04)",color:"#6366F1",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{q}</button>)}
      </div>}
    </div>

    <div className="chat-input">
      <button className="chat-attach" onClick={()=>fileRef.current?.click()}>📎</button>
      <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{display:"none"}} onChange={handleFileUpload}/>
      <input placeholder="Écrire..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
      <button onClick={()=>send()}>➤</button>
    </div>

    {viewImg&&(
      <div onClick={()=>setViewImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:20}}>
        <img src={viewImg} alt="" style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:12,objectFit:"contain"}}/>
        <button style={{position:"absolute",top:20,right:20,width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,.2)",border:"none",color:"#fff",fontSize:20,cursor:"pointer"}}>✕</button>
      </div>
    )}
  </>);
}

export default ChatVendorScr;
