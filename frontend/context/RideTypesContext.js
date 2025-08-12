
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const RideTypesContext = createContext();

export const RideTypesProvider = ({ children }) => {
  const [rideTypes, setRideTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRideTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/ridetypes');
      setRideTypes(response.data);
    } catch (err) {
      setError('Failed to load ride types.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideTypes();
  }, []);

  return (
    <RideTypesContext.Provider value={{ rideTypes, loading, error, refetch: fetchRideTypes }}>
      {children}
    </RideTypesContext.Provider>
  );
};

export const useRideTypes = () => useContext(RideTypesContext);
