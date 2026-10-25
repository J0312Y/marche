/**
 * Feature flags — fonctionnalités désactivées tant qu'elles n'ont pas de vrai backend.
 * Passer un flag à true uniquement quand la fonctionnalité est réellement branchée.
 */
const FEATURES = {
  // Notifications Firebase : activées au build quand android/app/google-services.json est présent (VITE_PUSH=1)
  push: import.meta.env.VITE_PUSH === "1",
  socialLogin: false,      // Connexion Google / Apple / Facebook (pas d'OAuth natif)
  mobileMoney: false,      // Paiements Airtel / MTN / Kolo (v2)
  imageSearch: false,      // Recherche par photo (pas de moteur de similarité)
  liveShopping: false,     // Live shopping (pas de streaming)
  groupOrder: false,       // Commande en groupe entre amis (pas d'invitations réelles)
  rewardsWheel: false,     // Roue de la fortune (gains tirés côté client)
  driverBoost: false,      // Boost payant livreur
  orderModify: false,      // Modification d'une commande après validation
  reviewPhotos: true,      // Photos jointes aux avis (POST /reviews/photo)
  reportExport: false,     // Export PDF/Excel des rapports vendeur
  loyaltyProgram: false,   // Points fidélité / récompenses (non utilisables, avantages non appliqués)
  qrScan: false,           // Scan QR (renvoyait un produit au hasard)
  recurringOrders: false,  // Abonnements / commandes récurrentes (aucune commande générée)
  priceAlerts: false,      // Alertes prix (aucune notification envoyée)
  groupBuy: false,         // Achats groupés (création vendeur non branchée sur l'API)

  // Outils vendeur sans backend fonctionnel (masqués du menu)
  vendorQA: false,         // Questions clients (les acheteurs ne peuvent pas en poser)
  vendorStories: false,    // Stories (non affichées côté acheteur)
  autoDiscounts: false,    // Remises automatiques (jamais appliquées au paiement)
  vendorAds: false,        // Publicités (jamais affichées aux acheteurs)
  vendorRanking: false,    // Classement des vendeurs (pas d'API)
  vendorAdvisor: false,    // Conseiller business (pas d'API)
  emailMarketing: false,   // Campagnes email (aucun envoi réel)
  certification: false,    // Boutique certifiée (pas d'API)
  vendorWebsite: false,    // Site web, thèmes, domaine, SEO (pas de site public généré)
  importExport: false,     // Import / export CSV (pas d'API)
  apiAccess: false,        // API publique v2 (n'existe pas)
  paymentProofs: false,    // Envoi de preuves de paiement commission / abonnement (pas d'API)
  passwordLogin: false,    // Mot de passe (la connexion se fait uniquement par code SMS)
  profileImages: false,    // Logo / couverture / photo de profil vendeur & livreur (pas d'API d'upload)
};

export default FEATURES;
