import { useState } from "react";

function VApiScr({go,onBack}){
  const [showKey,setShowKey]=useState(false);
  const [copied,setCopied]=useState(false);
  const [whTab,setWhTab]=useState(null);
  const [whUrl,setWhUrl]=useState({orders:"https://mon-site.com/api/orders",payments:"https://mon-site.com/api/payments",stock:""});
  const [whSaved,setWhSaved]=useState(false);
  const apiKey="lmk_live_ent_7f3a9b2c1d4e5f6g8h9i0j";
  const [regen,setRegen]=useState(false);

  return(<div className="scr" style={{padding:20}}>
    <div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>API & Intégrations</h2><div style={{width:38}}/></div>

    <div style={{padding:16,background:"linear-gradient(135deg,#6366F1,#A855F7)",borderRadius:16,marginBottom:16,color:"#fff"}}>
      <div style={{fontSize:11,opacity:.7}}>Plan Enterprise</div>
      <div style={{fontSize:18,fontWeight:700,margin:"4px 0"}}>API Lamuka v2.0</div>
      <div style={{display:"flex",gap:12,marginTop:6}}>
        <span style={{padding:"3px 8px",borderRadius:6,background:"rgba(255,255,255,0.2)",fontSize:10}}>REST</span>
        <span style={{padding:"3px 8px",borderRadius:6,background:"rgba(255,255,255,0.2)",fontSize:10}}>JSON</span>
        <span style={{padding:"3px 8px",borderRadius:6,background:"rgba(255,255,255,0.2)",fontSize:10}}>10k req/jour</span>
        <span style={{padding:"3px 8px",borderRadius:6,background:"rgba(255,255,255,0.2)",fontSize:10}}>OAuth 2.0</span>
      </div>
    </div>

    {/* API Key */}
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Clé API</div>
    <div style={{padding:14,background:"#F5F4F1",borderRadius:14,marginBottom:6}}>
      <div style={{fontFamily:"monospace",fontSize:12,wordBreak:"break-all",color:showKey?"#191815":"#908C82",marginBottom:8}}>{showKey?apiKey:"lmk_live_ent_••••••••••••••••"}</div>
      <div style={{display:"flex",gap:8}}>
        <button style={{flex:1,padding:8,borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowKey(!showKey)}>{showKey?"🙈 Masquer":"👁️ Afficher"}</button>
        <button style={{flex:1,padding:8,borderRadius:8,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?"✅ Copié !":"📋 Copier"}</button>
      </div>
    </div>
    <button style={{width:"100%",padding:8,borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"#fff",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:16}} onClick={()=>{setRegen(true);setTimeout(()=>setRegen(false),2500)}}>{regen?"✅ Nouvelle clé générée":"🔄 Régénérer la clé"}</button>

    {/* Webhooks */}
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Webhooks</div>
    {[["orders","Nouvelle commande"],["payments","Paiement reçu"],["stock","Stock bas"]].map(([k,label])=><div key={k} style={{padding:12,background:whTab===k?"#fff":"#fff",border:whTab===k?"2px solid #6366F1":"1px solid #E8E6E1",borderRadius:12,marginBottom:8,cursor:"pointer"}} onClick={()=>setWhTab(whTab===k?null:k)}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{label}</div><div style={{fontSize:10,color:"#908C82",fontFamily:"monospace"}}>{whUrl[k]||"Non configuré"}</div></div>
        <span style={{fontSize:11,fontWeight:600,color:whUrl[k]?"#10B981":"#908C82"}}>{whUrl[k]?"✅ Actif":"⬜"}</span>
      </div>
      {whTab===k&&<div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #F5F4F1"}} onClick={e=>e.stopPropagation()}>
        <div className="field" style={{marginBottom:8}}><label style={{fontSize:11}}>URL du webhook</label><input value={whUrl[k]} onChange={e=>setWhUrl({...whUrl,[k]:e.target.value})} placeholder="https://votre-site.com/api/webhook" style={{fontFamily:"monospace",fontSize:11}}/></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:8,borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setWhSaved(true);setTimeout(()=>{setWhSaved(false);setWhTab(null)},1500)}}>{whSaved?"✅":"💾"} Sauver</button>
          <button style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(99,102,241,0.2)",background:"#fff",color:"#6366F1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🧪 Tester</button>
        </div>
      </div>}
    </div>)}

    {/* Documentation */}
    <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Documentation API</div>
    {[["guide","📘","Guide de démarrage","Auth, setup, premiers appels"],
      ["products","📦","Endpoints Produits","CRUD, stock, images, variantes"],
      ["orders","🛒","Endpoints Commandes","Liste, détails, statuts, assignation"],
      ["payments","💳","Endpoints Paiements","Transactions, retraits, commissions"],
      ["webhooks","🔔","Guide Webhooks","Config, events, sécurité, retry"],
      ["errors","⚠️","Codes d'erreur","Liste complète des codes & solutions"],
      ["sdks","🧩","SDKs & Exemples","Node.js, Python, cURL, Postman"]
    ].map(([k,i,t,d])=><div key={k} style={{display:"flex",alignItems:"center",gap:10,padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:12,marginBottom:8,cursor:"pointer"}} onClick={()=>go("vDoc",k)}>
      <span style={{fontSize:18}}>{i}</span>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t}</div><div style={{fontSize:10,color:"#908C82"}}>{d}</div></div>
      <span style={{color:"#908C82"}}>›</span>
    </div>)}

    <div className="info-box blue" style={{marginTop:10}}><span>📞</span><span style={{fontSize:11}}>Manager dédié : <b>support-enterprise@lamuka.cg</b> · +242 06X XXX XXX</span></div>
  </div>);
}

/* V18e ── API DOCUMENTATION VIEWER ── */

export default VApiScr;
