import { D_HISTORY, D_STATS } from "../../data/driverData";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import { DRIVER_PHOTO } from "../../data/images";
import { fmt } from "../../utils/helpers";

function DrProfileScr({go,onSwitch,onLogout}){
  return(<PullToRefresh onRefresh={async()=>{toast.success("Profil actualisé 👤")}}><div className="scr">
    <div className="appbar"><h2>Mon Profil</h2><button onClick={()=>go("drNotif")}>🔔</button></div>
    <div style={{textAlign:"center",padding:"10px 20px 20px"}}>
      <div style={{width:80,height:80,borderRadius:22,background:"linear-gradient(135deg,#F97316,#EA580C)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",overflow:"hidden"}}><img src={DRIVER_PHOTO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
      <h2 style={{fontSize:20,fontWeight:700}}>Patrick Moukala</h2>
      <p style={{fontSize:13,color:"var(--muted)"}}>🛵 Honda PCX · BZ-4521</p>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:8}}><span style={{padding:"4px 12px",borderRadius:8,background:"rgba(249,115,22,0.1)",color:"#F97316",fontSize:12,fontWeight:600}}>⭐ 4.8</span><span style={{padding:"4px 12px",borderRadius:8,background:"rgba(249,115,22,0.1)",color:"#F97316",fontSize:12,fontWeight:600}}>342 livraisons</span></div>
    </div>
    <div className="wallet" style={{margin:"0 20px 16px",background:"linear-gradient(135deg,#F97316,#EA580C)"}}><div><p style={{fontSize:11,opacity:.7}}>Gains disponibles</p><h3 style={{fontSize:20,fontWeight:700,marginTop:2}}>{fmt(D_STATS.month.earned)}</h3></div><button onClick={()=>go("drWallet")}>Retirer</button></div>
    {[["📦","Historique",D_HISTORY.length+" livraisons",()=>go("drHistory")],["💰","Mes gains","Février 2026",()=>go("drWallet")],["🔔","Notifications","3 nouvelles",()=>go("drNotif")],["🛵","Mon véhicule","Honda PCX · BZ-4521",()=>go("drVehicle")],["📍","Zones actives","Brazzaville Sud, Centre",()=>go("drZones")],["📊","Statistiques","Cette semaine",()=>go("drStats")],["⚙️","Paramètres","Langue, notifications",()=>go("drSettings")],["❓","Aide & Support","FAQ, contact",()=>go("drHelp")]].map(([i,t,s,fn])=><div key={t} className="menu-item" onClick={fn}><div className="mi-i">{i}</div><span className="mi-t">{t}</span><span className="mi-s">{s}</span><span className="mi-c">›</span></div>)}
    <div className="vendor-cta" style={{background:"var(--card)",border:"1px solid var(--border)",borderLeft:"4px solid #F97316",color:"var(--text)"}} onClick={onSwitch}><span style={{fontSize:28}}>🛍️</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Mode Acheteur</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Retourner au marketplace</div></div><span style={{fontSize:18}}>→</span></div>
    <button style={{margin:"0 20px 20px",width:"calc(100% - 40px)",padding:14,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onLogout}>🚪 Déconnexion</button>
  </div></PullToRefresh>);
}

/* D11 ── DRIVER VEHICLE ── */

export default DrProfileScr;
