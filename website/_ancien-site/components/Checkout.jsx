import { IconCheck, IconShield, IconMapPin } from './Icons'

export default function Checkout() {
  return (
    <section className="section section-dark" id="checkout">
      <div className="container">
        <div className="checkout-layout">
          <div className="checkout-text reveal">
            <span className="section-badge">Paiement a la livraison</span>
            <h2 className="section-title">Le mode de paiement que vos clients connaissent deja</h2>
            <p className="section-desc" style={{ color: 'rgba(255,255,255,.55)' }}>
              Pas de carte bancaire. Pas de compte en ligne. Vos clients commandent
              et paient en cash a la reception. Le modele le plus adapte au commerce
              a Brazzaville.
            </p>

            <div className="checkout-stats">
              <div className="checkout-stat">
                <div className="checkout-stat-num">100%</div>
                <div className="checkout-stat-label">des clients peuvent payer — aucune barriere</div>
              </div>
              <div className="checkout-stat">
                <div className="checkout-stat-num">0</div>
                <div className="checkout-stat-label">friction — pas de formulaire de paiement</div>
              </div>
            </div>

            <ul className="checkout-features">
              <li>
                <span className="checkout-feat-icon"><IconShield size={16} color="#95bf47" /></span>
                <div>
                  <strong>Code PIN securise</strong>
                  <span>Le livreur confirme la livraison avec un code PIN unique</span>
                </div>
              </li>
              <li>
                <span className="checkout-feat-icon"><IconMapPin size={16} color="#95bf47" /></span>
                <div>
                  <strong>Adresses enregistrees</strong>
                  <span>Vos clients sauvegardent leurs adresses pour commander plus vite</span>
                </div>
              </li>
              <li>
                <span className="checkout-feat-icon"><IconCheck size={16} color="#95bf47" /></span>
                <div>
                  <strong>Confirmation instantanee</strong>
                  <span>Notification en temps reel a chaque etape de la commande</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="checkout-visual reveal">
            <div className="checkout-mock">
              <div className="co-mock-header">
                <div className="co-mock-title">Finaliser la commande</div>
                <div className="co-mock-step">Etape 3/3</div>
              </div>

              <div className="co-mock-items">
                <div className="co-mock-item">
                  <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=80&h=80&fit=crop&q=80" alt="" className="co-mock-item-img" />
                  <div className="co-mock-item-info">
                    <div className="co-mock-item-name">Robe Wax Africaine</div>
                    <div className="co-mock-item-detail">Taille M — Qte: 1</div>
                  </div>
                  <div className="co-mock-item-price">15 000 F</div>
                </div>
                <div className="co-mock-item">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop&q=80" alt="" className="co-mock-item-img" />
                  <div className="co-mock-item-info">
                    <div className="co-mock-item-name">Sneakers Classic</div>
                    <div className="co-mock-item-detail">Taille 42 — Qte: 1</div>
                  </div>
                  <div className="co-mock-item-price">25 000 F</div>
                </div>
              </div>

              <div className="co-mock-address">
                <div className="co-mock-section-label">
                  <IconMapPin size={13} color="#737373" /> Livraison
                </div>
                <div className="co-mock-address-val">123 Avenue de la Paix, Bacongo</div>
                <div className="co-mock-address-city">Brazzaville, Congo</div>
              </div>

              <div className="co-mock-payment">
                <div className="co-mock-section-label">
                  <IconShield size={13} color="#737373" /> Paiement
                </div>
                <div className="co-mock-pay-option">
                  <span className="co-mock-cash-badge">CASH</span>
                  <div>
                    <div className="co-mock-pay-name">Paiement a la livraison</div>
                    <div className="co-mock-pay-desc">Payez en cash au livreur</div>
                  </div>
                  <span className="co-mock-radio" />
                </div>
              </div>

              <div className="co-mock-totals">
                <div className="co-mock-total-line"><span>Sous-total</span><span>40 000 F</span></div>
                <div className="co-mock-total-line"><span>Livraison</span><span>2 000 F</span></div>
                <div className="co-mock-total-line final"><span>Total</span><span>42 000 FCFA</span></div>
              </div>

              <button className="co-mock-btn">Confirmer la commande</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
