// API configuration
import Constants from 'expo-constants';

// Get the local IP address for development
const getLocalIp = () => {
  // When running in Expo Go, use the manifest URL to determine the local IP
  if (Constants.expoConfig?.hostUri) {
    const host = Constants.expoConfig.hostUri.split(':')[0];
    return host;
  }
  // Fallback to localhost (this won't work on physical devices)
  return 'localhost';
};

export const API_CONFIG = {
  // Base URL for the API
  // Using dynamic IP address to work on both emulator and physical devices
  baseUrl: `http://${getLocalIp()}:8000/api/v1`,

  // Timeout in milliseconds
  timeout: 10000,

  // Default headers
  headers: {
    'Content-Type': 'application/json',
  },
};
