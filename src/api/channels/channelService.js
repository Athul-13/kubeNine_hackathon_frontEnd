import apiClient from '../client';

// Channel API endpoints
export const channelService = {
  // Get all channels
  getChannels: async (params = {}) => {
    try {
      const response = await apiClient.get('/channels', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new channel
  createChannel: async (channelData) => {
    try {
      const response = await apiClient.post('/channels', channelData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get channel by ID
  getChannelById: async (channelId) => {
    try {
      const response = await apiClient.get(`/channels/${channelId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update channel
  updateChannel: async (channelId, channelData) => {
    try {
      const response = await apiClient.put(`/channels/${channelId}`, channelData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete channel
  deleteChannel: async (channelId) => {
    try {
      const response = await apiClient.delete(`/channels/${channelId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Join channel
  joinChannel: async (channelId) => {
    try {
      const response = await apiClient.post(`/channels/${channelId}/join`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Leave channel
  leaveChannel: async (channelId) => {
    try {
      const response = await apiClient.post(`/channels/${channelId}/leave`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default channelService;
