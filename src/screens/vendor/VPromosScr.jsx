import Select from "../../components/Select";
import { useState } from "react";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonCards } from "../../components/Loading";
import toast from "../../utils/toast";

function VPromosScr({go,onBack}){
  const { data: rawPromos, loading } = useLoad(() => vendor.getPromos());
  const [promos,setPromos]=useState(null);
  const [tab,setTab]=useState("active");
  const [editPromo,setEditPromo]=useState(null);
  const [deleteConfirm,setDeleteConfirm]=useState(null);

  const items=promos||(rawPromos||[]);
  const activePromos=items.filter(p=>p.active);
  const inactivePromos=items.filter(p=>!p.active);
  const shown=tab==="active"?activePromos:inactivePromos;

  const togglePromo=(id)=>{
    const updated=items.map(p=>p.id===id?{...p,active:!p.active}:p);
    setPromos(updated);
    const promo=updated.find(p=>p.id===id);
    toast.success(promo.active?"Promotion activée 🏷️":"Promotion désactivée ⏸️");
  };

  const deletePromo=(id)=>{
    setPromos(items.filter(p=>p.id!==id));
    setDeleteConfirm(null);
    toast.success("Promotion supprimée 🗑️");
  };

  const saveEdit=()=>{
    if(!editPromo)return;
    const exists=items.find(p=>p.id===editPromo.id);
    if(exists){
      setPromos(items.map(p=>p.id===editPromo.id?editPromo:p));
      toast.success("Promotion modifiée ✏️");
    }else{
      setPromos([{...editPromo,id:"pr"+Date.now(),used:0},...items]);
      toast.success("Promotion créée 🏷️");
    }
    setEditPromo(null);
  };

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}>
      <button onClick={onBack}>←</button>
      <h2>Promotions ({items.length})</h2>
      <button onClick={()=>setEditPromo({name:"",discount:20,type:"%",code:"",products:"Tous les articles",start:"",end:"",active:true,min:0})} style={{fontSize:20}}>+</button>
    </div>

    {loading?<SkeletonCards count={2}/>:<>
      {/* Tabs */}
      <div style={{display:"flex",gap:0,marginBottom:12,background:"var(--light)",borderRadius:12,padding:3}}>
        <button onClick={()=>setTab("active")} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:tab==="active"?"var(--card)":"transparent",color:tab==="active"?"#10B981":"var(--muted)",fontSize:11,fontWeight:tab==="active"?700:500,cursor:"pointer",fontFamily:"inherit",boxShadow:tab==="active"?"0 1px 4px rgba(0,0,0,.06)":"none"}}>🟢 En cours ({activePromos.length})</button>
        <button onClick={()=>setTab("inactive")} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:tab==="inactive"?"var(--card)":"transparent",color:tab==="inactive"?"var(--muted)":"var(--muted)",fontSize:11,fontWeight:tab==="inactive"?700:500,cursor:"pointer",fontFamily:"inherit",boxShadow:tab==="inactive"?"0 1px 4px rgba(0,0,0,.06)":"none"}}>⏸️ Terminées ({inactivePromos.length})</button>
      </div>

      {shown.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36,marginBottom:8}}>🏷️</div><div style={{fontSize:13,color:"var(--muted)"}}>{tab==="active"?"Aucune promotion active":"Aucune promotion terminée"}</div></div>}

      {shown.map(p=>(
        <div key={p.id} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:40,height:40,borderRadius:12,background:p.active?"linear-gradient(135deg,#10B981,#059669)":"var(--border)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16,fontWeight:800,flexShrink:0}}>
                {p.discount}{p.type}
              </div>
              <div>
                <h4 style={{fontSize:14,fontWeight:700}}>{p.name}</h4>
                {p.code&&<div style={{fontSize:10,fontFamily:"monospace",color:"#F97316",fontWeight:600,marginTop:1}}>Code: {p.code}</div>}
              </div>
            </div>
            {/* Toggle switch */}
            <div className={`toggle ${p.active?"on":""}`} onClick={()=>togglePromo(p.id)} style={{flexShrink:0}}/>
          </div>

          {/* Details */}
          <div style={{fontSize:12,color:"var(--sub)",marginBottom:4}}>📦 {p.products}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:8}}>📅 Du {p.start} au {p.end} · {p.used} utilisations</div>

          {/* Actions */}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setEditPromo({...p})} style={{flex:1,padding:"8px 0",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>✏️ Modifier</button>
            <button onClick={()=>setDeleteConfirm(p)} style={{padding:"8px 14px",borderRadius:10,border:"1px solid rgba(239,68,68,0.2)",background:"transparent",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🗑️</button>
          </div>
        </div>
      ))}
    </>}

    {/* Edit / Create Modal */}
    {editPromo&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setEditPromo(null)}>
      <div style={{background:"var(--card)",borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:400,maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{fontSize:17,fontWeight:700}}>{editPromo.id?"✏️ Modifier":"🏷️ Nouvelle promo"}</h3>
          <button onClick={()=>setEditPromo(null)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"var(--muted)"}}>✕</button>
        </div>

        <div className="field"><label>Nom</label><input value={editPromo.name} onChange={e=>setEditPromo({...editPromo,name:e.target.value})} placeholder="Soldes de Mars"/></div>
        <div className="field-row">
          <div className="field"><label>Réduction</label><input type="number" value={editPromo.discount} onChange={e=>setEditPromo({...editPromo,discount:parseInt(e.target.value)||0})} placeholder="20"/></div>
          <div className="field"><label>Code (opt.)</label><input value={editPromo.code||""} onChange={e=>setEditPromo({...editPromo,code:e.target.value.toUpperCase()})} placeholder="PROMO20"/></div>
        </div>
        <div className="field"><label>Produits concernés</label>
          <Select value={editPromo.products} onChange={v=>setEditPromo({...editPromo,products:v})} options={["Tous les articles","Premier achat","Mode uniquement","Électronique"]}/>
        </div>
        <div className="field-row">
          <div className="field"><label>Date début</label><input type="date" value={editPromo.startDate||""} onChange={e=>setEditPromo({...editPromo,startDate:e.target.value,start:new Date(e.target.value).toLocaleDateString("fr-FR",{day:"numeric",month:"short"})})}/></div>
          <div className="field"><label>Date fin</label><input type="date" value={editPromo.endDate||""} onChange={e=>setEditPromo({...editPromo,endDate:e.target.value,end:new Date(e.target.value).toLocaleDateString("fr-FR",{day:"numeric",month:"short"})})}/></div>
        </div>

        {/* Active toggle */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",marginBottom:12,borderTop:"1px solid var(--border)"}}>
          <span style={{fontSize:13,fontWeight:600}}>Promotion active</span>
          <div className={`toggle ${editPromo.active?"on":""}`} onClick={()=>setEditPromo({...editPromo,active:!editPromo.active})}/>
        </div>

        <button onClick={saveEdit} disabled={!editPromo.name} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:editPromo.name?"#F97316":"var(--border)",color:editPromo.name?"var(--card)":"var(--muted)",fontSize:14,fontWeight:700,cursor:editPromo.name?"pointer":"not-allowed",fontFamily:"inherit"}}>
          {editPromo.id?"💾 Enregistrer les modifications":"🏷️ Créer la promotion"}
        </button>
      </div>
    </div>}

    {/* Delete confirm */}
    {deleteConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setDeleteConfirm(null)}>
      <div style={{background:"var(--card)",borderRadius:20,padding:24,maxWidth:340,width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:40,marginBottom:10}}>🗑️</div>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:6}}>Supprimer la promo ?</h3>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:14}}>"{deleteConfirm.name}" sera supprimée définitivement.</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setDeleteConfirm(null)} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
          <button onClick={()=>deletePromo(deleteConfirm.id)} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Supprimer</button>
        </div>
      </div>
    </div>}
  </div>);
}

export default VPromosScr;
