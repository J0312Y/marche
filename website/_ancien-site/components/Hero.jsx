import { useState, useEffect } from 'react'
import { IconShoppingCart, IconTruck, IconStar } from './Icons'

const words = [
  'success story',
  'commerce en ligne',
  'empire local',
  'marque connue',
  'vendeur star',
]

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setIndex(i => (i + 1) % words.length)
        setAnimating(false)
      }, 400)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero">
      <div className="hero-bg-shapes">
        <div className="hero-shape hero-shape-1" />
        <div className="hero-shape hero-shape-2" />
        <div className="hero-shape hero-shape-3" />
      </div>

      <div className="hero-inner">
        <div className="hero-content">
          <h1>
            Soyez le prochain<br />
            <span className="hero-rotating">
              <span
                className="hero-rotating-text"
                style={{
                  transform: animating ? 'translateY(-120%)' : 'translateY(0)',
                  opacity: animating ? 0 : 1,
                }}
              >
                {words[index]}
              </span>
            </span>
          </h1>
          <p className="hero-sub">
            La plateforme de commerce tout-en-un pour le Congo.
            Creez votre boutique, vendez a des milliers de clients
            et faites livrer vos produits.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn btn-primary btn-lg">Commencer gratuitement</a>
            <a href="#features" className="btn btn-ghost btn-lg">Decouvrir la plateforme</a>
          </div>
          <p className="hero-note">Gratuit pour demarrer — Paiement a la livraison uniquement</p>
        </div>

        <div className="hero-preview">
          <div className="hero-phone">
            <img src="/app-screenshot.png" alt="Lamuka Market App" className="hero-phone-screenshot" />
          </div>

          <div className="hero-float hero-float-1">
            <span className="hero-float-icon-wrap order"><IconShoppingCart size={16} color="#008060" /></span>
            <div>
              <div className="hero-float-title">Nouvelle commande !</div>
              <div className="hero-float-sub">#LMK-1847 — Robe Wax x2</div>
            </div>
          </div>
          <div className="hero-float hero-float-2">
            <span className="hero-float-icon-wrap delivery"><IconTruck size={16} color="#5c6ac4" /></span>
            <div>
              <div className="hero-float-title">Livraison en cours</div>
              <div className="hero-float-sub">ETA: 15 min — Bacongo</div>
            </div>
          </div>
          <div className="hero-float hero-float-3">
            <span className="hero-float-icon-wrap review"><IconStar size={16} color="#f59e0b" fill="#f59e0b" /></span>
            <div>
              <div className="hero-float-title">Nouvel avis 5 etoiles</div>
              <div className="hero-float-sub">"Excellent service !"</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
