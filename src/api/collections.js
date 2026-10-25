import api from './client';

const collections = {
  getAll: () => api.get('/collections'),
};

export default collections;
