import apiClient from '../client';
import { API_ENDPOINTS } from '../../constants/api';

// Authentication API endpoints
export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        user: credentials.username,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/api/v1/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default authService;
