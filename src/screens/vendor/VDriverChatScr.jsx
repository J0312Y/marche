import { useState, useEffect, useRef } from "react";

function VDriverChatScr({delivery:d,onBack}){
  const now=()=>{const t=new Date();return `${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`};
  const driverName=d.driver||d.name||"Livreur";
  const driverAv=d.driverAv||d.avatar||"🧑";
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");const ref=useRef(null);const [typing,setTyping]=useState(false);

  // Welcome message
  useEffect(()=>{
    const timer=setTimeout(()=>{
      setMsgs([
        {from:"bot",text:`Bonjour ! Je suis ${driverName}, je prends en charge la commande ${d.ref||""} 🛵`,time:now(),isWelcome:true},
      ]);
    },500);
    return ()=>clearTimeout(timer);
  },[]);

  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs,typing]);

  const quickReplies=[["📦","Le colis est prêt"],["📍","Adresse : "+((d.client?.addr||"Bacongo").split(",")[0])],["⚠️","Colis fragile, attention"],["💰","Total : "+(d.total||"12 500")+" FCFA"]];

  const botResponses=["Bien reçu chef ! 👍","OK, je gère ça.","C'est noté, pas de souci.","J'arrive dans 5 minutes.","Le client a été prévenu.","Je suis devant la boutique.","D'accord, je fais attention !","Parfait, en route ! 🛵"];

  const sendMsg=(text)=>{
    const msg=text||inp.trim();
    if(!msg)return;
    setMsgs(p=>[...p,{from:"user",text:msg,time:now()}]);
    setInp("");
    setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      setMsgs(p=>[...p,{from:"bot",text:botResponses[Math.floor(Math.random()*botResponses.length)],time:now()}]);
    },800+Math.random()*800);
  };

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head">
      <button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      <div className="ch-av" style={{background:"linear-gradient(135deg,#10B981,#059669)"}}>{driverAv}</div>
      <div className="ch-info"><h4>{driverName}</h4><p>🟢 En livraison{d.ref?` · ${d.ref}`:""}</p></div>
      <button className="ch-call" onClick={()=>alert("📞 Appel vers "+driverName)}>📞</button>
    </div>
    <div className="chat-body" ref={ref}>
      {msgs.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#C4C1BA"}}><div style={{fontSize:36,marginBottom:8}}>🛵</div><div style={{fontSize:13}}>Connexion avec le livreur...</div></div>}

      {msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>
        {m.isWelcome&&<div style={{fontSize:24,marginBottom:4}}>{driverAv}</div>}
        {m.text}<div className="msg-time">{m.time}</div>
      </div>)}

      {typing&&<div className="msg bot"><span className="typing-dots">
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0s"}}>●</span>
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0.2s"}}>●</span>
        <span style={{animation:"blink 1.2s infinite",animationDelay:"0.4s"}}>●</span>
      </span></div>}
    </div>
    <div style={{padding:"8px 16px",background:"#F5F4F1",borderTop:"1px solid #E8E6E1",display:"flex",gap:6,flexShrink:0,overflowX:"auto"}}>
      {quickReplies.map(([icon,msg])=><button key={icon} onClick={()=>sendMsg(`${icon} ${msg}`)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#5E5B53",whiteSpace:"nowrap",flexShrink:0}}>{icon} {msg.length>20?msg.slice(0,18)+"…":msg}</button>)}
    </div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder={`Message à ${driverName.split(" ")[0]}...`} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/><button onClick={()=>sendMsg()}>➤</button></div>
  </div>);
}

export default VDriverChatScr;
