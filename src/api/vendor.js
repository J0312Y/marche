import api from './client';

const vendor = {
  // Dashboard
  register: (name, type, plan, description) =>
    api.post('/vendor/register', { name, type, plan, description }),
  dashboard: (period = 'month', establishment_id) =>
    api.get(`/vendor/dashboard?period=${period}${establishment_id ? '&establishment_id=' + establishment_id : ''}`),

  // Orders
  orders: (status, page = 1) => api.get(`/vendor/orders?page=${page}${status && status !== 'all' ? '&status=' + status : ''}`),
  orderDetail: (id) => api.get(`/vendor/orders/${id}`),
  // extra.driver_id : à l'acceptation, confier la commande à un livreur attitré du commerce
  updateOrderStatus: (id, status, message, extra = {}) => api.put(`/vendor/orders/${id}/status`, { status, message, ...extra }),
  // Livreurs attitrés du commerce
  ownDrivers: () => api.get('/vendor/drivers'),
  addOwnDriver: (phone) => api.post('/vendor/drivers', { phone }),
  removeOwnDriver: (id) => api.delete(`/vendor/drivers/${id}`),

  // Articles
  articles: () => api.get('/vendor/articles'),
  createArticle: (data) => api.post('/vendor/articles', data),
  updateArticle: (id, data) => api.put(`/vendor/articles/${id}`, data),
  deleteArticle: (id) => api.delete(`/vendor/articles/${id}`),

  // Rayons (articles.menu_section)
  sections: () => api.get('/vendor/sections'),
  orderSections: (sections) => api.put('/vendor/sections/order', { sections }),
  renameSection: (from, to) => api.put('/vendor/sections/rename', { from, to }),

  // Promos
  promos: () => api.get('/vendor/promos'),
  createPromo: (data) => api.post('/vendor/promos', data),
  updatePromo: (id, data) => api.put(`/vendor/promos/${id}`, data),
  deletePromo: (id) => api.delete(`/vendor/promos/${id}`),

  // Delivery
  deliveries: () => api.get('/vendor/deliveries'),
  assignDriver: (delivery_id, driver_id) => api.post(`/vendor/deliveries/${delivery_id}/assign`, { driver_id }),
  assignDriverToOrder: (order_id, driver_id) => api.post('/vendor/deliveries/assign-to-order', { order_id, driver_id }),
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
  submitCommissionProof: (formData) => api.upload('/vendor/wallet/commission-proof', formData),

  // Reports
  reports: (period = 'month') => api.get(`/vendor/reports?period=${period}`),

  // Reviews
  reviews: (page = 1) => api.get(`/vendor/reviews?page=${page}`),
  replyReview: (reviewId, reply) => api.post(`/vendor/reviews/${reviewId}/reply`, { reply }),

  // Followers
  followers: (page = 1) => api.get(`/vendor/followers?page=${page}`),

  // Settings
  settings: () => api.get('/vendor/settings'),
  updateSettings: (data) => api.put('/vendor/settings', data),

  // Ads
  ads: () => api.get('/vendor/ads'),
  createAd: (data) => api.post('/vendor/ads', data),
  updateAd: (id, data) => api.put(`/vendor/ads/${id}`, data),
  deleteAd: (id) => api.delete(`/vendor/ads/${id}`),

  // Stories
  stories: () => api.get('/vendor/stories'),
  createStory: (data) => api.upload('/vendor/stories', data),
  deleteStory: (id) => api.delete(`/vendor/stories/${id}`),

  // Q&A
  questions: () => api.get('/vendor/questions'),
  answerQuestion: (id, answer) => api.put(`/vendor/questions/${id}`, { answer }),

  // Auto discounts
  autoDiscounts: () => api.get('/vendor/discounts/auto'),
  createAutoDiscount: (data) => api.post('/vendor/discounts/auto', data),
  updateAutoDiscount: (id, data) => api.put(`/vendor/discounts/auto/${id}`, data),
  deleteAutoDiscount: (id) => api.delete(`/vendor/discounts/auto/${id}`),

  // Group buys
  groupBuys: () => api.get('/vendor/group-buys'),
  createGroupBuy: (data) => api.post('/vendor/group-buys', data),
  deleteGroupBuy: (id) => api.delete(`/vendor/group-buys/${id}`),

  // Email campaigns
  emailCampaigns: () => api.get('/vendor/email-campaigns'),
  createEmailCampaign: (data) => api.post('/vendor/email-campaigns', data),
  sendEmailCampaign: (id) => api.post(`/vendor/email-campaigns/${id}/send`),
  deleteEmailCampaign: (id) => api.delete(`/vendor/email-campaigns/${id}`),

  // Website / CMS
  websitePages: () => api.get('/vendor/website/pages'),
  createPage: (data) => api.post('/vendor/website/pages', data),
  updatePage: (id, data) => api.put(`/vendor/website/pages/${id}`, data),
  deletePage: (id) => api.delete(`/vendor/website/pages/${id}`),

  // Analytics
  analytics: (period) => api.get(`/vendor/analytics?period=${period || 'month'}`),

  // Calendar
  calendarOrders: (year, month) => api.get(`/vendor/calendar?year=${year}&month=${month}`),

  // Invoice
  invoices: () => api.get('/vendor/invoices'),
  createInvoice: (orderId) => api.post(`/vendor/invoices`, { order_id: orderId }),

  // Stock
  stock: () => api.get('/vendor/stock'),
  updateStock: (id, quantity) => api.put(`/vendor/stock/${id}`, { stock: quantity }),

  // Returns
  returns: () => api.get('/vendor/returns'),
  // action : 'approve' | 'refuse'
  handleReturn: (id, action) => api.put(`/vendor/returns/${id}/${action}`),

  // Clients (CRM)
  clients: (page) => api.get(`/vendor/clients?page=${page || 1}`),
  clientDetail: (id) => api.get(`/vendor/clients/${id}`),
  broadcastClients: (title, message) => api.post('/vendor/clients/broadcast', { title, message }),

  // Certification
  certificationStatus: () => api.get('/vendor/certification'),
  applyCertification: (data) => api.post('/vendor/certification', data),

  // Domain
  domain: () => api.get('/vendor/domain'),
  updateDomain: (data) => api.put('/vendor/domain', data),

  // Ranking
  ranking: (period) => api.get(`/vendor/ranking?period=${period || 'month'}`),

  // SEO
  productSeo: () => api.get('/vendor/seo'),
  updateProductSeo: (id, data) => api.put(`/vendor/seo/${id}`, data),

  // Import/Export
  importProducts: (formData) => api.upload('/vendor/import', formData),
  exportProducts: (format) => api.get(`/vendor/export?format=${format || 'csv'}`),
  exportOrders: (format) => api.get(`/vendor/orders/export?format=${format || 'csv'}`),

  // Available drivers
  availableDrivers: () => api.get('/vendor/drivers/available'),
  inviteDriver: (data) => api.post('/vendor/drivers/invite', data),
  driverHistory: (id) => api.get(`/vendor/drivers/${id}/history`),

  // Business Advisor
  advisor: () => api.get('/vendor/advisor'),

  // Profile images
  uploadLogo: (formData) => api.upload('/vendor/profile/logo', formData),
  uploadCover: (formData) => api.upload('/vendor/profile/cover', formData),
};

export default vendor;
