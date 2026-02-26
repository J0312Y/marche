import api from './client';

const wallets = {
  getBalance: () => api.get('/wallets/balance'),
  topup: (amount, method, phone_number) => api.post('/wallets/topup', { amount, method, phone_number }),
  withdraw: (amount, method, phone_number) => api.post('/wallets/withdraw', { amount, method, phone_number }),
  transactions: (type, page = 1) => api.get(`/wallets/transactions?page=${page}${type ? '&type=' + type : ''}`),
};

export default wallets;
