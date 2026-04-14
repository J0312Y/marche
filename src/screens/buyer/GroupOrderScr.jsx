import { useState, useEffect } from "react";
import toast from "../../utils/toast";
import { useData } from "../../hooks";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";
import { share } from "../../utils/share";

const MOCK_FRIENDS=[
  {id:"f1",name:"Marie K.",avatar:"👩",status:"joined",items:[]},
  {id:"f2",name:"Patrick M.",avatar:"👨",status:"pending",items:[]},
  {id:"f3",name:"Grace O.",avatar:"👩‍🦱",status:"pending",items:[]},
];

function GroupOrderScr({onBack,go}){
  const { P } = useData();
  const [step,setStep]=useState("create"); // create | waiting | active | review
  const [friends,setFriends]=useState(MOCK_FRIENDS);
  const [myItems,setMyItems]=useState([]);
  const [showAdd,setShowAdd]=useState(false);
  const [splitMode,setSplitMode]=useState("one"); // one | split
  const [timer,setTimer]=useState(15);
  const code="GRP-"+Math.floor(Math.random()*9000+1000);
  const link="https://lamuka.market/group/"+code;

  // Simulate friends joining + adding items
  useEffect(()=>{
    if(step!=="waiting")return;
    const t1=setTimeout(()=>{
      setFriends(p=>p.map(f=>f.id==="f1"?{...f,status:"joined",items:[{...P[2],qty:1},{...P[5],qty:1}]}:f));
      toast.success("👩 Marie a rejoint le groupe !");
    },3000);
    const t2=setTimeout(()=>{
      setFriends(p=>p.map(f=>f.id==="f2"?{...f,status:"joined",items:[{...P[4],qty:2}]}:f));
      toast.success("👨 Patrick a rejoint le groupe !");
      setStep("active");
    },6000);
    return()=>{clearTimeout(t1);clearTimeout(t2)};
  },[step]);

  // Countdown in active mode
  useEffect(()=>{
    if(step!=="active")return;
    const iv=setInterval(()=>{
      setTimer(t=>{if(t<=1){clearInterval(iv);setStep("review");return 0}return t-1});
    },1000);
    return()=>clearInterval(iv);
  },[step]);

  const addMyItem=(p)=>{
    setMyItems(prev=>{
      const ex=prev.find(x=>x.id===p.id);
      if(ex)return prev.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x);
      return[...prev,{...p,qty:1}];
    });
    setShowAdd(false);
    toast.success(p.name+" ajouté 🛍️");
  };

  const allItems=[
    {person:"Vous",avatar:"👤",items:myItems},
    ...friends.filter(f=>f.status==="joined"&&f.items.length>0).map(f=>({person:f.name,avatar:f.avatar,items:f.items}))
  ].filter(g=>g.items.length>0);

  const grandTotal=allItems.reduce((s,g)=>s+g.items.reduce((ss,it)=>s+(it.price||0)*(it.qty||1),0),0);
  const joinedCount=friends.filter(f=>f.status==="joined").length+1;

  // ── CREATE ──
  if(step==="create")return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:14}}><button onClick={onBack}>←</button><h2>🤝 Commande de groupe</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(249,115,22,0.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:36}}>🤝</div>
      <h3 style={{fontSize:20,fontWeight:700}}>Commander ensemble</h3>
      <p style={{fontSize:13,color:"var(--muted)",marginTop:6,lineHeight:1.6,maxWidth:280,margin:"6px auto 0"}}>Invitez vos amis à ajouter leurs plats dans le même panier. Un seul paiement, une seule livraison !</p>
    </div>

    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Comment ça marche</div>
      {[["1️⃣","Créez le groupe","Partagez le lien avec vos amis"],["2️⃣","Chacun ajoute ses plats","15 min pour choisir"],["3️⃣","Validez et payez","Une seule commande, une seule livraison"]].map(([n,t,d],i)=>(
        <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<2?"1px solid var(--border)":"none"}}>
          <span style={{fontSize:20}}>{n}</span>
          <div><div style={{fontSize:13,fontWeight:600}}>{t}</div><div style={{fontSize:11,color:"var(--muted)"}}>{d}</div></div>
        </div>
      ))}
    </div>

    <div style={{padding:14,background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.12)",borderRadius:14,marginBottom:14}}>
      <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>💡 Astuce</div>
      <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>Idéal pour les repas entre collègues, les fêtes, ou les commandes familiales. Économisez sur les frais de livraison !</div>
    </div>

    <button className="btn-primary" onClick={()=>{setStep("waiting");share({title:"Commande de groupe Lamuka",text:"Rejoins ma commande de groupe ! Ajoute tes plats 🤝",url:link})}}>🚀 Créer un groupe</button>
  </div>);

  // ── WAITING ──
  if(step==="waiting")return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:14}}><button onClick={()=>{setStep("create");setFriends(MOCK_FRIENDS)}}>←</button><h2>🤝 En attente...</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{fontSize:48,marginBottom:10,animation:"pulse 1.5s infinite"}}>⏳</div>
      <h3 style={{fontSize:18,fontWeight:700}}>En attente des participants</h3>
      <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Partagez le lien pour inviter vos amis</p>
    </div>

    <div style={{padding:12,background:"var(--light)",borderRadius:12,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
      <span style={{flex:1,fontSize:11,color:"var(--muted)",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{link}</span>
      <button onClick={()=>{navigator.clipboard?.writeText(link);toast.success("Lien copié 📋")}} style={{padding:"6px 12px",borderRadius:8,border:"none",background:"#F97316",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Copier</button>
    </div>

    <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>Participants</div>
    <div style={{padding:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:20}}>👤</span><span style={{flex:1,fontSize:13,fontWeight:600}}>Vous (organisateur)</span>
      <span style={{padding:"3px 8px",borderRadius:6,background:"rgba(16,185,129,0.08)",color:"#10B981",fontSize:10,fontWeight:700}}>✅ Prêt</span>
    </div>
    {friends.map(f=>(
      <div key={f.id} style={{padding:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:20}}>{f.avatar}</span><span style={{flex:1,fontSize:13,fontWeight:f.status==="joined"?600:400,color:f.status==="joined"?"var(--text)":"var(--muted)"}}>{f.name}</span>
        {f.status==="joined"?<span style={{padding:"3px 8px",borderRadius:6,background:"rgba(16,185,129,0.08)",color:"#10B981",fontSize:10,fontWeight:700}}>✅ Rejoint</span>
        :<span style={{padding:"3px 8px",borderRadius:6,background:"var(--light)",color:"var(--muted)",fontSize:10,fontWeight:600}}>⏳ En attente</span>}
      </div>
    ))}

    <button onClick={()=>share({title:"Commande de groupe",text:"Rejoins ma commande ! 🤝",url:link})} style={{width:"100%",marginTop:10,padding:14,borderRadius:14,border:"1px solid #F97316",background:"transparent",color:"#F97316",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📤 Partager le lien</button>
  </div>);

  // ── ACTIVE ──
  if(step==="active")return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>🤝 Groupe actif</h2><div style={{width:38}}/></div>

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:10,background:timer<=5?"rgba(239,68,68,0.06)":"rgba(249,115,22,0.04)",borderRadius:12,marginBottom:12,border:`1px solid ${timer<=5?"rgba(239,68,68,0.15)":"rgba(249,115,22,0.12)"}`}}>
      <span style={{fontSize:12,fontWeight:600}}>{joinedCount} participant{joinedCount>1?"s":""}</span>
      <span style={{fontSize:13,fontWeight:700,color:timer<=5?"#EF4444":"#F97316"}}>⏱️ {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</span>
    </div>

    {/* My items */}
    <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>👤 Vos articles</div>
    {myItems.length===0?<div style={{padding:16,background:"var(--light)",borderRadius:12,textAlign:"center",marginBottom:10}}>
      <div style={{fontSize:13,color:"var(--muted)"}}>Vous n'avez pas encore ajouté d'articles</div>
    </div>
    :myItems.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:8,background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,marginBottom:4}}>
      <div style={{width:32,height:32,borderRadius:8,overflow:"hidden",flexShrink:0}}><Img src={it.photo} emoji={it.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
      <span style={{flex:1,fontSize:12,fontWeight:500}}>{it.name} ×{it.qty}</span>
      <span style={{fontSize:12,fontWeight:700,color:"#F97316"}}>{fmt(it.price*(it.qty||1))}</span>
    </div>)}

    <button onClick={()=>setShowAdd(true)} style={{width:"100%",padding:12,borderRadius:12,border:"2px dashed var(--border)",background:"transparent",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#F97316",marginBottom:14}}>+ Ajouter un article</button>

    {/* Friends items */}
    {friends.filter(f=>f.status==="joined"&&f.items.length>0).map(f=>(
      <div key={f.id} style={{marginBottom:10}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>{f.avatar} {f.name}</div>
        {f.items.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:8,background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,marginBottom:4}}>
          <div style={{width:32,height:32,borderRadius:8,overflow:"hidden",flexShrink:0}}><Img src={it.photo} emoji={it.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
          <span style={{flex:1,fontSize:12,fontWeight:500}}>{it.name} ×{it.qty||1}</span>
          <span style={{fontSize:12,fontWeight:700,color:"#F97316"}}>{fmt((it.price||0)*(it.qty||1))}</span>
        </div>)}
      </div>
    ))}

    <button onClick={()=>setStep("review")} className="btn-primary" style={{marginTop:8}}>✅ Finaliser la commande</button>

    {/* Add item modal */}
    {showAdd&&<div onClick={()=>setShowAdd(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:9999,display:"flex",alignItems:"flex-end",animation:"fadeInFast .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:500,margin:"0 auto",background:"var(--card)",borderRadius:"20px 20px 0 0",padding:16,maxHeight:"70vh",overflowY:"auto",animation:"slideUp .3s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{fontSize:15,fontWeight:700,marginBottom:12}}>Ajouter un article</div>
        {P.filter(p=>p.type==="restaurant"||p.type==="patisserie").map(p=>(
          <div key={p.id} onClick={()=>addMyItem(p)} style={{display:"flex",alignItems:"center",gap:10,padding:10,background:"var(--light)",borderRadius:12,marginBottom:6,cursor:"pointer"}}>
            <div style={{width:44,height:44,borderRadius:10,overflow:"hidden",flexShrink:0}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{p.vendor}</div></div>
            <span style={{fontSize:13,fontWeight:700,color:"#F97316"}}>{fmt(p.price)}</span>
          </div>
        ))}
      </div>
    </div>}
  </div>);

  // ── REVIEW ──
  return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:14}}><button onClick={onBack}>←</button><h2>🤝 Récapitulatif</h2><div style={{width:38}}/></div>

    <div style={{textAlign:"center",marginBottom:14}}>
      <div style={{fontSize:36,marginBottom:6}}>🧾</div>
      <h3 style={{fontSize:18,fontWeight:700}}>Commande de groupe</h3>
      <p style={{fontSize:12,color:"var(--muted)"}}>{joinedCount} participants · {code}</p>
    </div>

    {/* All items by person */}
    {allItems.map((g,gi)=>(
      <div key={gi} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>{g.avatar} {g.person}</div>
        {g.items.map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:12}}>
          <span>{it.name} ×{it.qty||1}</span>
          <b style={{color:"#F97316"}}>{fmt((it.price||0)*(it.qty||1))}</b>
        </div>)}
        <div style={{borderTop:"1px solid var(--border)",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700}}>
          <span>Sous-total {g.person}</span>
          <span>{fmt(g.items.reduce((s,it)=>s+(it.price||0)*(it.qty||1),0))}</span>
        </div>
      </div>
    ))}

    {/* Payment mode */}
    <div style={{fontSize:14,fontWeight:700,margin:"10px 0 8px"}}>💳 Mode de paiement</div>
    {[["one","👤 Une seule personne paie tout","L'organisateur règle la totalité"],["split","👥 Chacun paie sa part","Paiement séparé par participant"]].map(([k,t,d])=>(
      <div key={k} onClick={()=>setSplitMode(k)} style={{display:"flex",alignItems:"center",gap:10,padding:12,borderRadius:14,border:splitMode===k?"2px solid #F97316":"1px solid var(--border)",background:splitMode===k?"rgba(249,115,22,0.04)":"var(--card)",marginBottom:6,cursor:"pointer"}}>
        <div style={{width:20,height:20,borderRadius:10,border:splitMode===k?"none":"2px solid var(--border)",background:splitMode===k?"#F97316":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{splitMode===k&&<span style={{color:"#fff",fontSize:10}}>✓</span>}</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:splitMode===k?700:500}}>{t}</div><div style={{fontSize:11,color:"var(--muted)"}}>{d}</div></div>
      </div>
    ))}

    {/* Total */}
    <div style={{padding:14,background:"rgba(249,115,22,0.04)",borderRadius:14,border:"1px solid rgba(249,115,22,0.12)",marginTop:10,marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"var(--muted)"}}>Sous-total</span><span>{fmt(grandTotal)}</span></div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"var(--muted)"}}>Livraison</span><span>1 500 F</span></div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,paddingTop:8,borderTop:"1px solid var(--border)",color:"#F97316"}}><span>Total</span><span>{fmt(grandTotal+1500)}</span></div>
      {splitMode==="split"&&joinedCount>1&&<div style={{fontSize:11,color:"var(--muted)",marginTop:6,textAlign:"center"}}>≈ {fmt(Math.round((grandTotal+1500)/joinedCount))} / personne</div>}
    </div>

    <button className="btn-primary" onClick={()=>{toast.success("Commande de groupe confirmée ! 🎉");setTimeout(onBack,1500)}}>🛍️ Confirmer la commande</button>
  </div>);
}

export default GroupOrderScr;
