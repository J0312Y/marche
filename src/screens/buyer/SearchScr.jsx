import { useState } from "react";
import Img from "../../components/Img";
import { useData } from "../../hooks";
import { fmt, disc, getVendorPromo, totalDisc } from "../../utils/helpers";

function SearchScr({go,onBack,fromTab,favs,toggleFav,isFav,defaultTab}){
  const { P, VENDORS, CATS } = useData();
  const [q,setQ]=useState("");const [sc,setSC]=useState("Tous");
  const [tab,setTab]=useState(defaultTab||"products");
  const [sortBy,setSortBy]=useState("popular");
  const cats=["Tous",...CATS.map(c=>c.name)];
  const ql=q.toLowerCase();
  const fp=P.filter(p=>{
    if(q&&!p.name.toLowerCase().includes(ql)&&!p.cat.toLowerCase().includes(ql)&&!p.vendor.toLowerCase().includes(ql))return false;
    if(sc!=="Tous"&&p.cat!==sc)return false;return true;
  }).sort((a,b)=>sortBy==="priceAsc"?a.price-b.price:sortBy==="priceDesc"?b.price-a.price:sortBy==="rating"?b.rating-a.rating:b.reviews-a.reviews);
  const fv=VENDORS.filter(v=>{
    if(!q)return true;return v.name.toLowerCase().includes(ql)||v.desc?.toLowerCase().includes(ql)||v.type?.toLowerCase().includes(ql);
  });
  return(<div className="scr">
    {fromTab?<div className="appbar"><h2>Rechercher</h2></div>:<div className="appbar"><button onClick={onBack}>←</button><h2>Rechercher</h2><div style={{width:38}}/></div>}
    <div style={{padding:"0 16px 8px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",background:"var(--light)",borderRadius:14,border:"1px solid var(--border)"}}>
        <span style={{fontSize:13}}>🔍</span>
        <input placeholder="Produits, boutiques, restos..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13,fontFamily:"inherit",color:"var(--text)"}}/>
        {q&&<span style={{cursor:"pointer",color:"var(--muted)",fontSize:12}} onClick={()=>setQ("")}>✕</span>}
      </div>
    </div>
    {/* Tabs: Products / Vendors */}
    <div style={{display:"flex",margin:"0 16px 8px",background:"var(--light)",borderRadius:10,padding:2}}>
      {[["products","🛍️ Produits",fp.length],["vendors","🏪 Boutiques",fv.length]].map(([k,l,c])=>(
        <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"7px 0",borderRadius:8,border:"none",background:tab===k?"var(--card)":"transparent",color:tab===k?"var(--text)":"var(--muted)",fontSize:11,fontWeight:tab===k?700:500,cursor:"pointer",fontFamily:"inherit",boxShadow:tab===k?"0 1px 3px rgba(0,0,0,.06)":"none"}}>{l} ({c})</button>
      ))}
    </div>
    {tab==="products"&&<>
      {/* Category chips */}
      <div style={{display:"flex",gap:6,padding:"0 16px 8px",overflowX:"auto",scrollbarWidth:"none"}}>{cats.map(c=><button key={c} onClick={()=>setSC(c)} style={{padding:"5px 12px",borderRadius:20,border:sc===c?"1px solid #6366F1":"1px solid var(--border)",background:sc===c?"rgba(99,102,241,0.06)":"var(--card)",color:sc===c?"#6366F1":"var(--sub)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>{c}</button>)}</div>
      {/* Sort */}
      <div style={{display:"flex",gap:6,padding:"0 16px 8px"}}>
        {[["popular","🔥 Populaires"],["rating","⭐ Notés"],["priceAsc","💰 Prix ↑"],["priceDesc","💰 Prix ↓"]].map(([k,l])=><button key={k} onClick={()=>setSortBy(k)} style={{padding:"4px 10px",borderRadius:8,border:"none",background:sortBy===k?"#6366F1":"var(--light)",color:sortBy===k?"var(--card)":"var(--muted)",fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
      </div>
      <div className="pgrid">{fp.map(p=>{const td=totalDisc(p,VENDORS);const vp=getVendorPromo(p,VENDORS);return(<div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>{p.old&&<span className="badge">-{disc(p)}%</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{vp?<><span style={{color:"#10B981"}}>{fmt(vp.promoPrice)}</span><span className="po">{fmt(p.price)}</span></>:<>{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating}</div></div></div>)})}</div>
      {fp.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36}}>🔍</div><div style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Aucun produit trouvé</div></div>}
    </>}
    {tab==="vendors"&&<div style={{padding:"0 16px 80px"}}>
      {fv.map(v=><div key={v.id} onClick={()=>go("vendor",v)} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,cursor:"pointer"}}>
        <div style={{width:50,height:50,borderRadius:14,overflow:"hidden",background:"var(--light)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:v.avatar}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:700}}>{v.name} {v.verified&&<span style={{color:"#6366F1",fontSize:11}}>✓</span>}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>📍 {v.loc} · {v.type}</div>
          <div style={{display:"flex",gap:10,marginTop:3,fontSize:11}}>
            <span style={{color:"#F59E0B"}}>⭐ {v.rating}</span>
            <span style={{color:"var(--muted)"}}>{v.products} articles</span>
            <span style={{color:"var(--muted)"}}>{v.followers} abonnés</span>
          </div>
          {v.promo&&<div style={{marginTop:4,padding:"2px 8px",borderRadius:6,background:"rgba(16,185,129,0.06)",color:"#10B981",fontSize:10,fontWeight:600,display:"inline-block"}}>🏷️ -{v.promo.discount}% {v.promo.name}</div>}
        </div>
        <span style={{color:"var(--muted)",fontSize:18}}>›</span>
      </div>)}
      {fv.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36}}>🏪</div><div style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Aucune boutique trouvée</div></div>}
    </div>}
  </div>);
}
export default SearchScr;
