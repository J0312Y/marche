import { useState } from "react";
import toast from "../../utils/toast";

function VImportScr({onBack}){
  const [tab,setTab]=useState("import");
  const [file,setFile]=useState(null);
  const [importing,setImporting]=useState(false);
  const [result,setResult]=useState(null);

  const doImport=()=>{
    setImporting(true);
    setTimeout(()=>{
      setImporting(false);
      setResult({total:47,success:45,errors:2,errorLines:[12,34]});
      toast.success("45 produits importés ✅");
    },2000);
  };

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>📤 Import / Export</h2><div style={{width:38}}/></div>

    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {[["import","📥 Importer"],["export","📤 Exporter"]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:10,borderRadius:10,border:tab===k?"2px solid #F97316":"1px solid var(--border)",background:tab===k?"rgba(249,115,22,0.06)":"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:tab===k?"#F97316":"var(--text)"}}>{l}</button>)}
    </div>

    {tab==="import"?<>
      <div onClick={()=>document.getElementById("csv-upload")?.click()} style={{padding:30,background:"var(--card)",border:"2px dashed var(--border)",borderRadius:16,textAlign:"center",cursor:"pointer",marginBottom:14}}>
        <div style={{fontSize:36,marginBottom:8}}>📄</div>
        <div style={{fontSize:14,fontWeight:600}}>{file?file.name:"Choisir un fichier CSV"}</div>
        <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>Format: nom, prix, catégorie, stock, description</div>
        <input id="csv-upload" type="file" accept=".csv,.xlsx" style={{display:"none"}} onChange={e=>setFile(e.target.files?.[0]||null)}/>
      </div>

      <div style={{padding:12,background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.12)",borderRadius:12,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>📋 Format CSV attendu</div>
        <div style={{fontSize:10,color:"var(--muted)",fontFamily:"monospace",lineHeight:1.6}}>
          nom,prix,categorie,stock,description<br/>
          "Galaxy A54",185000,"Électronique",15,"Samsung..."<br/>
          "Robe Wax",25000,"Mode",8,"Robe en wax..."
        </div>
      </div>

      {file&&<button onClick={doImport} disabled={importing} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{importing?"⏳ Import en cours...":"📥 Importer les produits"}</button>}

      {result&&<div style={{marginTop:14,padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>Résultat de l'import</div>
        <div style={{display:"flex",gap:8}}>
          <div style={{flex:1,padding:10,textAlign:"center",background:"rgba(16,185,129,0.06)",borderRadius:10}}><div style={{fontSize:18,fontWeight:700,color:"#10B981"}}>{result.success}</div><div style={{fontSize:10,color:"var(--muted)"}}>Importés</div></div>
          <div style={{flex:1,padding:10,textAlign:"center",background:"rgba(239,68,68,0.06)",borderRadius:10}}><div style={{fontSize:18,fontWeight:700,color:"#EF4444"}}>{result.errors}</div><div style={{fontSize:10,color:"var(--muted)"}}>Erreurs</div></div>
        </div>
        {result.errors>0&&<div style={{fontSize:11,color:"#EF4444",marginTop:8}}>Lignes en erreur: {result.errorLines.join(", ")}</div>}
      </div>}
    </>:<>
      <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Exporter mes produits</div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:12}}>Téléchargez tous vos produits au format CSV</div>
        <button onClick={()=>toast.success("Export CSV téléchargé 📥")} style={{width:"100%",padding:12,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📤 Exporter en CSV</button>
      </div>
      <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Exporter les commandes</div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:12}}>Historique de toutes vos commandes</div>
        <button onClick={()=>toast.success("Export commandes téléchargé 📥")} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>📤 Exporter les commandes</button>
      </div>
    </>}
  </div>);
}
export default VImportScr;
