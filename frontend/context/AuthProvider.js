import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkStoredToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        setAuthToken(token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const bioAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to continue',
          });
          if (bioAuth.success) {
            try {
              const res = await axios.post('https://api.swiftcampus.com/api/auth/refresh-token', { token: refreshToken });
              if (res.data.token) {
                await login(res.data.token, refreshToken);
              }
            } catch {
              await logout();
            }
          } else {
            await logout();
          }
        } else {
          await logout();
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkStoredToken();
  }, []);

  const login = async (token, refreshToken) => {
    setAuthToken(token);
    await AsyncStorage.setItem('authToken', token);
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken);
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = async () => {
    setAuthToken(null);
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};