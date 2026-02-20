export const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
export const disc = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
