import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/api';

// Handle API errors and return user-friendly messages
export const handleApiError = (error) => {
  // Network error
  if (!error.response) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      status: 0,
    };
  }

  const { status, data } = error.response;
  let message = ERROR_MESSAGES.SERVER_ERROR;

  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      message = data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
      break;
    case HTTP_STATUS.UNAUTHORIZED:
      message = data?.message || ERROR_MESSAGES.UNAUTHORIZED;
      break;
    case HTTP_STATUS.FORBIDDEN:
      message = data?.message || ERROR_MESSAGES.FORBIDDEN;
      break;
    case HTTP_STATUS.NOT_FOUND:
      message = data?.message || ERROR_MESSAGES.NOT_FOUND;
      break;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      message = data?.message || ERROR_MESSAGES.SERVER_ERROR;
      break;
    default:
      message = data?.message || ERROR_MESSAGES.SERVER_ERROR;
  }

  return {
    message,
    status,
    data: data || {},
  };
};

// Format validation errors from API response
export const formatValidationErrors = (errors) => {
  if (typeof errors === 'string') {
    return { general: errors };
  }

  if (Array.isArray(errors)) {
    return errors.reduce((acc, error) => {
      const field = error.field || 'general';
      acc[field] = error.message;
      return acc;
    }, {});
  }

  if (typeof errors === 'object' && errors !== null) {
    return errors;
  }

  return { general: 'Validation failed' };
};
