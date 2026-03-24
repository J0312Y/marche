/**
 * i18n — Multi-language system for Lamuka Market
 * FR (French), EN (English), LN (Lingala)
 */

const T = {
  // ── Navigation ──
  "nav.home":{fr:"Accueil",en:"Home",ln:"Ndako"},
  "nav.search":{fr:"Recherche",en:"Search",ln:"Luka"},
  "nav.cart":{fr:"Panier",en:"Cart",ln:"Panier"},
  "nav.orders":{fr:"Commandes",en:"Orders",ln:"Bitumba"},
  "nav.profile":{fr:"Profil",en:"Profile",ln:"Profil"},
  "nav.commerce":{fr:"Commerce",en:"Shop",ln:"Magazini"},

  // ── Home ──
  "home.hello":{fr:"Bonjour",en:"Hello",ln:"Mbote"},
  "home.search_placeholder":{fr:"Rechercher produits, restos...",en:"Search products, restaurants...",ln:"Luka biloko, restaurant..."},
  "home.for_you":{fr:"Pour vous",en:"For you",ln:"Mpo na yo"},
  "home.flash_sale":{fr:"Ventes Flash",en:"Flash Sales",ln:"Ventes Flash"},
  "home.recently_viewed":{fr:"Vus récemment",en:"Recently viewed",ln:"Omonaki kala te"},
  "home.see_all":{fr:"Voir tout",en:"See all",ln:"Tala nyonso"},
  "home.group_buy":{fr:"Achats groupés",en:"Group Buys",ln:"Kosomba ensemble"},
  "home.product_of_day":{fr:"PRODUIT DU JOUR",en:"DEAL OF THE DAY",ln:"ELOKO YA MOKOLO"},
  "home.restaurants":{fr:"Commander à manger",en:"Order food",ln:"Tinda bilei"},

  // ── Products ──
  "product.add_cart":{fr:"Ajouter",en:"Add to cart",ln:"Bakisa"},
  "product.description":{fr:"Description",en:"Description",ln:"Liloba"},
  "product.specs":{fr:"Specs",en:"Specs",ln:"Specs"},
  "product.infos":{fr:"Infos",en:"Info",ln:"Makambo"},
  "product.reviews":{fr:"avis",en:"reviews",ln:"makanisi"},
  "product.delivery":{fr:"Livraison estimée",en:"Estimated delivery",ln:"Livraison ekokomela"},
  "product.size":{fr:"Taille",en:"Size",ln:"Bonene"},
  "product.color":{fr:"Couleur",en:"Color",ln:"Langi"},
  "product.price_alert":{fr:"Alerte prix",en:"Price alert",ln:"Signal ya ntalo"},
  "product.group_buy":{fr:"Achat groupé",en:"Group buy",ln:"Kosomba ensemble"},
  "product.contact_vendor":{fr:"Contacter le vendeur",en:"Contact seller",ln:"Benga moteki"},

  // ── Cart ──
  "cart.empty":{fr:"Votre panier est vide",en:"Your cart is empty",ln:"Panier na yo ezali vide"},
  "cart.total":{fr:"Total",en:"Total",ln:"Total"},
  "cart.checkout":{fr:"Passer la commande",en:"Place order",ln:"Tinda commande"},
  "cart.items":{fr:"articles",en:"items",ln:"biloko"},
  "cart.delivery":{fr:"Livraison",en:"Delivery",ln:"Livraison"},
  "cart.free":{fr:"Gratuit",en:"Free",ln:"Ofele"},

  // ── Auth ──
  "auth.welcome":{fr:"Bienvenue !",en:"Welcome!",ln:"Boyei malamu!"},
  "auth.subtitle":{fr:"Connectez-vous pour accéder au marketplace",en:"Sign in to access the marketplace",ln:"Kota mpo na kosomba"},
  "auth.continue":{fr:"Continuer",en:"Continue",ln:"Kokoba"},
  "auth.skip":{fr:"Passer",en:"Skip",ln:"Koleka"},
  "auth.or_with":{fr:"ou continuer avec",en:"or continue with",ln:"to pe na"},
  "auth.terms":{fr:"Conditions d'utilisation",en:"Terms of Service",ln:"Mibeko"},
  "auth.privacy":{fr:"Politique de confidentialité",en:"Privacy Policy",ln:"Politique ya sekele"},
  "auth.phone_error":{fr:"Le numéro doit contenir 9 chiffres après +242",en:"Number must be 9 digits after +242",ln:"Numéro esengeli kozala na chiffres 9"},

  // ── Orders ──
  "order.pending":{fr:"En attente",en:"Pending",ln:"Ezali kozela"},
  "order.preparing":{fr:"En préparation",en:"Preparing",ln:"Bazali kobongisa"},
  "order.delivering":{fr:"En livraison",en:"Delivering",ln:"Ezali koya"},
  "order.delivered":{fr:"Livrée",en:"Delivered",ln:"Ekomi"},
  "order.cancelled":{fr:"Annulée",en:"Cancelled",ln:"Eboyamaki"},
  "order.track":{fr:"Suivre",en:"Track",ln:"Landa"},

  // ── Profile sections ──
  "profile.my_purchases":{fr:"MES ACHATS",en:"MY PURCHASES",ln:"BISOMBI NA NGAI"},
  "profile.orders":{fr:"Commandes",en:"Orders",ln:"Bitumba"},
  "profile.favorites":{fr:"Favoris",en:"Favorites",ln:"Biloko nalingi"},
  "profile.payment_history":{fr:"Historique paiements",en:"Payment history",ln:"Historique ya kofuta"},
  "profile.my_account":{fr:"MON COMPTE",en:"MY ACCOUNT",ln:"COMPTE NA NGAI"},
  "profile.loyalty":{fr:"Fidélité",en:"Loyalty",ln:"Fidélité"},
  "profile.referral":{fr:"Parrainage",en:"Referral",ln:"Parrainage"},
  "profile.gift_cards":{fr:"Cartes cadeaux",en:"Gift cards",ln:"Carte ya cadeau"},
  "profile.tools":{fr:"OUTILS",en:"TOOLS",ln:"BISALELI"},
  "profile.messages":{fr:"Messages",en:"Messages",ln:"Makomi"},
  "profile.addresses":{fr:"Adresses",en:"Addresses",ln:"Adresse"},
  "profile.notifications":{fr:"Notifications",en:"Notifications",ln:"Notification"},
  "profile.price_alerts":{fr:"Alertes de prix",en:"Price alerts",ln:"Signal ya ntalo"},
  "profile.discover":{fr:"DÉCOUVRIR",en:"DISCOVER",ln:"KOMONA"},
  "profile.group_buys":{fr:"Achats groupés",en:"Group buys",ln:"Kosomba ensemble"},
  "profile.stats":{fr:"Mes statistiques",en:"My stats",ln:"Statistiques na ngai"},
  "profile.assistant":{fr:"Assistant Lamu",en:"Lamu Assistant",ln:"Mosungi Lamu"},
  "profile.qr_scan":{fr:"Scanner QR",en:"Scan QR",ln:"Scanner QR"},
  "profile.rewards":{fr:"Récompenses",en:"Rewards",ln:"Mbano"},
  "profile.settings":{fr:"Paramètres",en:"Settings",ln:"Réglages"},
  "profile.logout":{fr:"Déconnexion",en:"Logout",ln:"Kobima"},
  "profile.become_seller":{fr:"Devenir commerçant ou livreur",en:"Become a seller or driver",ln:"Kokoma moteki to livreur"},

  // ── Common ──
  "common.save":{fr:"Enregistrer",en:"Save",ln:"Bamba"},
  "common.cancel":{fr:"Annuler",en:"Cancel",ln:"Boya"},
  "common.delete":{fr:"Supprimer",en:"Delete",ln:"Bolongola"},
  "common.close":{fr:"Fermer",en:"Close",ln:"Kanga"},
  "common.loading":{fr:"Chargement...",en:"Loading...",ln:"Ezali kokota..."},
};

let currentLang = localStorage.getItem("lk-lang") || "fr";

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lk-lang", lang);
}
export function getLanguage() { return currentLang; }
export function t(key) {
  const e = T[key];
  if (!e) return key;
  return e[currentLang] || e.fr || key;
}
export default t;
