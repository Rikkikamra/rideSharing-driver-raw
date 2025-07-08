
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PaymentWrapper = ({ selectedMethod, onSelect }) => {
  const methods = ['Credit Card', 'Debit Card', 'Cash'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay With</Text>
      {methods.map((method) => (
        <TouchableOpacity
          key={method}
          style={[
            styles.method,
            selectedMethod === method && styles.selected
          ]}
          onPress={() => onSelect(method)}
        >
          <Text>{method}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  method: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8 },
  selected: { borderColor: '#BF5700', backgroundColor: '#FFF4E5' }
});

export default PaymentWrapper;
