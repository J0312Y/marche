import { useState } from "react";
import toast from "../../utils/toast";

function DrDocumentsScr({onBack}){
  const [docs,setDocs]=useState({
    cni:{name:"Pièce d'identité (CNI)",status:"valid",expiry:"15 Mar 2028",file:true},
    permis:{name:"Permis de conduire",status:"valid",expiry:"20 Jan 2027",file:true},
    assurance:{name:"Assurance véhicule",status:"expiring",expiry:"15 Avr 2026",file:true},
    carteGrise:{name:"Carte grise",status:"valid",expiry:"—",file:true},
    casier:{name:"Casier judiciaire",status:"valid",expiry:"10 Fév 2027",file:true},
    photo:{name:"Photo du véhicule",status:"valid",expiry:"—",file:true},
  });
  const [uploading,setUploading]=useState(null);

  const statusInfo={
    valid:{color:"#10B981",bg:"rgba(16,185,129,0.08)",label:"✅ Valide",icon:"✅"},
    expiring:{color:"#F59E0B",bg:"rgba(245,158,11,0.08)",label:"⚠️ Expire bientôt",icon:"⚠️"},
    expired:{color:"#EF4444",bg:"rgba(239,68,68,0.08)",label:"❌ Expiré",icon:"❌"},
    pending:{color:"#3B82F6",bg:"rgba(59,130,246,0.08)",label:"⏳ En vérification",icon:"⏳"},
  };

  const handleUpload=(key)=>{
    setUploading(key);
    setTimeout(()=>{
      setDocs(p=>({...p,[key]:{...p[key],status:"pending",file:true}}));
      setUploading(null);
      toast.success("Document envoyé — en cours de vérification ⏳");
    },2000);
  };

  const validCount=Object.values(docs).filter(d=>d.status==="valid").length;
  const totalCount=Object.keys(docs).length;
  const hasIssues=Object.values(docs).some(d=>d.status==="expiring"||d.status==="expired");

  return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:14}}><button onClick={onBack}>←</button><h2>Mes documents</h2><div style={{width:38}}/></div>

    {/* Status summary */}
    <div style={{padding:14,background:hasIssues?"rgba(245,158,11,0.06)":"rgba(16,185,129,0.06)",border:`1px solid ${hasIssues?"rgba(245,158,11,0.2)":"rgba(16,185,129,0.2)"}`,borderRadius:16,marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:48,height:48,borderRadius:14,background:hasIssues?"rgba(245,158,11,0.1)":"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{hasIssues?"⚠️":"✅"}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:700,color:hasIssues?"#F59E0B":"#10B981"}}>{hasIssues?"Attention requise":"Tous les documents sont à jour"}</div>
        <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{validCount}/{totalCount} documents valides</div>
      </div>
    </div>

    {/* Progress bar */}
    <div style={{height:6,background:"var(--light)",borderRadius:3,marginBottom:16,overflow:"hidden"}}>
      <div style={{height:"100%",width:(validCount/totalCount*100)+"%",background:validCount===totalCount?"#10B981":"#F59E0B",borderRadius:3,transition:"width .3s"}}/>
    </div>

    {/* Documents list */}
    {Object.entries(docs).map(([key,doc])=>{
      const st=statusInfo[doc.status];
      return(<div key={key} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:doc.status!=="valid"?10:0}}>
          <div style={{width:40,height:40,borderRadius:12,background:st.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{st.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600}}>{doc.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
              <span style={{padding:"2px 8px",borderRadius:6,background:st.bg,color:st.color,fontSize:10,fontWeight:600}}>{st.label}</span>
              {doc.expiry!=="—"&&<span style={{fontSize:10,color:"var(--muted)"}}>Exp: {doc.expiry}</span>}
            </div>
          </div>
        </div>

        {/* Actions for non-valid docs */}
        {(doc.status==="expiring"||doc.status==="expired")&&<div style={{display:"flex",gap:8}}>
          <input id={`doc-${key}`} type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={()=>handleUpload(key)}/>
          <button onClick={()=>document.getElementById(`doc-${key}`)?.click()} disabled={uploading===key} style={{flex:1,padding:10,borderRadius:10,border:"none",background:doc.status==="expired"?"#EF4444":"#F59E0B",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            {uploading===key?"⏳ Envoi...":"📤 Mettre à jour"}
          </button>
        </div>}

        {doc.status==="pending"&&<div style={{padding:8,background:"rgba(59,130,246,0.04)",borderRadius:8,fontSize:11,color:"#3B82F6",textAlign:"center"}}>⏳ Document en cours de vérification (24-48h)</div>}
      </div>);
    })}

    {/* Info */}
    <div style={{padding:12,background:"rgba(59,130,246,0.04)",border:"1px solid rgba(59,130,246,0.1)",borderRadius:12,marginTop:4}}>
      <div style={{fontSize:12,fontWeight:600,color:"#3B82F6",marginBottom:4}}>💡 Important</div>
      <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.5}}>Les documents expirés doivent être renouvelés sous 30 jours. Passé ce délai, votre compte sera temporairement suspendu. Formats acceptés : JPG, PNG, PDF (max 5 MB).</div>
    </div>
  </div>);
}

export default DrDocumentsScr;
