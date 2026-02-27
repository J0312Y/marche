import { useState } from "react";
import Img from "../../components/Img";
import { P, CATS } from "../../data";
import { fmt, disc } from "../../utils/helpers";

function SearchScr({go,onBack,fromTab,favs,toggleFav,isFav}){
  const [q,setQ]=useState("");const [sc,setSC]=useState("Tous");
  const [showFilter,setShowFilter]=useState(false);
  const [sortBy,setSortBy]=useState("popular");
  const sortOpts=[{k:"popular",l:"🔥 Populaires"},{k:"rating",l:"⭐ Mieux notés"},{k:"priceAsc",l:"💰 Prix ↑"},{k:"priceDesc",l:"💰 Prix ↓"}];
  const cats=["Tous",...CATS.map(c=>c.name)];
  const f=P.filter(p=>{
    if(q){const ql=q.toLowerCase();if(!p.name.toLowerCase().includes(ql)&&!p.cat.toLowerCase().includes(ql)&&!p.vendor.toLowerCase().includes(ql))return false}
    if(sc!=="Tous"&&p.cat!==sc)return false;return true;
  }).sort((a,b)=>sortBy==="priceAsc"?a.price-b.price:sortBy==="priceDesc"?b.price-a.price:sortBy==="rating"?b.rating-a.rating:b.reviews-a.reviews);
  return(<div className="scr">
    {!fromTab&&<div className="appbar"><button onClick={onBack}>←</button><h2>Rechercher</h2><div style={{width:38}}/></div>}
    {fromTab&&<div className="appbar"><h2>Rechercher</h2></div>}
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"0 16px 10px"}}>
      <div style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:"9px 14px",background:"#F5F4F1",borderRadius:14,border:"1px solid #E8E6E1"}}>
        <span style={{fontSize:13}}>🔍</span>
        <input placeholder="Restos, produits, pharmacies..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13,fontFamily:"inherit",color:"#191815"}}/>
        {q&&<span style={{cursor:"pointer",color:"#908C82",fontSize:12}} onClick={()=>setQ("")}>✕</span>}
      </div>
      <button onClick={()=>setShowFilter(!showFilter)} style={{width:36,height:36,borderRadius:12,border:"none",background:showFilter?"#6366F1":"#F0EFEC",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
        <span style={{filter:showFilter?"brightness(10)":"none"}}>⚙️</span>
      </button>
    </div>

    {/* Filter panel */}
    {showFilter&&<div style={{margin:"0 16px 10px",padding:14,background:"#fff",borderRadius:16,border:"1px solid #E8E6E1",boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <h4 style={{fontSize:13,fontWeight:700}}>Filtres & Tri</h4>
        <span style={{fontSize:11,color:"#6366F1",fontWeight:600,cursor:"pointer"}} onClick={()=>{setSC("Tous");setSortBy("popular")}}>Réinitialiser</span>
      </div>
      <div style={{fontSize:11,fontWeight:600,color:"#908C82",marginBottom:6}}>Catégorie</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {cats.map(c=><div key={c} onClick={()=>setSC(c)} style={{padding:"5px 12px",borderRadius:20,border:sc===c?"2px solid #6366F1":"1px solid #E8E6E1",background:sc===c?"rgba(99,102,241,0.06)":"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:sc===c?"#6366F1":"#5E5B53"}}>{c}</div>)}
      </div>
      <div style={{fontSize:11,fontWeight:600,color:"#908C82",marginBottom:6}}>Trier par</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {sortOpts.map(s=><div key={s.k} onClick={()=>setSortBy(s.k)} style={{padding:"5px 12px",borderRadius:20,border:sortBy===s.k?"2px solid #6366F1":"1px solid #E8E6E1",background:sortBy===s.k?"rgba(99,102,241,0.06)":"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:sortBy===s.k?"#6366F1":"#5E5B53"}}>{s.l}</div>)}
      </div>
    </div>}

    <div className="sfilters">{cats.map(c=><button key={c} className={`sf ${sc===c?"on":""}`} onClick={()=>setSC(c)}>{c}</button>)}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 20px 8px"}}>
      <span style={{fontSize:12,color:"#908C82"}}>{f.length} résultat{f.length>1?"s":""}</span>
      <button onClick={()=>{const order=["popular","rating","priceAsc","priceDesc"];const i=order.indexOf(sortBy);setSortBy(order[(i+1)%order.length])}} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:"#6366F1",fontFamily:"inherit"}}>
        ↕️ {sortOpts.find(s=>s.k===sortBy)?.l}
      </button>
    </div>
    <div className="pgrid">{f.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating}</div></div></div>)}</div>
  </div>);
}

/* 8 ── FLASH SALES ── */

export default SearchScr;
