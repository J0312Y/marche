import api from './client';

const coupons = {
  getAll: () => api.get('/coupons'),
  verify: (code, subtotal) => api.post('/coupons/verify', { code, subtotal }),
};

export default coupons;
