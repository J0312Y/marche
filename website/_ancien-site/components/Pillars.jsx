import { IconShoppingBag, IconStore, IconTruck, IconCheck } from './Icons'

export default function Pillars() {
  const cards = [
    {
      icon: <IconShoppingBag size={22} color="#008060" />,
      cls: 'buyer',
      title: 'Pour les Acheteurs',
      desc: 'Decouvrez des milliers de produits, commandez et payez a la livraison.',
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=300&fit=crop&q=80',
      features: [
        'Catalogue avec recherche intelligente & filtres',
        'Paiement a la livraison — cash uniquement',
        'Suivi GPS de livraison en direct',
        'Chat avec vendeur & livreur',
        'Programme de fidelite & parrainage',
        'Comparaison de produits',
        'Wishlist & alertes prix',
        'Avis & notes sur les produits',
      ],
    },
    {
      icon: <IconStore size={22} color="#e8792b" />,
      cls: 'vendor',
      title: 'Pour les Vendeurs',
      desc: 'Gerez votre boutique avec un dashboard puissant. Ventes, stocks, promos — tout y est.',
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop&q=80',
      features: [
        'Dashboard avec KPIs en temps reel',
        'Gestion multi-boutiques (Enterprise)',
        'Promotions & coupons automatises',
        'Import produits en masse (CSV)',
        'Analytics & rapports de ventes',
        'Descriptions produits generees par IA',
        'Website builder & themes',
        'Gestion des retours & litiges',
      ],
    },
    {
      icon: <IconTruck size={22} color="#5c6ac4" />,
      cls: 'driver',
      title: 'Pour les Livreurs',
      desc: 'Acceptez des livraisons, naviguez avec GPS, gerez vos revenus et retraits.',
      img: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=600&h=300&fit=crop&q=80',
      features: [
        'Dashboard des gains quotidiens',
        'Navigation GPS integree',
        'Chat avec vendeur & client',
        'Portefeuille & demandes de retrait',
        'Statistiques de performance',
        'Gestion des zones de livraison',
        'Checklist de livraison',
        'Historique complet des courses',
      ],
    },
  ]

  return (
    <section className="section section-light" id="features">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-badge">Une plateforme, trois experiences</span>
          <h2 className="section-title">Concu pour chaque acteur du commerce</h2>
          <p className="section-desc">
            Acheteurs, vendeurs et livreurs — chacun a son espace dedie
            avec les outils dont il a besoin.
          </p>
        </div>

        <div className="pillars-grid">
          {cards.map((c, i) => (
            <div className={`pillar-card reveal reveal-d${i + 1}`} key={c.title}>
              <div className="pillar-card-img">
                <img src={c.img} alt={c.title} />
              </div>
              <div className="pillar-card-body">
                <div className={`pillar-icon ${c.cls}`}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <ul className="pillar-features">
                  {c.features.map(f => (
                    <li key={f}>
                      <span className="pillar-check"><IconCheck size={10} color="#008060" /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
