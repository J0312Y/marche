import Icon from "../../components/Icon";
import { useState, useEffect, useRef } from "react";
import Img from "../../components/Img";
import { BackButton, FavButton } from "../../components/BackButton";
import { useData } from "../../hooks";
import { fmt, disc, getVendorPromo } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";
import { shareProduct } from "../../utils/share";
import toast from "../../utils/toast";
import SuccessAnimation from "../../components/SuccessAnimation";
import P from "../../data/products";

// Generate specs based on product type
const getSpecs=(p)=>{
  if(p.type==="restaurant"||p.type==="patisserie") return [
    ["⏱️","Temps de préparation",p.eta||"30-45 min"],
    ["utensils", "Cuisine",p.type==="patisserie"?"Pâtisserie artisanale":"Congolaise traditionnelle"],
    ["utensils", "Portions","1 personne"],
    ["fire", "Service","Chaud, prêt à déguster"],
    ["info", "Allergènes","Peut contenir des traces de gluten, arachides"],
  ];
  if(p.type==="pharmacie") return [
    ["pill", "Forme","Comprimé / Gélule"],
    ["pill", "Dosage",p.name.match(/\d+mg/)?p.name.match(/\d+mg/)[0]:"Standard"],
    ["package", "Conditionnement",p.name.match(/x\d+/)?p.name.match(/x\d+/)[0]:"Boîte"],
    ["shield", "Ordonnance","Non requise"],
    ["clock", "Péremption","2027"],
  ];
  if(p.cat==="Électronique") return [
    ["tag", "Marque",p.name.includes("Samsung")?"Samsung":p.name.includes("iPhone")?"Apple":"Générique"],
    ["package", "Stockage","128 GB"],
    ["lightning", "Batterie","5000 mAh"],
    ["globe", "Réseau","4G / 5G"],
    ["package", "Poids","195g"],
    ["shield", "Garantie","12 mois"],
  ];
  if(p.cat==="Mode") return [
    ["package", "Tailles disponibles","S, M, L, XL"],
    ["sparkle", "Couleurs","Multicolore / Wax"],
    ["package", "Matière",p.name.includes("Cuir")?"Cuir véritable":"100% Coton Wax"],
    ["","Fabrication","Artisanat congolais"],
    ["","Entretien","Lavage à 30°C"],
  ];
  return [
    ["package", "Conditionnement","Standard"],
    ["package", "Dimensions","Variable"],
    ["package", "Poids","Variable"],
    ["shield", "Garantie","Selon vendeur"],
  ];
};

// Track recently viewed products
const trackRecentlyViewed = (productId) => {
  try {
    const list = JSON.parse(localStorage.getItem("lk-recently-viewed") || "[]");
    const filtered = list.filter(id => id !== productId);
    filtered.unshift(productId);
    localStorage.setItem("lk-recently-viewed", JSON.stringify(filtered.slice(0, 12)));
  } catch {}
};

function DetailScr({product:rawP,onBack,onAddCart,go,favs,toggleFav,isFav}){
  // Lookup full product from catalog (for sides, photos, etc.)
  const fullProduct = P.find(x=>x.id===rawP?.id);
  const p = fullProduct ? {...fullProduct,...rawP} : rawP;
  const [qty,setQty]=useState(1);
  const [cartAnim,setCartAnim]=useState(false);
  const [cartAdded,setCartAdded]=useState(false);
  const [showQRModal,setShowQRModal]=useState(false);
  const [photoIdx,setPhotoIdx]=useState(0);
  const [zoomOpen,setZoomOpen]=useState(false);
  const allPhotos=p.photos||[p.photo];

  // Save to recently viewed
  useEffect(()=>{
    const recent=JSON.parse(localStorage.getItem("lk-recent")||"[]");
    const filtered=recent.filter(r=>r.id!==p.id);
    filtered.unshift({id:p.id,name:p.name,price:p.price,img:p.img,photo:p.photo,vendor:p.vendor,va:p.va,rating:p.rating});
    localStorage.setItem("lk-recent",JSON.stringify(filtered.slice(0,20)));
  },[p.id]);

  // ═══ Refs for 3D fold effect ═══
  const scrRef = useRef(null);
  const imgFoldRef = useRef(null);
  const foldShadowRef = useRef(null);
  const stickyHeaderRef = useRef(null);
  const stickyTitleRef = useRef(null);

  // ═══ 3D FOLD EFFECT ON SCROLL ═══
  useEffect(()=>{
    const scr = scrRef.current;
    if (!scr) return;
    
    let rafId = null;
    
    const update = () => {
      const imgFold = imgFoldRef.current;
      const foldShadow = foldShadowRef.current;
      const header = stickyHeaderRef.current;
      const headerTitle = stickyTitleRef.current;
      if (!imgFold) return;
      
      const scrollY = scr.scrollTop;
      const imageHeight = scr.clientWidth; // aspectRatio 1/1
      
      // 3D folding rotation (0 to 70 degrees)
      const foldProgress = Math.min(1, Math.max(0, scrollY / imageHeight));
      const rotateDeg = foldProgress * 70;
      // Simple opacity fade instead of 3D rotation (perspective removed for sticky to work)
      imgFold.style.opacity = String(Math.max(0, 1 - foldProgress * 0.5));
      
      // Shadow on folded image
      if (foldShadow) foldShadow.style.opacity = foldProgress * 0.65;
      
      // Sticky header is now always solid - no fade logic needed
      // (kept the imgFold/foldShadow logic above for the image animation)
    };
    
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    
    scr.addEventListener("scroll", onScroll, { passive: true });
    update(); // Initial call
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      scr.removeEventListener("scroll", onScroll);
    };
  }, [p.id]);
  const [selSize,setSelSize]=useState(p.sizes?.[0]||null);
  const [selColor,setSelColor]=useState(p.colors?.[0]||null);
  const [selVariant,setSelVariant]=useState(p.variants?.[0]||null);
  const [selectedSides,setSelectedSides]=useState({});
  const [openSideCat,setOpenSideCat]=useState(null);
  const [specialNote,setSpecialNote]=useState("");
  const toggleSide=(item)=>setSelectedSides(prev=>{const k=item.name;if(prev[k]){{const n={...prev};delete n[k];return n}}return{...prev,[k]:item}});
  const addSide=(item)=>{
    setSelectedSides(prev=>{
      const k=item.name;
      const cur=prev[k];
      if(cur){return{...prev,[k]:{...cur,qty:Math.min((cur.qty||1)+1,5)}}}
      return{...prev,[k]:{...item,qty:1}};
    });
  };
  const removeSide=(item)=>{
    setSelectedSides(prev=>{
      const k=item.name;
      const cur=prev[k];
      if(!cur)return prev;
      if((cur.qty||1)<=1){const n={...prev};delete n[k];return n}
      return{...prev,[k]:{...cur,qty:cur.qty-1}};
    });
  };
  const sidesTotalPrice=Object.values(selectedSides).reduce((s,it)=>s+(it.price||0)*(it.qty||1),0);
  const sidesTotalCount=Object.values(selectedSides).reduce((s,it)=>s+(it.qty||1),0);
  const [priceAlert,setPriceAlert]=useState(false);
  const [showAlertPopup,setShowAlertPopup]=useState(false);
  const [alertPrice,setAlertPrice]=useState("");
  const [showGroupPopup,setShowGroupPopup]=useState(false);
  const [groupJoined,setGroupJoined]=useState(false);
  const [showQA,setShowQA]=useState(false);
  const [qaText,setQaText]=useState("");
  const [qas,setQas]=useState([
    {q:"Est-ce que ce produit est disponible ?",a:"Oui, en stock et prêt à être expédié !",by:"Vendeur",date:"10 Fév"},
    {q:"Livraison possible à Pointe-Noire ?",a:"Oui, livraison sous 3-5 jours à Pointe-Noire.",by:"Vendeur",date:"8 Fév"},
  ]);
  const [activeTab,setActiveTab]=useState("desc");
  const [showSpecs,setShowSpecs]=useState(false);
  const { VENDORS } = useData();
  const specs=getSpecs(p);
  const vendor=VENDORS.find(v=>v.name===p.vendor);
  const vp=getVendorPromo(p,VENDORS);
  const finalPrice=vp?vp.promoPrice:p.price;

  if(cartAdded)return<SuccessAnimation title="Ajouté au panier !" subtitle={p.name+"×"+qty} hint={"Total : "+fmt(finalPrice*qty+sidesTotalPrice)} duration={1300} onDone={()=>{setCartAdded(false);onBack&&onBack()}}/>;

  return(<>
    {/* ═══ SOLID HEADER — always visible, normal flex flow below status bar ═══ */}
    <div ref={stickyHeaderRef} style={{
      flexShrink:0,
      padding:"10px 12px",display:"flex",alignItems:"center",gap:8,
      background:"var(--card)",
      borderBottom:"1px solid var(--border)",
      boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
      zIndex:50,
    }}>
      <button onClick={onBack} style={{
        width:38,height:38,borderRadius:12,
        border:"1px solid var(--border)",
        background:"var(--card)",
        cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        flexShrink:0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <div ref={stickyTitleRef} style={{flex:1,minWidth:0,padding:"0 4px",textAlign:"center"}}>
        <div style={{fontSize:10,color:"var(--muted)",lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.vendor||"Vendeur"}</div>
        <div style={{fontSize:13,fontWeight:700,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
      </div>
      <div style={{display:"flex",gap:6,flexShrink:0}}>
        <button onClick={()=>shareProduct(p)} style={{width:38,height:38,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="share" size={16}/>
        </button>
        <button onClick={()=>toggleFav(p.id)} style={{width:38,height:38,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {isFav(p.id) ? <svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
        </button>
      </div>
    </div>

    <div className="scr" ref={scrRef}>
      {/* Gallery — full bleed, no rounded corners, 3D FOLD */}
      <div onClick={()=>setZoomOpen(true)} style={{position:"relative",width:"100%",aspectRatio:"1/1",background:"#1a1a1a",overflow:"hidden",cursor:"zoom-in",transformStyle:"preserve-3d"}}>
        
        {/* Image content that folds in 3D */}
        <div ref={imgFoldRef} style={{position:"absolute",inset:0,transformOrigin:"top center",backfaceVisibility:"hidden",willChange:"transform"}}>
          <Img src={allPhotos[photoIdx]||p.photo} emoji={p.img} style={{width:"100%",height:"100%",position:"absolute",inset:0}} fit="cover"/>
        </div>
        
        {/* Shadow that appears as image folds (gives 3D depth feel) */}
        <div ref={foldShadowRef} style={{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)",opacity:0,pointerEvents:"none",willChange:"opacity",zIndex:3}}/>

        {/* Floating buttons removed — sticky header has back/share/fav always visible */}

        {/* Thumbnails floating LEFT */}
        {allPhotos.length>1&&<div style={{position:"absolute",top:60,left:12,display:"flex",flexDirection:"column",gap:8,zIndex:5}}>
          {allPhotos.slice(0,4).map((ph,i)=>{const isActive=photoIdx===i;return(
            <div key={i} onClick={e=>{e.stopPropagation();setPhotoIdx(i)}} style={{width:54,height:54,borderRadius:14,overflow:"hidden",cursor:"pointer",position:"relative",border:isActive?"2.5px solid #fff":"2px solid rgba(255,255,255,0.7)",transition:"all .2s",boxShadow:isActive?"0 4px 14px rgba(0,0,0,0.2)":"0 2px 8px rgba(0,0,0,0.12)",background:"#fff"}}>
              <Img src={ph} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>
              {!isActive&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.18)",pointerEvents:"none"}}/>}
              {i===3&&allPhotos.length>4&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700}}>+{allPhotos.length-4}</div>}
            </div>
          )})}
        </div>}

        {disc(p)>0&&<span className="badge" style={{position:"absolute",bottom:34,left:14,zIndex:5}}>-{disc(p)}%</span>}
      </div>

      {/* Content card that overlaps the image with top-only rounded corners */}
      <div style={{background:"var(--card)",borderRadius:"24px 24px 0 0",marginTop:-24,position:"relative",zIndex:7,boxShadow:"0 -2px 12px rgba(0,0,0,0.04)",paddingTop:8}}>

          {/* FOMO badges — urgency + social proof */}
    {(()=>{
      const seed=(p.id||"").split("").reduce((a,c)=>a+c.charCodeAt(0),0);
      const viewers=8+(seed%18);
      const stock=2+(seed%6);
      const soldToday=3+(seed%12);
      const hasLowStock=seed%3===0;
      const hasHotProduct=p.rating>=4.5||(seed%5===0);
      return(
        <div className="fomo-badges" style={{display:"flex",gap:6,padding:"12px 16px 0",flexWrap:"wrap",overflowX:"auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:8,background:"rgba(239,68,68,0.08)",fontSize:11,fontWeight:600,color:"#EF4444",whiteSpace:"nowrap"}}>
            <span style={{width:6,height:6,borderRadius:3,background:"#EF4444",animation:"pulse 1.5s infinite"}}/>
             {viewers} personnes regardent
          </div>
          {hasLowStock&&<div style={{padding:"5px 10px",borderRadius:8,background:"rgba(245,158,11,0.08)",fontSize:11,fontWeight:600,color:"#F59E0B",whiteSpace:"nowrap"}}><Icon name="lightning" size={16}/>{" "}Plus que {stock} en stock !</div>}
          <div style={{padding:"5px 10px",borderRadius:8,background:"rgba(16,185,129,0.08)",fontSize:11,fontWeight:600,color:"#10B981",whiteSpace:"nowrap"}}> Vendu {soldToday}× aujourd'hui</div>
          {hasHotProduct&&<div style={{padding:"5px 10px",borderRadius:8,background:"rgba(249,115,22,0.08)",fontSize:11,fontWeight:600,color:"#F97316",whiteSpace:"nowrap"}}><Icon name="crown" size={16}/>{" "}Best-seller</div>}
        </div>
      );
    })()}

      <div className="det-body">
        {/* Vendor + Name */}
        <div className="det-vendor" onClick={()=>go("vendor",{id:p.vendorId,name:p.vendor})}><span>{p.va}</span>{p.vendor} </div>
        <h2>{p.name}</h2>

        {/* Rating */}
        <div className="det-stars" style={{cursor:"pointer"}} onClick={()=>go("reviews",p)}>
          {"⭐".repeat(Math.floor(p.rating))}{"☆".repeat(5-Math.floor(p.rating))}
          <span className="rc">({p.reviews} avis) →</span>
        </div>

        {/* Price */}
        <div className="det-price">
          {vp?<>
            <span className="dp" style={{color:"#F97316"}}>{fmt(vp.promoPrice)}</span>
            <span className="dpo">{fmt(p.price)}</span>
            <span style={{fontSize:12,color:"#F59E0B",fontWeight:700,marginLeft:8}}>-{vp.promoDiscount}%</span>
          </>:<>
            <span className="dp">{fmt(p.price)}</span>
            {p.old&&<span className="dpo">{fmt(p.old)}</span>}
            {disc(p)>0&&<span style={{fontSize:12,color:"#F59E0B",fontWeight:700,marginLeft:8}}>Économisez {fmt(p.old-p.price)}</span>}
          </>}
        </div>

        {/* Vendor promo banner */}
        {vp&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(249,115,22,0.04)",borderRadius:12,marginBottom:12,border:"1px solid rgba(249,115,22,0.12)"}}>
          <span style={{fontSize:20}}><Icon name="tag" size={18}/></span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#F59E0B"}}>{vp.promoName}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>-{vp.promoDiscount}% appliqué automatiquement · Jusqu'au {vp.promoEnds}</div>
          </div>
        </div>}

        {/* Tags */}
        {p.tags.length>0&&<div className="det-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>}

        {/* Delivery estimate */}
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"rgba(249,115,22,0.04)",borderRadius:12,marginBottom:10,border:"1px solid rgba(249,115,22,0.12)"}}>
          <span style={{fontSize:18}}><Icon name="truck" size={18}/></span>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:"#F97316"}}>Livraison estimée : {p.eta||"1-3 jours"}</div>
            <div style={{fontSize:10,color:"var(--muted)"}}>À Brazzaville · {p.type==="restaurant"||p.type==="patisserie"?"Préparation incluse":"Expédition sous 24h"}</div>
          </div>
        </div>
        {/* Restaurant-specific: min order + delivery fee */}
        {(()=>{const v=VENDORS?.find(x=>x.name===p.vendor);return v&&(v.minOrder||v.deliveryFee!==undefined)?<div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {v.isOpen!==undefined&&<span style={{padding:"4px 10px",borderRadius:8,background:v.isOpen?"rgba(16,185,129,0.06)":"rgba(239,68,68,0.06)",color:v.isOpen?"#10B981":"#EF4444",fontSize:11,fontWeight:600}}>{v.isOpen?"Ouvert":"Fermé"}{v.hours?" · "+v.hours:""}</span>}
          {v.deliveryFee!==undefined&&<span style={{padding:"4px 10px",borderRadius:8,background:"var(--light)",fontSize:11,fontWeight:600}}><Icon name="truck" size={16}/>{" "}{v.deliveryFee===0?"Gratuit":fmt(v.deliveryFee)}</span>}
          {v.minOrder&&<span style={{padding:"4px 10px",borderRadius:8,background:"var(--light)",fontSize:11,fontWeight:600}}>Min. {fmt(v.minOrder)}</span>}
        </div>:null})()}

        {/* Size selector */}
        {p.sizes&&<div style={{marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>Taille</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {p.sizes.map(s=><button key={s} onClick={()=>setSelSize(s)} style={{padding:"6px 16px",borderRadius:10,border:selSize===s?"2px solid #F97316":"1px solid var(--border)",background:selSize===s?"rgba(249,115,22,0.06)":"var(--card)",color:selSize===s?"#F97316":"var(--text)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{s}</button>)}
          </div>
        </div>}

        {/* Color selector */}
        {p.colors&&<div style={{marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>Couleur : <span style={{fontWeight:500,color:"var(--muted)"}}>{selColor}</span></div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {p.colors.map(c=><button key={c} onClick={()=>setSelColor(c)} style={{padding:"6px 14px",borderRadius:10,border:selColor===c?"2px solid #F97316":"1px solid var(--border)",background:selColor===c?"rgba(249,115,22,0.06)":"var(--card)",color:selColor===c?"#F97316":"var(--text)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{c}</button>)}
          </div>
        </div>}


        {/*  Accompagnements — Uber Eats style */}
        {p.sides&&p.sides.length>0&&<div style={{marginBottom:14}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:8}}><Icon name="utensils" size={16}/>{" "}Personnalisez votre commande</div>

          {/* Allergens */}
          {p.allergens&&<div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
            {p.allergens.map(a=><span key={a} style={{padding:"3px 8px",borderRadius:6,background:"rgba(245,158,11,0.08)",color:"#F59E0B",fontSize:10,fontWeight:600}}>️ Contient : {a}</span>)}
          </div>}

          {p.sides.map((cat,ci)=>{
            const isOpen=openSideCat===ci;
            const catItems=cat.items.filter(it=>selectedSides[it.name]);
            const catQty=catItems.reduce((s,it)=>s+(selectedSides[it.name]?.qty||0),0);
            const hasFree=cat.items.some(it=>it.price===0);
            const isRequired=cat.required;
            const maxSel=cat.max||99;
            return(
              <div key={ci} style={{marginBottom:6,borderRadius:14,border:isRequired&&catQty===0?"2px solid rgba(239,68,68,0.3)":"1px solid var(--border)",overflow:"hidden",background:"var(--card)"}}>
                <div onClick={()=>setOpenSideCat(isOpen?null:ci)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",cursor:"pointer"}}>
                  <span style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:13,fontWeight:700}}>{cat.cat}</span>
                      {isRequired?<span style={{padding:"1px 6px",borderRadius:4,background:"rgba(239,68,68,0.08)",color:"#EF4444",fontSize:9,fontWeight:700}}>Obligatoire</span>
                      :<span style={{padding:"1px 6px",borderRadius:4,background:"var(--light)",color:"var(--muted)",fontSize:9,fontWeight:600}}>Optionnel</span>}
                    </div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>
                      {catQty>0?<span style={{color:"#F97316",fontWeight:600}}>{catQty} choisi{catQty>1?"s":""}</span>
                      :isRequired?"Choisissez "+maxSel
                      :hasFree?"Gratuit disponible"
                      :"Jusqu'à "+maxSel}
                    </div>
                  </span>
                  {catQty>0&&<span style={{width:22,height:22,borderRadius:11,background:"#F97316",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{catQty}</span>}
                  <svg width="12" height="12" style={{transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}><path d="M2 4l4 4 4-4" stroke="var(--muted)" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                </div>
                {isOpen&&<div style={{padding:"0 10px 10px",display:"flex",flexDirection:"column",gap:3}}>
                  {cat.items.map((item,ii)=>{
                    const sel=selectedSides[item.name];
                    const qty=sel?.qty||0;
                    return(
                      <div key={ii} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10,background:qty>0?"rgba(249,115,22,0.04)":"transparent",transition:"all .12s"}}>
                        <span style={{fontSize:16}}>{item.img}</span>
                        <span style={{flex:1,fontSize:13,fontWeight:qty>0?600:400}}>{item.name}</span>
                        <span style={{fontSize:11,fontWeight:600,color:item.price>0?(qty>0?"#F97316":"var(--muted)"):"#10B981",marginRight:6}}>{item.price>0?(qty>0?"+"+fmt(item.price*qty):fmt(item.price)):"Gratuit"}</span>
                        {qty===0?<button onClick={()=>addSide(item,maxSel)} style={{width:28,height:28,borderRadius:14,border:"1.5px solid #F97316",background:"transparent",color:"#F97316",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",fontWeight:700}}>+</button>
                        :<div style={{display:"flex",alignItems:"center",gap:4}}>
                          <button onClick={()=>removeSide(item)} style={{width:26,height:26,borderRadius:13,border:"none",background:"var(--light)",color:"var(--text)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>−</button>
                          <span style={{fontSize:13,fontWeight:700,minWidth:18,textAlign:"center"}}>{qty}</span>
                          <button onClick={()=>{if(catQty<maxSel)addSide(item,maxSel);else toast.info("Max "+maxSel+" pour "+cat.cat)}} style={{width:26,height:26,borderRadius:13,border:"none",background:"#F97316",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>+</button>
                        </div>}
                      </div>
                    );
                  })}
                </div>}
              </div>
            );
          })}
          {sidesTotalCount>0&&<div style={{marginTop:6,padding:"8px 12px",background:"rgba(249,115,22,0.04)",borderRadius:10,border:"1px solid rgba(249,115,22,0.12)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:12,color:"var(--sub)"}}>{sidesTotalCount} article{sidesTotalCount>1?"s":""} ajouté{sidesTotalCount>1?"s":""}</span>
            <span style={{fontSize:13,fontWeight:700,color:"#F97316"}}>+{fmt(sidesTotalPrice)}</span>
          </div>}
        </div>}

        {/*  Instructions spéciales */}
        {(p.type==="restaurant"||p.type==="patisserie")&&<div style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:6}}> Instructions spéciales</div>
          <textarea value={specialNote} onChange={e=>setSpecialNote(e.target.value)} placeholder="Ex: Sans oignon, bien cuit, pas trop épicé..." rows={2} style={{width:"100%",padding:"10px 12px",borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:13,fontFamily:"inherit",color:"var(--text)",resize:"none",outline:"none"}}/>
        </div>}

        {/* Price alert + Group buy */}
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <button onClick={()=>{if(priceAlert){setPriceAlert(false);toast.success("Alerte retirée")}else{setShowAlertPopup(true)}}} style={{flex:1,padding:"8px 0",borderRadius:10,border:priceAlert?"1px solid #F59E0B":"1px solid var(--border)",background:priceAlert?"rgba(245,158,11,0.06)":"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:priceAlert?"#F59E0B":"var(--text)",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            {priceAlert?"Alerte active":"Alerte prix"}
          </button>
          <button onClick={()=>setShowGroupPopup(true)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
             Achat groupé -20%
          </button>
        </div>

        {/* Tab bar */}
        <div style={{display:"flex",gap:0,marginBottom:12,background:"var(--light)",borderRadius:12,padding:3}}>
          {[["desc","Description"],["specs","Specs"],["info","Infos"],["qa","Q&A"]].map(([k,l])=>(
            <button key={k} onClick={()=>setActiveTab(k)} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",background:activeTab===k?"var(--card)":"transparent",color:activeTab===k?"var(--text)":"var(--muted)",fontSize:11,fontWeight:activeTab===k?700:500,cursor:"pointer",fontFamily:"inherit",boxShadow:activeTab===k?"0 1px 4px rgba(0,0,0,.06)":"none",transition:"all .2s"}}>{l}</button>
          ))}
        </div>

        {/* Description tab */}
        {activeTab==="desc"&&<>
          <p style={{fontSize:14,color:"var(--sub)",lineHeight:1.7,marginBottom:12}}>{p.desc}</p>
          {p.type==="restaurant"&&<p style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:12}}>
            Plat préparé à la commande avec des ingrédients frais du marché. Servi chaud avec accompagnements traditionnels. Idéal pour un déjeuner ou dîner en famille.
          </p>}
          {p.type==="boutique"&&<p style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:12}}>
            Produit vérifié et garanti authentique par le vendeur. Emballage soigné pour la livraison. Retour possible sous 7 jours si le produit ne correspond pas.
          </p>}
        </>}

        {/* Specs tab */}
        {activeTab==="specs"&&<div style={{marginBottom:12}}>
          {specs.map(([icon,label,value],i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<specs.length-1?"1px solid var(--border)":"none"}}>
              <span style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text)",flexShrink:0}}><Icon name={icon} size={18}/></span>
              <span style={{flex:1,fontSize:13,color:"var(--muted)"}}>{label}</span>
              <span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{value}</span>
            </div>
          ))}
        </div>}

        {/* Info tab */}
        {activeTab==="info"&&<div style={{marginBottom:12}}>
          <div className="det-info" style={{marginBottom:8}}>
            <span className="dii"><Icon name="truck" size={18}/></span>
            <div className="dit">
              <h4>Livraison à Brazzaville</h4>
              <p>1-3 jours · À partir de 1 500 FCFA</p>
              <p style={{fontSize:11,color:"#F59E0B",marginTop:2}}>Gratuite à partir de 50 000 FCFA</p>
            </div>
          </div>
          <div className="det-info" style={{marginBottom:8}}>
            <span className="dii"><Icon name="phone" size={18}/></span>
            <div className="dit">
              <h4>Paiement Mobile Money</h4>
              <p>Airtel Money, MTN MoMo, Kolo Pay</p>
            </div>
          </div>
          <div className="det-info" style={{marginBottom:8}}>
            <span className="dii"></span>
            <div className="dit">
              <h4>Politique de retour</h4>
              <p>{p.type==="restaurant"||p.type==="patisserie"?"Non remboursable (produit alimentaire)":"Retour gratuit sous 7 jours"}</p>
            </div>
          </div>
          <div className="det-info" style={{marginBottom:8}} onClick={()=>go("compare",p)}>
            <span className="dii">️</span>
            <div className="dit">
              <h4>Comparer ce produit</h4>
              <p>Voir côte à côte avec un autre</p>
            </div>
            <span style={{color:"#F97316",fontSize:14}}>→</span>
          </div>
          <div className="det-info" onClick={()=>go("chatVendor",{vendorName:p.vendor,vendorAvatar:p.va})}>
            <span className="dii"><Icon name="chat" size={18}/></span>
            <div className="dit">
              <h4>Contacter le vendeur</h4>
              <p>Poser une question sur ce produit</p>
            </div>
            <span style={{color:"#F97316",fontSize:14}}>→</span>
          </div>
        </div>}

        {/* Q&A tab */}
        {activeTab==="qa"&&<div style={{marginBottom:12}}>
          {qas.map((qa,i)=>(
            <div key={i} style={{padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,marginBottom:8}}>
              <div style={{fontSize:12,fontWeight:700,marginBottom:6}}><Icon name="help" size={16}/>{" "}{qa.q}</div>
              <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5,padding:"8px 10px",background:"var(--light)",borderRadius:8}}>
                <span style={{fontSize:10,color:"#F97316",fontWeight:600}}>↩️ {qa.by}</span> · <span style={{fontSize:10,color:"var(--muted)"}}>{qa.date}</span>
                <div style={{marginTop:3}}>{qa.a}</div>
              </div>
            </div>
          ))}
          <div style={{marginTop:8}}>
            <div style={{display:"flex",gap:8}}>
              <input value={qaText} onChange={e=>setQaText(e.target.value)} placeholder="Poser une question..." style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:12,fontFamily:"inherit",outline:"none",color:"var(--text)"}}/>
              <button onClick={()=>{if(qaText.trim()){setQas(prev=>[...prev,{q:qaText,a:"",by:"",date:"Maintenant"}]);setQaText("");toast.success("Question envoyée au vendeur")}}} style={{padding:"0 14px",borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Envoyer</button>
            </div>
          </div>
        </div>}

        {/* Vendor card */}
        <div onClick={()=>go("vendor",{id:p.vendorId,name:p.vendor})} style={{display:"flex",alignItems:"center",gap:12,padding:14,background:"var(--card)",borderRadius:14,border:"1px solid var(--border)",marginBottom:12,cursor:"pointer"}}>
          <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff"}}>{p.va}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700}}>{p.vendor} <span style={{color:"#F97316"}}></span>{vendor?.badge==="top"&&<span style={{padding:"2px 8px",borderRadius:6,background:"rgba(245,158,11,0.08)",color:"#F59E0B",fontSize:9,fontWeight:700,marginLeft:4}}><Icon name="crown" size={16}/>{" "}Top Vendeur</span>}{vendor?.badge==="new"&&<span style={{padding:"2px 8px",borderRadius:6,background:"rgba(249,115,22,0.08)",color:"#F97316",fontSize:9,fontWeight:700,marginLeft:4}}><Icon name="sparkle" size={16}/>{" "}Nouveau</span>}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>Voir la boutique · Tous les articles</div>
          </div>
          <span style={{color:"var(--muted)",fontSize:18}}>›</span>
        </div>
      </div>


        {/* QR Code produit — réellement scannable */}
        <div style={{margin:"14px 16px",padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,display:"flex",alignItems:"center",gap:14}}>
          {/* Real QR code from qrserver API */}
          <div style={{width:88,height:88,background:"#fff",borderRadius:10,padding:6,flexShrink:0,border:"1px solid var(--border)"}}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent("LMK-PROD-"+p.id)}`} alt={"QR code "+p.name} style={{width:"100%",height:"100%",display:"block"}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,letterSpacing:.5}}>CODE PRODUIT</div>
            <div style={{fontSize:13,fontWeight:800,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}}>LMK-PROD-{p.id}</div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:6,lineHeight:1.4}}>Scannez ce QR avec l'app Lamuka pour ouvrir directement ce produit</div>
            <div style={{display:"flex",gap:6,marginTop:8}}>
              <button onClick={()=>{const code="LMK-PROD-"+p.id;navigator.clipboard?.writeText(code).then(()=>toast.success("📋 Code copié"))}} style={{padding:"5px 10px",fontSize:10,fontWeight:700,border:"1px solid var(--border)",background:"var(--card)",borderRadius:6,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copier</button>
              <button onClick={()=>setShowQRModal(true)} style={{padding:"5px 10px",fontSize:10,fontWeight:700,border:"1px solid #F97316",background:"rgba(249,115,22,0.06)",color:"#F97316",borderRadius:6,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>Agrandir</button>
            </div>
          </div>
        </div>

        {/* "Pourrait vous intéresser" — related products */}
        {(()=>{
          const related=P.filter(x=>x.id!==p.id&&(x.cat===p.cat||x.vendor===p.vendor||Math.abs(x.price-p.price)<p.price*0.4)).slice(0,8);
          if(related.length===0)return null;
          return(
            <div style={{padding:"16px 0 8px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 16px 12px"}}>
                <h3 style={{fontSize:16,fontWeight:800}}><Icon name="sparkle" size={16}/>{" "}Pourrait vous intéresser</h3>
                <span onClick={()=>go("allProducts")} style={{fontSize:12,color:"#F97316",fontWeight:600,cursor:"pointer"}}>Voir tout</span>
              </div>
              <div style={{display:"flex",gap:10,overflowX:"auto",padding:"0 16px 8px",scrollbarWidth:"none"}} className="hide-scroll">
                {related.map(r=>{
                  const rPromo=getVendorPromo(r,VENDORS);
                  const rPrice=rPromo?rPromo.promoPrice:r.price;
                  return(
                    <div key={r.id} onClick={()=>go("detail",r)} style={{flexShrink:0,width:140,cursor:"pointer"}}>
                      <div style={{width:140,height:140,borderRadius:14,overflow:"hidden",background:"var(--light)",position:"relative"}}>
                        <Img src={r.photo} emoji={r.img} style={{width:"100%",height:"100%"}} fit="cover"/>
                        {r.old&&<span style={{position:"absolute",top:8,left:8,padding:"3px 7px",borderRadius:6,background:"#EF4444",color:"#fff",fontSize:10,fontWeight:800}}>-{Math.round((1-r.price/r.old)*100)}%</span>}
                        <span onClick={e=>{e.stopPropagation();toggleFav(r.id)}} style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.95)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:isFav(r.id)?"#EF4444":"var(--muted)",cursor:"pointer"}}>{isFav(r.id) ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}</span>
                      </div>
                      <div style={{padding:"8px 4px 0"}}>
                        <h4 style={{fontSize:12,fontWeight:600,lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",height:32}}>{r.name}</h4>
                        <div style={{fontSize:10,color:"var(--muted)",marginTop:3,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{r.vendor}</div>
                        <div style={{display:"flex",alignItems:"baseline",gap:5,marginTop:4}}>
                          <span style={{fontSize:13,fontWeight:800,color:"#F97316"}}>{fmt(rPrice)}</span>
                          {r.old&&<span style={{fontSize:10,color:"var(--muted)",textDecoration:"line-through"}}>{fmt(r.old)}</span>}
                        </div>
                        <div style={{fontSize:10,color:"#F59E0B",marginTop:3}}><Icon name="star_full" size={16}/>{" "}{r.rating} <span style={{color:"var(--muted)"}}>({r.reviews})</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

    {/* Bottom bar — STICKY at bottom of scroll area, ALWAYS visible */}
    <div className="det-bar">
      {/* Quantity selector */}
      <div style={{
        display:"flex",alignItems:"center",
        border:"1px solid var(--border)",
        borderRadius:10,
        height:44,
        flexShrink:0,
        background:"var(--card)",
      }}>
        <button
          onClick={()=>qty>1&&setQty(qty-1)}
          disabled={qty<=1}
          style={{
            width:36,height:42,
            border:"none",background:"transparent",
            color:qty>1?"var(--text)":"var(--muted)",
            fontSize:18,fontWeight:500,
            cursor:qty>1?"pointer":"not-allowed",
            fontFamily:"inherit",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}
        >−</button>
        <span style={{
          minWidth:28,textAlign:"center",
          fontSize:15,fontWeight:700,
          color:"var(--text)",
          fontVariantNumeric:"tabular-nums",
        }}>{qty}</span>
        <button
          onClick={()=>setQty(qty+1)}
          style={{
            width:36,height:42,
            border:"none",background:"transparent",
            color:"#F97316",
            fontSize:18,fontWeight:600,
            cursor:"pointer",
            fontFamily:"inherit",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}
        >+</button>
      </div>

      {/* Big primary CTA */}
      <button
        className={`add-btn-main${cartAnim?" cart-bounce":""}`}
        onClick={()=>{
          setCartAnim(true);
          setTimeout(()=>setCartAnim(false),400);
          const missing=p.sides?.filter(cat=>cat.required&&!cat.items.some(it=>selectedSides[it.name]));
          if(missing?.length>0){toast.error("Choisissez : "+missing.map(m=>m.cat).join(", "));return}
          onAddCart(p,qty,{sides:Object.values(selectedSides),note:specialNote});
          try{
            if(!localStorage.getItem("lk-cart-ever-added")){
              localStorage.setItem("lk-cart-ever-added","1");
              localStorage.removeItem("lk-cart-tutorial");
            }
          }catch{}
          setCartAdded(true);
        }}
        style={{
          flex:1,height:44,
          border:"none",
          borderRadius:11,
          background:"linear-gradient(135deg,#F97316,#EA580C)",
          color:"#fff",
          fontSize:13,fontWeight:800,letterSpacing:-0.2,
          cursor:"pointer",fontFamily:"inherit",
          display:"flex",alignItems:"center",justifyContent:"center",gap:7,
          boxShadow:"0 4px 14px rgba(249,115,22,0.32)",
          transition:"transform .12s",
        }}
      >
        <Icon name="package" size={15} color="#fff"/>
        Ajouter · {fmt(finalPrice*qty+sidesTotalPrice)}
      </button>
    </div>
    </div>


    {/* ── Alerte Prix Popup ── */}
    {showAlertPopup&&<div onClick={()=>setShowAlertPopup(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeInFast .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:320,background:"var(--card)",borderRadius:20,padding:20,animation:"scaleIn .25s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:32,marginBottom:6}}><Icon name="bell" size={18}/></div>
          <h3 style={{fontSize:16,fontWeight:700}}>Alerte de prix</h3>
          <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Recevez une notification quand le prix de <b>{p.name}</b> baisse</p>
        </div>
        <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>Prix actuel : <span style={{color:"#F97316"}}>{fmt(p.price)}</span></div>
        <div className="field"><label>M'alerter en dessous de (FCFA)</label><input value={alertPrice} onChange={e=>setAlertPrice(e.target.value.replace(/\D/g,""))} placeholder={String(Math.round(p.price*0.8))} inputMode="numeric"/></div>
        <div style={{display:"flex",gap:8,marginTop:4}}>
          <button onClick={()=>setShowAlertPopup(false)} style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Annuler</button>
          <button onClick={()=>{setPriceAlert(true);setShowAlertPopup(false);toast.success("Alerte activée !")}} style={{flex:1,padding:10,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Activer</button>
        </div>
      </div>
    </div>}

    {/* ── Achat Groupé Popup ── */}
    {showGroupPopup&&<div onClick={()=>setShowGroupPopup(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeInFast .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:320,background:"var(--card)",borderRadius:20,padding:20,animation:"scaleIn .25s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:32,marginBottom:6}}><Icon name="handshake" size={18}/></div>
          <h3 style={{fontSize:16,fontWeight:700}}>Achat Groupé</h3>
          <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Réunissez 5 acheteurs pour <b style={{color:"#F97316"}}>-20%</b></p>
        </div>
        <div style={{padding:14,background:"var(--light)",borderRadius:14,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}><span>Prix normal</span><span style={{textDecoration:"line-through",color:"var(--muted)"}}>{fmt(p.price)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:700}}><span>Prix groupé</span><span style={{color:"#F97316"}}>{fmt(Math.round(p.price*0.8))}</span></div>
          <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
            <div style={{flex:1,height:6,borderRadius:3,background:"var(--border)"}}><div style={{width:"40%",height:"100%",borderRadius:3,background:"#F97316"}}/></div>
            <span style={{fontSize:10,color:"var(--muted)",fontWeight:600}}>2/5</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {groupJoined
            ?<button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#10B981",color:"#fff",fontSize:13,fontWeight:700,cursor:"default",fontFamily:"inherit"}}><Icon name="check_circle" size={16}/>{" "}Vous avez rejoint</button>
            :<button onClick={()=>{setGroupJoined(true);toast.success("Vous avez rejoint le groupe !")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Rejoindre</button>
          }
          <button onClick={()=>{import("../../utils/share").then(m=>m.shareProduct({title:"Achat groupé — "+p.name,text:"Rejoins l'achat groupé pour "+p.name+" et obtiens -20% !",url:"https://lamuka.market/group/"+p.id}))}} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}> Partager</button>
        </div>
      </div>
    </div>}
    </div>{/* end content card */}

    {/* Zoom Modal */}
    {zoomOpen&&<div onClick={()=>setZoomOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:9999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeInFast .2s ease"}}>
      <button onClick={(e)=>{e.stopPropagation();setZoomOpen(false)}} style={{position:"absolute",top:20,right:20,width:44,height:44,borderRadius:22,background:"#fff",border:"none",cursor:"pointer",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}} aria-label="Fermer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      <img src={allPhotos[photoIdx]||p.photo} style={{maxWidth:"95%",maxHeight:"80vh",objectFit:"contain",borderRadius:8}} alt=""/>
      <div style={{display:"flex",gap:8,marginTop:12}}>
        {allPhotos.map((_,i)=><div key={i} onClick={e=>{e.stopPropagation();setPhotoIdx(i)}} style={{width:48,height:48,borderRadius:8,overflow:"hidden",border:photoIdx===i?"2px solid #F97316":"2px solid rgba(255,255,255,.2)",cursor:"pointer",opacity:photoIdx===i?1:.5}}>
          <img src={allPhotos[i]} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}} alt=""/>
        </div>)}
      </div>
      <div style={{color:"rgba(255,255,255,.5)",fontSize:11,marginTop:8}}>Appuyez pour fermer</div>
    </div>}

    {/* QR Code modal — show enlarged within the app */}
    {showQRModal && (
      <div onClick={()=>setShowQRModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeInFast .2s ease"}}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,padding:24,maxWidth:340,width:"100%",position:"relative"}}>
          <button onClick={()=>setShowQRModal(false)} style={{position:"absolute",top:12,right:12,width:32,height:32,borderRadius:"50%",border:"none",background:"#F5F5F7",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#000",zIndex:10}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div style={{fontSize:11,color:"#6B7280",fontWeight:700,letterSpacing:.5,textAlign:"center",marginTop:4}}>QR CODE PRODUIT</div>
          <div style={{fontSize:14,fontWeight:800,textAlign:"center",marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#1A1F2E"}}>{p.name}</div>
          <div style={{width:"100%",aspectRatio:"1 / 1",background:"#fff",borderRadius:14,padding:18,marginTop:14,border:"2px solid #EDEDF0",boxSizing:"border-box"}}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=2&data=${encodeURIComponent("LMK-PROD-"+p.id)}`} alt="QR code agrandi" style={{width:"100%",height:"100%",display:"block"}}/>
          </div>
          <div style={{fontSize:11,color:"#6B7280",textAlign:"center",marginTop:12,lineHeight:1.5}}>
            Scannez ce QR code avec l'app Lamuka<br/>ou tout lecteur de code-barres
          </div>
          <div style={{fontSize:12,fontWeight:700,fontFamily:"monospace",textAlign:"center",marginTop:8,padding:"8px 12px",background:"#F5F5F7",borderRadius:8,color:"#1A1F2E"}}>LMK-PROD-{p.id}</div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={()=>{const code="LMK-PROD-"+p.id;navigator.clipboard?.writeText(code).then(()=>toast.success("📋 Code copié"))}} style={{flex:1,padding:"10px 12px",fontSize:12,fontWeight:700,border:"1px solid #EDEDF0",background:"#fff",color:"#1A1F2E",borderRadius:10,cursor:"pointer",fontFamily:"inherit"}}>Copier le code</button>
            <button onClick={()=>{if(navigator.share){navigator.share({title:p.name,text:"Voici "+p.name+" sur Lamuka : LMK-PROD-"+p.id,url:window.location.href}).catch(()=>{})}else{const code="LMK-PROD-"+p.id;navigator.clipboard?.writeText(code).then(()=>toast.success("Code copié — partage non disponible"))}}} style={{flex:1,padding:"10px 12px",fontSize:12,fontWeight:700,border:"none",background:"#F97316",color:"#fff",borderRadius:10,cursor:"pointer",fontFamily:"inherit"}}>Partager</button>
          </div>
        </div>
      </div>
    )}
  </>);
}

export default DetailScr;
