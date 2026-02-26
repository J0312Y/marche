import api from './client';

const driver = {
  // Register & Dashboard
  register: (data) => api.post('/driver/register', data),
  dashboard: () => api.get('/driver/dashboard'),

  // Deliveries
  available: () => api.get('/driver/deliveries'),
  acceptDelivery: (id) => api.post(`/driver/deliveries/${id}/accept`),
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
  withdraw: (amount, method, phone_number) => api.post('/driver/wallet/withdraw', { amount, method, phone_number }),

  // Stats
  stats: (period = 'month') => api.get(`/driver/stats?period=${period}`),
};

export default driver;
