

function AboutScr({onBack}){
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>À propos</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:24}}><div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px"}}><svg width="40" height="40" viewBox="0 0 64 64" fill="none"><path d="M16 16h5l6 26h16l6-20H24" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="28" cy="50" r="3.5" fill="#fff"/><circle cx="42" cy="50" r="3.5" fill="#fff"/></svg></div><h2 style={{fontSize:22,fontWeight:700}}>Lamuka Marketplace</h2><p style={{fontSize:13,color:"var(--muted)"}}>Version 1.0.0</p></div>
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}><p style={{fontSize:14,color:"var(--sub)",lineHeight:1.7}}>Lamuka est une plateforme multi-commerce congolaise développée par <b>Lamuka Tech</b>. Notre mission : connecter les commerces locaux — restaurants, boutiques, pharmacies, pâtisseries, supermarchés et services — aux consommateurs avec livraison rapide et paiement Mobile Money.</p></div>
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      {[["👨‍💻","Développeur","Joeldy Tsina"],["📍","Localisation","Brazzaville, Congo 🇨🇬"],["📧","Email","joeldytsina94@gmail.com"],["📱","WhatsApp","+242 064 663 469"],["🌐","GitHub","github.com/J0312Y"]].map(([i,l,v])=><div key={l} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)",fontSize:13}}><span>{i}</span><span style={{color:"var(--muted)"}}>{l}</span><span style={{marginLeft:"auto",fontWeight:600}}>{v}</span></div>)}
    </div>
    <p style={{textAlign:"center",fontSize:12,color:"var(--muted)"}}>Fait avec ❤️ au Congo 🇨🇬</p>
  </div>);
}

/* 30 ── VENDOR PROFILE ── */

export default AboutScr;
