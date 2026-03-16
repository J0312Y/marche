import { useState } from "react";
import { useData } from "../../hooks";
import toast from "../../utils/toast";

function RoleRegScr({onBack,onDone,forceRole}){
  const { CATS } = useData();
  const [role,setRole]=useState(forceRole||null); // "vendor" | "driver"
  const [step,setStep]=useState(forceRole?0:-1);
  const [plan,setPlan]=useState("starter");
  const [selCats,setSC]=useState([]);
  const [docs,setDocs]=useState({});
  const [ok,setOk]=useState(false);
  const toggleCat=c=>setSC(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c]);

  const vendorSteps=["Infos","Établissement","Documents","Plan","Résumé"];
  const driverSteps=["Infos","Véhicule","Documents","Résumé"];
  const steps=role==="vendor"?vendorSteps:driverSteps;
  const maxStep=steps.length-1;

  // Success screen
  if(ok)return(<div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"}}><div style={{textAlign:"center",padding:"40px 20px"}}>
    <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:40}}>🎉</div>
    <h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}>{role==="vendor"?"Bienvenue sur Lamuka !":"Bienvenue livreur !"}</h2>
    <p style={{fontSize:14,color:"#5E5B53",lineHeight:1.6}}>Votre demande a été soumise. Vérification sous 24-48h.</p>
    <p style={{fontSize:13,color:"#908C82",marginTop:4}}>Vous recevrez : notification, message in-app, et email de confirmation.</p>
    <div style={{fontSize:13,color:"#6366F1",fontWeight:600,margin:"16px 0"}}>#{role==="vendor"?"VND":"DRV"}-2026-{String(Math.floor(Math.random()*9000+1000))}</div>
    {role==="vendor"&&<div style={{padding:10,background:"rgba(99,102,241,0.04)",borderRadius:12,fontSize:12,color:"#6366F1",fontWeight:600,marginBottom:10}}>Plan {plan==="starter"?"Starter (Gratuit)":plan==="pro"?"Pro (15k/mois)":"Enterprise (45k/mois)"}</div>}
    <button className="btn-primary" style={{maxWidth:300,margin:"0 auto"}} onClick={()=>{toast.success("Inscription réussie ! 🎉");onDone(role,role==="vendor"?plan:null)}}>✅ Compris</button>
  </div></div>);

  // Role selection
  if(step===-1)return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Rejoindre Lamuka</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:16}}>
      <p style={{fontSize:14,color:"#5E5B53",marginBottom:14,lineHeight:1.6}}>Choisissez le rôle que vous souhaitez ajouter à votre compte :</p>
      <div onClick={()=>{setRole("vendor");setStep(0);setDocs({id:false,rccm:false,photo:false})}} style={{padding:16,background:"#fff",border:"2px solid #E8E6E1",borderRadius:20,marginBottom:14,cursor:"pointer",transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}><div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🏪</div><div><h3 style={{fontSize:18,fontWeight:700}}>Commerçant</h3><p style={{fontSize:12,color:"#908C82"}}>Ouvrez votre commerce sur Lamuka</p></div></div>
        <div style={{fontSize:12,color:"#5E5B53",lineHeight:1.6}}>Restaurant, boutique, pâtisserie, supermarché, pharmacie ou service — vendez et recevez des commandes.</div>
        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>{["🍽️ Resto","🏪 Boutique","🧁 Pâtisserie","🛒 Supermarché","💊 Pharma","🔧 Service"].map(f=><span key={f} style={{padding:"4px 10px",borderRadius:8,background:"rgba(99,102,241,0.06)",color:"#6366F1",fontSize:10,fontWeight:600}}>{f}</span>)}</div>
      </div>
      <div onClick={()=>{setRole("driver");setStep(0);setDocs({id:false,permit:false,vehicle:false})}} style={{padding:16,background:"#fff",border:"2px solid #E8E6E1",borderRadius:20,cursor:"pointer",transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}><div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#10B981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🛵</div><div><h3 style={{fontSize:18,fontWeight:700}}>Livreur</h3><p style={{fontSize:12,color:"#908C82"}}>Livrez et gagnez de l'argent</p></div></div>
        <div style={{fontSize:12,color:"#5E5B53",lineHeight:1.6}}>Effectuez des livraisons dans votre zone. Choisissez vos horaires, suivez vos gains en temps réel.</div>
        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>{["Horaires flexibles","Gains en temps réel","GPS intégré","Pourboires"].map(f=><span key={f} style={{padding:"4px 10px",borderRadius:8,background:"rgba(16,185,129,0.06)",color:"#10B981",fontSize:10,fontWeight:600}}>{f}</span>)}</div>
      </div>
    </div>
  </div>);

  // Multi-step form
  const color=role==="vendor"?"#6366F1":"#10B981";

  return(<>
    <div className="appbar"><button onClick={()=>step>0?setStep(step-1):forceRole?onBack():setStep(-1)}>←</button><h2>{role==="vendor"?"Devenir Commerçant":"Devenir Livreur"}</h2><div style={{width:38}}/></div>
    <div className="vr-steps">{steps.map((s,i)=><div key={s} style={{display:"contents"}}>{i>0&&<div className={`vr-line ${step>=i?"on":""}`} style={step>=i?{background:color}:{}}/>}<div className="step-col"><div className={`vr-dot ${step>i?"done":step>=i?"on":""}`} style={step>=i?{background:color,color:"#fff"}:{}}>{step>i?"✓":i+1}</div><div className={`vr-lbl ${step>=i?"on":""}`}>{s}</div></div></div>)}</div>
    <div className="scr" style={{padding:16}}>

      {/* STEP 0: Infos personnelles (both) */}
      {step===0&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Informations personnelles</h3>
        <div className="field"><label>Nom complet</label><input placeholder="Joeldy Tsina"/></div>
        <div className="field"><label>Email</label><input placeholder="joeldytsina94@gmail.com"/></div>
        <div className="field"><label>Téléphone</label><input placeholder="+242 064 663 469"/></div>
        <div className="field-row"><div className="field"><label>Ville</label><input placeholder="Brazzaville"/></div><div className="field"><label>Quartier</label><input placeholder="Bacongo"/></div></div>
      </>}

      {/* STEP 1 VENDOR: Établissement */}
      {step===1&&role==="vendor"&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Votre Établissement</h3>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:"#5E5B53",marginBottom:8}}>Type de commerce <span style={{color:"#EF4444"}}>*</span></label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
          {[["🏪","Boutique","boutique"],["🍽️","Restaurant","restaurant"],["🧁","Pâtisserie","patisserie"],["🛒","Supermarché","supermarche"],["💊","Pharmacie","pharmacie"],["🔧","Service","service"]].map(([icon,label,val])=>{const sel=selCats.includes(val);return<div key={val} onClick={(e)=>{e.stopPropagation();setSC(p=>{const types=["boutique","restaurant","patisserie","supermarche","pharmacie","service"];const filtered=p.filter(x=>!types.includes(x));return sel?filtered:[...filtered,val]});}} style={{padding:"12px 8px",borderRadius:12,border:sel?"2px solid #6366F1":"2px solid #E8E6E1",background:sel?"rgba(99,102,241,0.08)":"#fff",cursor:"pointer",textAlign:"center",transition:"all .15s",position:"relative",WebkitTapHighlightColor:"transparent",userSelect:"none"}}>
            {sel&&<div style={{position:"absolute",top:4,right:4,width:16,height:16,borderRadius:"50%",background:"#6366F1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff"}}>✓</div>}
            <div style={{fontSize:22,marginBottom:2}}>{icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:sel?"#6366F1":"#5E5B53"}}>{label}</div>
          </div>})}
        </div>
        <div className="vr-upload"><div className="vu-icon">🖼️</div><b>Logo / Photo</b><p>PNG, JPG · Max 2MB</p></div>
        <div className="field"><label>Nom de l'établissement</label><input placeholder="Ex: Chez Mama Ngudi, Congo Tech..."/></div>
        <div className="field"><label>Description</label><input placeholder="Votre activité, spécialités..."/></div>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:"#5E5B53",margin:"14px 0 8px"}}>Sous-catégories</label>
        <div className="vr-cat-grid">{CATS.map(c=><div key={c.id} className={`vr-cat ${selCats.includes(c.name)?"on":""}`} onClick={()=>toggleCat(c.name)}><div className="vci">{c.icon}</div><div className="vcn">{c.name}</div></div>)}</div>
      </>}

      {/* STEP 1 DRIVER: Véhicule */}
      {step===1&&role==="driver"&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Votre Véhicule</h3>
        <div className="field"><label>Type de véhicule</label><select><option value="moto">🛵 Moto</option><option value="voiture">🚗 Voiture</option><option value="velo">🚲 Vélo</option></select></div>
        <div className="field-row"><div className="field"><label>Marque</label><input placeholder="Honda PCX"/></div><div className="field"><label>Année</label><input placeholder="2023"/></div></div>
        <div className="field-row"><div className="field"><label>Plaque</label><input placeholder="BZ-4521"/></div><div className="field"><label>Couleur</label><input placeholder="Noir"/></div></div>
        <div style={{fontSize:14,fontWeight:700,margin:"14px 0 10px"}}>Zones de livraison</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["Brazzaville Sud","Centre-ville","Brazzaville Nord","Pointe-Noire"].map(z=><span key={z} style={{padding:"8px 14px",borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{z}</span>)}</div>
      </>}

      {/* STEP 2: Documents (different per role) */}
      {step===2&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Documents requis</h3>
        {role==="vendor"?
          [["🪪","Pièce d'identité","Carte nationale ou passeport","id"],["📄","RCCM / Patente","Registre de commerce (optionnel)","rccm"],["📸","Photo de l'établissement","Votre espace de vente","photo"]].map(([i,t,d,k])=>
            <div key={k} className="vr-doc" onClick={()=>setDocs({...docs,[k]:true})}><span className="vdi">{i}</span><div className="vdt"><h5>{t}</h5><p>{d}</p></div><span className={`vds ${docs[k]?"up":"pend"}`}>{docs[k]?"✓ Envoyé":"À envoyer"}</span></div>)
          :[["🪪","Pièce d'identité","Carte nationale ou passeport","id"],["🪪","Permis de conduire","Obligatoire pour moto/voiture","permit"],["📸","Photo du véhicule","Vue claire du véhicule","vehicle"]].map(([i,t,d,k])=>
            <div key={k} className="vr-doc" onClick={()=>setDocs({...docs,[k]:true})}><span className="vdi">{i}</span><div className="vdt"><h5>{t}</h5><p>{d}</p></div><span className={`vds ${docs[k]?"up":"pend"}`}>{docs[k]?"✓ Envoyé":"À envoyer"}</span></div>)
        }
      </>}

      {/* STEP 3 VENDOR: Plan (only vendor) */}
      {step===3&&role==="vendor"&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Choisir un plan</h3>
        {[["starter","Starter","Gratuit","Pour démarrer",["10 articles max","8% commission","Support email","Stats basiques"]],
          ["pro","Pro","15 000 FCFA/mois","Articles illimités",["Articles illimités","4% commission","Analytics avancés","Badge vérifié ✓","Support prioritaire"]],
          ["enterprise","Enterprise","45 000 FCFA/mois","Multi-établissements",["Multi-établissements","2% commission","API complète","🌐 Site web personnalisé","Manager dédié","Dashboard personnalisé"]]
        ].map(([k,n,pr,d,f])=><div key={k} className={`vr-plan ${plan===k?"on":""}`} onClick={()=>setPlan(k)} style={plan===k?{borderColor:color}:{}}>
          <h4>{n}<span>{pr}</span></h4><p>{d}</p>
          <div className="vrf">{f.map(x=><span key={x}>✓ {x}</span>)}</div>
          {k==="starter"&&<div className="info-box yellow" style={{margin:"8px 0 0",padding:"6px 10px"}}><span style={{fontSize:12}}>💡</span><span style={{fontSize:11}}>Limitations : 10 articles, pas d'analytics avancés, pas de badge</span></div>}
        </div>)}
      </>}

      {/* LAST STEP: Résumé */}
      {step===maxStep&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Résumé</h3>
        <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
          {[["Rôle",role==="vendor"?"🏪 Commerçant":"🛵 Livreur"],
            ["Nom","Joeldy Tsina"],
            ...(role==="vendor"?[["Établissement","Mon Commerce"],["Type",{boutique:"Boutique",restaurant:"Restaurant",patisserie:"Pâtisserie",supermarche:"Supermarché",pharmacie:"Pharmacie",service:"Service"}[selCats.find(c=>["boutique","restaurant","patisserie","supermarche","pharmacie","service"].includes(c))]||"—"]]:[["Véhicule","🛵 Honda PCX"],["Plaque","BZ-4521"]]),
            ["Documents",`${Object.values(docs).filter(Boolean).length}/${Object.keys(docs).length}`],
            ...(role==="vendor"?[["Plan",plan==="starter"?"Starter (Gratuit)":plan==="pro"?"Pro (15k/mois)":"Enterprise (45k/mois)"]]:[])]
          .map(([l,v])=><div key={l} className="vs-row"><span>{l}</span><b>{v}</b></div>)}
        </div>
        <div className="info-box green"><span>✅</span><span>{role==="vendor"?"En soumettant, vous acceptez les CGV de Lamuka Marketplace.":"Votre demande sera vérifiée sous 24-48h. Vous serez notifié par SMS, email et notification."}</span></div>
      </>}

      {/* ── Button inside scroll ── */}
      <div style={{paddingTop:24,paddingBottom:16}}>
        <button className="btn-primary" style={{background:color}} onClick={()=>step<maxStep?setStep(step+1):setOk(true)}>{step===maxStep?"🚀 Soumettre la demande":"Continuer"}</button>
      </div>
    </div>
  </>);
}

/* ═══════════════════════════════
   VENDOR SCREENS (15)
   ═══════════════════════════════ */

/* V1 ── VENDOR DASHBOARD ── */

export default RoleRegScr;
