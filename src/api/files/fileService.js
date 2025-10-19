import apiClient from '../client';
import { API_ENDPOINTS } from '../../constants/api';

export const fileService = {
  // Upload file to any room (DM or Channel)
  uploadFile: async (roomId, file, description = '') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);

      const response = await apiClient.post(`${API_ENDPOINTS.FILES.UPLOAD}/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        file: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to upload file',
      };
    }
  },
};

export default fileService;
