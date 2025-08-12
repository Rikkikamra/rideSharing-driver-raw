import React, { useContext } from "react";
import { View, Text } from "react-native";
import { BookingContext } from "../context/BookingContext";

const ItineraryScreen = () => {
  const { booking } = useContext(BookingContext);

  if (!booking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No booking selected.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: "bold" }}>{booking.date}</Text>
      <Text>
        {booking.from} → {booking.to}
      </Text>
      <Text>{booking.rideType}</Text>
      <Text style={{ fontSize: 18 }}>{booking.price}</Text>
      <Text style={{ color: booking.status === "Booked" ? "green" : "orange" }}>
        {booking.status}
      </Text>
    </View>
  );
};

export default ItineraryScreen;
