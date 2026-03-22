import { useState } from "react";
import { fmt } from "../../utils/helpers";
import ShopTeamTab from "./ShopTeamTab";

function VShopDetailScr({shop:sh,go,onBack}){
  const [tab,setTab]=useState(0);
  const isActive=sh.status==="active";
  const allCats=["Mode","Accessoires","Beauté","Artisanat","Électronique","Alimentation","Maison","Sport"];
  const [selCats,setSelCats]=useState(["Mode","Accessoires"]);
  const [visibility,setVisibility]=useState("active");
  const [saved,setSaved]=useState(false);
  const toggleCat=c=>setSelCats(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c]);
  const doSave=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500)}

  return(<div className="scr">
    <div className="appbar"><button onClick={onBack}>←</button><h2>{sh.name}</h2><div style={{width:38}}/></div>

    {/* Shop header */}
    <div style={{textAlign:"center",padding:"0 20px 16px"}}>
      <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:34}}>{sh.logo}</div>
      <h3 style={{fontSize:18,fontWeight:700}}>{sh.name}</h3>
      <p style={{fontSize:12,color:"var(--muted)"}}>📍 {sh.location} · Créée en {sh.created}</p>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:8}}>
        <span style={{padding:"4px 12px",borderRadius:8,background:isActive?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.1)",color:isActive?"#10B981":"#F59E0B",fontSize:12,fontWeight:600}}>{isActive?"✅ Active":"⏳ En attente"}</span>
        <span style={{padding:"4px 12px",borderRadius:8,background:"rgba(245,158,11,0.1)",color:"#F59E0B",fontSize:12,fontWeight:600}}>Enterprise ★</span>
      </div>
    </div>

    {/* Tabs */}
    {isActive&&<>
      <div style={{display:"flex",gap:0,margin:"0 20px 14px",background:"var(--light)",borderRadius:14,padding:4}}>
        {["Dashboard","Modifier","Équipe"].map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 4px",borderRadius:11,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:tab===i?"#F97316":"transparent",color:tab===i?"var(--card)":"var(--muted)"}}>{t}</button>)}
      </div>

      {/* Tab 0: Dashboard */}
      {tab===0&&<div style={{padding:"0 16px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {[["💰","Chiffre d'affaires",fmt(sh.revenue),"↑ 18%","#10B981"],["📦","Commandes",sh.orders,"↑ 12%","#F97316"],["👁️","Visiteurs",sh.views,"↑ 24%","#F59E0B"],["⭐","Note moyenne",sh.rating,"↑ 0.3","#10B981"]].map(([i,l,v,t,c])=><div key={l} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14}}>
            <div style={{fontSize:18,marginBottom:6}}>{i}</div>
            <div style={{fontSize:18,fontWeight:700}}>{v}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>{l}</div>
            <div style={{fontSize:11,color:c,fontWeight:600,marginTop:4}}>{t}</div>
          </div>)}
        </div>

        <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Top produits</div>
        {[{name:"Robe Wax Ankara",sold:24,rev:360000},{name:"Sac Cuir Artisanal",sold:18,rev:270000},{name:"Bracelet Perles Congo",sold:15,rev:75000}].map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:10,background:["#F97316","#F59E0B","#10B981"][i],color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{i+1}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{p.sold} vendus</div></div>
          <b style={{fontSize:13,color:"#F97316"}}>{fmt(p.rev)}</b>
        </div>)}

        <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Actions rapides</div>
        {[["📦","Voir les commandes",()=>go("vOrdersList")],["🛍️","Gérer les produits",()=>go("vProducts")],["📊","Voir les statistiques",()=>go("vStats")]].map(([i,t,fn])=><div key={t} className="menu-item" onClick={fn}><div className="mi-i">{i}</div><span className="mi-t">{t}</span><span className="mi-c">›</span></div>)}
      </div>}

      {/* Tab 1: Modifier */}
      {tab===1&&<div style={{padding:"0 16px 20px"}}>
        <div className="field"><label>Nom de l'établissement</label><input defaultValue={sh.name}/></div>
        <div className="field"><label>Description</label><textarea rows={3} defaultValue="Commerce de mode et accessoires africains authentiques."/></div>
        <div className="field-row"><div className="field"><label>Ville</label><input defaultValue={sh.location.split(",")[0]}/></div><div className="field"><label>Quartier</label><input defaultValue={sh.location.split(",")[1]?.trim()}/></div></div>
        <div className="field"><label>Téléphone</label><input defaultValue="+242 06X XXX XXX"/></div>
        <div className="field"><label>Horaires d'ouverture</label><input defaultValue="Lun-Sam 8h-18h"/></div>

        <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Catégories</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {allCats.map(c=><span key={c} onClick={()=>toggleCat(c)} style={{padding:"8px 14px",borderRadius:10,background:selCats.includes(c)?"rgba(249,115,22,0.08)":"var(--card)",border:selCats.includes(c)?"2px solid #F97316":"1px solid var(--border)",color:selCats.includes(c)?"#F97316":"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>{selCats.includes(c)?"✓ ":""}{c}</span>)}
        </div>

        <div style={{fontSize:14,fontWeight:700,margin:"10px 0 10px"}}>Visibilité</div>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          {[["active","🟢 Active","Visible sur le marketplace"],["pause","⏸️ En pause","Masquée temporairement"],["close","🔴 Fermée","Plus de commandes"]].map(([k,l,d])=><div key={k} onClick={()=>setVisibility(k)} style={{flex:1,padding:12,background:visibility===k?(k==="active"?"rgba(16,185,129,0.04)":k==="pause"?"rgba(245,158,11,0.04)":"rgba(239,68,68,0.04)"):"var(--card)",border:visibility===k?(k==="active"?"2px solid #10B981":k==="pause"?"2px solid #F59E0B":"2px solid #EF4444"):"1px solid var(--border)",borderRadius:12,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
            <div style={{fontSize:12,fontWeight:700}}>{l}</div>
            <div style={{fontSize:9,color:"var(--muted)",marginTop:4}}>{d}</div>
          </div>)}
        </div>

        <div className="info-box yellow" style={{marginBottom:10}}><span>⚠️</span><span style={{fontSize:11}}>Les modifications sont appliquées immédiatement sur le marketplace.</span></div>
        <button className="btn-primary" style={{background:saved?"#10B981":"#F97316"}} onClick={doSave}>{saved?"✅ Modifications enregistrées":"💾 Enregistrer les modifications"}</button>
      </div>}

      {/* Tab 2: Équipe */}
      {tab===2&&<ShopTeamTab/>}
    </>}

    {/* Pending shop */}
    {!isActive&&<div style={{padding:"0 16px"}}>
      <div style={{textAlign:"center",padding:"30px 20px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:16}}>
        <div style={{fontSize:48,marginBottom:10}}>⏳</div>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:6}}>Vérification en cours</h3>
        <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>Vos documents sont en cours d'examen. Vous serez notifié dès l'approbation (24-48h).</p>
        <div style={{marginTop:16}}>
          {[["Documents soumis","✅"],["Vérification identité","⏳"],["Validation finale","⬜"]].map(([l,s])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:"1px solid var(--border)",fontSize:13}}><span>{l}</span><span>{s}</span></div>)}
        </div>
      </div>
    </div>}
  </div>);
}

/* V18c ── ADD SHOP ── */

export default VShopDetailScr;
