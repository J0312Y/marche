import { useState, useEffect, useRef } from "react";
import { REVIEWS } from "../../data";

function VChatScr({chat:c,onBack}){
  const [msgs,setMsgs]=useState([{from:"bot",text:`Bonjour, ${c?.name?.split(" ")[0]||"client"} ! Comment puis-je vous aider ?`,time:"14:40"},{from:"user",text:"La robe est disponible en taille L ?",time:"14:42"}.from==="user"?{from:"bot",text:"Oui, nous avons la taille L en stock ! Voulez-vous commander ?",time:"14:42"}:{from:"bot",text:"Bienvenue !",time:"14:40"}].filter(Boolean));
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight);},[msgs]);
  const initMsgs=[{from:"bot",text:`Bonjour ! Je suis intéressé(e) par vos articles.`,time:"14:40"},{from:"user",text:"Bonjour ! Bienvenue sur notre commerce. Comment puis-je vous aider ?",time:"14:41"},{from:"bot",text:c?.lastMsg||"C'est disponible en L ?",time:"14:42"}];
  useEffect(()=>{setMsgs(initMsgs)},[]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(p=>[...p,{from:"user",text:inp,time}]);setInp("");setTimeout(()=>setMsgs(p=>[...p,{from:"bot",text:["Merci !","D'accord, je vais voir.","Super, je commande !","C'est noté."][Math.floor(Math.random()*4)],time}]),1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av">{c?.avatar||"👤"}</div><div className="ch-info"><h4>{c?.name||"Client"}</h4><p>🟢 En ligne</p></div></div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder="Répondre..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}>➤</button></div>
  </div>);
}

/* V10 ── VENDOR REVIEWS ── */

export default VChatScr;
