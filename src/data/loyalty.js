// Loyalty system — Lamuka Points
export const LEVELS = [
  { id: "bronze", name: "Bronze",   icon: "", color: "#CD7F32", min: 0,      perks: ["1 pt / 100 F dépensé"] },
  { id: "argent", name: "Argent",   icon: "", color: "#9CA3AF", min: 5000,   perks: ["1 pt / 100 F", "Livraison gratuite > 10 000 F"] },
  { id: "or",     name: "Or",       icon: "", color: "#F59E0B", min: 15000,  perks: ["1,5 pt / 100 F", "Livraison gratuite > 5 000 F", "Support prioritaire"] },
  { id: "diamant",name: "Diamant",  icon: "", color: "#3B82F6", min: 50000,  perks: ["2 pt / 100 F", "Livraison gratuite illimitée", "Promotions exclusives", "Cadeau anniversaire"] },
];

// Get user's current level based on total points earned (lifetime)
export const getLevel = (lifetimePoints) => {
  return [...LEVELS].reverse().find(l => lifetimePoints >= l.min) || LEVELS[0];
};

// Get next level for progress
export const getNextLevel = (lifetimePoints) => {
  return LEVELS.find(l => lifetimePoints < l.min) || LEVELS[LEVELS.length - 1];
};

// Default user loyalty (mock)
export const USER_LOYALTY = {
  points: 2450,           // currently available
  lifetimePoints: 8200,   // total ever earned (for level)
  streakDays: 4,          // consecutive days opened
  lastCheckIn: null,      // ISO date
};

// Daily check-in rewards (points)
export const STREAK_REWARDS = [50, 100, 150, 200, 300, 500, 1000];

// Convert points to FCFA (1 point = 1 F)
export const POINTS_TO_FCFA = (points) => points;

export default { LEVELS, USER_LOYALTY, STREAK_REWARDS, getLevel, getNextLevel, POINTS_TO_FCFA };
