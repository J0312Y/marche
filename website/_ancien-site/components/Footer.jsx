import { IconFacebook, IconInstagram, IconTwitter, IconTiktok, IconWhatsapp } from './Icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">Lamuka<span>Market</span></div>
            <p className="footer-brand-desc">
              La plateforme de commerce tout-en-un pour le Congo.
              Achetez, vendez et faites livrer a Brazzaville.
            </p>
            <div className="footer-social" style={{ marginTop: 20 }}>
              <a href="#" aria-label="Facebook"><IconFacebook /></a>
              <a href="#" aria-label="Instagram"><IconInstagram /></a>
              <a href="#" aria-label="Twitter"><IconTwitter /></a>
              <a href="#" aria-label="TikTok"><IconTiktok /></a>
              <a href="#" aria-label="WhatsApp"><IconWhatsapp /></a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Plateforme</h5>
            <a href="#features">Fonctionnalites</a>
            <a href="#channels">Canaux de vente</a>
            <a href="#vendeurs">Espace vendeur</a>
            <a href="#livreurs">Espace livreur</a>
            <a href="#checkout">Paiement</a>
            <a href="#tarifs">Tarifs</a>
          </div>
          <div className="footer-col">
            <h5>Ressources</h5>
            <a href="#">Centre d'aide</a>
            <a href="#">Blog</a>
            <a href="#">Guides de demarrage</a>
            <a href="#ecosystem">API Documentation</a>
            <a href="#">Changelog</a>
          </div>
          <div className="footer-col">
            <h5>Entreprise</h5>
            <a href="#">A propos</a>
            <a href="#">Carrieres</a>
            <a href="#">Presse</a>
            <a href="#">Partenaires</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <a href="#">Conditions d'utilisation</a>
            <a href="#">Politique de confidentialite</a>
            <a href="#">Politique de livraison</a>
            <a href="#">Politique de retour</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>2026 Lamuka Market. Tous droits reserves. Brazzaville, Republique du Congo.</span>
          <div className="footer-lang">Congo - Francais</div>
        </div>
      </div>
    </footer>
  )
}
