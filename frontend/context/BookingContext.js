// frontend/context/BookingContext.js
import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState({
    from: '',
    to: '',
    date: null,
    rideType: '',
    fare: 0,
    surge: false,
    quietMode: false,
    returnTrip: false,
    promoCode: '',
    groupRide: false,
    riders: [
      {
        name: '',
        pickup: '',
        idVerified: false,
      },
    ],
    pickupChain: [],
    coordinates: [],
  });

  const updateBooking = (updates) => {
    setBooking((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const resetBooking = () => {
    setBooking({
      from: '',
      to: '',
      date: null,
      rideType: '',
      fare: 0,
      surge: false,
      quietMode: false,
      returnTrip: false,
      promoCode: '',
      groupRide: false,
      riders: [
        {
          name: '',
          pickup: '',
          idVerified: false,
        },
      ],
      pickupChain: [],
      coordinates: [],
    });
  };

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
