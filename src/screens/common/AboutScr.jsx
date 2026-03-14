

function AboutScr({onBack}){
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>À propos</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:56,marginBottom:8}}>🛒</div><h2 style={{fontSize:22,fontWeight:700}}>Lamuka Marketplace</h2><p style={{fontSize:13,color:"#908C82"}}>Version 1.0.0</p></div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}><p style={{fontSize:14,color:"#5E5B53",lineHeight:1.7}}>Lamuka est une plateforme multi-commerce congolaise développée par <b>Lamuka Tech</b>. Notre mission : connecter les commerces locaux — restaurants, boutiques, pharmacies, pâtisseries, supermarchés et services — aux consommateurs avec livraison rapide et paiement Mobile Money.</p></div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
      {[["👨‍💻","Développeur","Joeldy Tsina"],["📍","Localisation","Brazzaville, Congo 🇨🇬"],["📧","Email","joeldytsina94@gmail.com"],["📱","WhatsApp","+242 064 663 469"],["🌐","GitHub","github.com/J0312Y"]].map(([i,l,v])=><div key={l} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #F5F4F1",fontSize:13}}><span>{i}</span><span style={{color:"#908C82"}}>{l}</span><span style={{marginLeft:"auto",fontWeight:600}}>{v}</span></div>)}
    </div>
    <p style={{textAlign:"center",fontSize:12,color:"#908C82"}}>Fait avec ❤️ au Congo 🇨🇬</p>
  </div>);
}

/* 30 ── VENDOR PROFILE ── */

export default AboutScr;
