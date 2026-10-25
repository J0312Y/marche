import { useApp } from "../../context/AppContext";

/** Bouton panier vert de l'en-tête (comme Toters), visible dès qu'il y a un article */
export default function HeaderCart() {
  const { cartCount, go } = useApp();
  if (!cartCount) return null;
  return (
    <button className="t-hcart" onClick={() => go("cart")} aria-label="Voir le panier">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18l-1.6 8.4a2 2 0 0 1-2 1.6H6.6a2 2 0 0 1-2-1.6L3 10z" /><path d="M7.5 10 11 4M16.5 10 13 4M9 14v2.5M12 14v2.5M15 14v2.5" /></svg>
      <b>{cartCount}</b>
    </button>
  );
}
