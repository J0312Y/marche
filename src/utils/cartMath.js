/**
 * Calculs du panier — alignés sur ceux du serveur (Orders::_create / Coupon_model::verify).
 * L'API renvoie prix et quantités sous forme de chaînes : toujours convertir avant de calculer
 * (sinon "15000" + 0 donne "150000").
 */

export const lineQty = (c) => parseInt(c?.quantity ?? c?.qty ?? 1, 10) || 1;
// unit_price = prix de l'article + suppléments des options (calculé par le serveur, ou localement pour un invité)
export const linePrice = (c) => parseFloat(c?.unit_price ?? (c?.product || c)?.price) || 0;
export const lineTotal = (c) => (linePrice(c) + (parseFloat(c?.sidesTotal) || 0)) * lineQty(c);
export const cartSubtotal = (cart = []) => cart.reduce((s, c) => s + lineTotal(c), 0);

/**
 * Coupon appliqué : { code, type: 'percentage'|'fixed'|'free_delivery', value, max_discount }
 * Même formule que le serveur : pourcentage arrondi à l'inférieur, plafonné par max_discount.
 */
export function couponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  const value = parseFloat(coupon.value) || 0;
  let d = 0;
  if (coupon.type === "percentage") d = Math.floor((subtotal * value) / 100);
  else if (coupon.type === "fixed") d = value;
  const cap = parseFloat(coupon.max_discount) || 0;
  if (cap > 0 && d > cap) d = cap;
  return Math.min(d, subtotal);
}

export const couponLabel = (c) =>
  !c ? "" : c.type === "fixed" ? `-${Math.round(parseFloat(c.value) || 0).toLocaleString("fr-FR")} F`
  : c.type === "free_delivery" ? "Livraison offerte"
  : `-${parseFloat(c.value) || 0}%`;

/** Supplément total des options choisies. selected : [{group, name}] ; groups : option_groups de l'article */
export function optionsDelta(groups = [], selected = []) {
  let d = 0;
  for (const s of selected) {
    const g = groups.find((x) => x.key === s.group);
    const o = g?.options.find((x) => x.name === s.name);
    if (o) d += parseFloat(o.price_delta) || 0;
  }
  return d;
}

/** Texte court des options d'une ligne : « Accompagnement : Frites · Suppléments : Oeuf, Avocat » */
export function optionsLabel(options = []) {
  if (!Array.isArray(options) || !options.length) return "";
  const by = {};
  for (const o of options) (by[o.label || o.group] ||= []).push(o.name);
  return Object.entries(by).map(([k, v]) => `${k} : ${v.join(", ")}`).join(" · ");
}

/** Erreur de saisie des options (même règles que le serveur) ou null */
export function optionsError(groups = [], selected = []) {
  for (const g of groups) {
    const n = selected.filter((s) => s.group === g.key).length;
    if (g.required && n === 0) return "Choisissez : " + g.label;
    if (g.type === "multi" && g.max > 0 && n > g.max) return `${g.max} choix maximum : ${g.label}`;
  }
  return null;
}
