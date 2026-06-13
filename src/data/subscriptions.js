// Recurring orders / subscriptions
export const USER_SUBSCRIPTIONS = [
  {
    id: "sub-1",
    name: "Courses hebdomadaires",
    vendor: "Supermarché Park'n'Shop",
    vendorIcon: "",
    items: [
      { id: "p3", name: "Riz parfumé 5kg", qty: 2, price: 8500, img: "" },
      { id: "p8", name: "Huile végétale 5L", qty: 1, price: 6500, img: "️" },
      { id: "p12", name: "Pack eau 1.5L ×6", qty: 3, price: 3000, img: "" },
    ],
    total: 22500,
    frequency: "weekly", // weekly | biweekly | monthly
    nextDate: "Samedi 21 Juin",
    nextDays: 5,
    status: "active", // active | paused | cancelled
    deliveryTime: "10:00",
    address: "Bacongo, Av. Foch",
    createdAt: "12 Avril 2026",
    totalOrders: 8,
    totalSaved: 4500,
  },
  {
    id: "sub-2",
    name: "Petit-déj. famille",
    vendor: "Boulangerie La Royale",
    vendorIcon: "",
    items: [
      { id: "p10", name: "Croissants ×6", qty: 1, price: 3000, img: "" },
      { id: "p11", name: "Baguette tradition", qty: 3, price: 600, img: "" },
    ],
    total: 4800,
    frequency: "weekly",
    nextDate: "Dimanche 22 Juin",
    nextDays: 6,
    status: "active",
    deliveryTime: "07:30",
    address: "Bacongo, Av. Foch",
    createdAt: "1er Mai 2026",
    totalOrders: 6,
    totalSaved: 2400,
  },
  {
    id: "sub-3",
    name: "Pharmacie mensuelle",
    vendor: "Pharmacie Mavré",
    vendorIcon: "",
    items: [
      { id: "p7", name: "Doliprane 1000mg x16", qty: 1, price: 1500, img: "" },
    ],
    total: 1500,
    frequency: "monthly",
    nextDate: "1er Juillet",
    nextDays: 15,
    status: "paused",
    deliveryTime: "16:00",
    address: "Bacongo, Av. Foch",
    createdAt: "1er Mars 2026",
    totalOrders: 3,
    totalSaved: 600,
  },
];

export const FREQUENCY_LABELS = {
  daily: { label: "Tous les jours", icon: "", short: "Quotidien" },
  weekly: { label: "Chaque semaine", icon: "", short: "Hebdo" },
  biweekly: { label: "Toutes les 2 semaines", icon: "️", short: "Bi-mensuel" },
  monthly: { label: "Chaque mois", icon: "️", short: "Mensuel" },
};

export default { USER_SUBSCRIPTIONS, FREQUENCY_LABELS };
