

function PrivacyScr({onBack}){
  const sections=[
    {title:"1. Données collectées",text:"Nous collectons les données nécessaires au fonctionnement du service : nom, numéro de téléphone, adresse email, adresse de livraison, historique de commandes et données de paiement Mobile Money."},
    {title:"2. Utilisation des données",text:"Vos données sont utilisées pour : traiter vos commandes, assurer la livraison, améliorer nos services, vous envoyer des notifications pertinentes et prévenir la fraude. Nous n'utilisons jamais vos données à des fins publicitaires tierces."},
    {title:"3. Partage des données",text:"Vos informations sont partagées uniquement avec : le commerçant (nom et adresse pour la livraison), le livreur (adresse et téléphone pour la livraison), nos prestataires de paiement Mobile Money. Nous ne vendons jamais vos données personnelles."},
    {title:"4. Sécurité",text:"Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles : chiffrement des données de paiement, authentification à deux facteurs, accès restreint aux données personnelles, audit régulier de sécurité."},
    {title:"5. Conservation des données",text:"Vos données sont conservées pendant la durée de votre utilisation du service et pendant 2 ans après la suppression de votre compte, conformément aux obligations légales en vigueur au Congo."},
    {title:"6. Vos droits",text:"Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à joeldytsina94@gmail.com."},
    {title:"7. Cookies et trackers",text:"L'application utilise des cookies techniques nécessaires au fonctionnement. Aucun cookie publicitaire ou de tracking tiers n'est utilisé."},
    {title:"8. Géolocalisation",text:"La géolocalisation est utilisée pour : afficher les commerces proches, permettre le suivi de livraison en temps réel, calculer les frais de livraison. Vous pouvez désactiver la géolocalisation dans les paramètres de votre appareil."},
    {title:"9. Modifications",text:"Cette politique peut être mise à jour. Toute modification significative sera notifiée via l'application. Dernière mise à jour : 1er Février 2026."},
    {title:"10. Contact DPO",text:"Pour toute question relative à la protection de vos données : joeldytsina94@gmail.com · WhatsApp : +242 064 663 469"},
  ];
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Politique de confidentialité</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 80px"}}>
      <div style={{padding:14,background:"rgba(16,185,129,0.04)",border:"1px solid rgba(16,185,129,0.1)",borderRadius:14,marginBottom:16}}><div style={{fontSize:12,color:"#10B981",fontWeight:600}}>🔐 Politique de confidentialité</div><div style={{fontSize:11,color:"#908C82",marginTop:4}}>Dernière mise à jour : 1er Février 2026</div></div>
      {sections.map((s,i)=><div key={i} style={{marginBottom:16}}>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:6}}>{s.title}</h4>
        <p style={{fontSize:13,color:"#5E5B53",lineHeight:1.7}}>{s.text}</p>
      </div>)}
    </div>
  </div>);
}

/* ═══════════════════════════
   APP SHELL + ROUTER
   ═══════════════════════════ */

export default PrivacyScr;
