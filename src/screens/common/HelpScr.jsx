import { useState } from "react";

function HelpScr({onBack}){
  const [open,setOpen]=useState(null);
  const faqs=[{q:"Comment passer une commande ?",a:"Parcourez les commerces et produits, ajoutez au panier, puis payez via Mobile Money (Airtel, MTN)."},{q:"Quels sont les délais de livraison ?",a:"1-3 jours ouvrés à Brazzaville, 3-5 jours à Pointe-Noire. Restos et pâtisseries : 30-60 min. Suivi en temps réel disponible."},{q:"Comment ouvrir mon commerce ?",a:"Profil → Devenir commerçant. Choisissez votre type (restaurant, boutique, pharmacie...), remplissez le formulaire et soumettez vos documents."},{q:"Comment contacter le support ?",a:"Email : joeldytsina94@gmail.com\nWhatsApp : +242 064 663 469\nOu via le chat Lamu AI sur notre site."},{q:"Puis-je annuler une commande ?",a:"Oui, avant l'expédition. Depuis Commandes → Détail → Annuler. Le remboursement est effectué sous 48h."}];
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Centre d'aide</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 14px"}}><div className="sbar">🔍 <input placeholder="Rechercher une question..."/></div></div>
    {faqs.map((f,i)=><div key={i} className="faq-item" onClick={()=>setOpen(open===i?null:i)}>
      <div className="faq-q">{f.q}<span className={open===i?"open":""}>+</span></div>
      {open===i&&<div className="faq-a">{f.a}</div>}
    </div>)}
    <div style={{padding:16}}><div className="info-box blue"><span>💬</span><span>Besoin d'aide ? Contactez-nous sur WhatsApp au +242 064 663 469</span></div></div>
  </div>);
}

/* 29 ── ABOUT ── */

export default HelpScr;
