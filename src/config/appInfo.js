import { useEffect, useState } from "react";
import api from "../api/client";

/**
 * Informations gérées dans le panneau d'administration (« Informations », « Zones de livraison ») :
 * coordonnées du support, règles (fidélité, parrainage, pourboires, coursier), frais par défaut, FAQ.
 * GET /app-info ; la dernière réponse est gardée sur le téléphone pour l'affichage hors connexion.
 */
const KEY = "lk-app-info";
let INFO = (() => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } })();
let pending = null;
const subs = new Set();

export function loadAppInfo(force = false) {
  if (pending && !force) return pending;
  pending = api.get("/app-info?faq=all", { noAuth: true }).then((r) => {
    if (r && r.contact) { INFO = r; try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {} subs.forEach((f) => f(r)); }
    return INFO;
  }).catch(() => { pending = null; return INFO; });
  return pending;
}

/** Valeur actuelle (peut être null avant le premier chargement) */
export const appInfo = () => INFO;

/** Hook : se met à jour quand les informations arrivent */
export function useAppInfo() {
  const [v, setV] = useState(INFO);
  useEffect(() => { subs.add(setV); loadAppInfo(); return () => subs.delete(setV); }, []);
  return v;
}

/** Questions fréquentes d'un public : client | vendor | driver */
export const faqFor = (info, audience) => (info?.faq || []).filter((f) => f.audience === audience);

/** Règles de fidélité (1 point = point_value F) */
export const loyaltyRules = (info = INFO) => ({
  per: Number(info?.loyalty?.spend_per_point) || null,
  min: Number(info?.loyalty?.min_points) || null,
  value: Number(info?.loyalty?.point_value) || 1,
});
