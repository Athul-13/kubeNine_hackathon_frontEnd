import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { roomsService } from '../api/rooms/roomsService';
import { useAuth } from './AuthContext';

const RoomsContext = createContext(null);

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load all rooms
  const loadRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await roomsService.getRooms();
      
      if (result.success) {
        setRooms(result.rooms);
        // Don't auto-select any room - let user choose
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load rooms when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadRooms();
    } else {
      // Clear rooms when user logs out
      setRooms([]);
      setCurrentRoom(null);
      setError(null);
    }
  }, [isAuthenticated, loadRooms]);

  // Select a room
  const selectRoom = (room) => {
    setCurrentRoom(room);
    setError(null);
  };

  // Join a room
  const joinRoom = async (roomId) => {
    try {
      setIsLoading(true);
      const result = await roomsService.joinRoom(roomId);
      
      if (result.success) {
        // Reload rooms to get updated list
        await loadRooms();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMsg = 'Failed to join room';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Leave a room
  const leaveRoom = async (roomId) => {
    try {
      setIsLoading(true);
      const result = await roomsService.leaveRoom(roomId);
      
      if (result.success) {
        // Remove room from list
        setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
        // Clear current room if it was the one left
        if (currentRoom && currentRoom._id === roomId) {
          setCurrentRoom(null);
        }
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMsg = 'Failed to leave room';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Create a room
  const createRoom = async (roomData) => {
    try {
      setIsLoading(true);
      const result = await roomsService.createRoom(roomData);
      
      if (result.success) {
        // Reload rooms to include the new room
        await loadRooms();
        return { success: true, room: result.room };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMsg = 'Failed to create room';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Get room info
  const getRoomInfo = async (roomId) => {
    try {
      const result = await roomsService.getRoomInfo(roomId);
      return result;
    } catch {
      return { success: false, error: 'Failed to get room info' };
    }
  };

  // Get channel members
  const getChannelMembers = async (roomId) => {
    try {
      const result = await roomsService.getChannelMembers(roomId);
      return result;
    } catch {
      return { success: false, error: 'Failed to get channel members' };
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Room info functions
  const toggleRoomInfo = () => {
    setShowRoomInfo(!showRoomInfo);
  };

  const closeRoomInfo = () => {
    setShowRoomInfo(false);
  };

  const value = {
    rooms,
    currentRoom,
    isLoading,
    error,
    showRoomInfo,
    loadRooms,
    selectRoom,
    joinRoom,
    leaveRoom,
    createRoom,
    getRoomInfo,
    getChannelMembers,
    clearError,
    toggleRoomInfo,
    closeRoomInfo,
  };

  return (
    <RoomsContext.Provider value={value}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error('useRooms must be used within a RoomsProvider');
  }
  return context;
};
