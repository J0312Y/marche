import { IconBarChart, IconStore, IconPackage, IconTruck, IconDollarSign, IconTrendingUp, IconShield, IconMap } from './Icons'

export default function AdminSection() {
  const features = [
    { icon: <IconBarChart size={18} color="#008060" />, title: 'Dashboard', desc: 'KPIs, graphiques, activite recente' },
    { icon: <IconStore size={18} color="#e8792b" />, title: 'Gestion vendeurs', desc: 'Approuver, suspendre, moderer' },
    { icon: <IconPackage size={18} color="#5c6ac4" />, title: 'Suivi commandes', desc: 'Toutes les commandes en un coup d\'oeil' },
    { icon: <IconTruck size={18} color="#2563eb" />, title: 'Gestion livreurs', desc: 'Documents, zones, performances' },
    { icon: <IconDollarSign size={18} color="#16a34a" />, title: 'Finance', desc: 'Revenus, commissions, paiements' },
    { icon: <IconTrendingUp size={18} color="#9333ea" />, title: 'Analytics', desc: 'Conversion, retention, croissance' },
    { icon: <IconShield size={18} color="#dc2626" />, title: 'Moderation', desc: 'Signalements, litiges, avis' },
    { icon: <IconMap size={18} color="#0891b2" />, title: 'Carte en direct', desc: 'Position des livreurs en temps reel' },
  ]

  return (
    <section className="section section-gray" id="admin">
      <div className="container">
        <div className="feature-row reveal">
          <div className="feature-text">
            <span className="section-badge">Panel d'administration</span>
            <h3>Controlez tout depuis un seul endroit</h3>
            <p>
              Un panel admin complet pour gerer vendeurs, commandes, livreurs,
              finances, analytics et moderation. Tout ce qu'il faut pour
              piloter la plateforme.
            </p>
            <a href="#" className="btn btn-primary">Decouvrir le panel</a>
          </div>
          <div className="feature-visual">
            <div className="admin-features-grid">
              {features.map(f => (
                <div className="admin-feature" key={f.title}>
                  <span className="admin-feature-icon-wrap">{f.icon}</span>
                  <div>
                    <div className="admin-feature-title">{f.title}</div>
                    <div className="admin-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
