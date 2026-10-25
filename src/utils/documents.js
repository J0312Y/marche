// Documents imprimables du serveur (reçu, relevé) : { path, k } → adresse complète, ouverte dans le navigateur du téléphone
const BASE = import.meta.env.VITE_API_URL || "http://localhost/lamuka-api/api/v1";

export const documentUrl = (doc) => (doc?.path && doc?.k ? `${BASE}/${doc.path}?k=${doc.k}` : null);

/** Ouvre le document hors de l'app (le navigateur permet « Enregistrer en PDF » ou le partage) */
export function openDocument(doc) {
  const url = documentUrl(doc);
  if (!url) return false;
  const a = document.createElement("a");
  a.href = url; a.target = "_blank"; a.rel = "noopener";
  document.body.appendChild(a); a.click(); a.remove();
  return true;
}
