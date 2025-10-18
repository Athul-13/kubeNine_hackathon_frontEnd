// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_ROCKETCHAT_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/login',
    LOGOUT: '/api/v1/logout',
  },
  USERS: {
    PROFILE: '/api/v1/me',
    USERS: '/api/v1/users.list',
    STATUS: '/api/v1/users.setStatus',
  },
  CHANNELS: {
    LIST: '/api/v1/channels.list',
  },
  ROOMS: {
    ROOMS: '/api/v1/rooms.get',
    ROOM_INFO: '/api/v1/channels.info',
    JOIN: '/api/v1/channels.join',
    LEAVE: '/api/v1/channels.leave',
    CREATE: '/api/v1/channels.create',
    MEMBERS: '/api/v1/channels.members',
  },
  MESSAGES: {
    CHANNEL_MESSAGES: '/api/v1/channels.history',
    DIRECT_MESSAGES: '/api/v1/im.messages',
    SEND_MESSAGE: '/api/v1/chat.sendMessage',
    PIN_MESSAGE: '/api/v1/chat.pinMessage',
    UNPIN_MESSAGE: '/api/v1/chat.unPinMessage',
    GET_PINNED_MESSAGES: '/api/v1/chat.getPinnedMessages',
    GET_THREAD_MESSAGES: '/api/v1/chat.getThreadMessages',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};
