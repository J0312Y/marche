import { useState, useEffect, useRef } from "react";

function DrChatVendorScr({delivery:dl,onBack}){
  const now=()=>{const t=new Date();return `${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`};
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");const ref=useRef(null);const [typing,setTyping]=useState(false);

  useEffect(()=>{
    const timer=setTimeout(()=>{
      setMsgs([{from:"bot",text:`Bonjour ! La commande ${dl.ref} est prête. Venez la récupérer au magasin 📦`,time:now(),isWelcome:true}]);
    },500);
    return ()=>clearTimeout(timer);
  },[]);

  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs,typing]);

  const quickReplies=[["📍","Ma position"],["📦","Colis récupéré"],["⏱️","J'arrive dans 5 min"],["❓","C'est quel stand ?"]];
  const botResponses=["D'accord, merci !","Le colis est bien emballé.","À tout de suite !","Pas de souci.","On vous attend !","Stand 42, demandez Patrick.","Prenez soin du colis, c'est fragile !"];

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
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av" style={{background:"linear-gradient(135deg,#6366F1,#A855F7)",overflow:"hidden"}}>{dl.vendor.logo?<img src={dl.vendor.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:dl.vendor.avatar}</div><div className="ch-info"><h4>{dl.vendor.name}</h4><p>🏪 Commerce · {dl.ref}</p></div><button className="ch-call" style={{background:"#6366F1"}} onClick={()=>alert("📞 Appel")}>📞</button></div>
    <div className="chat-body" ref={ref}>
      {msgs.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#C4C1BA"}}><div style={{fontSize:36,marginBottom:8}}>🏪</div><div style={{fontSize:13}}>Connexion avec le commerce...</div></div>}
      {msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`} style={m.from==="user"?{background:"#10B981"}:{}}>
        {m.isWelcome&&<div style={{width:28,height:28,borderRadius:8,overflow:"hidden",marginBottom:4,display:"inline-block"}}>{dl.vendor.logo?<img src={dl.vendor.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:24}}>{dl.vendor.avatar}</span>}</div>}
        {m.text}<div className="msg-time">{m.time}</div>
      </div>)}
      {typing&&<div className="msg bot"><span className="typing-dots"><span style={{animation:"blink 1.2s infinite",animationDelay:"0s"}}>●</span><span style={{animation:"blink 1.2s infinite",animationDelay:"0.2s"}}>●</span><span style={{animation:"blink 1.2s infinite",animationDelay:"0.4s"}}>●</span></span></div>}
    </div>
    <div style={{padding:"8px 16px",background:"#F5F4F1",borderTop:"1px solid #E8E6E1",display:"flex",gap:6,flexShrink:0,overflowX:"auto"}}>
      {quickReplies.map(([icon,msg])=><button key={icon} onClick={()=>sendMsg(`${icon} ${msg}`)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #10B981",background:"rgba(16,185,129,0.04)",color:"#10B981",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>{icon} {msg}</button>)}
    </div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder="Message au vendeur..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/><button onClick={()=>sendMsg()} style={{background:"#10B981"}}>➤</button></div>
  </div>);
}

export default DrChatVendorScr;
