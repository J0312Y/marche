export default function Trust() {
  const partners = [
    { name: 'Airtel Money', color: '#ed1c24' },
    { name: 'MTN MoMo', color: '#ffcc00' },
    { name: 'Kolo Pay', color: '#008060' },
    { name: 'Vodacom', color: '#e60000' },
    { name: 'DHL Congo', color: '#d40511' },
  ]

  return (
    <section className="trust">
      <p className="trust-label">Méthodes de paiement & partenaires</p>
      <div className="trust-grid">
        {partners.map(p => (
          <div className="trust-item" key={p.name}>
            <span className="trust-dot" style={{ background: p.color }} />
            {p.name}
          </div>
        ))}
      </div>
    </section>
  )
}
