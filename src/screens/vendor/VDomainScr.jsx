import { useState } from "react";
import toast from "../../utils/toast";

function VDomainScr({onBack}){
  const [domain,setDomain]=useState("modeafrique");
  const [custom,setCustom]=useState("");
  const [connected,setConnected]=useState(false);

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>🔗 Domaine</h2><div style={{width:38}}/></div>

    {/* Current domain */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Votre adresse actuelle</div>
      <div style={{fontSize:16,fontWeight:700,color:"#F97316"}}>{domain}.lamuka.cg</div>
      <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>✅ Active et accessible</div>
    </div>

    {/* Edit subdomain */}
    <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Modifier le sous-domaine</div>
      <div style={{display:"flex",gap:4,alignItems:"center"}}>
        <input value={domain} onChange={e=>setDomain(e.target.value.replace(/[^a-z0-9-]/g,""))} style={{flex:1,padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--light)",fontSize:14,fontFamily:"inherit",color:"var(--text)"}}/>
        <span style={{fontSize:13,color:"var(--muted)",fontWeight:600,flexShrink:0}}>.lamuka.cg</span>
      </div>
      <button onClick={()=>toast.success("Sous-domaine mis à jour ✅")} style={{width:"100%",marginTop:10,padding:10,borderRadius:10,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Enregistrer</button>
    </div>

    {/* Custom domain */}
    <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Domaine personnalisé</div>
      <div style={{fontSize:11,color:"var(--muted)",marginBottom:10}}>Connectez votre propre nom de domaine (Plan Enterprise)</div>
      <div className="field"><label>Votre domaine</label><input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="www.maboutique.com"/></div>
      <button onClick={()=>{setConnected(true);toast.success("Domaine vérifié ✅")}} style={{width:"100%",padding:10,borderRadius:10,border:"none",background:connected?"#10B981":"#F97316",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{connected?"✅ Connecté":"Vérifier et connecter"}</button>
      {connected&&<div style={{marginTop:8,padding:10,background:"rgba(16,185,129,0.06)",borderRadius:10,fontSize:11,color:"var(--muted)"}}>
        Ajoutez ce CNAME à votre DNS :<br/><b style={{color:"var(--text)"}}>CNAME → shop.lamuka.cg</b>
      </div>}
    </div>
  </div>);
}
export default VDomainScr;
