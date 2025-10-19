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
  sendMessage: async (roomId, message, tmid = null) => {
    try {
      const messageData = {
        message: {
          rid: roomId,
          msg: message,
        },
      };
      
      // Add tmid if it's a thread message
      if (tmid) {
        messageData.message.tmid = tmid;
      }
      
      const response = await apiClient.post(API_ENDPOINTS.MESSAGES.SEND_MESSAGE, messageData);
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

  // Pin a message
  pinMessage: async (messageId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.MESSAGES.PIN_MESSAGE, {
        messageId: messageId,
      });
      return { success: true, message: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to pin message',
      };
    }
  },

  // Unpin a message
  unpinMessage: async (messageId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.MESSAGES.UNPIN_MESSAGE, {
        messageId: messageId,
      });
      return { success: true, message: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to unpin message',
      };
    }
  },

  // Get pinned messages for a room
  getPinnedMessages: async (roomId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.MESSAGES.GET_PINNED_MESSAGES}?roomId=${roomId}`);
      return { success: true, messages: response.data.messages || [] };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get pinned messages',
      };
    }
  },

  // Get thread messages for a specific message
  getThreadMessages: async (tmid, count = 50, offset = 0) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.MESSAGES.GET_THREAD_MESSAGES}?tmid=${tmid}&count=${count}&offset=${offset}`);
      return { success: true, messages: response.data.messages || [] };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get thread messages',
      };
    }
  },

  // Get pinned messages from all channels
  getAllPinnedMessages: async (channels) => {
    try {
      const pinnedMessagesPromises = channels.map(async (channel) => {
        try {
          const response = await apiClient.get(`${API_ENDPOINTS.MESSAGES.GET_PINNED_MESSAGES}?roomId=${channel._id}`);
          return {
            channelId: channel._id,
            channelName: channel.name,
            messages: response.data.messages || [],
            success: true
          };
        } catch (error) {
          console.warn(`Failed to fetch pinned messages for channel ${channel.name}:`, error.response?.data?.error);
          return {
            channelId: channel._id,
            channelName: channel.name,
            messages: [],
            success: false,
            error: error.response?.data?.error
          };
        }
      });

      const results = await Promise.all(pinnedMessagesPromises);
      
      // Filter out channels with no pinned messages and group by channel
      const pinnedByChannel = results
        .filter(result => result.success && result.messages.length > 0)
        .map(result => ({
          channelId: result.channelId,
          channelName: result.channelName,
          messages: result.messages
        }));

      return {
        success: true,
        pinnedByChannel
      };
    } catch (error) {
      console.error('Error fetching all pinned messages:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch pinned messages',
        pinnedByChannel: []
      };
    }
  },
};

export default messagesService;
