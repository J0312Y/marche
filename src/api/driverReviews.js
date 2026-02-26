import api from './client';

const driverReviews = {
  create: (delivery_id, rating, comment, tip_amount) =>
    api.post('/driver-reviews', { delivery_id, rating, comment, tip_amount }),
  getByDriver: (driver_id, page = 1) => api.get(`/driver-reviews?driver_id=${driver_id}&page=${page}`),
};

export default driverReviews;
