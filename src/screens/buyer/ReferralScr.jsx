import { useState } from "react";
import toast from "../../utils/toast";
import { share } from "../../utils/share";
function ReferralScr({onBack}){
  const code="JOELDY2026";
  const invites=[{name:"Patrick M.",status:"inscrit",bonus:2000,date:"12 Fév"},{name:"Celine N.",status:"1ère commande",bonus:2000,date:"8 Fév"},{name:"David T.",status:"en attente",bonus:0,date:"5 Fév"}];
  const earned=invites.filter(i=>i.bonus>0).reduce((s,i)=>s+i.bonus,0);
  const copyCode=()=>{try{navigator.clipboard.writeText(code);toast.success("Code copié 📋")}catch(e){toast.info(code)}};
  const shareCode=async()=>{share({title:"Lamuka Market",text:`Rejoins Lamuka Market avec mon code ${code} et gagne 2 000 FCFA !`,url:"https://lamuka.market/ref/"+code})};
  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>Parrainage</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:20,background:"var(--card)",borderRadius:20,color:"var(--text)",border:"1px solid var(--border)",borderLeft:"4px solid #F97316",marginBottom:14}}>
      <div style={{fontSize:40,marginBottom:8}}>🎁</div>
      <h3 style={{fontSize:18,fontWeight:700,marginBottom:4}}>Invitez, Gagnez !</h3>
      <p style={{fontSize:13,opacity:.8,lineHeight:1.5}}>Partagez votre code et gagnez <b>2 000 FCFA</b> chacun.</p>
    </div>
    <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14,textAlign:"center"}}>
      <div style={{fontSize:11,color:"var(--muted)",marginBottom:6}}>Votre code de parrainage</div>
      <div style={{fontSize:24,fontWeight:800,letterSpacing:2,color:"#F97316",marginBottom:10}}>{code}</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={copyCode} style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>📋 Copier</button>
        <button onClick={shareCode} style={{flex:1,padding:10,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📤 Partager</button>
      </div>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <div style={{flex:1,padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#10B981"}}>{earned.toLocaleString()} F</div><div style={{fontSize:10,color:"var(--muted)"}}>Total gagné</div></div>
      <div style={{flex:1,padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#F97316"}}>{invites.length}</div><div style={{fontSize:10,color:"var(--muted)"}}>Amis invités</div></div>
    </div>
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Mes invitations</div>
    {invites.map((inv,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)"}}><div style={{width:36,height:36,borderRadius:10,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>👤</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{inv.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{inv.date} · {inv.status}</div></div><span style={{fontSize:12,fontWeight:700,color:inv.bonus>0?"#10B981":"var(--muted)"}}>{inv.bonus>0?`+${inv.bonus.toLocaleString()} F`:"En attente"}</span></div>)}
    <div style={{marginTop:14,padding:14,background:"var(--light)",borderRadius:14}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>Comment ça marche ?</div>
      {[["1️⃣","Partagez votre code"],["2️⃣","Votre ami s'inscrit"],["3️⃣","Il passe sa 1ère commande"],["4️⃣","2 000 FCFA chacun !"]].map(([n,t])=><div key={n} style={{display:"flex",gap:8,padding:"4px 0",fontSize:12,color:"var(--sub)"}}><span>{n}</span><span>{t}</span></div>)}
    </div>
  </div>);
}
export default ReferralScr;
