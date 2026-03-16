import { useState } from "react";
import toast from "../../utils/toast";
import { useData } from "../../hooks";
import Img from "../../components/Img";
import BackButton from "../../components/BackButton";
import { fmt, disc, getVendorPromo } from "../../utils/helpers";
import { shareVendor } from "../../utils/share";

const MOCK_FOLLOWERS=[
  {name:"Marie Koumba",avatar:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face",since:"Jan 2026",zone:"Bacongo"},
  {name:"Patrick Mbemba",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",since:"Déc 2025",zone:"Poto-Poto"},
  {name:"Celine Nzaba",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",since:"Nov 2025",zone:"Moungali"},
  {name:"David Tsaty",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",since:"Oct 2025",zone:"Talangaï"},
  {name:"Grace Mouanda",avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",since:"Sep 2025",zone:"Ouenzé"},
  {name:"Paul Nkaya",avatar:"https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face",since:"Août 2025",zone:"Mfilou"},
  {name:"Alain Mboumba",avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",since:"Juil 2025",zone:"Bacongo"},
  {name:"Jeanne Okamba",avatar:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",since:"Juin 2025",zone:"Makélékélé"},
];

const MOCK_REVIEWS=[
  {name:"Marie K.",avatar:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face",rating:5,text:"Excellent produit, livraison rapide ! Je recommande fortement cette boutique.",date:"12 Fév 2026",product:"Robe Wax Moderne",photos:["https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=100&h=100&fit=crop"]},
  {name:"Patrick M.",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",rating:4,text:"Bon rapport qualité-prix. L'emballage pourrait être meilleur.",date:"8 Fév 2026",product:"Chemise Bogolan",photos:[]},
  {name:"Celine N.",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",rating:5,text:"Deuxième achat, toujours satisfaite. Commerce très réactif et produits de qualité.",date:"3 Fév 2026",product:"Sac à Main Cuir",photos:["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop"]},
  {name:"David T.",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",rating:3,text:"Produit conforme mais livraison un peu lente (4 jours).",date:"28 Jan 2026",product:"Sandales Cuir",photos:[]},
  {name:"Grace M.",avatar:"👩‍🦳",rating:5,text:"Le sac est magnifique ! Cuir de très bonne qualité, je suis ravie.",date:"20 Jan 2026",product:"Sac à Main Cuir",photos:["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop"]},
];

function VendorScr({vendor:vProp,go,onBack}){
  const { P, VENDORS } = useData();
  const v = VENDORS.find(x => x.name === vProp?.name || x.id === vProp?.id) || vProp || {};
  const [following,setFollowing]=useState(false);
  const [fCount,setFC]=useState(v.followers||0);
  const [tab,setTab]=useState("products");
  const [viewImg,setViewImg]=useState(null);
  const vp=P.filter(p=>p.vendor===v.name);
  const toggleFollow=()=>{setFollowing(f=>!f);setFC(c=>following?c-1:c+1);toast.success(following?"Désabonné":"Abonné ✅")};

  const avgRating=MOCK_REVIEWS.reduce((s,r)=>s+r.rating,0)/MOCK_REVIEWS.length;

  return(<div className="scr">
    {/* Header with cover */}
    <div className="vp-head" style={{backgroundImage:v.cover?`url(${v.cover})`:"none",backgroundSize:"cover",backgroundPosition:"center"}}>
      {v.cover&&<div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%,rgba(0,0,0,0.7))"}}/>}
      <div style={{position:"absolute",top:12,left:12,zIndex:2}}><BackButton onClick={onBack} /></div>
      <div className="vp-av" style={v.logo?{overflow:"hidden",padding:0}:{}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:v.avatar}</div>
      <h2 style={{fontSize:20,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6,position:"relative",zIndex:1}}>{v.name}{v.verified&&<span style={{fontSize:14}}>✓</span>}</h2>
      <p style={{fontSize:12,opacity:.7,marginTop:3,position:"relative",zIndex:1}}>📍 {v.loc}</p>
    </div>

    {/* Stats — clickable to switch tabs */}
    <div className="vp-stats">
      <div className={`vps r`} onClick={()=>setTab("reviews")} style={{cursor:"pointer",borderBottom:tab==="reviews"?"2px solid #6366F1":"2px solid transparent",transition:"all .2s"}}>
        <div className="vsi">⭐</div><b>{v.rating||avgRating.toFixed(1)}</b><span>Note</span>
      </div>
      <div className={`vps p`} onClick={()=>setTab("products")} style={{cursor:"pointer",borderBottom:tab==="products"?"2px solid #6366F1":"2px solid transparent",transition:"all .2s"}}>
        <div className="vsi">🛍️</div><b>{vp.length||v.products}</b><span>Produits</span>
      </div>
      <div className={`vps f`} onClick={()=>setTab("followers")} style={{cursor:"pointer",borderBottom:tab==="followers"?"2px solid #6366F1":"2px solid transparent",transition:"all .2s"}}>
        <div className="vsi">👥</div><b>{fCount}</b><span>Abonnés</span>
      </div>
    </div>

    {/* Description */}
    <div style={{padding:"0 16px",fontSize:14,color:"var(--sub)",marginBottom:14,lineHeight:1.6}}>{v.desc}</div>

    {/* Buttons */}
    <div className="vp-btns">
      <button className="vb1" style={following?{background:"var(--card)",color:"#6366F1",border:"1px solid #6366F1"}:{}} onClick={toggleFollow}>{following?"✓ Suivi":"+ Suivre"}</button>
      <button className="vb2" onClick={()=>go("chatVendor",v)}>💬 Contacter</button><button className="vb2" style={{flex:"none",width:44}} onClick={()=>shareVendor(v)}>📤</button>
    </div>

    {/* Vendor promo banner */}
    {v.promo&&<div style={{margin:"0 20px 14px",padding:14,background:"linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.04))",border:"1px solid rgba(16,185,129,0.15)",borderRadius:16,display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:44,height:44,borderRadius:12,background:"#10B981",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16,flexShrink:0}}>-{v.promo.discount}%</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:700,color:"#10B981"}}>{v.promo.name}</div>
        <div style={{fontSize:11,color:"var(--muted)"}}>Sur tous les articles · Jusqu'au {v.promo.ends}</div>
      </div>
      <span style={{fontSize:20}}>🏷️</span>
    </div>}

    {/* Tab bar */}
    <div style={{display:"flex",borderBottom:"1px solid var(--border)",margin:"0 20px 14px"}}>
      {[["products","🛍️ Produits"],["reviews","⭐ Avis"],["followers","👥 Abonnés"]].map(([k,l])=>(
        <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"10px 0",border:"none",borderBottom:tab===k?"2px solid #6366F1":"2px solid transparent",background:"transparent",fontSize:12,fontWeight:tab===k?700:500,color:tab===k?"#6366F1":"#908C82",cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>{l}</button>
      ))}
    </div>

    {/* ═══ PRODUCTS TAB (default) ═══ */}
    {tab==="products"&&<>
      <div style={{padding:"0 16px",marginBottom:10}}><div style={{fontSize:12,color:"var(--muted)"}}>{vp.length} articles disponibles</div></div>
      <div className="pgrid">{vp.map(p=>{const vpromo=getVendorPromo(p,VENDORS);return(<div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>{vpromo&&<span className="badge">-{vpromo.promoDiscount}%</span>}{!vpromo&&disc(p)>0&&<span className="badge">-{disc(p)}%</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pp">{vpromo?<><span style={{color:"#10B981"}}>{fmt(vpromo.promoPrice)}</span><span className="po">{fmt(p.price)}</span></>:<>{fmt(p.price)}</>}</div><div className="pr">⭐ {p.rating}</div></div></div>)})}</div>
      {vp.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36}}>📦</div><div style={{fontSize:13,color:"var(--muted)",marginTop:8}}>Aucun article pour le moment</div></div>}
    </>}

    {/* ═══ REVIEWS TAB ═══ */}
    {tab==="reviews"&&<div style={{padding:"0 16px 80px"}}>
      {/* Rating summary */}
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontSize:36,fontWeight:700}}>{avgRating.toFixed(1)}</div>
        <div style={{fontSize:16,color:"#F59E0B",marginBottom:2}}>{"★".repeat(Math.floor(avgRating))}{"☆".repeat(5-Math.floor(avgRating))}</div>
        <div style={{fontSize:12,color:"var(--muted)"}}>{MOCK_REVIEWS.length} avis vérifiés</div>
      </div>

      {MOCK_REVIEWS.map((r,i)=><div key={i} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:36,height:36,borderRadius:10,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{r.avatar}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700}}>{r.name}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>{r.date} · {r.product}</div>
          </div>
          <div style={{fontSize:12,color:"#F59E0B"}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
        </div>
        <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.5,margin:0}}>{r.text}</p>
        {r.photos&&r.photos.length>0&&<div style={{display:"flex",gap:6,marginTop:8}}>
          {r.photos.map((ph,j)=><img key={j} src={ph} alt="" onClick={()=>setViewImg(ph)} style={{width:56,height:56,borderRadius:10,objectFit:"cover",cursor:"pointer",border:"1px solid var(--border)"}}/>)}
        </div>}
      </div>)}
    </div>}

    {/* ═══ FOLLOWERS TAB ═══ */}
    {tab==="followers"&&<div style={{padding:"0 16px 80px"}}>
      <div style={{fontSize:12,color:"var(--muted)",marginBottom:14}}>{fCount} abonnés</div>
      {MOCK_FOLLOWERS.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<MOCK_FOLLOWERS.length-1?"1px solid #F5F4F1":"none"}}>
        <div style={{width:42,height:42,borderRadius:12,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}><img src={f.avatar} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600}}>{f.name}</div>
          <div style={{fontSize:11,color:"var(--muted)"}}>📍 {f.zone} · Depuis {f.since}</div>
        </div>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#10B981",flexShrink:0}} title="En ligne"/>
      </div>)}
    </div>}

    {/* Image fullscreen viewer */}
    {viewImg&&<div onClick={()=>setViewImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:20}}>
      <img src={viewImg} alt="" style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:12,objectFit:"contain"}}/>
    </div>}
  </div>);
}

export default VendorScr;
