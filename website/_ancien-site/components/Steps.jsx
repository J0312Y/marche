export default function Steps() {
  const steps = [
    {
      num: '1',
      title: 'Créez votre compte',
      desc: 'Inscrivez-vous avec votre numéro de téléphone ou connectez-vous avec Google, Apple ou Facebook. Vérification OTP en quelques secondes.',
    },
    {
      num: '2',
      title: 'Ajoutez vos produits',
      desc: 'Créez votre catalogue, importez en masse via CSV, ajoutez des variantes, des photos et des descriptions. L\'IA vous aide à rédiger.',
    },
    {
      num: '3',
      title: 'Recevez des commandes',
      desc: 'Vos clients commandent et paient à la livraison. Gérez tout depuis votre dashboard. Les livreurs s\'occupent du reste.',
    },
  ]

  return (
    <section className="section section-gray" id="tarifs">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-badge">Comment ça marche</span>
          <h2 className="section-title">Lancez votre commerce en 3 étapes</h2>
          <p className="section-desc">
            De l'inscription à votre première vente, tout est conçu pour être
            simple, rapide et sans obstacle.
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className={`step-card reveal reveal-d${i + 1}`} key={s.num}>
              <div className="step-num">{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
