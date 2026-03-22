
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";

import { USER_AVATAR } from "../../data/images";
function ProfileScr({go,userRole,vendorPlan,vendorStatus,driverStatus,onLogout}){
  const hasVendor=(userRole==="vendor"||userRole==="both")&&vendorStatus==="approved";
  const hasDriver=(userRole==="driver"||userRole==="both")&&driverStatus==="approved";
  const pendingVendor=(userRole==="vendor"||userRole==="both")&&vendorStatus==="pending";
  const pendingDriver=(userRole==="driver"||userRole==="both")&&driverStatus==="pending";
  const canRegister=userRole==="client"||(userRole==="vendor"&&!hasDriver)||(userRole==="driver"&&!hasVendor);
  return(<PullToRefresh onRefresh={async()=>{toast.success("Profil actualisé 👤")}}><div className="scr">
    <div className="appbar"><h2>Mon Profil</h2><button onClick={()=>go("settings")}>⚙️</button></div>
    <div className="prof-card"><div className="prof-av" style={{overflow:"hidden",padding:0}}><img src={USER_AVATAR} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div><h3 style={{fontSize:18,fontWeight:700}}>Joeldy Tsina</h3><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>+242 064 663 469</div><div style={{fontSize:12,color:"var(--muted)"}}>joeldytsina94@gmail.com</div><div className="prof-stats"><div className="ps"><b>3</b><span>Commandes</span></div><div className="psd"/><div className="ps"><b>5</b><span>Favoris</span></div><div className="psd"/><div className="ps"><b>2</b><span>Avis</span></div></div></div>
    <div className="wallet"><div><p>Kolo Pay Wallet</p><h3>125 000 FCFA</h3></div><button onClick={()=>go("recharge")}>Recharger</button></div>

    {/* Pending status */}
    {pendingVendor&&<div style={{margin:"0 20px 10px",padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)",borderRadius:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>⏳</span><div><div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Demande commerçant en cours</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Vérification sous 24-48h. Vous serez notifié.</div></div></div></div>}
    {pendingDriver&&<div style={{margin:"0 20px 10px",padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)",borderRadius:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>⏳</span><div><div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Demande livreur en cours</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Vérification sous 24-48h. Vous serez notifié.</div></div></div></div>}

    {/* Register CTA - only if client or can add another role */}
    {userRole==="client"&&<div className="vendor-cta" style={{borderLeft:"4px solid #F97316"}} onClick={()=>go("roleReg")}><span style={{fontSize:28}}>🚀</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Devenir commerçant ou livreur</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Ouvrez votre restaurant, boutique, pharmacie...</div></div><span style={{fontSize:18,color:"var(--muted)"}}>→</span></div>}

    {/* Approved vendor */}
    {hasVendor&&<div className="vendor-cta" style={{background:"var(--card)",border:"1px solid var(--border)",borderLeft:"4px solid #F97316"}} onClick={()=>go("switchVendor")}><span style={{fontSize:28}}>🏪</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Espace Commerçant</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Plan {vendorPlan==="starter"?"Starter":vendorPlan==="pro"?"Pro":"Enterprise"} · Gérer mon commerce</div></div><span style={{fontSize:18,color:"var(--muted)"}}>→</span></div>}

    {/* Approved driver */}
    {hasDriver&&<div className="vendor-cta" style={{background:"var(--card)",border:"1px solid var(--border)",borderLeft:"4px solid #F97316"}} onClick={()=>go("switchDriver")}><span style={{fontSize:28}}>🛵</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Espace Livreur</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Gérer mes livraisons et gains</div></div><span style={{fontSize:18,color:"var(--muted)"}}>→</span></div>}

    {[["🛍️","Mes commandes","3",()=>go("orders")],["💳","Historique paiements","7",()=>go("paymentHistory")],["♡","Mes favoris","5",()=>go("wishlist")],["💬","Messages","2",()=>go("chatList")],["📍","Mes adresses","2",()=>go("addresses")],["✏️","Modifier profil","",()=>go("editProfile")],["🔔","Notifications","3",()=>go("notif")],["🎁","Parrainage","4 000 F gagnés",()=>go("referral")],["⭐","Fidélité","3 450 pts",()=>go("loyalty")],["🎁","Cartes cadeaux","",()=>go("giftCard")],["🔔","Alertes de prix","3",()=>go("priceAlerts")],["📱","Scanner QR","",()=>go("qrScan")],["🤝","Achats groupés","3 offres",()=>go("groupBuy")],["📊","Mes statistiques","",()=>go("myStats")],["🤖","Assistant Lamu","",()=>go("chatBot")]].map(([i,t,s,fn])=><div key={t} className="menu-item" onClick={fn}><div className="mi-i">{i}</div><span className="mi-t">{t}</span>{s&&<span className="mi-s">{s}</span>}<span className="mi-c">›</span></div>)}
    <button style={{margin:"16px 20px 20px",width:"calc(100% - 40px)",padding:14,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onLogout}>🚪 Déconnexion</button>
  </div></PullToRefresh>);
}

/* 25 ── EDIT PROFILE ── */

export default ProfileScr;
