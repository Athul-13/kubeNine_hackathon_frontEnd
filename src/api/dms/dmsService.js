import apiClient from '../client';
import { API_ENDPOINTS } from '../../constants/api';

// DMs API service
export const dmsService = {
  // Get list of direct messages
  getDMs: async (count = 50, offset = 0) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.DMS.LIST}?count=${count}&offset=${offset}`);
      return {
        success: true,
        dms: response.data.ims || [],
        total: response.data.total || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get direct messages',
        dms: [],
      };
    }
  },

  // Create a new direct message
  createDM: async (username) => {
    try {
      console.log('Creating DM with username:', username);
      const response = await apiClient.post(API_ENDPOINTS.DMS.CREATE, {
        username
      });
      console.log('DM creation response:', response.data);
      return {
        success: true,
        dm: response.data.dm,
      };
    } catch (error) {
      console.error('DM creation error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create direct message',
      };
    }
  },
};

export default dmsService;
