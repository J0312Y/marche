/**
 * Univers affichés en haut de l'accueil (équivalent des « All / Food / Fresh / Beauty / Butler » de Toters).
 * type = establishments.type ; img = photo carrée (repli si la catégorie n'a pas d'image).
 */
const VERTICALS = [
  { id: "all", label: "Tout", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=240&h=240&fit=crop" },
  { id: "restaurant", label: "Restos", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=240&h=240&fit=crop" },
  { id: "supermarche", label: "Courses", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=240&h=240&fit=crop" },
  { id: "beaute", label: "Beauté", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=240&h=240&fit=crop" },
  { id: "coursier", label: "Coursier", img: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=240&h=240&fit=crop" },
  { id: "patisserie", label: "Pâtisserie", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=240&h=240&fit=crop" },
  { id: "boutique", label: "Boutiques", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=240&h=240&fit=crop" },
  { id: "fleurs", label: "Fleurs", img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=240&h=240&fit=crop" },
  { id: "pharmacie", label: "Pharmacie", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=240&h=240&fit=crop" },
  { id: "auto", label: "Auto", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=240&h=240&fit=crop" },
  { id: "gaz", label: "Gaz", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=240&h=240&fit=crop" },
  { id: "maison", label: "Maison", img: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=240&h=240&fit=crop" },
  { id: "service", label: "Services", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=240&h=240&fit=crop" },
];

export const FILTERS = [
  { id: "offers", label: "Promos", icon: "percent" },
  { id: "free", label: "Livraison gratuite", icon: "bike" },
  { id: "top", label: "Mieux notés" },
  { id: "new", label: "Nouveaux" },
];

/** Applique un filtre rapide à une liste de boutiques */
export function applyFilter(list, f) {
  const days = (d) => (d ? (Date.now() - new Date(String(d).replace(" ", "T")).getTime()) / 86400000 : 999);
  switch (f) {
    case "offers": return list.filter((v) => v.offersCount > 0 || v.maxOff > 0);
    case "free": return list.filter((v) => v.freeDelivery);
    case "open": return list.filter((v) => v.isOpenNow !== false);
    case "top": return list.filter((v) => v.rating >= 4).sort((a, b) => b.rating - a.rating);
    case "new": return list.filter((v) => days(v.createdAt) <= 45).sort((a, b) => days(a.createdAt) - days(b.createdAt));
    case "loyalty": return list.filter((v) => v.punchCard);
    default: return list;
  }
}

/** Ordre par défaut : ouvertes d'abord, puis note, puis nombre de commandes */
export const sortStores = (list) => [...list].sort((a, b) =>
  (b.isOpenNow !== false) - (a.isOpenNow !== false) || (b.rating || 0) - (a.rating || 0) || (b.products || 0) - (a.products || 0));

export default VERTICALS;
