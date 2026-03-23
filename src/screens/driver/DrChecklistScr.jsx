import { useState } from "react";
import toast from "../../utils/toast";

function DrChecklistScr({onBack,delivery,onConfirm}){
  const dl=delivery||{ref:"#LMK-2026-0214",vendor:{name:"Mode Afrique"},client:{name:"Marie Koumba"},items:3};
  const [checks,setChecks]=useState({
    verifyItems:false,
    packageIntact:false,
    correctAddress:false,
    photoProof:false,
    clientSignature:false,
  });
  const [photo,setPhoto]=useState(null);

  const toggle=(k)=>setChecks(p=>({...p,[k]:!p[k]}));
  const allDone=checks.verifyItems&&checks.packageIntact&&checks.correctAddress&&(checks.photoProof||checks.clientSignature);
  const doneCount=Object.values(checks).filter(Boolean).length;

  const ITEMS=[
    ["verifyItems","📦","Vérifier les articles","Comptez les articles ("+dl.items+" attendus)"],
    ["packageIntact","✅","Colis intact","Vérifiez que l'emballage n'est pas endommagé"],
    ["correctAddress","📍","Adresse correcte","Confirmez l'adresse de livraison"],
    ["photoProof","📸","Photo preuve","Prenez une photo du colis livré"],
    ["clientSignature","✍️","Confirmation client","Le client confirme la réception"],
  ];

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>📋 Checklist</h2><div style={{width:38}}/></div>

    <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:14}}>
      <div style={{fontSize:13,fontWeight:700}}>{dl.ref} · {dl.vendor.name}</div>
      <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>→ {dl.client.name} · {dl.items} articles</div>
    </div>

    {/* Progress */}
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <div style={{flex:1,height:6,borderRadius:3,background:"var(--light)"}}>
        <div style={{width:`${(doneCount/5)*100}%`,height:"100%",borderRadius:3,background:allDone?"#10B981":"#F97316",transition:"width .3s"}}/>
      </div>
      <span style={{fontSize:12,fontWeight:600,color:allDone?"#10B981":"var(--muted)"}}>{doneCount}/5</span>
    </div>

    {ITEMS.map(([key,icon,title,desc])=>(
      <div key={key} onClick={()=>{
        if(key==="photoProof"){
          document.getElementById("proof-photo")?.click();
          return;
        }
        toggle(key);
      }} style={{display:"flex",alignItems:"center",gap:12,padding:14,background:"var(--card)",border:checks[key]?"2px solid #10B981":"1px solid var(--border)",borderRadius:14,marginBottom:8,cursor:"pointer",transition:"all .15s"}}>
        <div style={{width:40,height:40,borderRadius:12,background:checks[key]?"rgba(16,185,129,0.08)":"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{checks[key]?"✅":icon}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:checks[key]?"#10B981":"var(--text)"}}>{title}</div>
          <div style={{fontSize:11,color:"var(--muted)"}}>{desc}</div>
        </div>
        {key==="photoProof"&&photo&&<img src={photo} style={{width:36,height:36,borderRadius:8,objectFit:"cover"}} alt=""/>}
      </div>
    ))}

    <input id="proof-photo" type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{
      const f=e.target.files?.[0];
      if(f){const r=new FileReader();r.onload=()=>{setPhoto(r.result);setChecks(p=>({...p,photoProof:true}));toast.success("Photo ajoutée 📸")};r.readAsDataURL(f)}
    }}/>

    <button disabled={!allDone} onClick={()=>{toast.success("Livraison confirmée ✅");onConfirm?.();setTimeout(onBack,800)}} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:allDone?"#10B981":"var(--border)",color:allDone?"#fff":"var(--muted)",fontSize:15,fontWeight:700,cursor:allDone?"pointer":"not-allowed",fontFamily:"inherit",marginTop:8}}>
      {allDone?"✅ Confirmer la livraison":"Complétez la checklist"}
    </button>
  </div>);
}
export default DrChecklistScr;
