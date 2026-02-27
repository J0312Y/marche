import { useState } from "react";

function VAddDriverScr({onBack}){
  const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:20,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>✅</div><h3 style={{fontSize:18,fontWeight:700}}>Invitation envoyée !</h3><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Le livreur recevra un SMS et une notification pour rejoindre votre réseau.</p><button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour</button></div></div>);
  return(<><div className="appbar"><button onClick={onBack}>←</button><h2>Ajouter un livreur</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div style={{textAlign:"center",marginBottom:20}}><div style={{width:64,height:64,borderRadius:18,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:32}}>🛵</div><p style={{fontSize:13,color:"#908C82"}}>Invitez un livreur à rejoindre votre réseau de livraison</p></div>
      <div className="field"><label>Nom complet</label><input placeholder="Ex: Patrick Moukala"/></div>
      <div className="field"><label>Téléphone</label><input placeholder="+242 06X XXX XXX" type="tel"/></div>
      <div className="field"><label>Email (optionnel)</label><input placeholder="livreur@email.com" type="email"/></div>
      <div className="field"><label>Type de véhicule</label><select><option value="moto">🛵 Moto / Scooter</option><option value="voiture">🚗 Voiture</option><option value="velo">🚲 Vélo</option></select></div>
      <div className="field"><label>Zone de livraison</label><select><option>Brazzaville Sud</option><option>Brazzaville Centre</option><option>Brazzaville Nord</option><option>Pointe-Noire</option></select></div>
      <div className="info-box blue" style={{marginTop:10}}><span>📱</span><span>Le livreur recevra un SMS d'invitation avec un lien pour créer son compte Lamuka.</span></div>
      <div style={{paddingTop:24,paddingBottom:16}}><button className="btn-primary" onClick={()=>setDone(true)}>📤 Envoyer l'invitation</button></div>
    </div>
  </>);
}

export default VAddDriverScr;
