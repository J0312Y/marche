import api from './client';

const orders = {
  getAll: (status, page = 1) => api.get(`/orders?page=${page}${status ? '&status=' + status : ''}`),
  getDetail: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  track: (id) => api.get(`/orders/${id}/track`),
};

export default orders;
