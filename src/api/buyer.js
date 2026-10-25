import api from './client';

const buyer = {
  // Loyalty
  loyalty: () => api.get('/loyalty'),
  checkin: () => api.post('/loyalty/checkin'),

  // Referrals
  referral: () => api.get('/referrals'),

  // Gift cards
  giftCards: () => api.get('/gift-cards'),
  sendGiftCard: (data) => api.post('/gift-cards', data),
  redeemGiftCard: (code) => api.post('/gift-cards/redeem', { code }),

  // Price alerts
  priceAlerts: () => api.get('/price-alerts'),
  createPriceAlert: (article_id, target_price) => api.post('/price-alerts', { article_id, target_price }),
  deletePriceAlert: (id) => api.delete(`/price-alerts/${id}`),

  // Subscriptions
  subscriptions: () => api.get('/subscriptions'),
  createSubscription: (data) => api.post('/subscriptions', data),
  updateSubscription: (id, data) => api.put(`/subscriptions/${id}`, data),
  cancelSubscription: (id) => api.delete(`/subscriptions/${id}`),

  // Stats
  stats: () => api.get('/user/stats'),

  // Group buys
  groupBuys: () => api.get('/group-buys'),
  joinGroupBuy: (id) => api.post(`/group-buys/${id}/join`),

  // Gamification (uses loyalty endpoints)
  missions: () => api.get('/loyalty/missions'),
  spinWheel: () => api.post('/loyalty/spin'),

  // Payment history
  paymentHistory: (page) => api.get(`/payments/history?page=${page || 1}`),

  // Profile
  profile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),

  // Orders
  returnOrder: (id, reason) => api.post(`/orders/${id}/return`, { reason }),
  trackOrder: (id) => api.get(`/orders/${id}/track`),
};

export default buyer;
