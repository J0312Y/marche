import { useState, useEffect, useRef } from "react";

function DrChatClientScr({delivery:dl,onBack}){
  const [msgs,setMsgs]=useState([
    {from:"user",text:"Bonjour "+dl.client.name.split(" ")[0]+" ! J'ai votre commande, je suis en route 🛵",time:"14:20"},
    {from:"bot",text:"Super merci ! Je suis à la maison.",time:"14:21"},
    {from:"user",text:"J'arrive dans environ "+dl.eta+". L'adresse est bien "+dl.client.addr.split(",")[0]+" ?",time:"14:22"},
    {from:"bot",text:"Oui c'est ça ! Portail bleu, je vous attends dehors.",time:"14:22"},
  ]);
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(p=>[...p,{from:"user",text:inp,time}]);setInp("");setTimeout(()=>setMsgs(p=>[...p,{from:"bot",text:["D'accord !","Merci !","Super, j'attends.","OK pas de souci.","Je suis devant."][Math.floor(Math.random()*5)],time}]),1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av" style={{background:"linear-gradient(135deg,#10B981,#059669)"}}>👤</div><div className="ch-info"><h4>{dl.client.name}</h4><p>🟢 Client · {dl.ref}</p></div><button className="ch-call" onClick={()=>alert("📞 Appel vers "+dl.client.name)}>📞</button></div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`} style={m.from==="user"?{background:"#10B981"}:{}}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div style={{padding:"8px 16px",background:"#F5F4F1",borderTop:"1px solid #E8E6E1",display:"flex",gap:8,flexShrink:0}}>{["📍 Ma position","⏱️ 5 min","🔔 Je suis là","📸 Photo colis"].map(q=><button key={q} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#5E5B53",whiteSpace:"nowrap"}}>{q}</button>)}</div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder={"Message à "+dl.client.name.split(" ")[0]+"..."} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send} style={{background:"#10B981"}}>➤</button></div>
  </div>);
}

/* D7 ── DRIVER HISTORY ── */

export default DrChatClientScr;
