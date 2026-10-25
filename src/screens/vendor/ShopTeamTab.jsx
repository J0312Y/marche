import Select from "../../components/Select";
import { useState } from "react";
import Icon from "../../components/Icon";
import { useLoad, useAction } from "../../hooks/useData";
import vendorService from "../../services/vendorService";
import toast from "../../utils/toast";


function ShopTeamTab(){
  const { data: teamData, setData: setTeamData } = useLoad(() => vendorService.getTeam());
  const { run } = useAction();
  const ROLE_LABEL = { manager: "Manager", employee: "Employé", cashier: "Caissier" };
  const ROLE_API = { "Manager": "manager", "Employé": "employee", "Caissier": "cashier" };
  // API : establishment_team + infos utilisateur
  const members = (Array.isArray(teamData) ? teamData : []).map(m => m.name ? m : ({
    id: m.id,
    name: [m.first_name, m.last_name].filter(Boolean).join(" ") || "Membre",
    role: ROLE_LABEL[m.role] || m.role,
    email: m.phone || "",
    status: m.status,
    avatar: m.avatar,
    color: m.role === "manager" ? "#10B981" : "#F59E0B",
  }));
  const setMembers = (updater) => setTeamData(typeof updater === "function" ? (prev => updater((prev || []))) : () => updater);
  const [showInvite,setShowInvite]=useState(false);
  const [invName,setInvName]=useState("");
  const [invEmail,setInvEmail]=useState("");
  const [invRole,setInvRole]=useState("Employé");
  const [showRemove,setShowRemove]=useState(null);
  const [invited,setInvited]=useState(false);

  const removeMember=async(id)=>{
    try {
      await run(()=>vendorService.removeMember(id));
      setMembers(prev=>(prev||[]).filter(m=>m.id!==id));
      setShowRemove(null);
    } catch { toast.error("Erreur lors du retrait"); }
  };
  const doInvite=async()=>{
    const phone=invEmail.replace(/\D/g,"").replace(/^242/,"");
    if(!invName||phone.length!==9){toast.error("Indiquez le nom et un numéro à 9 chiffres");return;}
    try {
      await run(()=>vendorService.inviteMember("+242"+phone,ROLE_API[invRole]||"employee"));
      const newMember={id:"new-"+Date.now(),name:invName,role:invRole,email:"+242"+phone,status:"invited",color:invRole==="Manager"?"#10B981":"#F59E0B"};
      setMembers(prev=>[...(prev||[]),newMember]);
      setInvName("");setInvEmail("");setInvRole("Employé");setInvited(true);
      setTimeout(()=>{setInvited(false);setShowInvite(false)},2000);
    } catch (err) { toast.error(err.message||"Erreur lors de l'invitation"); }
  };
  const roleColor=r=>r==="Propriétaire"?"#F97316":r==="Manager"?"#10B981":"#F59E0B";

  return(<div style={{padding:"0 16px 20px"}}>
    <div className="info-box blue" style={{marginBottom:14}}><span></span><span style={{fontSize:11}}>Gérez les collaborateurs de cette boutique</span></div>

    {members.map(m=><div key={m.id} style={{padding:14,background:showRemove===m.id?"rgba(239,68,68,0.02)":"var(--card)",border:showRemove===m.id?"1px solid rgba(239,68,68,0.3)":"1px solid var(--border)",borderRadius:14,marginBottom:10,transition:"all .2s"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:42,height:42,borderRadius:12,background:m.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,flexShrink:0}}>{m.avatar?<img src={m.avatar} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"inherit"}} alt=""/>:m.name.charAt(0).toUpperCase()}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600}}>{m.name}</div>
          <div style={{fontSize:11,color:"var(--muted)"}}>{m.email}</div>
        </div>
        <span style={{padding:"4px 10px",borderRadius:8,background:`${roleColor(m.role)}12`,color:roleColor(m.role),fontSize:10,fontWeight:700}}>{m.role}</span>
      </div>
      {m.role!=="Propriétaire"&&<div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:"1px solid var(--border)"}}>
        <Select value={m.role} onChange={()=>{}} options={["Manager","Employé"]}/>
        {showRemove===m.id
          ?<div style={{display:"flex",gap:6}}>
            <button style={{padding:"8px 12px",borderRadius:8,border:"none",background:"#EF4444",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>removeMember(m.id)}>Confirmer</button>
            <button style={{padding:"8px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowRemove(null)}>Annuler</button>
          </div>
          :<button style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"var(--card)",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowRemove(m.id)}>Retirer</button>
        }
      </div>}
    </div>)}

    {/* Invite form */}
    {showInvite?<div style={{padding:16,background:"var(--card)",border:"2px solid #F97316",borderRadius:16,marginBottom:14}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}> Inviter un collaborateur</h4>
      <div className="field"><label>Nom complet</label><input value={invName} onChange={e=>setInvName(e.target.value)} placeholder="Ex: Sarah Mouanda"/></div>
      <div className="field"><label>Téléphone (compte Lamuka)</label><input value={invEmail} onChange={e=>setInvEmail(e.target.value.replace(/[^0-9]/g,"").slice(0,9))} placeholder="06X XXX XXX" type="tel" inputMode="numeric"/></div>
      <div className="field"><label>Rôle</label>
        <div style={{display:"flex",gap:8}}>
          {["Manager","Employé"].map(r=><button key={r} onClick={()=>setInvRole(r)} style={{flex:1,padding:10,borderRadius:10,border:invRole===r?"2px solid #F97316":"1px solid var(--border)",background:invRole===r?"rgba(249,115,22,0.04)":"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:invRole===r?"#F97316":"var(--muted)"}}>{r}</button>)}
        </div>
      </div>
      <div className="info-box blue" style={{marginBottom:10,padding:"6px 10px"}}><span><Icon name="mail" size={18}/></span><span style={{fontSize:11}}>Un email d'invitation sera envoyé à cette adresse</span></div>
      <div style={{display:"flex",gap:8}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setShowInvite(false);setInvName("");setInvEmail("")}}>Annuler</button>
        <button className="btn-primary" style={{flex:2,background:invited?"#10B981":(invName&&invEmail)?"#F97316":"var(--border)",color:(invName&&invEmail)||invited?"var(--card)":"var(--muted)"}} onClick={doInvite}>{invited?"Invitation envoyée !":"Envoyer l'invitation"}</button>
      </div>
    </div>
    :<button className="btn-primary" onClick={()=>setShowInvite(true)}>+ Inviter un collaborateur</button>}

    <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Rôles et permissions</div>
    <div style={{padding:14,background:"var(--light)",borderRadius:14}}>
      {[["Propriétaire","Accès total, facturation, suppression établissement"],["Manager","Articles, commandes, livraisons, analytics, promotions"],["Employé","Commandes et gestion des articles uniquement"]].map(([r,d],i)=><div key={r} style={{display:"flex",gap:8,padding:"8px 0",...(i<2?{borderBottom:"1px solid var(--border)"}:{}),fontSize:12}}>
        <b style={{minWidth:85,color:roleColor(r)}}>{r}</b><span style={{color:"var(--muted)"}}>{d}</span>
      </div>)}
    </div>
  </div>);
}

/* V18c ── SHOP DETAIL ── */

export default ShopTeamTab;
