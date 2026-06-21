import Icon from "../../components/Icon";
import GuestBlockedView from "../../components/GuestBlockedView";
import { useApp } from "../../context/AppContext";
import { fmt } from "../../utils/helpers";
import { getLevel } from "../../data/loyalty";

import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import t from "../../utils/i18n";

import { USER_AVATAR } from "../../data/images";
function ProfileScr({go,userRole,vendorPlan,vendorStatus,driverStatus,onLogout,onRoleApproved}){
  const { isGuest, exitGuestToLogin } = useApp();
  
  // Guest mode — show pro guest welcome screen
  if (isGuest) return (
    <GuestBlockedView
      icon="user"
      title="Bienvenue chez Lamuka"
      subtitle="Vous explorez en mode visiteur. Créez un compte gratuit pour passer des commandes et profiter de tous les avantages."
      benefits={["Passer commande et payer", "Discuter avec les vendeurs", "Suivre vos livraisons", "Gagner des points fidélité"]}
      accent="#F97316"
    />
  );
  
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
      <span style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text)",flexShrink:0}}>{icon?<Icon name={icon} size={20}/>:null}</span>
      <span style={{flex:1,fontSize:14,fontWeight:500,color:"var(--text)"}}>{label}</span>
      {info&&<span style={{fontSize:12,color:"var(--muted)",fontWeight:500}}>{info}</span>}
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{flexShrink:0,opacity:.3}}><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );

  return(<PullToRefresh onRefresh={async()=>{toast.success("Profil actualisé")}}><div className="scr">
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
      <span style={{color:"var(--muted)",fontSize:13}}><Icon name="edit" size={18}/></span>
    </div>

    {/* ── Pending status ── */}

    {/* ── CTA vendeur/livreur ── */}
    {vendorStatus==="pending"&&<div style={{margin:"0 20px 10px",padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:16,cursor:"pointer"}} onClick={()=>go("regStatus")}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>⏳</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Demande commerçant en attente</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Vérification sous 24-48h</div></div><span style={{color:"#F59E0B",fontSize:12,fontWeight:600}}>Voir statut →</span></div>
    </div>}
    {driverStatus==="pending"&&<div style={{margin:"0 20px 10px",padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:16,cursor:"pointer"}} onClick={()=>go("regStatus")}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>⏳</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Demande livreur en attente</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Vérification sous 24-48h</div></div><span style={{color:"#F59E0B",fontSize:12,fontWeight:600}}>Voir statut →</span></div>
    </div>}
    {vendorStatus!=="pending"&&driverStatus!=="pending"&&!hasVendor&&!hasDriver&&<div onClick={()=>go("roleReg")} style={{margin:"0 20px 14px",padding:16,background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:18,display:"flex",alignItems:"center",gap:14,cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,.12)"}}>
      <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}><Icon name="rocket" size={18}/></div>
      <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{t("profile.become_seller")}</div><div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:3}}>Ouvrez votre restaurant, boutique, pharmacie...</div></div>
      <span style={{color:"rgba(255,255,255,.3)",fontSize:18}}>›</span>
    </div>}
    {hasVendor&&<div onClick={()=>go("switchVendor")} style={{margin:"0 20px 14px",padding:14,background:"var(--card)",border:"1px solid var(--border)",borderLeft:"4px solid #F97316",borderRadius:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
      <span style={{fontSize:24}}><Icon name="store" size={18}/></span>
      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>Espace Commerçant</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Plan {vendorPlan==="starter"?"Starter":vendorPlan==="pro"?"Pro":"Enterprise"}</div></div>
      <span style={{color:"var(--muted)"}}>›</span>
    </div>}
    {hasDriver&&<div onClick={()=>go("switchDriver")} style={{margin:"0 20px 14px",padding:14,background:"var(--card)",border:"1px solid var(--border)",borderLeft:"4px solid #F97316",borderRadius:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
      <span style={{fontSize:24}}><Icon name="truck" size={18}/></span>
      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>Espace Livreur</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Gérer mes livraisons</div></div>
      <span style={{color:"var(--muted)"}}>›</span>
    </div>}

    {/* Lamuka Points hero card */}
    {(()=>{const lp=(()=>{try{return JSON.parse(localStorage.getItem("lk-loyalty")||"{}")}catch{return{}}})();const pts=lp.points??2450;const lvl=getLevel(lp.lifetimePoints??8200);return(
    <div className="lamuka-points-card" onClick={()=>go("loyalty")} style={{margin:"0 16px 14px",padding:16,background:`linear-gradient(135deg, ${lvl.color}22 0%, ${lvl.color}08 100%)`,border:`2px solid ${lvl.color}33`,borderRadius:16,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
      <div style={{fontSize:32}}><Icon name={lvl.icon} size={20}/></div>
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:lvl.color,fontWeight:800,letterSpacing:.5}}>NIVEAU {lvl.name.toUpperCase()}</div>
        <div style={{fontSize:20,fontWeight:800,color:lvl.color,marginTop:2}}>{pts.toLocaleString()} pts</div>
        <div style={{fontSize:11,color:"var(--muted)"}}>≈ {fmt(pts)} de réduction</div>
      </div>
      <span style={{fontSize:18,color:"var(--muted)"}}>›</span>
    </div>
    )})()}

    {/* ══════ SECTIONS ══════ */}

    <Section title="Mes achats">
      <Item icon="package" label={t("profile.orders")} info="3" onClick={()=>go("orders")}/>
      <Item icon="repeat" label="Abonnements" info="2 actifs" onClick={()=>go("subscriptions")}/>
      <Item icon="heart" label={t("profile.favorites")} info="5" onClick={()=>go("wishlist")}/>
      <Item icon="creditCard" label={t("profile.payment_history")} info="7" onClick={()=>go("paymentHistory")}/>
    </Section>

    <Section title="Mon compte">
      <Item icon="star_full" label="Fidélité" info="3 450 pts" onClick={()=>go("loyalty")}/>
      <Item icon="tag" label="Mes promos" info="6 codes" onClick={()=>go("promos")}/>
      <Item icon="gift" label="Parrainage" info="4 000 F gagnés" onClick={()=>go("referral")}/>
      <Item icon="creditCard" label="Cartes cadeaux" onClick={()=>go("giftCard")}/>
    </Section>

    <Section title="️ Outils">
      <Item icon="chat" label={t("profile.messages")} info="2" onClick={()=>go("chatList")}/>
      <Item icon="location" label={t("profile.addresses")} info="2" onClick={()=>go("addresses")}/>
      <Item icon="bell" label={t("profile.notifications")} info="3" onClick={()=>go("notif")}/>
      <Item icon="trendUp" label={t("profile.price_alerts")} info="3" onClick={()=>go("priceAlerts")}/>
    </Section>

    <Section title="Découvrir">
      <Item icon="handshake" label={t("profile.group_buys")} info="3 offres" onClick={()=>go("groupBuy")}/>
      <Item icon="chart_pie" label={t("profile.stats")} onClick={()=>go("myStats")}/>
      <Item icon="target" label={t("profile.rewards")} info="Roue, missions" onClick={()=>go("gamification")}/>
      <Item icon="headphones" label={t("profile.assistant")} onClick={()=>go("chatBot")}/>
      <Item icon="help" label="Centre d'aide" info="FAQ" onClick={()=>go("help")}/>
      <Item icon="truck" label="Livraison & Retours" onClick={()=>go("deliveryPolicy")}/>
      <Item icon="info" label="À propos" onClick={()=>go("about")}/>
      <Item icon="qrcode" label={t("profile.qr_scan")} onClick={()=>go("qrScan")}/>

    </Section>

    {/* ── Footer ── */}
    <div style={{display:"flex",gap:10,margin:"4px 20px 20px"}}>
      <button onClick={()=>go("settings")} style={{flex:1,padding:12,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>{t("profile.settings")}</button>
      <button onClick={onLogout} style={{flex:1,padding:12,borderRadius:14,border:"1px solid rgba(239,68,68,0.2)",background:"transparent",color:"#EF4444",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t("profile.logout")}</button>
    </div>
  </div></PullToRefresh>);
}

export default ProfileScr;
