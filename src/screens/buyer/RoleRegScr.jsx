import { useState } from "react";
import Select from "../../components/Select";
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
  const driverSteps=["Infos","Véhicule","Documents","Tarifs","Résumé"];
  const steps=role==="vendor"?vendorSteps:driverSteps;
  const maxStep=steps.length-1;

  // Success screen
  if(ok)return(<div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"}}><div style={{textAlign:"center",padding:"40px 20px"}}>
    <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:40}}>🎉</div>
    <h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}>{role==="vendor"?"Bienvenue sur Lamuka !":"Bienvenue livreur !"}</h2>
    <p style={{fontSize:14,color:"var(--sub)",lineHeight:1.6}}>Votre demande a été soumise. Vérification sous 24-48h.</p>
    <p style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Vous recevrez : notification, message in-app, et email de confirmation.</p>
    <div style={{fontSize:13,color:"#F97316",fontWeight:600,margin:"16px 0"}}>#{role==="vendor"?"VND":"DRV"}-2026-{String(Math.floor(Math.random()*9000+1000))}</div>
    {role==="vendor"&&<div style={{padding:10,background:"rgba(249,115,22,0.04)",borderRadius:12,fontSize:12,color:"#F97316",fontWeight:600,marginBottom:10}}>Plan {plan==="starter"?"Starter (Gratuit)":plan==="pro"?"Pro (15k/mois)":"Enterprise (45k/mois)"}</div>}
    <button className="btn-primary" style={{maxWidth:300,margin:"0 auto"}} onClick={()=>{toast.success("Inscription réussie ! 🎉");onDone(role,role==="vendor"?plan:null)}}>✅ Compris</button>
  </div></div>);

  // Role selection
  if(step===-1)return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Rejoindre Lamuka</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:16}}>
      <p style={{fontSize:14,color:"var(--sub)",marginBottom:14,lineHeight:1.6}}>Choisissez le rôle que vous souhaitez ajouter à votre compte :</p>
      <div onClick={()=>{setRole("vendor");setStep(0);setDocs({id:false,rccm:false,photo:false})}} style={{padding:16,background:"var(--card)",border:"2px solid var(--border)",borderRadius:20,marginBottom:14,cursor:"pointer",transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}><div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🏪</div><div><h3 style={{fontSize:18,fontWeight:700}}>Commerçant</h3><p style={{fontSize:12,color:"var(--muted)"}}>Ouvrez votre commerce sur Lamuka</p></div></div>
        <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.6}}>Restaurant, boutique, pâtisserie, supermarché, pharmacie ou service — vendez et recevez des commandes.</div>
        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>{["🍽️ Resto","🏪 Boutique","🧁 Pâtisserie","🛒 Supermarché","💊 Pharma","🔧 Service"].map(f=><span key={f} style={{padding:"4px 10px",borderRadius:8,background:"rgba(249,115,22,0.06)",color:"#F97316",fontSize:10,fontWeight:600}}>{f}</span>)}</div>
      </div>
      <div onClick={()=>{setRole("driver");setStep(0);setDocs({id:false,permit:false,vehicle:false})}} style={{padding:16,background:"var(--card)",border:"2px solid var(--border)",borderRadius:20,cursor:"pointer",transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}><div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#10B981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🛵</div><div><h3 style={{fontSize:18,fontWeight:700}}>Livreur</h3><p style={{fontSize:12,color:"var(--muted)"}}>Livrez et gagnez de l'argent</p></div></div>
        <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.6}}>Effectuez des livraisons dans votre zone. Choisissez vos horaires, suivez vos gains en temps réel.</div>
        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>{["Horaires flexibles","Gains en temps réel","GPS intégré","Pourboires"].map(f=><span key={f} style={{padding:"4px 10px",borderRadius:8,background:"rgba(249,115,22,0.04)",color:"#10B981",fontSize:10,fontWeight:600}}>{f}</span>)}</div>
      </div>
    </div>
  </div>);

  // Multi-step form
  const color=role==="vendor"?"#F97316":"#10B981";

  return(<>
    <div className="appbar"><button onClick={()=>step>0?setStep(step-1):forceRole?onBack():setStep(-1)}>←</button><h2>{role==="vendor"?"Devenir Commerçant":"Devenir Livreur"}</h2><div style={{width:38}}/></div>
    <div className="vr-steps">{steps.map((s,i)=><div key={s} style={{display:"contents"}}>{i>0&&<div className={`vr-line ${step>=i?"on":""}`} style={step>=i?{background:color}:{}}/>}<div className="step-col"><div className={`vr-dot ${step>i?"done":step>=i?"on":""}`} style={step>=i?{background:color,color:"#fff"}:{}}>{step>i?"✓":i+1}</div><div className={`vr-lbl ${step>=i?"on":""}`}>{s}</div></div></div>)}</div>
    <div className="scr" style={{padding:16}}>

      {/* STEP 0: Infos personnelles (both) */}
      {step===0&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Informations personnelles</h3>
        <div className="field"><label>Nom complet <span style={{color:"#EF4444"}}>*</span></label><input placeholder="Joeldy Tsina"/></div>
        <div className="field"><label>Email <span style={{color:"#EF4444"}}>*</span></label><input placeholder="joeldytsina94@gmail.com"/></div>
        <div className="field"><label>Téléphone <span style={{color:"#EF4444"}}>*</span></label><input placeholder="+242 064 663 469"/></div>
        <div className="field-row"><div className="field"><label>Ville <span style={{color:"#EF4444"}}>*</span></label><input placeholder="Brazzaville"/></div><div className="field"><label>Quartier <span style={{color:"#EF4444"}}>*</span></label><input placeholder="Bacongo"/></div></div>
      </>}

      {/* STEP 1 VENDOR: Établissement */}
      {step===1&&role==="vendor"&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Votre Établissement</h3>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--sub)",marginBottom:8}}>Type de commerce <span style={{color:"#EF4444"}}>*</span></label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
          {[["🏪","Boutique","boutique"],["🍽️","Restaurant","restaurant"],["🧁","Pâtisserie","patisserie"],["🛒","Supermarché","supermarche"],["💊","Pharmacie","pharmacie"],["🔧","Service","service"]].map(([icon,label,val])=>{const sel=selCats.includes(val);return<div key={val} onClick={(e)=>{e.stopPropagation();setSC(p=>{const types=["boutique","restaurant","patisserie","supermarche","pharmacie","service"];const filtered=p.filter(x=>!types.includes(x));return sel?filtered:[...filtered,val]});}} style={{padding:"12px 8px",borderRadius:12,border:sel?"2px solid #F97316":"2px solid var(--border)",background:sel?"rgba(249,115,22,0.08)":"var(--card)",cursor:"pointer",textAlign:"center",transition:"all .15s",position:"relative",WebkitTapHighlightColor:"transparent",userSelect:"none"}}>
            {sel&&<div style={{position:"absolute",top:4,right:4,width:16,height:16,borderRadius:"50%",background:"#F97316",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff"}}>✓</div>}
            <div style={{fontSize:22,marginBottom:2}}>{icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:sel?"#F97316":"var(--sub)"}}>{label}</div>
          </div>})}
        </div>
        <div className="vr-upload" onClick={()=>document.getElementById("reg-upload")?.click()} style={{cursor:"pointer"}}><div className="vu-icon" id="vu-preview">🖼️</div><b>Logo / Photo</b><p>PNG, JPG · Max 2MB</p><input id="reg-upload" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>{const el=document.getElementById("vu-preview");el.textContent="";el.style.overflow="hidden";const img=document.createElement("img");img.src=r.result;img.style.cssText="width:100%;height:100%;object-fit:cover;border-radius:12px";el.appendChild(img)};r.readAsDataURL(f)}}}/></div>
        <div className="field"><label>Nom de l'établissement <span style={{color:"#EF4444"}}>*</span></label><input placeholder="Ex: Chez Mama Ngudi, Congo Tech..."/></div>
        <div className="field"><label>Description <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><input placeholder="Votre activité, spécialités..."/></div>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--sub)",margin:"14px 0 8px"}}>Sous-catégories</label>
        <div className="vr-cat-grid">{CATS.map(c=><div key={c.id} className={`vr-cat ${selCats.includes(c.name)?"on":""}`} onClick={()=>toggleCat(c.name)}><div className="vci">{c.icon}</div><div className="vcn">{c.name}</div></div>)}</div>
      </>}

      {/* STEP 1 DRIVER: Véhicule */}
      {step===1&&role==="driver"&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Votre Véhicule</h3>
        <div className="field"><label>Type de véhicule <span style={{color:"#EF4444"}}>*</span></label><Select value="moto" onChange={()=>{}} options={[{value:"moto",label:"🛵 Moto"},{value:"voiture",label:"🚗 Voiture"},{value:"velo",label:"🚲 Vélo"}]}/></div>
        <div className="field-row"><div className="field"><label>Marque <span style={{color:"#EF4444"}}>*</span></label><input placeholder="Honda PCX"/></div><div className="field"><label>Année <span style={{color:"#EF4444"}}>*</span></label><input placeholder="2023"/></div></div>
        <div className="field-row"><div className="field"><label>Plaque <span style={{color:"#EF4444"}}>*</span></label><input placeholder="BZ-4521"/></div><div className="field"><label>Couleur <span style={{color:"#EF4444"}}>*</span></label><input placeholder="Noir"/></div></div>
        {/* Vehicle photo */}
        <div style={{marginTop:10,marginBottom:14}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--sub,#5E5B53)",marginBottom:6}}>Photo du véhicule</label>
          <div id="drv-veh-wrap" onClick={()=>document.getElementById("drv-veh-upload")?.click()} style={{width:"100%",height:120,borderRadius:16,border:"2px dashed var(--border,#E8E6E1)",background:"var(--light,#F5F4F1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden"}}>
            <div id="drv-veh-preview" style={{fontSize:32,marginBottom:4}}>🛵</div>
            <span style={{fontSize:11,color:"var(--muted,#908C82)"}}>Cliquez pour ajouter une photo</span>
          </div>
          <input id="drv-veh-upload" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
            const f=e.target.files?.[0];if(!f)return;
            const reader=new FileReader();
            reader.onload=()=>{
              const wrap=document.getElementById("drv-veh-wrap");
              wrap.innerHTML="";wrap.style.border="none";wrap.style.padding="0";
              const img=document.createElement("img");img.src=reader.result;img.style.cssText="width:100%;height:100%;object-fit:cover;border-radius:14px";
              wrap.appendChild(img);
              toast.success("Photo véhicule ajoutée 📸");
            };reader.readAsDataURL(f);e.target.value="";
          }}/>
        </div>
        <div style={{fontSize:14,fontWeight:700,margin:"0 0 10px"}}>Zones de livraison</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["Brazzaville Sud","Centre-ville","Brazzaville Nord","Pointe-Noire"].map(z=><span key={z} style={{padding:"8px 14px",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{z}</span>)}</div>
      </>}

      {/* STEP 2: Documents (different per role) */}
      {step===2&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:6}}>Documents requis</h3>
        <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.5,marginBottom:14}}>Uploadez vos documents pour vérification. Formats acceptés : JPG, PNG, PDF. Max 5 MB par fichier.</p>
        {(role==="vendor"?
          [["🪪","Pièce d'identité","Carte nationale ou passeport","id","image/*,.pdf"],["📄","RCCM / Patente","Registre de commerce (optionnel)","rccm","image/*,.pdf"],["📸","Photo de l'établissement","Votre espace de vente","photo","image/*"]]
          :[["🪪","Pièce d'identité","Carte nationale ou passeport","id","image/*,.pdf"],["🪪","Permis de conduire","Obligatoire pour moto/voiture","permit","image/*,.pdf"],["📸","Photo du véhicule","Vue claire du véhicule","vehicle","image/*"]]
        ).map(([icon,title,desc,key,accept])=>(
          <div key={key} style={{padding:14,background:"var(--card,#fff)",border:docs[key]?"2px solid "+color:"1px solid var(--border,#E8E6E1)",borderRadius:16,marginBottom:10,position:"relative"}}>
            <input id={`doc-${key}`} type="file" accept={accept} style={{display:"none"}} onChange={e=>{
              const f=e.target.files?.[0];
              if(!f)return;
              if(f.size>5*1024*1024){toast.error("Fichier trop lourd (max 5 MB)");return}
              const reader=new FileReader();
              reader.onload=()=>{setDocs(prev=>({...prev,[key]:{name:f.name,size:(f.size/1024).toFixed(0),type:f.type,preview:f.type.startsWith("image/")?reader.result:null}}))};
              reader.readAsDataURL(f);
              toast.success("Document uploadé ✅");
              e.target.value="";
            }}/>

            {!docs[key]?(
              <div onClick={()=>document.getElementById(`doc-${key}`)?.click()} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:48,height:48,borderRadius:14,background:role==="vendor"?"rgba(249,115,22,0.06)":"rgba(16,185,129,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>{title}</div>
                  <div style={{fontSize:11,color:"var(--muted,#908C82)",marginTop:2}}>{desc}</div>
                </div>
                <div style={{padding:"8px 14px",borderRadius:10,border:`1px dashed ${color}`,color:color,fontSize:11,fontWeight:600,flexShrink:0}}>📎 Upload</div>
              </div>
            ):(
              <div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  {/* Preview thumbnail */}
                  {docs[key].preview?(
                    <div style={{width:48,height:48,borderRadius:14,overflow:"hidden",flexShrink:0,border:"1px solid var(--border,#E8E6E1)"}}>
                      <img src={docs[key].preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
                    </div>
                  ):(
                    <div style={{width:48,height:48,borderRadius:14,background:"rgba(249,115,22,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📄</div>
                  )}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#10B981",display:"flex",alignItems:"center",gap:4}}>✅ {title}</div>
                    <div style={{fontSize:11,color:"var(--muted,#908C82)",marginTop:2,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{docs[key].name} · {docs[key].size} KB</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                    <button onClick={()=>document.getElementById(`doc-${key}`)?.click()} style={{padding:"5px 10px",borderRadius:8,border:"1px solid var(--border,#E8E6E1)",background:"var(--card,#fff)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text,#191815)"}}>🔄 Changer</button>
                    <button onClick={()=>setDocs(prev=>({...prev,[key]:false}))} style={{padding:"5px 10px",borderRadius:8,border:"1px solid rgba(239,68,68,.15)",background:"transparent",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#EF4444"}}>✕ Retirer</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Progress indicator */}
        <div style={{padding:12,background:"var(--light,#F5F4F1)",borderRadius:12,display:"flex",alignItems:"center",gap:10,marginTop:4}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
              <span style={{fontWeight:600}}>Documents uploadés</span>
              <span style={{color:color,fontWeight:700}}>{Object.values(docs).filter(v=>v&&v!==true&&v!==false).length}/{role==="vendor"?3:3}</span>
            </div>
            <div style={{height:4,background:"var(--border,#E8E6E1)",borderRadius:2,overflow:"hidden"}}>
              <div style={{width:`${(Object.values(docs).filter(v=>v&&v!==true&&v!==false).length/(role==="vendor"?3:3))*100}%`,height:"100%",background:color,borderRadius:2,transition:"width .3s"}}/>
            </div>
          </div>
        </div>
      </>}

      {/* STEP 3 DRIVER: Tarifs & Commission */}
      {step===3&&role==="driver"&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Tarifs & Commission</h3>
        {/* Registration fee */}
        <div style={{padding:16,background:"linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02))",border:"1px solid rgba(249,115,22,0.15)",borderRadius:16,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:40,height:40,borderRadius:12,background:"#10B981",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18}}>📋</div>
            <div><div style={{fontSize:14,fontWeight:700}}>Frais d'inscription</div><div style={{fontSize:11,color:"var(--muted)"}}>Paiement unique — couvre la vérification</div></div>
          </div>
          <div style={{fontSize:28,fontWeight:800,color:"#10B981",textAlign:"center",margin:"8px 0"}}>5 000 FCFA</div>
          <div style={{fontSize:11,color:"var(--sub)",textAlign:"center",lineHeight:1.5}}>Payable par Airtel Money ou MTN MoMo après validation du dossier</div>
        </div>
        {/* Commission */}
        <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Commission par livraison</div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
            <span style={{fontSize:13}}>Frais de livraison perçu</span><b style={{fontSize:13}}>100%</b>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
            <span style={{fontSize:13,color:"#EF4444"}}>Commission Lamuka</span><b style={{fontSize:13,color:"#EF4444"}}>-15%</b>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0"}}>
            <span style={{fontSize:13,fontWeight:700}}>Vous gardez</span><b style={{fontSize:15,color:"#10B981"}}>85%</b>
          </div>
          <div style={{marginTop:8,padding:10,background:"var(--light)",borderRadius:10,fontSize:11,color:"var(--sub)",lineHeight:1.5}}>
            Exemple : Livraison à 2 500 F → Commission 375 F → Vous recevez <b style={{color:"#10B981"}}>2 125 FCFA</b> + pourboire client
          </div>
        </div>
        {/* Boost option */}
        <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{fontSize:20}}>🚀</span>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>Boost (Optionnel)</div><div style={{fontSize:11,color:"var(--muted)"}}>Recevez les commandes en priorité</div></div>
            <div style={{padding:"4px 10px",borderRadius:8,background:"rgba(245,158,11,0.08)",color:"#F59E0B",fontSize:12,fontWeight:700}}>1 000 F/jour</div>
          </div>
          <div style={{fontSize:11,color:"var(--sub)",lineHeight:1.5}}>Activable à tout moment depuis votre tableau de bord. Les livreurs boostés reçoivent les commandes avant les autres dans leur zone.</div>
        </div>
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
        <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
          {[["Rôle",role==="vendor"?"🏪 Commerçant":"🛵 Livreur"],
            ["Nom","Joeldy Tsina"],
            ...(role==="vendor"?[["Établissement","Mon Commerce"],["Type",{boutique:"Boutique",restaurant:"Restaurant",patisserie:"Pâtisserie",supermarche:"Supermarché",pharmacie:"Pharmacie",service:"Service"}[selCats.find(c=>["boutique","restaurant","patisserie","supermarche","pharmacie","service"].includes(c))]||"—"]]:[["Véhicule","🛵 Honda PCX"],["Plaque","BZ-4521"],["Inscription","5 000 FCFA (unique)"],["Commission","15% par livraison"]]),
            ["Documents",`${Object.values(docs).filter(v=>v&&v!==true&&v!==false).length}/${Object.keys(docs).length}`],
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
