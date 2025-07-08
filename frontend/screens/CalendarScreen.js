
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CalendarScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Select a Date:</Text>
      <DateTimePicker value={date} mode="date" onChange={(event, selectedDate) => setDate(selectedDate || date)} />
      <Button title="Use this date" onPress={() => navigation.navigate('RideTypeSelection', { date })} />
    </View>
  );
};

export default CalendarScreen;
