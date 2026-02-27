import { useState, useEffect, useRef } from "react";

function VChatScr({chat:c,onBack}){
  const now=()=>{const t=new Date();return `${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`};
  const clientName=c?.name||"Client";
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");const ref=useRef(null);const [typing,setTyping]=useState(false);

  // Welcome message from client
  useEffect(()=>{
    const timer=setTimeout(()=>{
      setMsgs([
        {from:"bot",text:`Bonjour ! Je suis intéressé(e) par vos articles.`,time:now()},
        {from:"bot",text:c?.lastMsg||"C'est disponible en taille L ?",time:now()},
      ]);
    },400);
    return ()=>clearTimeout(timer);
  },[]);

  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs,typing]);

  const quickReplies=["Oui, c'est disponible !","Je vérifie le stock","Livraison possible aujourd'hui","Voir nos promotions"];

  const botResponses={
    "Oui, c'est disponible !":[" Super ! Je veux commander.","Parfait, comment je fais pour payer ?"],
    "Je vérifie le stock":["D'accord, j'attends votre retour !","Merci, prenez votre temps."],
    "Livraison possible aujourd'hui":["Génial ! Je suis à Bacongo.","Ah super, combien ça coûte la livraison ?"],
    "Voir nos promotions":["Ah oui ! Montrez-moi ça.","Je suis intéressé(e), envoyez les détails."],
  };

  const fallbackResponses=["Merci !","D'accord, je vais voir.","Super, je commande !","C'est noté.","Parfait, merci beaucoup !","OK j'attends votre retour."];

  const sendMsg=(text)=>{
    const msg=text||inp.trim();
    if(!msg)return;
    setMsgs(p=>[...p,{from:"user",text:msg,time:now()}]);
    setInp("");
    setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      const replies=botResponses[msg];
      const reply=replies?replies[Math.floor(Math.random()*replies.length)]:fallbackResponses[Math.floor(Math.random()*fallbackResponses.length)];
      setMsgs(p=>[...p,{from:"bot",text:reply,time:now()}]);
    },1000+Math.random()*800);
  };

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head">
      <button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      <div className="ch-av">{c?.avatar||"👤"}</div>
      <div className="ch-info"><h4>{clientName}</h4><p>🟢 En ligne</p></div>
    </div>
    <div className="chat-body" ref={ref}>
      {msgs.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#C4C1BA"}}><div style={{fontSize:36,marginBottom:8}}>💬</div><div style={{fontSize:13}}>Chargement...</div></div>}

      {msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>{m.text}<div className="msg-time">{m.time}</div></div>)}

      {typing&&<div className="msg bot"><span className="typing-dots">
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0s"}}>●</span>
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0.2s"}}>●</span>
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0.4s"}}>●</span>
      </span></div>}
    </div>
    <div style={{padding:"8px 16px",background:"#F5F4F1",borderTop:"1px solid #E8E6E1",display:"flex",gap:6,flexShrink:0,overflowX:"auto"}}>
      {quickReplies.map(q=><button key={q} onClick={()=>sendMsg(q)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #6366F1",background:"rgba(99,102,241,0.04)",color:"#6366F1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>{q}</button>)}
    </div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder={`Répondre à ${clientName.split(" ")[0]}...`} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/><button onClick={()=>sendMsg()}>➤</button></div>
  </div>);
}

export default VChatScr;
