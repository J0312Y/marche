import { useState } from "react";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";
function GiftCardScr({onBack}){
  const [gcErrors,setGcErrors]=useState({});
  const validateGc=()=>{
    const e={};
    if(!amount) e.amount="Montant requis";
    if(!to.trim()) e.to="Numéro requis";
    setGcErrors(e);
    if(Object.keys(e).length){toast.error("Remplissez les champs obligatoires");return false}
    return true;
  };
  const [amount,setAmount]=useState(null);const [to,setTo]=useState("");const [msg,setMsg]=useState("");const [done,setDone]=useState(false);
  const amounts=[5000,10000,25000,50000];
  const send=()=>{if(!amount||!to){toast.error("Montant et destinataire requis");return}setDone(true);validateGc()&&toast.success("Carte cadeau envoyée ! 🎁")};
  if(done)return(<div className="scr" style={{padding:16,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%"}}>
    <div style={{width:200,padding:24,background:"var(--card)",borderRadius:20,color:"var(--text)",border:"2px solid #F97316",marginBottom:20}}>
      <div style={{fontSize:28,marginBottom:4}}>🎁</div><div style={{fontSize:10,opacity:.7}}>Carte Cadeau Lamuka</div><div style={{fontSize:24,fontWeight:800,margin:"8px 0"}}>{fmt(amount)}</div><div style={{fontSize:11,opacity:.7}}>Pour: {to}</div>
    </div>
    <h3 style={{fontSize:18,fontWeight:700,marginBottom:4}}>Carte envoyée !</h3><p style={{fontSize:13,color:"var(--muted)"}}>Un SMS a été envoyé à {to}</p>
    <button className="btn-primary" style={{marginTop:20,maxWidth:280}} onClick={onBack}>Retour</button>
  </div>);
  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>🎁 Carte Cadeau</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:40,marginBottom:8}}>🎁</div><p style={{fontSize:13,color:"var(--muted)"}}>Offrez du shopping à vos proches</p></div>
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Choisir le montant</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
      {amounts.map(a=><div key={a} onClick={()=>setAmount(a)} style={{padding:16,borderRadius:14,border:amount===a?"2px solid #F97316":"1px solid var(--border)",background:amount===a?"rgba(249,115,22,0.06)":"var(--card)",cursor:"pointer",textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:amount===a?"#F97316":"var(--text)"}}>{fmt(a)}</div></div>)}
    </div>
    <div className="field"><label>Numéro du destinataire <span style={{color:"#EF4444"}}>*</span></label><input value={to} onChange={e=>setTo(e.target.value)} placeholder="+242 06X XXX XXX"/></div>
    <div className="field"><label>Message <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Joyeux anniversaire ! 🎂"/></div>
    <button className="btn-primary" onClick={send}>🎁 Envoyer la carte — {amount?fmt(amount):"..."}</button>
  </div>);
}
export default GiftCardScr;
