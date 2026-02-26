import api from './client';

const payments = {
  initiate: (order_id, method, phone_number) =>
    api.post('/payments/initiate', { order_id, method, phone_number }),
  getStatus: (id) => api.get(`/payments/${id}/status`),
};

export default payments;
