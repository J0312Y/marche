

function TermsScr({onBack}){
  const sections=[
    {title:"1. Objet",text:"Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme Lamuka Marketplace, éditée par Lamuka Tech, Brazzaville, République du Congo."},
    {title:"2. Inscription",text:"L'accès à certains services nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations exactes et à jour. Le compte est personnel et non transférable."},
    {title:"3. Services proposés",text:"Lamuka met en relation des acheteurs, des commerçants (restaurants, boutiques, pharmacies, pâtisseries, supermarchés, services) et des livreurs. La plateforme facilite les transactions mais n'est pas partie prenante aux contrats de vente entre commerçants et acheteurs."},
    {title:"4. Commandes et paiements",text:"Les prix sont affichés en Francs CFA (FCFA). Les paiements sont effectués via Mobile Money (Airtel Money, MTN MoMo) ou Kolo Pay. Toute commande validée engage l'acheteur."},
    {title:"5. Livraison",text:"Les délais de livraison sont indicatifs : 1-3 jours ouvrés à Brazzaville, 3-5 jours à Pointe-Noire. Le livreur doit confirmer la remise du colis via code PIN, photo ou signature."},
    {title:"6. Retours et remboursements",text:"Le retour est accepté sous 7 jours après réception si le produit est en état d'origine. Le remboursement est effectué sous 48h via le même moyen de paiement. Les frais de retour sont à la charge de l'acheteur sauf produit défectueux."},
    {title:"7. Responsabilités du commerçant",text:"Le commerçant s'engage à fournir des produits/services conformes à leur description, à respecter les délais de préparation et à maintenir un taux de satisfaction acceptable. Lamuka se réserve le droit de suspendre un compte en cas de manquements répétés."},
    {title:"8. Commissions",text:"Lamuka prélève une commission sur chaque vente : Plan Starter 8%, Plan Pro 4%, Plan Enterprise 2%. Les commissions sont déduites automatiquement avant versement au vendeur."},
    {title:"9. Propriété intellectuelle",text:"L'ensemble des éléments de la plateforme (logo, design, code, contenus) sont la propriété de Lamuka Tech. Toute reproduction est interdite sans autorisation préalable."},
    {title:"10. Modification des CGU",text:"Lamuka Tech se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront notifiés de tout changement majeur. La poursuite de l'utilisation vaut acceptation."},
    {title:"11. Contact",text:"Pour toute question : joeldytsina94@gmail.com · WhatsApp : +242 064 663 469"},
  ];
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Conditions générales</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 80px"}}>
      <div style={{padding:14,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:14,marginBottom:16}}><div style={{fontSize:12,color:"#6366F1",fontWeight:600}}>📋 Conditions Générales d'Utilisation</div><div style={{fontSize:11,color:"#908C82",marginTop:4}}>Dernière mise à jour : 1er Février 2026</div></div>
      {sections.map((s,i)=><div key={i} style={{marginBottom:16}}>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:6}}>{s.title}</h4>
        <p style={{fontSize:13,color:"#5E5B53",lineHeight:1.7}}>{s.text}</p>
      </div>)}
    </div>
  </div>);
}

export default TermsScr;
