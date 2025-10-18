import apiClient from '../client';

// Message API endpoints
export const messageService = {
  // Get messages for a channel
  getMessages: async (channelId, params = {}) => {
    try {
      const response = await apiClient.get(`/channels/${channelId}/messages`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send message to channel
  sendMessage: async (channelId, messageData) => {
    try {
      const response = await apiClient.post(`/channels/${channelId}/messages`, messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update message
  updateMessage: async (messageId, messageData) => {
    try {
      const response = await apiClient.put(`/messages/${messageId}`, messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete message
  deleteMessage: async (messageId) => {
    try {
      const response = await apiClient.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get direct messages
  getDirectMessages: async (userId, params = {}) => {
    try {
      const response = await apiClient.get(`/messages/direct/${userId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send direct message
  sendDirectMessage: async (userId, messageData) => {
    try {
      const response = await apiClient.post(`/messages/direct/${userId}`, messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default messageService;
