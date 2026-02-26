import api from './client';

const vendor = {
  // Dashboard
  register: (name, type, plan, description) =>
    api.post('/vendor/register', { name, type, plan, description }),
  dashboard: (period = 'month', establishment_id) =>
    api.get(`/vendor/dashboard?period=${period}${establishment_id ? '&establishment_id=' + establishment_id : ''}`),

  // Orders
  orders: (status, page = 1) => api.get(`/vendor/orders?page=${page}${status ? '&status=' + status : ''}`),
  orderDetail: (id) => api.get(`/vendor/orders/${id}`),
  updateOrderStatus: (id, status, message) => api.put(`/vendor/orders/${id}/status`, { status, message }),

  // Articles
  articles: () => api.get('/vendor/articles'),
  createArticle: (data) => api.post('/vendor/articles', data),
  updateArticle: (id, data) => api.put(`/vendor/articles/${id}`, data),
  deleteArticle: (id) => api.delete(`/vendor/articles/${id}`),

  // Promos
  promos: () => api.get('/vendor/promos'),
  createPromo: (data) => api.post('/vendor/promos', data),
  deletePromo: (id) => api.delete(`/vendor/promos/${id}`),

  // Delivery
  deliveries: () => api.get('/vendor/deliveries'),
  assignDriver: (delivery_id, driver_id) => api.post(`/vendor/deliveries/${delivery_id}/assign`, { driver_id }),
  trackDelivery: (delivery_id) => api.get(`/vendor/deliveries/${delivery_id}/track`),

  // Team
  team: () => api.get('/vendor/team'),
  inviteMember: (phone, role) => api.post('/vendor/team/invite', { phone, role }),
  removeMember: (id) => api.delete(`/vendor/team/${id}`),

  // Shops (multi-boutique)
  shops: () => api.get('/vendor/shops'),
  createShop: (data) => api.post('/vendor/shops', data),
  getShop: (id) => api.get(`/vendor/shops/${id}`),
  updateShop: (id, data) => api.put(`/vendor/shops/${id}`, data),

  // Wallet
  wallet: () => api.get('/vendor/wallet'),
  withdraw: (amount, method, phone_number) => api.post('/vendor/wallet/withdraw', { amount, method, phone_number }),

  // Reports
  reports: (period = 'month') => api.get(`/vendor/reports?period=${period}`),

  // Reviews
  reviews: (page = 1) => api.get(`/vendor/reviews?page=${page}`),

  // Followers
  followers: (page = 1) => api.get(`/vendor/followers?page=${page}`),

  // Settings
  settings: () => api.get('/vendor/settings'),
  updateSettings: (data) => api.put('/vendor/settings', data),
};

export default vendor;
