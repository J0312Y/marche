import { useState } from "react";

const TRENDS=[
  {name:"Smartphones",growth:"+32%",volume:"Très élevé",opportunity:"🟢 Fort"},
  {name:"Mode Wax",growth:"+28%",volume:"Élevé",opportunity:"🟢 Fort"},
  {name:"Livraison repas",growth:"+45%",volume:"Très élevé",opportunity:"🟡 Moyen"},
  {name:"Cosmétiques bio",growth:"+18%",volume:"Moyen",opportunity:"🟢 Fort"},
  {name:"Électroménager",growth:"+12%",volume:"Moyen",opportunity:"🟡 Moyen"},
];
const COMPETITORS=[
  {name:"Tech Congo",products:50,rating:4.9,avgPrice:"95 000 F",strength:"Prix compétitifs"},
  {name:"Mode Afrique",products:35,rating:4.8,avgPrice:"28 000 F",strength:"Photos de qualité"},
  {name:"Super U",products:120,rating:4.5,avgPrice:"12 000 F",strength:"Large catalogue"},
];
const SUGGESTIONS=[
  {icon:"🏷️",title:"Lancez une promo -15%",desc:"Vos concurrents ont des promos actives. Une remise de 15% pourrait augmenter vos ventes de 40%."},
  {icon:"📸",title:"Améliorez vos photos",desc:"Les produits avec 3+ photos se vendent 2x plus. 4 de vos produits n'ont qu'une photo."},
  {icon:"⏰",title:"Publiez entre 18h-20h",desc:"C'est le pic de trafic sur Lamuka. Vos stories à cette heure auront 3x plus de vues."},
  {icon:"🔥",title:"Ajoutez des ventes flash",desc:"Les vendeurs avec ventes flash ont +60% de commandes. Essayez sur vos 3 meilleurs produits."},
];

function VAdvisorScr({onBack,vendorPlan}){
  const [tab,setTab]=useState(0);
  const isEnterprise=vendorPlan==="enterprise";

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>📊 Business Advisor</h2><div style={{width:38}}/></div>

    <div style={{display:"flex",gap:4,marginBottom:14,background:"var(--light)",borderRadius:12,padding:3}}>
      {["💡 Conseils","📈 Tendances","🏪 Concurrents"].map((t,i)=>(
        <button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:8,borderRadius:10,border:"none",background:tab===i?"var(--card)":"transparent",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:tab===i?"var(--text)":"var(--muted)",boxShadow:tab===i?"0 1px 3px rgba(0,0,0,.08)":"none"}}>{t}</button>
      ))}
    </div>

    {tab===0&&<>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>💡 Recommandations personnalisées</div>
      {SUGGESTIONS.map((s,i)=>(
        <div key={i} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,display:"flex",gap:12}}>
          <span style={{fontSize:24}}>{s.icon}</span>
          <div><div style={{fontSize:13,fontWeight:700}}>{s.title}</div><div style={{fontSize:11,color:"var(--muted)",lineHeight:1.5,marginTop:2}}>{s.desc}</div></div>
        </div>
      ))}
    </>}

    {tab===1&&<>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>📈 Tendances du marché</div>
      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden"}}>
        <div style={{display:"flex",padding:"8px 12px",fontSize:10,fontWeight:700,color:"var(--muted)",borderBottom:"1px solid var(--border)"}}>
          <span style={{flex:2}}>Catégorie</span><span style={{flex:1,textAlign:"center"}}>Croissance</span><span style={{flex:1,textAlign:"center"}}>Opportunité</span>
        </div>
        {TRENDS.map(t=>(
          <div key={t.name} style={{display:"flex",padding:"10px 12px",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
            <span style={{flex:2,fontSize:13,fontWeight:500}}>{t.name}</span>
            <span style={{flex:1,textAlign:"center",fontSize:12,fontWeight:700,color:"#10B981"}}>{t.growth}</span>
            <span style={{flex:1,textAlign:"center",fontSize:11}}>{t.opportunity}</span>
          </div>
        ))}
      </div>
      {!isEnterprise&&<div style={{marginTop:12,padding:12,background:"rgba(245,158,11,0.06)",borderRadius:12,fontSize:11,color:"var(--muted)",textAlign:"center"}}>🔒 Données détaillées par zone disponibles avec le plan Enterprise</div>}
    </>}

    {tab===2&&<>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>🏪 Benchmark concurrents</div>
      {isEnterprise?COMPETITORS.map(c=>(
        <div key={c.name} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>{c.name}</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {[["🛍️",c.products+" produits"],["⭐",c.rating],["💰",c.avgPrice+" moy."],["💪",c.strength]].map(([ic,v])=>
              <span key={ic} style={{fontSize:11,color:"var(--muted)"}}>{ic} {v}</span>
            )}
          </div>
        </div>
      )):<div style={{textAlign:"center",padding:30}}>
        <div style={{fontSize:36,marginBottom:8}}>🔒</div>
        <div style={{fontSize:14,fontWeight:700}}>Plan Enterprise requis</div>
        <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>L'analyse détaillée des concurrents est disponible avec le plan Enterprise</div>
      </div>}
    </>}
  </div>);
}
export default VAdvisorScr;
