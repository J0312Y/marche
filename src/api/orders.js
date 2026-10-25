import api from './client';

const orders = {
  getAll: (status, page = 1, limit = 20) => api.get(`/orders?page=${page}&limit=${limit}${status ? '&status=' + status : ''}`),
  getDetail: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  track: (id) => api.get(`/orders/${id}/track`),
};

export default orders;
