import toast from "../../utils/toast";
import { useState, useEffect, useRef } from "react";
import { DRIVER_PHOTO } from "../../data/images";

function ChatScr({onBack}){
  const now=()=>{const t=new Date();return `${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`};

  const driver={name:"Patrick Moukala",avatar:"https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face",vehicle:"🛵 Honda PCX",online:true,zone:"Bacongo",lastSeen:"En ligne"};
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");const ref=useRef(null);const fileRef=useRef(null);const [typing,setTyping]=useState(false);

  useEffect(()=>{
    const timer=setTimeout(()=>{
      setMsgs([{from:"bot",text:`Bonjour ! Je suis ${driver.name}, votre livreur ${driver.vehicle}.\nJ'ai récupéré votre commande et je suis en route ! 📍`,time:now(),isWelcome:true}]);
    },600);
    return ()=>clearTimeout(timer);
  },[]);

  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs,typing]);

  const quickReplies=["Vous êtes où ?","Combien de temps ?","Je suis au portail","Appelez-moi en arrivant"];

  const botResponses={
    "Vous êtes où ?":"Je suis à environ 800m de chez vous, j'arrive bientôt ! 📍",
    "Combien de temps ?":"Environ 8-10 minutes, le trafic est fluide ! ⏱️",
    "Je suis au portail":"Parfait, je suis presque là ! Restez au portail. 👍",
    "Appelez-moi en arrivant":"D'accord, je vous appelle dès que je suis devant ! 📞",
  };

  const fallbackResponses=[
    "D'accord, noté ! 👍","Je suis presque arrivé !","Pas de souci !",
    "Je vous appelle à l'arrivée 📞","OK, encore quelques minutes !","Bien reçu, merci ! 🛵",
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
      // Bot reply
      setTyping(true);
      setTimeout(()=>{
        setTyping(false);
        setMsgs(p=>[...p,{from:"bot",text:isImage?"Bien reçu, merci pour la photo ! 👍":"Fichier bien reçu ! 📄",time:now()}]);
      },1000);
    };
    reader.readAsDataURL(file);
    e.target.value="";
  };

  const [viewImg,setViewImg]=useState(null);

  return(<>
    {/* Header with online status + zone */}
    <div className="chat-head">
      <button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
      <div style={{position:"relative"}}>
        <div className="ch-av" style={{overflow:"hidden",padding:0}}><img src={DRIVER_PHOTO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
        <div style={{position:"absolute",bottom:-1,right:-1,width:10,height:10,borderRadius:"50%",background:driver.online?"#10B981":"var(--muted)",border:"2px solid #fff"}}/>
      </div>
      <div className="ch-info">
        <h4>{driver.name}</h4>
        <p style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"var(--muted)"}}>
          <span style={{color:driver.online?"#10B981":"var(--muted)",fontWeight:600}}>{driver.online?"🟢 En ligne":"⚪ Hors ligne"}</span>
          <span>·</span>
          <span>📍 {driver.zone}</span>
          <span>·</span>
          <span>{driver.vehicle}</span>
        </p>
      </div>
      <button className="ch-call" onClick={()=>window.location.href="tel:+242064663469"}>📞</button>
    </div>

    <div className="chat-body" ref={ref}>
      {msgs.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"var(--muted)"}}><div style={{fontSize:36,marginBottom:8}}>🛵</div><div style={{fontSize:13}}>Connexion avec votre livreur...</div></div>}

      {msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>
        {m.isWelcome&&<div style={{width:28,height:28,borderRadius:8,overflow:"hidden",marginBottom:6}}><img src={DRIVER_PHOTO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>}
        {/* Image attachment */}
        {m.attachment&&m.attachment.type==="image"&&m.attachment.url&&(
          <img src={m.attachment.url} alt="" onClick={()=>setViewImg(m.attachment.url)} style={{maxWidth:"100%",maxHeight:180,borderRadius:10,marginBottom:4,cursor:"pointer"}}/>
        )}
        {/* File attachment */}
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
        {quickReplies.map(q=><button key={q} onClick={()=>send(q)} style={{padding:"8px 14px",borderRadius:20,border:"1px solid #10B981",background:"rgba(249,115,22,0.04)",color:"#10B981",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{q}</button>)}
      </div>}
    </div>

    {/* Input with attachment */}
    <div className="chat-input">
      <button className="chat-attach" onClick={()=>fileRef.current?.click()}>📎</button>
      <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{display:"none"}} onChange={handleFileUpload}/>
      <input placeholder="Écrire..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
      <button onClick={()=>send()}>➤</button>
    </div>

    {/* Image fullscreen */}
    {viewImg&&(
      <div onClick={()=>setViewImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:20}}>
        <img src={viewImg} alt="" style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:12,objectFit:"contain"}}/>
        <button style={{position:"absolute",top:20,right:20,width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,.2)",border:"none",color:"#fff",fontSize:20,cursor:"pointer"}} onClick={()=>setViewImg?.(null)}>✕</button>
      </div>
    )}
  </>);
}

export default ChatScr;
