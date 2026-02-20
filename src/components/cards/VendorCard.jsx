/**
 * VendorCard - Carte commerçant dans les listes
 * @param {object} vendor - {id, name, avatar, rating, products, loc, verified, type, eta}
 * @param {function} onPress
 */
function VendorCard({ vendor: v, onPress }) {
  const typeLabel = v.type === "restaurant" ? "plats" : v.type === "service" ? "services" : "produits";
  return (
    <div className="vcard" onClick={onPress}>
      <div className="vav">{v.avatar}</div>
      <div className="vi">
        <h4>{v.name}{v.verified && <span className="vf">✓</span>}</h4>
        <div className="vloc">
          📍 {v.loc}
          {v.eta && <span style={{ marginLeft: 8, color: "#10B981", fontWeight: 600 }}>🕐 {v.eta}</span>}
        </div>
        <div className="vst">⭐ <b>{v.rating}</b> · {v.products} {typeLabel}</div>
      </div>
      <span style={{ color: "#908C82" }}>›</span>
    </div>
  );
}

export default VendorCard;
