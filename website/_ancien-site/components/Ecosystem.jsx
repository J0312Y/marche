import { IconCode, IconSmartphone, IconPalette } from './Icons'

export default function Ecosystem() {
  const cards = [
    {
      icon: <IconCode size={24} color="#008060" />,
      title: 'API REST complete',
      desc: 'Integrez Lamuka Market avec vos outils existants via notre API RESTful documentee.',
      link: 'Voir la documentation',
    },
    {
      icon: <IconSmartphone size={24} color="#5c6ac4" />,
      title: 'App native Android',
      desc: 'Application Capacitor avec notifications push, GPS, camera et mode hors-ligne.',
      link: 'En savoir plus',
    },
    {
      icon: <IconPalette size={24} color="#e8792b" />,
      title: 'Themes personnalisables',
      desc: 'Personnalisez votre boutique avec des themes, couleurs et logos a votre image.',
      link: 'Voir les themes',
    },
  ]

  return (
    <section className="section section-light" id="ecosystem">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-badge">Plateforme ouverte</span>
          <h2 className="section-title">Extensible. Personnalisable. Ouvert.</h2>
          <p className="section-desc">
            API documentee, app native, et outils de personnalisation.
            Lamuka Market s'adapte a votre business, pas l'inverse.
          </p>
        </div>

        <div className="eco-grid">
          {cards.map((c, i) => (
            <div className={`eco-card reveal reveal-d${i + 1}`} key={c.title}>
              <div className="eco-icon-wrap">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <a href="#" className="eco-link">{c.link} →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
