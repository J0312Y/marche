import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import { useData } from "../../hooks";
import Img from "../../components/Img";
import { fmt, disc } from "../../utils/helpers";

function AllProductsScr({go,onBack,favs,toggleFav,isFav}){
  const { P } = useData();
  const [sort,setSort]=useState("popular");
  const [showFilter,setShowFilter]=useState(false);
  const [priceRange,setPriceRange]=useState([0,500000]);
  const [selCats,setSelCats]=useState([]);
  const [selTypes,setSelTypes]=useState([]);
  const [onlyPromo,setOnlyPromo]=useState(false);
  const [onlyInStock,setOnlyInStock]=useState(true);

  const cats=[...new Set(P.map(p=>p.cat))];
  const types=[...new Set(P.map(p=>p.type))];

  let filtered=[...P];
  if(selCats.length>0) filtered=filtered.filter(p=>selCats.includes(p.cat));
  if(selTypes.length>0) filtered=filtered.filter(p=>selTypes.includes(p.type));
  if(onlyPromo) filtered=filtered.filter(p=>p.old&&p.old>p.price);
  filtered=filtered.filter(p=>p.price>=priceRange[0]&&p.price<=priceRange[1]);

  const sorted=filtered.sort((a,b)=>sort==="price_asc"?a.price-b.price:sort==="price_desc"?b.price-a.price:sort==="rating"?b.rating-a.rating:sort==="newest"?0:b.reviews-a.reviews);

  const resetFilters=()=>{setPriceRange([0,500000]);setSelCats([]);setSelTypes([]);setOnlyPromo(false);setOnlyInStock(true)};
  const activeFilters=(selCats.length>0?1:0)+(selTypes.length>0?1:0)+(onlyPromo?1:0)+(priceRange[0]>0||priceRange[1]<500000?1:0);

  return(<PullToRefresh onRefresh={async()=>{toast.success("Produits actualisés 📦")}}><div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Tous les articles <span style={{fontSize:12,color:"var(--muted)",fontWeight:500}}>({sorted.length})</span></h2>
    <button onClick={()=>setShowFilter(true)} style={{position:"relative",background:"none",border:"none",fontSize:20,cursor:"pointer",padding:4}}>🎛️{activeFilters>0&&<span style={{position:"absolute",top:-2,right:-2,width:16,height:16,borderRadius:8,background:"#F97316",color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{activeFilters}</span>}</button>
  </div>

    {/* Sort pills */}
    <div style={{display:"flex",gap:6,padding:"0 16px 10px",overflowX:"auto",scrollbarWidth:"none"}}>
      {[["popular","🔥 Populaires"],["rating","⭐ Mieux notés"],["price_asc","💰 Prix ↑"],["price_desc","💰 Prix ↓"],["newest","🆕 Récents"]].map(([k,l])=>
        <button key={k} onClick={()=>setSort(k)} style={{padding:"6px 12px",borderRadius:8,border:sort===k?"2px solid #F97316":"1px solid var(--border)",background:sort===k?"rgba(249,115,22,0.04)":"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:sort===k?"#F97316":"var(--muted)",flexShrink:0}}>{l}</button>
      )}
    </div>

    {/* Active filters display */}
    {activeFilters>0&&<div style={{display:"flex",gap:6,padding:"0 16px 10px",flexWrap:"wrap",alignItems:"center"}}>
      <span style={{fontSize:11,color:"var(--muted)"}}>Filtres :</span>
      {selCats.map(c=><span key={c} onClick={()=>setSelCats(p=>p.filter(x=>x!==c))} style={{padding:"3px 8px",borderRadius:6,background:"rgba(249,115,22,0.08)",color:"#F97316",fontSize:10,fontWeight:600,cursor:"pointer"}}>{c} ✕</span>)}
      {onlyPromo&&<span onClick={()=>setOnlyPromo(false)} style={{padding:"3px 8px",borderRadius:6,background:"rgba(239,68,68,0.08)",color:"#EF4444",fontSize:10,fontWeight:600,cursor:"pointer"}}>Promos ✕</span>}
      {(priceRange[0]>0||priceRange[1]<500000)&&<span onClick={()=>setPriceRange([0,500000])} style={{padding:"3px 8px",borderRadius:6,background:"rgba(59,130,246,0.08)",color:"#3B82F6",fontSize:10,fontWeight:600,cursor:"pointer"}}>{fmt(priceRange[0])}–{fmt(priceRange[1])} ✕</span>}
      <span onClick={resetFilters} style={{fontSize:10,color:"#EF4444",fontWeight:600,cursor:"pointer",marginLeft:4}}>Tout effacer</span>
    </div>}

    {/* Products grid */}
    {sorted.length===0?<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36,marginBottom:8}}>🔍</div><div style={{fontSize:14,fontWeight:600}}>Aucun résultat</div><div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Essayez de modifier vos filtres</div><button onClick={resetFilters} style={{marginTop:12,padding:"8px 16px",borderRadius:10,border:"1px solid #F97316",background:"transparent",color:"#F97316",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Réinitialiser</button></div>
    :<div className="pgrid">{sorted.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} fit="cover"/>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag">{p.tags[0]}</span>}<span className="fav" onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"var(--muted)",fontSize:14}}>{isFav(p.id)?"♥":"♡"}</span></div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating} ({p.reviews})</div></div></div>)}</div>}

    {/* Filter Modal */}
    {showFilter&&<div onClick={()=>setShowFilter(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:9999,display:"flex",alignItems:"flex-end",animation:"fadeInFast .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:500,margin:"0 auto",background:"var(--card)",borderRadius:"20px 20px 0 0",padding:20,maxHeight:"80vh",overflowY:"auto",animation:"slideUp .3s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{fontSize:18,fontWeight:700}}>🎛️ Filtres</h3>
          <button onClick={()=>setShowFilter(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--muted)"}}>✕</button>
        </div>

        {/* Price range */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>💰 Fourchette de prix</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:"var(--muted)",marginBottom:4}}>Min</div>
              <input type="number" value={priceRange[0]} onChange={e=>setPriceRange([+e.target.value,priceRange[1]])} style={{width:"100%",padding:10,borderRadius:10,border:"1px solid var(--border)",background:"var(--light)",fontSize:13,fontFamily:"inherit",color:"var(--text)"}}/>
            </div>
            <span style={{color:"var(--muted)",marginTop:16}}>—</span>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:"var(--muted)",marginBottom:4}}>Max</div>
              <input type="number" value={priceRange[1]} onChange={e=>setPriceRange([priceRange[0],+e.target.value])} style={{width:"100%",padding:10,borderRadius:10,border:"1px solid var(--border)",background:"var(--light)",fontSize:13,fontFamily:"inherit",color:"var(--text)"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
            {[[0,5000,"< 5k"],[5000,20000,"5k-20k"],[20000,50000,"20k-50k"],[50000,200000,"50k-200k"],[200000,500000,"200k+"]].map(([min,max,l])=>
              <button key={l} onClick={()=>setPriceRange([min,max])} style={{padding:"4px 10px",borderRadius:8,border:priceRange[0]===min&&priceRange[1]===max?"2px solid #F97316":"1px solid var(--border)",background:priceRange[0]===min&&priceRange[1]===max?"rgba(249,115,22,0.06)":"var(--card)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:priceRange[0]===min&&priceRange[1]===max?"#F97316":"var(--muted)"}}>{l}</button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>📂 Catégories</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {cats.map(c=><button key={c} onClick={()=>setSelCats(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c])} style={{padding:"6px 12px",borderRadius:10,border:selCats.includes(c)?"2px solid #F97316":"1px solid var(--border)",background:selCats.includes(c)?"rgba(249,115,22,0.06)":"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:selCats.includes(c)?"#F97316":"var(--muted)"}}>{c}</button>)}
          </div>
        </div>

        {/* Promos only */}
        <div style={{marginBottom:16}}>
          <div onClick={()=>setOnlyPromo(!onlyPromo)} style={{display:"flex",alignItems:"center",gap:10,padding:12,borderRadius:12,border:onlyPromo?"2px solid #EF4444":"1px solid var(--border)",background:onlyPromo?"rgba(239,68,68,0.04)":"var(--card)",cursor:"pointer"}}>
            <span style={{fontSize:18}}>🏷️</span>
            <span style={{flex:1,fontSize:13,fontWeight:onlyPromo?700:500}}>Promos uniquement</span>
            <div className={`toggle ${onlyPromo?"on":""}`} style={{transform:"scale(.8)"}}><div/></div>
          </div>
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={()=>{resetFilters();setShowFilter(false)}} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Réinitialiser</button>
          <button onClick={()=>setShowFilter(false)} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Voir {sorted.length} résultats</button>
        </div>
      </div>
    </div>}
  </div></PullToRefresh>);
}

export default AllProductsScr;
