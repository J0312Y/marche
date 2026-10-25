export default function Stats() {
  const stats = [
    { num: '3 modes', desc: 'Acheteur, vendeur, livreur dans une seule app' },
    { num: '100%', desc: 'Cash a la livraison — zero barriere de paiement' },
    { num: '24/7', desc: 'Support IA et notifications en temps reel' },
    { num: '0 FCFA', desc: 'Pour commencer — gratuit, sans engagement' },
  ]

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-band reveal">
          {stats.map(s => (
            <div className="stat-block" key={s.desc}>
              <div className="stat-block-num">{s.num}</div>
              <div className="stat-block-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
