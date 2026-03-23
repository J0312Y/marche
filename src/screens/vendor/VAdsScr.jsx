import { useState } from "react";
import toast from "../../utils/toast";

const ADS=[
  {id:1,name:"Galaxy A54 — Sponsor recherche",status:"active",budget:15000,spent:8200,clicks:145,impressions:3200,ctr:"4.5%"},
  {id:2,name:"Soldes Mode — Bannière accueil",status:"paused",budget:25000,spent:12000,clicks:89,impressions:5600,ctr:"1.6%"},
];

function VAdsScr({onBack}){
  const [ads,setAds]=useState(ADS);
  const [creating,setCreating]=useState(false);
  const [adType,setAdType]=useState("search");
  const [budget,setBudget]=useState("");

  const TYPES=[["search","🔍","Recherche sponsorisée","Apparaître en haut des résultats"],["banner","🖼️","Bannière accueil","Visible sur la page d'accueil"],["story","📸","Story sponsorisée","Apparaître dans les stories"]];

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={creating?()=>setCreating(false):onBack}>←</button><h2>📢 Publicités</h2><div style={{width:38}}/></div>

    {creating?<>
      <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Type de publicité</div>
      {TYPES.map(([k,ic,n,d])=>(
        <div key={k} onClick={()=>setAdType(k)} style={{padding:14,background:"var(--card)",border:adType===k?"2px solid #F97316":"1px solid var(--border)",borderRadius:14,marginBottom:8,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:24}}>{ic}</span>
          <div><div style={{fontSize:13,fontWeight:700}}>{n}</div><div style={{fontSize:11,color:"var(--muted)"}}>{d}</div></div>
        </div>
      ))}
      <div className="field"><label>Budget journalier (FCFA)</label><input value={budget} onChange={e=>setBudget(e.target.value.replace(/\D/g,""))} placeholder="5000" inputMode="numeric"/></div>
      <button onClick={()=>{setAds(p=>[{id:Date.now(),name:"Nouvelle campagne",status:"active",budget:parseInt(budget)||5000,spent:0,clicks:0,impressions:0,ctr:"0%"},...p]);setCreating(false);toast.success("Publicité lancée 📢")}} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🚀 Lancer la publicité</button>
    </>:<>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["📢",ads.length,"Campagnes"],["👁️",ads.reduce((s,a)=>s+a.impressions,0).toLocaleString(),"Impressions"],["👆",ads.reduce((s,a)=>s+a.clicks,0),"Clics"]].map(([ic,v,l])=>
          <div key={l} style={{flex:1,padding:"10px 0",textAlign:"center",background:"var(--card)",border:"1px solid var(--border)",borderRadius:12}}><div style={{fontSize:12}}>{ic}</div><div style={{fontSize:14,fontWeight:700}}>{v}</div><div style={{fontSize:9,color:"var(--muted)"}}>{l}</div></div>)}
      </div>
      {ads.map(a=>(
        <div key={a.id} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:13,fontWeight:700}}>{a.name}</span>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:a.status==="active"?"rgba(16,185,129,0.08)":"rgba(245,158,11,0.08)",color:a.status==="active"?"#10B981":"#F59E0B",fontWeight:600}}>{a.status==="active"?"🟢 Active":"⏸️ Pause"}</span>
          </div>
          <div style={{fontSize:11,color:"var(--muted)"}}>{a.clicks} clics · {a.impressions} impressions · CTR {a.ctr}</div>
          <div style={{marginTop:6,height:4,borderRadius:2,background:"var(--light)"}}><div style={{width:`${Math.min((a.spent/a.budget)*100,100)}%`,height:"100%",borderRadius:2,background:"#F97316"}}/></div>
          <div style={{fontSize:10,color:"var(--muted)",marginTop:4}}>{a.spent.toLocaleString()} / {a.budget.toLocaleString()} F dépensé</div>
        </div>
      ))}
      <button onClick={()=>setCreating(true)} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>+ Nouvelle publicité</button>
    </>}
  </div>);
}
export default VAdsScr;
