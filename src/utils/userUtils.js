// User utility functions for Rocket.Chat user data

/**
 * Get user's display name (name or username fallback)
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  return user.name || user.username || 'Unknown User';
};

/**
 * Get user's primary email address
 */
export const getUserEmail = (user) => {
  if (!user || !user.emails || !Array.isArray(user.emails)) return null;
  return user.emails[0]?.address || null;
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user, role) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  return user.roles.includes(role);
};

/**
 * Check if user is admin
 */
export const isAdmin = (user) => {
  return hasRole(user, 'admin');
};

/**
 * Check if user is online
 */
export const isOnline = (user) => {
  if (!user) return false;
  return user.status === 'online' && user.statusConnection === 'online';
};

/**
 * Get user's avatar URL or default
 */
export const getUserAvatar = (user, size = 'medium') => {
  if (!user) return null;
  
  if (user.avatarUrl) {
    // Add size parameter if needed
    return user.avatarUrl;
  }
  
  // Return default avatar or initials
  return null;
};

/**
 * Get user's status with connection info
 */
export const getUserStatus = (user) => {
  if (!user) return 'offline';
  
  if (user.statusConnection === 'online') {
    return user.status || 'online';
  }
  
  return 'offline';
};

/**
 * Format user's timezone offset
 */
export const formatTimezoneOffset = (user) => {
  if (!user || user.utcOffset === undefined) return 'UTC';
  
  const offset = user.utcOffset;
  const sign = offset >= 0 ? '+' : '-';
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  
  return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
