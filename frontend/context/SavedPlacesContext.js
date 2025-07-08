import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedPlacesContext = createContext();

export const SavedPlacesProvider = ({ children }) => {
  const [savedPlaces, setSavedPlaces] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('saved_places');
      if (data) {
        setSavedPlaces(JSON.parse(data));
      }
    })();
  }, []);

  const addPlace = async (label, address, coords) => {
    const newPlaces = [...savedPlaces, { label, address, coords }];
    setSavedPlaces(newPlaces);
    await AsyncStorage.setItem('saved_places', JSON.stringify(newPlaces));
  };

  const removePlace = async (label) => {
    const filtered = savedPlaces.filter(p => p.label !== label);
    setSavedPlaces(filtered);
    await AsyncStorage.setItem('saved_places', JSON.stringify(filtered));
  };

  return (
    <SavedPlacesContext.Provider value={{ savedPlaces, addPlace, removePlace }}>
      {children}
    </SavedPlacesContext.Provider>
  );
};

export const useSavedPlaces = () => useContext(SavedPlacesContext);
