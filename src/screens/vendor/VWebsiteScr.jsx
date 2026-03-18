import { useState } from "react";
import toast from "../../utils/toast";

const THEMES=[
  {id:"modern",name:"Moderne",colors:["#6366F1","#1E1E2E","#F5F4F1"],preview:"linear-gradient(135deg,#6366F1,#818CF8)"},
  {id:"warm",name:"Chaleureux",colors:["#F59E0B","#78350F","#FFFBEB"],preview:"linear-gradient(135deg,#F59E0B,#D97706)"},
  {id:"nature",name:"Nature",colors:["#10B981","#064E3B","#ECFDF5"],preview:"linear-gradient(135deg,#10B981,#059669)"},
  {id:"dark",name:"Sombre",colors:["#A855F7","#111827","#1F2937"],preview:"linear-gradient(135deg,#111827,#374151)"},
  {id:"afro",name:"Afro",colors:["#EF4444","#7C2D12","#FEF2F2"],preview:"linear-gradient(135deg,#EF4444,#B91C1C)"},
];

const DEFAULT_PAGES=[
  {id:"home",name:"Accueil",icon:"🏠",blocks:[
    {type:"hero",title:"Bienvenue chez Mode Afrique",subtitle:"Vêtements africains modernes — Wax, Bogolan, Cuir artisanal",image:"https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&h=400&fit=crop",cta:"Voir la collection"},
    {type:"products",title:"Nos produits populaires",count:8,layout:"grid"},
    {type:"promo",title:"🏷️ -10% sur les Wax",desc:"Jusqu'au 31 Mars 2026",color:"#F59E0B"},
    {type:"testimonials",title:"Avis clients"},
  ],published:true},
  {id:"about",name:"À propos",icon:"ℹ️",blocks:[
    {type:"text",title:"Notre histoire",content:"Mode Afrique est née de la passion pour la mode africaine moderne..."},
    {type:"gallery",title:"Notre atelier",images:4},
    {type:"team",title:"L'équipe"},
  ],published:true},
  {id:"contact",name:"Contact",icon:"📧",blocks:[
    {type:"contact_form",title:"Nous contacter",fields:["Nom","Email","Téléphone","Message"]},
    {type:"map",title:"Nous trouver",address:"Bacongo, Brazzaville"},
    {type:"hours",title:"Horaires d'ouverture"},
  ],published:true},
  {id:"blog",name:"Blog",icon:"✍️",blocks:[],published:false},
];

const BLOCK_TYPES=[
  {type:"hero",name:"Bannière héro",icon:"🖼️",desc:"Grande image + titre + bouton"},
  {type:"products",name:"Grille produits",icon:"🛍️",desc:"Affiche vos articles"},
  {type:"text",name:"Texte libre",icon:"📝",desc:"Paragraphe personnalisé"},
  {type:"gallery",name:"Galerie photos",icon:"📸",desc:"Carrousel d'images"},
  {type:"promo",name:"Bannière promo",icon:"🏷️",desc:"Mise en avant d'une offre"},
  {type:"testimonials",name:"Avis clients",icon:"⭐",desc:"Témoignages vérifiés"},
  {type:"video",name:"Vidéo",icon:"🎬",desc:"Intégrer une vidéo"},
  {type:"contact_form",name:"Formulaire contact",icon:"📧",desc:"Les clients vous écrivent"},
  {type:"map",name:"Carte / Adresse",icon:"📍",desc:"Localisation Google Maps"},
  {type:"faq",name:"FAQ",icon:"❓",desc:"Questions fréquentes"},
  {type:"newsletter",name:"Newsletter",icon:"📬",desc:"Collecte d'emails"},
  {type:"social",name:"Réseaux sociaux",icon:"📱",desc:"Liens vers vos profils"},
];

const BLOG_POSTS=[
  {id:1,title:"Tendances Wax 2026",status:"published",date:"12 Fév 2026",views:89},
  {id:2,title:"Comment entretenir le cuir",status:"draft",date:"10 Fév 2026",views:0},
];

function VWebsiteScr({onBack}){
  const [tab,setTab]=useState("dashboard");
  const [site,setSite]=useState({
    enabled:true, subdomain:"mode-afrique", customDomain:"", 
    title:"Mode Afrique", description:"Vêtements africains modernes — Wax, Bogolan, Cuir artisanal",
    theme:"modern", logo:null,
    seo:{title:"Mode Afrique — Boutique en ligne",desc:"Achetez des vêtements africains modernes",keywords:"wax, mode africaine, bogolan, cuir"},
    nav:[{label:"Accueil",page:"home"},{label:"À propos",page:"about"},{label:"Contact",page:"contact"},{label:"Blog",page:"blog"}],
    analytics:{visitors:342,orders:28,conversion:"8.2%",topPages:["Accueil (45%)","Produits (32%)","Contact (12%)","Blog (11%)"]},
  });
  const [pages,setPages]=useState(DEFAULT_PAGES);
  const [posts,setPosts]=useState(BLOG_POSTS);
  const [editPage,setEditPage]=useState(null);
  const [editBlock,setEditBlock]=useState(null);
  const [addBlockTo,setAddBlockTo]=useState(null);
  const [showPreview,setShowPreview]=useState(false);
  const [editPost,setEditPost]=useState(null);
  const [newPostTitle,setNewPostTitle]=useState("");
  const [editSEO,setEditSEO]=useState(false);
  const [editNav,setEditNav]=useState(false);

  const theme=THEMES.find(t=>t.id===site.theme)||THEMES[0];
  const url=site.customDomain||`${site.subdomain}.lamuka.market`;

  const tabs=[
    ["dashboard","📊 Dashboard"],["pages","📄 Pages"],["design","🎨 Design"],
    ["blog","✍️ Blog"],["seo","🔍 SEO"],["settings","⚙️ Config"],
  ];

  const addBlock=(pageId,blockType)=>{
    const bt=BLOCK_TYPES.find(b=>b.type===blockType);
    setPages(prev=>prev.map(p=>p.id===pageId?{...p,blocks:[...p.blocks,{type:blockType,title:bt?.name||"Nouveau bloc"}]}:p));
    setAddBlockTo(null);
    toast.success("Bloc ajouté ✅");
  };

  const removeBlock=(pageId,blockIdx)=>{
    setPages(prev=>prev.map(p=>p.id===pageId?{...p,blocks:p.blocks.filter((_,i)=>i!==blockIdx)}:p));
    toast.success("Bloc supprimé");
  };

  const togglePagePublish=(pageId)=>{
    setPages(prev=>prev.map(p=>p.id===pageId?{...p,published:!p.published}:p));
    toast.success("Page mise à jour");
  };

  const addPage=()=>{
    const id="page-"+Date.now();
    setPages(prev=>[...prev,{id,name:"Nouvelle page",icon:"📄",blocks:[],published:false}]);
    toast.success("Page créée ✅");
  };

  return(<div className="scr" style={{paddingBottom:80}}>
    <div className="appbar" style={{padding:"0 16px"}}><button onClick={onBack}>←</button><h2>🌐 Mon Site Web</h2>
      <button onClick={()=>setShowPreview(true)} style={{fontSize:12,background:"none",border:"1px solid #6366F1",borderRadius:8,padding:"4px 10px",color:"#6366F1",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>👁️</button>
    </div>

    {/* Tabs */}
    <div style={{display:"flex",gap:4,padding:"0 16px 12px",overflowX:"auto",scrollbarWidth:"none"}}>
      {tabs.map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{padding:"6px 12px",borderRadius:10,border:tab===k?"1px solid #6366F1":"1px solid var(--border)",background:tab===k?"rgba(99,102,241,0.06)":"var(--card)",fontSize:10,fontWeight:tab===k?700:500,color:tab===k?"#6366F1":"var(--muted)",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>{l}</button>)}
    </div>

    <div style={{padding:"0 16px"}}>

    {/* ═══════════ DASHBOARD ═══════════ */}
    {tab==="dashboard"&&<>
      {/* Site status */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:12,background:site.enabled?"rgba(16,185,129,0.06)":"rgba(239,68,68,0.06)",border:site.enabled?"1px solid rgba(16,185,129,0.15)":"1px solid rgba(239,68,68,0.15)",borderRadius:14,marginBottom:12}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:site.enabled?"#10B981":"#EF4444"}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700}}>{site.enabled?"Site en ligne ✅":"Site hors ligne"}</div>
          <div style={{fontSize:11,color:"var(--muted)"}}>{url}</div>
        </div>
        <div className={`toggle ${site.enabled?"on":""}`} onClick={()=>{setSite(s=>({...s,enabled:!s.enabled}));toast.success(site.enabled?"Site désactivé":"Site en ligne ✅")}}/>
      </div>

      {/* Analytics cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[["👥",site.analytics.visitors,"Visiteurs"],["🛍️",site.analytics.orders,"Commandes"],["📈",site.analytics.conversion,"Conversion"]].map(([i,v,l])=>
          <div key={l} style={{padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,textAlign:"center"}}>
            <div style={{fontSize:16}}>{i}</div>
            <div style={{fontSize:18,fontWeight:800,marginTop:2}}>{v}</div>
            <div style={{fontSize:9,color:"var(--muted)"}}>{l}</div>
          </div>
        )}
      </div>

      {/* Top pages */}
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>📊 Pages les plus visitées</div>
        {site.analytics.topPages.map((p,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:i?"1px solid var(--border)":"none",fontSize:12}}><span>{i+1}. {p.split(" (")[0]}</span><span style={{color:"#6366F1",fontWeight:600}}>{p.match(/\((.+)\)/)?.[1]}</span></div>)}
      </div>

      {/* Quick links */}
      <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>⚡ Actions rapides</div>
      {[["📄","Gérer les pages",()=>setTab("pages")],["🎨","Changer le design",()=>setTab("design")],["✍️","Écrire un article",()=>setTab("blog")],["🔍","Optimiser le SEO",()=>setTab("seo")]].map(([i,t,fn])=>
        <div key={t} onClick={fn} style={{display:"flex",alignItems:"center",gap:10,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,marginBottom:6,cursor:"pointer"}}>
          <span style={{fontSize:16}}>{i}</span><span style={{flex:1,fontSize:13,fontWeight:600}}>{t}</span><span style={{color:"var(--muted)"}}>›</span>
        </div>
      )}
    </>}

    {/* ═══════════ PAGES ═══════════ */}
    {tab==="pages"&&<>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:14,fontWeight:700}}>Mes pages ({pages.length})</span>
        <button onClick={addPage} style={{padding:"6px 14px",borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Ajouter</button>
      </div>

      {pages.map(p=><div key={p.id} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>{p.icon}</span>
            <div>
              <div style={{fontSize:14,fontWeight:700}}>{p.name}</div>
              <div style={{fontSize:11,color:"var(--muted)"}}>{p.blocks.length} blocs</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:p.published?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)",color:p.published?"#10B981":"#EF4444",fontWeight:600}}>{p.published?"En ligne":"Brouillon"}</span>
            <div className={`toggle ${p.published?"on":""}`} onClick={()=>togglePagePublish(p.id)} style={{transform:"scale(.7)"}}/>
          </div>
        </div>

        {/* Blocks list */}
        {p.blocks.map((b,bi)=><div key={bi} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"var(--light)",borderRadius:10,marginBottom:4}}>
          <span style={{fontSize:12}}>{BLOCK_TYPES.find(bt=>bt.type===b.type)?.icon||"📦"}</span>
          <span style={{flex:1,fontSize:11,fontWeight:600}}>{b.title||b.type}</span>
          <button onClick={()=>removeBlock(p.id,bi)} style={{fontSize:10,color:"#EF4444",background:"none",border:"none",cursor:"pointer"}}>✕</button>
        </div>)}

        {/* Add block button */}
        <button onClick={()=>setAddBlockTo(addBlockTo===p.id?null:p.id)} style={{width:"100%",padding:8,borderRadius:10,border:"2px dashed var(--border)",background:"transparent",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--muted)",marginTop:4}}>+ Ajouter un bloc</button>

        {/* Block picker */}
        {addBlockTo===p.id&&<div style={{marginTop:8,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {BLOCK_TYPES.map(bt=><div key={bt.type} onClick={()=>addBlock(p.id,bt.type)} style={{padding:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:18}}>{bt.icon}</div>
            <div style={{fontSize:10,fontWeight:600,marginTop:2}}>{bt.name}</div>
          </div>)}
        </div>}
      </div>)}
    </>}

    {/* ═══════════ DESIGN ═══════════ */}
    {tab==="design"&&<>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>🎨 Thème du site</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {THEMES.map(t=><div key={t.id} onClick={()=>{setSite(s=>({...s,theme:t.id}));toast.success("Thème "+t.name+" appliqué ✅")}} style={{borderRadius:14,overflow:"hidden",border:site.theme===t.id?"3px solid #6366F1":"1px solid var(--border)",cursor:"pointer"}}>
          <div style={{height:60,background:t.preview}}/>
          <div style={{padding:"8px 10px",background:"var(--card)"}}>
            <div style={{fontSize:12,fontWeight:700}}>{t.name}</div>
            <div style={{display:"flex",gap:4,marginTop:4}}>
              {t.colors.map((c,i)=><div key={i} style={{width:14,height:14,borderRadius:4,background:c,border:"1px solid var(--border)"}}/>)}
            </div>
          </div>
          {site.theme===t.id&&<div style={{textAlign:"center",padding:"4px 0",background:"#6366F1",color:"#fff",fontSize:10,fontWeight:700}}>✓ Actif</div>}
        </div>)}
      </div>

      {/* Font & Layout */}
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>✏️ Personnalisation</div>
      <div className="field"><label>Police de caractère</label>
        <select defaultValue="Inter"><option>Inter</option><option>Poppins</option><option>Montserrat</option><option>DM Sans</option><option>Playfair Display</option></select>
      </div>
      <div className="field"><label>Style des boutons</label>
        <select defaultValue="rounded"><option value="rounded">Arrondis</option><option value="pill">Pilule</option><option value="square">Carrés</option></select>
      </div>
      <div className="field"><label>Couleur principale</label>
        <div style={{display:"flex",gap:6,marginTop:4}}>
          {["#6366F1","#10B981","#F59E0B","#EF4444","#A855F7","#EC4899","#000000"].map(c=>
            <div key={c} onClick={()=>toast.success("Couleur appliquée")} style={{width:32,height:32,borderRadius:10,background:c,cursor:"pointer",border:c===theme.colors[0]?"3px solid var(--text)":"2px solid var(--border)"}}/>
          )}
        </div>
      </div>
      <div className="field"><label>Logo de la boutique</label>
        <div onClick={()=>toast.info("Upload du logo")} style={{padding:20,border:"2px dashed var(--border)",borderRadius:14,textAlign:"center",cursor:"pointer",background:"var(--light)"}}>
          <div style={{fontSize:24}}>🖼️</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>Cliquer pour uploader (PNG, SVG)</div>
        </div>
      </div>
    </>}

    {/* ═══════════ BLOG ═══════════ */}
    {tab==="blog"&&<>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:14,fontWeight:700}}>✍️ Articles ({posts.length})</span>
        <button onClick={()=>setEditPost("new")} style={{padding:"6px 14px",borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Nouvel article</button>
      </div>

      {editPost==="new"&&<div style={{padding:14,background:"var(--card)",border:"2px solid #6366F1",borderRadius:16,marginBottom:14}}>
        <div className="field"><label>Titre de l'article</label><input value={newPostTitle} onChange={e=>setNewPostTitle(e.target.value)} placeholder="Comment choisir un bon tissu Wax..."/></div>
        <div className="field"><label>Contenu</label><textarea rows={5} placeholder="Rédigez votre article ici... Vous pourrez ajouter des images, des liens et formater le texte." style={{width:"100%",padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:12,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box",color:"var(--text)"}}/></div>
        <div className="field"><label>Image de couverture</label>
          <div onClick={()=>toast.info("Upload d'image")} style={{padding:16,border:"2px dashed var(--border)",borderRadius:12,textAlign:"center",cursor:"pointer",background:"var(--light)"}}><span style={{fontSize:20}}>📷</span><div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>Ajouter une image</div></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{setEditPost(null);setNewPostTitle("")}} style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Annuler</button>
          <button onClick={()=>{if(newPostTitle.trim()){setPosts(prev=>[{id:Date.now(),title:newPostTitle,status:"draft",date:"Aujourd'hui",views:0},...prev]);setEditPost(null);setNewPostTitle("");toast.success("Brouillon sauvegardé ✅")}else{toast.error("Ajoutez un titre")}}} style={{flex:1,padding:10,borderRadius:12,border:"none",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)",border:"1px solid var(--border)"}}>📝 Brouillon</button>
          <button onClick={()=>{if(newPostTitle.trim()){setPosts(prev=>[{id:Date.now(),title:newPostTitle,status:"published",date:"Aujourd'hui",views:0},...prev]);setEditPost(null);setNewPostTitle("");toast.success("Article publié ✅")}else{toast.error("Ajoutez un titre")}}} style={{flex:1,padding:10,borderRadius:12,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🚀 Publier</button>
        </div>
      </div>}

      {posts.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
        <div style={{width:48,height:48,borderRadius:10,background:"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>✍️</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.title}</div>
          <div style={{fontSize:11,color:"var(--muted)"}}>{p.date} · 👁️ {p.views} vues</div>
        </div>
        <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:p.status==="published"?"rgba(16,185,129,0.08)":"rgba(245,158,11,0.08)",color:p.status==="published"?"#10B981":"#F59E0B",fontWeight:600}}>{p.status==="published"?"En ligne":"Brouillon"}</span>
      </div>)}
    </>}

    {/* ═══════════ SEO ═══════════ */}
    {tab==="seo"&&<>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>🔍 Référencement (SEO)</div>
      <p style={{fontSize:12,color:"var(--muted)",marginBottom:14}}>Optimisez votre site pour apparaître dans les résultats Google.</p>
      
      {/* Preview Google */}
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:14}}>
        <div style={{fontSize:11,color:"var(--muted)",marginBottom:6}}>Aperçu Google</div>
        <div style={{fontSize:14,fontWeight:600,color:"#1A0DAB"}}>{site.seo.title}</div>
        <div style={{fontSize:11,color:"#10B981",margin:"2px 0"}}>{url}</div>
        <div style={{fontSize:11,color:"var(--sub)",lineHeight:1.4}}>{site.seo.desc}</div>
      </div>

      <div className="field"><label>Titre SEO</label><input defaultValue={site.seo.title} onChange={e=>setSite(s=>({...s,seo:{...s.seo,title:e.target.value}}))}/></div>
      <div className="field"><label>Meta description</label><textarea rows={3} defaultValue={site.seo.desc} onChange={e=>setSite(s=>({...s,seo:{...s.seo,desc:e.target.value}}))} style={{width:"100%",padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:12,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box",color:"var(--text)"}}/></div>
      <div className="field"><label>Mots-clés</label><input defaultValue={site.seo.keywords} onChange={e=>setSite(s=>({...s,seo:{...s.seo,keywords:e.target.value}}))} placeholder="wax, mode africaine, bogolan..."/></div>
      
      <button onClick={()=>toast.success("SEO mis à jour ✅")} style={{width:"100%",padding:12,borderRadius:12,border:"none",background:"#6366F1",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>💾 Sauvegarder le SEO</button>

      {/* SEO checklist */}
      <div style={{marginTop:14,padding:14,background:"var(--light)",borderRadius:14}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>✅ Checklist SEO</div>
        {[
          [true,"Titre SEO défini ("+site.seo.title.length+"/60 caractères)"],
          [true,"Meta description définie ("+site.seo.desc.length+"/160 caractères)"],
          [true,"Mots-clés ajoutés"],
          [true,"URL propre ("+url+")"],
          [false,"Ajouter un sitemap XML"],
          [false,"Connecter Google Analytics"],
        ].map(([done,text],i)=><div key={i} style={{display:"flex",gap:8,padding:"5px 0",fontSize:11,color:done?"#10B981":"var(--muted)"}}><span>{done?"✅":"⬜"}</span><span>{text}</span></div>)}
      </div>
    </>}

    {/* ═══════════ SETTINGS ═══════════ */}
    {tab==="settings"&&<>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>⚙️ Configuration</div>
      <div className="field"><label>Nom du site</label><input defaultValue={site.title}/></div>
      <div className="field"><label>Sous-domaine</label>
        <div style={{display:"flex",alignItems:"center",gap:0}}><input defaultValue={site.subdomain} style={{borderRadius:"12px 0 0 12px",borderRight:"none"}}/><span style={{padding:"10px 12px",background:"var(--light)",border:"1px solid var(--border)",borderRadius:"0 12px 12px 0",fontSize:12,color:"var(--muted)"}}>.lamuka.market</span></div>
      </div>
      <div className="field"><label>Domaine personnalisé (optionnel)</label><input placeholder="www.mode-afrique.com" defaultValue={site.customDomain}/></div>
      <div className="field"><label>Description</label><textarea rows={2} defaultValue={site.description} style={{width:"100%",padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--light)",fontSize:12,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box",color:"var(--text)"}}/></div>

      {/* Navigation */}
      <div style={{fontSize:13,fontWeight:700,margin:"14px 0 8px"}}>🧭 Menu de navigation</div>
      {site.nav.map((n,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,marginBottom:4}}>
        <span style={{fontSize:10,color:"var(--muted)",cursor:"grab"}}>☰</span>
        <span style={{flex:1,fontSize:12,fontWeight:600}}>{n.label}</span>
        <span style={{fontSize:10,color:"var(--muted)"}}>→ {n.page}</span>
      </div>)}

      <button onClick={()=>toast.success("Configuration sauvegardée ✅")} style={{width:"100%",padding:12,borderRadius:12,border:"none",background:"#6366F1",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:14}}>💾 Sauvegarder</button>

      {/* Danger zone */}
      <div style={{marginTop:14,padding:14,border:"1px solid rgba(239,68,68,0.15)",borderRadius:14}}>
        <div style={{fontSize:13,fontWeight:700,color:"#EF4444",marginBottom:8}}>⚠️ Zone danger</div>
        <button onClick={()=>{setSite(s=>({...s,enabled:false}));toast.success("Site désactivé")}} style={{width:"100%",padding:10,borderRadius:12,border:"1px solid rgba(239,68,68,.15)",background:"transparent",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#EF4444"}}>Mettre le site hors ligne</button>
      </div>
    </>}

    </div>

    {/* ═══════════ PREVIEW MODAL ═══════════ */}
    {showPreview&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{width:"100%",maxWidth:340,background:"var(--card)",borderRadius:16,overflow:"hidden"}}>
        {/* Mini browser bar */}
        <div style={{padding:"8px 12px",background:"var(--light)",display:"flex",alignItems:"center",gap:8}}>
          <div style={{display:"flex",gap:4}}><div style={{width:8,height:8,borderRadius:4,background:"#EF4444"}}/><div style={{width:8,height:8,borderRadius:4,background:"#F59E0B"}}/><div style={{width:8,height:8,borderRadius:4,background:"#10B981"}}/></div>
          <div style={{flex:1,padding:"4px 10px",background:"var(--card)",borderRadius:8,fontSize:10,color:"var(--muted)"}}>{url}</div>
        </div>
        {/* Site preview */}
        <div style={{height:320,overflowY:"auto",padding:0}}>
          {/* Hero */}
          <div style={{height:120,background:theme.preview,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",color:"#fff",textAlign:"center",padding:16}}>
            <div style={{fontSize:14,fontWeight:800}}>{site.title}</div>
            <div style={{fontSize:10,opacity:.8,marginTop:4}}>{site.description}</div>
            <div style={{marginTop:8,padding:"5px 14px",borderRadius:8,background:"rgba(255,255,255,.2)",fontSize:10,fontWeight:600}}>Voir la collection</div>
          </div>
          {/* Nav */}
          <div style={{display:"flex",justifyContent:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
            {site.nav.map(n=><span key={n.label} style={{fontSize:10,fontWeight:600,color:"var(--text)"}}>{n.label}</span>)}
          </div>
          {/* Products mock */}
          <div style={{padding:12}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Nos produits</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[1,2,3,4].map(i=><div key={i} style={{height:60,background:"var(--light)",borderRadius:8}}/>)}
            </div>
          </div>
        </div>
      </div>
      <button onClick={()=>setShowPreview(false)} style={{marginTop:12,padding:"10px 24px",borderRadius:12,border:"none",background:"#6366F1",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Fermer la prévisualisation</button>
    </div>}
  </div>);
}

export default VWebsiteScr;
