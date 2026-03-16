import { useState } from "react";
import Img from "../../components/Img";
import { BackButton, FavButton } from "../../components/BackButton";
import { useData } from "../../hooks";
import { fmt, disc, getVendorPromo } from "../../utils/helpers";
import { shareProduct } from "../../utils/share";

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
  const [showSpecs,setShowSpecs]=useState(false);
  const [activeTab,setActiveTab]=useState("desc");
  const { VENDORS } = useData();
  const specs=getSpecs(p);
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
            <span className="dp" style={{color:"#10B981"}}>{fmt(vp.promoPrice)}</span>
            <span className="dpo">{fmt(p.price)}</span>
            <span style={{fontSize:12,color:"#10B981",fontWeight:700,marginLeft:8}}>-{vp.promoDiscount}%</span>
          </>:<>
            <span className="dp">{fmt(p.price)}</span>
            {p.old&&<span className="dpo">{fmt(p.old)}</span>}
            {disc(p)>0&&<span style={{fontSize:12,color:"#10B981",fontWeight:700,marginLeft:8}}>Économisez {fmt(p.old-p.price)}</span>}
          </>}
        </div>

        {/* Vendor promo banner */}
        {vp&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(16,185,129,0.06)",borderRadius:12,marginBottom:12,border:"1px solid rgba(16,185,129,0.12)"}}>
          <span style={{fontSize:20}}>🏷️</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#10B981"}}>{vp.promoName}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>-{vp.promoDiscount}% appliqué automatiquement · Jusqu'au {vp.promoEnds}</div>
          </div>
        </div>}

        {/* Tags */}
        {p.tags.length>0&&<div className="det-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>}

        {/* ETA for food */}
        {p.eta&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"rgba(16,185,129,0.06)",borderRadius:12,marginBottom:12,border:"1px solid rgba(16,185,129,0.12)"}}>
          <span style={{fontSize:20}}>🕐</span>
          <div><div style={{fontSize:13,fontWeight:700,color:"#10B981"}}>Livraison estimée : {p.eta}</div><div style={{fontSize:11,color:"var(--muted)"}}>Temps de préparation inclus</div></div>
        </div>}

        {/* Tab bar: Description / Caractéristiques */}
        <div style={{display:"flex",gap:0,marginBottom:12,background:"var(--light)",borderRadius:12,padding:3}}>
          {[["desc","Description"],["specs","Caractéristiques"],["info","Infos"]].map(([k,l])=>(
            <button key={k} onClick={()=>setActiveTab(k)} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",background:activeTab===k?"var(--card)":"transparent",color:activeTab===k?"#191815":"var(--muted)",fontSize:12,fontWeight:activeTab===k?700:500,cursor:"pointer",fontFamily:"inherit",boxShadow:activeTab===k?"0 1px 4px rgba(0,0,0,.06)":"none",transition:"all .2s"}}>{l}</button>
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
              <p style={{fontSize:11,color:"#10B981",marginTop:2}}>Gratuite à partir de 50 000 FCFA</p>
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
            <span style={{color:"#6366F1",fontSize:14}}>→</span>
          </div>
          <div className="det-info" onClick={()=>go("chatVendor",{vendorName:p.vendor,vendorAvatar:p.va})}>
            <span className="dii">💬</span>
            <div className="dit">
              <h4>Contacter le vendeur</h4>
              <p>Poser une question sur ce produit</p>
            </div>
            <span style={{color:"#6366F1",fontSize:14}}>→</span>
          </div>
        </div>}

        {/* Vendor card */}
        <div onClick={()=>go("vendor",{id:p.vendorId,name:p.vendor})} style={{display:"flex",alignItems:"center",gap:12,padding:14,background:"var(--card)",borderRadius:14,border:"1px solid var(--border)",marginBottom:12,cursor:"pointer"}}>
          <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff"}}>{p.va}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700}}>{p.vendor} <span style={{color:"#6366F1"}}>✓</span></div>
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
      <button className="add-btn" onClick={()=>onAddCart(p,qty)}>🛍️ Ajouter · {fmt(finalPrice*qty)}</button>
    </div>
  </>);
}

export default DetailScr;
