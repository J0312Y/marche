/**
 * Auth & User Profile Service
 */
import { authAPI, usersAPI } from '../api';

export default {
  checkPhone: async (phone) => {
    return authAPI.checkPhone(phone);
  },

  sendOTP: async (phone, mode = 'login', email) => {
    return authAPI.sendOTP(phone, mode, email);
  },

  verifyOTP: async (phone, code, mode = 'login') => {
    return authAPI.verifyOTP(phone, code, mode);
  },

  social: async (provider, providerId, email, name, avatar) => {
    return authAPI.social(provider, providerId, email, name, avatar);
  },

  completeProfile: async (data) => {
    return authAPI.completeProfile(data);
  },

  getMe: async () => {
    return usersAPI.me();
  },

  updateProfile: async (data) => {
    return usersAPI.update(data);
  },

  updatePassword: async (pwd) => {
    return usersAPI.updatePassword(pwd);
  },

  uploadAvatar: async (file) => {
    return usersAPI.uploadAvatar(file);
  },

  logout: async () => {
    return authAPI.logout();
  },
};
