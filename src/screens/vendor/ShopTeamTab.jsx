import { useState } from "react";

function ShopTeamTab(){
  const initMembers=[
    {id:"m1",name:"Joeldy Tsina",role:"Propriétaire",email:"joeldytsina94@gmail.com",avatar:"J",color:"#6366F1"},
    {id:"m2",name:"Marie Loubaki",role:"Manager",email:"marie.l@email.com",avatar:"M",color:"#10B981"},
    {id:"m3",name:"Paul Nkaya",role:"Employé",email:"paul.n@email.com",avatar:"P",color:"#F59E0B"}
  ];
  const [members,setMembers]=useState(initMembers);
  const [showInvite,setShowInvite]=useState(false);
  const [invName,setInvName]=useState("");
  const [invEmail,setInvEmail]=useState("");
  const [invRole,setInvRole]=useState("Employé");
  const [showRemove,setShowRemove]=useState(null);
  const [invited,setInvited]=useState(false);

  const removeMember=id=>{ setMembers(members.filter(m=>m.id!==id)); setShowRemove(null); };
  const doInvite=()=>{
    if(!invName||!invEmail)return;
    setMembers([...members,{id:"m"+Date.now(),name:invName,role:invRole,email:invEmail,avatar:invName[0].toUpperCase(),color:invRole==="Manager"?"#10B981":"#F59E0B"}]);
    setInvName("");setInvEmail("");setInvRole("Employé");setInvited(true);
    setTimeout(()=>{setInvited(false);setShowInvite(false)},2000);
  };
  const roleColor=r=>r==="Propriétaire"?"#6366F1":r==="Manager"?"#10B981":"#F59E0B";

  return(<div style={{padding:"0 20px 80px"}}>
    <div className="info-box blue" style={{marginBottom:14}}><span>👥</span><span style={{fontSize:11}}>Gérez les collaborateurs de cette boutique</span></div>

    {members.map(m=><div key={m.id} style={{padding:14,background:showRemove===m.id?"rgba(239,68,68,0.02)":"#fff",border:showRemove===m.id?"1px solid rgba(239,68,68,0.3)":"1px solid #E8E6E1",borderRadius:14,marginBottom:10,transition:"all .2s"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:42,height:42,borderRadius:12,background:m.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,flexShrink:0}}>{m.avatar}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600}}>{m.name}</div>
          <div style={{fontSize:11,color:"#908C82"}}>{m.email}</div>
        </div>
        <span style={{padding:"4px 10px",borderRadius:8,background:`${roleColor(m.role)}12`,color:roleColor(m.role),fontSize:10,fontWeight:700}}>{m.role}</span>
      </div>
      {m.role!=="Propriétaire"&&<div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:"1px solid #F5F4F1"}}>
        <select defaultValue={m.role} style={{flex:1,padding:8,borderRadius:8,border:"1px solid #E8E6E1",fontSize:11,fontFamily:"inherit",background:"#fff"}}>
          <option>Manager</option><option>Employé</option>
        </select>
        {showRemove===m.id
          ?<div style={{display:"flex",gap:6}}>
            <button style={{padding:"8px 12px",borderRadius:8,border:"none",background:"#EF4444",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>removeMember(m.id)}>Confirmer</button>
            <button style={{padding:"8px 12px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowRemove(null)}>Annuler</button>
          </div>
          :<button style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"#fff",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowRemove(m.id)}>Retirer</button>
        }
      </div>}
    </div>)}

    {/* Invite form */}
    {showInvite?<div style={{padding:16,background:"#fff",border:"2px solid #6366F1",borderRadius:16,marginBottom:14}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>📩 Inviter un collaborateur</h4>
      <div className="field"><label>Nom complet</label><input value={invName} onChange={e=>setInvName(e.target.value)} placeholder="Ex: Sarah Mouanda"/></div>
      <div className="field"><label>Email</label><input value={invEmail} onChange={e=>setInvEmail(e.target.value)} placeholder="sarah@email.com" type="email"/></div>
      <div className="field"><label>Rôle</label>
        <div style={{display:"flex",gap:8}}>
          {["Manager","Employé"].map(r=><button key={r} onClick={()=>setInvRole(r)} style={{flex:1,padding:10,borderRadius:10,border:invRole===r?"2px solid #6366F1":"1px solid #E8E6E1",background:invRole===r?"rgba(99,102,241,0.04)":"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:invRole===r?"#6366F1":"#908C82"}}>{r}</button>)}
        </div>
      </div>
      <div className="info-box blue" style={{marginBottom:10,padding:"6px 10px"}}><span>📧</span><span style={{fontSize:11}}>Un email d'invitation sera envoyé à cette adresse</span></div>
      <div style={{display:"flex",gap:8}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setShowInvite(false);setInvName("");setInvEmail("")}}>Annuler</button>
        <button className="btn-primary" style={{flex:2,background:invited?"#10B981":(invName&&invEmail)?"#6366F1":"#E8E6E1",color:(invName&&invEmail)||invited?"#fff":"#908C82"}} onClick={doInvite}>{invited?"✅ Invitation envoyée !":"📤 Envoyer l'invitation"}</button>
      </div>
    </div>
    :<button className="btn-primary" onClick={()=>setShowInvite(true)}>+ Inviter un collaborateur</button>}

    <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Rôles et permissions</div>
    <div style={{padding:14,background:"#F5F4F1",borderRadius:14}}>
      {[["Propriétaire","Accès total, facturation, suppression établissement"],["Manager","Articles, commandes, livraisons, analytics, promotions"],["Employé","Commandes et gestion des articles uniquement"]].map(([r,d],i)=><div key={r} style={{display:"flex",gap:8,padding:"8px 0",...(i<2?{borderBottom:"1px solid #E8E6E1"}:{}),fontSize:12}}>
        <b style={{minWidth:85,color:roleColor(r)}}>{r}</b><span style={{color:"#908C82"}}>{d}</span>
      </div>)}
    </div>
  </div>);
}

/* V18c ── SHOP DETAIL ── */

export default ShopTeamTab;
