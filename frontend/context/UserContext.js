import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../utils/api';

const UserContext = createContext();

/**
 * UserProvider: Wrap your App.js or Navigation container with this
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // User profile object
  const [loading, setLoading] = useState(true);  // Loading state for profile fetch
  const [error, setError] = useState(null);      // Error state for profile fetch

  // Fetch user profile from backend API
  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Optionally, check for token existence
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const response = await getUserProfile(); // should return { user: { ...fields... } }
      setUser(response.user || null);
    } catch (err) {
      setError('Failed to fetch user profile');
      setUser(null);
    }
    setLoading(false);
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Optionally, expose a logout/resetUser
  const resetUser = () => setUser(null);

  return (
    <UserContext.Provider value={{
      user,
      setUser,      // For manual update (e.g., after profile edit)
      fetchUser,    // For forced refresh (e.g., on pull-to-refresh or screen focus)
      loading,
      error,
      resetUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Usage in components:
export const useUser = () => useContext(UserContext);
