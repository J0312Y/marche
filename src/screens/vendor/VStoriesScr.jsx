import { useState, useRef } from "react";
import toast from "../../utils/toast";

function VStoriesScr({onBack}){
  const [stories,setStories]=useState([
    {id:1,type:"photo",media:"https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=600&fit=crop",caption:"Nouvelle collection Wax 🌍",date:"Il y a 2h",views:142,duration:null,active:true},
    {id:2,type:"video",media:null,caption:"Making-of sacs artisanaux 🎬",date:"Il y a 5h",views:214,duration:"0:22",active:true},
    {id:3,type:"photo",media:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=600&fit=crop",caption:"Sacs en promo -30% 👜",date:"Il y a 8h",views:89,active:true},
    {id:4,type:"photo",media:"https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",caption:"Soldes d'hiver 🏷️",date:"Hier",views:256,active:false},
  ]);

  const [creating,setCreating]=useState(false);
  const [mediaType,setMediaType]=useState("photo");
  const [caption,setCaption]=useState("");
  const [preview,setPreview]=useState(null);
  const [videoDuration,setVideoDuration]=useState(null);
  const fileRef=useRef(null);

  const handleFile=(e)=>{
    const f=e.target.files?.[0];
    if(!f)return;

    if(mediaType==="video"){
      // Check video duration (max 30s)
      if(!f.type.startsWith("video/")){toast.error("Sélectionnez une vidéo");return}
      if(f.size>50*1024*1024){toast.error("Vidéo trop lourde (max 50 MB)");return}
      const video=document.createElement("video");
      video.preload="metadata";
      video.onloadedmetadata=()=>{
        window.URL.revokeObjectURL(video.src);
        if(video.duration>30){
          toast.error("Vidéo trop longue (max 30 secondes)");
          return;
        }
        setVideoDuration(Math.round(video.duration));
        const reader=new FileReader();
        reader.onload=()=>setPreview(reader.result);
        reader.readAsDataURL(f);
      };
      video.src=URL.createObjectURL(f);
    } else {
      if(!f.type.startsWith("image/")){toast.error("Sélectionnez une image");return}
      if(f.size>10*1024*1024){toast.error("Image trop lourde (max 10 MB)");return}
      const reader=new FileReader();
      reader.onload=()=>setPreview(reader.result);
      reader.readAsDataURL(f);
    }
    e.target.value="";
  };

  const addStory=()=>{
    if(!caption.trim()){toast.error("Ajoutez une légende");return}
    const newStory={
      id:Date.now(),
      type:mediaType,
      media:preview||"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
      caption,
      date:"À l'instant",
      views:0,
      duration:mediaType==="video"?`0:${String(videoDuration||15).padStart(2,"0")}`:null,
      active:true
    };
    setStories(prev=>[newStory,...prev]);
    setCreating(false);setCaption("");setPreview(null);setVideoDuration(null);setMediaType("photo");
    toast.success(mediaType==="video"?"Vidéo publiée ! 🎬":"Story publiée ! 📸");
  };

  const del=(id)=>{setStories(prev=>prev.filter(s=>s.id!==id));toast.success("Story supprimée")};
  const reset=()=>{setCreating(false);setCaption("");setPreview(null);setVideoDuration(null);setMediaType("photo")};

  const activeCount=stories.filter(s=>s.active).length;
  const videoCount=stories.filter(s=>s.type==="video").length;

  return(<div className="scr" style={{padding:16,paddingBottom:80}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}>
      <button onClick={onBack}>←</button>
      <h2>📸 Stories ({activeCount})</h2>
      <button onClick={()=>setCreating(true)} style={{fontSize:20,background:"none",border:"none",cursor:"pointer",color:"var(--text)"}}>+</button>
    </div>

    <p style={{fontSize:12,color:"var(--muted)",marginBottom:14}}>Photos et vidéos courtes (max 30s) visibles 24h sur l'accueil des clients.</p>

    {/* ═══ CREATE FORM ═══ */}
    {creating&&<div style={{padding:14,background:"var(--card)",border:"2px solid #6366F1",borderRadius:16,marginBottom:14}}>
      {/* Media type toggle */}
      <div style={{display:"flex",gap:0,marginBottom:12,background:"var(--light)",borderRadius:10,padding:3}}>
        {[["photo","📷 Photo"],["video","🎬 Vidéo (30s)"]].map(([k,l])=>(
          <button key={k} onClick={()=>{setMediaType(k);setPreview(null);setVideoDuration(null)}} style={{flex:1,padding:"8px 0",borderRadius:8,border:"none",background:mediaType===k?"var(--card)":"transparent",color:mediaType===k?"var(--text)":"var(--muted)",fontSize:11,fontWeight:mediaType===k?700:500,cursor:"pointer",fontFamily:"inherit",boxShadow:mediaType===k?"0 1px 4px rgba(0,0,0,.06)":"none"}}>{l}</button>
        ))}
      </div>

      {/* Upload area */}
      <div onClick={()=>fileRef.current?.click()} style={{height:160,borderRadius:14,border:"2px dashed var(--border)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginBottom:10,background:"var(--light)",position:"relative"}}>
        {preview?(
          mediaType==="video"?(
            <div style={{width:"100%",height:"100%",position:"relative"}}>
              <video src={preview} style={{width:"100%",height:"100%",objectFit:"cover"}} muted/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:0,height:0,borderLeft:"18px solid #fff",borderTop:"11px solid transparent",borderBottom:"11px solid transparent",marginLeft:4}}/>
                </div>
              </div>
              {videoDuration&&<div style={{position:"absolute",bottom:8,right:8,padding:"3px 8px",borderRadius:6,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:10,fontWeight:700}}>0:{String(videoDuration).padStart(2,"0")}</div>}
            </div>
          ):(
            <img src={preview} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
          )
        ):(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:32}}>{mediaType==="video"?"🎬":"📷"}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>
              {mediaType==="video"?"Ajouter une vidéo (max 30s, 50 MB)":"Ajouter une photo (max 10 MB)"}
            </div>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept={mediaType==="video"?"video/*":"image/*"} style={{display:"none"}} onChange={handleFile}/>

      {/* Caption */}
      <div className="field"><label>Légende</label><input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Nouveautés, promos, coulisses..."/></div>

      {/* Buttons */}
      <div style={{display:"flex",gap:8}}>
        <button onClick={reset} style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Annuler</button>
        <button onClick={addStory} style={{flex:1,padding:10,borderRadius:12,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{mediaType==="video"?"🎬 Publier":"📸 Publier"}</button>
      </div>
    </div>}

    {/* ═══ STORIES LIST ═══ */}
    {stories.map(s=><div key={s.id} style={{display:"flex",gap:12,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
      {/* Thumbnail */}
      <div style={{width:60,height:80,borderRadius:12,overflow:"hidden",flexShrink:0,position:"relative",background:"var(--light)"}}>
        {s.type==="video"?(
          <>
            {s.media?<video src={s.media} style={{width:"100%",height:"100%",objectFit:"cover"}} muted/>:<div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24}}>🎬</span></div>}
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:0,height:0,borderLeft:"8px solid #fff",borderTop:"5px solid transparent",borderBottom:"5px solid transparent",marginLeft:2}}/>
              </div>
            </div>
            {s.duration&&<div style={{position:"absolute",bottom:3,right:3,padding:"1px 5px",borderRadius:4,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:8,fontWeight:700}}>{s.duration}</div>}
          </>
        ):(
          <img src={s.media} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
        )}
      </div>

      {/* Info */}
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>
          <span style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:s.type==="video"?"rgba(99,102,241,0.08)":"rgba(16,185,129,0.08)",color:s.type==="video"?"#6366F1":"#10B981",fontWeight:700}}>{s.type==="video"?"🎬 Vidéo":"📷 Photo"}</span>
        </div>
        <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{s.caption}</div>
        <div style={{fontSize:11,color:"var(--muted)"}}>{s.date} · 👁️ {s.views} vues{s.duration?` · ${s.duration}`:""}</div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:s.active?"#10B981":"var(--border)"}}/>
          <span style={{fontSize:10,color:s.active?"#10B981":"var(--muted)"}}>{s.active?"Active (24h)":"Expirée"}</span>
        </div>
      </div>

      {/* Delete */}
      <button onClick={()=>del(s.id)} style={{alignSelf:"flex-start",fontSize:12,color:"#EF4444",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>🗑️</button>
    </div>)}

    {stories.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36}}>📸</div><div style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Aucune story</div><div style={{fontSize:11,color:"var(--sub)",marginTop:4}}>Publiez des photos et vidéos pour attirer les clients</div></div>}
  </div>);
}

export default VStoriesScr;
