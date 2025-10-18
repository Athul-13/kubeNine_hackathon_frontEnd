import apiClient from '../client';
import { API_ENDPOINTS } from '../../constants/api';

// Messages API service
export const messagesService = {
  // Get messages for a room/channel
  getMessages: async (roomName, count = 50, offset = 0, unreads = true) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.MESSAGES.CHANNEL_MESSAGES}?roomName=${roomName}&count=${count}&offset=${offset}&unreads=${unreads}`);
      return {
        success: true,
        messages: response.data.messages || [],
        unreadCount: response.data.unreadNotLoaded || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get messages',
      };
    }
  },

  // Send a message
  sendMessage: async (roomId, message) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.MESSAGES.SEND_MESSAGE, {
        message: {
          rid: roomId,
          msg: message,
        },
      });
      return {
        success: true,
        message: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send message',
      };
    }
  },

  // Get direct messages
  getDirectMessages: async (userId, count = 50) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.MESSAGES.DIRECT_MESSAGES}?userId=${userId}&count=${count}`);
      return {
        success: true,
        messages: response.data.messages || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get direct messages',
      };
    }
  },
};

export default messagesService;
