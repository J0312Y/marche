import { useState, useEffect } from "react";
import Img from "../../components/Img";
import { useData } from "../../hooks";
import { useApp } from "../../context/AppContext";
import { SkeletonHome } from "../../components/Loading";
import PullToRefresh from "../../components/PullToRefresh";
import { triggerPush } from "../../components/PushBanner";
import { fmt, disc, getVendorPromo, totalDisc, effectivePrice } from "../../utils/helpers";

function HomeScr({go,favs,toggleFav,isFav,userName}){
  const { P, VENDORS, CATS, loading: dataLoading, reload } = useData();
  const { cartCount, recentlyViewed, seenStories, markStorySeen } = useApp();
  const [selCat,setSC]=useState(0);
  const [selType,setSelType]=useState("all");
  const [storyViewer,setStoryViewer]=useState(null);
  const [homeQ,setHomeQ]=useState("");
  const [searchFocused,setSearchFocused]=useState(false);
  const [recentSearches,setRecent]=useState(["Poulet DG","Smartphone","Doliprane","Pressing","Robe Wax","Croissants"]);
  const [showFilter,setShowFilter]=useState(false);
  const [filterType,setFilterType]=useState("all");
  const [filterSort,setFilterSort]=useState("popular");
  const [loading,setLoading]=useState(true);
  const [pushSent,setPushSent]=useState(false);
  const [promoSlide,setPromoSlide]=useState(0);
  const promos=[{title:"Soldes de Mars",sub:"Jusqu'à -40% sur tout",img:"https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=300&fit=crop",action:"flash"},{title:"Livraison gratuite",sub:"Dès 15 000 FCFA d'achat",img:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=300&fit=crop",action:"search"},{title:"Mode Africaine",sub:"Découvrez les tendances Wax",img:"https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&h=300&fit=crop",action:"cats"}];
  const [dealTimer,setDealTimer]=useState({h:5,m:12,s:45});

  useEffect(()=>{const t=setTimeout(()=>setLoading(false),800);return()=>clearTimeout(t)},[]);
  useEffect(()=>{const iv=setInterval(()=>setPromoSlide(p=>(p+1)%3),4000);return()=>clearInterval(iv)},[]);
  useEffect(()=>{const iv=setInterval(()=>{setDealTimer(p=>{let{h,m,s}=p;s--;if(s<0){s=59;m--}if(m<0){m=59;h--}if(h<0)return{h:0,m:0,s:0};return{h,m,s}})},1000);return()=>clearInterval(iv)},[]);
  useEffect(()=>{if(!loading&&!pushSent){const t=setTimeout(()=>{triggerPush({icon:'📦',title:'Commande en route !',body:'Votre commande #LMK-2026-0214 est en livraison — Patrick arrive dans 15 min',onTap:()=>go('orders')});setPushSent(true)},5000);return()=>clearTimeout(t)}},[loading,pushSent]);

  if(dataLoading || P.length===0) return <div className="scr"><SkeletonHome/></div>;

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

  return(<>
    <PullToRefresh onRefresh={reload}><div className="scr">
      {/* Header - only show when not in search */}
      {!inSearchMode&&<div className="hdr"><div><div className="hdr-t">Bonjour{userName?" "+userName:""} 👋</div><div className="hdr-h">Lamuka Market</div></div>
        <div className="hdr-r"><div className="hdr-btn" onClick={()=>go("notif")}>🔔<div className="notif-badge"/></div><div className="hdr-btn" onClick={()=>go("cart")} style={{position:"relative"}}>🛍️{cartCount>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#EF4444",color:"var(--card)",fontSize:9,fontWeight:700,borderRadius:10,padding:"1px 5px",minWidth:16,textAlign:"center"}}>{cartCount}</span>}</div></div></div>}

      {/* Search bar */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:inSearchMode?"14px 16px 10px":"0 16px 12px",marginTop:inSearchMode?0:10}}>
        {inSearchMode&&<button onClick={exitSearch} style={{width:38,height:38,borderRadius:12,border:"none",background:"var(--light)",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"var(--text)",fontFamily:"inherit"}}>←</button>}
        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:inSearchMode?"10px 16px":"9px 14px",background:"var(--card)",borderRadius:24,border:"1px solid var(--border)",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
          <span style={{color:"var(--muted)",fontSize:13,flexShrink:0}}>🔍</span>
          <input value={homeQ} onChange={e=>setHomeQ(e.target.value)} onFocus={()=>setSearchFocused(true)} placeholder="Rechercher produits, restos..." style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13,fontFamily:"inherit",color:"var(--text)"}}/>
          {homeQ&&<span style={{cursor:"pointer",color:"var(--muted)",fontSize:12,flexShrink:0}} onClick={()=>setHomeQ("")}>✕</span>}
        </div>
        <button onClick={()=>setShowFilter(!showFilter)} style={{width:38,height:38,borderRadius:12,border:"none",background:showFilter?"#F97316":"var(--light)",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
          <span style={{filter:showFilter?"brightness(10)":"none"}}>⚙️</span>
        </button>
      </div>

      {/* Filter panel */}
      {showFilter&&<div style={{margin:"0 16px 12px",padding:16,background:"var(--card)",borderRadius:18,border:"1px solid var(--border)",boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h4 style={{fontSize:14,fontWeight:700}}>Filtres</h4>
          <span style={{fontSize:12,color:"#F97316",fontWeight:600,cursor:"pointer"}} onClick={()=>{setFilterType("all");setFilterSort("popular")}}>Réinitialiser</span>
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"var(--muted)",marginBottom:8}}>Type de commerce</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {types.map(t=><div key={t.id} onClick={()=>setFilterType(t.id)} style={{padding:"6px 12px",borderRadius:20,border:filterType===t.id?"2px solid #F97316":"1px solid var(--border)",background:filterType===t.id?"rgba(249,115,22,0.06)":"var(--card)",cursor:"pointer",fontSize:11,fontWeight:600,color:filterType===t.id?"#F97316":"var(--sub)"}}>{t.icon} {t.name}</div>)}
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"var(--muted)",marginBottom:8}}>Trier par</div>
        <div style={{display:"flex",gap:6}}>
          {[["popular","🔥 Populaires"],["rating","⭐ Mieux notés"],["price","💰 Prix ↑"]].map(([k,l])=><div key={k} onClick={()=>setFilterSort(k)} style={{padding:"6px 12px",borderRadius:20,border:filterSort===k?"2px solid #F97316":"1px solid var(--border)",background:filterSort===k?"rgba(249,115,22,0.06)":"var(--card)",cursor:"pointer",fontSize:11,fontWeight:600,color:filterSort===k?"#F97316":"var(--sub)"}}>{l}</div>)}
        </div>
      </div>}

      {/* ── SEARCH RESULTS MODE ── */}
      {searchResults?<div style={{padding:"0 16px 20px"}}>
        <div style={{fontSize:12,color:"var(--muted)",padding:"4px 0 12px",fontWeight:500}}>{searchResults.length} résultat{searchResults.length!==1?"s":""} pour « {homeQ} »</div>
        {searchResults.length>0?<div className="pgrid" style={{padding:0}}>{searchResults.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag">{p.tags[0]}</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating}</div></div></div>)}</div>
        :<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:40,marginBottom:10}}>🔍</div><div style={{fontSize:14,fontWeight:600}}>Aucun résultat</div><div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Essayez un autre terme</div></div>}
      </div>

      /* ── DISCOVERY MODE (focused, no query) ── */
      :searchFocused&&!homeQ?<div style={{padding:"0 16px 20px"}}>

        {/* Recent Searches */}
        {recentSearches.length>0&&<div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0 12px"}}>
            <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"var(--text)"}}>Recherches récentes</h3>
            <span style={{fontSize:13,color:"#F97316",fontWeight:600,cursor:"pointer"}} onClick={()=>setRecent([])}>Effacer</span>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {recentSearches.map(s=><div key={s} onClick={()=>doSearch(s)} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 16px",background:"var(--light)",borderRadius:24,cursor:"pointer",fontSize:13,fontWeight:500,color:"var(--sub)",transition:"all .15s"}}>
              <span style={{fontSize:11,color:"var(--muted)"}}>🕐</span>{s}
            </div>)}
          </div>
        </div>}

        {/* Popular Categories */}
        <div style={{marginBottom:24}}>
                <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"var(--text)",paddingBottom:12}}>Catégories populaires</h3>
          <div style={{background:"var(--card)",borderRadius:18,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.04)"}}>
            {CATS.map((c,i)=><div key={c.id} onClick={()=>doSearch(c.name)} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",cursor:"pointer",borderBottom:i<CATS.length-1?"1px solid var(--border)":"none",transition:"background .12s"}}>
              <div style={{width:48,height:48,borderRadius:12,overflow:"hidden",flexShrink:0,background:"var(--border)"}}>
                {c.photo?<img src={c.photo} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{c.icon}</div>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:600,color:"var(--text)"}}>{c.name}</div>
                <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{c.count} articles</div>
              </div>
              <span style={{color:"var(--muted)",fontSize:18,flexShrink:0,fontWeight:300}}>›</span>
            </div>)}
          </div>
        </div>

        {/* Trending Searches */}
        <div>
          <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"var(--text)",paddingBottom:12}}>Tendances</h3>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {trending.map(t=><div key={t} onClick={()=>doSearch(t)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",background:"var(--card)",borderRadius:24,border:"1px solid var(--border)",cursor:"pointer",fontSize:13,fontWeight:500,color:"var(--sub)",boxShadow:"0 1px 3px rgba(0,0,0,.03)",transition:"all .15s"}}>
              <span style={{fontSize:11,color:"#F97316"}}>🔥</span>{t}
            </div>)}
          </div>
        </div>
      </div>

      /* ── NORMAL HOME CONTENT ── */
      :<>

      {/* Promo carousel */}
      <div style={{position:"relative",margin:"0 16px 14px",height:140,borderRadius:16,overflow:"hidden"}}>
          {promos.map((pr,i)=>(
            <div key={i} onClick={()=>go(pr.action)} style={{position:"absolute",inset:0,borderRadius:16,overflow:"hidden",cursor:"pointer",opacity:promoSlide===i?1:0,transform:promoSlide===i?"translateX(0)":"translateX(40px)",transition:"all .5s ease",pointerEvents:promoSlide===i?"auto":"none"}}>
              <img src={pr.img} alt={pr.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(0,0,0,.65) 0%,rgba(0,0,0,.2) 60%,transparent 100%)"}}/>
              <div style={{position:"absolute",top:0,left:0,bottom:0,padding:18,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:4,textShadow:"0 2px 8px rgba(0,0,0,.3)"}}>{pr.title}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.85)",marginBottom:10}}>{pr.sub}</div>
                <div style={{padding:"6px 18px",borderRadius:10,background:"#F97316",color:"#fff",fontSize:11,fontWeight:700,width:"fit-content"}}>Voir les offres</div>
              </div>
            </div>
          ))}
          <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>{promos.map((_,i)=><div key={i} onClick={(e)=>{e.stopPropagation();setPromoSlide(i)}} style={{width:promoSlide===i?20:6,height:6,borderRadius:3,background:promoSlide===i?"#fff":"rgba(255,255,255,.4)",cursor:"pointer",transition:"all .3s"}}/>)}</div>
      </div>

      {/* ⭐ Produit du jour */}
      {P[0]&&<div onClick={()=>go("detail",P[0])} style={{margin:"0 16px 14px",padding:14,background:"var(--card)",border:"2px solid #F59E0B",borderRadius:18,cursor:"pointer",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:0,padding:"4px 12px 4px 16px",background:"#F59E0B",borderRadius:"0 0 0 14px",color:"#fff",fontSize:10,fontWeight:800}}>⭐ PRODUIT DU JOUR</div>
          <div style={{display:"flex",gap:12,marginTop:6}}>
            <div style={{width:80,height:80,borderRadius:14,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}><Img src={P[0].photo} emoji={P[0].img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:2,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{P[0].name}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:6}}>{P[0].vendor}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16,fontWeight:800,color:"#F97316"}}>{fmt(P[0].price)}</span>
                {P[0].old&&<span style={{fontSize:11,color:"var(--muted)",textDecoration:"line-through"}}>{fmt(P[0].old)}</span>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0}}>
              {[["h",dealTimer.h],["m",dealTimer.m],["s",dealTimer.s]].map(([l,v])=><div key={l} style={{width:28,height:26,borderRadius:6,background:"#EF4444",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>{String(v).padStart(2,"0")}</div>)}
            </div>
          </div>
      </div>}

      {/* 🎯 Recommandations personnalisées */}
      <div style={{padding:"0 16px"}}>
        <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"var(--text)",paddingBottom:12}}>🎯 Pour vous</h3>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none",paddingBottom:14,paddingLeft:16,paddingRight:16,WebkitOverflowScrolling:"touch"}}>
          {P.slice(2,10).map(p=>(
            <div key={p.id} onClick={()=>go("detail",p)} style={{minWidth:105,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden",cursor:"pointer",flexShrink:0}}>
              <div style={{height:75,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center"}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
              <div style={{padding:"5px 7px"}}>
                <div style={{fontSize:10,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div>
                <div style={{fontSize:11,fontWeight:700,color:"#F97316",marginTop:1}}>{fmt(p.price)}</div>
              </div>
            </div>
          ))}
      </div>

      {/* ═══ STORIES ═══ */}
      <div style={{display:"flex",gap:12,padding:"0 16px 10px",overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
        {[...VENDORS.filter(v=>v.verified)].sort((a,b)=>{
          const aSeen=seenStories.includes(a.id);const bSeen=seenStories.includes(b.id);
          if(aSeen&&!bSeen)return 1;if(!aSeen&&bSeen)return -1;return 0;
        }).slice(0,6).map((v,i)=>{
          const seen=seenStories.includes(v.id);
          return(<div key={"story-"+v.id} onClick={()=>{markStorySeen(v.id);setStoryViewer({vendor:v,index:i})}} style={{flexShrink:0,textAlign:"center",cursor:"pointer",width:60}}>
            <div style={{width:52,height:52,borderRadius:16,padding:2,background:seen?"var(--border)":"linear-gradient(135deg,#F97316,#FB923C,#F59E0B)",margin:"0 auto 4px",opacity:seen?.5:1,transition:"opacity .3s"}}>
              <div style={{width:"100%",height:"100%",borderRadius:14,overflow:"hidden",border:"2px solid var(--bg)"}}>
                {v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{width:"100%",height:"100%",background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{v.avatar}</div>}
              </div>
            </div>
            <div style={{fontSize:9,fontWeight:seen?500:600,color:seen?"var(--muted)":"var(--text)",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{v.name.split(" ")[0]}</div>
          </div>);
        })}
      </div>


      {/* Group Buy promo */}
      <div onClick={()=>go("groupBuy")} style={{margin:"0 16px 14px",padding:12,background:"linear-gradient(135deg,rgba(249,115,22,0.06),rgba(251,146,60,0.06))",border:"1px solid rgba(249,115,22,0.12)",borderRadius:14,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
        <div style={{width:38,height:38,borderRadius:12,background:"#F97316",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🤝</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>Achats groupés — Jusqu'à -30%</div><div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>3 offres en cours · Rejoignez un groupe</div></div>
        <span style={{color:"#F97316",fontSize:16}}>›</span>
      </div>

      {/* Restos à la une */}
      {(selType==="all"||selType==="restaurant")&&nearbyRestos.length>0&&<>
        <div className="sec"><h3>🍽️ Commander à manger</h3><span onClick={()=>go("restoList")}>Voir tout</span></div>
        <div className="marquee-wrap"><div className="marquee-track-resto">
          {[...nearbyRestos,...nearbyRestos].map((v,i)=><div key={v.id+"-"+i} style={{minWidth:170,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,cursor:"pointer",flexShrink:0}} onClick={()=>go("vendor",v)}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:36,height:36,borderRadius:10,overflow:"hidden",background:"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:v.avatar}</div>
              <div><div style={{fontSize:12,fontWeight:700}}>{v.name}{v.verified&&<span style={{color:"#F97316"}}> ✓</span>}</div><div style={{fontSize:10,color:"var(--muted)"}}>📍 {v.loc}</div></div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10}}><span>⭐ <b>{v.rating}</b></span><span style={{color:"#F97316",fontWeight:600}}>🕐 {v.eta}</span></div>
          </div>)}
        </div></div>
      </>}

      <div className="sec"><h3>{selType==="all"?"Établissements proches":types.find(t=>t.id===selType)?.name+" proches"}</h3><span onClick={()=>go("nearby")}>Voir la carte</span></div>
      <div className="vlist">{filteredV.slice(0,4).map(v=><div key={v.id} className="vcard" onClick={()=>go("vendor",v)}><div className="vav" style={v.logo?{overflow:"hidden",padding:0}:{}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:v.avatar}</div><div className="vi"><h4>{v.name}{v.verified&&<span className="vf">✓</span>}</h4><div className="vloc">📍 {v.loc}{v.eta&&<span style={{marginLeft:8,color:"#F97316",fontWeight:600}}>🕐 {v.eta}</span>}</div><div className="vst">⭐ <b>{v.rating}</b> · {v.products} {v.type==="restaurant"?"plats":v.type==="service"?"services":"produits"}</div></div><span style={{color:"var(--muted)"}}>›</span></div>)}</div>


      {/* ═══ RECENTLY VIEWED ═══ */}
      {recentlyViewed.length>0&&<>
        <div className="sec"><h3>🕐 Récemment consultés</h3></div>
        <div style={{display:"flex",gap:8,padding:"0 16px 14px",overflowX:"auto",scrollbarWidth:"none"}}>
          {recentlyViewed.slice(0,6).map(p=><div key={"rv-"+p.id} onClick={()=>go("detail",p)} style={{flexShrink:0,width:100,cursor:"pointer"}}>
            <div style={{width:100,height:80,borderRadius:12,overflow:"hidden",background:"var(--light)",marginBottom:4}}>
              <Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>
            </div>
            <div style={{fontSize:10,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div>
            <div style={{fontSize:10,fontWeight:700,color:"#F97316"}}>{fmt(p.price)}</div>
          </div>)}
        </div>
      </>}



      <div className="sec"><h3>{selType==="all"?"Populaires":"Populaires en "+types.find(t=>t.id===selType)?.name}</h3><span onClick={()=>go("allProducts")}>Voir tout</span></div>
      <div className="pgrid">{filteredP.map(p=>{const vp=getVendorPromo(p,VENDORS);const td=totalDisc(p,VENDORS);return(<div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>{p.old&&<span className="badge">-{disc(p)}%</span>}{vp&&<span className="tag" style={{background:"#F59E0B",color:"#fff"}}>🏷️ {vp.promoName}</span>}{!vp&&p.tags[0]&&<span className="tag">{p.tags[0]}</span>}<span className="fav" onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"var(--muted)",fontSize:14}}>{isFav(p.id)?"♥":"♡"}</span></div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}{p.eta&&<span style={{marginLeft:4,color:"#F97316",fontSize:10}}>🕐 {p.eta}</span>}</div><div className="pp">{vp?<><span style={{color:"#F97316"}}>{fmt(vp.promoPrice)}</span><span className="po">{fmt(p.price)}</span></>:<>{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating} ({p.reviews})</div></div></div>)})}</div>
      </>}
    </div></PullToRefresh>

    {/* ═══ STORY VIEWER ═══ */}
    {storyViewer&&(()=>{
      const storyVendors=[...VENDORS.filter(v=>v.verified)].sort((a,b)=>{
        const aSeen=seenStories.includes(a.id);const bSeen=seenStories.includes(b.id);
        if(aSeen&&!bSeen)return 1;if(!aSeen&&bSeen)return -1;return 0;
      }).slice(0,6);
      const sv=storyViewer.vendor;
      const promoText=sv.promo?`🏷️ ${sv.promo.name} · -${sv.promo.discount}% jusqu'au ${sv.promo.ends}`:`⭐ ${sv.rating}/5 · ${sv.products} articles · ${sv.followers} abonnés`;
      return(<div style={{position:"absolute",inset:0,background:"#000",zIndex:200,display:"flex",flexDirection:"column",borderRadius:"inherit",overflow:"hidden"}}>
        {/* Progress bars */}
        <div style={{display:"flex",gap:3,padding:"8px 12px",zIndex:10}}>
          {storyVendors.map((v,i)=><div key={v.id} style={{flex:1,height:2,borderRadius:1,background:"rgba(255,255,255,.25)",overflow:"hidden"}}>
            <div style={{height:"100%",background:"var(--card)",width:i<storyViewer.index?"100%":i===storyViewer.index?"100%":"0%",borderRadius:1}}/>
          </div>)}
        </div>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"4px 14px 10px",zIndex:10}}>
          <div style={{width:36,height:36,borderRadius:12,overflow:"hidden",border:"2px solid #fff"}}>
            {sv.logo?<img src={sv.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{width:"100%",height:"100%",background:"#333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{sv.avatar}</div>}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{sv.name} {sv.verified&&<span style={{color:"#F97316"}}>✓</span>}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Il y a {storyViewer.index+1}h · 📍 {sv.loc}</div>
          </div>
          <button onClick={()=>setStoryViewer(null)} style={{width:32,height:32,borderRadius:10,background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* Image */}
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          {sv.cover?<img src={sv.cover} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#F97316,#FB923C)"}}/>}
          <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 50%,rgba(0,0,0,.7))"}}/>
          {/* Text overlay */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:20}}>
            <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:6}}>{sv.name}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.85)",lineHeight:1.5,marginBottom:4}}>{sv.desc}</div>
            <div style={{fontSize:12,color:"#F59E0B",fontWeight:600}}>{promoText}</div>
          </div>
          {/* Tap zones */}
          <div onClick={()=>{const idx=storyViewer.index-1;if(idx>=0){markStorySeen(storyVendors[idx].id);setStoryViewer({vendor:storyVendors[idx],index:idx})}else setStoryViewer(null)}} style={{position:"absolute",left:0,top:0,bottom:0,width:"30%",cursor:"pointer"}}/>
          <div onClick={()=>{const idx=storyViewer.index+1;if(idx<storyVendors.length){markStorySeen(storyVendors[idx].id);setStoryViewer({vendor:storyVendors[idx],index:idx})}else setStoryViewer(null)}} style={{position:"absolute",right:0,top:0,bottom:0,width:"30%",cursor:"pointer"}}/>
        </div>
        {/* Bottom button */}
        <div style={{padding:"12px 16px 20px",display:"flex",gap:10}}>
          <button onClick={()=>{setStoryViewer(null);go("vendor",sv)}} style={{flex:1,padding:14,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🏪 Voir la boutique</button>
          <button onClick={()=>{setStoryViewer(null);go("chatVendor",sv)}} style={{width:50,borderRadius:14,border:"1px solid rgba(255,255,255,.2)",background:"transparent",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>💬</button>
        </div>
      </div>);
    })()}
  </>);
}

/* 5b ── RESTAURANT LIST ── */

export default HomeScr;
