/**
 * Libellés d'ouverture d'une boutique (champs calculés par le serveur : isOpenNow, opensAt).
 */
const pad = (n) => String(n).padStart(2, "0");

export function parseDate(s) {
  if (!s) return null;
  const d = new Date(String(s).replace(" ", "T"));
  return isNaN(d) ? null : d;
}

/** « aujourd'hui à 08:00 », « demain à 08:00 », « lundi à 08:00 » */
export function whenLabel(date) {
  if (!date) return "";
  const now = new Date();
  const day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayD = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((dayD - day0) / 86400000);
  const hm = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (diff === 0) return `aujourd'hui à ${hm}`;
  if (diff === 1) return `demain à ${hm}`;
  return `${date.toLocaleDateString("fr-FR", { weekday: "long" })} à ${hm}`;
}

/** { open, preorder, label } pour l'affichage sur les cartes */
export function storeStatus(v) {
  if (!v) return { open: true, preorder: false, label: "" };
  if (v.isOpenNow !== false) return { open: true, preorder: false, label: "" };
  const opens = parseDate(v.opensAt);
  if (opens) return { open: false, preorder: true, opens, label: `Précommande pour ${whenLabel(opens)}` };
  return { open: false, preorder: false, label: "Fermé pour le moment" };
}

/** Valeur 'Y-m-d H:i' attendue par l'API pour scheduled_for */
export function toApiDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Délai affiché : « 25 - 45 min » (eta du vendeur) ou estimation par défaut */
// Délai lisible (comme Toters) : « 25 - 40 min », « 2 - 4 h », « 1 - 2 jours »
const span = (a, b) => {
  if (b >= 1440 && a % 1440 === 0 && b % 1440 === 0) return a === b ? `${a / 1440} jour${a > 1440 ? "s" : ""}` : `${a / 1440} - ${b / 1440} jours`;
  if (b >= 120 && a % 60 === 0 && b % 60 === 0) return a === b ? `${a / 60} h` : `${a / 60} - ${b / 60} h`;
  return `${a} - ${b} min`;
};
export const etaLabel = (v) => {
  const a = Number(v?.eta_min), b = Number(v?.eta_max);
  if (a && b) return span(a, b);
  return v?.eta || "30 - 45 min";
};
