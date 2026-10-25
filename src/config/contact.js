import { appInfo } from "./appInfo";

/**
 * Coordonnées du support : réglées dans le panneau (Informations › Coordonnées), lues via /app-info.
 * Les propriétés sont lues au moment de l'appel : elles suivent les changements du panneau.
 */
// Chargées au démarrage par la racine de l'app (useAppInfo dans App.jsx)
const c = () => appInfo()?.contact || {};
const digits = (s) => String(s || "").replace(/[^\d+]/g, "");

const CONTACT = {
  get phone() { return digits(c().phone); },          // format tel:
  get phoneDisplay() { return c().phone || ""; },
  get whatsapp() { return digits(c().whatsapp).replace(/^\+/, ""); }, // format wa.me
  get email() { return c().email || ""; },
  get hours() { return c().hours || ""; },
  get company() { return c().company || ""; },
};

export const telLink = (phone = CONTACT.phone) => `tel:${phone}`;
export const whatsappLink = (text) => `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export default CONTACT;
