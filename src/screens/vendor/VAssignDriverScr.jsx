import { useState } from "react";
import { fmt } from "../../utils/helpers";

function VAssignDriverScr({order:o,onBack,go}){
  const drivers=[
    {id:"d1",name:"Patrick Moukala",vehicle:"🛵 Honda PCX",plate:"BZ-4521",rating:4.8,deliveries:342,eta:"12 min",zone:"Bacongo, Makélékélé",avatar:"🧑",status:"available"},
    {id:"d3",name:"Grace Okemba",vehicle:"🛵 Yamaha NMAX",plate:"BZ-2190",rating:4.9,deliveries:267,eta:"18 min",zone:"Poto-Poto, Moungali",avatar:"👩",status:"available"},
    {id:"d2",name:"Jean Mbemba",vehicle:"🚗 Toyota Vitz",plate:"BZ-7803",rating:4.5,deliveries:128,eta:"25 min",zone:"Talangaï, Mfilou",avatar:"👨",status:"busy"},
  ];
  const [selected,setSelected]=useState(null);
  const [step,setStep]=useState(0); // 0=choose, 1=confirm, 2=success
  const chosen=drivers.find(d=>d.id===selected);

  if(step===2)return(<div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"}}>
    <div style={{textAlign:"center",padding:"40px 24px"}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:40,animation:"splash-pop .5s ease"}}>✅</div>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:6}}>Livreur assigné !</h2>
      <p style={{fontSize:14,color:"#5E5B53",lineHeight:1.6,marginBottom:8}}><b>{chosen?.name}</b> a été notifié et prendra en charge la commande <b>{o.ref}</b></p>
      <div style={{padding:16,background:"#F5F4F1",borderRadius:16,margin:"16px 0",textAlign:"left"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#10B981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{chosen?.avatar}</div>
          <div><div style={{fontSize:15,fontWeight:700}}>{chosen?.name}</div><div style={{fontSize:12,color:"#908C82"}}>{chosen?.vehicle} · {chosen?.plate}</div></div>
        </div>
        {[["📦 Commande",o.ref],["👤 Client",o.client],["📍 Adresse",o.addr],["⏱️ Temps estimé",chosen?.eta]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:"1px solid #E8E6E1",fontSize:12}}><span style={{color:"#908C82"}}>{l}</span><b>{v}</b></div>)}
      </div>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:14,borderRadius:14,border:"none",background:"#6366F1",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("vDriverChat",{ref:o.ref,driver:chosen.name,driverAv:chosen.avatar})}>💬 Contacter le livreur</button>
      </div>
      <button style={{marginTop:10,width:"100%",padding:14,borderRadius:14,border:"1px solid #E8E6E1",background:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#191815"}} onClick={onBack}>← Retour à la commande</button>
    </div>
  </div>);

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Assigner un livreur</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>

      {/* Order summary */}
      <div style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:12,background:"rgba(99,102,241,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📦</div>
        <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700}}>{o.ref}</div><div style={{fontSize:12,color:"#908C82"}}>{o.client} · {o.addr}</div><div style={{fontSize:12,color:"#908C82"}}>{o.items?.map(it=>it.name).join(", ")}</div></div>
        <div style={{fontSize:14,fontWeight:700,color:"#6366F1",flexShrink:0}}>{fmt(o.total)}</div>
      </div>

      {step===0&&<>
        <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>Choisir un livreur</div>
        <p style={{fontSize:12,color:"#908C82",marginBottom:14}}>Sélectionnez un livreur disponible pour cette commande</p>

        {drivers.map(d=><div key={d.id} onClick={()=>d.status==="available"&&setSelected(d.id)} style={{padding:16,background:selected===d.id?"rgba(99,102,241,0.04)":"#fff",border:selected===d.id?"2px solid #6366F1":"1px solid #E8E6E1",borderRadius:16,marginBottom:10,cursor:d.status==="available"?"pointer":"default",opacity:d.status==="available"?1:0.5,transition:"all .2s"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:48,height:48,borderRadius:14,background:selected===d.id?"linear-gradient(135deg,#6366F1,#A855F7)":"#F5F4F1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,transition:"all .2s"}}>{d.avatar}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14,fontWeight:700}}>{d.name}</span><span className={`del-status ${d.status}`} style={d.status==="busy"?{}:{}}>{d.status==="available"?"🟢 Dispo":"🟡 Occupé"}</span></div>
              <div style={{fontSize:12,color:"#908C82",marginTop:2}}>{d.vehicle} · {d.plate}</div>
              <div style={{display:"flex",gap:10,marginTop:4,fontSize:11,color:"#908C82"}}><span>⭐ {d.rating}</span><span>📦 {d.deliveries} livrais.</span><span>📍 {d.zone}</span></div>
            </div>
            {d.status==="available"&&<div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:"#6366F1"}}>{d.eta}</div><div style={{fontSize:10,color:"#908C82"}}>estimé</div></div>}
          </div>
          {selected===d.id&&<div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(99,102,241,0.15)",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>✓</span><span style={{fontSize:12,color:"#6366F1",fontWeight:600}}>Livreur sélectionné · Temps estimé : {d.eta}</span>
          </div>}
        </div>)}

        {drivers.filter(d=>d.status==="busy").length>0&&<div className="info-box yellow" style={{marginTop:6}}><span>💡</span><span>Les livreurs occupés seront disponibles une fois leur livraison en cours terminée.</span></div>}
      </>}

      {step===1&&<>
        <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>Confirmer l'assignation</div>
        <p style={{fontSize:12,color:"#908C82",marginBottom:16}}>Vérifiez les détails avant de confirmer</p>

        <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{chosen?.avatar}</div>
            <div><div style={{fontSize:16,fontWeight:700}}>{chosen?.name}</div><div style={{fontSize:13,color:"#908C82"}}>{chosen?.vehicle} · {chosen?.plate}</div><div style={{fontSize:12,color:"#F59E0B",marginTop:2}}>⭐ {chosen?.rating} · {chosen?.deliveries} livraisons</div></div>
          </div>
          {[["Commande",o.ref],["Client",o.client],["Adresse livraison",o.addr],["Montant",fmt(o.total)],["Temps estimé",chosen?.eta],["Frais livraison","2 500 FCFA"]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:"1px solid #F5F4F1",fontSize:13}}><span style={{color:"#908C82"}}>{l}</span><b>{v}</b></div>)}
        </div>

        <div className="info-box green"><span>📱</span><span>Le livreur recevra une notification avec les détails de la commande et l'adresse du client.</span></div>
      </>}

    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}>
      {step===0&&<button className="btn-primary" style={{opacity:selected?1:0.5}} onClick={()=>selected&&setStep(1)} disabled={!selected}>Continuer{chosen?` avec ${chosen.name}`:""}</button>}
      {step===1&&<div style={{display:"flex",gap:10}}><button className="btn-outline" style={{flex:1}} onClick={()=>setStep(0)}>← Changer</button><button className="btn-primary" style={{flex:2}} onClick={()=>setStep(2)}>✅ Confirmer l'assignation</button></div>}
    </div>
  </div>);
}

export default VAssignDriverScr;
