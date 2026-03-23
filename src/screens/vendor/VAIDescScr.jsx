import { useState } from "react";
import toast from "../../utils/toast";

function VAIDescScr({onBack}){
  const [productName,setProductName]=useState("");
  const [category,setCategory]=useState("");
  const [keywords,setKeywords]=useState("");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);

  const generate=async()=>{
    if(!productName.trim()){toast.error("Entrez un nom de produit");return}
    setLoading(true);setResult(null);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:"Tu es un expert e-commerce au Congo. Génère une description produit optimisée pour le marketplace Lamuka Market. Réponds UNIQUEMENT en JSON avec: {title, description, bulletPoints:[], seoTags:[]}. La description doit être en français, vendeuse, avec des emojis.",
          messages:[{role:"user",content:`Produit: ${productName}\nCatégorie: ${category||"Général"}\nMots-clés: ${keywords||"qualité, Congo, Brazzaville"}`}]
        })
      });
      const data=await res.json();
      const text=data.content?.[0]?.text||"";
      const clean=text.replace(/```json|```/g,"").trim();
      setResult(JSON.parse(clean));
    }catch{
      setResult({
        title:productName+" — Qualité Premium | Lamuka Market",
        description:`Découvrez ${productName}, disponible sur Lamuka Market ! 🛍️ Livraison rapide à Brazzaville et Pointe-Noire. Paiement sécurisé par Airtel Money et MTN MoMo. Qualité garantie avec retour possible sous 7 jours.`,
        bulletPoints:["✅ Livraison 1-3 jours","💳 Paiement Mobile Money","↩️ Retour 7 jours","⭐ Vendeur vérifié"],
        seoTags:["lamuka","congo","brazzaville",productName.toLowerCase()]
      });
    }
    setLoading(false);
  };

  const copyAll=()=>{
    if(!result)return;
    const text=`${result.title}\n\n${result.description}\n\n${result.bulletPoints?.join("\n")||""}\n\nTags: ${result.seoTags?.join(", ")||""}`;
    navigator.clipboard?.writeText(text);
    toast.success("📋 Copié !");
  };

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>🤖 IA Description</h2><div style={{width:38}}/></div>

    <div className="field"><label>Nom du produit *</label><input value={productName} onChange={e=>setProductName(e.target.value)} placeholder="Ex: Robe Wax Moderne, Galaxy A54..."/></div>
    <div className="field"><label>Catégorie</label><input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Mode, Électronique, Restaurant..."/></div>
    <div className="field"><label>Mots-clés (optionnel)</label><input value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="qualité, tendance, fait main..."/></div>

    <button onClick={generate} disabled={loading} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:15,fontWeight:700,cursor:loading?"wait":"pointer",fontFamily:"inherit"}}>{loading?"🤖 Génération en cours...":"🤖 Générer la description"}</button>

    {result&&<div style={{marginTop:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:14,fontWeight:700}}>Résultat</span>
        <button onClick={copyAll} style={{padding:"4px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>📋 Copier tout</button>
      </div>
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
        <div style={{fontSize:10,color:"var(--muted)",marginBottom:4}}>TITRE</div>
        <div style={{fontSize:14,fontWeight:700}}>{result.title}</div>
      </div>
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
        <div style={{fontSize:10,color:"var(--muted)",marginBottom:4}}>DESCRIPTION</div>
        <div style={{fontSize:13,lineHeight:1.6}}>{result.description}</div>
      </div>
      {result.bulletPoints?.length>0&&<div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
        <div style={{fontSize:10,color:"var(--muted)",marginBottom:4}}>POINTS FORTS</div>
        {result.bulletPoints.map((b,i)=><div key={i} style={{fontSize:12,padding:"4px 0"}}>{b}</div>)}
      </div>}
      {result.seoTags?.length>0&&<div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14}}>
        <div style={{fontSize:10,color:"var(--muted)",marginBottom:6}}>TAGS SEO</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{result.seoTags.map(t=><span key={t} style={{padding:"3px 8px",borderRadius:6,background:"rgba(249,115,22,0.06)",color:"#F97316",fontSize:10,fontWeight:600}}>#{t}</span>)}</div>
      </div>}
    </div>}
  </div>);
}
export default VAIDescScr;
