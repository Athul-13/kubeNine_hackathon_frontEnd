import apiClient from '../client';
import { API_ENDPOINTS } from '../../constants/api';

// Rooms API service
export const roomsService = {
  // Get all rooms/channels
  getRooms: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ROOMS.ROOMS);
      return {
        success: true,
        rooms: response.data.update || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get rooms',
      };
    }
  },

  // Get room info
  getRoomInfo: async (roomId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ROOMS.ROOM_INFO}?roomId=${roomId}`);
      return {
        success: true,
        room: response.data.channel,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get room info',
      };
    }
  },

  // Get channel members
  getChannelMembers: async (roomId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ROOMS.MEMBERS}?roomId=${roomId}`);
      return {
        success: true,
        members: response.data.members || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get channel members',
      };
    }
  },

  // Join a room
  joinRoom: async (roomId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ROOMS.JOIN, {
        roomId: roomId,
      });
      return {
        success: true,
        room: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to join room',
      };
    }
  },

  // Leave a room
  leaveRoom: async (roomId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ROOMS.LEAVE, {
        roomId: roomId,
      });
      return {
        success: true,
        room: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to leave room',
      };
    }
  },

  // Create a room
  createRoom: async (roomData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ROOMS.CREATE, roomData);
      return {
        success: true,
        room: response.data.room,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create room',
      };
    }
  },
};

export default roomsService;
