import { isFoodType } from "../config/storeTypes";

/** Étiquettes proposées au client selon le type de commerce (le serveur n'accepte que sa propre liste) */
export const reviewTags = (shopType) => isFoodType(shopType)
  ? ["Bon goût", "Portion généreuse", "Encore chaud", "Bien emballé", "Conforme à la photo", "Livraison rapide"]
  : ["Conforme à la photo", "Bonne qualité", "Bon rapport qualité-prix", "Taille correcte", "Bien emballé", "Livraison rapide"];

/** Avis de l'API → affichage : prénom + initiale, date courte, photos, étiquettes, réponse de la boutique */
export function mapReview(r) {
  const d = r.created_at ? new Date(String(r.created_at).replace(" ", "T")) : null;
  return {
    id: r.id,
    name: [r.first_name, r.last_name ? r.last_name[0] + "." : ""].filter(Boolean).join(" ") || "Client",
    avatar: r.avatar || null,
    rating: Number(r.rating) || 0,
    text: r.comment || "",
    date: d && !isNaN(d) ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "",
    photos: Array.isArray(r.images) ? r.images : [],
    tags: Array.isArray(r.tags) ? r.tags : [],
    verified: Number(r.is_verified_purchase) === 1,
    reply: r.vendor_reply || "",
  };
}
