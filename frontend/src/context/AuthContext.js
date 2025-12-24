import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, role } = response.data;
      setUserToken(token);
      setUserRole(role);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', role);
    } catch (error) {
     console.log("Login Error", error);
     throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, role } = response.data;
      setUserToken(token);
      setUserRole(role);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', role);
    } catch (error) {
      console.log("Register Error", error);
      throw error;
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUserRole(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
  };

  const isLoggedIn = async () => {
    try {
      let token = await AsyncStorage.getItem('token');
      let role = await AsyncStorage.getItem('role');
      setUserToken(token);
      setUserRole(role);
      setLoading(false);
    } catch (error) {
      console.log(`isLogged in error ${error}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, register, logout, userToken, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
