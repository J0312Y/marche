import { useState } from "react";
import Img from "../../components/Img";
import { fmt, disc } from "../../utils/helpers";

function DetailScr({product:p,onBack,onAddCart,go,favs,toggleFav,isFav}){
  const [qty,setQty]=useState(1);
  return(<>
    <div className="scr">
      <div className="det-img" onClick={()=>go("gallery",p)}><Img src={p.photos?.[0]||p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/><div className="det-top"><button onClick={e=>{e.stopPropagation();onBack()}}>←</button><button onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"inherit"}}>{isFav(p.id)?"❤️":"♡"}</button></div>{disc(p)>0&&<span className="badge" style={{position:"absolute",bottom:14,left:14,zIndex:5}}>-{disc(p)}%</span>}<div style={{position:"absolute",bottom:14,right:14,background:"rgba(0,0,0,.4)",color:"#fff",padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,zIndex:5}}>{p.photos?.length||1} photos</div></div>
      <div className="det-body">
        <div className="det-vendor"><span>{p.va}</span>{p.vendor} ✓</div>
        <h2>{p.name}</h2>
        <div className="det-stars" style={{cursor:"pointer"}} onClick={()=>go("reviews",p)}>{"★".repeat(Math.floor(p.rating))}{"☆".repeat(5-Math.floor(p.rating))}<span className="rc">({p.reviews} avis) →</span></div>
        <div className="det-price"><span className="dp">{fmt(p.price)}</span>{p.old&&<span className="dpo">{fmt(p.old)}</span>}</div>
        {p.tags.length>0&&<div className="det-tags">{p.tags.map(t=><span key={t} style={{cursor:"pointer"}} onClick={()=>go("reviews",p)}>{t}</span>)}</div>}
        <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>Description</div>
        <p style={{fontSize:14,color:"#5E5B53",lineHeight:1.6,marginBottom:16}}>{p.desc}</p>
        <div className="det-info"><span className="dii">🚚</span><div className="dit"><h4>Livraison à Brazzaville</h4><p>1-3 jours · 2 500 FCFA</p></div></div>
        <div className="det-info"><span className="dii">📱</span><div className="dit"><h4>Paiement Mobile Money</h4><p>Airtel, MTN</p></div></div>
        <div className="det-info" onClick={()=>go("compare",p)}><span className="dii">⚖️</span><div className="dit"><h4>Comparer ce produit</h4><p>Voir côte à côte avec un autre</p></div><span style={{color:"#6366F1",fontSize:14}}>→</span></div>
      </div>
    </div>
    <div className="det-bar"><div className="qty"><button onClick={()=>qty>1&&setQty(qty-1)}>−</button><span>{qty}</span><button onClick={()=>setQty(qty+1)}>+</button></div><button className="add-btn" onClick={()=>onAddCart(p,qty)}>🛍️ Ajouter · {fmt(p.price*qty)}</button></div>
  </>);
}

/* 11 ── GALLERY ── */

export default DetailScr;
