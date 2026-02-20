import { useState } from "react";

function DrZonesScr({onBack}){
  const [zones,setZones]=useState([{id:"z1",name:"Brazzaville Sud",areas:"Bacongo, Makélékélé",active:true},{id:"z2",name:"Brazzaville Centre",areas:"Poto-Poto, Moungali, Ouenzé",active:true},{id:"z3",name:"Brazzaville Nord",areas:"Talangaï, Mfilou, Djiri",active:false},{id:"z4",name:"Pointe-Noire",areas:"Centre-ville, Loandjili",active:false}]);
  const toggle=i=>{const z=[...zones];z[i].active=!z[i].active;setZones(z)};
  const remove=id=>setZones(zones.filter(z=>z.id!==id));
  const [showAdd,setShowAdd]=useState(false);
  const [addName,setAddName]=useState("");const [addAreas,setAddAreas]=useState("");
  const [saved,setSaved]=useState(false);
  const allSuggested=[
    {name:"Brazzaville Sud",areas:"Bacongo, Makélékélé"},
    {name:"Brazzaville Centre",areas:"Poto-Poto, Moungali, Ouenzé"},
    {name:"Brazzaville Nord",areas:"Talangaï, Mfilou, Djiri"},
    {name:"Pointe-Noire Centre",areas:"Centre-ville, Loandjili"},
    {name:"Pointe-Noire Nord",areas:"Tié-Tié, Ngoyo"},
    {name:"Dolisie",areas:"Centre, Loubomo"},
    {name:"Nkayi",areas:"Centre-ville"},
    {name:"Oyo",areas:"Centre"}
  ];
  const existingNames=zones.map(z=>z.name);
  const suggestions=allSuggested.filter(s=>!existingNames.includes(s.name));
  const doAdd=()=>{
    if(!addName)return;
    setZones([...zones,{id:"z"+Date.now(),name:addName,areas:addAreas||"Zone personnalisée",active:true}]);
    setAddName("");setAddAreas("");setShowAdd(false);
  };
  const doSave=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500)};

  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Mes zones de livraison</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 80px"}}>
      <div className="info-box blue" style={{marginBottom:14}}><span>📍</span><span style={{fontSize:11}}>Activez/désactivez les zones où vous acceptez des livraisons. Ajoutez de nouvelles zones selon votre couverture.</span></div>

      <div style={{fontSize:12,color:"#908C82",marginBottom:8}}>{zones.filter(z=>z.active).length} zone{zones.filter(z=>z.active).length>1?"s":""} active{zones.filter(z=>z.active).length>1?"s":""} sur {zones.length}</div>

      {zones.map((z,i)=><div key={z.id} style={{padding:14,background:"#fff",border:z.active?"1px solid rgba(16,185,129,0.3)":"1px solid #E8E6E1",borderRadius:14,marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><h4 style={{fontSize:14,fontWeight:700}}>{z.name}</h4>{z.active&&<span style={{width:8,height:8,borderRadius:4,background:"#10B981"}}/>}</div>
            <div style={{fontSize:11,color:"#908C82",marginTop:2}}>📍 {z.areas}</div>
          </div>
          <div className={`toggle ${z.active?"on":""}`} onClick={()=>toggle(i)}/>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:"1px solid #F5F4F1"}}>
          <span style={{flex:1,fontSize:11,color:z.active?"#10B981":"#908C82",fontWeight:600}}>{z.active?"✅ Active":"⏸️ Inactive"}</span>
          <button style={{padding:"4px 12px",borderRadius:6,border:"1px solid rgba(239,68,68,0.2)",background:"#fff",color:"#EF4444",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>remove(z.id)}>Retirer</button>
        </div>
      </div>)}

      {/* Add zone */}
      {showAdd?<div style={{padding:16,background:"#fff",border:"2px solid #10B981",borderRadius:16,marginBottom:14}}>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>➕ Ajouter une zone</h4>

        {suggestions.length>0&&<>
          <div style={{fontSize:12,fontWeight:600,color:"#5E5B53",marginBottom:8}}>Zones suggérées</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {suggestions.map(s=><span key={s.name} onClick={()=>{setAddName(s.name);setAddAreas(s.areas)}} style={{padding:"6px 12px",borderRadius:8,border:addName===s.name?"2px solid #10B981":"1px solid #E8E6E1",background:addName===s.name?"rgba(16,185,129,0.04)":"#fff",fontSize:11,fontWeight:600,cursor:"pointer",color:addName===s.name?"#10B981":"#5E5B53"}}>{addName===s.name?"✓ ":""}{s.name}</span>)}
          </div>
        </>}

        <div style={{fontSize:12,fontWeight:600,color:"#5E5B53",marginBottom:8}}>Ou zone personnalisée</div>
        <div className="field"><label>Nom de la zone</label><input value={addName} onChange={e=>setAddName(e.target.value)} placeholder="Ex: Ouenzé Nord"/></div>
        <div className="field"><label>Quartiers couverts</label><input value={addAreas} onChange={e=>setAddAreas(e.target.value)} placeholder="Ex: Moukondo, Ngamakosso"/></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setShowAdd(false);setAddName("");setAddAreas("")}}>Annuler</button>
          <button className="btn-primary" style={{flex:2,background:addName?"#10B981":"#E8E6E1",color:addName?"#fff":"#908C82"}} onClick={doAdd}>Ajouter</button>
        </div>
      </div>
      :<button style={{width:"100%",padding:14,borderRadius:14,border:"2px dashed #10B981",background:"rgba(16,185,129,0.02)",color:"#10B981",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:14}} onClick={()=>setShowAdd(true)}>+ Ajouter une zone de livraison</button>}

      <button className="btn-primary" style={{background:saved?"#10B981":"#6366F1"}} onClick={doSave}>{saved?"✅ Zones sauvegardées":"💾 Enregistrer mes zones"}</button>
    </div>
  </div>);
}

/* D13 ── DRIVER STATS ── */

export default DrZonesScr;
