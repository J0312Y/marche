import { IconGlobe, IconSmartphone, IconMessageCircle, IconStorefront } from './Icons'

export default function SellEverywhere() {
  const channels = [
    {
      icon: <IconGlobe size={22} />,
      title: 'Boutique en ligne',
      desc: 'Creez une vitrine complete avec catalogue, recherche, filtres, et panier. Vos clients commandent 24h/24.',
      color: '#008060',
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop&q=80',
    },
    {
      icon: <IconSmartphone size={22} />,
      title: 'Application mobile',
      desc: 'Une app Android native avec notifications push, scan QR, et mode hors-ligne. Disponible partout.',
      color: '#5c6ac4',
      img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&q=80',
    },
    {
      icon: <IconMessageCircle size={22} />,
      title: 'Reseaux sociaux',
      desc: 'Partagez vos produits sur WhatsApp, Facebook et Instagram. Vos clients achetent en un clic.',
      color: '#e8792b',
      img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop&q=80',
    },
    {
      icon: <IconStorefront size={22} />,
      title: 'En personne',
      desc: 'Gerez aussi vos ventes physiques. Stock synchronise entre votre boutique et votre point de vente.',
      color: '#b7416e',
      img: 'https://images.unsplash.com/photo-1556740758-90de940521ec?w=400&h=250&fit=crop&q=80',
    },
  ]

  return (
    <section className="section section-gray" id="channels">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-badge">Vendez partout</span>
          <h2 className="section-title">Vendez la ou sont vos clients</h2>
          <p className="section-desc">
            En ligne, sur mobile, sur les reseaux sociaux ou en personne — gerez tous
            vos canaux de vente depuis une seule plateforme.
          </p>
        </div>

        <div className="channels-grid">
          {channels.map((c, i) => (
            <div className={`channel-card reveal reveal-d${i + 1}`} key={c.title}>
              <div className="channel-card-img">
                <img src={c.img} alt={c.title} />
              </div>
              <div className="channel-card-body">
                <div className="channel-icon" style={{ background: `${c.color}12`, color: c.color }}>
                  {c.icon}
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <a href="#" className="channel-link" style={{ color: c.color }}>
                  En savoir plus →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
