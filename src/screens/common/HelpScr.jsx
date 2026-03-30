import { useState } from "react";

function HelpScr({onBack}){
  const [open,setOpen]=useState(null);
  const [tab,setTab]=useState("all");
  const cats=[
    ["all","Tout"],["orders","🛍️ Commandes"],["delivery","🚚 Livraison"],["payment","💳 Paiement"],["account","👤 Compte"],["vendor","🏪 Vendeur"],["driver","🛵 Livreur"]
  ];
  const faqs=[
    {q:"Comment passer une commande ?",a:"Parcourez les commerces et produits, ajoutez au panier, puis payez via Mobile Money (Airtel, MTN) ou en espèces à la livraison.",cat:"orders"},
    {q:"Comment suivre ma commande ?",a:"Allez dans Commandes → cliquez sur votre commande → Suivre ma livraison. Vous verrez la position du livreur en temps réel.",cat:"orders"},
    {q:"Puis-je annuler une commande ?",a:"Oui, avant l'expédition. Commandes → Détail → Annuler. Choisissez entre remboursement sur wallet ou Mobile Money.",cat:"orders"},
    {q:"Comment utiliser un code promo ?",a:"Au moment du checkout, cliquez sur 'Ajouter un coupon' et entrez votre code. La réduction sera appliquée automatiquement.",cat:"orders"},
    {q:"Quels sont les délais de livraison ?",a:"Boutiques : 1-3 jours ouvrés à Brazzaville, 3-5 jours à Pointe-Noire.\nRestaurants et pâtisseries : 30-60 min.\nSuivi en temps réel disponible.",cat:"delivery"},
    {q:"Combien coûte la livraison ?",a:"1 500 - 3 000 FCFA selon la distance. Gratuite pour les commandes de plus de 50 000 FCFA. Restaurants : frais inclus ou offerts.",cat:"delivery"},
    {q:"Le livreur ne trouve pas mon adresse ?",a:"Contactez le livreur via le chat ou le bouton d'appel dans le suivi de commande. Vous pouvez aussi partager votre position GPS.",cat:"delivery"},
    {q:"Quels moyens de paiement acceptés ?",a:"• Airtel Money (numéros 04/05)\n• MTN MoMo (numéros 06)\n• Kolo Pay (wallet intégré)\n• Cash à la livraison",cat:"payment"},
    {q:"Comment fonctionne le paiement cash ?",a:"Choisissez 'Cash à la livraison' au checkout. Payez directement au livreur en espèces. Préparez le montant exact si possible.",cat:"payment"},
    {q:"Comment obtenir un remboursement ?",a:"Après annulation, choisissez entre :\n• Wallet Lamuka (instantané)\n• Mobile Money (24-48h)\nVous recevrez un avoir (note de crédit) séparé du reçu original.",cat:"payment"},
    {q:"Comment créer mon compte ?",a:"Cliquez 'Créer un compte', entrez votre numéro (04/05/06), recevez un OTP par SMS, et complétez votre profil.",cat:"account"},
    {q:"Comment devenir vendeur ?",a:"Profil → Devenir commerçant. Choisissez votre plan (Starter gratuit, Pro ou Enterprise), remplissez le formulaire et soumettez vos documents.",cat:"vendor"},
    {q:"Quels documents pour devenir vendeur ?",a:"• Pièce d'identité (CNI ou passeport)\n• RCCM (Registre du Commerce)\n• Photo du commerce\nValidation sous 24-48h.",cat:"vendor"},
    {q:"Comment devenir livreur ?",a:"Profil → Devenir livreur. Frais d'inscription : 5 000 FCFA (unique). Commission : 15% par livraison + option Boost à 1 000 FCFA/jour.",cat:"driver"},
    {q:"Comment contacter le support ?",a:"• Email : support@lamuka.market\n• WhatsApp : +242 064 663 469\n• Chat IA Lamu dans l'app (24h/24)",cat:"account"},
  ];
  const shown=tab==="all"?faqs:faqs.filter(f=>f.cat===tab);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Centre d'aide</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 16px 10px"}}><div className="sbar">🔍 <input placeholder="Rechercher une question..."/></div></div>
    <div style={{display:"flex",gap:4,padding:"0 16px 12px",overflowX:"auto",scrollbarWidth:"none"}}>
      {cats.map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{padding:"6px 12px",borderRadius:10,border:"none",background:tab===k?"#F97316":"var(--light)",color:tab===k?"#fff":"var(--muted)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0,transition:"all .2s"}}>{l}</button>)}
    </div>
    <div style={{padding:"0 16px"}}>
      {shown.map((f,i)=><div key={i} style={{marginBottom:8,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden"}}>
        <div onClick={()=>setOpen(open===i?null:i)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:14,cursor:"pointer"}}>
          <span style={{fontSize:13,fontWeight:600,flex:1,paddingRight:10}}>{f.q}</span>
          <span style={{fontSize:14,color:"var(--muted)",transform:open===i?"rotate(45deg)":"none",transition:"transform .2s"}}>+</span>
        </div>
        {open===i&&<div style={{padding:"0 14px 14px",fontSize:12,color:"var(--sub)",lineHeight:1.7,whiteSpace:"pre-line",borderTop:"1px solid var(--border)",paddingTop:12}}>{f.a}</div>}
      </div>)}
    </div>
    <div style={{padding:16}}>
      <div style={{padding:14,background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:14}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>Besoin de plus d'aide ?</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>window.open("https://wa.me/242064663469","_blank")} style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#25D366",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💬 WhatsApp</button>
          <button onClick={()=>window.location.href="mailto:support@lamuka.market"} style={{flex:1,padding:10,borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>📧 Email</button>
        </div>
      </div>
    </div>
  </div>);
}

export default HelpScr;
