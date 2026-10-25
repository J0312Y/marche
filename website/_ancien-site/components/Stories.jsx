export default function Stories() {
  const stories = [
    {
      name: 'Marie K.',
      role: 'Vendeuse de mode',
      location: 'Bacongo, Brazzaville',
      quote: 'Grace a Lamuka Market, j\'ai pu lancer ma boutique en ligne en une journee. Mes ventes ont triple en 3 mois.',
      stat: '3x',
      statLabel: 'ventes en 3 mois',
      img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&q=80',
      coverImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=300&fit=crop&q=80',
    },
    {
      name: 'Patrick M.',
      role: 'Gerant de restaurant',
      location: 'Centre-ville, Brazzaville',
      quote: 'Le dashboard vendeur me permet de voir mes commandes et mon chiffre d\'affaires en temps reel. C\'est un game changer.',
      stat: '120+',
      statLabel: 'commandes / mois',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
      coverImg: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop&q=80',
    },
    {
      name: 'Grace L.',
      role: 'Livreuse',
      location: 'Poto-Poto, Brazzaville',
      quote: 'Je gere mes livraisons depuis mon telephone. Le GPS integre et le chat avec les clients rendent tout plus simple.',
      stat: '25+',
      statLabel: 'livraisons / semaine',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80',
      coverImg: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=600&h=300&fit=crop&q=80',
    },
  ]

  return (
    <section className="section section-light" id="stories">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-badge">Temoignages</span>
          <h2 className="section-title">Des entrepreneurs aux grands commerces</h2>
          <p className="section-desc">
            Des commercants de Brazzaville utilisent Lamuka Market pour lancer, gerer
            et developper leur activite. Voici leurs histoires.
          </p>
        </div>

        <div className="stories-grid">
          {stories.map((s, i) => (
            <div className={`story-card reveal reveal-d${i + 1}`} key={s.name}>
              <div className="story-top">
                <img src={s.coverImg} alt="" className="story-cover-img" />
                <div className="story-stat-overlay">
                  <span className="story-stat-num">{s.stat}</span>
                  <span className="story-stat-label">{s.statLabel}</span>
                </div>
              </div>
              <div className="story-body">
                <p className="story-quote">"{s.quote}"</p>
                <div className="story-author">
                  <img src={s.img} alt={s.name} className="story-avatar" />
                  <div>
                    <div className="story-name">{s.name}</div>
                    <div className="story-role">{s.role} — {s.location}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
