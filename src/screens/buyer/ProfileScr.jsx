
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import t from "../../utils/i18n";

import { USER_AVATAR } from "../../data/images";
function ProfileScr({go,userRole,vendorPlan,vendorStatus,driverStatus,onLogout,onRoleApproved}){
  const hasVendor=(userRole==="vendor"||userRole==="both")&&vendorStatus==="approved";
  const hasDriver=(userRole==="driver"||userRole==="both")&&driverStatus==="approved";

  const Section=({title,children})=>(
    <div style={{margin:"0 20px 14px"}}>
      <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,padding:"0 4px 8px"}}>{title}</div>
      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden"}} className="prof-section">
        {children}
      </div>
    </div>
  );

  const Item=({icon,label,info,onClick})=>(
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",cursor:"pointer",borderBottom:"1px solid var(--border)"}}>
      <span style={{fontSize:20,width:22,textAlign:"center"}}>{icon}</span>
      <span style={{flex:1,fontSize:14,fontWeight:500,color:"var(--text)"}}>{label}</span>
      {info&&<span style={{fontSize:12,color:"var(--muted)",fontWeight:500}}>{info}</span>}
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{flexShrink:0,opacity:.3}}><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );

  return(<PullToRefresh onRefresh={async()=>{toast.success("Profil actualisé 👤")}}><div className="scr">
    <div className="appbar"><h2>Mon Profil</h2><div style={{width:38}}/></div>

    {/* ── Avatar + Name ── */}
    <div onClick={()=>go("editProfile")} style={{margin:"0 20px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
      <div style={{width:56,height:56,borderRadius:18,overflow:"hidden",flexShrink:0,border:"2px solid var(--border)"}}>
        <img src={USER_AVATAR} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:18,fontWeight:700}}>Joeldy Tsina</div>
        <div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>+242 064 663 469</div>
      </div>
      <span style={{color:"var(--muted)",fontSize:13}}>✏️</span>
    </div>

    {/* ── Wallet ── */}
    <div className="wallet-card" onClick={()=>go("recharge")}>
      <div className="wc-bg"/>
      <div className="wc-content">
        <div className="wc-top"><div className="wc-logo">K</div><span className="wc-label">Kolo Pay</span></div>
        <div className="wc-balance"><span className="wc-amt">125 000</span><span className="wc-cur">FCFA</span></div>
        <div className="wc-bottom"><span className="wc-num">•••• •••• 4663</span><button className="wc-btn" onClick={e=>{e.stopPropagation();go("recharge")}}>+ Recharger</button></div>
      </div>
    </div>

    {/* ── Pending status ── */}

    {/* ── CTA vendeur/livreur ── */}
    {vendorStatus==="pending"&&<div style={{margin:"0 20px 10px",padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>⏳</span><div><div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Demande commerçant en attente</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Vérification sous 24-48h</div></div></div>
    </div>}
    {driverStatus==="pending"&&<div style={{margin:"0 20px 10px",padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>⏳</span><div><div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Demande livreur en attente</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Vérification sous 24-48h</div></div></div>
    </div>}
    {vendorStatus!=="pending"&&driverStatus!=="pending"&&!hasVendor&&!hasDriver&&<div onClick={()=>go("roleReg")} style={{margin:"0 20px 14px",padding:16,background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:18,display:"flex",alignItems:"center",gap:14,cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,.12)"}}>
      <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🚀</div>
      <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{t("profile.become_seller")}</div><div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:3}}>Ouvrez votre restaurant, boutique, pharmacie...</div></div>
      <span style={{color:"rgba(255,255,255,.3)",fontSize:18}}>›</span>
    </div>}
    {hasVendor&&<div onClick={()=>go("switchVendor")} style={{margin:"0 20px 14px",padding:14,background:"var(--card)",border:"1px solid var(--border)",borderLeft:"4px solid #F97316",borderRadius:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
      <span style={{fontSize:24}}>🏪</span>
      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>Espace Commerçant</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Plan {vendorPlan==="starter"?"Starter":vendorPlan==="pro"?"Pro":"Enterprise"}</div></div>
      <span style={{color:"var(--muted)"}}>›</span>
    </div>}
    {hasDriver&&<div onClick={()=>go("switchDriver")} style={{margin:"0 20px 14px",padding:14,background:"var(--card)",border:"1px solid var(--border)",borderLeft:"4px solid #F97316",borderRadius:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
      <span style={{fontSize:24}}>🛵</span>
      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>Espace Livreur</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Gérer mes livraisons</div></div>
      <span style={{color:"var(--muted)"}}>›</span>
    </div>}

    {/* ══════ SECTIONS ══════ */}

    <Section title="📦 Mes achats">
      <Item icon="🛍️" label={t("profile.orders")} info="3" onClick={()=>go("orders")}/>
      <Item icon="♡" label={t("profile.favorites")} info="5" onClick={()=>go("wishlist")}/>
      <Item icon="💳" label={t("profile.payment_history")} info="7" onClick={()=>go("paymentHistory")}/>
    </Section>

    <Section title="💰 Mon compte">
      <Item icon="⭐" label="Fidélité" info="3 450 pts" onClick={()=>go("loyalty")}/>
      <Item icon="🎁" label="Parrainage" info="4 000 F gagnés" onClick={()=>go("referral")}/>
      <Item icon="🎁" label="Cartes cadeaux" onClick={()=>go("giftCard")}/>
    </Section>

    <Section title="🛠️ Outils">
      <Item icon="💬" label={t("profile.messages")} info="2" onClick={()=>go("chatList")}/>
      <Item icon="📍" label={t("profile.addresses")} info="2" onClick={()=>go("addresses")}/>
      <Item icon="🔔" label={t("profile.notifications")} info="3" onClick={()=>go("notif")}/>
      <Item icon="🔔" label={t("profile.price_alerts")} info="3" onClick={()=>go("priceAlerts")}/>
    </Section>

    <Section title="🎉 Découvrir">
      <Item icon="🤝" label={t("profile.group_buys")} info="3 offres" onClick={()=>go("groupBuy")}/>
      <Item icon="📊" label={t("profile.stats")} onClick={()=>go("myStats")}/>
      <Item icon="🎮" label={t("profile.rewards")} info="Roue, missions" onClick={()=>go("gamification")}/>
      <Item icon="🤖" label={t("profile.assistant")} onClick={()=>go("chatBot")}/>
      <Item icon="📱" label={t("profile.qr_scan")} onClick={()=>go("qrScan")}/>

    </Section>

    {/* ── Footer ── */}
    <div style={{display:"flex",gap:10,margin:"4px 20px 20px"}}>
      <button onClick={()=>go("settings")} style={{flex:1,padding:12,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>{t("profile.settings")}</button>
      <button onClick={onLogout} style={{flex:1,padding:12,borderRadius:14,border:"1px solid rgba(239,68,68,0.2)",background:"transparent",color:"#EF4444",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t("profile.logout")}</button>
    </div>
  </div></PullToRefresh>);
}

export default ProfileScr;
