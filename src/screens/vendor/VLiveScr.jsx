import { useState } from "react";
import toast from "../../utils/toast";

function VLiveScr({onBack}){
  const [live,setLive]=useState(false);
  const [viewers,setViewers]=useState(0);
  const [products,setProducts]=useState([
    {id:1,name:"Robe Wax Moderne",price:25000,added:false},
    {id:2,name:"Sac Cuir Artisanal",price:35000,added:false},
    {id:3,name:"Boucles d'oreilles Or",price:8000,added:true},
  ]);
  const [comments]=useState([
    {user:"Marie K.",text:"C'est magnifique ! 😍",time:"2s"},
    {user:"Paul N.",text:"Combien le sac ?",time:"5s"},
    {user:"Grace O.",text:"Je prends la robe !",time:"8s"},
  ]);

  const startLive=()=>{setLive(true);let v=0;const iv=setInterval(()=>{v+=Math.floor(Math.random()*3)+1;setViewers(v);if(v>50)clearInterval(iv)},1000);toast.success("🔴 Vous êtes en live !")};

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={live?()=>{setLive(false);toast.info("Live terminé")}:onBack}>←</button><h2>📺 Live Shopping</h2><div style={{width:38}}/></div>

    {!live?<>
      {/* Setup */}
      <div style={{textAlign:"center",padding:"30px 0 20px"}}>
        <div style={{fontSize:48,marginBottom:12}}>📺</div>
        <h3 style={{fontSize:18,fontWeight:700}}>Démarrer un Live</h3>
        <p style={{fontSize:12,color:"var(--muted)",marginTop:4,maxWidth:260,margin:"4px auto 0"}}>Vendez en direct à vos clients. Montrez vos produits, répondez aux questions en temps réel.</p>
      </div>

      <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Produits à présenter</div>
      {products.map(p=>(
        <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,marginBottom:6}}>
          <div className={`toggle${p.added?" on":""}`} onClick={()=>setProducts(prev=>prev.map(x=>x.id===p.id?{...x,added:!x.added}:x))}><div/></div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:"#F97316"}}>{p.price.toLocaleString("fr-FR")} F</div></div>
        </div>
      ))}

      <button onClick={startLive} style={{width:"100%",padding:16,borderRadius:14,border:"none",background:"#EF4444",color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:16}}>🔴 Démarrer le Live</button>
    </>:<>
      {/* Live view */}
      <div style={{position:"relative",height:300,background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:20,overflow:"hidden",marginBottom:14}}>
        <div style={{position:"absolute",top:12,left:12,display:"flex",gap:6}}>
          <div style={{padding:"4px 10px",borderRadius:20,background:"#EF4444",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>🔴 LIVE</div>
          <div style={{padding:"4px 10px",borderRadius:20,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:10,fontWeight:600}}>👁️ {viewers}</div>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:12,background:"linear-gradient(transparent,rgba(0,0,0,.7))"}}>
          {comments.map((c,i)=>(
            <div key={i} style={{display:"flex",gap:6,marginBottom:4,animation:`fadeIn .3s ease ${i*.2}s both`}}>
              <span style={{fontSize:11,fontWeight:700,color:"#FB923C"}}>{c.user}</span>
              <span style={{fontSize:11,color:"rgba(255,255,255,.8)"}}>{c.text}</span>
            </div>
          ))}
        </div>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:56,opacity:.3}}>📷</span></div>
      </div>

      {/* Live products */}
      <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Produits en vedette</div>
      {products.filter(p=>p.added).map(p=>(
        <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,marginBottom:6}}>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.name}</div><div style={{fontSize:12,fontWeight:700,color:"#F97316"}}>{p.price.toLocaleString("fr-FR")} F</div></div>
          <button onClick={()=>toast.success("📌 "+p.name+" mis en avant !")} style={{padding:"6px 12px",borderRadius:8,border:"none",background:"#F97316",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📌 Pin</button>
        </div>
      ))}

      <button onClick={()=>{setLive(false);toast.success("Live terminé — "+viewers+" spectateurs !")}} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#EF4444",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:12}}>⏹️ Terminer le Live</button>
    </>}
  </div>);
}
export default VLiveScr;
