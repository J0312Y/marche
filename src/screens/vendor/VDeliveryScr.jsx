import { useState } from "react";
import { fmt } from "../../utils/helpers";

function VDeliveryScr({go,onBack}){
  const [tab,setTab]=useState(0);
  // Platform drivers (auto-listed from Lamuka accounts)
  const platformDrivers=[
    {id:"d1",name:"Patrick Moukala",vehicle:"🛵 Honda PCX",plate:"BZ-4521",phone:"+242 06X XXX",status:"available",rating:4.8,deliveries:342,zone:"Brazzaville Sud",avatar:"🧑",source:"platform"},
    {id:"d3",name:"Grace Okemba",vehicle:"🛵 Yamaha NMAX",plate:"BZ-2190",phone:"+242 06X XXX",status:"available",rating:4.9,deliveries:267,zone:"Brazzaville Centre",avatar:"👩",source:"platform"},
    {id:"d5",name:"Alain Mboumba",vehicle:"🚲 Vélo",plate:"—",phone:"+242 06X XXX",status:"available",rating:4.3,deliveries:52,zone:"Brazzaville Sud",avatar:"🧑",source:"platform"},
  ];
  // Manually added by vendor
  const [manualDrivers,setManualDrivers]=useState([
    {id:"d2",name:"Jean Mbemba",vehicle:"🚗 Toyota Vitz",plate:"BZ-7803",phone:"+242 06X XXX",status:"busy",rating:4.5,deliveries:128,zone:"Brazzaville Nord",avatar:"👨",source:"manual"},
    {id:"d4",name:"Michel Ngoma",vehicle:"🚗 Suzuki Alto",plate:"BZ-5541",phone:"+242 06X XXX",status:"offline",rating:4.2,deliveries:89,zone:"Pointe-Noire",avatar:"🧔",source:"manual"},
  ]);
  const allDrivers=[...platformDrivers,...manualDrivers];
  const [showAdd,setShowAdd]=useState(false);
  const [addName,setAddName]=useState("");const [addPhone,setAddPhone]=useState("");const [addVehicle,setAddVehicle]=useState("moto");
  const doAddManual=()=>{
    if(!addName||!addPhone)return;
    setManualDrivers([...manualDrivers,{id:"dm"+Date.now(),name:addName,vehicle:addVehicle==="moto"?"🛵 Moto":addVehicle==="voiture"?"🚗 Voiture":"🚲 Vélo",plate:"—",phone:addPhone,status:"offline",rating:0,deliveries:0,zone:"Brazzaville",avatar:addName[0].toUpperCase(),source:"manual"}]);
    setAddName("");setAddPhone("");setShowAdd(false);
  };
  const removeManual=id=>setManualDrivers(manualDrivers.filter(d=>d.id!==id));

  const activeDeliveries=[
    {ref:"#CMD-0889",client:"Celine Nzaba",addr:"Moungali, Rue 8",driver:"Patrick Moukala",driverAv:"🧑",status:"En route",eta:"8 min",progress:65},
    {ref:"#CMD-0888",client:"Alain Mboumba",addr:"Poto-Poto, Av. Paix",driver:"Jean Mbemba",driverAv:"👨",status:"Récupération",eta:"22 min",progress:25},
  ];
  const pastDeliveries=[
    {ref:"#CMD-0885",client:"David Tsaty",driver:"Patrick Moukala",date:"12 Fév",status:"Livrée",duration:"32 min",rating:5},
    {ref:"#CMD-0880",client:"Grace Mouanda",driver:"Grace Okemba",date:"10 Fév",status:"Livrée",duration:"28 min",rating:4},
    {ref:"#CMD-0875",client:"Paul Nkaya",driver:"Patrick Moukala",date:"8 Fév",status:"Livrée",duration:"45 min",rating:5},
  ];
  const [zones,setZones]=useState([
    {id:"vz1",name:"Brazzaville Sud",areas:"Bacongo, Makélékélé",price:2500,active:true},
    {id:"vz2",name:"Brazzaville Centre",areas:"Poto-Poto, Moungali, Ouenzé",price:2500,active:true},
    {id:"vz3",name:"Brazzaville Nord",areas:"Talangaï, Mfilou, Djiri",price:3500,active:true},
    {id:"vz4",name:"Pointe-Noire",areas:"Centre-ville, Loandjili, Tié-Tié",price:5000,active:false},
  ]);
  const toggleZone=id=>{setZones(zones.map(z=>z.id===id?{...z,active:!z.active}:z))};
  const [editZone,setEditZone]=useState(null);
  const [editPrice,setEditPrice]=useState("");
  const [editAreas,setEditAreas]=useState("");
  const [showAddZone,setShowAddZone]=useState(false);
  const [azName,setAzName]=useState("");const [azAreas,setAzAreas]=useState("");const [azPrice,setAzPrice]=useState("2500");
  const saveEdit=(id)=>{setZones(zones.map(z=>z.id===id?{...z,price:parseInt(editPrice)||z.price,areas:editAreas||z.areas}:z));setEditZone(null)};
  const removeZone=id=>setZones(zones.filter(z=>z.id!==id));
  const addZone=()=>{if(!azName)return;setZones([...zones,{id:"vz"+Date.now(),name:azName,areas:azAreas||"Zone personnalisée",price:parseInt(azPrice)||2500,active:true}]);setAzName("");setAzAreas("");setAzPrice("2500");setShowAddZone(false)};
  const zoneSuggestions=["Dolisie","Nkayi","Oyo","Owando","Sibiti"].filter(n=>!zones.find(z=>z.name===n));

  return(<div className="scr">
    <div className="appbar"><button onClick={onBack}>←</button><h2>Gestion livraison</h2><button onClick={()=>go("vNotif")}>🔔</button></div>

    {/* Tabs */}
    <div style={{display:"flex",gap:0,margin:"0 20px 14px",background:"#F5F4F1",borderRadius:14,padding:4,border:"1px solid #E8E6E1"}}>
      {["Livreurs","En cours","Historique","Zones"].map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 4px",borderRadius:11,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:tab===i?"#6366F1":"transparent",color:tab===i?"#fff":"#908C82",transition:"all .2s"}}>{t}</button>)}
    </div>

    {/* Tab 0: Livreurs - split platform/manual */}
    {tab===0&&<div style={{padding:"0 20px 80px"}}>

      {/* Section 1: Platform drivers (auto-listed) */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div><span style={{fontSize:14,fontWeight:700}}>Livreurs Lamuka</span><span style={{fontSize:11,color:"#908C82",marginLeft:6}}>({platformDrivers.length} inscrits)</span></div>
        <span style={{padding:"4px 10px",borderRadius:8,background:"rgba(16,185,129,0.08)",color:"#10B981",fontSize:10,fontWeight:700}}>🔄 Auto</span>
      </div>
      <div className="info-box blue" style={{marginBottom:10,padding:"8px 12px"}}><span>ℹ️</span><span style={{fontSize:11}}>Ces livreurs ont un compte Lamuka actif et sont automatiquement disponibles dans votre zone.</span></div>
      {platformDrivers.map(d=><div key={d.id} className="del-card" onClick={()=>go("vDriverProfile",d)}>
        <div className="del-av">{d.avatar}</div>
        <div className="del-info">
          <h4>{d.name} <span style={{padding:"2px 6px",borderRadius:4,background:"rgba(16,185,129,0.08)",color:"#10B981",fontSize:9,fontWeight:700,marginLeft:4}}>Lamuka ✓</span></h4>
          <p>{d.vehicle} · {d.plate}</p>
          <p style={{marginTop:2}}>⭐ {d.rating} · {d.deliveries} livraisons · 📍 {d.zone}</p>
        </div>
        <span className={`del-status ${d.status==="available"?"available":d.status==="busy"?"busy":""}`}>{d.status==="available"?"Dispo":d.status==="busy"?"Occupé":"Hors ligne"}</span>
      </div>)}

      {/* Section 2: Manual drivers */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"20px 0 10px"}}>
        <div><span style={{fontSize:14,fontWeight:700}}>Livreurs ajoutés</span><span style={{fontSize:11,color:"#908C82",marginLeft:6}}>({manualDrivers.length})</span></div>
        <button style={{padding:"6px 12px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#6366F1"}} onClick={()=>setShowAdd(true)}>+ Ajouter</button>
      </div>
      {manualDrivers.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:"#908C82",fontSize:12}}>Aucun livreur ajouté manuellement</div>}
      {manualDrivers.map(d=><div key={d.id} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}} onClick={()=>go("vDriverProfile",d)}>
          <div className="del-av" style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{d.avatar}</div>
          <div style={{flex:1}}>
            <h4 style={{fontSize:14,fontWeight:600}}>{d.name} <span style={{padding:"2px 6px",borderRadius:4,background:"rgba(245,158,11,0.08)",color:"#F59E0B",fontSize:9,fontWeight:700,marginLeft:4}}>Manuel</span></h4>
            <p style={{fontSize:11,color:"#908C82"}}>{d.vehicle} · 📍 {d.zone}</p>
          </div>
          <span className={`del-status ${d.status==="available"?"available":d.status==="busy"?"busy":""}`} style={d.status==="offline"?{background:"rgba(0,0,0,0.05)",color:"#908C82"}:{}}>{d.status==="available"?"Dispo":d.status==="busy"?"Occupé":"Hors ligne"}</span>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:"1px solid #F5F4F1"}}>
          <button style={{flex:1,padding:8,borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("vAddDriver")}>✏️ Modifier</button>
          <button style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"#fff",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>removeManual(d.id)}>🗑️ Retirer</button>
        </div>
      </div>)}

      {/* Inline add form */}
      {showAdd&&<div style={{padding:16,background:"#fff",border:"2px solid #6366F1",borderRadius:16,marginTop:10}}>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>➕ Ajouter un livreur manuellement</h4>
        <div className="field"><label>Nom complet</label><input value={addName} onChange={e=>setAddName(e.target.value)} placeholder="Ex: Patrick Moukala"/></div>
        <div className="field"><label>Téléphone</label><input value={addPhone} onChange={e=>setAddPhone(e.target.value)} placeholder="+242 06X XXX XXX" type="tel"/></div>
        <div className="field"><label>Véhicule</label>
          <div style={{display:"flex",gap:6}}>{[["moto","🛵 Moto"],["voiture","🚗 Voiture"],["velo","🚲 Vélo"]].map(([k,l])=><button key={k} onClick={()=>setAddVehicle(k)} style={{flex:1,padding:8,borderRadius:8,border:addVehicle===k?"2px solid #6366F1":"1px solid #E8E6E1",background:addVehicle===k?"rgba(99,102,241,0.04)":"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}</div>
        </div>
        <div className="info-box yellow" style={{marginBottom:10,padding:"6px 10px"}}><span>📱</span><span style={{fontSize:11}}>Un SMS sera envoyé pour l'inviter à créer un compte Lamuka</span></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setShowAdd(false);setAddName("");setAddPhone("")}}>Annuler</button>
          <button className="btn-primary" style={{flex:2,background:addName&&addPhone?"#6366F1":"#E8E6E1",color:addName&&addPhone?"#fff":"#908C82"}} onClick={doAddManual}>Ajouter</button>
        </div>
      </div>}
    </div>}

    {/* Tab 1: En cours */}
    {tab===1&&<div style={{padding:"0 20px 80px"}}>
      {activeDeliveries.length===0?<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:48}}>📭</div><h3 style={{marginTop:10,fontSize:16,fontWeight:700}}>Aucune livraison en cours</h3><p style={{fontSize:13,color:"#908C82",marginTop:4}}>Les livraisons actives apparaîtront ici</p></div>
      :activeDeliveries.map((d,i)=><div key={i} style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:18,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:14,fontWeight:700}}>{d.ref}</span><span className="vo-status shipped">{d.status}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{d.driverAv}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{d.driver}</div><div style={{fontSize:11,color:"#908C82"}}>→ {d.client} · {d.addr}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:"#6366F1"}}>{d.eta}</div><div style={{fontSize:10,color:"#908C82"}}>restantes</div></div>
        </div>
        <div className="eta-bar" style={{marginBottom:6}}><div className="eta-fill" style={{width:`${d.progress}%`}}/></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}} onClick={()=>go("vTrackDelivery",d)}>📍 Suivre</button>
          <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}} onClick={()=>go("vDriverChat",d)}>💬 Contacter</button>
          <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#10B981",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>alert("📞 Appel vers "+d.driver)}>📞</button>
        </div>
      </div>)}
    </div>}

    {/* Tab 2: Historique */}
    {tab===2&&<div style={{padding:"0 20px 80px"}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>{pastDeliveries.length} livraisons terminées</div>
      {pastDeliveries.map((d,i)=><div key={i} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:12,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>✅</div>
        <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600}}>{d.ref} → {d.client}</div><div style={{fontSize:11,color:"#908C82"}}>{d.driver} · {d.date} · {d.duration}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:14,color:"#F59E0B"}}>{"★".repeat(d.rating)}</div></div>
      </div>)}
    </div>}

    {/* Tab 3: Zones */}
    {tab===3&&<div style={{padding:"0 20px 80px"}}>
      <div className="info-box blue" style={{marginBottom:14}}><span>ℹ️</span><span style={{fontSize:11}}>Définissez vos zones de livraison et tarifs. Les livreurs disponibles dans ces zones seront proposés pour vos commandes.</span></div>
      <div style={{fontSize:12,color:"#908C82",marginBottom:10}}>{zones.filter(z=>z.active).length} zone{zones.filter(z=>z.active).length>1?"s":""} active{zones.filter(z=>z.active).length>1?"s":""} sur {zones.length}</div>

      {zones.map(z=><div key={z.id} style={{padding:14,background:"#fff",border:editZone===z.id?"2px solid #6366F1":z.active?"1px solid rgba(16,185,129,0.3)":"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><h4 style={{fontSize:14,fontWeight:700}}>{z.name}</h4>{z.active&&<span style={{width:8,height:8,borderRadius:4,background:"#10B981"}}/>}</div>
          <div className={`toggle ${z.active?"on":""}`} onClick={()=>toggleZone(z.id)}/>
        </div>
        <div style={{fontSize:12,color:"#908C82",marginBottom:8}}>📍 {z.areas}</div>

        {editZone===z.id
          ?<div style={{paddingTop:10,borderTop:"1px solid #F5F4F1"}}>
            <div className="field"><label>Quartiers couverts</label><input value={editAreas} onChange={e=>setEditAreas(e.target.value)}/></div>
            <div className="field"><label>Frais de livraison (FCFA)</label><input type="number" value={editPrice} onChange={e=>setEditPrice(e.target.value)}/></div>
            <div style={{display:"flex",gap:8}}>
              <button style={{flex:1,padding:8,borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setEditZone(null)}>Annuler</button>
              <button style={{flex:1,padding:8,borderRadius:8,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>saveEdit(z.id)}>💾 Sauver</button>
              <button style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"#fff",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{removeZone(z.id);setEditZone(null)}}>🗑️</button>
            </div>
          </div>
          :<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:700,color:"#6366F1"}}>{fmt(z.price)}</span>
            <button style={{padding:"6px 14px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#5E5B53"}} onClick={()=>{setEditZone(z.id);setEditPrice(String(z.price));setEditAreas(z.areas)}}>✏️ Modifier</button>
          </div>
        }
      </div>)}

      {/* Add zone */}
      {showAddZone?<div style={{padding:16,background:"#fff",border:"2px solid #6366F1",borderRadius:16,marginBottom:14}}>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>➕ Ajouter une zone</h4>
        {zoneSuggestions.length>0&&<>
          <div style={{fontSize:11,fontWeight:600,color:"#908C82",marginBottom:6}}>Suggestions</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{zoneSuggestions.map(n=><span key={n} onClick={()=>setAzName(n)} style={{padding:"6px 12px",borderRadius:8,border:azName===n?"2px solid #6366F1":"1px solid #E8E6E1",background:azName===n?"rgba(99,102,241,0.04)":"#fff",fontSize:11,fontWeight:600,cursor:"pointer",color:azName===n?"#6366F1":"#5E5B53"}}>{azName===n?"✓ ":""}{n}</span>)}</div>
        </>}
        <div className="field"><label>Nom de la zone</label><input value={azName} onChange={e=>setAzName(e.target.value)} placeholder="Ex: Dolisie Centre"/></div>
        <div className="field"><label>Quartiers</label><input value={azAreas} onChange={e=>setAzAreas(e.target.value)} placeholder="Ex: Centre-ville, Loubomo"/></div>
        <div className="field"><label>Frais de livraison (FCFA)</label><input type="number" value={azPrice} onChange={e=>setAzPrice(e.target.value)}/></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setShowAddZone(false);setAzName("");setAzAreas("")}}>Annuler</button>
          <button className="btn-primary" style={{flex:2,background:azName?"#6366F1":"#E8E6E1",color:azName?"#fff":"#908C82"}} onClick={addZone}>Ajouter la zone</button>
        </div>
      </div>
      :<button style={{width:"100%",padding:14,borderRadius:14,border:"2px dashed #6366F1",background:"rgba(99,102,241,0.02)",color:"#6366F1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowAddZone(true)}>+ Ajouter une zone</button>}
    </div>}
  </div>);
}

/* V12b ── DRIVER PROFILE ── */
/* V12c ── ADD DRIVER ── */

export default VDeliveryScr;
