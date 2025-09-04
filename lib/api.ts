import { API_BASE_URL } from './config';

// Helper function to make authenticated API calls
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
};

// API helper functions
export const api = {
  // Auth
  login: (emailId: string, password: string) => 
    authenticatedFetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ emailId, password }),
    }),

  logout: () => 
    authenticatedFetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
    }),

  checkAuth: () => 
    authenticatedFetch(`${API_BASE_URL}/check-auth`),

  // User
  getConnections: () => 
    authenticatedFetch(`${API_BASE_URL}/user/connections`),

  getFeed: () => 
    authenticatedFetch(`${API_BASE_URL}/feed`),

  getProfile: () => 
    authenticatedFetch(`${API_BASE_URL}/profile/view`),

  updateProfile: (data: any) => 
    authenticatedFetch(`${API_BASE_URL}/profile/update`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  uploadPhotos: (formData: FormData) => 
    authenticatedFetch(`${API_BASE_URL}/profile/upload-photos`, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    }),

  deletePhoto: (photoUrl: string) => 
    authenticatedFetch(`${API_BASE_URL}/profile/delete-photo/${encodeURIComponent(photoUrl)}`, {
      method: 'DELETE',
    }),

  // Requests
  getReceivedRequests: () => 
    authenticatedFetch(`${API_BASE_URL}/user/request/received`),

  sendLike: (userId: string) => 
    authenticatedFetch(`${API_BASE_URL}/request/send/interested/${userId}`, {
      method: 'POST',
    }),

  sendPass: (userId: string) => 
    authenticatedFetch(`${API_BASE_URL}/request/send/ignored/${userId}`, {
      method: 'POST',
    }),

  acceptRequest: (requestId: string) => 
    authenticatedFetch(`${API_BASE_URL}/request/review/accepted/${requestId}`, {
      method: 'POST',
    }),

  rejectRequest: (requestId: string) => 
    authenticatedFetch(`${API_BASE_URL}/request/review/rejected/${requestId}`, {
      method: 'POST',
    }),
};
