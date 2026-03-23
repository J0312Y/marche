import { useState } from "react";
import toast from "../../utils/toast";

const THEMES=[
  {id:"modern",name:"Moderne",preview:"linear-gradient(135deg,#1a1a2e,#16213e)",accent:"#F97316",font:"Inter",desc:"Épuré et professionnel"},
  {id:"vibrant",name:"Vibrant",preview:"linear-gradient(135deg,#F97316,#FB923C)",accent:"#F97316",font:"Poppins",desc:"Coloré et dynamique"},
  {id:"minimal",name:"Minimal",preview:"linear-gradient(135deg,#fafafa,#e5e5e5)",accent:"#333",font:"Helvetica",desc:"Simple et élégant"},
  {id:"nature",name:"Nature",preview:"linear-gradient(135deg,#065f46,#10B981)",accent:"#10B981",font:"Georgia",desc:"Vert et naturel"},
  {id:"luxe",name:"Luxe",preview:"linear-gradient(135deg,#1c1917,#44403c)",accent:"#F59E0B",font:"Playfair",desc:"Or et sophistiqué"},
];

function VThemesScr({onBack}){
  const [active,setActive]=useState("modern");
  const [preview,setPreview]=useState(null);

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>🌟 Thèmes</h2><div style={{width:38}}/></div>
    <p style={{fontSize:12,color:"var(--muted)",marginBottom:14}}>Choisissez le thème visuel de votre vitrine en ligne</p>

    {THEMES.map(t=>(
      <div key={t.id} onClick={()=>setPreview(t)} style={{padding:14,background:"var(--card)",border:active===t.id?"2px solid #F97316":"1px solid var(--border)",borderRadius:16,marginBottom:10,cursor:"pointer"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{width:60,height:40,borderRadius:8,background:t.preview,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700}}>{t.name} {active===t.id&&<span style={{fontSize:10,color:"#10B981",fontWeight:600}}>✅ Actif</span>}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>{t.desc} · Police: {t.font}</div>
          </div>
        </div>
      </div>
    ))}

    {preview&&<div onClick={()=>setPreview(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:340,background:"var(--card)",borderRadius:20,overflow:"hidden"}}>
        <div style={{height:180,background:preview.preview,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",color:"#fff"}}>
          <div style={{fontSize:20,fontWeight:800,fontFamily:preview.font}}>Ma Boutique</div>
          <div style={{fontSize:12,opacity:.7,marginTop:4}}>Aperçu du thème {preview.name}</div>
        </div>
        <div style={{padding:16}}>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setPreview(null)} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Fermer</button>
            <button onClick={()=>{setActive(preview.id);setPreview(null);toast.success("Thème "+preview.name+" appliqué ✅")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Appliquer</button>
          </div>
        </div>
      </div>
    </div>}
  </div>);
}
export default VThemesScr;
