import { useState, useRef } from "react";
import Img from "../../components/Img";
import PhotoGuide from "../../components/PhotoGuide";
import { analyzeImage, enhanceImage, cropImage, generateVariants } from "../../utils/imageProcessor";
import { CATS } from "../../data";

function VProductFormScr({product:p,onBack,shopType="boutique"}){
  const isEdit=!!p;
  const [active,setActive]=useState(isEdit?p.active:true);
  const [showDelete,setShowDelete]=useState(false);
  const [showGuide,setShowGuide]=useState(false);

  // ── Photo management ──
  const fileRef=useRef(null);
  const [photos,setPhotos]=useState(isEdit&&p.photo?[{url:p.photo,emoji:p.img,status:"existing"}]:[]);
  const [editingIdx,setEditingIdx]=useState(null);
  const [processing,setProcessing]=useState(false);
  const [enhancing,setEnhancing]=useState(false);

  // Process a new image
  const handleFile=async(e)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    e.target.value="";
    if(photos.length>=6){alert("Maximum 6 photos");return;}

    setProcessing(true);
    try{
      // Analyze
      const analysis=await analyzeImage(file);
      
      // Auto crop 1:1
      const cropped=await cropImage(file,"1:1");
      const croppedFile=new File([cropped.blob],file.name,{type:"image/jpeg"});

      // Auto enhance if needed
      let finalUrl=cropped.url;
      let enhanced=false;
      if(analysis.brightness<100||analysis.contrast<30){
        const enhancements={};
        if(analysis.brightness<100) enhancements.brightness=Math.min(25,100-analysis.brightness);
        if(analysis.contrast<30) enhancements.contrast=12;
        const result=await enhanceImage(croppedFile,enhancements);
        finalUrl=result.url;
        enhanced=true;
      }

      // Generate thumbnails
      const variants=await generateVariants(croppedFile);

      setPhotos(prev=>[...prev,{
        url:finalUrl,
        file:croppedFile,
        analysis,
        variants,
        enhanced,
        status:"ready"
      }]);
      // Auto-open editor for the new photo
      setEditingIdx(photos.length);
    }catch(err){
      alert("Erreur lors du traitement: "+err.message);
    }
    setProcessing(false);
  };

  // Manual enhance
  const doEnhance=async(idx,opts)=>{
    const photo=photos[idx];
    if(!photo.file) return;
    setEnhancing(true);
    try{
      const result=await enhanceImage(photo.file,opts);
      const newPhotos=[...photos];
      newPhotos[idx]={...photo,url:result.url,enhanced:true};
      setPhotos(newPhotos);
    }catch(e){}
    setEnhancing(false);
  };

  // Remove photo
  const removePhoto=(idx)=>{
    setPhotos(prev=>prev.filter((_,i)=>i!==idx));
    if(editingIdx===idx) setEditingIdx(null);
    else if(editingIdx>idx) setEditingIdx(editingIdx-1);
  };

  // Active photo being edited
  const editPhoto=editingIdx!==null?photos[editingIdx]:null;

  return(<div className="scr" style={{padding:20}}>
    <div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>{isEdit?"Modifier":"Ajouter"} un article</h2><div style={{width:38}}/></div>

    {/* ═══ PHOTO SECTION ═══ */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <div style={{fontSize:14,fontWeight:700}}>Photos <span style={{fontSize:11,fontWeight:500,color:"#908C82"}}>({photos.length}/6)</span></div>
      <button onClick={()=>setShowGuide(true)} style={{padding:"4px 10px",borderRadius:8,border:"1px solid rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.04)",color:"#6366F1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
        📸 Guide photo
      </button>
    </div>

    {/* Photo strip */}
    <div style={{display:"flex",gap:10,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
      {photos.map((ph,i)=>(
        <div key={i} onClick={()=>setEditingIdx(editingIdx===i?null:i)} style={{
          width:80,height:80,borderRadius:14,overflow:"hidden",position:"relative",flexShrink:0,cursor:"pointer",
          border:editingIdx===i?"2px solid #6366F1":"1px solid #E8E6E1",
          boxShadow:editingIdx===i?"0 0 0 3px rgba(99,102,241,0.15)":"none",
        }}>
          {ph.url?<img src={ph.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
            :<Img emoji={ph.emoji} style={{width:"100%",height:"100%"}} fit="cover"/>}
          <button onClick={(e)=>{e.stopPropagation();removePhoto(i)}} style={{position:"absolute",top:-2,right:-2,width:20,height:20,borderRadius:"50%",background:"#EF4444",color:"#fff",border:"none",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          {/* Quality indicator */}
          {ph.analysis&&<div style={{position:"absolute",bottom:4,left:4,width:8,height:8,borderRadius:4,background:ph.analysis.color,boxShadow:`0 0 4px ${ph.analysis.color}`}}/>}
          {/* First photo badge */}
          {i===0&&<div style={{position:"absolute",bottom:4,right:4,padding:"1px 5px",borderRadius:4,background:"#6366F1",color:"#fff",fontSize:8,fontWeight:700}}>MAIN</div>}
        </div>
      ))}
      {/* Add button */}
      {photos.length<6&&(
        <div onClick={()=>fileRef.current?.click()} style={{
          width:80,height:80,borderRadius:14,border:"2px dashed #E8E6E1",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          cursor:"pointer",flexShrink:0,background:"#FAFAF8",transition:"all .2s"
        }}>
          {processing?<div style={{fontSize:11,color:"#6366F1",fontWeight:600}}>⏳</div>
            :<><div style={{fontSize:22,color:"#908C82",lineHeight:1}}>+</div><div style={{fontSize:9,color:"#908C82",marginTop:2}}>Ajouter</div></>}
        </div>
      )}
    </div>
    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>

    {/* ═══ PHOTO EDITOR (when a photo is selected) ═══ */}
    {editPhoto&&<div style={{marginBottom:16,padding:14,background:"#FAFAF8",borderRadius:16,border:"1px solid #E8E6E1"}}>
      {/* Large preview */}
      <div style={{position:"relative",borderRadius:12,overflow:"hidden",marginBottom:12,aspectRatio:"1/1",background:"#fff"}}>
        <img src={editPhoto.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="Preview"/>
        {editPhoto.enhanced&&<div style={{position:"absolute",top:8,left:8,padding:"3px 8px",borderRadius:6,background:"rgba(16,185,129,0.9)",color:"#fff",fontSize:10,fontWeight:600}}>✨ Améliorée</div>}
      </div>

      {/* Quality score */}
      {editPhoto.analysis&&<div style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontSize:12,fontWeight:600}}>Qualité d'image</span>
          <span style={{fontSize:12,fontWeight:700,color:editPhoto.analysis.color}}>{editPhoto.analysis.score}/100 — {editPhoto.analysis.label}</span>
        </div>
        <div style={{height:6,borderRadius:3,background:"#E8E6E1",overflow:"hidden"}}>
          <div style={{width:`${editPhoto.analysis.score}%`,height:"100%",borderRadius:3,background:editPhoto.analysis.color,transition:"width .5s ease"}}/>
        </div>
        {/* Issues */}
        {editPhoto.analysis.issues.length>0&&<div style={{marginTop:8}}>
          {editPhoto.analysis.issues.map((issue,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",fontSize:11,color:issue.severity==="error"?"#EF4444":"#F59E0B"}}>
              <span>{issue.severity==="error"?"⚠️":"💡"}</span>{issue.msg}
            </div>
          ))}
        </div>}
      </div>}

      {/* Image details */}
      {editPhoto.analysis&&<div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {[
          `${editPhoto.analysis.width}×${editPhoto.analysis.height}px`,
          `${(editPhoto.file?.size/1024).toFixed(0)||"—"} KB`,
          `Luminosité: ${editPhoto.analysis.brightness}`,
          `Netteté: ${editPhoto.analysis.sharpness}`,
        ].map((info,i)=>(
          <span key={i} style={{padding:"3px 8px",borderRadius:6,background:"#fff",border:"1px solid #E8E6E1",fontSize:10,color:"#5E5B53"}}>{info}</span>
        ))}
      </div>}

      {/* Enhancement tools */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button disabled={enhancing||!editPhoto.file} onClick={()=>doEnhance(editingIdx,{brightness:15})} style={{flex:1,minWidth:90,padding:"8px 0",borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4,opacity:enhancing?0.5:1}}>
          ☀️ Éclaircir
        </button>
        <button disabled={enhancing||!editPhoto.file} onClick={()=>doEnhance(editingIdx,{contrast:15})} style={{flex:1,minWidth:90,padding:"8px 0",borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4,opacity:enhancing?0.5:1}}>
          🎨 Contraste
        </button>
        <button disabled={enhancing||!editPhoto.file} onClick={()=>doEnhance(editingIdx,{brightness:10,contrast:10,sharpen:true})} style={{flex:1,minWidth:90,padding:"8px 0",borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4,opacity:enhancing?0.5:1}}>
          ✨ Auto
        </button>
      </div>

      {/* Live preview as product card */}
      <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid #E8E6E1"}}>
        <div style={{fontSize:11,fontWeight:600,color:"#908C82",marginBottom:8}}>👁️ Aperçu tel que le client verra</div>
        <div style={{display:"flex",gap:10}}>
          {/* Card preview */}
          <div style={{width:120,borderRadius:12,overflow:"hidden",border:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}>
            <div style={{height:100,background:"#F5F4F1",overflow:"hidden"}}>
              <img src={editPhoto.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
            </div>
            <div style={{padding:"6px 8px"}}>
              <div style={{fontSize:10,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isEdit?p.name:"Nom du produit"}</div>
              <div style={{fontSize:9,color:"#908C82",marginTop:1}}>⭐ 4.8 (23)</div>
              <div style={{fontSize:11,fontWeight:700,color:"#6366F1",marginTop:2}}>{isEdit?`${(p.price).toLocaleString()} F`:"25 000 F"}</div>
            </div>
          </div>
          {/* Detail preview */}
          <div style={{flex:1,borderRadius:12,overflow:"hidden",border:"1px solid #E8E6E1",background:"#fff"}}>
            <div style={{height:100,background:"#F5F4F1",overflow:"hidden"}}>
              <img src={editPhoto.url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
            </div>
            <div style={{padding:8,fontSize:9,color:"#908C82"}}>Vue détail (page produit)</div>
          </div>
        </div>
      </div>

      {/* Size variants generated */}
      {editPhoto.variants&&<div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #E8E6E1"}}>
        <div style={{fontSize:11,fontWeight:600,color:"#908C82",marginBottom:6}}>📐 Variantes générées</div>
        <div style={{display:"flex",gap:6}}>
          {Object.entries(editPhoto.variants).map(([key,v])=>(
            <div key={key} style={{flex:1,padding:6,borderRadius:8,background:"#fff",border:"1px solid #E8E6E1",textAlign:"center"}}>
              <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:"#6366F1"}}>{key}</div>
              <div style={{fontSize:9,color:"#908C82"}}>{v.width}×{v.height}</div>
              <div style={{fontSize:9,color:"#908C82"}}>{(v.size/1024).toFixed(0)} KB</div>
            </div>
          ))}
        </div>
      </div>}
    </div>}

    {/* Tip when no photos */}
    {photos.length===0&&<div onClick={()=>setShowGuide(true)} style={{padding:16,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.12)",borderRadius:14,marginBottom:14,cursor:"pointer"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:28}}>📸</span>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#6366F1"}}>Ajoutez de belles photos</div>
          <div style={{fontSize:11,color:"#5E5B53",marginTop:2}}>De bonnes photos multiplient vos ventes par 3. Consultez notre guide →</div>
        </div>
      </div>
    </div>}

    {/* First photo CTA */}
    {photos.length===0&&<div onClick={()=>fileRef.current?.click()} style={{
      padding:24,borderRadius:16,border:"2px dashed rgba(99,102,241,0.3)",background:"rgba(99,102,241,0.02)",
      textAlign:"center",cursor:"pointer",marginBottom:16,transition:"all .2s"
    }}>
      <div style={{fontSize:36,marginBottom:6}}>📷</div>
      <div style={{fontSize:14,fontWeight:600,color:"#6366F1"}}>Prendre ou choisir une photo</div>
      <div style={{fontSize:11,color:"#908C82",marginTop:4}}>JPEG, PNG · Min 500×500px · Max 10 MB</div>
    </div>}

    {/* ═══ REST OF THE FORM ═══ */}
    <div className="field"><label>Nom de l'article</label><input defaultValue={isEdit?p.name:""} placeholder="Ex: Poulet DG, Robe Wax, Doliprane..."/></div>
    <div className="field"><label>Description</label><textarea rows={3} defaultValue={isEdit?"Robe en wax africain, coupe moderne, tailles S-XL":""} placeholder="Décrivez votre article..."/></div>
    <div className="field-row"><div className="field"><label>Prix (FCFA)</label><input type="number" defaultValue={isEdit?p.price:""} placeholder="25000"/></div><div className="field"><label>Prix barré</label><input type="number" placeholder="Optionnel"/></div></div>
    <div className="field-row"><div className="field"><label>Catégorie</label><select defaultValue={isEdit?p.cat:""}><option value="">Choisir...</option>{CATS.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}</select></div><div className="field"><label>Stock</label><input type="number" defaultValue={isEdit?p.stock:""} placeholder="0"/></div></div>
    <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Variantes</div>
    <div className="pf-variants">{["S","M","L","XL"].map(s=><div key={s} className="pf-variant"><input defaultValue={s} style={{flex:"0 0 60px"}}/><input placeholder="Stock" style={{flex:"0 0 60px"}}/><span style={{fontSize:12,color:"#908C82"}}>unités</span></div>)}</div>
    <div className="field"><label>Tags</label><input defaultValue={isEdit?"Mode, Wax, Africain":""} placeholder="Séparer par des virgules"/></div>
    <div className="field"><label>Poids (g)</label><input type="number" defaultValue="250" placeholder="Pour calcul livraison"/></div>
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}><div className={`toggle ${active?"on":""}`} onClick={()=>setActive(!active)}/><span style={{fontSize:14,fontWeight:500}}>Article actif</span></div>
    
    <button className="btn-primary" style={{marginBottom:14}}>{isEdit?"💾 Enregistrer":"➕ Ajouter l'article"}</button>
    
    {isEdit&&!showDelete&&<button className="btn-outline" style={{color:"#EF4444",borderColor:"rgba(239,68,68,.3)"}} onClick={()=>setShowDelete(true)}>🗑️ Supprimer cet article</button>}
    {isEdit&&showDelete&&<div style={{padding:16,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#EF4444",marginBottom:6}}>⚠️ Supprimer "{p.name}" ?</div>
      <p style={{fontSize:12,color:"#5E5B53",marginBottom:12}}>Ce produit sera retiré de votre boutique. Cette action est irréversible.</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowDelete(false)}>Annuler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onBack}>🗑️ Confirmer</button>
      </div>
    </div>}

    {/* Photo Guide Modal */}
    {showGuide&&<PhotoGuide onClose={()=>setShowGuide(false)} shopType={shopType}/>}
  </div>);
}

export default VProductFormScr;
