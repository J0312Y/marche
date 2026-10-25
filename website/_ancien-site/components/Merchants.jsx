export default function Merchants() {
  const stores = [
    { name: 'Boutique Elegance', type: 'Mode', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&q=80' },
    { name: 'Congo Tech', type: 'Electronique', img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=250&fit=crop&q=80' },
    { name: 'Saveurs du Congo', type: 'Alimentation', img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=250&fit=crop&q=80' },
    { name: 'Maison Deco', type: 'Decoration', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop&q=80' },
    { name: 'Beauty Queen', type: 'Cosmetiques', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=250&fit=crop&q=80' },
    { name: 'Sport Zone', type: 'Sport', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=250&fit=crop&q=80' },
    { name: 'Auto Parts BZV', type: 'Automobile', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop&q=80' },
    { name: 'Librairie Lumiere', type: 'Livres', img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=250&fit=crop&q=80' },
  ]

  return (
    <section className="section section-dark merchants-section">
      <div className="container">
        <p className="merchants-label reveal">
          Des commerces de tous types font confiance a Lamuka Market
        </p>
        <div className="merchants-scroll reveal">
          <div className="merchants-track">
            {[...stores, ...stores].map((s, i) => (
              <div className="merchant-card" key={`${s.name}-${i}`}>
                <div className="merchant-preview">
                  <img src={s.img} alt={s.name} className="merchant-preview-img" />
                  <div className="merchant-preview-overlay">
                    <div className="merchant-preview-bar">
                      <span className="merchant-dot" /><span className="merchant-dot" /><span className="merchant-dot" />
                    </div>
                  </div>
                </div>
                <div className="merchant-info">
                  <span className="merchant-name">{s.name}</span>
                  <span className="merchant-type">{s.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
