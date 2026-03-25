import { useState, useEffect } from "react";
import Img from "../../components/Img";
import { BackButton, FavButton } from "../../components/BackButton";
import { useData } from "../../hooks";
import { fmt, disc, getVendorPromo } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";
import { shareProduct } from "../../utils/share";
import toast from "../../utils/toast";

// Generate specs based on product type
const getSpecs=(p)=>{
  if(p.type==="restaurant"||p.type==="patisserie") return [
    ["⏱️","Temps de préparation",p.eta||"30-45 min"],
    ["👨‍🍳","Cuisine",p.type==="patisserie"?"Pâtisserie artisanale":"Congolaise traditionnelle"],
    ["🥘","Portions","1 personne"],
    ["🌡️","Service","Chaud, prêt à déguster"],
    ["🥗","Allergènes","Peut contenir des traces de gluten, arachides"],
  ];
  if(p.type==="pharmacie") return [
    ["💊","Forme","Comprimé / Gélule"],
    ["📏","Dosage",p.name.match(/\d+mg/)?p.name.match(/\d+mg/)[0]:"Standard"],
    ["📦","Conditionnement",p.name.match(/x\d+/)?p.name.match(/x\d+/)[0]:"Boîte"],
    ["⚠️","Ordonnance","Non requise"],
    ["📅","Péremption","2027"],
  ];
  if(p.cat==="Électronique") return [
    ["📱","Marque",p.name.includes("Samsung")?"Samsung":p.name.includes("iPhone")?"Apple":"Générique"],
    ["💾","Stockage","128 GB"],
    ["🔋","Batterie","5000 mAh"],
    ["📶","Réseau","4G / 5G"],
    ["⚖️","Poids","195g"],
    ["🛡️","Garantie","12 mois"],
  ];
  if(p.cat==="Mode") return [
    ["📏","Tailles disponibles","S, M, L, XL"],
    ["🎨","Couleurs","Multicolore / Wax"],
    ["🧵","Matière",p.name.includes("Cuir")?"Cuir véritable":"100% Coton Wax"],
    ["🇨🇬","Fabrication","Artisanat congolais"],
    ["🧼","Entretien","Lavage à 30°C"],
  ];
  return [
    ["📦","Conditionnement","Standard"],
    ["📏","Dimensions","Variable"],
    ["⚖️","Poids","Variable"],
    ["🛡️","Garantie","Selon vendeur"],
  ];
};

function DetailScr({product:p,onBack,onAddCart,go,favs,toggleFav,isFav}){
  const [qty,setQty]=useState(1);
  const [cartAnim,setCartAnim]=useState(false);
  const [selSize,setSelSize]=useState(p.sizes?.[0]||null);
  const [selColor,setSelColor]=useState(p.colors?.[0]||null);
  const [selVariant,setSelVariant]=useState(p.variants?.[0]||null);
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

  return(<>
    <div className="scr">
      {/* Hero image */}
      <div className="det-img" onClick={()=>go("gallery",p)}>
        <Img src={p.photos?.[0]||p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>
        <div className="det-top">
          <BackButton onClick={e=>{e.stopPropagation();onBack()}} />
          <div style={{display:"flex",gap:8}}><button onClick={e=>{e.stopPropagation();shareProduct(p)}} style={{width:40,height:40,borderRadius:14,background:"rgba(255,255,255,0.85)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.4)",boxShadow:"0 4px 16px rgba(0,0,0,0.12)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📤</button><FavButton active={isFav(p.id)} onClick={e=>{e.stopPropagation();toggleFav(p.id)}} /></div>
        </div>
        {disc(p)>0&&<span className="badge" style={{position:"absolute",bottom:14,left:14,zIndex:5}}>-{disc(p)}%</span>}
        <div style={{position:"absolute",bottom:14,right:14,background:"rgba(0,0,0,.4)",color:"#fff",padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,zIndex:5}}>{p.photos?.length||1} photos</div>
      </div>

      <div className="det-body">
        {/* Vendor + Name */}
        <div className="det-vendor" onClick={()=>go("vendor",{id:p.vendorId,name:p.vendor})}><span>{p.va}</span>{p.vendor} ✓</div>
        <h2>{p.name}</h2>

        {/* Rating */}
        <div className="det-stars" style={{cursor:"pointer"}} onClick={()=>go("reviews",p)}>
          {"★".repeat(Math.floor(p.rating))}{"☆".repeat(5-Math.floor(p.rating))}
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
          <span style={{fontSize:20}}>🏷️</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#F59E0B"}}>{vp.promoName}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>-{vp.promoDiscount}% appliqué automatiquement · Jusqu'au {vp.promoEnds}</div>
          </div>
        </div>}

        {/* Tags */}
        {p.tags.length>0&&<div className="det-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>}

        {/* Delivery estimate */}
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"rgba(249,115,22,0.04)",borderRadius:12,marginBottom:10,border:"1px solid rgba(249,115,22,0.12)"}}>
          <span style={{fontSize:18}}>🚚</span>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:"#F97316"}}>Livraison estimée : {p.eta||"1-3 jours"}</div>
            <div style={{fontSize:10,color:"var(--muted)"}}>À Brazzaville · {p.type==="restaurant"||p.type==="patisserie"?"Préparation incluse":"Expédition sous 24h"}</div>
          </div>
        </div>

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

        {/* Price alert + Group buy */}
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <button onClick={()=>{if(priceAlert){setPriceAlert(false);toast.success("Alerte retirée")}else{setShowAlertPopup(true)}}} style={{flex:1,padding:"8px 0",borderRadius:10,border:priceAlert?"1px solid #F59E0B":"1px solid var(--border)",background:priceAlert?"rgba(245,158,11,0.06)":"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:priceAlert?"#F59E0B":"var(--text)",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            {priceAlert?"🔔 Alerte active":"🔔 Alerte prix"}
          </button>
          <button onClick={()=>setShowGroupPopup(true)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            👥 Achat groupé -20%
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
              <span style={{fontSize:16,width:24,textAlign:"center"}}>{icon}</span>
              <span style={{flex:1,fontSize:13,color:"var(--muted)"}}>{label}</span>
              <span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{value}</span>
            </div>
          ))}
        </div>}

        {/* Info tab */}
        {activeTab==="info"&&<div style={{marginBottom:12}}>
          <div className="det-info" style={{marginBottom:8}}>
            <span className="dii">🚚</span>
            <div className="dit">
              <h4>Livraison à Brazzaville</h4>
              <p>1-3 jours · À partir de 1 500 FCFA</p>
              <p style={{fontSize:11,color:"#F59E0B",marginTop:2}}>Gratuite à partir de 50 000 FCFA</p>
            </div>
          </div>
          <div className="det-info" style={{marginBottom:8}}>
            <span className="dii">📱</span>
            <div className="dit">
              <h4>Paiement Mobile Money</h4>
              <p>Airtel Money, MTN MoMo, Kolo Pay</p>
            </div>
          </div>
          <div className="det-info" style={{marginBottom:8}}>
            <span className="dii">🔄</span>
            <div className="dit">
              <h4>Politique de retour</h4>
              <p>{p.type==="restaurant"||p.type==="patisserie"?"Non remboursable (produit alimentaire)":"Retour gratuit sous 7 jours"}</p>
            </div>
          </div>
          <div className="det-info" style={{marginBottom:8}} onClick={()=>go("compare",p)}>
            <span className="dii">⚖️</span>
            <div className="dit">
              <h4>Comparer ce produit</h4>
              <p>Voir côte à côte avec un autre</p>
            </div>
            <span style={{color:"#F97316",fontSize:14}}>→</span>
          </div>
          <div className="det-info" onClick={()=>go("chatVendor",{vendorName:p.vendor,vendorAvatar:p.va})}>
            <span className="dii">💬</span>
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
              <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>❓ {qa.q}</div>
              <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5,padding:"8px 10px",background:"var(--light)",borderRadius:8}}>
                <span style={{fontSize:10,color:"#F97316",fontWeight:600}}>↩️ {qa.by}</span> · <span style={{fontSize:10,color:"var(--muted)"}}>{qa.date}</span>
                <div style={{marginTop:3}}>{qa.a}</div>
              </div>
            </div>
          ))}
          <div style={{marginTop:8}}>
            <div style={{display:"flex",gap:8}}>
              <input value={qaText} onChange={e=>setQaText(e.target.value)} placeholder="Poser une question..." style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:12,fontFamily:"inherit",outline:"none",color:"var(--text)"}}/>
              <button onClick={()=>{if(qaText.trim()){setQas(prev=>[...prev,{q:qaText,a:"",by:"",date:"Maintenant"}]);setQaText("");toast.success("Question envoyée au vendeur ✅")}}} style={{padding:"0 14px",borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Envoyer</button>
            </div>
          </div>
        </div>}

        {/* Vendor card */}
        <div onClick={()=>go("vendor",{id:p.vendorId,name:p.vendor})} style={{display:"flex",alignItems:"center",gap:12,padding:14,background:"var(--card)",borderRadius:14,border:"1px solid var(--border)",marginBottom:12,cursor:"pointer"}}>
          <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff"}}>{p.va}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700}}>{p.vendor} <span style={{color:"#F97316"}}>✓</span>{vendor?.badge==="top"&&<span style={{padding:"2px 8px",borderRadius:6,background:"rgba(245,158,11,0.08)",color:"#F59E0B",fontSize:9,fontWeight:700,marginLeft:4}}>🏆 Top Vendeur</span>}{vendor?.badge==="new"&&<span style={{padding:"2px 8px",borderRadius:6,background:"rgba(249,115,22,0.08)",color:"#F97316",fontSize:9,fontWeight:700,marginLeft:4}}>🆕 Nouveau</span>}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>Voir la boutique · Tous les articles</div>
          </div>
          <span style={{color:"var(--muted)",fontSize:18}}>›</span>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="det-bar">
      <div className="qty">
        <button onClick={()=>qty>1&&setQty(qty-1)}>−</button>
        <span>{qty}</span>
        <button onClick={()=>setQty(qty+1)}>+</button>
      </div>
      <button className={`add-btn${cartAnim?" cart-bounce":""}`} onClick={()=>{setCartAnim(true);setTimeout(()=>setCartAnim(false),400);onAddCart(p,qty)}}>🛍️ Ajouter · {fmt(finalPrice*qty)}</button>
    </div>

    {/* ── Alerte Prix Popup ── */}
    {showAlertPopup&&<div onClick={()=>setShowAlertPopup(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeInFast .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:320,background:"var(--card)",borderRadius:20,padding:20,animation:"scaleIn .25s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:32,marginBottom:6}}>🔔</div>
          <h3 style={{fontSize:16,fontWeight:700}}>Alerte de prix</h3>
          <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Recevez une notification quand le prix de <b>{p.name}</b> baisse</p>
        </div>
        <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>Prix actuel : <span style={{color:"#F97316"}}>{fmt(p.price)}</span></div>
        <div className="field"><label>M'alerter en dessous de (FCFA)</label><input value={alertPrice} onChange={e=>setAlertPrice(e.target.value.replace(/\D/g,""))} placeholder={String(Math.round(p.price*0.8))} inputMode="numeric"/></div>
        <div style={{display:"flex",gap:8,marginTop:4}}>
          <button onClick={()=>setShowAlertPopup(false)} style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Annuler</button>
          <button onClick={()=>{setPriceAlert(true);setShowAlertPopup(false);toast.success("🔔 Alerte activée !")}} style={{flex:1,padding:10,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Activer</button>
        </div>
      </div>
    </div>}

    {/* ── Achat Groupé Popup ── */}
    {showGroupPopup&&<div onClick={()=>setShowGroupPopup(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeInFast .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:320,background:"var(--card)",borderRadius:20,padding:20,animation:"scaleIn .25s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:32,marginBottom:6}}>🤝</div>
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
            ?<button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#10B981",color:"#fff",fontSize:13,fontWeight:700,cursor:"default",fontFamily:"inherit"}}>✅ Vous avez rejoint</button>
            :<button onClick={()=>{setGroupJoined(true);toast.success("🤝 Vous avez rejoint le groupe !")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Rejoindre</button>
          }
          <button onClick={()=>{import("../../utils/share").then(m=>m.shareProduct({title:"Achat groupé — "+p.name,text:"Rejoins l'achat groupé pour "+p.name+" et obtiens -20% ! 🤝",url:"https://lamuka.market/group/"+p.id}))}} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>📤 Partager</button>
        </div>
      </div>
    </div>}
  </>);
}

export default DetailScr;
