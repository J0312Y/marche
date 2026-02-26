import api from './client';

const articles = {
  search: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    return api.get(`/articles?${params}`);
  },
  getDetail: (id) => api.get(`/articles/${id}`),
  getPopular: () => api.get('/articles/popular'),
  getFlash: () => api.get('/articles/flash'),
};

export default articles;
