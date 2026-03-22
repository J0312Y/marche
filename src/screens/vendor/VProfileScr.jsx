import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";

import { VENDOR_LOGO_DEFAULT } from "../../data/images";
function VProfileScr({go,onSwitch,vendorPlan,onLogout}){
  const planInfo=vendorPlan==="starter"?{name:"Starter",color:"var(--muted)",badge:"Gratuit",icon:"🆓"}:vendorPlan==="pro"?{name:"Pro",color:"#6366F1",badge:"Pro ✓",icon:"⭐"}:{name:"Enterprise",color:"#F59E0B",badge:"Enterprise ★",icon:"🚀"};
  const [lockPopup,setLockPopup]=useState(null);

  const menu=[
    ["📊","Statistiques","Voir analytics",vendorPlan!=="starter"?()=>go("vStats"):null,"pro"],
    ["⭐","Avis clients","4.6 / 5",()=>go("vReviews"),null],
    ["❓","Questions clients","3 en attente",()=>go("vQA"),null],
    ["↩️","Retours","1 en attente",()=>go("vReturns"),null],
    ["📸","Stories","2 actives",()=>go("vStories"),null],
    ["👥","Achats groupés","2 offres",()=>go("vGroupBuy"),null],
    ["🏬","Mes établissements",vendorPlan==="enterprise"?"3 établissements":"Plan Enterprise requis",vendorPlan==="enterprise"?()=>go("vShops"):null,"enterprise"],
    ["🏷️","Promotions",vendorPlan==="starter"?"Plan Pro requis":"2 actives",vendorPlan!=="starter"?()=>go("vPromos"):null,"pro"],
    ["🚚","Livraison","3 livreurs",()=>go("vDelivery"),null],
    ["📄","Rapports",vendorPlan==="starter"?"Plan Pro requis":"Février 2026",vendorPlan!=="starter"?()=>go("vReports"):null,"pro"],
    ["📱","QR Code boutique","Imprimer / Partager",()=>go("vQRCode"),null],
    ["🌐","Mon site web",vendorPlan==="enterprise"?"En ligne ✅":"Plan Enterprise requis",vendorPlan==="enterprise"?()=>go("vWebsite"):null,"enterprise"],
    ["🔌","API & Intégrations",vendorPlan==="enterprise"?"Clé active":"Plan Enterprise requis",vendorPlan==="enterprise"?()=>go("vApi"):null,"enterprise"],
    ["🆘","Support",vendorPlan==="enterprise"?"Manager dédié":"Centre d'aide",()=>go("vSupport"),null],
  ];

  const handleLocked=(item)=>{
    const [icon,title,,, requiredPlan]=item;
    setLockPopup({icon,title,requiredPlan});
  };

  return(<PullToRefresh onRefresh={async()=>{toast.success("Espace actualisé 🏪")}}><div className="scr" style={{paddingBottom:80}}>
    <div className="appbar"><h2>Mon Espace</h2><button onClick={()=>go("vSettings")}>⚙️</button></div>

    {/* Profile + Plan card */}
    <div className="vs-header">
      <div className="vs-logo" style={{overflow:"hidden",padding:0}}><img src={VENDOR_LOGO_DEFAULT} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
      <h3 style={{fontSize:18,fontWeight:700}}>Mon Commerce</h3>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:20,background:vendorPlan==="enterprise"?"rgba(245,158,11,0.08)":vendorPlan==="pro"?"rgba(99,102,241,0.08)":"var(--light)",marginTop:6}}>
        <span style={{fontSize:12}}>{planInfo.icon}</span>
        <span style={{fontSize:12,fontWeight:700,color:planInfo.color}}>Plan {planInfo.badge}</span>
      </div>
    </div>

    {/* Plan features summary */}
    <div style={{margin:"0 16px 12px",padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14}}>
      <div style={{fontSize:12,fontWeight:700,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>Votre plan inclut :</span>
        {vendorPlan!=="enterprise"&&<span style={{fontSize:11,color:"#6366F1",cursor:"pointer",fontWeight:600}} onClick={()=>go("vUpgradePlan")}>Voir les plans →</span>}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {vendorPlan==="starter"&&["10 articles","8% commission","Support email","Stats basiques"].map(f=><span key={f} style={{padding:"3px 8px",borderRadius:6,background:"var(--light)",fontSize:10,fontWeight:500,color:"var(--sub)"}}>✓ {f}</span>)}
        {vendorPlan==="pro"&&["Articles illimités","4% commission","Analytics","Badge ✓","Promos","Rapports"].map(f=><span key={f} style={{padding:"3px 8px",borderRadius:6,background:"rgba(99,102,241,0.06)",fontSize:10,fontWeight:500,color:"#6366F1"}}>✓ {f}</span>)}
        {vendorPlan==="enterprise"&&["Multi-shops","2% commission","API","Site web","Manager","Dashboard","Rapports"].map(f=><span key={f} style={{padding:"3px 8px",borderRadius:6,background:"rgba(245,158,11,0.06)",fontSize:10,fontWeight:500,color:"#F59E0B"}}>✓ {f}</span>)}
      </div>
    </div>

    {/* Wallet */}
    <div className="wallet" style={{margin:"0 16px 12px"}}><div><p style={{fontSize:11,opacity:.7}}>Solde disponible</p><h3 style={{fontSize:20,fontWeight:700,marginTop:2}}>457 800 FCFA</h3></div><button onClick={()=>go("vWallet")}>Retirer</button></div>

    {/* Menu items */}
    {menu.map(([icon,title,subtitle,fn,requiredPlan])=>{
      const locked=!fn;
      return(<div key={title} className="menu-item" onClick={locked?()=>handleLocked([icon,title,subtitle,fn,requiredPlan]):fn} style={locked?{opacity:.6,cursor:"pointer"}:{cursor:"pointer"}}>
        <div className="mi-i">{icon}</div>
        <span className="mi-t">{title}</span>
        <span className="mi-s">{subtitle}</span>
        {locked?<span style={{padding:"3px 10px",borderRadius:8,background:requiredPlan==="enterprise"?"rgba(245,158,11,0.08)":"rgba(99,102,241,0.08)",color:requiredPlan==="enterprise"?"#F59E0B":"#6366F1",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",gap:3}}>🔒 {requiredPlan==="enterprise"?"Enterprise":"Pro"}</span>
        :<span className="mi-c">›</span>}
      </div>);
    })}

    {/* Upgrade banner */}
    {vendorPlan==="starter"&&<div style={{margin:"14px 16px",padding:16,background:"linear-gradient(135deg,rgba(99,102,241,0.06),rgba(168,85,247,0.06))",border:"1px solid rgba(99,102,241,0.15)",borderRadius:16,cursor:"pointer"}} onClick={()=>go("vUpgradePlan")}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",flexShrink:0}}>⬆️</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:700,color:"#6366F1"}}>Passer au plan Pro</div>
          <div style={{fontSize:11,color:"var(--sub)",marginTop:2,lineHeight:1.4}}>Analytics, promotions, rapports, badge vérifié ✓ et plus.</div>
          <div style={{fontSize:12,fontWeight:700,color:"#6366F1",marginTop:4}}>15 000 FCFA/mois →</div>
        </div>
      </div>
    </div>}

    {vendorPlan==="pro"&&<div style={{margin:"14px 16px",padding:16,background:"linear-gradient(135deg,rgba(245,158,11,0.06),rgba(217,119,6,0.06))",border:"1px solid rgba(245,158,11,0.15)",borderRadius:16,cursor:"pointer"}} onClick={()=>go("vUpgradePlan")}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",flexShrink:0}}>🚀</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Passer au plan Enterprise</div>
          <div style={{fontSize:11,color:"var(--sub)",marginTop:2,lineHeight:1.4}}>Multi-shops, site web, API, manager dédié, 2% commission.</div>
          <div style={{fontSize:12,fontWeight:700,color:"#F59E0B",marginTop:4}}>45 000 FCFA/mois →</div>
        </div>
      </div>
    </div>}

    {vendorPlan==="enterprise"&&<div style={{margin:"14px 16px",padding:12,background:"rgba(245,158,11,0.04)",border:"1px solid rgba(245,158,11,0.1)",borderRadius:14,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:18}}>🚀</span>
      <div style={{fontSize:12,color:"#F59E0B",fontWeight:600}}>Plan Enterprise actif — Toutes les fonctionnalités débloquées</div>
    </div>}

    {/* Switch mode */}
    <div className="vendor-cta" style={{background:"linear-gradient(135deg,#3B82F6,#1D4ED8)"}} onClick={onSwitch}><span style={{fontSize:28}}>🛍️</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Passer en mode Acheteur</div><div style={{fontSize:12,opacity:.8,marginTop:2}}>Retourner au marketplace</div></div><span style={{fontSize:18}}>→</span></div>

    {/* Logout */}
    <button style={{margin:"0 16px 80px",width:"calc(100% - 32px)",padding:12,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onLogout}>🚪 Déconnexion</button>

    {/* Lock popup */}
    {lockPopup&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setLockPopup(null)}>
      <div style={{background:"var(--card)",borderRadius:20,padding:24,maxWidth:320,width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:48,marginBottom:10}}>🔒</div>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:6}}>{lockPopup.title}</h3>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:6,lineHeight:1.5}}>
          Cette fonctionnalité nécessite le plan <b style={{color:lockPopup.requiredPlan==="enterprise"?"#F59E0B":"#6366F1"}}>{lockPopup.requiredPlan==="enterprise"?"Enterprise":"Pro"}</b>.
        </p>
        <div style={{padding:10,background:"var(--light)",borderRadius:12,marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:"var(--sub)"}}>
            {lockPopup.requiredPlan==="enterprise"?"🚀 Enterprise — 45 000 FCFA/mois":"⭐ Pro — 15 000 FCFA/mois"}
          </div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>
            {lockPopup.requiredPlan==="enterprise"
              ?"Multi-shops, site web, API, manager dédié, 2% commission"
              :"Articles illimités, analytics, promotions, rapports, badge ✓"}
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setLockPopup(null)} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Plus tard</button>
          <button onClick={()=>{setLockPopup(null);go("vUpgradePlan")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:lockPopup.requiredPlan==="enterprise"?"linear-gradient(135deg,#F59E0B,#D97706)":"linear-gradient(135deg,#6366F1,#A855F7)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>⬆️ Upgrade</button>
        </div>
      </div>
    </div>}
  </div></PullToRefresh>);
}

export default VProfileScr;
