import api from './client';

const driver = {
  // Register & Dashboard
  register: (data) => api.post('/driver/register', data),
  dashboard: () => api.get('/driver/dashboard'),

  // Deliveries
  available: () => api.get('/driver/deliveries'),
  acceptDelivery: (id) => api.post(`/driver/deliveries/${id}/accept`),
  // Refuser une course proposée à moi seul : elle passe au livreur suivant
  declineDelivery: (id) => api.post(`/driver/deliveries/${id}/decline`),
  declineErrand: (id) => api.post(`/driver/errands/${id}/decline`),
  pickup: (id, pickup_code) => api.put(`/driver/deliveries/${id}/pickup`, { pickup_code }),
  deliver: (id, delivery_code) => api.put(`/driver/deliveries/${id}/deliver`, { delivery_code }),
  history: (page = 1) => api.get(`/driver/history?page=${page}`),

  // Location
  updateLocation: (latitude, longitude) => api.put('/driver/location', { latitude, longitude }),
  setAvailability: (is_available) => api.put('/driver/availability', { is_available }),

  // Zones
  zones: () => api.get('/driver/zones'),
  addZone: (zone_name) => api.post('/driver/zones', { zone_name }),
  removeZone: (id) => api.delete(`/driver/zones/${id}`),

  // Vehicle
  vehicle: () => api.get('/driver/vehicle'),
  updateVehicle: (data) => api.put('/driver/vehicle', data),

  // Wallet
  wallet: () => api.get('/driver/wallet'),
  cash: () => api.get('/driver/cash'), // espèces encaissées, sa part, déjà remis, reste à remettre à Lamuka
  withdraw: (amount, method, phone_number) => api.post('/driver/wallet/withdraw', { amount, method, phone_number }),
  submitSubscriptionProof: (formData) => api.upload('/driver/wallet/proof', formData),

  // Stats
  stats: (period = 'month') => api.get(`/driver/stats?period=${period}`),

  // Documents
  documents: () => api.get('/driver/documents'),
  uploadDocument: (formData) => api.upload('/driver/documents', formData),

  // Settings
  settings: () => api.get('/driver/settings'),
  updateSettings: (data) => api.put('/driver/settings', data),

  // Delivery detail
  deliveryDetail: (id) => api.get(`/driver/deliveries/${id}`),

  // Rate vendor
  rateVendor: (deliveryId, rating, comment) => api.post(`/driver/deliveries/${deliveryId}/rate`, { rating, comment }),

  // Checklist
  completeChecklist: (id) => api.post(`/driver/deliveries/${id}/checklist`),

  // Profile images
  uploadAvatar: (formData) => api.upload('/driver/profile/avatar', formData),
  uploadCover: (formData) => api.upload('/driver/profile/cover', formData),
};

export default driver;
