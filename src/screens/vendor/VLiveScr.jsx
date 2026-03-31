import { useState, useEffect, useRef } from "react";
import toast from "../../utils/toast";
import { useData } from "../../hooks";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";

function VLiveScr({onBack}){
  const { P } = useData();
  const [step,setStep]=useState("setup"); // setup | preview | live | ended
  const [title,setTitle]=useState("");
  const [desc,setDesc]=useState("");
  const [selectedProducts,setSelectedProducts]=useState([]);
  const [pinnedProduct,setPinnedProduct]=useState(null);
  const [viewers,setViewers]=useState(0);
  const [hearts,setHearts]=useState(0);
  const [duration,setDuration]=useState(0);
  const [comments,setComments]=useState([]);
  const [newComment,setNewComment]=useState("");
  const [promoCode,setPromoCode]=useState("");
  const [showPromo,setShowPromo]=useState(false);
  const [soldItems,setSoldItems]=useState([]);
  const timerRef=useRef(null);

  const vendorProducts=P.slice(0,8).map(p=>({...p,selected:selectedProducts.includes(p.id)}));
  const toggleProduct=(id)=>setSelectedProducts(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const mockComments=[
    {user:"Marie K.",text:"Bonjour ! 👋",avatar:"👩"},
    {user:"Paul N.",text:"C'est combien le sac ?",avatar:"👨"},
    {user:"Grace O.",text:"😍😍😍",avatar:"👩‍🦱"},
    {user:"David T.",text:"Je prends la robe en M !",avatar:"👨‍🦲"},
    {user:"Celine N.",text:"Vous livrez à Pointe-Noire ?",avatar:"👩‍🦰"},
    {user:"Bruno T.",text:"Trop beau ! J'achète direct",avatar:"🧑"},
    {user:"Anne M.",text:"Le prix est négociable ?",avatar:"👩‍🦳"},
    {user:"Patrick M.",text:"🔥🔥🔥",avatar:"👨‍🦱"},
  ];

  const startLive=()=>{
    if(selectedProducts.length===0){toast.error("Sélectionnez au moins 1 produit");return}
    if(!title.trim()){toast.error("Ajoutez un titre pour votre live");return}
    setStep("live");
    let v=0;let h=0;let ci=0;
    timerRef.current=setInterval(()=>{
      setDuration(d=>d+1);
      v+=Math.floor(Math.random()*5)+1;
      h+=Math.floor(Math.random()*3);
      setViewers(v);
      setHearts(h);
      if(ci<mockComments.length&&Math.random()>0.4){
        setComments(prev=>[...prev,{...mockComments[ci],time:new Date().toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"})}]);
        ci++;
      }
      if(Math.random()>0.85&&selectedProducts.length>0){
        const soldId=selectedProducts[Math.floor(Math.random()*selectedProducts.length)];
        const soldP=P.find(x=>x.id===soldId);
        if(soldP&&!soldItems.includes(soldId)){
          setSoldItems(prev=>[...prev,soldId]);
          toast.success("🎉 "+soldP.name+" vendu !");
        }
      }
    },2000);
    toast.success("🔴 Vous êtes en live !");
  };

  const endLive=()=>{
    clearInterval(timerRef.current);
    setStep("ended");
  };

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  const fmtTime=(s)=>{const m=Math.floor(s/60);const ss=s%60;return String(m).padStart(2,"0")+":"+String(ss).padStart(2,"0")};

  // ── SETUP ──
  if(step==="setup")return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>📺 Préparer le Live</h2><div style={{width:38}}/></div>

    <div style={{textAlign:"center",padding:"16px 0"}}>
      <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(239,68,68,0.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:32}}>📺</div>
      <h3 style={{fontSize:18,fontWeight:700}}>Vendez en direct</h3>
      <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Montrez vos produits, répondez aux questions, vendez en temps réel</p>
    </div>

    {/* Title */}
    <div className="field" style={{marginBottom:10}}><label>Titre du live <span style={{color:"#EF4444"}}>*</span></label>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex: Nouvelle collection Wax 🔥"/>
    </div>

    {/* Description */}
    <div className="field" style={{marginBottom:14}}><label>Description (optionnel)</label>
      <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Décrivez ce que vous allez présenter..." rows={2} style={{resize:"none"}}/>
    </div>

    {/* Product selection */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <div style={{fontSize:14,fontWeight:700}}>📦 Produits à présenter</div>
      <span style={{fontSize:12,color:"#F97316",fontWeight:600}}>{selectedProducts.length} sélectionnés</span>
    </div>

    <div style={{maxHeight:280,overflowY:"auto",marginBottom:14}}>
      {vendorProducts.map(p=>(
        <div key={p.id} onClick={()=>toggleProduct(p.id)} style={{display:"flex",alignItems:"center",gap:10,padding:10,background:"var(--card)",border:selectedProducts.includes(p.id)?"2px solid #F97316":"1px solid var(--border)",borderRadius:12,marginBottom:6,cursor:"pointer"}}>
          <div style={{width:20,height:20,borderRadius:6,border:selectedProducts.includes(p.id)?"none":"2px solid var(--border)",background:selectedProducts.includes(p.id)?"#F97316":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700,flexShrink:0}}>{selectedProducts.includes(p.id)&&"✓"}</div>
          <div style={{width:40,height:40,borderRadius:10,overflow:"hidden",flexShrink:0,background:"var(--light)"}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div>
            <div style={{fontSize:12,fontWeight:700,color:"#F97316"}}>{fmt(p.price)}{p.old&&<span style={{fontSize:10,color:"var(--muted)",textDecoration:"line-through",marginLeft:4}}>{fmt(p.old)}</span>}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Tips */}
    <div style={{padding:12,background:"rgba(59,130,246,0.04)",border:"1px solid rgba(59,130,246,0.1)",borderRadius:12,marginBottom:16}}>
      <div style={{fontSize:12,fontWeight:700,color:"#3B82F6",marginBottom:6}}>💡 Conseils pour un bon live</div>
      <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.6}}>
        • Bonne luminosité — placez-vous face à la lumière{"\n"}
        • Présentez les produits un par un{"\n"}
        • Répondez aux commentaires en direct{"\n"}
        • Lancez des promos flash pour créer l'urgence
      </div>
    </div>

    <button onClick={startLive} disabled={selectedProducts.length===0} style={{width:"100%",padding:16,borderRadius:14,border:"none",background:selectedProducts.length>0?"#EF4444":"var(--border)",color:selectedProducts.length>0?"#fff":"var(--muted)",fontSize:16,fontWeight:700,cursor:selectedProducts.length>0?"pointer":"not-allowed",fontFamily:"inherit"}}>🔴 Démarrer le Live</button>
  </div>);

  // ── ENDED ──
  if(step==="ended")return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><div style={{width:38}}/><h2>📊 Récapitulatif Live</h2><div style={{width:38}}/></div>

    <div style={{textAlign:"center",marginBottom:14}}>
      <div style={{fontSize:40,marginBottom:6}}>🎉</div>
      <h3 style={{fontSize:20,fontWeight:700}}>Live terminé !</h3>
      <p style={{fontSize:12,color:"var(--muted)"}}>{title}</p>
    </div>

    {/* Stats */}
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      {[[viewers,"👁️","Spectateurs","#F97316"],[hearts,"❤️","J'aime","#EF4444"],[fmtTime(duration),"⏱️","Durée","var(--text)"],[soldItems.length,"🛒","Vendus","#10B981"]].map(([val,ic,lab,col])=>(
        <div key={lab} style={{flex:1,padding:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,textAlign:"center"}}>
          <div style={{fontSize:10}}>{ic}</div>
          <div style={{fontSize:16,fontWeight:800,color:col,marginTop:2}}>{val}</div>
          <div style={{fontSize:9,color:"var(--muted)"}}>{lab}</div>
        </div>
      ))}
    </div>

    {/* Sold products */}
    {soldItems.length>0&&<div style={{padding:14,background:"rgba(16,185,129,0.04)",border:"1px solid rgba(16,185,129,0.15)",borderRadius:14,marginBottom:14}}>
      <div style={{fontSize:13,fontWeight:700,color:"#10B981",marginBottom:8}}>🛒 Produits vendus</div>
      {soldItems.map(id=>{const p=P.find(x=>x.id===id);return p?<div key={id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid var(--border)"}}>
        <div style={{width:32,height:32,borderRadius:8,overflow:"hidden",flexShrink:0}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
        <span style={{flex:1,fontSize:12,fontWeight:500}}>{p.name}</span>
        <b style={{fontSize:12,color:"#F97316"}}>{fmt(p.price)}</b>
      </div>:null})}
      <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,fontSize:14,fontWeight:800}}>
        <span>Total</span><span style={{color:"#10B981"}}>{fmt(soldItems.reduce((s,id)=>{const p=P.find(x=>x.id===id);return s+(p?.price||0)},0))}</span>
      </div>
    </div>}

    {/* Comments timeline */}
    <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:13,fontWeight:700}}>💬 Déroulé du live ({comments.length})</span>
      </div>
      <div style={{maxHeight:240,overflowY:"auto"}}>
        {comments.map((c,i)=>(
          <div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:i<comments.length-1?"1px solid var(--border)":"none"}}>
            <div style={{width:28,height:28,borderRadius:8,background:c.user.includes("PROMO")?"rgba(239,68,68,0.08)":c.user==="Vous (vendeur)"?"rgba(249,115,22,0.08)":"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{c.avatar}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:11,fontWeight:700,color:c.user.includes("PROMO")?"#EF4444":c.user==="Vous (vendeur)"?"#F97316":"var(--text)"}}>{c.user}</span>
                {c.time&&<span style={{fontSize:9,color:"var(--muted)"}}>{c.time}</span>}
              </div>
              <div style={{fontSize:11,color:"var(--sub)",marginTop:1}}>{c.text}</div>
            </div>
          </div>
        ))}
      </div>
      {comments.length===0&&<div style={{textAlign:"center",padding:"16px 0",color:"var(--muted)",fontSize:12}}>Aucun commentaire</div>}
    </div>

    {/* Products presented */}
    <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:14}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>📦 Produits présentés ({selectedProducts.length})</div>
      {selectedProducts.map(id=>{const p=P.find(x=>x.id===id);const sold=soldItems.includes(id);return p?<div key={id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
        <div style={{width:32,height:32,borderRadius:8,overflow:"hidden",flexShrink:0}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
        <span style={{flex:1,fontSize:12}}>{p.name}</span>
        <span style={{fontSize:11,fontWeight:700,color:"#F97316"}}>{fmt(p.price)}</span>
        {sold?<span style={{padding:"2px 6px",borderRadius:4,background:"rgba(16,185,129,0.08)",color:"#10B981",fontSize:9,fontWeight:700}}>✅ Vendu</span>
        :<span style={{padding:"2px 6px",borderRadius:4,background:"var(--light)",color:"var(--muted)",fontSize:9,fontWeight:600}}>Présenté</span>}
      </div>:null})}
    </div>

    <button className="btn-primary" onClick={onBack}>🏠 Retour à la boutique</button>
  </div>);

  // ── LIVE ──
  return(<div style={{display:"flex",flexDirection:"column",height:"100%",background:"#000"}}>
    {/* Camera preview */}
    <div style={{flex:1,position:"relative",background:"linear-gradient(135deg,#1a1a2e,#16213e)",minHeight:300}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:80,opacity:.15}}>📷</span></div>

      {/* Top bar */}
      <div style={{position:"absolute",top:12,left:12,right:12,display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10}}>
        <div style={{display:"flex",gap:6}}>
          <div style={{padding:"4px 10px",borderRadius:20,background:"#EF4444",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:4,animation:"pulse 1.5s infinite"}}>🔴 LIVE</div>
          <div style={{padding:"4px 10px",borderRadius:20,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:10,fontWeight:600}}>👁️ {viewers}</div>
          <div style={{padding:"4px 10px",borderRadius:20,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:10,fontWeight:600}}>⏱️ {fmtTime(duration)}</div>
        </div>
        <button onClick={endLive} style={{padding:"6px 14px",borderRadius:20,border:"none",background:"rgba(239,68,68,.8)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Terminer</button>
      </div>

      {/* Hearts animation */}
      <div style={{position:"absolute",right:16,bottom:80,display:"flex",flexDirection:"column",gap:4}}>
        {Array.from({length:Math.min(hearts%5+1,5)}).map((_,i)=><span key={i} style={{fontSize:20,opacity:.3+Math.random()*.7,animation:`splash-up ${.5+Math.random()}s ease ${i*.1}s both`}}>❤️</span>)}
      </div>

      {/* Comments overlay */}
      <div style={{position:"absolute",bottom:0,left:0,right:60,padding:12,background:"linear-gradient(transparent,rgba(0,0,0,.6))",maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
        {comments.slice(-6).map((c,i)=>(
          <div key={i} style={{display:"flex",gap:6,marginBottom:4}}>
            <span style={{fontSize:14}}>{c.avatar}</span>
            <div><span style={{fontSize:11,fontWeight:700,color:"#FB923C"}}>{c.user}</span> <span style={{fontSize:11,color:"rgba(255,255,255,.85)"}}>{c.text}</span></div>
          </div>
        ))}
      </div>

      {/* Pinned product */}
      {pinnedProduct&&(()=>{const p=P.find(x=>x.id===pinnedProduct);return p?<div style={{position:"absolute",bottom:12,right:12,width:100,background:"rgba(0,0,0,.7)",borderRadius:14,overflow:"hidden",border:"2px solid #F97316",zIndex:10}}>
        <div style={{height:60,overflow:"hidden"}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
        <div style={{padding:"4px 6px"}}><div style={{fontSize:9,fontWeight:600,color:"#fff",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div><div style={{fontSize:10,fontWeight:800,color:"#F97316"}}>{fmt(p.price)}</div></div>
      </div>:null})()}
    </div>

    {/* Bottom controls */}
    <div style={{background:"var(--card)",padding:10,borderTop:"1px solid var(--border)"}}>
      {/* Products strip */}
      <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",marginBottom:8,paddingBottom:4}}>
        {selectedProducts.map(id=>{const p=P.find(x=>x.id===id);return p?<div key={id} onClick={()=>setPinnedProduct(pinnedProduct===id?null:id)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",background:pinnedProduct===id?"rgba(249,115,22,0.08)":"var(--light)",border:pinnedProduct===id?"1px solid #F97316":"1px solid var(--border)",borderRadius:10,flexShrink:0,cursor:"pointer"}}>
          <div style={{width:24,height:24,borderRadius:6,overflow:"hidden"}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
          <div style={{fontSize:10,fontWeight:600,maxWidth:60,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div>
          <span style={{fontSize:10,fontWeight:700,color:"#F97316"}}>{fmt(p.price)}</span>
          {pinnedProduct===id&&<span style={{fontSize:10}}>📌</span>}
          {soldItems.includes(id)&&<span style={{fontSize:10}}>✅</span>}
        </div>:null})}
      </div>

      {/* Action buttons */}
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>setShowPromo(!showPromo)} style={{padding:"8px 12px",borderRadius:10,border:"1px solid var(--border)",background:showPromo?"rgba(249,115,22,0.06)":"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>🏷️ Promo</button>
        <button onClick={()=>{setHearts(h=>h+10);toast.success("❤️ +10 cœurs")}} style={{padding:"8px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>❤️</button>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:6,padding:"0 10px",border:"1px solid var(--border)",borderRadius:10,background:"var(--light)"}}>
          <input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Répondre..." style={{flex:1,border:"none",background:"transparent",fontSize:12,outline:"none",fontFamily:"inherit",color:"var(--text)"}}/>
          <button onClick={()=>{if(newComment.trim()){setComments(p=>[...p,{user:"Vous (vendeur)",text:newComment,avatar:"🏪",time:""}]);setNewComment("");toast.success("Message envoyé")}}} style={{background:"none",border:"none",fontSize:16,cursor:"pointer"}}>📤</button>
        </div>
      </div>

      {/* Promo flash */}
      {showPromo&&<div style={{marginTop:8,padding:10,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:10}}>
        <div style={{fontSize:12,fontWeight:700,color:"#EF4444",marginBottom:6}}>🏷️ Lancer une promo flash</div>
        <div style={{display:"flex",gap:6}}>
          <input value={promoCode} onChange={e=>setPromoCode(e.target.value.toUpperCase())} placeholder="Code: LIVE20" style={{flex:1,padding:8,borderRadius:8,border:"1px solid var(--border)",background:"var(--light)",fontSize:12,fontFamily:"inherit",color:"var(--text)"}}/>
          <button onClick={()=>{if(promoCode){toast.success("🏷️ Code "+promoCode+" lancé en live !");setComments(p=>[...p,{user:"🏷️ PROMO",text:"Code "+promoCode+" activé ! Utilisez-le maintenant 🔥",avatar:"🏷️",time:""}]);setShowPromo(false);setPromoCode("")}}} style={{padding:"8px 14px",borderRadius:8,border:"none",background:"#EF4444",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Lancer</button>
        </div>
      </div>}
    </div>
  </div>);
}
export default VLiveScr;
