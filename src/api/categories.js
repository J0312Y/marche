import api from './client';

const categories = {
  getAll: (type) => api.get(`/categories${type ? '?type=' + type : ''}`),
  getDetail: (id, page = 1) => api.get(`/categories/${id}?page=${page}`),
};

export default categories;
