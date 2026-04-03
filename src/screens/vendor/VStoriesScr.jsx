import { useState, useRef, useEffect, useCallback } from "react";
import toast from "../../utils/toast";

function VStoriesScr({onBack}){
  const [stories,setStories]=useState([
    {id:1,type:"photo",media:"https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=600&fit=crop",caption:"Nouvelle collection Wax 🌍",date:"Il y a 2h",views:142,duration:null,active:true},
    {id:2,type:"video",media:null,caption:"Making-of sacs artisanaux 🎬",date:"Il y a 5h",views:214,duration:"0:22",active:true},
    {id:3,type:"photo",media:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=600&fit=crop",caption:"Sacs en promo -30% 👜",date:"Il y a 8h",views:89,active:true},
    {id:4,type:"photo",media:"https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",caption:"Soldes d'hiver 🏷️",date:"Hier",views:256,active:false},
  ]);

  /* ═══ STORY VIEWER ═══ */
  const [viewIdx,setViewIdx]=useState(null);
  const [progress,setProgress]=useState(0);
  const timerRef=useRef(null);
  const STORY_DURATION=5000; // 5s per story

  const viewing=viewIdx!==null;
  const currentStory=viewing?stories[viewIdx]:null;

  const closeViewer=useCallback(()=>{setViewIdx(null);setProgress(0);clearInterval(timerRef.current)},[]);

  const goNext=useCallback(()=>{
    if(viewIdx<stories.length-1){setViewIdx(viewIdx+1);setProgress(0)}
    else closeViewer();
  },[viewIdx,stories.length,closeViewer]);

  const goPrev=useCallback(()=>{
    if(viewIdx>0){setViewIdx(viewIdx-1);setProgress(0)}
    else setProgress(0);
  },[viewIdx]);

  // Auto-advance timer
  useEffect(()=>{
    if(!viewing)return;
    clearInterval(timerRef.current);
    const start=Date.now();
    timerRef.current=setInterval(()=>{
      const elapsed=Date.now()-start;
      const pct=Math.min((elapsed/STORY_DURATION)*100,100);
      setProgress(pct);
      if(elapsed>=STORY_DURATION){clearInterval(timerRef.current);goNext()}
    },50);
    return()=>clearInterval(timerRef.current);
  },[viewing,viewIdx,goNext]);

  const handleViewerTap=(e)=>{
    const rect=e.currentTarget.getBoundingClientRect();
    const x=e.clientX-rect.left;
    if(x<rect.width*0.3) goPrev();
    else goNext();
  };

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

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}>
      <button onClick={onBack}>←</button>
      <h2>📸 Stories ({activeCount})</h2>
      <button onClick={()=>setCreating(true)} style={{fontSize:20,background:"none",border:"none",cursor:"pointer",color:"var(--text)"}}>+</button>
    </div>

    <p style={{fontSize:12,color:"var(--muted)",marginBottom:14}}>Photos et vidéos courtes (max 30s) visibles 24h sur l'accueil des clients.</p>

    {/* ═══ CREATE FORM ═══ */}
    {creating&&<div style={{padding:14,background:"var(--card)",border:"2px solid #F97316",borderRadius:16,marginBottom:14}}>
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
        <button onClick={addStory} style={{flex:1,padding:10,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{mediaType==="video"?"🎬 Publier":"📸 Publier"}</button>
      </div>
    </div>}

    {/* ═══ STORIES LIST ═══ */}
    {stories.map((s,idx)=><div key={s.id} style={{display:"flex",gap:12,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
      {/* Thumbnail - clickable to view */}
      <div onClick={()=>setViewIdx(idx)} style={{width:60,height:80,borderRadius:12,overflow:"hidden",flexShrink:0,position:"relative",background:"var(--light)",cursor:"pointer"}}>
        {s.type==="video"?(
          <>
            {s.media?<video src={s.media} style={{width:"100%",height:"100%",objectFit:"cover"}} muted/>:<div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24}}>🎬</span></div>}
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

      {/* Info - clickable to view */}
      <div style={{flex:1,cursor:"pointer"}} onClick={()=>setViewIdx(idx)}>
        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>
          <span style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:s.type==="video"?"rgba(249,115,22,0.08)":"rgba(16,185,129,0.08)",color:s.type==="video"?"#F97316":"#10B981",fontWeight:700}}>{s.type==="video"?"🎬 Vidéo":"📷 Photo"}</span>
        </div>
        <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{s.caption}</div>
        <div style={{fontSize:11,color:"var(--muted)"}}>{s.date} · 👁️ {s.views} vues{s.duration?` · ${s.duration}`:""}</div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:s.active?"#10B981":"var(--border)"}}/>
          <span style={{fontSize:10,color:s.active?"#10B981":"var(--muted)"}}>{s.active?"Active (24h)":"Expirée"}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{display:"flex",flexDirection:"column",gap:6,alignSelf:"flex-start"}}>
        <button onClick={()=>setViewIdx(idx)} style={{fontSize:11,color:"#F97316",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>👁️</button>
        <button onClick={()=>del(s.id)} style={{fontSize:11,color:"#EF4444",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>🗑️</button>
      </div>
    </div>)}

    {stories.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36}}>📸</div><div style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Aucune story</div><div style={{fontSize:11,color:"var(--sub)",marginTop:4}}>Publiez des photos et vidéos pour attirer les clients</div></div>}

    {/* ═══ FULLSCREEN STORY VIEWER ═══ */}
    {viewing&&currentStory&&<div style={{position:"fixed",inset:0,zIndex:200,background:"#000",display:"flex",flexDirection:"column"}}>
      {/* Progress bars */}
      <div style={{display:"flex",gap:3,padding:"12px 12px 0",zIndex:3}}>
        {stories.map((_,i)=>(
          <div key={i} style={{flex:1,height:3,borderRadius:2,background:"rgba(255,255,255,.25)",overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:2,background:"var(--card)",width:i<viewIdx?"100%":i===viewIdx?`${progress}%`:"0%",transition:i===viewIdx?"none":"width .2s"}}/>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",zIndex:3}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:800}}>LM</div>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>Ma Boutique</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>{currentStory.date}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>👁️ {currentStory.views}</span>
          <button onClick={closeViewer} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer",padding:4}}>✕</button>
        </div>
      </div>

      {/* Media (tappable zones: left 30% = prev, right 70% = next) */}
      <div onClick={handleViewerTap} style={{flex:1,position:"relative",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        {currentStory.type==="video"?(
          currentStory.media?(
            <video src={currentStory.media} style={{width:"100%",height:"100%",objectFit:"contain"}} autoPlay muted playsInline/>
          ):(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:0,height:0,borderLeft:"30px solid #fff",borderTop:"18px solid transparent",borderBottom:"18px solid transparent",marginLeft:6}}/>
              </div>
              <div style={{color:"rgba(255,255,255,.5)",fontSize:12}}>Vidéo · {currentStory.duration}</div>
            </div>
          )
        ):(
          currentStory.media?(
            <img src={currentStory.media} style={{width:"100%",height:"100%",objectFit:"contain"}} alt=""/>
          ):(
            <div style={{fontSize:56,opacity:.3}}>📷</div>
          )
        )}

        {/* Caption overlay at bottom */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"40px 16px 20px",background:"linear-gradient(transparent,rgba(0,0,0,.7))"}}>
          <div style={{fontSize:15,fontWeight:600,color:"#fff",textShadow:"0 1px 4px rgba(0,0,0,.5)"}}>{currentStory.caption}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
            <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:currentStory.type==="video"?"rgba(249,115,22,.6)":"rgba(16,185,129,.6)",color:"#fff",fontWeight:600}}>{currentStory.type==="video"?"🎬 Vidéo":"📷 Photo"}</span>
            {currentStory.duration&&<span style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>{currentStory.duration}</span>}
            <span style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>{viewIdx+1}/{stories.length}</span>
          </div>
        </div>

        {/* Navigation hints */}
        <div style={{position:"absolute",top:"50%",left:8,transform:"translateY(-50%)",fontSize:10,color:"rgba(255,255,255,.3)",fontWeight:600}}>{viewIdx>0?"‹":""}</div>
        <div style={{position:"absolute",top:"50%",right:8,transform:"translateY(-50%)",fontSize:10,color:"rgba(255,255,255,.3)",fontWeight:600}}>{viewIdx<stories.length-1?"›":""}</div>
      </div>
    </div>}
  </div>);
}

export default VStoriesScr;
