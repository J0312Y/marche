import { useState, useEffect, useRef } from "react";

function ChatScr({onBack}){
  const now=()=>{const t=new Date();return `${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`};

  const driver={name:"Patrick Moukala",avatar:"🧑",vehicle:"🛵 Honda PCX"};
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");const ref=useRef(null);const [typing,setTyping]=useState(false);

  // Welcome on mount
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
    "D'accord, noté ! 👍",
    "Je suis presque arrivé !",
    "Pas de souci !",
    "Je vous appelle à l'arrivée 📞",
    "OK, encore quelques minutes !",
    "Bien reçu, merci ! 🛵",
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

  return(<>
    <div className="chat-head">
      <button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      <div className="ch-av">{driver.avatar}</div>
      <div className="ch-info"><h4>{driver.name}</h4><p>🟢 En ligne · {driver.vehicle}</p></div>
      <button className="ch-call">📞</button>
    </div>
    <div className="chat-body" ref={ref}>
      {msgs.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#C4C1BA"}}><div style={{fontSize:36,marginBottom:8}}>🛵</div><div style={{fontSize:13}}>Connexion avec votre livreur...</div></div>}

      {msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>
        {m.isWelcome&&<div style={{fontSize:28,marginBottom:6}}>{driver.avatar}</div>}
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
        {quickReplies.map(q=><button key={q} onClick={()=>send(q)} style={{padding:"8px 14px",borderRadius:20,border:"1px solid #10B981",background:"rgba(16,185,129,0.04)",color:"#10B981",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{q}</button>)}
      </div>}
    </div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder="Écrire..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={()=>send()}>➤</button></div>
  </>);
}

export default ChatScr;
