function DeliveryPolicyScr({onBack}){
  const sections=[
    {title:"🚚 Zones de livraison",items:[
      "Brazzaville : toutes les communes (Bacongo, Poto-Poto, Moungali, Ouenzé, Talangaï, Makélékélé, Mfilou, Djiri, Madibou)",
      "Pointe-Noire : centre-ville et communes environnantes",
      "Autres villes : bientôt disponible",
    ]},
    {title:"⏱️ Délais de livraison",items:[
      "Restaurants & pâtisseries : 30 minutes à 1 heure",
      "Boutiques & commerces (Brazzaville) : 1 à 3 jours ouvrés",
      "Boutiques & commerces (Pointe-Noire) : 3 à 5 jours ouvrés",
      "Pharmacies : dans l'heure (selon disponibilité)",
    ]},
    {title:"💰 Tarifs de livraison",items:[
      "Zone centre : 1 500 FCFA",
      "Zone périphérie : 2 500 FCFA",
      "Hors zone : 3 000 - 5 000 FCFA",
      "Gratuit pour les commandes de plus de 50 000 FCFA",
      "Restaurants : frais inclus ou offerts selon le commerce",
    ]},
    {title:"💵 Paiement à la livraison",items:[
      "Disponible pour toutes les commandes",
      "Payez en espèces directement au livreur",
      "Préparez le montant exact si possible",
      "Le livreur ne peut pas rendre plus de 5 000 FCFA de monnaie",
    ]},
    {title:"↩️ Politique de retour",items:[
      "Retour gratuit sous 7 jours après réception",
      "Le produit doit être dans son emballage d'origine",
      "Les articles alimentaires ne sont pas retournables (sauf défaut)",
      "Les services ne sont pas remboursables après exécution",
      "Photo du produit requise pour toute demande de retour",
    ]},
    {title:"💸 Remboursements",items:[
      "Choix entre crédit sur Wallet Lamuka (instantané) ou Mobile Money (24-48h)",
      "Un avoir (note de crédit) est émis séparément du reçu original",
      "Le reçu original n'est jamais modifié",
      "Délai de traitement : 3 à 5 jours ouvrés après validation",
      "Commande annulée avant expédition : remboursement intégral",
    ]},
  ];
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Livraison & Retours</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 16px 20px"}}>
      {sections.map((s,i)=><div key={i} style={{marginBottom:16}}>
        <div style={{fontSize:15,fontWeight:700,marginBottom:10}}>{s.title}</div>
        <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14}}>
          {s.items.map((item,j)=><div key={j} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:j<s.items.length-1?"1px solid var(--border)":"none",fontSize:12,color:"var(--sub)",lineHeight:1.5}}>
            <span style={{color:"#F97316",flexShrink:0}}>•</span><span>{item}</span>
          </div>)}
        </div>
      </div>)}
    </div>
  </div>);
}
export default DeliveryPolicyScr;
