import { useState } from "react";
import { useGuestGate } from "../../hooks/useGuestGate";
import toast from "../../utils/toast";
import { useData } from "../../hooks";
import Img from "../../components/Img";
import BackButton from "../../components/BackButton";
import { fmt, disc, getVendorPromo } from "../../utils/helpers";
import { shareVendor } from "../../utils/share";
import Icon from "../../components/Icon";

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
  {name:"Grace M.",avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",rating:5,text:"Le sac est magnifique ! Cuir de très bonne qualité, je suis ravie.",date:"20 Jan 2026",product:"Sac à Main Cuir",photos:["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop"]},
];

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
  const toggleFollow=()=>{setFollowing(f=>!f);setFC(c=>following?c-1:c+1);toast.success(following?"Désabonné":"Abonné")};

  const avgRating=MOCK_REVIEWS.reduce((s,r)=>s+r.rating,0)/MOCK_REVIEWS.length;

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
      {[["products","️ Produits"],["reviews","Avis"],["followers","Abonnés"]].map(([k,l])=>(
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
        <div style={{fontSize:12,color:"var(--muted)"}}>{MOCK_REVIEWS.length} avis vérifiés</div>
      </div>

      {MOCK_REVIEWS.map((r,i)=><div key={i} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:36,height:36,borderRadius:10,overflow:"hidden",flexShrink:0}}>{r.avatar?.startsWith("http")?<img src={r.avatar} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{width:"100%",height:"100%",background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{r.avatar}</div>}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700}}>{r.name}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>{r.date} · {r.product}</div>
          </div>
          <div style={{fontSize:12,color:"#F59E0B"}}>{"⭐".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
        </div>
        <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.5,margin:0}}>{r.text}</p>
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
        
        {/* Live indicator pulsing */}
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:"rgba(16,185,129,0.08)",borderRadius:10,border:"1px solid rgba(16,185,129,0.15)"}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#10B981",animation:"pulse-dot 1.5s ease-in-out infinite",flexShrink:0}}/>
          <span style={{fontSize:11,color:"#047857",fontWeight:600}}>892 en ligne · 47 viennent de commander</span>
        </div>
      </div>

      {/* TOP CLIENTS - VIP / FAN / RÉGULIER */}
      <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:0.5,margin:"4px 0 10px"}}>TOP CLIENTS FIDÈLES</div>
      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden",marginBottom:16}}>
        {/* VIP - David Tsaty */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:"0.5px solid var(--border)"}}>
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",border:"2px solid #F59E0B"}}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
            <div style={{position:"absolute",bottom:-2,right:-2,width:20,height:20,borderRadius:"50%",background:"linear-gradient(135deg, #FBBF24, #F59E0B)",border:"2px solid var(--card)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="crown" size={10} color="#fff"/>
            </div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>David Tsaty</div>
            <div style={{fontSize:10,color:"#B45309",display:"flex",alignItems:"center",gap:4,marginTop:2}}>
              <Icon name="crown" size={10} color="#B45309"/>Fan #1 · 127 commandes · 2 ans
            </div>
          </div>
          <span style={{fontSize:9,padding:"3px 8px",background:"rgba(245,158,11,0.12)",color:"#B45309",borderRadius:5,fontWeight:700,flexShrink:0}}>VIP</span>
        </div>
        
        {/* FAN - Marie Ngoma */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:"0.5px solid var(--border)"}}>
          <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",flexShrink:0,border:"2px solid rgba(239,68,68,0.2)"}}>
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>Marie Ngoma</div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>84 commandes · Depuis 1 an</div>
          </div>
          <span style={{fontSize:9,padding:"3px 8px",background:"rgba(239,68,68,0.1)",color:"#B91C1C",borderRadius:5,fontWeight:700,flexShrink:0}}>FAN</span>
        </div>
        
        {/* RÉGULIER - Jean-Paul */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:"0.5px solid var(--border)"}}>
          <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",flexShrink:0,border:"2px solid rgba(59,130,246,0.2)"}}>
            <img src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>Jean-Paul Nkaya</div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>62 commandes · Depuis 8 mois</div>
          </div>
          <span style={{fontSize:9,padding:"3px 8px",background:"rgba(59,130,246,0.1)",color:"#1D4ED8",borderRadius:5,fontWeight:700,flexShrink:0}}>RÉGULIER</span>
        </div>

        {/* RÉGULIER - Patrick */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px"}}>
          <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",flexShrink:0,border:"2px solid rgba(16,185,129,0.2)"}}>
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>Patrick Mbemba</div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>38 commandes · Depuis 6 mois</div>
          </div>
          <span style={{fontSize:9,padding:"3px 8px",background:"rgba(16,185,129,0.1)",color:"#047857",borderRadius:5,fontWeight:700,flexShrink:0}}>RÉGULIER</span>
        </div>
      </div>

      {/* ACTIVITÉ RÉCENTE - Live feed */}
      <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:0.5,margin:"4px 0 10px",display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#10B981",animation:"pulse-dot 1.5s ease-in-out infinite"}}/>
        ACTIVITÉ EN DIRECT
      </div>
      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden",marginBottom:16}}>
        {[
          {avatar:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face",name:"Marie K.",action:"vient de commander la Robe Wax",time:"il y a 2 min",color:"#F97316",icon:"package"},
          {avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",name:"Patrick M.",action:"a laissé un avis ⭐⭐⭐⭐⭐",time:"il y a 8 min",color:"#F59E0B",icon:"star_full"},
          {avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",name:"Celine N.",action:"s'est abonnée",time:"il y a 15 min",color:"#10B981",icon:"plus"},
          {avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",name:"Grace M.",action:"a ajouté 3 articles aux favoris",time:"il y a 22 min",color:"#EF4444",icon:"heart"},
          {avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",name:"Alain M.",action:"a partagé un produit",time:"il y a 35 min",color:"#8B5CF6",icon:"share"},
        ].map((a,i,arr)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",borderBottom:i<arr.length-1?"0.5px solid var(--border)":"none"}}>
            <div style={{position:"relative",flexShrink:0}}>
              <div style={{width:34,height:34,borderRadius:"50%",overflow:"hidden"}}>
                <img src={a.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <div style={{position:"absolute",bottom:-2,right:-2,width:16,height:16,borderRadius:"50%",background:a.color,border:"2px solid var(--card)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
                <Icon name={a.icon} size={8} color="#fff"/>
              </div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,color:"var(--text)",lineHeight:1.4}}><b style={{fontWeight:700}}>{a.name}</b> {a.action}</div>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* NOUVEAUX ABONNÉS - Avatar stack */}
      <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:0.5,margin:"4px 0 10px"}}>NOUVEAUX ABONNÉS · 247 CETTE SEMAINE</div>
      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,padding:14}}>
        <div style={{display:"flex",alignItems:"center",gap:6,overflowX:"auto",scrollbarWidth:"none"}} className="hide-scroll">
          {MOCK_FOLLOWERS.slice(0,7).map((f,i)=>(
            <div key={i} style={{position:"relative",flexShrink:0}}>
              <div style={{width:42,height:42,borderRadius:"50%",overflow:"hidden",border:"2px solid var(--card)"}}>
                <img src={f.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              {i<3 && <div style={{position:"absolute",bottom:0,right:0,width:11,height:11,borderRadius:"50%",background:"#10B981",border:"2px solid var(--card)"}}/>}
            </div>
          ))}
          <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(249,115,22,0.1)",border:"2px dashed rgba(249,115,22,0.3)",display:"flex",alignItems:"center",justifyContent:"center",color:"#F97316",fontSize:10,fontWeight:700,flexShrink:0}}>+240</div>
        </div>
        <div style={{fontSize:11,color:"var(--muted)",marginTop:10,textAlign:"center"}}>3 personnes que vous suivez aiment cette boutique</div>
      </div>
    </div>}

    {/* Image fullscreen viewer */}
    {viewImg&&<div onClick={()=>setViewImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:20}}>
      <img src={viewImg} alt="" style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:12,objectFit:"contain"}}/>
    </div>}
    <GateUI/>
  </div>);
}

export default VendorScr;
