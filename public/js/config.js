// Shared API configuration for frontend - loads from server-side config

// Read API_BASE_URL from server-side config (exposed by NestJS)
const API_BASE_URL = window.APP_CONFIG?.getApiBaseUrl() || 
                      (window.APP_CONFIG && typeof window.APP_CONFIG.ApiBase === 'string' ? window.APP_CONFIG.ApiBase : null) ||
                      'https://my-coaching-app-fjao.onrender.com';

// Make available globally for all modules
window.API_BASE_URL = API_BASE_URL;
console.log('Frontend API Base URL:', window.API_BASE_URL);
