import { useState } from "react";

function DrHelpScr({onBack}){
  const [open,setOpen]=useState(null);
  const faqs=[
    {q:"Comment accepter une livraison ?",a:"Quand une nouvelle demande apparaît sur le dashboard, appuyez sur 'Accepter'. Vous avez 60 secondes pour répondre."},
    {q:"Comment confirmer la livraison ?",a:"Une fois arrivé, appuyez sur 'Confirmer livraison'. Choisissez la méthode : Code PIN du client, Photo du colis, ou Signature."},
    {q:"Quand suis-je payé ?",a:"Les gains sont versés chaque lundi sur votre Mobile Money (Airtel ou MTN). Les pourboires sont ajoutés automatiquement."},
    {q:"Comment contacter le commerce ou le client ?",a:"Depuis la livraison active, utilisez les boutons 💬 Message ou 📞 Appeler pour joindre le commerce ou le client."},
    {q:"Comment changer de zone ?",a:"Profil → Zones actives → Activez/désactivez les zones où vous souhaitez recevoir des livraisons."},
    {q:"Comment signaler un problème ?",a:"Contactez le support via WhatsApp au +242 064 663 469 ou envoyez un email à joeldytsina94@gmail.com."},
  ];
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Aide & Support</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 14px"}}><div className="sbar">🔍 <input placeholder="Rechercher..."/></div></div>
    {faqs.map((f,i)=><div key={i} className="faq-item" onClick={()=>setOpen(open===i?null:i)}><div className="faq-q">{f.q}<span className={open===i?"open":""}>+</span></div>{open===i&&<div className="faq-a">{f.a}</div>}</div>)}
    <div style={{padding:20}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Contacter le support</div>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1,padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,textAlign:"center",cursor:"pointer"}}><div style={{fontSize:24,marginBottom:4}}>💬</div><div style={{fontSize:12,fontWeight:600}}>WhatsApp</div><div style={{fontSize:11,color:"#908C82"}}>+242 064 663 469</div></div>
        <div style={{flex:1,padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,textAlign:"center",cursor:"pointer"}}><div style={{fontSize:24,marginBottom:4}}>📧</div><div style={{fontSize:12,fontWeight:600}}>Email</div><div style={{fontSize:11,color:"#908C82"}}>joeldytsina94@gmail.com</div></div>
      </div>
    </div>
  </div>);
}

/* ═══ LEGAL SCREENS ═══ */

export default DrHelpScr;
