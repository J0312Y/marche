import { useState, useEffect, useRef } from "react";

function ChatScr({onBack}){
  const [msgs,setMsgs]=useState([{from:"bot",text:"Bonjour ! Je suis Patrick, votre livreur. J'ai récupéré votre commande 🛵",time:"14:35"},{from:"user",text:"Super ! Vous arrivez dans combien de temps ?",time:"14:36"},{from:"bot",text:"Environ 12 minutes, je suis en route !",time:"14:36"}]);
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs([...msgs,{from:"user",text:inp,time}]);setInp("");setTimeout(()=>{const r=["D'accord, noté ! 👍","Je suis presque arrivé !","Pas de souci !","Je vous appelle à l'arrivée.","OK, 5 minutes encore."];setMsgs(p=>[...p,{from:"bot",text:r[Math.floor(Math.random()*r.length)],time}])},1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av">🧑</div><div className="ch-info"><h4>Patrick Moukala</h4><p>🟢 En ligne</p></div><button className="ch-call">📞</button></div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder="Écrire..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}>➤</button></div>
  </div>);
}

/* 21 ── CHAT LIST ── */

export default ChatScr;
