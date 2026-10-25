import { useState, useEffect } from 'react'
import { IconShoppingBag } from './Icons'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdown, setDropdown] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="#" className="nav-logo">
            <span className="nav-logo-icon">
              <IconShoppingBag size={18} color="#fff" />
            </span>
            <span className="nav-logo-text">Lamuka</span>
            <span className="nav-logo-accent">Market</span>
          </a>

          <div className={`nav-links${menuOpen ? ' open' : ''}`}>
            <div
              className="nav-dropdown-wrap"
              onMouseEnter={() => setDropdown('why')}
              onMouseLeave={() => setDropdown(null)}
            >
              <a href="#features" className="nav-link-parent">
                Pourquoi Lamuka <span className="nav-chevron">▾</span>
              </a>
              {dropdown === 'why' && (
                <div className="nav-mega">
                  <div className="nav-mega-col">
                    <h6>La plateforme</h6>
                    <a href="#features">Acheteurs, vendeurs, livreurs</a>
                    <a href="#channels">Vendez partout</a>
                    <a href="#checkout">Paiement a la livraison</a>
                  </div>
                  <div className="nav-mega-col">
                    <h6>Resultats</h6>
                    <a href="#stories">Temoignages clients</a>
                    <a href="#tarifs">Comment ca marche</a>
                    <a href="#ecosystem">Developpeurs & API</a>
                  </div>
                </div>
              )}
            </div>

            <div
              className="nav-dropdown-wrap"
              onMouseEnter={() => setDropdown('products')}
              onMouseLeave={() => setDropdown(null)}
            >
              <a href="#vendeurs" className="nav-link-parent">
                Produits <span className="nav-chevron">▾</span>
              </a>
              {dropdown === 'products' && (
                <div className="nav-mega nav-mega-wide">
                  <div className="nav-mega-col">
                    <h6>Vendre en ligne</h6>
                    <a href="#vendeurs">Dashboard vendeur</a>
                    <a href="#vendeurs">Catalogue intelligent</a>
                    <a href="#channels">Canaux de vente</a>
                  </div>
                  <div className="nav-mega-col">
                    <h6>Gerer</h6>
                    <a href="#vendeurs">Commandes & suivi</a>
                    <a href="#vendeurs">Gestion de stock</a>
                    <a href="#vendeurs">Promotions & coupons</a>
                  </div>
                  <div className="nav-mega-col">
                    <h6>Developper</h6>
                    <a href="#vendeurs">Analytics & rapports</a>
                    <a href="#vendeurs">IA & automatisation</a>
                    <a href="#ecosystem">API & integration</a>
                  </div>
                  <div className="nav-mega-col">
                    <h6>Livrer</h6>
                    <a href="#livreurs">Suivi temps reel</a>
                    <a href="#livreurs">Reseau de livreurs</a>
                    <a href="#livreurs">Navigation GPS</a>
                  </div>
                </div>
              )}
            </div>

            <a href="#tarifs">Tarifs</a>
            <a href="#ecosystem">Developpeurs</a>
          </div>

          <div className="nav-right">
            <button className="nav-login">Se connecter</button>
            <a href="#" className="btn btn-primary btn-sm">Commencer gratuitement</a>
          </div>

          <button className="nav-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </nav>
    </>
  )
}
