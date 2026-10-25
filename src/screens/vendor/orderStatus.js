// Statuts de commande côté commerçant : libellé + couleurs (texte, fond)
export const ORDER_ST = {
  pending: { label: "Nouvelle", c: "#1D4ED8", bg: "#E8EFFE" },
  confirmed: { label: "Acceptée", c: "var(--acc-d)", bg: "var(--acc-l)" },
  preparing: { label: "En préparation", c: "#9A5B13", bg: "#FDF1E2" },
  ready: { label: "Prête", c: "var(--acc-d)", bg: "var(--acc-l)" },
  assigned: { label: "Livreur en route", c: "var(--acc-d)", bg: "var(--acc-l)" },
  picked_up: { label: "En livraison", c: "var(--acc-d)", bg: "var(--acc-l)" },
  shipped: { label: "En livraison", c: "var(--acc-d)", bg: "var(--acc-l)" },
  delivering: { label: "En livraison", c: "var(--acc-d)", bg: "var(--acc-l)" },
  delivered: { label: "Livrée", c: "var(--t-sub)", bg: "var(--t-bg2)" },
  cancelled: { label: "Annulée", c: "#B42318", bg: "#FDECEA" },
  refunded: { label: "Remboursée", c: "var(--t-sub)", bg: "var(--t-bg2)" },
};

export const stOf = (s) => ORDER_ST[s] || { label: s || "—", c: "var(--t-sub)", bg: "var(--t-bg2)" };

export const clientName = (o) => o.client || [o.first_name, o.last_name].filter(Boolean).join(" ") || "Client";

export const itemsLine = (items = []) => items.map((it) => `${parseInt(it.quantity || it.qty) || 1}× ${it.article_name || it.name || "Article"}`).join(", ");

export const orderDate = (s) => {
  const t = s ? new Date(String(s).replace(" ", "T")) : null;
  return t && !isNaN(t) ? t.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " · " + t.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
};
