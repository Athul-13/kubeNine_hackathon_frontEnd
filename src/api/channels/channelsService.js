import apiClient from '../client';
import { API_ENDPOINTS } from '../../constants/api';

// Channels API service
export const channelsService = {
  // Get list of channels
  getChannels: async (count = 50, offset = 0) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CHANNELS.LIST}?count=${count}&offset=${offset}`);
      return {
        success: true,
        channels: response.data.channels || [],
        total: response.data.total || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get channels',
      };
    }
  },

  // Create a new channel
  createChannel: async (channelData) => {
    try {
      console.log('🌐 API Request Details:');
      console.log('📍 Endpoint:', API_ENDPOINTS.ROOMS.CREATE);
      console.log('📦 Request Payload:', JSON.stringify(channelData, null, 2));
      
      const response = await apiClient.post(API_ENDPOINTS.ROOMS.CREATE, channelData);
      
      console.log('📡 API Response Details:');
      console.log('📊 Status:', response.status);
      console.log('📋 Full Response:', JSON.stringify(response.data, null, 2));
      console.log('🏠 Channel Object:', response.data.channel);
      
      return {
        success: true,
        channel: response.data.channel,
      };
    } catch (error) {
      console.log('💥 API Error Details:');
      console.log('🚨 Error Status:', error.response?.status);
      console.log('📝 Error Data:', error.response?.data);
      console.log('🔍 Full Error:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create channel',
      };
    }
  },

};

export default channelsService;
