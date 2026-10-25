import { useState, useEffect } from "react";
import { reviewsAPI } from "../../api";
import { useApp } from "../../context/AppContext";
import { useGuestGate } from "../../hooks/useGuestGate";
import toast from "../../utils/toast";
import { useData } from "../../hooks";
import { useLoad } from "../../hooks/useData";
import social from "../../services/socialService";
import Img from "../../components/Img";
import BackButton from "../../components/BackButton";
import { fmt, disc, getVendorPromo } from "../../utils/helpers";
import { shareVendor } from "../../utils/share";
import Icon from "../../components/Icon";

function VendorScr({vendor:vProp,go,onBack}){
  const { gate, GateUI } = useGuestGate(go);
  const { P, VENDORS } = useData();
  const v = VENDORS.find(x => x.name === vProp?.name || x.id === vProp?.id) || vProp || {};
  const [following,setFollowing]=useState(false);
  const [fCount,setFC]=useState(v.followers||0);
  const [tab,setTab]=useState("products");
  const [menuTab,setMenuTab]=useState(null);
  const isFood=v.type==="restaurant"||v.type==="patisserie";
  const [viewImg,setViewImg]=useState(null);
  const vpAll=P.filter(p=>p.vendor===v.name);
  const vp=menuTab?vpAll.filter(p=>p.menuCat===menuTab):vpAll;
  const { isGuest } = useApp();
  const shopId = parseInt(v.id) || null;
  useEffect(()=>{
    if(!shopId||isGuest) return;
    social.isFollowing(shopId).then(res=>setFollowing(!!res?.is_following)).catch(()=>{});
  },[shopId,isGuest]);
  const toggleFollow=async()=>{
    if(!shopId) return;
    let res;
    try{ res=await social.toggleFollow(shopId); }
    catch(err){ toast.error(err.message||"Action impossible"); return; }
    setFollowing(!!res?.is_following);
    if(res?.followers_count!==undefined) setFC(parseInt(res.followers_count)||0);
    toast.success(res?.is_following?"Vous suivez cette boutique":"Vous ne suivez plus cette boutique");
  };

  const { data: reviewsData } = useLoad(() => shopId ? reviewsAPI.getByEstablishment(shopId) : Promise.resolve([]), [shopId]);
  const REVIEWS = ((reviewsData?.reviews || reviewsData) || []).map(r => r.text !== undefined ? r : ({
    id: r.id,
    name: [r.first_name, r.last_name].filter(Boolean).join(" ") || "Client",
    avatar: r.avatar || null,
    date: r.created_at ? new Date(String(r.created_at).replace(" ","T")).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"}) : "",
    product: r.article_name || "",
    rating: parseInt(r.rating) || 0,
    text: r.comment || "",
    reply: r.vendor_reply || "",
    photos: [],
  }));

  const avgRating=REVIEWS.length>0?REVIEWS.reduce((s,r)=>s+r.rating,0)/REVIEWS.length:(v.rating||0);

  return(<div className="scr">
    {/* Header with cover */}
    <div className="vp-head" style={{backgroundImage:v.cover?`url(${v.cover})`:"none",backgroundSize:"cover",backgroundPosition:"center"}}>
      {v.cover&&<div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%,rgba(0,0,0,0.7))"}}/>}
      <div style={{position:"absolute",top:12,left:12,zIndex:2}}><BackButton onClick={onBack} /></div>
      <div className="vp-av" style={v.logo?{overflow:"hidden",padding:0}:{}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:v.avatar}</div>
      <h2 style={{fontSize:20,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6,position:"relative",zIndex:1}}>{v.name}{v.verified&&<span style={{fontSize:14}}></span>}</h2>
      <p style={{fontSize:12,opacity:.7,marginTop:3,position:"relative",zIndex:1}}><Icon name="location" size={16}/>{" "}{v.loc}</p>
    </div>

    {/* Stats — clickable to switch tabs */}
    <div className="vp-stats">
      <div className={`vps r`} onClick={()=>setTab("reviews")} style={{cursor:"pointer",borderBottom:tab==="reviews"?"2px solid #F97316":"2px solid transparent",transition:"all .2s"}}>
        <div className="vsi"><Icon name="star_full" size={18}/></div><b>{v.rating||avgRating.toFixed(1)}</b><span>Note</span>
      </div>
      <div className={`vps p`} onClick={()=>setTab("products")} style={{cursor:"pointer",borderBottom:tab==="products"?"2px solid #F97316":"2px solid transparent",transition:"all .2s"}}>
        <div className="vsi"><Icon name="package" size={18}/></div><b>{vp.length||v.products}</b><span>Produits</span>
      </div>
      <div className={`vps f`} onClick={()=>setTab("followers")} style={{cursor:"pointer",borderBottom:tab==="followers"?"2px solid #F97316":"2px solid transparent",transition:"all .2s"}}>
        <div className="vsi"></div><b>{fCount}</b><span>Abonnés</span>
      </div>
    </div>

    {/* Description */}
    <div style={{padding:"0 16px",fontSize:14,color:"var(--sub)",marginBottom:isFood?8:14,lineHeight:1.6}}>{v.desc}</div>

    {/* Restaurant info bar */}
    {isFood&&<div style={{padding:"0 16px",marginBottom:14}}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
        <span style={{padding:"4px 10px",borderRadius:8,background:v.isOpen?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)",color:v.isOpen?"#10B981":"#EF4444",fontSize:11,fontWeight:700}}>{v.isOpen?"Ouvert":"Fermé"}{v.hours&&" · "+v.hours}</span>
        {v.eta&&<span style={{padding:"4px 10px",borderRadius:8,background:"var(--light)",fontSize:11,fontWeight:600,color:"var(--text)"}}> {v.eta}</span>}
        {v.deliveryFee!==undefined&&<span style={{padding:"4px 10px",borderRadius:8,background:"var(--light)",fontSize:11,fontWeight:600,color:"var(--text)"}}><Icon name="truck" size={16}/>{" "}{v.deliveryFee===0?"Gratuit":fmt(v.deliveryFee)}</span>}
        {v.minOrder&&<span style={{padding:"4px 10px",borderRadius:8,background:"var(--light)",fontSize:11,fontWeight:600,color:"var(--text)"}}>Min. {fmt(v.minOrder)}</span>}
      </div>

      {/* Menu category tabs */}
      {v.menuCats&&<div style={{display:"flex",gap:4,overflowX:"auto",scrollbarWidth:"none",paddingBottom:4}}>
        <button onClick={()=>setMenuTab(null)} style={{padding:"6px 12px",borderRadius:10,border:"none",background:menuTab===null?"#F97316":"var(--light)",color:menuTab===null?"#fff":"var(--muted)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Tout</button>
        {v.menuCats.map(mc=><button key={mc} onClick={()=>setMenuTab(mc)} style={{padding:"6px 12px",borderRadius:10,border:"none",background:menuTab===mc?"#F97316":"var(--light)",color:menuTab===mc?"#fff":"var(--muted)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{mc}</button>)}
      </div>}
    </div>}

    {/* Buttons */}
    <div className="vp-btns">
      <button className="vb1" style={following?{background:"var(--card)",color:"#F97316",border:"1px solid #F97316"}:{}} onClick={()=>gate("follow",()=>toggleFollow())}>{following?"Suivi":"+ Suivre"}</button>
      <button className="vb2" onClick={()=>go("chatVendor",v)}><Icon name="chat" size={16}/>{" "}Contacter</button><button className="vb2" style={{flex:"none",width:44}} onClick={()=>shareVendor(v)}><Icon name="share" size={16}/></button>
    </div>

    {/* Vendor promo banner */}
    {v.promo&&<div style={{margin:"0 20px 14px",padding:14,background:"linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.04))",border:"1px solid rgba(249,115,22,0.15)",borderRadius:16,display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:44,height:44,borderRadius:12,background:"#10B981",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16,flexShrink:0}}>-{v.promo.discount}%</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>{v.promo.name}</div>
        <div style={{fontSize:11,color:"var(--muted)"}}>Sur tous les articles · Jusqu'au {v.promo.ends}</div>
      </div>
      <span style={{fontSize:20}}><Icon name="tag" size={18}/></span>
    </div>}

    {/* Tab bar */}
    <div style={{display:"flex",borderBottom:"1px solid var(--border)",margin:"0 20px 14px"}}>
      {[["products","Produits"],["reviews","Avis"],["followers","Abonnés"]].map(([k,l])=>(
        <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"10px 0",border:"none",borderBottom:tab===k?"2px solid #F97316":"2px solid transparent",background:"transparent",fontSize:12,fontWeight:tab===k?700:500,color:tab===k?"#F97316":"var(--muted)",cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>{l}</button>
      ))}
    </div>

    {/* ═══ PRODUCTS TAB (default) ═══ */}
    {tab==="products"&&<>
      <div style={{padding:"0 16px",marginBottom:10}}><div style={{fontSize:12,color:"var(--muted)"}}>{vp.length}{menuTab?" (filtré)":""} article{vp.length>1?"s":""} disponible{vp.length>1?"s":""}</div></div>
      <div className="pgrid stagger-grid">{vp.map(p=>{const vpromo=getVendorPromo(p,VENDORS);return(<div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>{vpromo&&<span className="badge">-{vpromo.promoDiscount}%</span>}{!vpromo&&disc(p)>0&&<span className="badge">-{disc(p)}%</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pp">{vpromo?<><span style={{color:"#F97316"}}>{fmt(vpromo.promoPrice)}</span><span className="po">{fmt(p.price)}</span></>:<>{fmt(p.price)}</>}</div><div className="pr"><Icon name="star_full" size={16}/>{" "}{p.rating}</div></div></div>)})}</div>
      {vp.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36}}><Icon name="package" size={18}/></div><div style={{fontSize:13,color:"var(--muted)",marginTop:8}}>Aucun article pour le moment</div></div>}
    </>}

    {/* ═══ REVIEWS TAB ═══ */}
    {tab==="reviews"&&<div style={{padding:"0 16px 20px"}}>
      {/* Rating summary */}
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontSize:36,fontWeight:700}}>{avgRating.toFixed(1)}</div>
        <div style={{fontSize:16,color:"#F59E0B",marginBottom:2}}>{"⭐".repeat(Math.floor(avgRating))}{"☆".repeat(5-Math.floor(avgRating))}</div>
        <div style={{fontSize:12,color:"var(--muted)"}}>{REVIEWS.length} avis</div>
      </div>

      {REVIEWS.length===0&&<div style={{textAlign:"center",padding:"24px 10px",color:"var(--muted)",fontSize:13}}>Pas encore d'avis pour cette boutique.</div>}
      {REVIEWS.map((r,i)=><div key={i} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:36,height:36,borderRadius:10,overflow:"hidden",flexShrink:0}}>{r.avatar?.startsWith("http")?<img src={r.avatar} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{width:"100%",height:"100%",background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{r.avatar}</div>}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700}}>{r.name}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>{r.date} · {r.product}</div>
          </div>
          <div style={{fontSize:12,color:"#F59E0B"}}>{"⭐".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
        </div>
        <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.5,margin:0}}>{r.text}</p>
        {r.reply&&<div style={{marginTop:8,padding:"8px 10px",borderRadius:10,background:"var(--light)",fontSize:12,color:"var(--sub)"}}><b style={{color:"#F97316"}}>Réponse de la boutique :</b> {r.reply}</div>}
        {r.photos&&r.photos.length>0&&<div style={{display:"flex",gap:6,marginTop:8}}>
          {r.photos.map((ph,j)=><img key={j} src={ph} alt="" onClick={()=>setViewImg(ph)} style={{width:56,height:56,borderRadius:10,objectFit:"cover",cursor:"pointer",border:"1px solid var(--border)"}}/>)}
        </div>}
      </div>)}
    </div>}

    {/* ═══ FOLLOWERS TAB ═══ */}
    {tab==="followers"&&<div style={{padding:"0 16px 20px"}}>
      
      {/* HERO - Big number + Follow CTA + Live indicator */}
      <div style={{background:"linear-gradient(180deg, #FFF7ED 0%, var(--card) 100%)",borderRadius:18,padding:"18px 16px",marginBottom:16,border:"1px solid rgba(249,115,22,0.15)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{fontSize:28,fontWeight:800,letterSpacing:-0.6,color:"var(--text)"}}>{fCount.toLocaleString("fr-FR")}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>abonnés actifs</div>
          </div>
          {!following && <button onClick={()=>gate("follow",()=>toggleFollow())} style={{padding:"10px 16px",borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 12px rgba(249,115,22,0.3)",display:"flex",alignItems:"center",gap:5}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Suivre
          </button>}
          {following && <button onClick={()=>gate("follow",()=>toggleFollow())} style={{padding:"10px 16px",borderRadius:12,border:"1.5px solid #F97316",background:"transparent",color:"#F97316",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
            <Icon name="check" size={14} color="#F97316"/>Suivi
          </button>}
        </div>
        
      </div>
      <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",lineHeight:1.5}}>Suivez cette boutique pour être averti de ses nouveautés et promotions.</div>
    </div>}

    {/* Image fullscreen viewer */}
    {viewImg&&<div onClick={()=>setViewImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:20}}>
      <img src={viewImg} alt="" style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:12,objectFit:"contain"}}/>
    </div>}
    <GateUI/>
  </div>);
}

export default VendorScr;
