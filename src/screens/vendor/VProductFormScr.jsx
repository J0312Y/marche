import { useState, useRef } from "react";
import Img from "../../components/Img";
import PhotoGuide from "../../components/PhotoGuide";
import VariantEditor from "../../components/VariantEditor";
import { analyzeImage, enhanceImage, cropImage, generateVariants } from "../../utils/imageProcessor";
import { CATS } from "../../data";
import { vendor } from "../../services";
import toast from "../../utils/toast";

function VProductFormScr({product:p,onBack,shopType="boutique"}){
  const isEdit=!!p;

  // ── Form fields (controlled) ──
  const [name,setName]=useState(isEdit?p.name:"");
  const [description,setDescription]=useState(isEdit?"Robe en wax africain, coupe moderne, tailles S-XL":"");
  const [price,setPrice]=useState(isEdit?String(p.price):"");
  const [oldPrice,setOldPrice]=useState("");
  const [selectedCat,setSelectedCat]=useState(isEdit?p.cat:"");
  const [stock,setStock]=useState(isEdit?String(p.stock):"");
  const [tags,setTags]=useState(isEdit?"Mode, Wax, Africain":"");
  const [weight,setWeight]=useState("250");
  const [active,setActive]=useState(isEdit?p.active:true);
  const [articleVariants,setArticleVariants]=useState(()=>{
    // En mode édition, charger les variantes existantes
    if(isEdit&&p.variants&&p.variants.length>0){
      return p.variants.map(v=>({
        key:v.key,
        label:v.label,
        values:(v.options||[]).map(o=>({
          name:o.name,
          stock:o.stock!==null&&o.stock!==undefined?String(o.stock):"",
          price_delta:o.price_delta?String(o.price_delta):"",
        }))
      }));
    }
    return [];
  });

  // ── UI state ──
  const [showDelete,setShowDelete]=useState(false);
  const [showGuide,setShowGuide]=useState(false);
  const [errors,setErrors]=useState({});
  const [submitting,setSubmitting]=useState(false);
  const [success,setSuccess]=useState(false);

  // ── Photo management ──
  const fileRef=useRef(null);
  const [photos,setPhotos]=useState(isEdit&&p.photo?[{url:p.photo,emoji:p.img,status:"existing"}]:[]);
  const [editingIdx,setEditingIdx]=useState(null);
  const [processing,setProcessing]=useState(false);
  const [enhancing,setEnhancing]=useState(false);

  // ── Validation ──
  const validate=()=>{
    const errs={};
    if(!name.trim()) errs.name="Le nom est obligatoire";
    if(!price||isNaN(price)||Number(price)<=0) errs.price="Prix invalide";
    if(!selectedCat) errs.cat="Choisissez une catégorie";
    if(photos.length===0) errs.photos="Ajoutez au moins 1 photo";
    if(oldPrice&&Number(oldPrice)>0&&Number(oldPrice)<=Number(price)) errs.oldPrice="Le prix barré doit être supérieur au prix";
    setErrors(errs);
    return Object.keys(errs).length===0;
  };

  // ── Submit ──
  const handleSubmit=async()=>{
    if(!validate()) return;
    setSubmitting(true);

    const articleData={
      name:name.trim(),
      description:description.trim(),
      price:Number(price),
      old_price:oldPrice?Number(oldPrice):null,
      category:selectedCat,
      stock:stock?Number(stock):-1,
      tags:tags.split(",").map(t=>t.trim()).filter(Boolean),
      weight:weight?Number(weight):null,
      is_active:active?1:0,
      variants:articleVariants.filter(v=>v.values.length>0).map(v=>({
        key:v.key,
        label:v.label,
        options:v.values.map(val=>({
          name:val.name,
          stock:val.stock?Number(val.stock):null,
          price_delta:val.price_delta?Number(val.price_delta):0,
        }))
      })),
    };

    try{
      let result;
      if(isEdit){
        result=await vendor.updateArticle(p.id, articleData);
      }else{
        result=await vendor.createArticle(articleData);
      }

      // Upload des photos si nouvelles
      if(result?.id){
        const newPhotos=photos.filter(ph=>ph.status==="ready"&&ph.file);
        for(const ph of newPhotos){
          try{ await vendor.uploadImage(result.id, ph.file); }catch(e){ console.warn("Photo upload failed:",e); }
        }
      }

      setSubmitting(false);
      setSuccess(true);toast.success(isEdit?"Article modifié avec succès ✏️":"Article ajouté avec succès 📦");
      setTimeout(()=>onBack(),1500);
    }catch(err){
      setSubmitting(false);
      setErrors({submit:err.message||"Erreur lors de l'enregistrement"});
    }
  };

  // ── Photo handlers ──
  const handleFile=async(e)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    e.target.value="";
    if(photos.length>=6){toast.error("Maximum 6 photos 📸");return;}
    setProcessing(true);
    if(errors.photos) setErrors(prev=>{const n={...prev};delete n.photos;return n;});
    try{
      const analysis=await analyzeImage(file);
      const cropped=await cropImage(file,"1:1");
      const croppedFile=new File([cropped.blob],file.name,{type:"image/jpeg"});
      let finalUrl=cropped.url; let enhanced=false;
      if(analysis.brightness<100||analysis.contrast<30){
        const enhancements={};
        if(analysis.brightness<100) enhancements.brightness=Math.min(25,100-analysis.brightness);
        if(analysis.contrast<30) enhancements.contrast=12;
        const result=await enhanceImage(croppedFile,enhancements);
        finalUrl=result.url; enhanced=true;
      }
      const imgVariants=await generateVariants(croppedFile);
      setPhotos(prev=>[...prev,{url:finalUrl,file:croppedFile,analysis,variants:imgVariants,enhanced,status:"ready"}]);
      setEditingIdx(photos.length);
    ;toast.success(product?"Article modifié ✅":"Article créé ✅")}catch(err){toast.error("Erreur: "+err.message);}
    setProcessing(false);
  };

  const doEnhance=async(idx,opts)=>{
    const photo=photos[idx]; if(!photo.file) return;
    setEnhancing(true);
    try{ const result=await enhanceImage(photo.file,opts); const np=[...photos]; np[idx]={...photo,url:result.url,enhanced:true}; setPhotos(np); }catch(e){}
    setEnhancing(false);
  };

  const removePhoto=(idx)=>{
    setPhotos(prev=>prev.filter((_,i)=>i!==idx));
    if(editingIdx===idx) setEditingIdx(null);
    else if(editingIdx>idx) setEditingIdx(editingIdx-1);
  };

  const editPhoto=editingIdx!==null?photos[editingIdx]:null;
  const fieldStyle=(key)=>errors[key]?{borderColor:"#EF4444",background:"rgba(239,68,68,0.02)"}:{};
  const errMsg=(key)=>errors[key]?<div style={{fontSize:11,color:"#EF4444",marginTop:3}}>{errors[key]}</div>:null;
  const clearErr=(key)=>{ if(errors[key]) setErrors(prev=>{const n={...prev};delete n[key];return n;}); };

  // ═══ SUCCESS SCREEN ═══
  if(success) return(
    <div className="scr" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,textAlign:"center"}}>
      <div style={{width:80,height:80,borderRadius:40,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,animation:"fadeIn .3s ease"}}>
        <span style={{fontSize:40}}>✅</span>
      </div>
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>{isEdit?"Article modifié !":"Article ajouté !"}</h2>
      <p style={{fontSize:13,color:"var(--muted)"}}>{name} — {Number(price).toLocaleString()} FCFA</p>
      {articleVariants.filter(v=>v.values.length>0).length>0&&(
        <p style={{fontSize:12,color:"#6366F1",marginTop:4}}>
          {articleVariants.filter(v=>v.values.length>0).map(v=>`${v.values.length} ${v.label.toLowerCase()}`).join(" · ")}
        </p>
      )}
      <p style={{fontSize:11,color:"var(--muted)",marginTop:16}}>Retour à la liste...</p>
    </div>
  );

  return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>{isEdit?"Modifier":"Ajouter"} un article</h2><div style={{width:38}}/></div>

    {/* ═══ PHOTOS ═══ */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <div style={{fontSize:14,fontWeight:700}}>Photos <span style={{fontSize:11,fontWeight:500,color:errors.photos?"#EF4444":"var(--muted)"}}>({photos.length}/6){errors.photos?" *":""}</span></div>
      <button onClick={()=>setShowGuide(true)} style={{padding:"4px 10px",borderRadius:8,border:"1px solid rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.04)",color:"#6366F1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>📸 Guide photo</button>
    </div>
    {errMsg("photos")}

    <div style={{display:"flex",gap:10,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
      {photos.map((ph,i)=>(
        <div key={i} onClick={()=>setEditingIdx(editingIdx===i?null:i)} style={{width:80,height:80,borderRadius:14,overflow:"hidden",position:"relative",flexShrink:0,cursor:"pointer",border:editingIdx===i?"2px solid #6366F1":"1px solid var(--border)",boxShadow:editingIdx===i?"0 0 0 3px rgba(99,102,241,0.15)":"none"}}>
          {ph.url?<img src={ph.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<Img emoji={ph.emoji} style={{width:"100%",height:"100%"}} fit="cover"/>}
          <button onClick={e=>{e.stopPropagation();removePhoto(i)}} style={{position:"absolute",top:-2,right:-2,width:20,height:20,borderRadius:"50%",background:"#EF4444",color:"#fff",border:"none",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          {ph.analysis&&<div style={{position:"absolute",bottom:4,left:4,width:8,height:8,borderRadius:4,background:ph.analysis.color,boxShadow:`0 0 4px ${ph.analysis.color}`}}/>}
          {i===0&&<div style={{position:"absolute",bottom:4,right:4,padding:"1px 5px",borderRadius:4,background:"#6366F1",color:"#fff",fontSize:8,fontWeight:700}}>MAIN</div>}
        </div>
      ))}
      {photos.length<6&&(
        <div onClick={()=>fileRef.current?.click()} style={{width:80,height:80,borderRadius:14,border:errors.photos?"2px dashed #EF4444":"2px dashed #E8E6E1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,background:"var(--bg)"}}>
          {processing?<div style={{fontSize:11,color:"#6366F1",fontWeight:600}}>⏳</div>:<><div style={{fontSize:22,color:"var(--muted)",lineHeight:1}}>+</div><div style={{fontSize:9,color:"var(--muted)",marginTop:2}}>Ajouter</div></>}
        </div>
      )}
    </div>
    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>

    {/* Photo editor */}
    {editPhoto&&<div style={{marginBottom:12,padding:14,background:"var(--bg)",borderRadius:16,border:"1px solid var(--border)"}}>
      <div style={{position:"relative",borderRadius:12,overflow:"hidden",marginBottom:12,aspectRatio:"1/1",background:"var(--card)"}}>
        <img src={editPhoto.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
        {editPhoto.enhanced&&<div style={{position:"absolute",top:8,left:8,padding:"3px 8px",borderRadius:6,background:"rgba(16,185,129,0.9)",color:"#fff",fontSize:10,fontWeight:600}}>✨ Améliorée</div>}
      </div>
      {editPhoto.analysis&&<>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontSize:12,fontWeight:600}}>Qualité</span>
          <span style={{fontSize:12,fontWeight:700,color:editPhoto.analysis.color}}>{editPhoto.analysis.score}/100 — {editPhoto.analysis.label}</span>
        </div>
        <div style={{height:6,borderRadius:3,background:"var(--border)",overflow:"hidden",marginBottom:8}}>
          <div style={{width:`${editPhoto.analysis.score}%`,height:"100%",borderRadius:3,background:editPhoto.analysis.color,transition:"width .5s ease"}}/>
        </div>
        {editPhoto.analysis.issues.length>0&&<div style={{marginBottom:10}}>
          {editPhoto.analysis.issues.map((issue,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 0",fontSize:11,color:issue.severity==="error"?"#EF4444":"#F59E0B"}}><span>{issue.severity==="error"?"⚠️":"💡"}</span>{issue.msg}</div>)}
        </div>}
      </>}
      <div style={{display:"flex",gap:8}}>
        <button disabled={enhancing||!editPhoto.file} onClick={()=>doEnhance(editingIdx,{brightness:15})} style={{flex:1,padding:"8px 0",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",opacity:enhancing?.5:1}}>☀️ Éclaircir</button>
        <button disabled={enhancing||!editPhoto.file} onClick={()=>doEnhance(editingIdx,{contrast:15})} style={{flex:1,padding:"8px 0",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",opacity:enhancing?.5:1}}>🎨 Contraste</button>
        <button disabled={enhancing||!editPhoto.file} onClick={()=>doEnhance(editingIdx,{brightness:10,contrast:10,sharpen:true})} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",opacity:enhancing?.5:1}}>✨ Auto</button>
      </div>
      {/* Live preview */}
      <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)"}}>
        <div style={{fontSize:11,fontWeight:600,color:"var(--muted)",marginBottom:8}}>👁️ Aperçu client</div>
        <div style={{display:"flex",gap:10}}>
          <div style={{width:120,borderRadius:12,overflow:"hidden",border:"1px solid var(--border)",background:"var(--card)",flexShrink:0}}>
            <div style={{height:100,background:"var(--light)",overflow:"hidden"}}><img src={editPhoto.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
            <div style={{padding:"6px 8px"}}>
              <div style={{fontSize:10,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name||"Nom du produit"}</div>
              <div style={{fontSize:11,fontWeight:700,color:"#6366F1",marginTop:2}}>{price?`${Number(price).toLocaleString()} F`:"— F"}</div>
            </div>
          </div>
          <div style={{flex:1,borderRadius:12,overflow:"hidden",border:"1px solid var(--border)",background:"var(--card)"}}>
            <div style={{height:100,background:"var(--light)",overflow:"hidden"}}><img src={editPhoto.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
            <div style={{padding:8,fontSize:9,color:"var(--muted)"}}>Vue détail</div>
          </div>
        </div>
      </div>
    </div>}

    {/* Empty photo CTA */}
    {photos.length===0&&!errors.photos&&<div onClick={()=>setShowGuide(true)} style={{padding:16,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.12)",borderRadius:14,marginBottom:14,cursor:"pointer"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:28}}>📸</span>
        <div><div style={{fontSize:13,fontWeight:700,color:"#6366F1"}}>Ajoutez de belles photos</div><div style={{fontSize:11,color:"var(--sub)",marginTop:2}}>Consultez notre guide →</div></div>
      </div>
    </div>}
    {photos.length===0&&<div onClick={()=>fileRef.current?.click()} style={{padding:24,borderRadius:16,border:errors.photos?"2px dashed #EF4444":"2px dashed rgba(99,102,241,0.3)",background:errors.photos?"rgba(239,68,68,0.02)":"rgba(99,102,241,0.02)",textAlign:"center",cursor:"pointer",marginBottom:12}}>
      <div style={{width:56,height:56,borderRadius:16,background:"rgba(99,102,241,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:6}}>📷</div>
      <div style={{fontSize:14,fontWeight:600,color:errors.photos?"#EF4444":"#6366F1"}}>Prendre ou choisir une photo</div>
      <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>JPEG, PNG · Min 500×500px · Max 10 MB</div>
    </div>}

    {/* ═══ FORM FIELDS ═══ */}
    <div className="field"><label>Nom de l'article *</label><input value={name} onChange={e=>{setName(e.target.value);clearErr("name")}} placeholder="Ex: Poulet DG, Robe Wax, Doliprane..." style={fieldStyle("name")}/>{errMsg("name")}</div>
    <div className="field"><label>Description</label><textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Décrivez votre article..."/></div>
    <div className="field-row">
      <div className="field"><label>Prix (FCFA) *</label><input type="number" value={price} onChange={e=>{setPrice(e.target.value);clearErr("price")}} placeholder="25000" style={fieldStyle("price")}/>{errMsg("price")}</div>
      <div className="field"><label>Prix barré</label><input type="number" value={oldPrice} onChange={e=>{setOldPrice(e.target.value);clearErr("oldPrice")}} placeholder="Optionnel" style={fieldStyle("oldPrice")}/>{errMsg("oldPrice")}</div>
    </div>
    <div className="field-row">
      <div className="field"><label>Catégorie *</label><select value={selectedCat} onChange={e=>{setSelectedCat(e.target.value);clearErr("cat")}} style={fieldStyle("cat")}><option value="">Choisir...</option>{CATS.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}</select>{errMsg("cat")}</div>
      <div className="field"><label>Stock</label><input type="number" value={stock} onChange={e=>setStock(e.target.value)} placeholder="0 = illimité"/></div>
    </div>

    {/* ═══ VARIANTS ═══ */}
    <div style={{margin:"16px 0 10px"}}><VariantEditor shopType={shopType} category={selectedCat} value={articleVariants} onChange={setArticleVariants}/></div>

    <div className="field"><label>Tags</label><input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Séparer par des virgules"/></div>
    <div className="field"><label>Poids (g)</label><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Pour calcul livraison"/></div>

    <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}><div className={`toggle ${active?"on":""}`} onClick={()=>setActive(!active)}/><span style={{fontSize:14,fontWeight:500}}>Article actif</span></div>

    {/* Error summary */}
    {Object.keys(errors).length>0&&<div style={{padding:10,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.12)",borderRadius:12,marginBottom:12}}>
      <div style={{fontSize:12,fontWeight:600,color:"#EF4444"}}>⚠️ Corrigez les erreurs ci-dessus</div>
      <div style={{fontSize:11,color:"var(--sub)",marginTop:2}}>{Object.values(errors).join(" · ")}</div>
    </div>}

    {/* ═══ SUBMIT ═══ */}
    <button className="btn-primary" style={{marginBottom:14,opacity:submitting?.7:1}} onClick={handleSubmit} disabled={submitting}>
      {submitting?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span className="spinner"/>  {isEdit?"Enregistrement...":"Ajout en cours..."}</span>
        :(isEdit?"💾 Enregistrer les modifications":"➕ Ajouter l'article")}
    </button>

    {isEdit&&!showDelete&&<button className="btn-outline" style={{color:"#EF4444",borderColor:"rgba(239,68,68,.3)"}} onClick={()=>setShowDelete(true)}>🗑️ Supprimer cet article</button>}
    {isEdit&&showDelete&&<div style={{padding:16,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#EF4444",marginBottom:6}}>⚠️ Supprimer "{p.name}" ?</div>
      <p style={{fontSize:12,color:"var(--sub)",marginBottom:12}}>Cette action est irréversible.</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowDelete(false)}>Annuler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onBack}>🗑️ Confirmer</button>
      </div>
    </div>}

    {showGuide&&<PhotoGuide onClose={()=>setShowGuide(false)} shopType={shopType}/>}
  </div>);
}

export default VProductFormScr;
