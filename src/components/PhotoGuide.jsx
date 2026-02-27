import { useState } from "react";

/**
 * Interactive photo guide for vendors
 * Shows best practices with visual examples
 */
const TIPS = [
  {
    title: "Fond uni & clair",
    good: "Produit sur fond blanc ou clair, bien détaché",
    bad: "Fond encombré, autres objets visibles",
    icon: "⬜",
    goodEx: "✅",
    badEx: "❌",
    detail: "Placez votre produit sur un drap blanc, une feuille A3, ou un mur clair. Le fond blanc fait ressortir le produit et inspire confiance.",
  },
  {
    title: "Lumière naturelle",
    good: "Photo près d'une fenêtre, lumière douce",
    bad: "Flash direct, ombres dures, photo sombre",
    icon: "☀️",
    goodEx: "✅",
    badEx: "❌",
    detail: "Photographiez près d'une fenêtre le jour. Évitez le flash du téléphone qui crée des reflets. La lumière naturelle donne les meilleurs résultats.",
  },
  {
    title: "Cadrage centré",
    good: "Produit au centre, rempli 80% du cadre",
    bad: "Produit petit et perdu dans l'image",
    icon: "🎯",
    goodEx: "✅",
    badEx: "❌",
    detail: "Le produit doit occuper la majorité de l'image. Approchez-vous suffisamment. Laissez un petit espace autour pour respirer.",
  },
  {
    title: "Netteté parfaite",
    good: "Image nette, détails visibles",
    bad: "Image floue, bougée, pixelisée",
    icon: "🔍",
    goodEx: "✅",
    badEx: "❌",
    detail: "Posez votre téléphone ou stabilisez vos mains. Tapez sur le produit à l'écran pour faire la mise au point. Évitez de zoomer.",
  },
  {
    title: "Plusieurs angles",
    good: "Face, côté, dessus, détails, porté/en situation",
    bad: "Une seule photo de face",
    icon: "📐",
    goodEx: "✅",
    badEx: "❌",
    detail: "3 à 5 photos minimum : vue principale, profil, détails (texture, étiquette), et si possible en situation d'utilisation.",
  },
];

const RULES_BY_TYPE = {
  boutique: { title:"Mode & Boutique", rules:["Fond blanc obligatoire","Produit seul, sans mannequin si possible","3 photos min: face, dos, détail","Tailles visibles si vêtement"], icon:"👗" },
  restaurant: { title:"Restaurant", rules:["Vue plongeante (du dessus)","Assiette complète avec accompagnements","Lumière chaude naturelle","Pas de filtres Instagram excessifs"], icon:"🍽️" },
  patisserie: { title:"Pâtisserie", rules:["Gros plan appétissant","Fond neutre (bois, marbre, blanc)","Montrer la texture et les couches","Photo de la boîte si livraison"], icon:"🧁" },
  pharmacie: { title:"Pharmacie", rules:["Photo nette du packaging","Texte du produit lisible","Fond blanc uniquement","Pas de médicaments hors boîte"], icon:"💊" },
  supermarche: { title:"Supermarché", rules:["Fond blanc, produit face caméra","Étiquette/marque visible","Photo du poids/contenu","Lot groupé si pack"], icon:"🛒" },
  service: { title:"Service", rules:["Photo avant/après si pertinent","Photo de l'équipe au travail","Résultat final visible","Environnement propre"], icon:"🔧" },
};

function PhotoGuide({ onClose, shopType="boutique" }){
  const [tab,setTab]=useState(0); // 0=tips, 1=type rules
  const typeRules = RULES_BY_TYPE[shopType] || RULES_BY_TYPE.boutique;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:50,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:420,maxHeight:"88vh",overflow:"auto",animation:"fadeIn .25s ease"}}>
        {/* Header */}
        <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:2,paddingBottom:16,borderBottom:"1px solid #F5F4F1"}}>
          <h3 style={{fontSize:17,fontWeight:700}}>📸 Guide photo vendeur</h3>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,padding:"12px 20px 0",borderBottom:"1px solid #F5F4F1"}}>
          {["Conseils généraux",`${typeRules.icon} ${typeRules.title}`].map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{
              flex:1,padding:"10px 0",border:"none",background:"none",fontSize:12,fontWeight:600,
              color:tab===i?"#6366F1":"#908C82",borderBottom:tab===i?"2px solid #6366F1":"2px solid transparent",
              cursor:"pointer",fontFamily:"inherit",transition:"all .2s"
            }}>{t}</button>
          ))}
        </div>

        <div style={{padding:20}}>
          {tab===0 ? (
            /* General tips */
            <div>
              <p style={{fontSize:12,color:"#908C82",marginBottom:16,lineHeight:1.6}}>
                De bonnes photos augmentent vos ventes de <b style={{color:"#10B981"}}>3x</b>. Suivez ces conseils pour des résultats professionnels.
              </p>
              {TIPS.map((tip,i)=>(
                <div key={i} style={{marginBottom:16,padding:14,background:"#FAFAF8",borderRadius:14,border:"1px solid #F0EFEC"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:22}}>{tip.icon}</span>
                    <h4 style={{fontSize:14,fontWeight:700}}>{tip.title}</h4>
                  </div>
                  <div style={{display:"flex",gap:8,marginBottom:8}}>
                    <div style={{flex:1,padding:8,borderRadius:8,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.15)",fontSize:11}}>
                      <div style={{fontWeight:700,color:"#10B981",marginBottom:2}}>✅ BON</div>
                      {tip.good}
                    </div>
                    <div style={{flex:1,padding:8,borderRadius:8,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.12)",fontSize:11}}>
                      <div style={{fontWeight:700,color:"#EF4444",marginBottom:2}}>❌ ÉVITER</div>
                      {tip.bad}
                    </div>
                  </div>
                  <p style={{fontSize:11,color:"#5E5B53",lineHeight:1.5,margin:0}}>{tip.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            /* Type-specific rules */
            <div>
              <div style={{textAlign:"center",padding:"16px 0",marginBottom:16}}>
                <div style={{fontSize:48,marginBottom:8}}>{typeRules.icon}</div>
                <h3 style={{fontSize:16,fontWeight:700}}>{typeRules.title}</h3>
                <p style={{fontSize:12,color:"#908C82",marginTop:4}}>Règles spécifiques pour vos photos</p>
              </div>
              {typeRules.rules.map((rule,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:i%2===0?"#FAFAF8":"#fff",borderRadius:12,marginBottom:6}}>
                  <div style={{width:28,height:28,borderRadius:8,background:"rgba(99,102,241,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#6366F1",flexShrink:0}}>{i+1}</div>
                  <span style={{fontSize:13,fontWeight:500}}>{rule}</span>
                </div>
              ))}
              <div style={{marginTop:16,padding:14,background:"rgba(99,102,241,0.04)",borderRadius:14,border:"1px solid rgba(99,102,241,0.12)"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#6366F1",marginBottom:4}}>💡 Astuce Pro</div>
                <p style={{fontSize:11,color:"#5E5B53",margin:0,lineHeight:1.5}}>
                  {shopType==="restaurant"||shopType==="patisserie"
                    ?"Prenez la photo juste après la préparation quand le plat est encore chaud et appétissant. L'éclairage naturel du matin ou de l'après-midi donne les meilleurs résultats."
                    :"Investissez dans une boîte à lumière (lightbox) à partir de 5 000 FCFA — elle transformera vos photos produit en images professionnelles."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{padding:"0 20px 20px",position:"sticky",bottom:0,background:"#fff"}}>
          <button onClick={onClose} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#6366F1",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            👍 J'ai compris, ajouter mes photos
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhotoGuide;
