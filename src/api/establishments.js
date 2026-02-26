import api from './client';

const establishments = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    return api.get(`/establishments?${params}`);
  },
  getDetail: (id) => api.get(`/establishments/${id}`),
  getArticles: (id, page = 1) => api.get(`/establishments/${id}/articles?page=${page}`),
  getNearby: (lat, lng, radius = 10) => api.get(`/establishments/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

export default establishments;
