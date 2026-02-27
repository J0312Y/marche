import { useState, useEffect, useRef } from "react";

function ChatVendorScr({vendor:v,onBack}){
  const now=()=>{const t=new Date();return `${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`};

  // Welcome message only (first contact)
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");const ref=useRef(null);const [typing,setTyping]=useState(false);

  // Show welcome on mount
  useEffect(()=>{
    const timer=setTimeout(()=>{
      setMsgs([{from:"bot",text:`Bienvenue chez ${v.name} ! 👋\nComment pouvons-nous vous aider ?`,time:now(),isWelcome:true}]);
    },600);
    return ()=>clearTimeout(timer);
  },[]);

  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs,typing]);

  const quickReplies=["Vos horaires ?","C'est disponible ?","Délai de livraison ?","Voir le menu"];

  const botResponses={
    "Vos horaires ?":"Nous sommes ouverts du lundi au samedi, de 8h à 21h. Le dimanche de 9h à 15h ! 🕐",
    "C'est disponible ?":"Oui, la plupart de nos articles sont en stock ! Quel produit vous intéresse ? 😊",
    "Délai de livraison ?":"La livraison se fait sous 30-60 minutes dans Brazzaville. Gratuite à partir de 15 000 FCFA ! 🛵",
    "Voir le menu":"Vous pouvez consulter tous nos articles sur notre page. N'hésitez pas à demander si quelque chose vous intéresse ! 📋",
  };

  const fallbackResponses=[
    "Bien sûr, je vérifie pour vous ! 👍",
    "Merci pour votre message ! Un instant s'il vous plaît.",
    "Oui c'est disponible ! Voulez-vous commander ?",
    "Je vous envoie les détails tout de suite.",
    "N'hésitez pas si vous avez d'autres questions !",
    "La livraison est possible aujourd'hui à Brazzaville 🛵",
    "Avec plaisir ! Autre chose dont vous avez besoin ?",
  ];

  const send=(text)=>{
    const msg=text||inp.trim();
    if(!msg)return;
    const time=now();
    setMsgs(p=>[...p,{from:"user",text:msg,time}]);
    setInp("");
    setTyping(true);

    setTimeout(()=>{
      setTyping(false);
      const reply=botResponses[msg]||fallbackResponses[Math.floor(Math.random()*fallbackResponses.length)];
      setMsgs(p=>[...p,{from:"bot",text:reply,time:now()}]);
    },1000+Math.random()*800);
  };

  return(<>
    <div className="chat-head">
      <button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      <div className="ch-av" style={{background:v.verified?"linear-gradient(135deg,#6366F1,#A855F7)":"#F5F4F1",overflow:"hidden"}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:v.avatar}</div>
      <div className="ch-info"><h4>{v.name}{v.verified?" ✓":""}</h4><p>🟢 En ligne · {v.loc}</p></div>
    </div>
    <div className="chat-body" ref={ref}>
      {msgs.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#C4C1BA"}}><div style={{fontSize:36,marginBottom:8}}>💬</div><div style={{fontSize:13}}>Démarrez la conversation...</div></div>}

      {msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>
        {m.isWelcome&&<div style={{width:36,height:36,borderRadius:10,overflow:"hidden",marginBottom:6,display:"inline-block"}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:28}}>{v.avatar}</span>}</div>}
        {m.text.split("\n").map((line,j)=><span key={j}>{line}{j<m.text.split("\n").length-1&&<br/>}</span>)}
        <div className="msg-time">{m.time}</div>
      </div>)}

      {typing&&<div className="msg bot"><span className="typing-dots">
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0s"}}>●</span>
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0.2s"}}>●</span>
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0.4s"}}>●</span>
      </span></div>}

      {/* Quick replies after welcome */}
      {msgs.length===1&&msgs[0].isWelcome&&<div style={{display:"flex",gap:6,flexWrap:"wrap",padding:"8px 0"}}>
        {quickReplies.map(q=><button key={q} onClick={()=>send(q)} style={{padding:"8px 14px",borderRadius:20,border:"1px solid #6366F1",background:"rgba(99,102,241,0.04)",color:"#6366F1",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{q}</button>)}
      </div>}
    </div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder={`Message à ${v.name}...`} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={()=>send()}>➤</button></div>
  </>);
}

export default ChatVendorScr;
