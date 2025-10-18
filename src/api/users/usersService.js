import apiClient from '../client';
import { API_ENDPOINTS } from '../../constants/api';

// Users API service
export const usersService = {
  // Get list of users
  getUsers: async (count = 50, offset = 0, query = '') => {
    try {
      const params = new URLSearchParams({
        count: count.toString(),
        offset: offset.toString(),
      });
      
      if (query.trim()) {
        params.append('query', query.trim());
      }
      
      const response = await apiClient.get(`${API_ENDPOINTS.USERS.USERS}?${params}`);
      return {
        success: true,
        users: response.data.users || [],
        total: response.data.total || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get users',
      };
    }
  },
};

export default usersService;
