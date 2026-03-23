import { useState } from "react";
import toast from "../../utils/toast";

const CAMPAIGNS=[
  {id:1,name:"Soldes de Mars",status:"sent",sent:245,opened:142,clicked:67,date:"15 Mar"},
  {id:2,name:"Nouveaux produits",status:"draft",sent:0,opened:0,clicked:0,date:"Brouillon"},
  {id:3,name:"Bienvenue nouveaux clients",status:"sent",sent:89,opened:61,clicked:28,date:"1 Mar"},
];

function VEmailScr({onBack}){
  const [campaigns,setCampaigns]=useState(CAMPAIGNS);
  const [creating,setCreating]=useState(false);
  const [name,setName]=useState("");
  const [subject,setSubject]=useState("");
  const [body,setBody]=useState("");

  const TEMPLATES=[
    ["🏷️","Promotion","Annoncez vos soldes et réductions"],
    ["📦","Nouveau produit","Présentez vos derniers articles"],
    ["👋","Bienvenue","Accueillez vos nouveaux clients"],
    ["⭐","Fidélité","Récompensez vos clients réguliers"],
  ];

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={creating?()=>setCreating(false):onBack}>←</button><h2>📧 Email Marketing</h2><div style={{width:38}}/></div>

    {creating?<>
      <div className="field"><label>Nom de la campagne</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Soldes de Printemps"/></div>
      <div className="field"><label>Objet de l'email</label><input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Ex: -30% sur tout le magasin !"/></div>
      <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--sub)",marginBottom:8}}>Template</label>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {TEMPLATES.map(([ic,n,d])=><div key={n} onClick={()=>{setName(n);setSubject(d);setBody("Bonjour,\n\n"+d+"\n\nVotre boutique sur Lamuka Market")}} style={{padding:"10px 14px",borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",fontSize:12,textAlign:"center"}}><div style={{fontSize:18}}>{ic}</div><div style={{fontWeight:600,marginTop:2}}>{n}</div></div>)}
      </div>
      <div className="field"><label>Contenu</label><textarea rows={5} value={body} onChange={e=>setBody(e.target.value)} placeholder="Rédigez votre message..." style={{width:"100%",padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:13,fontFamily:"inherit",color:"var(--text)",resize:"none"}}/></div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>{setCampaigns(p=>[{id:Date.now(),name:name||"Campagne",status:"draft",sent:0,opened:0,clicked:0,date:"Brouillon"},...p]);setCreating(false);toast.success("Brouillon sauvegardé 📝")}} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📝 Brouillon</button>
        <button onClick={()=>{setCampaigns(p=>[{id:Date.now(),name:name||"Campagne",status:"sent",sent:Math.floor(Math.random()*200)+50,opened:0,clicked:0,date:"Aujourd'hui"},...p]);setCreating(false);toast.success("Campagne envoyée ✅")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📤 Envoyer</button>
      </div>
    </>:<>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[["📤",campaigns.filter(c=>c.status==="sent").length,"Envoyées"],["📝",campaigns.filter(c=>c.status==="draft").length,"Brouillons"],["👁️",campaigns.reduce((s,c)=>s+c.opened,0),"Ouvertures"]].map(([ic,v,l])=>
          <div key={l} style={{flex:1,padding:"10px 0",textAlign:"center",background:"var(--card)",border:"1px solid var(--border)",borderRadius:12}}>
            <div style={{fontSize:12}}>{ic}</div><div style={{fontSize:16,fontWeight:700}}>{v}</div><div style={{fontSize:9,color:"var(--muted)"}}>{l}</div>
          </div>)}
      </div>

      {campaigns.map(c=>(
        <div key={c.id} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:14,fontWeight:700}}>{c.name}</span>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:c.status==="sent"?"rgba(16,185,129,0.08)":"rgba(245,158,11,0.08)",color:c.status==="sent"?"#10B981":"#F59E0B",fontWeight:600}}>{c.status==="sent"?"✅ Envoyée":"📝 Brouillon"}</span>
          </div>
          <div style={{fontSize:11,color:"var(--muted)"}}>{c.date} {c.sent>0&&`· ${c.sent} envoyés · ${c.opened} ouverts · ${c.clicked} clics`}</div>
          {c.sent>0&&<div style={{marginTop:6,height:4,borderRadius:2,background:"var(--light)"}}>
            <div style={{width:`${(c.opened/c.sent)*100}%`,height:"100%",borderRadius:2,background:"#10B981"}}/>
          </div>}
        </div>
      ))}

      <button onClick={()=>setCreating(true)} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>+ Nouvelle campagne</button>
    </>}
  </div>);
}
export default VEmailScr;
