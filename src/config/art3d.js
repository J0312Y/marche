/**
 * Visuels détourés (vraies photos libres de droits, fond retiré) servis depuis public/cut.
 * Comme Toters : produit seul sur fond blanc pour univers, catégories, tuiles et bannières.
 * Sources : Unsplash (licence Unsplash), Wikimedia Commons et Openverse (CC0 / CC BY, voir public/cut/CREDITS.txt).
 */
const ART = {
  "all": "cut/v-all.webp",
  "restaurant": "cut/v-restaurant.webp",
  "supermarche": "cut/alimentation.webp",
  "beaute": "cut/maquillage.webp",
  "coursier": "cut/v-coursier.webp",
  "patisserie": "cut/gateaux.webp",
  "boutique": "cut/mode.webp",
  "fleurs": "cut/bouquets.webp",
  "pharmacie": "cut/pharmacie.webp",
  "auto": "cut/pieces-accessoires.webp",
  "gaz": "cut/bouteilles-de-gaz.webp",
  "maison": "cut/menage.webp",
  "service": "cut/services.webp",
  "promo": "cut/poulet.webp",
  "again": "cut/pizzas.webp",
  "fresh": "cut/fruits-legumes.webp",
  "courier": "cut/v-scooter.webp",
  "cash": "cut/plats-congolais.webp",
  "gift": "cut/gateaux.webp",
  "store": "cut/mode.webp",
  "Accessoires gaz": "cut/accessoires-gaz.webp",
  "Accessoires": "cut/accessoires.webp",
  "Alimentation": "cut/alimentation.webp",
  "Beauté": "cut/beaute.webp",
  "Boissons": "cut/boissons.webp",
  "Bouquets": "cut/bouquets.webp",
  "Bouteilles de gaz": "cut/bouteilles-de-gaz.webp",
  "Burgers": "cut/burgers.webp",
  "Café & healthy": "cut/cafe-healthy.webp",
  "Chawarma": "cut/chawarma.webp",
  "Cheveux": "cut/cheveux.webp",
  "Compositions": "cut/compositions.webp",
  "Corps & bain": "cut/corps-bain.webp",
  "Desserts": "cut/desserts.webp",
  "Entretien auto": "cut/entretien-auto.webp",
  "Fruits & légumes": "cut/fruits-legumes.webp",
  "Grillades": "cut/grillades.webp",
  "Gâteaux": "cut/gateaux.webp",
  "Hygiène & protection": "cut/hygiene-protection.webp",
  "Maison": "cut/maison.webp",
  "Maquillage": "cut/maquillage.webp",
  "Mode": "cut/mode.webp",
  "Ménage": "cut/menage.webp",
  "Petit-déjeuner": "cut/petit-dejeuner.webp",
  "Pharmacie": "cut/pharmacie.webp",
  "Pizzas": "cut/pizzas.webp",
  "Pièces & accessoires": "cut/pieces-accessoires.webp",
  "Plantes": "cut/plantes.webp",
  "Plats congolais": "cut/plats-congolais.webp",
  "Plomberie": "cut/plomberie.webp",
  "Poisson": "cut/poisson.webp",
  "Poulet": "cut/poulet.webp",
  "Pressing": "cut/pressing.webp",
  "Produits frais": "cut/produits-frais.webp",
  "Pâtisserie": "cut/patisserie.webp",
  "Repassage": "cut/repassage.webp",
  "Salades": "cut/salades.webp",
  "Services": "cut/services.webp",
  "Soins visage": "cut/soins-visage.webp",
  "Supermarchés": "cut/supermarches.webp",
  "Téléphones": "cut/telephones.webp",
  "Viennoiseries": "cut/viennoiseries.webp",
  "Vêtements": "cut/vetements.webp",
  "Électricité": "cut/electricite.webp",
  "Électronique": "cut/electronique.webp",
  "Épicerie": "cut/epicerie.webp"
};
const BASE = import.meta.env.BASE_URL || "/";
/** Visuel d'un univers, d'une catégorie (par son nom) ou d'une tuile (promo, cash…) */
export const art3d = (key) => (ART[key] ? BASE + ART[key] : null);
/**
 * Visuel d'une catégorie : l'image envoyée depuis le panneau d'administration (normalisée par le serveur)
 * passe en premier ; sinon l'illustration intégrée à l'app ; sinon l'ancienne image de la base.
 */
export const catArt = (c) => {
  const img = c?.photo || c?.image || null;
  if (img && img.includes("/uploads/categories/")) return img;
  return art3d(c?.name) || img;
};
export default ART;
