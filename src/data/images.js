/**
 * Images par défaut — illustrations neutres (SVG en ligne, aucune dépendance réseau).
 * Utilisées uniquement quand l'utilisateur / la boutique n'a pas encore d'image.
 * Ne jamais mettre ici de photo de personne réelle : elle apparaîtrait comme celle de l'utilisateur.
 */

const svg = (body, bg = "#FFF1E6", viewBox = "0 0 100 100") =>
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice"><rect width="100%" height="100%" fill="${bg}"/>${body}</svg>`);

const ORANGE = "#F97316";
const SOFT = "#FDBA74";

// Silhouette générique (personne)
const PERSON = `<circle cx="50" cy="38" r="17" fill="${SOFT}"/><path d="M18 92c0-19 14-32 32-32s32 13 32 32z" fill="${SOFT}"/>`;
// Boutique
const STORE = `<path d="M24 40h52l-4-14H28z" fill="${ORANGE}"/><rect x="28" y="40" width="44" height="34" rx="3" fill="${SOFT}"/><rect x="44" y="54" width="12" height="20" fill="${ORANGE}"/>`;
// Livreur (deux-roues)
const SCOOTER = `<circle cx="30" cy="68" r="10" fill="none" stroke="${ORANGE}" stroke-width="5"/><circle cx="72" cy="68" r="10" fill="none" stroke="${ORANGE}" stroke-width="5"/><path d="M30 68h24l10-24h10" fill="none" stroke="${ORANGE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="34" y="40" width="20" height="16" rx="3" fill="${SOFT}"/>`;

// App branding
export const LAMUKA_LOGO = "/icon-192.png";

// Utilisateurs
export const USER_AVATAR = svg(PERSON);
export const USER_AVATAR_FEMALE = USER_AVATAR;

// Livreur
export const DRIVER_PHOTO = svg(PERSON, "#FFEDD5");
export const VEHICLE_PHOTO = svg(SCOOTER, "#FFF7ED", "0 0 100 100");

// Boutique
export const VENDOR_LOGO_DEFAULT = svg(STORE);
export const VENDOR_COVER = svg(`<rect width="100%" height="100%" fill="url(#g)"/><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#F97316"/><stop offset="1" stop-color="#FDBA74"/></linearGradient></defs>`, "#F97316", "0 0 300 100");
export const DRIVER_COVER = VENDOR_COVER;

// Avatars de conversation (par rôle)
export const CHAT_AVATARS = {
  client: USER_AVATAR,
  driver: DRIVER_PHOTO,
  vendor: VENDOR_LOGO_DEFAULT,
  femme1: USER_AVATAR,
  homme1: USER_AVATAR,
  femme2: USER_AVATAR,
};

export default { LAMUKA_LOGO, USER_AVATAR, DRIVER_PHOTO, VEHICLE_PHOTO, VENDOR_LOGO_DEFAULT, VENDOR_COVER, DRIVER_COVER, CHAT_AVATARS };
