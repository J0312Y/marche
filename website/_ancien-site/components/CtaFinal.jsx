export default function CtaFinal() {
  return (
    <section className="cta-final">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header reveal" style={{ marginBottom: 36 }}>
          <span className="section-badge" style={{ color: '#95bf47' }}>Prêt à commencer ?</span>
          <h2 className="section-title">
            Il n'y a pas de meilleur endroit pour lancer votre commerce
          </h2>
          <p className="section-desc" style={{ color: 'rgba(255,255,255,.55)' }}>
            Rejoignez les commerçants de Brazzaville qui utilisent Lamuka Market
            pour vendre en ligne. Gratuit pour commencer, puissant pour grandir.
          </p>
        </div>
        <div className="cta-final-actions reveal">
          <a href="#" className="btn btn-primary btn-lg">
            Créer mon compte gratuitement →
          </a>
          <a href="#" className="btn btn-ghost btn-lg">
            Contacter l'équipe
          </a>
        </div>
      </div>
    </section>
  )
}
