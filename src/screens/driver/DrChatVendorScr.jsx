import { useState, useEffect, useRef } from "react";

function DrChatVendorScr({delivery:dl,onBack}){
  const [msgs,setMsgs]=useState([
    {from:"user",text:"Bonjour, je suis en route pour récupérer la commande "+dl.ref,time:"14:08"},
    {from:"bot",text:"Parfait ! Le colis est prêt au Stand 42. Demandez Patrick.",time:"14:09"},
    {from:"user",text:"J'arrive dans 5 minutes 🛵",time:"14:10"},
  ]);
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(p=>[...p,{from:"user",text:inp,time}]);setInp("");setTimeout(()=>setMsgs(p=>[...p,{from:"bot",text:["D'accord, merci !","Le colis est bien emballé.","À tout de suite !","Pas de souci."][Math.floor(Math.random()*4)],time}]),1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av" style={{background:"linear-gradient(135deg,#6366F1,#A855F7)"}}>{dl.vendor.avatar}</div><div className="ch-info"><h4>{dl.vendor.name}</h4><p>🏪 Commerce · {dl.ref}</p></div><button className="ch-call" style={{background:"#6366F1"}} onClick={()=>alert("📞 Appel")}>📞</button></div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`} style={m.from==="user"?{background:"#10B981"}:{}}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div style={{padding:"8px 16px",background:"#F5F4F1",borderTop:"1px solid #E8E6E1",display:"flex",gap:8,flexShrink:0}}>{["📍 Ma position","📦 Colis récupéré","⏱️ J'arrive"].map(q=><button key={q} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#5E5B53",whiteSpace:"nowrap"}}>{q}</button>)}</div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder="Message au vendeur..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send} style={{background:"#10B981"}}>➤</button></div>
  </div>);
}

/* D6 ── DRIVER → CLIENT CHAT ── */

export default DrChatVendorScr;
