import { useState, useEffect, useRef } from "react";

function ChatVendorScr({vendor:v,onBack}){
  const [msgs,setMsgs]=useState([
    {from:"bot",text:`Bienvenue chez ${v.name} ! 👋 Comment pouvons-nous vous aider ?`,time:"14:30"},
    {from:"user",text:"Bonjour ! Est-ce que la Robe Wax est disponible en taille M ?",time:"14:31"},
    {from:"bot",text:"Oui, nous avons la taille M en stock ! Voulez-vous la commander directement ?",time:"14:31"},
  ]);
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(p=>[...p,{from:"user",text:inp,time}]);setInp("");
    setTimeout(()=>{const r=["Bien sûr, je vérifie pour vous ! 👍","Oui c'est disponible ! Voulez-vous commander ?","Merci pour votre intérêt ! Nous avons plusieurs modèles.","Je vous envoie les détails tout de suite.","N'hésitez pas si vous avez d'autres questions !","La livraison est possible demain à Brazzaville."];setMsgs(p=>[...p,{from:"bot",text:r[Math.floor(Math.random()*r.length)],time}])},1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av" style={{background:v.verified?"linear-gradient(135deg,#6366F1,#A855F7)":"#F5F4F1"}}>{v.avatar}</div><div className="ch-info"><h4>{v.name}{v.verified?" ✓":""}</h4><p>🟢 En ligne · {v.loc}</p></div></div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder={`Message à ${v.name}...`} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}>➤</button></div>
  </div>);
}

export default ChatVendorScr;
