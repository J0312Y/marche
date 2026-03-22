import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import { useData } from "../../hooks";
import Img from "../../components/Img";
import { fmt, disc } from "../../utils/helpers";

function AllProductsScr({go,onBack,favs,toggleFav,isFav}){
  const { P } = useData();
  const [sort,setSort]=useState("popular");
  const sorted=[...P].sort((a,b)=>sort==="price"?a.price-b.price:sort==="rating"?b.rating-a.rating:b.reviews-a.reviews);
  return(<PullToRefresh onRefresh={async()=>{toast.success("Produits actualisés 📦")}}><div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Tous les articles</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",gap:6,padding:"0 20px 10px"}}>{[["popular","🔥 Populaires"],["rating","⭐ Mieux notés"],["price","💰 Prix ↑"]].map(([k,l])=><button key={k} onClick={()=>setSort(k)} style={{padding:"6px 12px",borderRadius:8,border:sort===k?"2px solid #6366F1":"1px solid var(--border)",background:sort===k?"rgba(99,102,241,0.04)":"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:sort===k?"#6366F1":"var(--muted)"}}>{l}</button>)}</div>
    <div className="pgrid">{sorted.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}<span className="fav" onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"var(--muted)",fontSize:14}}>{isFav(p.id)?"♥":"♡"}</span></div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}{p.eta&&<span style={{marginLeft:4,color:"#6366F1",fontSize:10}}>🕐 {p.eta}</span>}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating} ({p.reviews})</div></div></div>)}</div>
  </div></PullToRefresh>);
}

/* 6 ── CATEGORIES FULL ── */

export default AllProductsScr;
