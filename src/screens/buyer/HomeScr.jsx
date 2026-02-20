import { useState } from "react";
import { P, VENDORS, CATS } from "../../data";
import { fmt, disc } from "../../utils/helpers";

function HomeScr({go,favs,toggleFav,isFav}){
  const [selCat,setSC]=useState(0);
  const [selType,setSelType]=useState("all");
  const [homeQ,setHomeQ]=useState("");
  const [searchFocused,setSearchFocused]=useState(false);
  const [recentSearches,setRecent]=useState(["Poulet DG","Smartphone","Doliprane","Pressing","Robe Wax","Croissants"]);
  const [showFilter,setShowFilter]=useState(false);
  const [filterType,setFilterType]=useState("all");
  const [filterSort,setFilterSort]=useState("popular");
  const trending=["iPhone","Samsung","Wax","Pâtisserie","Braisé","Pharmacie","Livraison","Promo"];
  const types=[{id:"all",icon:"🏠",name:"Tout"},{id:"restaurant",icon:"🍽️",name:"Restos"},{id:"patisserie",icon:"🧁",name:"Pâtisseries"},{id:"supermarche",icon:"🛒",name:"Courses"},{id:"pharmacie",icon:"💊",name:"Pharma"},{id:"boutique",icon:"🏪",name:"Boutiques"},{id:"service",icon:"🔧",name:"Services"}];
  const filteredP=selType==="all"?P:P.filter(p=>p.type===selType);
  const filteredV=selType==="all"?VENDORS:VENDORS.filter(v=>v.type===selType);
  const nearbyRestos=VENDORS.filter(v=>v.type==="restaurant");

  const doSearch=(term)=>{setHomeQ(term);if(!recentSearches.includes(term))setRecent(r=>[term,...r].slice(0,6))};
  const exitSearch=()=>{setHomeQ("");setSearchFocused(false)};

  const searchResults=homeQ.length>0?P.filter(p=>{
    const q=homeQ.toLowerCase();
    const matchQ=p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q)||p.vendor.toLowerCase().includes(q)||(p.type&&p.type.toLowerCase().includes(q));
    const matchType=filterType==="all"||p.type===filterType;
    return matchQ&&matchType;
  }).sort((a,b)=>filterSort==="price"?a.price-b.price:filterSort==="rating"?b.rating-a.rating:b.reviews-a.reviews):null;

  // Search mode: focused or has query
  const inSearchMode=searchFocused||homeQ.length>0;

  return(
    <div className="scr">
      {/* Header - only show when not in search */}
      {!inSearchMode&&<div className="hdr"><div><div className="hdr-t">Bonjour 👋</div><div className="hdr-h">Lamuka Market</div></div>
        <div className="hdr-r"><div className="hdr-btn" onClick={()=>go("notif")}>🔔<div className="notif-badge"/></div><div className="hdr-btn" onClick={()=>go("cart")}>🛍️</div></div></div>}

      {/* Search bar */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:inSearchMode?"14px 16px 10px":"0 16px 12px",marginTop:inSearchMode?0:10}}>
        {inSearchMode&&<button onClick={exitSearch} style={{width:38,height:38,borderRadius:12,border:"none",background:"#F0EFEC",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#191815",fontFamily:"inherit"}}>←</button>}
        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:inSearchMode?"10px 16px":"9px 14px",background:"#fff",borderRadius:24,border:"1px solid #E8E6E1",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
          <span style={{color:"#C4C1BA",fontSize:13,flexShrink:0}}>🔍</span>
          <input value={homeQ} onChange={e=>setHomeQ(e.target.value)} onFocus={()=>setSearchFocused(true)} placeholder="Rechercher produits, restos..." style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13,fontFamily:"inherit",color:"#191815"}}/>
          {homeQ&&<span style={{cursor:"pointer",color:"#908C82",fontSize:12,flexShrink:0}} onClick={()=>setHomeQ("")}>✕</span>}
        </div>
        <button onClick={()=>setShowFilter(!showFilter)} style={{width:38,height:38,borderRadius:12,border:"none",background:showFilter?"#6366F1":"#F0EFEC",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
          <span style={{filter:showFilter?"brightness(10)":"none"}}>⚙️</span>
        </button>
      </div>

      {/* Filter panel */}
      {showFilter&&<div style={{margin:"0 16px 12px",padding:16,background:"#fff",borderRadius:18,border:"1px solid #E8E6E1",boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h4 style={{fontSize:14,fontWeight:700}}>Filtres</h4>
          <span style={{fontSize:12,color:"#6366F1",fontWeight:600,cursor:"pointer"}} onClick={()=>{setFilterType("all");setFilterSort("popular")}}>Réinitialiser</span>
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"#908C82",marginBottom:8}}>Type de commerce</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {types.map(t=><div key={t.id} onClick={()=>setFilterType(t.id)} style={{padding:"6px 12px",borderRadius:20,border:filterType===t.id?"2px solid #6366F1":"1px solid #E8E6E1",background:filterType===t.id?"rgba(99,102,241,0.06)":"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:filterType===t.id?"#6366F1":"#5E5B53"}}>{t.icon} {t.name}</div>)}
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"#908C82",marginBottom:8}}>Trier par</div>
        <div style={{display:"flex",gap:6}}>
          {[["popular","🔥 Populaires"],["rating","⭐ Mieux notés"],["price","💰 Prix ↑"]].map(([k,l])=><div key={k} onClick={()=>setFilterSort(k)} style={{padding:"6px 12px",borderRadius:20,border:filterSort===k?"2px solid #6366F1":"1px solid #E8E6E1",background:filterSort===k?"rgba(99,102,241,0.06)":"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:filterSort===k?"#6366F1":"#5E5B53"}}>{l}</div>)}
        </div>
      </div>}

      {/* ── SEARCH RESULTS MODE ── */}
      {searchResults?<div style={{padding:"0 16px 100px"}}>
        <div style={{fontSize:12,color:"#908C82",padding:"4px 0 12px",fontWeight:500}}>{searchResults.length} résultat{searchResults.length!==1?"s":""} pour « {homeQ} »</div>
        {searchResults.length>0?<div className="pgrid" style={{padding:0}}>{searchResults.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><span className="pe">{p.img}</span>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating}</div></div></div>)}</div>
        :<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:40,marginBottom:10}}>🔍</div><div style={{fontSize:14,fontWeight:600}}>Aucun résultat</div><div style={{fontSize:12,color:"#908C82",marginTop:4}}>Essayez un autre terme</div></div>}
      </div>

      /* ── DISCOVERY MODE (focused, no query) ── */
      :searchFocused&&!homeQ?<div style={{padding:"0 16px 100px"}}>

        {/* Recent Searches */}
        {recentSearches.length>0&&<div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0 12px"}}>
            <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"#191815"}}>Recherches récentes</h3>
            <span style={{fontSize:13,color:"#6366F1",fontWeight:600,cursor:"pointer"}} onClick={()=>setRecent([])}>Effacer</span>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {recentSearches.map(s=><div key={s} onClick={()=>doSearch(s)} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 16px",background:"#F0EFEC",borderRadius:24,cursor:"pointer",fontSize:13,fontWeight:500,color:"#5E5B53",transition:"all .15s"}}>
              <span style={{fontSize:11,color:"#C4C1BA"}}>🕐</span>{s}
            </div>)}
          </div>
        </div>}

        {/* Popular Categories */}
        <div style={{marginBottom:24}}>
          <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"#191815",paddingBottom:12}}>Catégories populaires</h3>
          <div style={{background:"#fff",borderRadius:18,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.04)"}}>
            {CATS.map((c,i)=><div key={c.id} onClick={()=>doSearch(c.name)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",cursor:"pointer",borderBottom:i<CATS.length-1?"1px solid #F5F4F1":"none",transition:"background .12s"}}>
              <div style={{width:42,height:42,borderRadius:12,background:"#F5F4F1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{c.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:600,color:"#191815"}}>{c.name}</div>
                <div style={{fontSize:12,color:"#908C82",marginTop:2}}>{c.count} articles</div>
              </div>
              <span style={{color:"#C4C1BA",fontSize:18,flexShrink:0,fontWeight:300}}>›</span>
            </div>)}
          </div>
        </div>

        {/* Trending Searches */}
        <div>
          <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"#191815",paddingBottom:12}}>Tendances</h3>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {trending.map(t=><div key={t} onClick={()=>doSearch(t)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",background:"#fff",borderRadius:24,border:"1px solid #E8E6E1",cursor:"pointer",fontSize:13,fontWeight:500,color:"#5E5B53",boxShadow:"0 1px 3px rgba(0,0,0,.03)",transition:"all .15s"}}>
              <span style={{fontSize:11,color:"#6366F1"}}>🔥</span>{t}
            </div>)}
          </div>
        </div>
      </div>

      /* ── NORMAL HOME CONTENT ── */
      :<>

      {/* Commerce types */}
      <div style={{display:"flex",gap:6,padding:"0 20px 14px",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
        {types.map(t=><div key={t.id} onClick={()=>setSelType(t.id)} style={{padding:"8px 10px",borderRadius:12,border:selType===t.id?"2px solid #6366F1":"1px solid #E8E6E1",background:selType===t.id?"rgba(99,102,241,0.04)":"#fff",cursor:"pointer",flexShrink:0,textAlign:"center",minWidth:54,transition:"all .2s"}}>
          <div style={{fontSize:18}}>{t.icon}</div>
          <div style={{fontSize:9,fontWeight:600,color:selType===t.id?"#6366F1":"#908C82",marginTop:2}}>{t.name}</div>
        </div>)}
      </div>

      <div className="banner"><div className="banner-l"><h3>Soldes de Février</h3><p>Jusqu'à -40% sur tout le marketplace</p><span className="banner-btn" onClick={()=>go("flash")}>Voir les offres</span></div><span style={{fontSize:56}}>🛍️</span></div>

      {/* Restos à la une */}
      {(selType==="all"||selType==="restaurant")&&nearbyRestos.length>0&&<>
        <div className="sec"><h3>🍽️ Commander à manger</h3><span onClick={()=>go("restoList")}>Voir tout</span></div>
        <div className="marquee-wrap"><div className="marquee-track-resto">
          {[...nearbyRestos,...nearbyRestos].map((v,i)=><div key={v.id+"-"+i} style={{minWidth:170,padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,cursor:"pointer",flexShrink:0}} onClick={()=>go("vendor",v)}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{v.avatar}</div>
              <div><div style={{fontSize:12,fontWeight:700}}>{v.name}{v.verified&&<span style={{color:"#6366F1"}}> ✓</span>}</div><div style={{fontSize:10,color:"#908C82"}}>📍 {v.loc}</div></div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10}}><span>⭐ <b>{v.rating}</b></span><span style={{color:"#10B981",fontWeight:600}}>🕐 {v.eta}</span></div>
          </div>)}
        </div></div>
      </>}

      <div className="sec"><h3>Catégories</h3><span onClick={()=>go("cats")}>Voir tout</span></div>
      <div className="marquee-wrap"><div className="marquee-track">{[...CATS.filter(c=>selType==="all"||c.type===selType).slice(0,8),...CATS.filter(c=>selType==="all"||c.type===selType).slice(0,8)].map((c,i)=><div key={c.id+"-"+i} className={`cat ${i%CATS.length===selCat?"on":""}`} onClick={()=>setSC(i%CATS.length)}><span className="ci">{c.icon}</span><span className="cn">{c.name}</span></div>)}</div></div>

      <div className="sec"><h3>{selType==="all"?"Établissements proches":types.find(t=>t.id===selType)?.name+" proches"}</h3><span onClick={()=>go("nearby")}>Voir la carte</span></div>
      <div className="vlist">{filteredV.slice(0,4).map(v=><div key={v.id} className="vcard" onClick={()=>go("vendor",v)}><div className="vav">{v.avatar}</div><div className="vi"><h4>{v.name}{v.verified&&<span className="vf">✓</span>}</h4><div className="vloc">📍 {v.loc}{v.eta&&<span style={{marginLeft:8,color:"#10B981",fontWeight:600}}>🕐 {v.eta}</span>}</div><div className="vst">⭐ <b>{v.rating}</b> · {v.products} {v.type==="restaurant"?"plats":v.type==="service"?"services":"produits"}</div></div><span style={{color:"#908C82"}}>›</span></div>)}</div>

      <div className="sec"><h3>{selType==="all"?"Populaires":"Populaires en "+types.find(t=>t.id===selType)?.name}</h3><span onClick={()=>go("allProducts")}>Voir tout</span></div>
      <div className="pgrid">{filteredP.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><span className="pe">{p.img}</span>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}<span className="fav" onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"inherit",fontSize:isFav(p.id)?16:14}}>{isFav(p.id)?"❤️":"♡"}</span></div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}{p.eta&&<span style={{marginLeft:4,color:"#10B981",fontSize:10}}>🕐 {p.eta}</span>}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating} ({p.reviews})</div></div></div>)}</div>
      </>}
    </div>
  );
}

/* 5b ── RESTAURANT LIST ── */

export default HomeScr;
