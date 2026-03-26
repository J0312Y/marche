import toast from "../../utils/toast";
import { useState } from "react";
import { useLoad } from "../../hooks";
import { user as userSvc } from "../../services";
import { SkeletonList } from "../../components/Loading";

function AddressesScr({onBack}){
  const { data: loadedAddrs, loading } = useLoad(() => userSvc.getAddresses());
  const [addrs,setAddrs]=useState(null);
  const list = addrs || (loadedAddrs || []).map(a=>({...a}));
  const setList = (fn) => setAddrs(typeof fn === 'function' ? fn(list) : fn);
  const [adding,setAdding]=useState(false);
  const [adName,setAdName]=useState("");
  const [adQuart,setAdQuart]=useState("");
  const [adCity,setAdCity]=useState("Brazzaville");
  const [adPhone,setAdPhone]=useState("");
  const [adNote,setAdNote]=useState("");
  const [addrErrors,setAddrErrors]=useState({});
  const clrA=(k)=>setAddrErrors(p=>{const n={...p};delete n[k];return n});
  const remove=id=>{toast.success("Adresse supprimée");setList(prev=>prev.filter(a=>a.id!==id))};
  const setDefault=id=>setList(prev=>prev.map(a=>({...a,def:a.id===id})));
  if(loading) return <div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Mes adresses</h2><div style={{width:38}}/></div><SkeletonList count={3}/></div>;
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Mes adresses</h2><div style={{width:38}}/></div>
    {list.map(a=><div key={a.id} className={`addr-card ${a.def?"def":""}`}>
      <div className="ai">{a.def?"🏠":"🏢"}</div>
      <div className="ab"><h4>{a.label}{a.def&&<span className="def-badge">Par défaut</span>}</h4><p>{a.addr}<br/>{a.city}, Congo</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {!a.def&&<button style={{padding:"4px 8px",borderRadius:6,border:"1px solid var(--border)",background:"var(--card)",fontSize:10,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setDefault(a.id)}>Par défaut</button>}
        <button style={{padding:"4px 8px",borderRadius:6,border:"1px solid rgba(239,68,68,.2)",background:"var(--card)",fontSize:10,color:"#EF4444",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>remove(a.id)}>Supprimer</button>
      </div>
    </div>)}
    {adding&&<div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
      <div className="field"><label>Nom <span style={{color:"#EF4444"}}>*</span></label><input value={adName} onChange={e=>{setAdName(e.target.value);clrA("name")}} placeholder="Ex: Bureau"/>{addrErrors.name&&<div className="err-msg">{addrErrors.name}</div>}</div>
      <div className="field"><label>Adresse <span style={{color:"#EF4444"}}>*</span></label><input value={adAddr} onChange={e=>{setAdAddr(e.target.value);clrA("addr")}} placeholder="Rue, numéro..."/>{addrErrors.addr&&<div className="err-msg">{addrErrors.addr}</div>}</div>
      <div className="field-row"><div className="field"><label>Quartier <span style={{color:"#EF4444"}}>*</span></label><input value={adQuart} onChange={e=>{setAdQuart(e.target.value);clrA("quart")}} placeholder="Bacongo"/>{addrErrors.quart&&<div className="err-msg">{addrErrors.quart}</div>}</div><div className="field"><label>Ville <span style={{color:"#EF4444"}}>*</span></label><input value={adCity} onChange={e=>{setAdCity(e.target.value);clrA("city")}} placeholder="Brazzaville"/>{addrErrors.city&&<div className="err-msg">{addrErrors.city}</div>}</div></div>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setAdding(false)}>Annuler</button>
        <button className="btn-primary" style={{flex:1}} onClick={()=>{
          const e={};
          if(!adName.trim()) e.name="Nom requis";
          if(!adQuart.trim()) e.quart="Quartier requis";
          if(!adCity.trim()) e.city="Ville requise";
          if(Object.keys(e).length){setAddrErrors(e);return}
          setList(prev=>[...prev,{id:Date.now(),name:adName,quartier:adQuart,city:adCity,phone:adPhone,note:adNote,def:prev.length===0}]);
          setAdName("");setAdQuart("");setAdCity("Brazzaville");setAdPhone("");setAdNote("");setAddrErrors({});
          setAdding(false);toast.success("Adresse ajoutée ✅");
        }}>Enregistrer</button>
      </div>
    </div>}
    {!adding&&<button className="btn-outline" style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setAdding(true)}>+ Ajouter une adresse</button>}
  </div>);
}

export default AddressesScr;
