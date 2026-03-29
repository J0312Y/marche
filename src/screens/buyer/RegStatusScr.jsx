import { useState, useEffect } from "react";
import { triggerPush } from "../../components/PushBanner";

function RegStatusScr({onBack,role,plan,vendorStatus,driverStatus}){
  const isVendor = role === "vendor";
  const status = isVendor ? vendorStatus : driverStatus;
  const planLabel = plan==="starter"?"Starter":plan==="pro"?"Pro":plan==="enterprise"?"Enterprise":"Livreur";

  const steps = isVendor ? [
    {key:"submitted",label:"Demande soumise",icon:"📩",desc:"Vos informations ont été envoyées"},
    {key:"docs",label:"Vérification documents",icon:"📄",desc:"CNI, RCCM, patente en cours de vérification"},
    {key:"review",label:"Examen du dossier",icon:"🔍",desc:"L'équipe Lamuka examine votre candidature"},
    {key:"approved",label:"Compte activé",icon:"✅",desc:"Bienvenue ! Votre espace vendeur est prêt"},
  ] : [
    {key:"submitted",label:"Demande soumise",icon:"📩",desc:"Vos informations ont été envoyées"},
    {key:"docs",label:"Vérification permis & véhicule",icon:"🛵",desc:"Documents et assurance en cours de vérification"},
    {key:"review",label:"Examen du dossier",icon:"🔍",desc:"L'équipe Lamuka vérifie votre profil"},
    {key:"approved",label:"Compte activé",icon:"✅",desc:"Vous pouvez commencer à livrer !"},
  ];

  const currentStep = status === "approved" ? 3 : status === "pending" ? 1 : 0;

  return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Statut inscription</h2><div style={{width:38}}/></div>

    {/* Header */}
    <div style={{textAlign:"center",marginBottom:20}}>
      <div style={{width:72,height:72,borderRadius:"50%",background:status==="approved"?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:36}}>
        {status==="approved"?"🎉":"⏳"}
      </div>
      <h3 style={{fontSize:20,fontWeight:700}}>{status==="approved"?"Inscription validée !":"Inscription en cours"}</h3>
      <p style={{fontSize:13,color:"var(--muted)",marginTop:4}}>
        {isVendor?`Demande commerçant · Plan ${planLabel}`:"Demande livreur"}
      </p>
    </div>

    {/* Progress steps */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:16}}>
      {steps.map((s,i)=>{
        const done = i <= currentStep;
        const active = i === currentStep;
        const isLast = i === steps.length - 1;
        return(
          <div key={s.key} style={{display:"flex",gap:14,paddingBottom:isLast?0:16,position:"relative"}}>
            {/* Line connector */}
            {!isLast&&<div style={{position:"absolute",left:17,top:36,bottom:0,width:2,background:done&&!active?"#10B981":"var(--border)"}}/>}
            {/* Dot */}
            <div style={{width:36,height:36,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
              background:done?(active?"rgba(245,158,11,0.1)":"rgba(16,185,129,0.1)"):"var(--light)",
              border:active?"2px solid #F59E0B":done?"2px solid #10B981":"2px solid var(--border)",
              zIndex:1
            }}>
              {done && !active ? "✓" : s.icon}
            </div>
            {/* Content */}
            <div style={{flex:1,paddingTop:2}}>
              <div style={{fontSize:14,fontWeight:active?700:done?600:500,color:done?"var(--text)":"var(--muted)"}}>{s.label}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.desc}</div>
              {active&&status==="pending"&&<div style={{marginTop:6,padding:"6px 10px",background:"rgba(245,158,11,0.06)",borderRadius:8,fontSize:11,color:"#F59E0B",fontWeight:600}}>⏳ En cours · Délai estimé : 24-48h</div>}
            </div>
          </div>
        );
      })}
    </div>

    {/* Summary card */}
    <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>📋 Récapitulatif</div>
      {(isVendor?[
        ["Rôle","🏪 Commerçant"],
        ["Plan",planLabel],
        ["Documents","3/3 soumis"],
        ["Paiement",plan==="starter"?"Gratuit":"✅ Confirmé"],
      ]:[
        ["Rôle","🛵 Livreur"],
        ["Véhicule","Honda PCX"],
        ["Documents","4/4 soumis"],
        ["Inscription","✅ 5 000 F payé"],
      ]).map(([l,v])=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border)",fontSize:13}}>
          <span style={{color:"var(--muted)"}}>{l}</span><b>{v}</b>
        </div>
      ))}
    </div>

    {/* Help */}
    <div style={{padding:14,background:"rgba(59,130,246,0.04)",border:"1px solid rgba(59,130,246,0.15)",borderRadius:14,marginBottom:16}}>
      <div style={{fontSize:12,fontWeight:600,color:"#3B82F6",marginBottom:4}}>💡 Besoin d'aide ?</div>
      <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.5}}>Si votre demande prend plus de 48h, contactez-nous sur WhatsApp au +242 064 663 469 ou par email à support@lamuka.market</div>
    </div>

    <button className="btn-primary" onClick={onBack}>← Retour</button>
  </div>);
}

export default RegStatusScr;
