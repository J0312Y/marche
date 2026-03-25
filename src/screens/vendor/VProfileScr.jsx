import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import { VENDOR_LOGO_DEFAULT } from "../../data/images";

function VProfileScr({go,onSwitch,vendorPlan,onLogout}){
  const planInfo=vendorPlan==="starter"?{name:"Starter",color:"var(--muted)",badge:"Gratuit",icon:"🆓"}:vendorPlan==="pro"?{name:"Pro",color:"#F97316",badge:"Pro ✓",icon:"⭐"}:{name:"Enterprise",color:"#F59E0B",badge:"Enterprise ★",icon:"🚀"};
  const [lockPopup,setLockPopup]=useState(null);
  const isPro=vendorPlan!=="starter";
  const isEnt=vendorPlan==="enterprise";

  const Item=({icon,label,info,onClick,locked,plan})=>(
    <div onClick={locked?()=>handleLocked({icon,title:label,requiredPlan:plan}):onClick} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",cursor:"pointer",borderBottom:"1px solid var(--border)",opacity:locked?.6:1}}>
      <span style={{fontSize:20,width:22,textAlign:"center"}}>{icon}</span>
      <span style={{flex:1,fontSize:14,fontWeight:500,color:"var(--text)"}}>{label}</span>
      {info&&<span style={{fontSize:12,color:"var(--muted)",fontWeight:500}}>{info}</span>}
      {locked?<span style={{padding:"2px 8px",borderRadius:6,background:plan==="enterprise"?"rgba(245,158,11,0.08)":"rgba(249,115,22,0.08)",color:plan==="enterprise"?"#F59E0B":"#F97316",fontSize:9,fontWeight:700}}>🔒 {plan==="enterprise"?"Enterprise":"Pro"}</span>
      :<svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{flexShrink:0,opacity:.3}}><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );

  const Section=({icon,title,children})=>(
    <div style={{marginBottom:12}}>
      <div style={{padding:"12px 16px 6px",fontSize:12,fontWeight:700,color:"var(--muted)",letterSpacing:.5}}>{icon} {title}</div>
      <div style={{margin:"0 16px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden"}}>
        {children}
      </div>
    </div>
  );

  const handleLocked=(item)=>setLockPopup(item);

  return(<PullToRefresh onRefresh={async()=>{toast.success("Espace actualisé 🏪")}}><div className="scr" style={{paddingBottom:20}}>
    <div className="appbar"><h2>Mon Espace</h2><button onClick={()=>go("vSettings")}>⚙️</button></div>

    {/* Profile header */}
    <div className="vs-header">
      <div className="vs-logo" style={{overflow:"hidden",padding:0}}><img src={VENDOR_LOGO_DEFAULT} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
      <h3 style={{fontSize:18,fontWeight:700}}>Mon Commerce</h3>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:20,background:isEnt?"rgba(245,158,11,0.08)":isPro?"rgba(249,115,22,0.08)":"var(--light)",marginTop:6}}>
        <span style={{fontSize:12}}>{planInfo.icon}</span>
        <span style={{fontSize:12,fontWeight:700,color:planInfo.color}}>Plan {planInfo.badge}</span>
      </div>
    </div>

    {/* Wallet */}
    <div className="wallet" style={{margin:"0 16px 14px"}}><div><p style={{fontSize:11,color:"var(--muted)"}}>Solde disponible</p><h3 style={{fontSize:20,fontWeight:700,marginTop:2}}>457 800 FCFA</h3></div><button onClick={()=>go("vWallet")}>Retirer</button></div>

    {/* ═══ VENTES & COMMANDES ═══ */}
    <Section icon="📦" title="VENTES & COMMANDES">
      <Item icon="📊" label="Statistiques" info={isPro?"Analytics":"—"} onClick={isPro?()=>go("vStats"):null} locked={!isPro} plan="pro"/>
      <Item icon="⭐" label="Avis clients" info="4.6 / 5" onClick={()=>go("vReviews")}/>
      <Item icon="❓" label="Questions clients" info="3" onClick={()=>go("vQA")}/>
      <Item icon="↩️" label="Retours" info="1" onClick={()=>go("vReturns")}/>
      <Item icon="🧾" label="Factures" info="3" onClick={()=>go("vInvoice")}/>
      <Item icon="📅" label="Calendrier" info="Agenda" onClick={()=>go("vCalendar")}/>
    </Section>

    {/* ═══ PRODUITS & STOCK ═══ */}
    <Section icon="🛍️" title="PRODUITS & STOCK">
      <Item icon="📦" label="Gestion Stock" info="2 alertes" onClick={()=>go("vStock")}/>
      <Item icon="🏷️" label="Promotions" info={isPro?"2 actives":"—"} onClick={isPro?()=>go("vPromos"):null} locked={!isPro} plan="pro"/>
      <Item icon="📸" label="Stories" info="2 actives" onClick={()=>go("vStories")}/>
      <Item icon="👥" label="Achats groupés" info="2 offres" onClick={()=>go("vGroupBuy")}/>
      <Item icon="💰" label="Remises auto" info={isEnt?"3 règles":"—"} onClick={isEnt?()=>go("vAutoDiscount"):null} locked={!isEnt} plan="enterprise"/>
    </Section>

    {/* ═══ MARKETING & CROISSANCE ═══ */}
    <Section icon="📈" title="MARKETING & CROISSANCE">
      <Item icon="📺" label="Live Shopping" info={isPro?"En direct":"—"} onClick={isPro?()=>go("vLive"):null} locked={!isPro} plan="pro"/>
      <Item icon="📢" label="Publicités" info={isPro?"2 campagnes":"—"} onClick={isPro?()=>go("vAds"):null} locked={!isPro} plan="pro"/>
      <Item icon="🏆" label="Classement" info={isPro?"#6":"—"} onClick={isPro?()=>go("vRanking"):null} locked={!isPro} plan="pro"/>
      <Item icon="🤖" label="IA Description" info={isPro?"Auto":"—"} onClick={isPro?()=>go("vAIDesc"):null} locked={!isPro} plan="pro"/>
      <Item icon="📊" label="Business Advisor" info={isPro?"Conseils":"—"} onClick={isPro?()=>go("vAdvisor"):null} locked={!isPro} plan="pro"/>
      <Item icon="📧" label="Email Marketing" info={isEnt?"Campagnes":"—"} onClick={isEnt?()=>go("vEmail"):null} locked={!isEnt} plan="enterprise"/>
    </Section>

    {/* ═══ BOUTIQUE EN LIGNE ═══ */}
    <Section icon="🌐" title="BOUTIQUE EN LIGNE">
      <Item icon="💎" label="Boutique certifiée" info={isEnt?"Or/Diamant":"—"} onClick={isEnt?()=>go("vCertified"):null} locked={!isEnt} plan="enterprise"/>
      <Item icon="🌟" label="Thèmes" info={isEnt?"5 thèmes":"—"} onClick={isEnt?()=>go("vThemes"):null} locked={!isEnt} plan="enterprise"/>
      <Item icon="🌐" label="Mon site web" info={isEnt?"En ligne ✅":"—"} onClick={isEnt?()=>go("vWebsite"):null} locked={!isEnt} plan="enterprise"/>
      <Item icon="🔗" label="Domaine" info={isEnt?".lamuka.cg":"—"} onClick={isEnt?()=>go("vDomain"):null} locked={!isEnt} plan="enterprise"/>
      <Item icon="🌍" label="SEO produits" info={isEnt?"Optimisé":"—"} onClick={isEnt?()=>go("vSeo"):null} locked={!isEnt} plan="enterprise"/>
      <Item icon="📱" label="QR Code" info="Partager" onClick={()=>go("vQRCode")}/>
    </Section>

    {/* ═══ LOGISTIQUE ═══ */}
    <Section icon="🚚" title="LOGISTIQUE">
      <Item icon="🚚" label="Livraison" info="3 livreurs" onClick={()=>go("vDelivery")}/>
      <Item icon="🏬" label="Établissements" info={isEnt?"3":"—"} onClick={isEnt?()=>go("vShops"):null} locked={!isEnt} plan="enterprise"/>
      <Item icon="📤" label="Import / Export" info={isEnt?"CSV":"—"} onClick={isEnt?()=>go("vImport"):null} locked={!isEnt} plan="enterprise"/>
    </Section>

    {/* ═══ OUTILS & TECHNIQUE ═══ */}
    <Section icon="🔧" title="OUTILS & SUPPORT">
      <Item icon="📄" label="Rapports" info={isPro?"Fév 2026":"—"} onClick={isPro?()=>go("vReports"):null} locked={!isPro} plan="pro"/>
      <Item icon="📊" label="Analytics avancés" info={isEnt?"Trafic":"—"} onClick={isEnt?()=>go("vAnalytics"):null} locked={!isEnt} plan="enterprise"/>
      <Item icon="🔌" label="API & Intégrations" info={isEnt?"Active":"—"} onClick={isEnt?()=>go("vApi"):null} locked={!isEnt} plan="enterprise"/>
      <Item icon="🤖" label="Assistant Lamu" info="IA" onClick={()=>go("vChatBot")}/>
      <Item icon="🆘" label="Support" info={isEnt?"Manager dédié":"Centre d'aide"} onClick={()=>go("vSupport")}/>
    </Section>

    {/* Upgrade banner */}
    {vendorPlan!=="enterprise"&&<div style={{margin:"0 16px 14px",padding:16,background:vendorPlan==="starter"?"rgba(249,115,22,0.04)":"rgba(245,158,11,0.04)",border:`1px solid ${vendorPlan==="starter"?"rgba(249,115,22,0.15)":"rgba(245,158,11,0.15)"}`,borderRadius:16,cursor:"pointer"}} onClick={()=>go("vUpgradePlan")}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:14,background:vendorPlan==="starter"?"linear-gradient(135deg,#F97316,#FB923C)":"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",flexShrink:0}}>⬆️</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:700,color:vendorPlan==="starter"?"#F97316":"#F59E0B"}}>Passer au plan {vendorPlan==="starter"?"Pro":"Enterprise"}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{vendorPlan==="starter"?"Analytics, promos, live shopping, IA...":"Multi-shops, API, site web, manager dédié..."}</div>
          <div style={{fontSize:12,fontWeight:700,color:vendorPlan==="starter"?"#F97316":"#F59E0B",marginTop:3}}>{vendorPlan==="starter"?"15 000":"45 000"} FCFA/mois →</div>
        </div>
      </div>
    </div>}

    {/* Switch + Logout */}
    <div style={{padding:"0 16px",display:"flex",gap:10,marginBottom:20}}>
      <button onClick={onSwitch} style={{flex:1,padding:12,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>🛍️ Mode Acheteur</button>
      <button onClick={onLogout} style={{flex:1,padding:12,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🚪 Déconnexion</button>
    </div>

    {/* Lock popup */}
    {lockPopup&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setLockPopup(null)}>
      <div style={{background:"var(--card)",borderRadius:20,padding:24,maxWidth:320,width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:48,marginBottom:10}}>🔒</div>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:6}}>{lockPopup.title}</h3>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:14,lineHeight:1.5}}>
          Cette fonctionnalité nécessite le plan <b style={{color:lockPopup.requiredPlan==="enterprise"?"#F59E0B":"#F97316"}}>{lockPopup.requiredPlan==="enterprise"?"Enterprise":"Pro"}</b>.
        </p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setLockPopup(null)} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Plus tard</button>
          <button onClick={()=>{setLockPopup(null);go("vUpgradePlan")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:lockPopup.requiredPlan==="enterprise"?"linear-gradient(135deg,#F59E0B,#D97706)":"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>⬆️ Upgrade</button>
        </div>
      </div>
    </div>}
  </div></PullToRefresh>);
}

export default VProfileScr;
