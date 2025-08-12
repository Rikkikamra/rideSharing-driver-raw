import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from 'axios';
import { logoutSocialAccount } from '../utils/authUtils';

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
    // Persist the access token under both `authToken` and legacy `token` keys.  Other parts
    // of the codebase still check AsyncStorage.getItem('token'), so this
    // ensures backwards compatibility while we migrate to a single key.
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('token', token);
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken);
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = async () => {
    // Call provider‑specific logout, which will clear local tokens and
    // revoke any social sessions if necessary.  This ensures users are
    // fully logged out of Google/Apple when they sign out of the app.
    await logoutSocialAccount();
    setAuthToken(null);
    // Remove the default Authorization header in axios.  Note: tokens
    // are cleared in logoutSocialAccount() via clearLocalAuthStorage().
    delete axios.defaults.headers.common['Authorization'];
  };

  const [user, setUser] = useState({});

const fetchUser = async () => {
  if (!authToken) return;
  try {
    const res = await axios.get('https://api.swiftcampus.com/api/auth/me');
    setUser(res.data.user);
  } catch (e) {
    setUser({});
  }
};

useEffect(() => {
  if (authToken) fetchUser();
}, [authToken]);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      authToken,
      loading,
      login,
      logout,
      fetchUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};