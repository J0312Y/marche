/** Libellés des types de boutique (establishments.type), partagés par toute l'app */
export const TYPE_LABEL = {
  restaurant: "Restaurant",
  patisserie: "Pâtisserie",
  supermarche: "Supermarché",
  pharmacie: "Pharmacie",
  boutique: "Boutique",
  service: "Services",
  fleurs: "Fleuriste",
  beaute: "Beauté & soins",
  auto: "Services auto",
  gaz: "Gaz & carburant",
  maison: "Entretien maison",
};

/** Restauration : menu en lignes ; tous les autres types : rayons (commerce de détail), comme Toters */
export const isFoodType = (t) => t === "restaurant" || t === "patisserie";

export default TYPE_LABEL;
