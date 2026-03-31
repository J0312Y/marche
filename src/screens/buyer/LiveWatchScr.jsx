import { useState, useEffect, useRef } from "react";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";
import toast from "../../utils/toast";

function LiveWatchScr({onBack,go,liveData}){
  const vendor=liveData?.vendor||{name:"Mode Afrique",avatar:"👔"};
  const products=liveData?.products||[];
  const [pinned,setPinned]=useState(products[0]||null);
  const [viewers,setViewers]=useState(47);
  const [hearts,setHearts]=useState(0);
  const [myHeart,setMyHeart]=useState(false);
  const [comments,setComments]=useState([
    {user:"Marie K.",text:"Bonjour ! 👋",avatar:"👩",time:"14:30"},
    {user:"Paul N.",text:"C'est magnifique 😍",avatar:"👨",time:"14:31"},
    {user:vendor.name,text:"Bienvenue à tous ! Aujourd'hui on vous présente notre nouvelle collection 🔥",avatar:"🏪",time:"14:31",isVendor:true},
  ]);
  const [myComment,setMyComment]=useState("");
  const [showProducts,setShowProducts]=useState(false);
  const scrollRef=useRef(null);

  // Simulate live activity
  useEffect(()=>{
    const mockNew=[
      {user:"Grace O.",text:"Trop beau le sac !",avatar:"👩‍🦱"},
      {user:vendor.name,text:"Merci Grace ! Il est en cuir véritable 💼",avatar:"🏪",isVendor:true},
      {user:"David T.",text:"Vous livrez à Poto-Poto ?",avatar:"👨‍🦲"},
      {user:vendor.name,text:"Oui, livraison dans tout Brazzaville 🚚",avatar:"🏪",isVendor:true},
      {user:"Bruno T.",text:"Je prends la robe en taille M !",avatar:"🧑"},
      {user:"🏷️ PROMO",text:"Code LIVE20 activé ! -20% pendant le live 🔥",avatar:"🏷️",isPromo:true},
      {user:"Celine N.",text:"Comment utiliser le code promo ?",avatar:"👩‍🦰"},
      {user:vendor.name,text:"Ajoutez LIVE20 dans le panier au checkout 😊",avatar:"🏪",isVendor:true},
    ];
    let i=0;
    const iv=setInterval(()=>{
      setViewers(v=>v+Math.floor(Math.random()*3));
      setHearts(h=>h+Math.floor(Math.random()*5));
      if(i<mockNew.length&&Math.random()>0.3){
        setComments(prev=>[...prev,{...mockNew[i],time:new Date().toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"})}]);
        i++;
      }
    },3000);
    return()=>clearInterval(iv);
  },[]);

  useEffect(()=>{scrollRef.current?.scrollTo(0,scrollRef.current.scrollHeight)},[comments]);

  const sendComment=()=>{
    if(!myComment.trim())return;
    setComments(p=>[...p,{user:"Vous",text:myComment,avatar:"👤",time:new Date().toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"}),isMe:true}]);
    setMyComment("");
  };

  const sendHeart=()=>{
    setMyHeart(true);
    setHearts(h=>h+1);
    setTimeout(()=>setMyHeart(false),400);
  };

  return(<div style={{display:"flex",flexDirection:"column",height:"100%",background:"#000"}}>
    {/* Video area */}
    <div style={{flex:1,position:"relative",background:"linear-gradient(135deg,#1a1a2e,#16213e)",minHeight:280}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:80,opacity:.1}}>📺</span></div>

      {/* Top bar */}
      <div style={{position:"absolute",top:12,left:12,right:12,display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={onBack} style={{width:32,height:32,borderRadius:16,background:"rgba(0,0,0,.4)",border:"none",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px 4px 4px",borderRadius:20,background:"rgba(0,0,0,.5)"}}>
            <div style={{width:28,height:28,borderRadius:14,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{vendor.avatar}</div>
            <span style={{color:"#fff",fontSize:11,fontWeight:600}}>{vendor.name}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <div style={{padding:"4px 10px",borderRadius:20,background:"#EF4444",color:"#fff",fontSize:10,fontWeight:700,animation:"pulse 1.5s infinite"}}>🔴 LIVE</div>
          <div style={{padding:"4px 10px",borderRadius:20,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:10}}>👁️ {viewers}</div>
        </div>
      </div>

      {/* Hearts floating */}
      <div style={{position:"absolute",right:16,bottom:80}}>
        {myHeart&&<span style={{fontSize:28,animation:"splash-up .5s ease both"}}>❤️</span>}
      </div>

      {/* Pinned product */}
      {pinned&&<div onClick={()=>go("detail",pinned)} style={{position:"absolute",bottom:12,right:12,width:110,background:"rgba(0,0,0,.75)",borderRadius:14,overflow:"hidden",border:"2px solid #F97316",cursor:"pointer",zIndex:10}}>
        <div style={{height:65,overflow:"hidden"}}><Img src={pinned.photo} emoji={pinned.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
        <div style={{padding:"4px 8px 6px"}}>
          <div style={{fontSize:9,fontWeight:600,color:"#fff",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{pinned.name}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:11,fontWeight:800,color:"#F97316"}}>{fmt(pinned.price)}</span>
            <span style={{fontSize:8,padding:"1px 5px",borderRadius:4,background:"#F97316",color:"#fff",fontWeight:700}}>Acheter</span>
          </div>
        </div>
      </div>}

      {/* Comments overlay */}
      <div ref={scrollRef} style={{position:"absolute",bottom:0,left:0,right:130,padding:12,background:"linear-gradient(transparent,rgba(0,0,0,.6))",maxHeight:180,overflowY:"auto"}}>
        {comments.slice(-8).map((c,i)=>(
          <div key={i} style={{display:"flex",gap:6,marginBottom:4}}>
            <span style={{fontSize:12}}>{c.avatar}</span>
            <div>
              <span style={{fontSize:10,fontWeight:700,color:c.isVendor?"#FB923C":c.isPromo?"#EF4444":c.isMe?"#60A5FA":"rgba(255,255,255,.7)"}}>{c.user} </span>
              <span style={{fontSize:10,color:c.isPromo?"#FBBF24":"rgba(255,255,255,.8)"}}>{c.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom controls */}
    <div style={{background:"var(--card)",padding:10,borderTop:"1px solid var(--border)"}}>
      {/* Products strip */}
      <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",marginBottom:8}}>
        {products.map(p=>(
          <div key={p.id} onClick={()=>go("detail",p)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",background:"var(--light)",borderRadius:10,flexShrink:0,cursor:"pointer",border:pinned?.id===p.id?"1px solid #F97316":"1px solid var(--border)"}}>
            <div style={{width:24,height:24,borderRadius:6,overflow:"hidden"}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
            <div style={{fontSize:10,fontWeight:600,maxWidth:60,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div>
            <span style={{fontSize:10,fontWeight:700,color:"#F97316"}}>{fmt(p.price)}</span>
          </div>
        ))}
        <button onClick={()=>setShowProducts(!showProducts)} style={{padding:"6px 12px",borderRadius:10,border:"1px solid #F97316",background:"transparent",color:"#F97316",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>🛒 Tous ({products.length})</button>
      </div>

      {/* Comment input + actions */}
      <div style={{display:"flex",gap:6}}>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:6,padding:"0 10px",border:"1px solid var(--border)",borderRadius:10,background:"var(--light)"}}>
          <input value={myComment} onChange={e=>setMyComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendComment()} placeholder="Commenter..." style={{flex:1,border:"none",background:"transparent",fontSize:12,outline:"none",fontFamily:"inherit",color:"var(--text)",padding:"8px 0"}}/>
          <button onClick={sendComment} style={{background:"none",border:"none",fontSize:14,cursor:"pointer"}}>📤</button>
        </div>
        <button onClick={sendHeart} style={{width:40,height:40,borderRadius:20,border:"none",background:myHeart?"#EF4444":"var(--light)",color:myHeart?"#fff":"#EF4444",fontSize:18,cursor:"pointer",transition:"all .15s"}}>❤️</button>
        <button onClick={()=>{if(pinned)toast.success(pinned.name+" ajouté au panier 🛒")}} style={{width:40,height:40,borderRadius:20,border:"none",background:"#F97316",color:"#fff",fontSize:16,cursor:"pointer"}}>🛒</button>
      </div>
    </div>

    {/* Products modal */}
    {showProducts&&<div onClick={()=>setShowProducts(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:9999,display:"flex",alignItems:"flex-end",animation:"fadeInFast .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:500,margin:"0 auto",background:"var(--card)",borderRadius:"20px 20px 0 0",padding:16,maxHeight:"60vh",overflowY:"auto",animation:"slideUp .3s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{fontSize:15,fontWeight:700,marginBottom:12}}>🛒 Produits du live ({products.length})</div>
        {products.map(p=>(
          <div key={p.id} onClick={()=>{go("detail",p);setShowProducts(false)}} style={{display:"flex",alignItems:"center",gap:10,padding:10,background:"var(--light)",borderRadius:12,marginBottom:6,cursor:"pointer"}}>
            <div style={{width:48,height:48,borderRadius:10,overflow:"hidden",flexShrink:0}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>{p.name}</div>
              <div style={{fontSize:12,fontWeight:700,color:"#F97316"}}>{fmt(p.price)}{p.old&&<span style={{fontSize:10,color:"var(--muted)",textDecoration:"line-through",marginLeft:4}}>{fmt(p.old)}</span>}</div>
            </div>
            <button onClick={e=>{e.stopPropagation();toast.success(p.name+" ajouté au panier 🛒")}} style={{padding:"6px 12px",borderRadius:8,border:"none",background:"#F97316",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🛒 Acheter</button>
          </div>
        ))}
      </div>
    </div>}
  </div>);
}
export default LiveWatchScr;
