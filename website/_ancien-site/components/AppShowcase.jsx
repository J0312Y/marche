import { IconShoppingBag, IconStore, IconTruck } from './Icons'

export default function AppShowcase() {
  const screens = [
    { label: 'Acheteur', icon: <IconShoppingBag size={28} color="#008060" />, desc: 'Catalogue, panier, commandes', bg: '#f0fdf4', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=400&fit=crop&q=80' },
    { label: 'Vendeur', icon: <IconStore size={28} color="#e8792b" />, desc: 'Dashboard, produits, stats', bg: '#fef3e2', img: 'https://images.unsplash.com/photo-1556740758-90de940521ec?w=300&h=400&fit=crop&q=80' },
    { label: 'Livreur', icon: <IconTruck size={28} color="#5c6ac4" />, desc: 'Livraisons, GPS, gains', bg: '#eef0fb', img: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=300&h=400&fit=crop&q=80' },
  ]

  return (
    <section className="section section-light">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-badge">Application mobile</span>
          <h2 className="section-title">Trois apps en une</h2>
          <p className="section-desc">
            Un seul telechargement, trois experiences. Changez de mode en un tap
            selon votre role : acheteur, vendeur ou livreur.
          </p>
        </div>

        <div className="app-showcase-grid reveal">
          {screens.map(s => (
            <div className="app-showcase-card" key={s.label}>
              <div className="app-showcase-phone" style={{ background: s.bg }}>
                <img src={s.img} alt={s.label} className="app-showcase-img" />
                <div className="app-showcase-overlay">
                  <div className="app-showcase-icon-wrap">{s.icon}</div>
                  <div className="app-showcase-mode">Mode</div>
                  <div className="app-showcase-label">{s.label}</div>
                </div>
              </div>
              <h4>{s.label}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="app-download reveal">
          <div className="app-download-text">
            <h3>Disponible sur Android</h3>
            <p>Telechargez l'app Lamuka Market et commencez a acheter, vendre ou livrer des aujourd'hui.</p>
          </div>
          <a href="#" className="btn btn-primary btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.227L6.29 8.29a1.5 1.5 0 000 2.591l11.233 6.064a1.5 1.5 0 002.227-1.296V3.523a1.5 1.5 0 00-2.227-1.296z"/></svg>
            Telecharger l'app
          </a>
        </div>
      </div>
    </section>
  )
}
