import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import SkeletonCard, { SkeletonRow, SkeletonSectionHeader } from "../../components/SkeletonCard";
import GuestBanner from "../../components/GuestBanner";
import StoriesCarousel from "../../components/StoriesCarousel";
import Img from "../../components/Img";
import { useData } from "../../hooks";
import { useApp } from "../../context/AppContext";
import { SkeletonHome } from "../../components/Loading";
import PullToRefresh from "../../components/PullToRefresh";
import { triggerPush } from "../../components/PushBanner";
import t from "../../utils/i18n";
import { fmt, disc, getVendorPromo, totalDisc, effectivePrice } from "../../utils/helpers";

function HomeScr({go,favs,toggleFav,isFav,userName}){
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 600); return () => clearTimeout(t); }, []);
  const { P, VENDORS, CATS, loading: dataLoading, reload } = useData();
  const { cartCount, lang, recentlyViewed } = useApp();
  const [selCat,setSC]=useState(0);
  const [selType,setSelType]=useState("all");
  const [homeQ,setHomeQ]=useState("");
  const [imgSearching,setImgSearching]=useState(false);
  const [favAnim,setFavAnim]=useState(null);
  const [imgResults,setImgResults]=useState(null);
  const [imgPreview,setImgPreview]=useState(null);
  const [showCamMenu,setShowCamMenu]=useState(false);
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
  useEffect(()=>{if(!loading&&!pushSent){const t=setTimeout(()=>{triggerPush({icon:'package',title:'Commande en route !',body:'Votre commande #LMK-2026-0214 est en livraison — Patrick arrive dans 15 min',onTap:()=>go('orders')});setPushSent(true)},5000);return()=>clearTimeout(t)}},[loading,pushSent]);

  if(dataLoading || P.length===0) return <div className="scr"><SkeletonHome/></div>;

  const trending=["iPhone","Samsung","Wax","Pâtisserie","Braisé","Pharmacie","Livraison","Promo"];
  const types=[{id:"all",svg:"home",name:"Tout"},{id:"restaurant",svg:"utensils",name:"Restos"},{id:"patisserie",svg:"cupcake",name:"Pâtisseries"},{id:"supermarche",svg:"cart",name:"Courses"},{id:"pharmacie",svg:"pill",name:"Pharma"},{id:"boutique",svg:"store",name:"Boutiques"},{id:"service",svg:"tool",name:"Services"}];
  const typeFilter=filterType!=="all"?filterType:selType;
  const filteredP=typeFilter==="all"?P:P.filter(p=>p.type===typeFilter);
  const filteredV=typeFilter==="all"?VENDORS:VENDORS.filter(v=>v.type===typeFilter);
  const sortedP=[...filteredP].sort((a,b)=>filterSort==="price"?a.price-b.price:filterSort==="rating"?b.rating-a.rating:b.reviews-a.reviews);
  const nearbyRestos=VENDORS.filter(v=>v.type==="restaurant");

  const handleImgSearch=(file)=>{
    const r=new FileReader();
    r.onload=()=>{
      setImgPreview(r.result);setImgSearching(true);setSearchFocused(true);
      setTimeout(()=>{
        setImgResults(P.slice(0,6).map(p=>({...p,match:Math.floor(Math.random()*20)+80})).sort((a,b)=>b.match-a.match));
        setImgSearching(false);
      },1500);
    };
    r.readAsDataURL(file);
  };
  const clearImgSearch=()=>{setImgPreview(null);setImgResults(null);setImgSearching(false)};
  const doSearch=(term)=>{setHomeQ(term);if(!recentSearches.includes(term))setRecent(r=>[term,...r].slice(0,6))};
  const exitSearch=()=>{setHomeQ("");setSearchFocused(false);clearImgSearch();setShowCamMenu(false)};

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
      {!inSearchMode&&<div className="hdr"><div><div className="hdr-t">{t("home.hello")}{userName?" "+userName:""} </div><div className="hdr-h">Lamuka Market</div></div>
        <div className="hdr-r"><div className="hdr-btn" onClick={()=>go("notif")} style={{position:"relative"}}><Icon name="bell" size={20}/><div className="notif-badge"/></div><div className="hdr-btn" onClick={()=>go("cart")} style={{position:"relative"}}><Icon name="cart" size={20}/>{cartCount>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#EF4444",color:"var(--card)",fontSize:9,fontWeight:700,borderRadius:10,padding:"1px 5px",minWidth:16,textAlign:"center"}}>{cartCount}</span>}</div></div></div>}

      {/* Search bar */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:inSearchMode?"14px 6px 10px":"0 6px 12px",marginTop:inSearchMode?0:10}}>
        {inSearchMode&&<button onClick={exitSearch} style={{width:38,height:38,borderRadius:12,border:"none",background:"var(--light)",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"var(--text)",fontFamily:"inherit"}}>←</button>}
        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:inSearchMode?"10px 16px":"9px 14px",background:"var(--card)",borderRadius:24,border:"1px solid var(--border)",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
          <span style={{color:"var(--muted)",fontSize:13,flexShrink:0}}></span>
          <input value={homeQ} onChange={e=>setHomeQ(e.target.value)} onFocus={()=>setSearchFocused(true)} placeholder={t("home.search_placeholder")} style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13,fontFamily:"inherit",color:"var(--text)"}}/>
          {homeQ&&<span style={{cursor:"pointer",color:"var(--muted)",fontSize:12,flexShrink:0}} onClick={()=>setHomeQ("")}></span>}
          {!homeQ&&<span style={{cursor:"pointer",flexShrink:0,opacity:.6,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowCamMenu(true)}><Icon name="camera" size={18}/></span>}
        </div>
        <button onClick={()=>setShowFilter(!showFilter)} style={{width:38,height:38,borderRadius:12,border:"none",background:showFilter?"#F97316":(filterType!=="all"||filterSort!=="popular")?"rgba(249,115,22,0.1)":"var(--light)",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s",position:"relative"}}>
          <Icon name="filter" size={18} color={showFilter?"#fff":"var(--text)"}/>
          {(filterType!=="all"||filterSort!=="popular")&&!showFilter&&<div style={{position:"absolute",top:2,right:2,width:8,height:8,borderRadius:4,background:"#EF4444"}}/>}
        </button>
      </div>


      {/* Promos rapide */}
      <div style={{padding:"4px 6px 10px"}}>
        <div onClick={()=>go("promos")} className="mes-promos-pill" style={{padding:"10px 12px",background:"linear-gradient(135deg,rgba(249,115,22,0.08),rgba(236,72,153,0.08))",border:"1px solid rgba(249,115,22,0.2)",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:22}}><Icon name="gift" size={18}/></div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700}}>Vous avez 3 promos perso <Icon name="sparkle" size={16}/></div>
            <div style={{fontSize:10,color:"var(--muted)"}}>Codes BIRTHDAY2026, JOELDY10, WELCOMEBACK...</div>
          </div>
          <span style={{color:"#F97316",fontSize:16}}>›</span>
        </div>
      </div>

      {/* Stories carousel */}
      <StoriesCarousel vendors={VENDORS} go={go} />

      {/* Active filter indicator */}
      {!showFilter&&(filterType!=="all"||filterSort!=="popular")&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"0 6px 8px"}}>
        <span style={{fontSize:11,color:"var(--muted)"}}>Filtres :</span>
        {filterType!=="all"&&<span onClick={()=>{setFilterType("all");setSelType("all")}} style={{padding:"3px 8px",borderRadius:6,background:"rgba(249,115,22,0.08)",color:"#F97316",fontSize:10,fontWeight:600,cursor:"pointer"}}><Icon name={types.find(t=>t.id===filterType)?.icon} size={14}/> {types.find(t=>t.id===filterType)?.name} </span>}
        {filterSort!=="popular"&&<span onClick={()=>setFilterSort("popular")} style={{padding:"3px 8px",borderRadius:6,background:"rgba(59,130,246,0.08)",color:"#3B82F6",fontSize:10,fontWeight:600,cursor:"pointer"}}>{filterSort==="rating"?"Notés":"Prix"} </span>}
      </div>}

      {/* Hidden file inputs for image search */}
      <input id="cam-take" type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){handleImgSearch(f);setShowCamMenu(false)}}}/>
      <input id="cam-gallery" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){handleImgSearch(f);setShowCamMenu(false)}}}/>

      {/* Camera choice popup */}
      {showCamMenu&&<div onClick={()=>setShowCamMenu(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:120,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:16}}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:360,background:"var(--card)",borderRadius:20,padding:8,paddingBottom:12}}>
          <div style={{textAlign:"center",padding:"10px 0 8px",fontSize:14,fontWeight:700}}>Rechercher un produit</div>
          <div onClick={()=>document.getElementById("cam-take")?.click()} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",borderRadius:12}}>
            <span style={{display:"flex",alignItems:"center",justifyContent:"center",width:24}}><Icon name="camera" size={20}/></span><span style={{fontSize:14,fontWeight:500}}>Prendre une photo</span>
          </div>
          <div onClick={()=>{setShowCamMenu(false);go("qrScan")}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",borderRadius:12}}>
            <span style={{display:"flex",alignItems:"center",justifyContent:"center",width:24}}><Icon name="qr_code" size={20}/></span><span style={{fontSize:14,fontWeight:500}}>Scanner code QR / code-barres</span>
          </div>
          <div onClick={()=>document.getElementById("cam-gallery")?.click()} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",borderRadius:12}}>
            <span style={{display:"flex",alignItems:"center",justifyContent:"center",width:24}}><Icon name="image" size={20}/></span><span style={{fontSize:14,fontWeight:500}}>Choisir dans la galerie</span>
          </div>
          <div onClick={()=>setShowCamMenu(false)} style={{textAlign:"center",padding:"10px 0",fontSize:13,fontWeight:600,color:"var(--muted)",cursor:"pointer",marginTop:4,borderTop:"1px solid var(--border)"}}>Annuler</div>
        </div>
      </div>}

      {showFilter&&<div style={{margin:"0 6px 12px",padding:16,background:"var(--card)",borderRadius:18,border:"1px solid var(--border)",boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h4 style={{fontSize:14,fontWeight:700}}>Filtres</h4>
          <span style={{fontSize:12,color:"#F97316",fontWeight:600,cursor:"pointer"}} onClick={()=>{setFilterType("all");setFilterSort("popular");setSelType("all")}}>Réinitialiser</span>
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"var(--muted)",marginBottom:8}}>Type de commerce</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {types.map(t=><div key={t.id} onClick={()=>{setFilterType(t.id);setSelType(t.id);setShowFilter(false)}} style={{padding:"6px 12px",borderRadius:20,border:filterType===t.id?"2px solid #F97316":"1px solid var(--border)",background:filterType===t.id?"rgba(249,115,22,0.06)":"var(--card)",cursor:"pointer",fontSize:11,fontWeight:600,color:filterType===t.id?"#F97316":"var(--sub)",display:"inline-flex",alignItems:"center",gap:5}}><Icon name={t.svg} size={12} color={filterType===t.id?"#F97316":"var(--sub)"}/> {t.name}</div>)}
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"var(--muted)",marginBottom:8}}>Trier par</div>
        <div style={{display:"flex",gap:6}}>
          {[["popular","Populaires"],["rating","Mieux notés"],["price","Prix ↑"]].map(([k,l])=><div key={k} onClick={()=>{setFilterSort(k);setShowFilter(false)}} style={{padding:"6px 12px",borderRadius:20,border:filterSort===k?"2px solid #F97316":"1px solid var(--border)",background:filterSort===k?"rgba(249,115,22,0.06)":"var(--card)",cursor:"pointer",fontSize:11,fontWeight:600,color:filterSort===k?"#F97316":"var(--sub)"}}>{l}</div>)}
        </div>
      </div>}

      {/* ── SEARCH RESULTS MODE ── */}
      {imgPreview?<div style={{padding:"0 16px 20px"}}>
        <div style={{position:"relative",marginBottom:12}}>
          <img src={imgPreview} style={{width:"100%",height:140,objectFit:"cover",objectPosition:"center",borderRadius:14}} alt=""/>
          {imgSearching&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
            <div style={{width:28,height:28,border:"3px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
            <div style={{color:"#fff",fontSize:11,fontWeight:600,marginTop:6}}>Recherche en cours...</div>
          </div>}
          <button onClick={clearImgSearch} style={{position:"absolute",top:6,right:6,width:24,height:24,borderRadius:8,border:"none",background:"rgba(0,0,0,.5)",color:"#fff",fontSize:12,cursor:"pointer"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        {imgResults&&<>
          <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>{imgResults.length} produits similaires</div>
          {imgResults.map(p=>(
            <div key={p.id} onClick={()=>go("detail",p)} style={{display:"flex",gap:10,padding:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,marginBottom:6,cursor:"pointer"}}>
              <div style={{width:50,height:50,borderRadius:8,overflow:"hidden",flexShrink:0,background:"var(--light)"}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600}}>{p.name}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#F97316",marginTop:2}}>{fmt(p.price)}</div>
              </div>
              <span style={{fontSize:10,padding:"2px 6px",borderRadius:6,background:"rgba(16,185,129,0.08)",color:"#10B981",fontWeight:700,height:"fit-content"}}>{p.match}%</span>
            </div>
          ))}
        </>}
      </div>
      :searchResults?<div style={{padding:"0 16px 20px"}}>
        <div style={{fontSize:12,color:"var(--muted)",padding:"4px 0 12px",fontWeight:500}}>{searchResults.length} résultat{searchResults.length!==1?"s":""} pour « {homeQ} »</div>
        {searchResults.length>0?<div className="pgrid" style={{padding:0}}>{searchResults.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} fit="cover"/>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag">{p.tags[0]}</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}><Icon name="star_full" size={16}/>{" "}{p.rating}</div></div></div>)}</div>
        :<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:40,marginBottom:10}}></div><div style={{fontSize:14,fontWeight:600}}>Aucun résultat</div><div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Essayez un autre terme</div></div>}
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
              <span style={{fontSize:11,color:"var(--muted)"}}></span>{s}
            </div>)}
          </div>
        </div>}

        {/* Popular Categories */}
        <div style={{marginBottom:24}}>
                <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"var(--text)",paddingBottom:12}}>Catégories populaires</h3>
          <div style={{background:"var(--card)",borderRadius:18,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.04)"}}>
            {CATS.map((c,i)=><div key={c.id} onClick={()=>doSearch(c.name)} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",cursor:"pointer",borderBottom:i<CATS.length-1?"1px solid var(--border)":"none",transition:"background .12s"}}>
              <div style={{width:48,height:48,borderRadius:12,overflow:"hidden",flexShrink:0,background:"var(--border)"}}>
                <img src={c.photo} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
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
              <span style={{fontSize:11,color:"#F97316"}}><Icon name="fire" size={18}/></span>{t}
            </div>)}
          </div>
        </div>
      </div>

      /* ── NORMAL HOME CONTENT ── */
      :<>

      {/* Promo carousel */}
      <div style={{position:"relative",margin:"0 6px 14px",height:140,borderRadius:16,overflow:"hidden"}}>
          {promos.map((pr,i)=>(
            <div key={i} onClick={()=>go(pr.action)} style={{position:"absolute",inset:0,borderRadius:16,overflow:"hidden",cursor:"pointer",opacity:promoSlide===i?1:0,transform:promoSlide===i?"translateX(0)":"translateX(40px)",transition:"all .5s ease",pointerEvents:promoSlide===i?"auto":"none"}}>
              <img src={pr.img} alt={pr.title} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
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

      {/*  LIVE EN COURS */}
      <div onClick={()=>go("liveWatch",{vendor:{name:"Mode Afrique",avatar:""},products:P.filter(x=>x.vendor==="Mode Afrique").slice(0,4)})} style={{margin:"0 6px 14px",padding:12,background:"linear-gradient(135deg,rgba(239,68,68,0.06),rgba(249,115,22,0.06))",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#EF4444,#F97316)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
          <span style={{fontSize:22}}></span>
          <div style={{position:"absolute",top:-3,right:-3,width:12,height:12,borderRadius:6,background:"#EF4444",border:"2px solid var(--bg)",animation:"pulse 1.5s infinite"}}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{padding:"2px 6px",borderRadius:4,background:"#EF4444",color:"#fff",fontSize:8,fontWeight:800}}><Icon name="x_circle" size={16}/>{" "}LIVE</span>
            <span style={{fontSize:13,fontWeight:700}}>Mode Afrique</span>
          </div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Nouvelle collection Wax — 47 spectateurs</div>
        </div>
        <span style={{fontSize:12,color:"#F97316",fontWeight:600}}>Rejoindre →</span>
      </div>

      {/*  Produit du jour */}
      {P[0]&&<div onClick={()=>go("detail",P[0])} style={{margin:"0 6px 14px",padding:14,background:"var(--card)",border:"2px solid #F59E0B",borderRadius:18,cursor:"pointer",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:0,padding:"4px 12px 4px 16px",background:"#F59E0B",borderRadius:"0 0 0 14px",color:"#fff",fontSize:10,fontWeight:800}}><Icon name="star_full" size={16}/>{" "}PRODUIT DU JOUR</div>
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

      {/*  Recommandations personnalisées */}
      <div style={{padding:"0 16px"}}>
        <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"var(--text)",paddingBottom:12}}><Icon name="target" size={16}/>{" "}{t("home.for_you")}</h3>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none",paddingBottom:14,paddingLeft:6,paddingRight:6,WebkitOverflowScrolling:"touch"}}>
          {P.slice(2,10).map(p=>(
            <div key={p.id} onClick={()=>go("detail",p)} style={{minWidth:100,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden",cursor:"pointer",flexShrink:0}}>
              <div style={{width:"100%",aspectRatio:"4/3",background:"var(--light)",position:"relative",overflow:"hidden"}}><Img src={p.photo} emoji={p.img} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} fit="cover"/></div>
              <div style={{padding:"5px 7px"}}>
                <div style={{fontSize:10,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div>
                <div style={{fontSize:11,fontWeight:700,color:"#F97316",marginTop:1}}>{fmt(p.price)}</div>
              </div>
            </div>
          ))}
      </div>

      {/* Group Buy promo */}
      <div onClick={()=>go("groupBuy")} style={{margin:"0 6px 14px",padding:12,background:"linear-gradient(135deg,rgba(249,115,22,0.06),rgba(251,146,60,0.06))",border:"1px solid rgba(249,115,22,0.12)",borderRadius:14,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
        <div style={{width:38,height:38,borderRadius:12,background:"#F97316",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}><Icon name="handshake" size={18}/></div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>Achats groupés — Jusqu'à -30%</div><div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>3 offres en cours · Rejoignez un groupe</div></div>
        <span style={{color:"#F97316",fontSize:16}}>›</span>
      </div>

      {/* Restos à la une */}
      {(selType==="all"||selType==="restaurant")&&nearbyRestos.length>0&&<>
      {/* Events / promos banner */}
      {(()=>{
        const now=new Date();
        const month=now.getMonth();
        const day=now.getDate();
        let event=null;
        if(month===10&&day>=20&&day<=30)event={icon:"package",title:"Black Friday Lamuka",sub:"Jusqu'à -70% partout",bg:"linear-gradient(135deg,#000,#1F2937)",text:"#fff",badge:"-70%"};
        else if(month===7&&day>=10&&day<=20)event={icon:"",title:"Indépendance Congo",sub:"Spéciales fête nationale",bg:"linear-gradient(135deg,#10B981,#F97316,#EF4444)",text:"#fff",badge:"NEW"};
        else if(month===11&&day>=15)event={icon:"",title:"Spéciales Fêtes",sub:"Cadeaux à prix doux",bg:"linear-gradient(135deg,#DC2626,#16A34A)",text:"#fff"};
        else event={icon:"gift",title:"Promo spéciale",sub:"Code WEEKEND15 — -15% restos",bg:"linear-gradient(135deg,#F97316,#EC4899)",text:"#fff",badge:"-15%"};
        return(
          <div onClick={()=>go("allProducts")} style={{margin:"4px 6px 14px",padding:14,background:event.bg,borderRadius:14,color:event.text,cursor:"pointer",display:"flex",alignItems:"center",gap:12,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-20,fontSize:90,opacity:.15}}><Icon name={event.icon} size={20}/></div>
            <div style={{fontSize:32,zIndex:1}}><Icon name={event.icon} size={20}/></div>
            <div style={{flex:1,zIndex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:800}}>{event.title}</div>
              <div style={{fontSize:11,opacity:.9,marginTop:2}}>{event.sub}</div>
            </div>
            {event.badge&&<div style={{padding:"4px 8px",borderRadius:6,background:"rgba(255,255,255,.25)",backdropFilter:"blur(8px)",fontSize:10,fontWeight:800,zIndex:1}}>{event.badge}</div>}
          </div>
        );
      })()}

        {/* ═══ COMMANDER À MANGER — clean icons, no emojis ═══ */}
        <div style={{padding:"6px 6px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <h3 style={{fontSize:17,fontWeight:800,letterSpacing:-.3,color:"var(--text)"}}>Commander à manger</h3>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Livraison rapide près de toi</div>
          </div>
          <span onClick={()=>go("restoList")} style={{fontSize:12,color:"#F97316",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>Voir tout <Icon name="chevron_right" size={14} color="#F97316"/></span>
        </div>

        {/* Food category chips — clean, no emojis */}
        <div style={{display:"flex",gap:8,overflowX:"auto",padding:"10px 6px 12px",scrollbarWidth:"none"}} className="hide-scroll">
          {[
            {label:"Populaire",q:"populaire"},
            {label:"Cuisine congolaise",q:"congolaise"},
            {label:"Pizza",q:"pizza"},
            {label:"Burger",q:"burger"},
            {label:"Grillades",q:"grillade"},
            {label:"Asiatique",q:"asiatique"},
            {label:"Boissons",q:"boisson"},
          ].map((c,i)=>(
            <button key={i} onClick={()=>doSearch(c.q)} style={{flexShrink:0,padding:"7px 14px",borderRadius:18,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,color:"var(--text)",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>{c.label}</button>
          ))}
        </div>

        {/* Featured restaurant — hero card */}
        {nearbyRestos[0]&&(()=>{
          const feat=nearbyRestos[0];
          const dish=P.find(p=>p.vendor===feat.name&&p.photo)||P.find(p=>p.type==="restaurant"&&p.photo);
          return(
            <div onClick={()=>go("vendor",feat)} style={{margin:"0 6px 14px",borderRadius:18,overflow:"hidden",position:"relative",cursor:"pointer",aspectRatio:"16 / 11",background:"#222"}}>
              <img src={dish?.photo||feat.cover} alt={feat.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
              {/* Badges */}
              <div style={{position:"absolute",top:12,left:12,display:"flex",gap:6}}>
                <span style={{padding:"4px 9px",background:"rgba(255,255,255,0.95)",borderRadius:6,fontSize:10,fontWeight:800,color:"#F97316",display:"flex",alignItems:"center",gap:4}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#F97316"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  EN VEDETTE
                </span>
                {feat.promo&&<span style={{padding:"4px 9px",background:"#EF4444",color:"#fff",borderRadius:6,fontSize:10,fontWeight:800}}>-{feat.promo.discount}%</span>}
              </div>
              {feat.isOpen&&<div style={{position:"absolute",top:12,right:12,padding:"4px 9px",background:"rgba(16,185,129,0.95)",color:"#fff",borderRadius:6,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:3,background:"#fff",animation:"pulse-dot 1.5s ease-in-out infinite"}}/>OUVERT
              </div>}
              <div style={{position:"absolute",left:0,right:0,bottom:0,padding:"40px 14px 14px",background:"linear-gradient(to top, rgba(0,0,0,0.85) 30%, transparent)",color:"#fff"}}>
                <div style={{display:"flex",alignItems:"flex-end",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,overflow:"hidden",border:"2px solid #fff",flexShrink:0,background:"#fff"}}>
                    {feat.logo?<img src={feat.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#F97316,#EA580C)",color:"#fff",fontSize:18,fontWeight:800}}>{feat.name.charAt(0)}</div>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:16,fontWeight:800,letterSpacing:-.2,display:"flex",alignItems:"center",gap:4}}>{feat.name}{feat.verified&&<svg width="14" height="14" viewBox="0 0 24 24" fill="#F97316"><path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2" fill="#F97316"/></svg>}</div>
                    <div style={{fontSize:11,opacity:.85,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{feat.desc}</div>
                    <div style={{display:"flex",gap:12,fontSize:11,marginTop:6,alignItems:"center"}}>
                      <span style={{display:"flex",alignItems:"center",gap:3}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#FCD34D"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <b>{feat.rating}</b>
                      </span>
                      <span style={{display:"flex",alignItems:"center",gap:3,color:"#FCD34D"}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
                        {feat.eta}
                      </span>
                      <span style={{display:"flex",alignItems:"center",gap:3}}>Min {feat.minOrder?.toLocaleString("fr")} F</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Horizontal carousel — skip the featured restaurant to avoid duplicate */}
        <div style={{display:"flex",gap:10,overflowX:"auto",padding:"0 6px 14px",scrollbarWidth:"none"}} className="hide-scroll">
          {nearbyRestos.slice(1,9).concat(nearbyRestos.length<2?nearbyRestos.slice(0,1):[]).map(v=>{
            const dish=P.find(p=>p.vendor===v.name&&p.photo)||P.find(p=>p.type==="restaurant"&&p.photo);
            return(
              <div key={v.id} onClick={()=>go("vendor",v)} style={{minWidth:158,flexShrink:0,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                <div style={{width:"100%",aspectRatio:"16 / 10",position:"relative",overflow:"hidden",background:"var(--light)"}}>
                  <img src={dish?.photo||v.cover} alt={v.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
                  {v.promo&&<span style={{position:"absolute",top:8,left:8,padding:"3px 7px",background:"#EF4444",color:"#fff",borderRadius:5,fontSize:9,fontWeight:800}}>-{v.promo.discount}%</span>}
                  {v.badge==="new"&&<span style={{position:"absolute",top:8,right:8,padding:"3px 7px",background:"#F97316",color:"#fff",borderRadius:5,fontSize:9,fontWeight:800}}>NOUVEAU</span>}
                  {v.badge==="top"&&!v.promo&&<span style={{position:"absolute",top:8,right:8,padding:"3px 7px",background:"rgba(255,255,255,0.95)",color:"#F97316",borderRadius:5,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",gap:3}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#F97316"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>TOP
                  </span>}
                  <span style={{position:"absolute",bottom:8,left:8,padding:"3px 8px",background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",color:"#fff",borderRadius:5,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>{v.eta}
                  </span>
                </div>
                <div style={{padding:"10px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <div style={{width:22,height:22,borderRadius:6,overflow:"hidden",background:"var(--light)",flexShrink:0}}>
                      {v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#F97316,#EA580C)",color:"#fff",fontSize:10,fontWeight:800}}>{v.name.charAt(0)}</div>}
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,display:"flex",alignItems:"center",gap:3}}>{v.name}{v.verified&&<svg width="11" height="11" viewBox="0 0 24 24" fill="#F97316"><path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2.5" fill="#F97316"/></svg>}</div>
                  </div>
                  <div style={{fontSize:10,color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.desc}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6,fontSize:10}}>
                    <span style={{color:"#F59E0B",fontWeight:600,display:"flex",alignItems:"center",gap:3}}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {v.rating}
                    </span>
                    <span style={{color:"var(--muted)"}}>Livraison {v.deliveryFee?v.deliveryFee.toLocaleString("fr")+"F":"gratuite"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {/* Boutiques tendance — marketplace identity reminder */}
      <div style={{padding:"6px 6px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <h3 style={{fontSize:17,fontWeight:800,letterSpacing:-.3,color:"var(--text)"}}>Boutiques tendance</h3>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Mode, électronique, beauté & plus</div>
        </div>
        <span onClick={()=>go("nearby")} style={{fontSize:12,color:"#F97316",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>Voir tout <Icon name="chevron_right" size={14} color="#F97316"/></span>
      </div>
      <div style={{display:"flex",gap:10,overflowX:"auto",padding:"10px 6px 14px",scrollbarWidth:"none"}} className="hide-scroll">
        {VENDORS.filter(v=>v.type==="boutique"||v.type==="supermarche"||v.type==="pharmacie").slice(0,8).map(v=>{
          const featured=P.find(p=>p.vendor===v.name&&p.photo);
          return(
            <div key={v.id} onClick={()=>go("vendor",v)} style={{minWidth:154,flexShrink:0,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{width:"100%",aspectRatio:"16 / 10",position:"relative",overflow:"hidden",background:"var(--light)"}}>
                <img src={featured?.photo||v.cover} alt={v.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
                {v.promo&&<span style={{position:"absolute",top:8,left:8,padding:"3px 7px",background:"#EF4444",color:"#fff",borderRadius:5,fontSize:9,fontWeight:800}}>-{v.promo.discount}%</span>}
                {v.badge==="new"&&<span style={{position:"absolute",top:8,right:8,padding:"3px 7px",background:"#F97316",color:"#fff",borderRadius:5,fontSize:9,fontWeight:800}}>NOUVEAU</span>}
              </div>
              <div style={{padding:"10px 12px"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <div style={{width:22,height:22,borderRadius:6,overflow:"hidden",background:"var(--light)",flexShrink:0}}>
                    {v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#F97316,#EA580C)",color:"#fff",fontSize:10,fontWeight:800}}>{v.name.charAt(0)}</div>}
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,display:"flex",alignItems:"center",gap:3}}>{v.name}{v.verified&&<svg width="11" height="11" viewBox="0 0 24 24" fill="#F97316"><path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2.5" fill="#F97316"/></svg>}</div>
                </div>
                <div style={{fontSize:10,color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.desc}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6,fontSize:10}}>
                  <span style={{color:"#F59E0B",fontWeight:600,display:"flex",alignItems:"center",gap:3}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {v.rating}
                  </span>
                  <span style={{color:"var(--muted)"}}>{v.products} articles</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sec"><h3>{selType==="all"?"Établissements proches":types.find(t=>t.id===selType)?.name+" proches"}</h3><span onClick={()=>go("nearby")}>Voir la carte</span></div>
      <div className="vlist">{filteredV.slice(0,4).map(v=><div key={v.id} className="vcard" onClick={()=>go("vendor",v)}><div className="vav" style={v.logo?{overflow:"hidden",padding:0}:{}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}} alt=""/>:v.avatar}</div><div className="vi"><h4>{v.name}{v.verified&&<span className="vf"></span>}</h4><div className="vloc"><Icon name="location" size={16}/>{" "}{v.loc}{v.eta&&<span style={{marginLeft:8,color:"#F97316",fontWeight:600}}> {v.eta}</span>}</div><div className="vst"><Icon name="star_full" size={16}/>{" "}<b>{v.rating}</b> · {v.products} {v.type==="restaurant"?"plats":v.type==="service"?"services":"produits"}</div></div><span style={{color:"var(--muted)"}}>›</span></div>)}</div>


      {/* ═══ RECENTLY VIEWED ═══ */}
      {recentlyViewed.length>0&&<>
        <div className="sec"><h3> Récemment consultés</h3></div>
        <div style={{display:"flex",gap:8,padding:"0 6px 12px",overflowX:"auto",scrollbarWidth:"none"}}>
          {recentlyViewed.slice(0,6).map(p=><div key={"rv-"+p.id} onClick={()=>go("detail",p)} style={{flexShrink:0,width:100,cursor:"pointer"}}>
            <div style={{width:100,height:80,borderRadius:12,overflow:"hidden",background:"var(--light)",marginBottom:4}}>
              <Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>
            </div>
            <div style={{fontSize:10,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div>
            <div style={{fontSize:10,fontWeight:700,color:"#F97316"}}>{fmt(p.price)}</div>
          </div>)}
        </div>
      </>}



      {/* ═══ POPULAIRES — top sellers across all categories ═══ */}
      <div className="sec"><h3>Populaires cette semaine</h3>{!isLoading&&<span onClick={()=>go("allProducts")}>Voir tout</span>}</div>
      {isLoading ? <SkeletonRow count={6}/> : <div style={{display:"flex",gap:10,overflowX:"auto",padding:"4px 6px 14px",scrollbarWidth:"none"}} className="hide-scroll">
        {sortedP.slice(0,8).map(p=>{const vp=getVendorPromo(p,VENDORS);const td=totalDisc(p,VENDORS);return(
          <div key={"pop-"+p.id} onClick={()=>go("detail",p)} style={{minWidth:134,maxWidth:134,flexShrink:0,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden",cursor:"pointer"}}>
            <div style={{width:"100%",aspectRatio:"1 / 1",position:"relative",overflow:"hidden",background:"var(--light)"}}>
              <Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>
              {p.old&&<span style={{position:"absolute",top:6,left:6,padding:"2px 6px",background:"#EF4444",color:"#fff",borderRadius:4,fontSize:9,fontWeight:800}}>-{disc(p)}%</span>}
              <span onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{position:"absolute",top:6,right:6,width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,0.95)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{isFav(p.id) ? <svg width="13" height="13" viewBox="0 0 24 24" fill="#EF4444"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}</span>
            </div>
            <div style={{padding:"8px 10px"}}>
              <div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--text)"}}>{p.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginTop:3}}>
                {vp ? <><span style={{fontSize:13,fontWeight:800,color:"#F97316"}}>{fmt(vp.promoPrice)}</span><span style={{fontSize:9,color:"var(--muted)",textDecoration:"line-through"}}>{fmt(p.price)}</span></> : <span style={{fontSize:13,fontWeight:800,color:"#F97316"}}>{fmt(p.price)}</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:3,marginTop:3,fontSize:10,color:"var(--muted)"}}>
                <Icon name="star_full" size={11}/>{p.rating} ({p.reviews})
              </div>
            </div>
          </div>
        )})}
      </div>}

      {/* ═══ PROMOS EN COURS — carousel ═══ */}
      {(()=>{const promoProds=P.filter(p=>p.old&&p.price<p.old).slice(0,8);return promoProds.length>=3?(<>
        <div className="sec"><h3 style={{display:"flex",alignItems:"center",gap:6}}><Icon name="fire" size={18} color="#EF4444"/>Promos en cours</h3><span onClick={()=>go("allProducts")}>Voir tout</span></div>
        <div style={{display:"flex",gap:10,overflowX:"auto",padding:"4px 6px 14px",scrollbarWidth:"none"}} className="hide-scroll">
          {promoProds.map(p=>(
            <div key={"promo-"+p.id} onClick={()=>go("detail",p)} style={{minWidth:134,maxWidth:134,flexShrink:0,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden",cursor:"pointer"}}>
              <div style={{width:"100%",aspectRatio:"1 / 1",position:"relative",overflow:"hidden",background:"var(--light)"}}>
                <Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>
                <span style={{position:"absolute",top:6,left:6,padding:"2px 7px",background:"linear-gradient(135deg,#EF4444,#DC2626)",color:"#fff",borderRadius:4,fontSize:10,fontWeight:800}}>-{disc(p)}%</span>
              </div>
              <div style={{padding:"8px 10px"}}>
                <div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:4,marginTop:3}}>
                  <span style={{fontSize:13,fontWeight:800,color:"#EF4444"}}>{fmt(p.price)}</span>
                  <span style={{fontSize:9,color:"var(--muted)",textDecoration:"line-through"}}>{fmt(p.old)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>):null})()}

      {/* ═══ CAROUSELS PAR CATÉGORIE ═══ */}
      {["Restaurants","Pâtisseries","Supermarché","Pharmacie","Mode Femme","Électronique","Beauté","Maison & Déco","Mode Homme","Bébé & Enfant"].map(catName=>{
        const catProducts=P.filter(p=>p.cat===catName).slice(0,8);
        if(catProducts.length<3)return null;
        const catInfo=CATS.find(c=>c.name===catName);
        return(
          <div key={"cat-"+catName}>
            <div style={{padding:"6px 6px 0",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                {catInfo?.photo&&<div style={{width:30,height:30,borderRadius:8,overflow:"hidden",flexShrink:0}}><img src={catInfo.photo} alt={catName} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>}
                <h3 style={{fontSize:16,fontWeight:800,letterSpacing:-.3,color:"var(--text)"}}>{catName}</h3>
              </div>
              <span onClick={()=>{doSearch(catName)}} style={{fontSize:12,color:"#F97316",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>Voir tout <Icon name="chevron_right" size={14} color="#F97316"/></span>
            </div>
            <div style={{display:"flex",gap:10,overflowX:"auto",padding:"4px 6px 14px",scrollbarWidth:"none"}} className="hide-scroll">
              {catProducts.map(p=>{const vp=getVendorPromo(p,VENDORS);return(
                <div key={"cp-"+p.id} onClick={()=>go("detail",p)} style={{minWidth:134,maxWidth:134,flexShrink:0,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden",cursor:"pointer"}}>
                  <div style={{width:"100%",aspectRatio:"1 / 1",position:"relative",overflow:"hidden",background:"var(--light)"}}>
                    <Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>
                    {p.old&&<span style={{position:"absolute",top:6,left:6,padding:"2px 6px",background:"#EF4444",color:"#fff",borderRadius:4,fontSize:9,fontWeight:800}}>-{disc(p)}%</span>}
                    <span onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{position:"absolute",top:6,right:6,width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,0.95)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{isFav(p.id) ? <svg width="13" height="13" viewBox="0 0 24 24" fill="#EF4444"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}</span>
                  </div>
                  <div style={{padding:"8px 10px"}}>
                    <div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                    <div style={{display:"flex",alignItems:"baseline",gap:4,marginTop:3}}>
                      {vp ? <><span style={{fontSize:13,fontWeight:800,color:"#F97316"}}>{fmt(vp.promoPrice)}</span><span style={{fontSize:9,color:"var(--muted)",textDecoration:"line-through"}}>{fmt(p.price)}</span></> : <span style={{fontSize:13,fontWeight:800,color:"#F97316"}}>{fmt(p.price)}</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:3,marginTop:3,fontSize:10,color:"var(--muted)"}}>
                      <Icon name="star_full" size={11}/>{p.rating}
                    </div>
                  </div>
                </div>
              )})}
              {/* "Voir tout" card at the end */}
              <div onClick={()=>doSearch(catName)} style={{minWidth:134,maxWidth:134,flexShrink:0,background:"linear-gradient(135deg,rgba(249,115,22,0.06),rgba(249,115,22,0.02))",border:"1.5px dashed rgba(249,115,22,0.3)",borderRadius:12,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
                <div style={{width:44,height:44,borderRadius:14,background:"rgba(249,115,22,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#F97316",marginBottom:8}}>
                  <Icon name="chevron_right" size={22} color="#F97316"/>
                </div>
                <div style={{fontSize:12,fontWeight:800,color:"#F97316",textAlign:"center"}}>Voir tout</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{P.filter(p=>p.cat===catName).length} articles</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* End of feed marker */}
      <div style={{padding:"10px 24px 24px",textAlign:"center"}}>
        <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#F97316,#EA580C)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",color:"#fff"}}>
          <Icon name="check_circle" size={22} color="#fff"/>
        </div>
        <h3 style={{fontSize:14,fontWeight:800,letterSpacing:-.3,margin:0}}>Vous avez tout vu !</h3>
        <p style={{fontSize:11,color:"var(--muted)",maxWidth:240,margin:"3px auto 12px"}}>{P.length} articles disponibles · {Math.max(VENDORS.length, new Set(P.map(p=>p.vendor).filter(Boolean)).size)} boutiques</p>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>go("allProducts")} style={{padding:"9px 16px",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",color:"var(--text)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Tous les articles</button>
          <button onClick={()=>go("nearby")} style={{padding:"9px 16px",borderRadius:10,border:"none",background:"#F97316",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Vendeurs proches</button>
        </div>
      </div>
      </>}
    </div></PullToRefresh>


  </>);
}

/* 5b ── RESTAURANT LIST ── */

export default HomeScr;
