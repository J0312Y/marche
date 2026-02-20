import { useState, useEffect, useRef } from "react";

function VDriverChatScr({delivery:d,onBack}){
  const driverName=d.driver||d.name||"Livreur";
  const driverAv=d.driverAv||d.avatar||"🧑";
  const [msgs,setMsgs]=useState([
    {from:"user",text:`Salut ${driverName.split(" ")[0]}, la commande ${d.ref||""} est prête au magasin.`,time:"14:08"},
    {from:"bot",text:"OK je suis en route, j'arrive dans 10 minutes ! 🛵",time:"14:09"},
    {from:"user",text:"Parfait. Le client est au Quartier Bacongo, Rue 14.",time:"14:10"},
    {from:"bot",text:"Noté. Je récupère le colis et je file direct. Tu peux me suivre sur la carte.",time:"14:10"},
  ]);
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(p=>[...p,{from:"user",text:inp,time}]);setInp("");
    setTimeout(()=>{const r=["Bien reçu chef ! 👍","OK, je gère ça.","Le client a été prévenu.","J'arrive dans 5 minutes.","C'est noté, pas de souci.","Je suis devant la boutique."];setMsgs(p=>[...p,{from:"bot",text:r[Math.floor(Math.random()*r.length)],time}])},1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head">
      <button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      <div className="ch-av" style={{background:"linear-gradient(135deg,#10B981,#059669)"}}>{driverAv}</div>
      <div className="ch-info"><h4>{driverName}</h4><p>🟢 En livraison{d.ref?` · ${d.ref}`:""}</p></div>
      <button className="ch-call" onClick={()=>alert("📞 Appel vers "+driverName)}>📞</button>
    </div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div style={{padding:"8px 16px",background:"#F5F4F1",borderTop:"1px solid #E8E6E1",display:"flex",gap:8,flexShrink:0}}>
      {["📍 Position","📸 Photo colis","✅ Livré"].map(q=><button key={q} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#5E5B53",whiteSpace:"nowrap"}}>{q}</button>)}
    </div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder={`Message à ${driverName.split(" ")[0]}...`} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}>➤</button></div>
  </div>);
}

/* V13 ── VENDOR NOTIFICATIONS ── */

export default VDriverChatScr;
