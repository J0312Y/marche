import { useState } from "react";
import toast from "../../utils/toast";

const PRODUCTS=[
  {id:1,name:"Galaxy A54",slug:"galaxy-a54",title:"Samsung Galaxy A54 5G 128GB | Tech Congo",desc:"Achetez le Samsung Galaxy A54 5G à Brazzaville. Livraison rapide.",score:85},
  {id:2,name:"Robe Wax Moderne",slug:"robe-wax-moderne",title:"",desc:"",score:30},
  {id:3,name:"Poulet DG",slug:"poulet-dg",title:"Poulet DG — Chez Mama Ngudi | Lamuka Market",desc:"Commandez le meilleur Poulet DG de Brazzaville.",score:90},
  {id:4,name:"Écouteurs Bluetooth",slug:"ecouteurs-bluetooth-pro",title:"",desc:"",score:20},
];

function VSeoScr({onBack}){
  const [products,setProducts]=useState(PRODUCTS);
  const [editing,setEditing]=useState(null);
  const [title,setTitle]=useState("");
  const [desc,setDesc]=useState("");
  const [slug,setSlug]=useState("");

  const edit=(p)=>{setEditing(p);setTitle(p.title);setDesc(p.desc);setSlug(p.slug)};
  const save=()=>{
    setProducts(prev=>prev.map(p=>p.id===editing.id?{...p,title,desc,slug,score:title&&desc?90:title||desc?60:20}:p));
    setEditing(null);toast.success("SEO mis à jour ✅");
  };
  const avgScore=Math.round(products.reduce((s,p)=>s+p.score,0)/products.length);
  const scoreColor=(s)=>s>=70?"#10B981":s>=40?"#F59E0B":"#EF4444";

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={editing?()=>setEditing(null):onBack}>←</button><h2>🌍 SEO</h2><div style={{width:38}}/></div>

    {editing?<>
      <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>✏️ {editing.name}</div>
      <div className="field"><label>Meta Title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder={editing.name+" | Ma Boutique | Lamuka Market"}/><div style={{fontSize:10,color:title.length>60?"#EF4444":"var(--muted)",marginTop:4}}>{title.length}/60 caractères</div></div>
      <div className="field"><label>Meta Description</label><textarea rows={3} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description courte pour Google..." style={{width:"100%",padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:13,fontFamily:"inherit",color:"var(--text)",resize:"none"}}/><div style={{fontSize:10,color:desc.length>160?"#EF4444":"var(--muted)",marginTop:4}}>{desc.length}/160 caractères</div></div>
      <div className="field"><label>URL Slug</label>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:11,color:"var(--muted)",flexShrink:0}}>lamuka.cg/p/</span>
          <input value={slug} onChange={e=>setSlug(e.target.value.replace(/[^a-z0-9-]/g,""))} style={{flex:1}}/>
        </div>
      </div>

      {/* Preview */}
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Aperçu Google</div>
        <div style={{fontSize:14,color:"#1a0dab",fontWeight:500}}>{title||editing.name+" | Lamuka Market"}</div>
        <div style={{fontSize:11,color:"#006621",marginTop:2}}>lamuka.cg/p/{slug}</div>
        <div style={{fontSize:11,color:"#545454",marginTop:2,lineHeight:1.4}}>{desc||"Aucune description — ajoutez-en une pour un meilleur référencement."}</div>
      </div>
      <button onClick={save} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Enregistrer</button>
    </>:<>
      {/* Score global */}
      <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:36,fontWeight:800,color:scoreColor(avgScore)}}>{avgScore}%</div>
        <div style={{fontSize:12,color:"var(--muted)"}}>Score SEO global</div>
        <div style={{marginTop:8,height:6,borderRadius:3,background:"var(--light)"}}>
          <div style={{width:`${avgScore}%`,height:"100%",borderRadius:3,background:scoreColor(avgScore)}}/>
        </div>
      </div>

      {products.map(p=>(
        <div key={p.id} onClick={()=>edit(p)} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:scoreColor(p.score)+"12",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:scoreColor(p.score),flexShrink:0}}>{p.score}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600}}>{p.name}</div>
            <div style={{fontSize:10,color:"var(--muted)"}}>{p.title?"✅ Title + Desc configurés":"⚠️ SEO non configuré"}</div>
          </div>
          <span style={{color:"var(--muted)"}}>›</span>
        </div>
      ))}
    </>}
  </div>);
}
export default VSeoScr;
