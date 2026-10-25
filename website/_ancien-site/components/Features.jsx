import { IconCheck, IconBarChart, IconCpu } from './Icons'
import RealMap from './RealMap'

export default function Features() {
  return (
    <section className="section section-gray">
      <div className="container">
        {/* ── VENDOR DASHBOARD ── */}
        <div className="feature-row reveal" id="vendeurs">
          <div className="feature-text">
            <span className="section-badge">Dashboard Vendeur</span>
            <h3>Tout votre business en un coup d'oeil</h3>
            <p>
              Un tableau de bord complet pour piloter vos ventes, gerer vos commandes
              et suivre la performance de votre boutique en temps reel.
            </p>
            <ul className="feature-list">
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> KPIs : revenus, commandes, taux de conversion</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Gestion des commandes avec mise a jour de statut</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Inventaire produits avec variantes et stock</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Rapports personnalises et export de donnees</li>
            </ul>
            <a href="#" className="btn btn-primary">Ouvrir ma boutique</a>
          </div>
          <div className="feature-visual">
            <MockDashboard />
          </div>
        </div>

        {/* ── CATALOGUE & RECHERCHE ── */}
        <div className="feature-row reverse reveal">
          <div className="feature-text">
            <span className="section-badge">Catalogue intelligent</span>
            <h3>Vos clients trouvent ce qu'ils cherchent en secondes</h3>
            <p>
              Recherche full-text, filtres par categorie, prix, popularite.
              Vos produits sont presentes avec photos, variantes, tailles et avis clients.
            </p>
            <ul className="feature-list">
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Recherche instantanee par nom, categorie ou vendeur</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Filtres : prix, popularite, nouveautes, promos</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Variantes produits : taille, couleur, quantite</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Avis clients et notes sur chaque produit</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Comparaison de produits cote a cote</li>
            </ul>
          </div>
          <div className="feature-visual">
            <MockCatalogue />
          </div>
        </div>

        {/* ── TRACKING ── */}
        <div className="feature-row reveal" id="livreurs">
          <div className="feature-text">
            <span className="section-badge">Livraison en temps reel</span>
            <h3>Suivez chaque commande. En direct.</h3>
            <p>
              De la confirmation a la livraison, suivez le trajet sur une carte
              interactive avec position du livreur et ETA en temps reel.
            </p>
            <ul className="feature-list">
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Carte GPS de Brazzaville avec position du livreur</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Estimation d'arrivee mise a jour en direct</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Chat direct avec le livreur pendant la course</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Notifications push a chaque etape</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Code PIN de verification a la livraison</li>
            </ul>
          </div>
          <div className="feature-visual feature-visual-map">
            <RealMap />
            <div className="map-timeline-overlay">
              {[
                { title: 'Commande confirmee', time: '14:23', status: 'done' },
                { title: 'Preparation terminee', time: '14:45', status: 'done' },
                { title: 'En cours de livraison', time: 'En route...', status: 'active' },
                { title: 'Livre', time: '—', status: '' },
              ].map(s => (
                <div className={`mock-tl-step ${s.status}`} key={s.title}>
                  <div className="mock-tl-dot" />
                  <div>
                    <div className="mock-tl-title">{s.title}</div>
                    <div className="mock-tl-time">{s.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PROMOTIONS & FIDELITE ── */}
        <div className="feature-row reverse reveal">
          <div className="feature-text">
            <span className="section-badge">Marketing & fidelite</span>
            <h3>Faites revenir vos clients encore et encore</h3>
            <p>
              Coupons, ventes flash, programme de fidelite, parrainage.
              Tous les outils pour attirer de nouveaux clients et les fideliser.
            </p>
            <ul className="feature-list">
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Coupons de reduction avec code promo</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Ventes flash avec compte a rebours</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Programme de fidelite avec points et niveaux</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Parrainage : invitez un ami, gagnez des avantages</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Alertes prix pour les produits suivis</li>
            </ul>
          </div>
          <div className="feature-visual">
            <MockPromos />
          </div>
        </div>

        {/* ── AI ── */}
        <div className="feature-row reveal">
          <div className="feature-text">
            <span className="section-badge">Intelligence artificielle</span>
            <h3>L'IA au service de votre commerce</h3>
            <p>
              Generez des descriptions produits, obtenez des conseils business
              personnalises et automatisez les taches repetitives grace a
              l'intelligence artificielle integree.
            </p>
            <ul className="feature-list">
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Descriptions produits generees automatiquement</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Chatbot support client disponible 24h/24</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Conseiller business IA pour plans Pro & Enterprise</li>
              <li><span className="check"><IconCheck size={14} color="#008060" /></span> Recherche visuelle : trouvez un produit par photo</li>
            </ul>
          </div>
          <div className="feature-visual">
            <MockAI />
          </div>
        </div>
      </div>
    </section>
  )
}

function MockDashboard() {
  const bars = [35, 55, 40, 72, 48, 85, 62, 92, 55, 78, 65, 88]
  return (
    <div className="mock-dash">
      <div className="mock-dash-top">
        <span className="mock-dash-title"><IconBarChart size={16} color="#008060" style={{display:'inline',verticalAlign:'middle',marginRight:6}} /> Vue d'ensemble</span>
        <span className="mock-dash-period">Juin 2026</span>
      </div>
      <div className="mock-kpis">
        <div className="mock-kpi">
          <div className="mock-kpi-label">Revenus</div>
          <div className="mock-kpi-val">847 000 F</div>
          <div className="mock-kpi-change up">+24%</div>
        </div>
        <div className="mock-kpi">
          <div className="mock-kpi-label">Commandes</div>
          <div className="mock-kpi-val">342</div>
          <div className="mock-kpi-change up">+12%</div>
        </div>
        <div className="mock-kpi">
          <div className="mock-kpi-label">Conversion</div>
          <div className="mock-kpi-val">4.8%</div>
          <div className="mock-kpi-change up">+0.6%</div>
        </div>
      </div>
      <div className="mock-chart">
        <div className="mock-chart-bars">
          {bars.map((h, i) => <div key={i} className="mock-bar" style={{ height: `${h}%` }} />)}
        </div>
      </div>
      <div className="mock-orders-list">
        <div className="mock-order-row"><span className="mock-order-id">#LMK-2847</span><span>Robe Wax x2</span><span className="mock-status delivered">Livre</span></div>
        <div className="mock-order-row"><span className="mock-order-id">#LMK-2848</span><span>Ecouteurs BT</span><span className="mock-status transit">En livraison</span></div>
        <div className="mock-order-row"><span className="mock-order-id">#LMK-2849</span><span>Sneakers x1</span><span className="mock-status pending">En attente</span></div>
      </div>
    </div>
  )
}

function MockCatalogue() {
  const products = [
    { img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=120&h=120&fit=crop&q=80', name: 'Robe Wax', price: '15 000 F', rating: 4.8, reviews: 24 },
    { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop&q=80', name: 'Sneakers', price: '25 000 F', rating: 4.5, reviews: 18 },
    { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop&q=80', name: 'Ecouteurs Pro', price: '18 000 F', rating: 4.9, reviews: 31 },
  ]
  return (
    <div className="mock-catalogue">
      <div className="mock-cat-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Rechercher "robe wax"</span>
      </div>
      <div className="mock-cat-filters">
        <span className="mock-cat-filter active">Tout</span>
        <span className="mock-cat-filter">Mode</span>
        <span className="mock-cat-filter">Electronique</span>
        <span className="mock-cat-filter">Maison</span>
      </div>
      <div className="mock-cat-sort">
        <span>Trier par : <strong>Popularite</strong></span>
        <span className="mock-cat-count">127 resultats</span>
      </div>
      <div className="mock-cat-products">
        {products.map(p => (
          <div className="mock-cat-product" key={p.name}>
            <img src={p.img} alt={p.name} className="mock-cat-product-img" />
            <div className="mock-cat-product-info">
              <div className="mock-cat-product-name">{p.name}</div>
              <div className="mock-cat-product-rating">
                {'★'.repeat(Math.floor(p.rating))} <span>{p.rating} ({p.reviews} avis)</span>
              </div>
              <div className="mock-cat-product-price">{p.price}</div>
            </div>
            <button className="mock-cat-add">+ Panier</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function MockPromos() {
  return (
    <div className="mock-promos">
      <div className="mock-promo-flash">
        <div className="mock-promo-flash-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>Vente Flash</span>
        </div>
        <div className="mock-promo-flash-timer">
          <div className="mock-timer-block"><span>02</span><small>h</small></div>
          <div className="mock-timer-sep">:</div>
          <div className="mock-timer-block"><span>47</span><small>min</small></div>
          <div className="mock-timer-sep">:</div>
          <div className="mock-timer-block"><span>13</span><small>sec</small></div>
        </div>
      </div>

      <div className="mock-promo-coupon">
        <div className="mock-coupon-left">
          <div className="mock-coupon-badge">-20%</div>
          <div>
            <div className="mock-coupon-code">LAMUKA20</div>
            <div className="mock-coupon-desc">Sur votre 1ere commande</div>
          </div>
        </div>
        <button className="mock-coupon-copy">Copier</button>
      </div>

      <div className="mock-promo-loyalty">
        <div className="mock-loyalty-header">Programme de fidelite</div>
        <div className="mock-loyalty-bar-wrap">
          <div className="mock-loyalty-bar"><div className="mock-loyalty-fill" style={{width:'65%'}} /></div>
          <span className="mock-loyalty-pts">650 / 1000 pts</span>
        </div>
        <div className="mock-loyalty-tiers">
          <span className="mock-tier active">Bronze</span>
          <span className="mock-tier active">Argent</span>
          <span className="mock-tier">Or</span>
          <span className="mock-tier">Diamant</span>
        </div>
      </div>

      <div className="mock-promo-referral">
        <span className="mock-ref-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        </span>
        <div>
          <div className="mock-ref-title">Invitez un ami</div>
          <div className="mock-ref-desc">Gagnez 2 000 F par parrainage reussi</div>
        </div>
      </div>
    </div>
  )
}

function MockAI() {
  return (
    <div className="mock-ai">
      <div className="mock-ai-header">
        <span className="mock-ai-icon-wrap"><IconCpu size={18} color="#008060" /></span>
        <span className="mock-ai-title">Assistant IA Lamuka</span>
      </div>
      <div className="mock-ai-chat">
        <div className="mock-ai-msg user">
          Genere une description pour ma robe en wax multicolore, taille S a XL
        </div>
        <div className="mock-ai-msg bot">
          <div className="mock-ai-typing">Voici votre description :</div>
          <p>
            <strong>Robe Wax Multicolore — Elegance Africaine</strong><br />
            Sublimez votre style avec cette robe en tissu wax authentique aux motifs vibrants.
            Coupe flatteuse disponible du S au XL. Tissu 100% coton de qualite superieure.
          </p>
          <div className="mock-ai-tags">
            <span>#Mode</span><span>#Wax</span><span>#FaitMain</span>
          </div>
        </div>
        <div className="mock-ai-msg user">
          Ajoute un prix suggere
        </div>
        <div className="mock-ai-msg bot">
          Prix suggere base sur le marche a Brazzaville : <strong>18 000 — 22 000 FCFA</strong>
        </div>
      </div>
    </div>
  )
}
