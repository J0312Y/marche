import api from './client';

// Coursier : envoyer un colis / faire acheter quelque chose
const errands = {
  quote: (data) => api.post('/errands/quote', data),
  create: (data) => api.post('/errands', data),
  list: () => api.get('/errands'),
  detail: (id) => api.get(`/errands/${id}`),
  cancel: (id, reason) => api.post(`/errands/${id}/cancel`, { reason }),
  // côté livreur
  driverList: () => api.get('/driver/errands'),
  driverHistory: () => api.get('/driver/errands/history'),
  accept: (id) => api.post(`/driver/errands/${id}/accept`, {}),
  pickup: (id, data) => api.post(`/driver/errands/${id}/pickup`, data),
  deliver: (id, code) => api.post(`/driver/errands/${id}/deliver`, { delivery_code: code }),
};

export default errands;
