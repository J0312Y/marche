import { useState } from "react";
import toast from "../../utils/toast";

function VAddShopScr({onBack}){
  const [step,setStep]=useState(0);const [docs,setDocs]=useState({id:false,rccm:false,photo:false});const [done,setDone]=useState(false);
  const [shopType,setShopType]=useState(null);
  const [selCats,setSelCats]=useState([]);
  const [shopName,setShopName]=useState("");const [shopCity,setShopCity]=useState("");const [shopArea,setShopArea]=useState("");
  const steps=["Type","Infos","Documents","Confirmation"];
  const maxStep=steps.length-1;
  const toggleCat=c=>setSelCats(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c]);
  const [shopErrors,setShopErrors]=useState({});
  const canNext=step===0?!!shopType:true;
  const validateShop=()=>{
    if(step===0&&!shopType){toast.error("Choisissez un type");return false}
    if(step===1){
      const e={};
      if(!shopName.trim()) e.name="Nom requis";
      if(!shopCity.trim()) e.city="Ville requise";
      if(!shopArea.trim()) e.area="Quartier requis";
      const descEl=document.querySelector("textarea[placeholder]");
      if(!descEl?.value?.trim()) e.desc="Description requise";
      setShopErrors(e);
      if(Object.keys(e).length){toast.error("Remplissez les champs obligatoires");return false}
    }
    if(step===2){
      const missing=[];
      if(!docs.id) missing.push("Pièce d'identité");
      // RCCM optionnel pour les boutiques
      if(!docs.photo) missing.push("Photo de l'établissement");
      if(missing.length){toast.error("Documents requis : "+missing.join(", "));return false}
    }
    return true;
  };
  const advance=()=>{if(!canNext)return;if(!validateShop())return;step<maxStep?setStep(step+1):setDone(true);toast.success("Boutique créée avec succès 🏪")};

  const shopTypes=[
    {id:"boutique",icon:"🏪",name:"Boutique",desc:"Mode, électronique, artisanat, accessoires..."},
    {id:"restaurant",icon:"🍽️",name:"Restaurant",desc:"Plats cuisinés, snacks, boissons, traiteur"},
    {id:"patisserie",icon:"🧁",name:"Pâtisserie / Boulangerie",desc:"Gâteaux, pains, viennoiseries, confiseries"},
    {id:"supermarche",icon:"🛒",name:"Supermarché / Épicerie",desc:"Produits alimentaires, ménagers, du quotidien"},
    {id:"pharmacie",icon:"💊",name:"Pharmacie / Parapharmacie",desc:"Médicaments, cosmétiques, produits de santé"},
    {id:"service",icon:"🔧",name:"Service",desc:"Réparation, beauté, impression, pressing..."},
  ];

  const catsByType={
    boutique:["Mode","Accessoires","Électronique","Beauté","Maison","Artisanat","Sport","Bijoux","Chaussures"],
    restaurant:["Africain","Braisé","Fast-food","Pizzeria","Asiatique","Libanais","Traiteur","Boissons","Végétarien"],
    patisserie:["Gâteaux","Pâtisseries","Boulangerie","Viennoiseries","Confiseries","Glaces","Chocolat","Gâteaux sur commande"],
    supermarche:["Alimentation","Fruits & Légumes","Boissons","Ménager","Bébé","Hygiène","Conserves","Surgelés"],
    pharmacie:["Médicaments","Cosmétiques","Hygiène","Compléments","Matériel médical","Parapharmacie"],
    service:["Coiffure","Couture","Réparation","Impression","Pressing","Beauté","Photo","Événementiel"],
  };

  if(done)return(<div className="scr" style={{textAlign:"center",padding:20,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{padding:"40px 0"}}>
    <div style={{fontSize:48,marginBottom:10}}>🎉</div>
    <h3 style={{fontSize:18,fontWeight:700}}>Boutique créée !</h3>
    <p style={{fontSize:14,fontWeight:600,color:"#F97316",marginTop:4}}>{shopTypes.find(t=>t.id===shopType)?.icon} {shopName||"Nouvelle boutique"}</p>
    <p style={{fontSize:13,color:"var(--muted)",marginTop:6,lineHeight:1.6}}>En cours de vérification · Validation sous 24-48h.</p>
    <button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour aux boutiques</button>
  </div></div>);

  return(<>
    <div className="appbar"><button onClick={()=>step>0?setStep(step-1):onBack()}>←</button><h2>Nouvelle boutique</h2><div style={{width:38}}/></div>
    <div className="vr-steps">{steps.map((s,i)=><div key={s} style={{display:"contents"}}>{i>0&&<div className={`vr-line ${step>=i?"on":""}`}/>}<div className="step-col"><div className={`vr-dot ${step>i?"done":step>=i?"on":""}`}>{step>i?"✓":i+1}</div><div className={`vr-lbl ${step>=i?"on":""}`}>{s}</div></div></div>)}</div>
    <div className="scr" style={{padding:16}}>

      {/* Step 0: Shop type */}
      {step===0&&<>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:6}}>Type d'établissement</h3>
        <p style={{fontSize:12,color:"var(--muted)",marginBottom:14}}>Choisissez le type qui correspond le mieux à votre activité</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {shopTypes.map(t=><div key={t.id} onClick={()=>setShopType(t.id)} style={{padding:16,background:shopType===t.id?"rgba(249,115,22,0.06)":"var(--card)",border:shopType===t.id?"2px solid #F97316":"2px solid var(--border)",borderRadius:16,cursor:"pointer",textAlign:"center",transition:"all .15s",position:"relative"}}>
            {shopType===t.id&&<div style={{position:"absolute",top:6,right:6,width:18,height:18,borderRadius:"50%",background:"#F97316",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff"}}>✓</div>}
            <div style={{fontSize:32,marginBottom:6}}>{t.icon}</div>
            <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>{t.name}</div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:4,lineHeight:1.4}}>{t.desc}</div>
          </div>)}
        </div>
      </>}

      {/* Step 1: Info */}
      {step===1&&<>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:4}}>Informations</h3>
        <p style={{fontSize:11,color:"var(--muted)",marginBottom:14}}>{shopTypes.find(t=>t.id===shopType)?.icon} {shopTypes.find(t=>t.id===shopType)?.name}</p>
        <div className="vr-upload"><div className="vu-icon">🖼️</div><b>{shopType==="restaurant"?"Photo du restaurant":shopType==="patisserie"?"Photo de la pâtisserie":"Logo de la boutique"}</b><p>PNG, JPG · Max 2MB</p></div>
        <div className="field"><label>Nom {shopType==="restaurant"?"du restaurant":shopType==="patisserie"?"de la pâtisserie":"de la boutique"} <span style={{color:"#EF4444"}}>*</span></label><input value={shopName} onChange={e=>setShopName(e.target.value)} placeholder={shopType==="restaurant"?"Ex: Chez Mama Ngudi":shopType==="patisserie"?"Ex: Pâtisserie La Congolaise":"Ex: Congo Tech Store"}/></div>
        <div className="field"><label>Description <span style={{color:"#EF4444"}}>*</span></label><textarea rows={2} placeholder={shopType==="restaurant"?"Type de cuisine, spécialités, ambiance...":shopType==="patisserie"?"Vos spécialités, horaires de cuisson...":"Décrivez votre activité..."}/></div>
        <div className="field-row"><div className="field"><label>Ville <span style={{color:"#EF4444"}}>*</span></label><input value={shopCity} onChange={e=>setShopCity(e.target.value)} placeholder="Brazzaville"/></div><div className="field"><label>Quartier <span style={{color:"#EF4444"}}>*</span></label><input value={shopArea} onChange={e=>setShopArea(e.target.value)} placeholder="Centre-ville"/></div></div>
        <div className="field"><label>Adresse complète <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><input placeholder="N° rue, avenue..."/></div>
        <div className="field"><label>Téléphone <span style={{color:"#EF4444"}}>*</span></label><input placeholder="06X XXX XXX" maxLength={11}/></div>
        {(shopType==="restaurant"||shopType==="patisserie")&&<div className="field"><label>Horaires d'ouverture <span style={{color:"#EF4444"}}>*</span></label><input placeholder="Ex: Lun-Sam 7h-22h"/></div>}
        {shopType==="restaurant"&&<div className="field"><label>Temps de préparation moyen <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><input placeholder="Ex: 30-45 min"/></div>}
        <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--sub)",margin:"14px 0 8px"}}>Catégories <span style={{color:"var(--muted)",fontWeight:400}}>({selCats.length} sélectionnée{selCats.length>1?"s":""})</span></label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {(catsByType[shopType]||catsByType.boutique).map(c=><span key={c} onClick={()=>toggleCat(c)} style={{padding:"8px 14px",borderRadius:10,background:selCats.includes(c)?"rgba(249,115,22,0.08)":"var(--card)",border:selCats.includes(c)?"2px solid #F97316":"2px solid var(--border)",color:selCats.includes(c)?"#F97316":"var(--sub)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>{selCats.includes(c)?"✓ ":""}{c}</span>)}
        </div>
      </>}

      {/* Step 2: Documents */}
      {step===2&&<>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Documents requis</h3>
        <div className="info-box blue" style={{marginBottom:14}}><span>ℹ️</span><span style={{fontSize:11}}>Les documents sont vérifiés séparément pour chaque {shopType==="restaurant"?"restaurant":shopType==="patisserie"?"pâtisserie":"boutique"}.</span></div>
        {[["🪪","Pièce d'identité du responsable","Carte ou passeport","id"],
          ["📄","RCCM / Patente","Registre de commerce (optionnel)","rccm"],
          ["📸",shopType==="restaurant"?"Photo du restaurant":shopType==="patisserie"?"Photo de la pâtisserie":"Photo de l'établissement","Façade et intérieur","photo"],
          ...(shopType==="restaurant"?[["🍽️","Certificat d'hygiène","Délivré par la mairie (si disponible)","hygiene"]]:[]),
        ].map(([i,t,d,k])=><div key={k} className="vr-doc" onClick={()=>setDocs({...docs,[k]:true})}><span className="vdi">{i}</span><div className="vdt"><h5>{t}</h5><p>{d}</p></div><span className={`vds ${docs[k]?"up":"pend"}`}>{docs[k]?"✓ Envoyé":"À envoyer"}</span></div>)}
      </>}

      {/* Step 3: Summary */}
      {step===3&&<>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Résumé</h3>
        <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
          <div style={{textAlign:"center",marginBottom:12}}>
            <span style={{fontSize:36}}>{shopTypes.find(t=>t.id===shopType)?.icon}</span>
            <div style={{fontSize:15,fontWeight:700,marginTop:4}}>{shopName||"Nouvelle boutique"}</div>
          </div>
          {[["Type",shopTypes.find(t=>t.id===shopType)?.name],["Ville",(shopCity||"—")+", "+(shopArea||"—")],["Catégories",selCats.join(", ")||"—"],["Documents",`${Object.values(docs).filter(Boolean).length}/${shopType==="restaurant"?4:3}`],["Plan","Enterprise ★ (partagé)"],["Commission","2%"]].map(([l,v])=><div key={l} className="vs-row"><span>{l}</span><b>{v}</b></div>)}
        </div>
        <div className="info-box green"><span>✅</span><span style={{fontSize:11}}>Ce{shopType==="restaurant"?" restaurant":shopType==="patisserie"?"tte pâtisserie":"tte boutique"} bénéficiera de votre plan Enterprise : 2% commission, dashboard personnalisé, manager dédié.</span></div>
      </>}

      {/* ── Button always inside scroll area ── */}
      <div style={{paddingTop:24,paddingBottom:16}}>
        <button className="btn-primary" style={{background:!canNext?"var(--border)":"#F97316",color:!canNext?"var(--muted)":"#fff"}} onClick={advance}>{step===maxStep?"🚀 Créer l'établissement":"Continuer"}</button>
      </div>

    </div>
  </>);
}

export default VAddShopScr;
