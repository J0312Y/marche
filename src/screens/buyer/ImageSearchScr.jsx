import { useState } from "react";
import { useData } from "../../hooks";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";

function ImageSearchScr({onBack,go}){
  const { P } = useData();
  const [photo,setPhoto]=useState(null);
  const [searching,setSearching]=useState(false);
  const [results,setResults]=useState(null);

  const doSearch=(file)=>{
    const r=new FileReader();
    r.onload=()=>{
      setPhoto(r.result);
      setSearching(true);
      setTimeout(()=>{
        setResults(P.slice(0,4).map(p=>({...p,match:Math.floor(Math.random()*20)+80})).sort((a,b)=>b.match-a.match));
        setSearching(false);
      },1500);
    };
    r.readAsDataURL(file);
  };

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>🔍 Recherche par image</h2><div style={{width:38}}/></div>

    {!photo?<>
      <div onClick={()=>document.getElementById("img-search-upload")?.click()} style={{padding:40,background:"var(--card)",border:"2px dashed var(--border)",borderRadius:20,textAlign:"center",cursor:"pointer"}}>
        <div style={{fontSize:48,marginBottom:12}}>📷</div>
        <div style={{fontSize:15,fontWeight:700}}>Prenez une photo</div>
        <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>ou choisissez dans votre galerie</div>
      </div>
      <input id="img-search-upload" type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)doSearch(f)}}/>
      <p style={{textAlign:"center",fontSize:12,color:"var(--muted)",marginTop:16}}>Photographiez un produit et Lamuka trouvera des articles similaires</p>
    </>:<>
      <div style={{position:"relative",marginBottom:14}}>
        <img src={photo} style={{width:"100%",height:200,objectFit:"cover",borderRadius:16}} alt=""/>
        {searching&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
          <div style={{width:32,height:32,border:"3px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
          <div style={{color:"#fff",fontSize:12,fontWeight:600,marginTop:8}}>Recherche en cours...</div>
        </div>}
        <button onClick={()=>{setPhoto(null);setResults(null)}} style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:8,border:"none",background:"rgba(0,0,0,.5)",color:"#fff",fontSize:14,cursor:"pointer"}}>✕</button>
      </div>

      {results&&<>
        <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>{results.length} produits similaires trouvés</div>
        {results.map(p=>(
          <div key={p.id} onClick={()=>go("detail",p)} style={{display:"flex",gap:12,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,cursor:"pointer"}}>
            <div style={{width:60,height:60,borderRadius:10,overflow:"hidden",flexShrink:0,background:"var(--light)"}}><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>{p.name}</div>
              <div style={{fontSize:11,color:"var(--muted)"}}>{p.vendor}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#F97316",marginTop:2}}>{fmt(p.price)}</div>
            </div>
            <div style={{padding:"2px 8px",borderRadius:6,background:"rgba(16,185,129,0.08)",color:"#10B981",fontSize:10,fontWeight:700,height:"fit-content"}}>{p.match}%</div>
          </div>
        ))}
      </>}
    </>}
  </div>);
}
export default ImageSearchScr;
