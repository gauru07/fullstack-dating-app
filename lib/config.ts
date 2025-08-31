// Backend API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/login`,
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGOUT: `${API_BASE_URL}/logout`,
  CHECK_AUTH: `${API_BASE_URL}/check-auth`,
  
  // User
  PROFILE_VIEW: `${API_BASE_URL}/profile/view`,
  PROFILE_UPLOAD_PHOTOS: `${API_BASE_URL}/profile/upload-photos`,
  USER_CONNECTIONS: `${API_BASE_URL}/user/connections`,
  USER_FEED: `${API_BASE_URL}/user/feed`,
  
  // Requests
  REQUEST_RECEIVED: `${API_BASE_URL}/user/request/received`,
  REQUEST_SEND_INTERESTED: (userId: string) => `${API_BASE_URL}/request/send/interested/${userId}`,
  REQUEST_SEND_IGNORED: (userId: string) => `${API_BASE_URL}/request/send/ignored/${userId}`,
  REQUEST_REVIEW_ACCEPTED: (requestId: string) => `${API_BASE_URL}/request/review/accepted/${requestId}`,
  REQUEST_REVIEW_REJECTED: (requestId: string) => `${API_BASE_URL}/request/review/rejected/${requestId}`,
  
  // Feed
  FEED: `${API_BASE_URL}/feed`,
};
