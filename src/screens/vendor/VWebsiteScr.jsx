import { useState } from "react";
import toast from "../../utils/toast";

function VWebsiteScr({onBack}){
  const [site,setSite]=useState({
    enabled:true,
    subdomain:"mode-afrique",
    title:"Mode Afrique",
    description:"Vêtements africains modernes — Wax, Bogolan, Cuir artisanal",
    primaryColor:"#6366F1",
    logo:null,
    banner:null,
    showReviews:true,
    showContact:true,
    showPromos:true,
    customDomain:"",
    analytics:{visitors:342,orders:28,conversion:"8.2%"},
  });
  const [editing,setEditing]=useState(false);
  const [showPreview,setShowPreview]=useState(false);

  const colors=["#6366F1","#10B981","#F59E0B","#EF4444","#EC4899","#8B5CF6","#06B6D4","#191815"];

  const save=()=>{setEditing(false);toast.success("Site web mis à jour ✅")};

  return(<div className="scr" style={{padding:16,paddingBottom:80}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>🌐 Mon site web</h2><div style={{width:38}}/></div>

    {/* Status card */}
    <div style={{padding:16,background:site.enabled?"linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02))":"#F5F4F1",border:site.enabled?"1px solid rgba(16,185,129,0.15)":"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:12,background:site.enabled?"#10B981":"#908C82",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff"}}>🌐</div>
          <div>
            <div style={{fontSize:14,fontWeight:700}}>{site.enabled?"En ligne":"Hors ligne"}</div>
            <div style={{fontSize:11,color:"#908C82"}}>{site.subdomain}.lamuka.market</div>
          </div>
        </div>
        <div className={`toggle ${site.enabled?"on":""}`} onClick={()=>{setSite({...site,enabled:!site.enabled});toast.success(site.enabled?"Site désactivé ⏸️":"Site activé 🌐")}}/>
      </div>
      {site.enabled&&<button onClick={()=>toast.info("Lien copié !")} style={{width:"100%",padding:10,borderRadius:10,border:"1px dashed rgba(16,185,129,0.3)",background:"transparent",color:"#10B981",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        🔗 https://{site.subdomain}.lamuka.market — Copier le lien
      </button>}
    </div>

    {/* Analytics mini */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
      {[["👁️",site.analytics.visitors,"Visiteurs"],["📦",site.analytics.orders,"Commandes"],["📈",site.analytics.conversion,"Conversion"]].map(([icon,val,label])=>(
        <div key={label} style={{padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,textAlign:"center"}}>
          <div style={{fontSize:16,marginBottom:4}}>{icon}</div>
          <div style={{fontSize:16,fontWeight:700}}>{val}</div>
          <div style={{fontSize:10,color:"#908C82"}}>{label}</div>
        </div>
      ))}
    </div>

    {/* Preview */}
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:14,fontWeight:700}}>Aperçu du site</span>
        <button onClick={()=>setShowPreview(!showPreview)} style={{fontSize:11,color:"#6366F1",fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>{showPreview?"Masquer":"Voir"}</button>
      </div>
      {showPreview&&<div style={{border:"1px solid #E8E6E1",borderRadius:14,overflow:"hidden",background:"#fff"}}>
        {/* Mini browser bar */}
        <div style={{padding:"6px 10px",background:"#F5F4F1",display:"flex",alignItems:"center",gap:6}}>
          <div style={{display:"flex",gap:3}}><div style={{width:6,height:6,borderRadius:"50%",background:"#EF4444"}}/><div style={{width:6,height:6,borderRadius:"50%",background:"#F59E0B"}}/><div style={{width:6,height:6,borderRadius:"50%",background:"#10B981"}}/></div>
          <div style={{flex:1,padding:"3px 8px",borderRadius:6,background:"#fff",fontSize:9,color:"#908C82"}}>{site.subdomain}.lamuka.market</div>
        </div>
        {/* Site preview */}
        <div style={{padding:0}}>
          <div style={{height:60,background:site.primaryColor,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:700}}>{site.title}</div>
              <div style={{fontSize:8,opacity:.8,marginTop:2}}>{site.description.slice(0,40)}...</div>
            </div>
          </div>
          <div style={{padding:10}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
              {[1,2,3].map(i=><div key={i} style={{height:40,borderRadius:6,background:"#F5F4F1"}}/>)}
            </div>
            <div style={{marginTop:6,height:6,width:"60%",background:"#F5F4F1",borderRadius:3}}/>
            <div style={{marginTop:3,height:6,width:"40%",background:"#F5F4F1",borderRadius:3}}/>
          </div>
        </div>
      </div>}
    </div>

    {/* Settings */}
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Paramètres du site</div>

    {!editing?(
      <div>
        {[
          ["🏷️","Nom du site",site.title],
          ["📝","Description",site.description.slice(0,40)+"..."],
          ["🎨","Couleur principale",<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:16,height:16,borderRadius:4,background:site.primaryColor}}/>{site.primaryColor}</div>],
          ["🔗","Sous-domaine",site.subdomain+".lamuka.market"],
          ["🌍","Domaine personnalisé",site.customDomain||"Non configuré"],
          ["⭐","Afficher les avis",site.showReviews?"Oui":"Non"],
          ["📱","Afficher le contact",site.showContact?"Oui":"Non"],
          ["🏷️","Afficher les promos",site.showPromos?"Oui":"Non"],
        ].map(([icon,label,val])=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #F5F4F1"}}>
            <span style={{fontSize:16}}>{icon}</span>
            <span style={{flex:1,fontSize:12,fontWeight:600}}>{label}</span>
            <span style={{fontSize:12,color:"#908C82"}}>{val}</span>
          </div>
        ))}
        <button onClick={()=>setEditing(true)} style={{width:"100%",marginTop:14,padding:12,borderRadius:12,border:"1px solid #6366F1",background:"transparent",color:"#6366F1",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✏️ Modifier les paramètres</button>
      </div>
    ):(
      <div>
        <div className="field"><label>Nom du site</label><input value={site.title} onChange={e=>setSite({...site,title:e.target.value})}/></div>
        <div className="field"><label>Description</label><textarea value={site.description} onChange={e=>setSite({...site,description:e.target.value})} rows={2} style={{width:"100%",padding:10,borderRadius:12,border:"1px solid #E8E6E1",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box",resize:"vertical"}}/></div>
        <div className="field"><label>Sous-domaine</label>
          <div style={{display:"flex",alignItems:"center",gap:0}}>
            <input value={site.subdomain} onChange={e=>setSite({...site,subdomain:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"")})} style={{borderRadius:"12px 0 0 12px",borderRight:"none"}}/>
            <span style={{padding:"12px 10px",background:"#F5F4F1",border:"1px solid #E8E6E1",borderRadius:"0 12px 12px 0",fontSize:11,color:"#908C82",whiteSpace:"nowrap"}}>.lamuka.market</span>
          </div>
        </div>
        <div className="field"><label>Domaine personnalisé (optionnel)</label><input value={site.customDomain} onChange={e=>setSite({...site,customDomain:e.target.value})} placeholder="www.maboutique.com"/></div>

        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,fontWeight:600,color:"#5E5B53",display:"block",marginBottom:6}}>Couleur principale</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {colors.map(c=><div key={c} onClick={()=>setSite({...site,primaryColor:c})} style={{width:32,height:32,borderRadius:10,background:c,cursor:"pointer",border:site.primaryColor===c?"3px solid #191815":"2px solid transparent",transition:"all .15s"}}/>)}
          </div>
        </div>

        {[["showReviews","Afficher les avis clients"],["showContact","Afficher le formulaire de contact"],["showPromos","Afficher les promotions"]].map(([key,label])=>(
          <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #F5F4F1"}}>
            <span style={{fontSize:12,fontWeight:600}}>{label}</span>
            <div className={`toggle ${site[key]?"on":""}`} onClick={()=>setSite({...site,[key]:!site[key]})}/>
          </div>
        ))}

        <div style={{display:"flex",gap:10,marginTop:16}}>
          <button onClick={()=>setEditing(false)} style={{flex:1,padding:12,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
          <button onClick={save} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#6366F1",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💾 Enregistrer</button>
        </div>
      </div>
    )}

    {/* Enterprise badge */}
    <div style={{marginTop:14,padding:14,background:"rgba(245,158,11,0.04)",border:"1px solid rgba(245,158,11,0.15)",borderRadius:14,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:20}}>⭐</span>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:700,color:"#F59E0B"}}>Fonctionnalité Enterprise</div>
        <div style={{fontSize:11,color:"#908C82"}}>Votre site web est inclus dans votre abonnement Enterprise.</div>
      </div>
    </div>
  </div>);
}

export default VWebsiteScr;
