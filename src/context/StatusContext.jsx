import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api';

const StatusContext = createContext(null);

export const StatusProvider = ({ children }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [userStatus, setUserStatus] = useState('offline');

  // Initialize status from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUserStatus(parsedUserData.status || 'offline');
    }
  }, []);

  // Set user status
  const updateUserStatus = async (status, message = '') => {
    try {
      setIsUpdatingStatus(true);
      const response = await authService.setStatus(status, message);
      
      // Update local storage with new status
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.status = status;
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update local state
      setUserStatus(status);
      
      return response;
    } catch (error) {
      console.error('Failed to update status:', error);
      throw error;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Set status to online (for login)
  const setOnline = async () => {
    return await updateUserStatus('online', 'User is online');
  };

  // Set status to offline (for logout)
  const setOffline = async () => {
    return await updateUserStatus('offline', 'User is offline');
  };

  // Set custom status
  const setCustomStatus = async (status, message = '') => {
    return await updateUserStatus(status, message);
  };

  // Get current status
  const getCurrentStatus = () => userStatus;

  const value = {
    userStatus,
    setOnline,
    setOffline,
    setCustomStatus,
    isUpdatingStatus,
    getCurrentStatus,
  };

  return (
    <StatusContext.Provider value={value}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
};
