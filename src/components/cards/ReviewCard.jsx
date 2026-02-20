/**
 * ReviewCard - Carte d'avis client
 * @param {object} review - {name, avatar, rating, text, date}
 * @param {boolean} isOwn - Avis de l'utilisateur courant
 */
function ReviewCard({ review: r, isOwn = false }) {
  return (
    <div className="review-card" style={isOwn ? { border: "2px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.02)" } : {}}>
      <div className="review-top">
        <div className="rav">{r.avatar}</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600 }}>
            {r.name}
            {isOwn && <span style={{ fontSize: 10, color: "#6366F1", marginLeft: 6, fontWeight: 700 }}>VOUS</span>}
          </h4>
        </div>
        <span className="rd">{r.date}</span>
      </div>
      <div className="review-stars">
        {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
      </div>
      {r.text && <div className="review-text">{r.text}</div>}
    </div>
  );
}

export default ReviewCard;
