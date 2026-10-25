import { useEffect, useState, useRef } from "react";
import Select from "../../components/Select";
import Img from "../../components/Img";
import PhotoGuide from "../../components/PhotoGuide";
import OptionGroupsEditor, { cleanOptionGroups } from "../../components/OptionGroupsEditor";
import { analyzeImage, enhanceImage, cropImage, generateVariants } from "../../utils/imageProcessor";
import { useLoad } from "../../hooks/useData";
import catalog from "../../services/catalogService";
import { vendor } from "../../services";
import { imagesAPI } from "../../api";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";

function VProductFormScr({product:p,onBack,shopType="restaurant"}){
  const isEdit=!!p;

  // ── Categories from API ──
  const { data: catsData } = useLoad(() => catalog.getCategories());
  const ALL_CATS = catsData || [];
  // Type de commerce (restaurant, boutique…) pour proposer les bons modèles d'options
  const { data: settingsData } = useLoad(() => vendor.getSettings());
  const storeType = settingsData?.establishment?.type || shopType;
  // Seules les catégories de son type de commerce (gérées par Lamuka dans le panneau d'administration)
  const CATS = storeType ? ALL_CATS.filter((c) => !c.commerce_type || c.commerce_type === storeType || c.commerce_type === "all") : ALL_CATS;
  // Sections déjà utilisées par le commerce (« Entrées », « Boissons »…) proposées en un geste
  const { data: myArticles } = useLoad(() => vendor.getArticles());
  const mySections = [...new Set((myArticles || []).map((a) => a.menu_section).filter(Boolean))];

  // ── Form fields (controlled) ──
  const [name,setName]=useState(isEdit?p.name:"");
  const [description,setDescription]=useState(isEdit?(p.description||""):"");
  const [price,setPrice]=useState(isEdit?String(p.price):"");
  const [oldPrice,setOldPrice]=useState(isEdit&&Number(p.old_price||p.old)>0?String(p.old_price||p.old):"");
  const [selectedCat,setSelectedCat]=useState(isEdit?(p.category_name||p.cat||""):"");
  const [section,setSection]=useState(isEdit?(p.menu_section||""):"");
  // Stock : vide = illimité (stocké -1 sur le serveur), 0 = rupture
  const [stock,setStock]=useState(isEdit&&p.stock!==null&&p.stock!==undefined&&Number(p.stock)>=0?String(p.stock):"");
  const [tags,setTags]=useState(()=>{if(!isEdit)return "";try{const t=typeof p.tags==="string"?JSON.parse(p.tags):p.tags;return Array.isArray(t)?t.join(", "):"";}catch{return "";}});
  const [weight,setWeight]=useState(isEdit&&p.weight?String(p.weight):"");
  const [active,setActive]=useState(isEdit?(p.is_active===undefined?p.active!==false:Number(p.is_active)===1):true);
  const [optionGroups,setOptionGroups]=useState(()=>isEdit&&Array.isArray(p.option_groups)?p.option_groups.map(g=>({...g,options:g.options.map(o=>({...o}))})):[]);

  // ── UI state ──
  const [showDelete,setShowDelete]=useState(false);
  const [showGuide,setShowGuide]=useState(false);
  const [errors,setErrors]=useState({});
  const [submitting,setSubmitting]=useState(false);
  const [success,setSuccess]=useState(false);

  // ── Photo management ──
  const fileRef=useRef(null);



  const [photos,setPhotos]=useState(isEdit&&p.photo?[{url:p.photo,emoji:p.img,status:"existing"}]:[]);
  // Modification : toute la galerie de l'article (pas seulement la photo principale) ; photos retirées supprimées à l'enregistrement
  const [removedIds,setRemovedIds]=useState([]);
  useEffect(()=>{
    if(!isEdit||!p?.id) return;
    imagesAPI.list(p.id).then(r=>{
      const imgs=(r?.images||[]).map(im=>({url:im.image_url||im.medium_url,imageId:Number(im.id),status:"existing"}));
      if(imgs.length) setPhotos(imgs);
    }).catch(()=>{});
  },[isEdit,p?.id]);
  const movePhotoFirst=(idx)=>setPhotos(prev=>[prev[idx],...prev.filter((_,i)=>i!==idx)]);
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
      category_id:(CATS.find(c=>c.name===selectedCat)||{}).id||null,
      menu_section:section.trim()||null,
      stock:stock!==""?Math.max(0,Number(stock)):-1,
      tags:tags.split(",").map(t=>t.trim()).filter(Boolean),
      weight:weight?Number(weight):null,
      is_active:active?1:0,
      variants:cleanOptionGroups(optionGroups),
    };

    try{
      let result;
      if(isEdit){
        result=await vendor.updateArticle(p.id, articleData);
      }else{
        result=await vendor.createArticle(articleData);
      }

      // Upload des nouvelles photos (création : id renvoyé par l'API ; modification : id existant)
      const articleId=isEdit?p.id:result?.id;
      let failedPhotos=0;
      if(articleId){
        for(const id of removedIds){ try{ await imagesAPI.delete(id); }catch{ /* déjà supprimée */ } }
        // Envoi des nouvelles photos puis ordre final de la galerie (la première = photo principale de l'article)
        const ids=[];
        for(const ph of photos){
          if(ph.imageId){ ids.push(ph.imageId); continue; }
          if(ph.status==="ready"&&ph.file){
            try{ const r=await vendor.uploadImage(articleId, ph.file); if(r?.id) ids.push(Number(r.id)); }catch{ failedPhotos++; }
          }
        }
        if(ids.length>1){ try{ await imagesAPI.reorder(articleId, ids); }catch{ /* ordre d'envoi conservé */ } }
      }

      setSubmitting(false);
      setSuccess(true);
      if(failedPhotos>0) toast.error("Article enregistré, mais "+failedPhotos+" photo(s) n'ont pas pu être envoyée(s). Réessayez depuis la modification.");
      else toast.success(isEdit?"Article modifié avec succès":"Article ajouté avec succès");
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
    if(photos.length>=6){toast.error("Maximum 6 photos");return;}
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
      toast.success("Photo ajoutée");
    }catch(err){toast.error("Impossible de traiter la photo : "+err.message);}
    setProcessing(false);
  };

  const doEnhance=async(idx,opts)=>{
    const photo=photos[idx]; if(!photo.file) return;
    setEnhancing(true);
    try{ const result=await enhanceImage(photo.file,opts); const np=[...photos]; np[idx]={...photo,url:result.url,enhanced:true}; setPhotos(np); }catch(e){}
    setEnhancing(false);
  };

  const removePhoto=(idx)=>{
    const ph=photos[idx]; if(ph?.imageId) setRemovedIds(r=>[...r,ph.imageId]);
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
        <Icon name="check_circle" size={40} color="#10B981"/>
      </div>
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>{isEdit?"Article modifié !":"Article ajouté !"}</h2>
      <p style={{fontSize:13,color:"var(--muted)"}}>{name} — {Number(price).toLocaleString()} FCFA</p>
      {cleanOptionGroups(optionGroups).length>0&&(
        <p style={{fontSize:12,color:"#F97316",marginTop:4}}>
          {cleanOptionGroups(optionGroups).map(g=>`${g.label} (${g.options.length})`).join(" · ")}
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
      <button onClick={()=>setShowGuide(true)} style={{padding:"4px 10px",borderRadius:8,border:"1px solid rgba(249,115,22,0.2)",background:"rgba(249,115,22,0.04)",color:"#F97316",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}><Icon name="camera" size={16}/>{" "}Guide photo</button>
    </div>
    {errMsg("photos")}

    <div style={{display:"flex",gap:10,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
      {photos.map((ph,i)=>(
        <div key={i} onClick={()=>setEditingIdx(editingIdx===i?null:i)} style={{width:80,height:80,borderRadius:14,overflow:"hidden",position:"relative",flexShrink:0,cursor:"pointer",border:editingIdx===i?"2px solid #F97316":"1px solid var(--border)",boxShadow:editingIdx===i?"0 0 0 3px rgba(249,115,22,0.15)":"none"}}>
          {ph.url?<img src={ph.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<Img emoji={ph.emoji} style={{width:"100%",height:"100%"}} fit="cover"/>}
          <button onClick={e=>{e.stopPropagation();removePhoto(i)}} style={{position:"absolute",top:-2,right:-2,width:20,height:20,borderRadius:"50%",background:"#EF4444",color:"#fff",border:"none",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}></button>
          {ph.analysis&&<div style={{position:"absolute",bottom:4,left:4,width:8,height:8,borderRadius:4,background:ph.analysis.color,boxShadow:`0 0 4px ${ph.analysis.color}`}}/>}
          {i===0&&<div style={{position:"absolute",bottom:4,right:4,padding:"1px 5px",borderRadius:4,background:"#F97316",color:"#fff",fontSize:8,fontWeight:700}}>PRINCIPALE</div>}
          {i>0&&<button onClick={e=>{e.stopPropagation();movePhotoFirst(i)}} aria-label="Mettre en photo principale" title="Mettre en photo principale" style={{position:"absolute",bottom:4,right:4,padding:"1px 5px",borderRadius:4,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:8,fontWeight:700,border:"none",cursor:"pointer"}}>EN 1ʳᵉ</button>}
        </div>
      ))}
      {photos.length<6&&(
        <div onClick={()=>fileRef.current?.click()} style={{width:80,height:80,borderRadius:14,border:errors.photos?"2px dashed #EF4444":"2px dashed #E8E6E1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,background:"var(--bg)"}}>
          {processing?<div style={{fontSize:11,color:"#F97316",fontWeight:600}}>⏳</div>:<><div style={{fontSize:22,color:"var(--muted)",lineHeight:1}}>+</div><div style={{fontSize:9,color:"var(--muted)",marginTop:2}}>Ajouter</div></>}
        </div>
      )}
    </div>
    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>

    {/* Photo editor */}
    {editPhoto&&<div style={{marginBottom:12,padding:14,background:"var(--bg)",borderRadius:16,border:"1px solid var(--border)"}}>
      <div style={{position:"relative",borderRadius:12,overflow:"hidden",marginBottom:12,aspectRatio:"1/1",background:"var(--card)"}}>
        <img src={editPhoto.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
        {editPhoto.enhanced&&<div style={{position:"absolute",top:8,left:8,padding:"3px 8px",borderRadius:6,background:"rgba(16,185,129,0.9)",color:"#fff",fontSize:10,fontWeight:600}}><Icon name="sparkle" size={16}/>{" "}Améliorée</div>}
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
          {editPhoto.analysis.issues.map((issue,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 0",fontSize:11,color:issue.severity==="error"?"#EF4444":"#F59E0B"}}><span>{issue.severity==="error"?"":""}</span>{issue.msg}</div>)}
        </div>}
      </>}
      <div style={{display:"flex",gap:8}}>
        <button disabled={enhancing||!editPhoto.file} onClick={()=>doEnhance(editingIdx,{brightness:15})} style={{flex:1,padding:"8px 0",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",opacity:enhancing?.5:1}}>Éclaircir</button>
        <button disabled={enhancing||!editPhoto.file} onClick={()=>doEnhance(editingIdx,{contrast:15})} style={{flex:1,padding:"8px 0",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",opacity:enhancing?.5:1}}> Contraste</button>
        <button disabled={enhancing||!editPhoto.file} onClick={()=>doEnhance(editingIdx,{brightness:10,contrast:10,sharpen:true})} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:"#F97316",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",opacity:enhancing?.5:1}}><Icon name="sparkle" size={16}/>{" "}Auto</button>
      </div>
      {/* Live preview */}
      <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)"}}>
        <div style={{fontSize:11,fontWeight:600,color:"var(--muted)",marginBottom:8}}><Icon name="map" size={16}/>{" "}Aperçu client</div>
        <div style={{display:"flex",gap:10}}>
          <div style={{width:120,borderRadius:12,overflow:"hidden",border:"1px solid var(--border)",background:"var(--card)",flexShrink:0}}>
            <div style={{height:100,background:"var(--light)",overflow:"hidden"}}><img src={editPhoto.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
            <div style={{padding:"6px 8px"}}>
              <div style={{fontSize:10,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name||"Nom du produit"}</div>
              <div style={{fontSize:11,fontWeight:700,color:"#F97316",marginTop:2}}>{price?`${Number(price).toLocaleString()} F`:"— F"}</div>
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
    {photos.length===0&&!errors.photos&&<div onClick={()=>setShowGuide(true)} style={{padding:16,background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.12)",borderRadius:14,marginBottom:14,cursor:"pointer"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:28}}><Icon name="camera" size={18}/></span>
        <div><div style={{fontSize:13,fontWeight:700,color:"#F97316"}}>Ajoutez de belles photos</div><div style={{fontSize:11,color:"var(--sub)",marginTop:2}}>Consultez notre guide →</div></div>
      </div>
    </div>}
    {photos.length===0&&<div onClick={()=>fileRef.current?.click()} style={{padding:24,borderRadius:16,border:errors.photos?"2px dashed #EF4444":"2px dashed rgba(249,115,22,0.3)",background:errors.photos?"rgba(239,68,68,0.02)":"rgba(249,115,22,0.02)",textAlign:"center",cursor:"pointer",marginBottom:12}}>
      <div style={{width:56,height:56,borderRadius:16,background:"rgba(249,115,22,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:6}}><Icon name="camera" size={18}/></div>
      <div style={{fontSize:14,fontWeight:600,color:errors.photos?"#EF4444":"#F97316"}}>Prendre ou choisir une photo</div>
      <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>JPEG, PNG · Min 500×500px · Max 10 MB</div>
    </div>}

    {/* ═══ FORM FIELDS ═══ */}
    <div className="field"><label>Nom de l'article *</label><input value={name} onChange={e=>{setName(e.target.value);clearErr("name")}} placeholder="Ex: Poulet DG, Robe Wax, Doliprane..." style={fieldStyle("name")}/>{errMsg("name")}</div>
    <div className="field"><label>Description <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Décrivez votre article..."/></div>
    <div className="field-row">
      <div className="field"><label>Prix (FCFA) *</label><input type="number" value={price} onChange={e=>{setPrice(e.target.value);clearErr("price")}} placeholder="25000" style={fieldStyle("price")}/>{errMsg("price")}</div>
      <div className="field"><label>Prix barré <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><input type="number" value={oldPrice} onChange={e=>{setOldPrice(e.target.value);clearErr("oldPrice")}} placeholder="Optionnel" style={fieldStyle("oldPrice")}/>{errMsg("oldPrice")}</div>
    </div>
    <div className="field-row">
      <div className="field">
        <label>Catégorie *</label>
        <Select
          value={selectedCat}
          onChange={v=>{setSelectedCat(v);clearErr("cat")}}
          options={CATS.map(c=>({value:c.name, label:c.name, icon:c.icon}))}
          placeholder="Choisir..."
        />
        {errMsg("cat")}
      </div>
      <div className="field"><label>Stock <span style={{color:"var(--muted)",fontWeight:400}}>(vide = illimité, 0 = rupture)</span></label><input type="number" min="0" value={stock} onChange={e=>setStock(e.target.value)} placeholder="Illimité"/></div>
    </div>
    <div className="field">
      <label>Section dans votre commerce <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label>
      <input value={section} maxLength={80} onChange={e=>setSection(e.target.value)} placeholder="Ex. : Entrées, Plats, Boissons, Promos de la semaine…"/>
      {mySections.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>{mySections.map(s=><button key={s} type="button" className={"t-chip"+(section===s?" on":"")} style={{height:32}} onClick={()=>setSection(s)}>{s}</button>)}</div>}
      <div style={{fontSize:12,color:"var(--muted)",marginTop:6}}>Organise votre page : vos clients voient vos articles rangés par section. La catégorie, elle, sert à vous trouver dans la recherche et sur l'accueil.</div>
    </div>

    {/* ═══ OPTIONS (accompagnements, suppléments, tailles…) ═══ */}
    <div style={{margin:"16px 0 14px"}}><OptionGroupsEditor shopType={storeType} value={optionGroups} onChange={setOptionGroups}/></div>

    <div className="field"><label>Tags <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Séparer par des virgules"/></div>
    <div className="field"><label>Poids <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel, en grammes)</span></label><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Pour calcul livraison"/></div>

    <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}><div className={`toggle ${active?"on":""}`} onClick={()=>setActive(!active)}/><span style={{fontSize:14,fontWeight:500}}>Article actif</span></div>

    {/* Error summary */}
    {Object.keys(errors).length>0&&<div style={{padding:10,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.12)",borderRadius:12,marginBottom:12}}>
      <div style={{fontSize:12,fontWeight:600,color:"#EF4444"}}>Corrigez les erreurs ci-dessus</div>
      <div style={{fontSize:11,color:"var(--sub)",marginTop:2}}>{Object.values(errors).join(" · ")}</div>
    </div>}

    {/* ═══ SUBMIT ═══ */}
    <div className="bottom-action-bar"><button className="btn-primary" style={{opacity:submitting?.7:1}} onClick={handleSubmit} disabled={submitting}>
      {submitting?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span className="spinner"/>  {isEdit?"Enregistrement...":"Ajout en cours..."}</span>
        :(isEdit?"Enregistrer les modifications":"Ajouter l'article")}
    </button></div>

    {isEdit&&!showDelete&&<button className="btn-outline" style={{color:"#EF4444",borderColor:"rgba(239,68,68,.3)"}} onClick={()=>setShowDelete(true)}>Supprimer cet article</button>}
    {isEdit&&showDelete&&<div style={{padding:16,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#EF4444",marginBottom:6}}>Supprimer "{p.name}" ?</div>
      <p style={{fontSize:12,color:"var(--sub)",marginBottom:12}}>Cette action est irréversible.</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowDelete(false)}>Annuler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} disabled={submitting} onClick={async()=>{setSubmitting(true);try{await vendor.deleteArticle(p.id);toast.success("Article supprimé");onBack();}catch(e){toast.error(e.message||"Suppression impossible");setSubmitting(false);}}}>Confirmer</button>
      </div>
    </div>}

    {showGuide&&<PhotoGuide onClose={()=>setShowGuide(false)} shopType={shopType}/>}
  </div>);
}

export default VProductFormScr;
