// Application configuration - Centralized config for server and client
export const AppConfig = {
  // API Base URL - can be overridden by environment variable during build/runtime
  getApiBaseUrl() {
    return process.env.API_BASE_URL || 'https://my-coaching-app-fjao.onrender.com';
  },

  // Server port
  port: process.env.PORT || 3000,

  // Environment
  env: process.env.NODE_ENV || 'development',
};

// Create a global config object for use in the app
export const config = AppConfig;
