import { useState } from "react";

function OnboardingScr({onDone}){
  const [s,setS]=useState(0);
  const slides=[
    {img:"🛍️",title:"Tout le Congo en une app",desc:"Restos, boutiques, pharmacies, pâtisseries, supermarchés et services — commandez et faites-vous livrer à Brazzaville et Pointe-Noire."},
    {img:"🍽️",title:"Commandez à manger, achetez, réservez",desc:"Des milliers de commerces vérifiés : restaurants, boutiques de mode, boulangeries, pressing et plus encore."},
    {img:"💳",title:"Paiement Mobile Money",desc:"Payez facilement avec Airtel Money ou MTN MoMo. Sécurisé via Kolo Pay."},
  ];
  return(
    <div className="onb">
      <div className="onb-img">{slides[s].img}</div>
      <h2>{slides[s].title}</h2>
      <p>{slides[s].desc}</p>
      <div className="onb-dots">{slides.map((_,i)=><div key={i} className={`onb-dot ${i===s?"on":""}`}/>)}</div>
      <button className="btn-primary" onClick={()=>s<2?setS(s+1):onDone()}>{s<2?"Suivant":"Commencer"}</button>
      {s<2&&<button className="btn-outline" style={{marginTop:10}} onClick={onDone}>Passer</button>}
    </div>
  );
}

/* 3 ── LOGIN ── */

export default OnboardingScr;
