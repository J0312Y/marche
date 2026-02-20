

function VProfileScr({go,onSwitch,vendorPlan,onLogout}){
  const planInfo=vendorPlan==="starter"?{name:"Starter",color:"#908C82",badge:"Gratuit"}:vendorPlan==="pro"?{name:"Pro",color:"#6366F1",badge:"Pro ✓"}:{name:"Enterprise",color:"#F59E0B",badge:"Enterprise ★"};
  return(<div className="scr">
    <div className="appbar"><h2>Mon Espace</h2><button onClick={()=>go("vSettings")}>⚙️</button></div>
    <div className="vs-header"><div className="vs-logo">👔</div><h3 style={{fontSize:18,fontWeight:700}}>Mon Commerce</h3><p style={{fontSize:12,color:"#908C82"}}>Plan <span style={{color:planInfo.color,fontWeight:700}}>{planInfo.badge}</span></p></div>
    <div className="wallet" style={{margin:"0 20px 16px"}}><div><p style={{fontSize:11,opacity:.7}}>Solde disponible</p><h3 style={{fontSize:20,fontWeight:700,marginTop:2}}>457 800 FCFA</h3></div><button onClick={()=>go("vWallet")}>Retirer</button></div>
    {[["📊","Statistiques","Voir analytics",vendorPlan!=="starter"?()=>go("vStats"):null],["⭐","Avis clients","4.6 / 5",()=>go("vReviews")],["🏬","Mes établissements",vendorPlan==="enterprise"?"3 établissements":"Plan Enterprise requis",vendorPlan==="enterprise"?()=>go("vShops"):null],["🏷️","Promotions",vendorPlan==="starter"?"Plan Pro requis":"2 actives",vendorPlan!=="starter"?()=>go("vPromos"):null],["🚚","Livraison","3 livreurs",()=>go("vDelivery")],["📄","Rapports",vendorPlan==="starter"?"Plan Pro requis":"Février 2026",vendorPlan!=="starter"?()=>go("vReports"):null],["🔌","API & Intégrations",vendorPlan==="enterprise"?"Clé active":"Plan Enterprise requis",vendorPlan==="enterprise"?()=>go("vApi"):null],["🆘","Support",vendorPlan==="enterprise"?"Manager dédié":"Centre d'aide",()=>go("vSupport")]].map(([i,t,s,fn])=><div key={t} className="menu-item" onClick={fn||undefined} style={!fn?{opacity:.5}:{}}><div className="mi-i">{i}</div><span className="mi-t">{t}</span><span className="mi-s">{s}</span>{fn?<span className="mi-c">›</span>:!fn&&<span style={{padding:"2px 8px",borderRadius:6,background:"rgba(239,68,68,0.08)",color:"#EF4444",fontSize:9,fontWeight:700}}>🔒</span>}</div>)}
    {vendorPlan==="starter"&&<div style={{margin:"0 20px 14px",padding:14,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:14,cursor:"pointer"}} onClick={()=>go("vUpgradePlan")}>
      <div style={{fontSize:13,fontWeight:700,color:"#6366F1"}}>⬆️ Passer au plan Pro</div>
      <div style={{fontSize:11,color:"#5E5B53",marginTop:4}}>Débloquez les analytics, promotions, rapports et le badge vérifié.</div>
    </div>}
    <div className="vendor-cta" style={{background:"linear-gradient(135deg,#3B82F6,#1D4ED8)"}} onClick={onSwitch}><span style={{fontSize:28}}>🛍️</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Passer en mode Acheteur</div><div style={{fontSize:12,opacity:.8,marginTop:2}}>Retourner au marketplace</div></div><span style={{fontSize:18}}>→</span></div>
    <button style={{margin:"0 20px 80px",width:"calc(100% - 40px)",padding:14,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onLogout}>🚪 Déconnexion</button>
  </div>);
}

/* V18 ── MULTI-SHOP MANAGEMENT (Enterprise) ── */

export default VProfileScr;
