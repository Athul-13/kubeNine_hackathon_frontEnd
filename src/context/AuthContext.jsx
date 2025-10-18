import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Extract essential user information from Rocket.Chat response
const extractUserInfo = (userData) => {
  return {
    _id: userData._id,
    name: userData.name,
    emails: userData.emails,
    status: userData.status,
    statusConnection: userData.statusConnection,
    username: userData.username,
    active: userData.active,
    roles: userData.roles,
    avatarUrl: userData.avatarUrl,
    utcOffset: userData.utcOffset,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const userData = localStorage.getItem('user');
        
        if (token && userId) {
          // Try to get fresh user data from server
          try {
            const response = await authService.getUserProfile();
            const userInfo = extractUserInfo(response);
            setUser(userInfo);
            setIsAuthenticated(true);
            // Update cached data with fresh info
            localStorage.setItem('user', JSON.stringify(userInfo));
          } catch (apiError) {
            console.warn('Failed to fetch fresh user data, using cached data:', apiError);
            // If API fails, use cached data as fallback
            if (userData) {
              setUser(JSON.parse(userData));
              setIsAuthenticated(true);
            } else {
              // Clear everything if no cached data
              localStorage.removeItem('authToken');
              localStorage.removeItem('userId');
              localStorage.removeItem('user');
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          // Clear any incomplete data
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear all data on any error
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      console.log(response);
      // Rocket.Chat response format: { status: "success", data: { authToken, userId, me } }
      if (response.status === 'success') {
        const { authToken, userId, me } = response.data;
        
        // Extract essential user information
        const userInfo = extractUserInfo(me);
        
        // Store token and user data
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        setUser(userInfo);
        setIsAuthenticated(true);
        
        return response;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      throw error.response?.data || error.message;
    } finally {
      setIsLoading(false);
    }
  };


  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Update user function
  const updateUser = (userData) => {
    const userInfo = extractUserInfo(userData);
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
