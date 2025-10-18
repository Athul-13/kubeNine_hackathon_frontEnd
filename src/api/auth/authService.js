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
      console.log(response.data);
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

  // Set user status
  setStatus: async (status, message = '') => {
    try {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      
      if (!userId || !username) {
        throw new Error('User ID or username not found');
      }

      const response = await apiClient.post('/api/v1/users.setStatus', {
        message,
        status,
        userId,
        username,
      });
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
