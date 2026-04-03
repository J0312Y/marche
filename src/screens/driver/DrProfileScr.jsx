import { D_HISTORY, D_STATS } from "../../data/driverData";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import ImageCropper from "../../components/ImageCropper";
import { DRIVER_PHOTO, DRIVER_COVER } from "../../data/images";
import { fmt } from "../../utils/helpers";

function DrProfileScr({go,onSwitch,onLogout}){
  const Item=({icon,label,info,onClick})=>(
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",cursor:"pointer",borderBottom:"1px solid var(--border)"}}>
      <span style={{fontSize:20,width:22,textAlign:"center"}}>{icon}</span>
      <span style={{flex:1,fontSize:14,fontWeight:500,color:"var(--text)"}}>{label}</span>
      {info&&<span style={{fontSize:12,color:"var(--muted)",fontWeight:500}}>{info}</span>}
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{flexShrink:0,opacity:.3}}><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

  const [drPhoto,setDrPhoto]=useState(DRIVER_PHOTO);
  const [drCover,setDrCover]=useState(DRIVER_COVER);
  const [cropDrSrc,setCropDrSrc]=useState(null);

  return(<PullToRefresh onRefresh={async()=>{toast.success("Profil actualisé 👤")}}><div className="scr" style={{paddingBottom:20}}>
    <div className="appbar"><h2>Mon Profil</h2><button onClick={()=>go("drNotif")}>🔔</button></div>

    {/* Profile header — cover + photo */}
    <div style={{position:"relative",marginBottom:50}}>
      <div style={{height:120,borderRadius:"0 0 20px 20px",overflow:"hidden",position:"relative"}}>
        <img src={drCover} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}} alt=""/>
        <label style={{position:"absolute",bottom:8,right:8,padding:"5px 10px",borderRadius:10,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>📷 Couverture
          <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>{setDrCover(r.result);toast.success("Couverture mise à jour 📸")};r.readAsDataURL(f);e.target.value=""}}}/>
        </label>
      </div>
      <div style={{position:"absolute",bottom:-38,left:"50%",transform:"translateX(-50%)"}}>
        <div style={{width:76,height:76,borderRadius:"50%",overflow:"hidden",border:"3px solid var(--bg)",boxShadow:"0 2px 12px rgba(0,0,0,.12)",position:"relative",cursor:"pointer"}} onClick={()=>document.getElementById("dr-photo-up")?.click()}>
          <img src={drPhoto} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"2px 0",background:"rgba(0,0,0,.45)",textAlign:"center"}}><span style={{fontSize:8,color:"#fff"}}>📷</span></div>
        </div>
        <input id="dr-photo-up" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>setCropDrSrc(r.result);r.readAsDataURL(f);e.target.value=""}}}/>
      </div>
    </div>
    <div style={{textAlign:"center",paddingTop:6}}>
      <h2 style={{fontSize:20,fontWeight:700}}>Patrick Moukala</h2>
      <p style={{fontSize:13,color:"var(--muted)"}}>🛵 Honda PCX · BZ-4521</p>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:8}}>
        <span style={{padding:"4px 12px",borderRadius:8,background:"rgba(249,115,22,0.1)",color:"#F97316",fontSize:12,fontWeight:600}}>⭐ 4.8</span>
        <span style={{padding:"4px 12px",borderRadius:8,background:"rgba(249,115,22,0.1)",color:"#F97316",fontSize:12,fontWeight:600}}>342 livraisons</span>
      </div>
    </div>

    {/* Wallet */}
    <div className="wallet" style={{margin:"0 16px 14px",background:"linear-gradient(135deg,#F97316,#EA580C)"}}><div><p style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>Gains disponibles</p><h3 style={{fontSize:20,fontWeight:700,marginTop:2,color:"#fff"}}>{fmt(D_STATS.month.earned)}</h3></div><button onClick={()=>go("drWallet")}>Retirer</button></div>

    {/* ═══ LIVRAISONS ═══ */}
    <Section icon="📦" title="MES LIVRAISONS">
      <Item icon="📦" label="Historique" info={D_HISTORY.length+" livraisons"} onClick={()=>go("drHistory")}/>
      <Item icon="💰" label="Mes gains" info="Février 2026" onClick={()=>go("drWallet")}/>
      <Item icon="📊" label="Statistiques" info="Cette semaine" onClick={()=>go("drStats")}/>
    </Section>

    {/* ═══ VÉHICULE & ZONES ═══ */}
    <Section icon="🛵" title="VÉHICULE & ZONES">
      <Item icon="🛵" label="Mon véhicule" info="Honda PCX" onClick={()=>go("drVehicle")}/>
      <Item icon="📄" label="Mes documents" info="5/6 valides" onClick={()=>go("drDocuments")}/>
      <Item icon="📍" label="Zones actives" info="Bzv Sud, Centre" onClick={()=>go("drZones")}/>
    </Section>

    {/* ═══ OUTILS ═══ */}
    <Section icon="🔧" title="OUTILS & SUPPORT">
      <Item icon="🔔" label="Notifications" info="3" onClick={()=>go("drNotif")}/>
      <Item icon="🤖" label="Assistant Lamu" info="IA" onClick={()=>go("drChatBot")}/>
      <Item icon="⚙️" label="Paramètres" info="Langue, notifs" onClick={()=>go("drSettings")}/>
      <Item icon="❓" label="Aide & Support" info="FAQ, contact" onClick={()=>go("drHelp")}/>
    </Section>

    {/* Switch + Logout */}
    <div style={{padding:"6px 16px 20px",display:"flex",gap:10}}>
      <button onClick={onSwitch} style={{flex:1,padding:12,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>🛍️ Mode Acheteur</button>
      <button onClick={onLogout} style={{flex:1,padding:12,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🚪 Déconnexion</button>
    </div>
  {cropDrSrc&&<ImageCropper src={cropDrSrc} shape="circle" onCancel={()=>setCropDrSrc(null)} onConfirm={cropped=>{setDrPhoto(cropped);setCropDrSrc(null);toast.success("Photo mise à jour 📸")}}/>}
  </div></PullToRefresh>);
}

export default DrProfileScr;
