import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your machine's IP address. 
// Run `ifconfig` or `ipconfig` to find it. 
// Do not use 'localhost' for Android Emulator (use 10.0.2.2) or physical device.
// For iOS simulator, localhost is fine.
const API_URL = 'http://localhost:5000/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => console.error(error)
);

export default api;
