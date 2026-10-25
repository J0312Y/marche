import api from './client';

const auth = {
  checkPhone: (phone) => api.post('/auth/check-phone', { phone }),
  // email : adresse où recevoir le code (inscription, ou compte qui n'en a pas encore)
  sendOTP: (phone, mode = 'login', email) => api.post('/auth/send-otp', { phone, mode, ...(email ? { email } : {}) }),
  verifyOTP: (phone, code, mode = 'login') => api.post('/auth/verify-otp', { phone, code, mode }),
  social: (provider, provider_id, email, name, avatar) =>
    api.post('/auth/social', { provider, provider_id, email, name, avatar }),
  completeProfile: (data) => api.post('/auth/complete-profile', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
};

export default auth;
