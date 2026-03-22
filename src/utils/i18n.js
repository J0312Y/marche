/**
 * i18n — Simple multi-language system for Lamuka Market
 * Languages: fr (French), en (English), ln (Lingala)
 */

const translations = {
  // ── Navigation ──
  "nav.home": { fr: "Accueil", en: "Home", ln: "Ndako" },
  "nav.search": { fr: "Recherche", en: "Search", ln: "Luka" },
  "nav.cart": { fr: "Panier", en: "Cart", ln: "Panier" },
  "nav.orders": { fr: "Commandes", en: "Orders", ln: "Bitumba" },
  "nav.profile": { fr: "Profil", en: "Profile", ln: "Profil" },

  // ── Home ──
  "home.hello": { fr: "Bonjour", en: "Hello", ln: "Mbote" },
  "home.search": { fr: "Rechercher des produits, boutiques...", en: "Search products, shops...", ln: "Luka biloko, magazini..." },
  "home.categories": { fr: "Catégories populaires", en: "Popular categories", ln: "Catégorie ya bato mingi" },
  "home.trending": { fr: "Tendances", en: "Trending", ln: "Biloko ya sika" },
  "home.recommended": { fr: "Recommandés pour vous", en: "Recommended for you", ln: "Baponi mpo na yo" },
  "home.see_all": { fr: "Voir tout", en: "See all", ln: "Tala nyonso" },
  "home.recently_viewed": { fr: "Vus récemment", en: "Recently viewed", ln: "Omonaki kala te" },

  // ── Products ──
  "product.add_cart": { fr: "Ajouter", en: "Add", ln: "Bakisa" },
  "product.buy_now": { fr: "Acheter", en: "Buy now", ln: "Somba sikoyo" },
  "product.description": { fr: "Description", en: "Description", ln: "Liloba" },
  "product.reviews": { fr: "avis", en: "reviews", ln: "makanisi" },
  "product.delivery": { fr: "Livraison estimée", en: "Estimated delivery", ln: "Livraison ekokomela" },
  "product.in_stock": { fr: "En stock", en: "In stock", ln: "Ezali" },
  "product.out_of_stock": { fr: "Rupture de stock", en: "Out of stock", ln: "Esili" },

  // ── Cart & Checkout ──
  "cart.empty": { fr: "Votre panier est vide", en: "Your cart is empty", ln: "Panier na yo ezali vide" },
  "cart.total": { fr: "Total", en: "Total", ln: "Total" },
  "cart.checkout": { fr: "Passer la commande", en: "Place order", ln: "Tinda commande" },
  "checkout.address": { fr: "Adresse de livraison", en: "Delivery address", ln: "Adresse ya livraison" },
  "checkout.payment": { fr: "Paiement", en: "Payment", ln: "Kofuta" },
  "checkout.confirm": { fr: "Confirmer", en: "Confirm", ln: "Ndima" },

  // ── Auth ──
  "auth.welcome": { fr: "Bienvenue !", en: "Welcome!", ln: "Boyei malamu!" },
  "auth.login_subtitle": { fr: "Connectez-vous pour accéder au marketplace", en: "Sign in to access the marketplace", ln: "Kota mpo na kosomba" },
  "auth.continue": { fr: "Continuer", en: "Continue", ln: "Kokoba" },
  "auth.skip": { fr: "Passer pour l'instant", en: "Skip for now", ln: "Koleka mpo na sikoyo" },
  "auth.or_continue_with": { fr: "ou continuer avec", en: "or continue with", ln: "to pe na" },
  "auth.terms": { fr: "Conditions", en: "Terms", ln: "Mibeko" },
  "auth.privacy": { fr: "Politique de confidentialité", en: "Privacy Policy", ln: "Politique ya sekele" },

  // ── Orders ──
  "order.pending": { fr: "En attente", en: "Pending", ln: "Ezali kozela" },
  "order.preparing": { fr: "Préparation", en: "Preparing", ln: "Bazali kobongisa" },
  "order.delivering": { fr: "En livraison", en: "Delivering", ln: "Ezali koya" },
  "order.delivered": { fr: "Livrée", en: "Delivered", ln: "Ekomi" },
  "order.cancelled": { fr: "Annulée", en: "Cancelled", ln: "Eboyamaki" },
  "order.track": { fr: "Suivre la livraison", en: "Track delivery", ln: "Landa livraison" },

  // ── Profile ──
  "profile.orders": { fr: "Mes commandes", en: "My orders", ln: "Bitumba na ngai" },
  "profile.favorites": { fr: "Favoris", en: "Favorites", ln: "Biloko nalingi" },
  "profile.addresses": { fr: "Adresses", en: "Addresses", ln: "Adresse" },
  "profile.settings": { fr: "Paramètres", en: "Settings", ln: "Réglages" },
  "profile.logout": { fr: "Déconnexion", en: "Logout", ln: "Kobima" },

  // ── Common ──
  "common.save": { fr: "Enregistrer", en: "Save", ln: "Bamba" },
  "common.cancel": { fr: "Annuler", en: "Cancel", ln: "Boya" },
  "common.delete": { fr: "Supprimer", en: "Delete", ln: "Bolongola" },
  "common.edit": { fr: "Modifier", en: "Edit", ln: "Bobongola" },
  "common.close": { fr: "Fermer", en: "Close", ln: "Kanga" },
  "common.retry": { fr: "Réessayer", en: "Retry", ln: "Meka lisusu" },
  "common.loading": { fr: "Chargement...", en: "Loading...", ln: "Ezali kokota..." },
  "common.no_results": { fr: "Aucun résultat", en: "No results", ln: "Eloko moko te" },
  "common.optional": { fr: "optionnel", en: "optional", ln: "esengeli te" },
};

let currentLang = "fr";

export function setLanguage(lang) {
  currentLang = lang;
}

export function getLanguage() {
  return currentLang;
}

export function t(key) {
  const entry = translations[key];
  if (!entry) return key;
  return entry[currentLang] || entry.fr || key;
}

export default t;
