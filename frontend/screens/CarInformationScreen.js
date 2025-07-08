import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../theme/ThemeContext';
import makesModels from '../assets/makes_models.json';

const currentYear = new Date().getFullYear();
const minYear = currentYear - 12;
const years = [];
for (let y = currentYear; y >= minYear; y--) years.push(y);

// Build makes dropdown from filtered makes
const US_MAKES = [
  "Toyota","Honda","Ford","Chevrolet","Nissan","Hyundai","Kia","Subaru","Volkswagen","Mazda",
  "GMC","Jeep","Ram","Buick","Chrysler","Dodge","Lincoln","Lexus","Acura","Infiniti",
  "Cadillac","Tesla","Volvo","Mini","BMW","Mercedes-Benz","Audi","Land Rover","Jaguar","Mitsubishi"
];

const filteredMakesModels = makesModels.Results
  .filter(item => US_MAKES.includes(item.Make_Name))
  .reduce((acc, item) => {
    if (!acc[item.Make_Name]) acc[item.Make_Name] = [];
    if (!acc[item.Make_Name].includes(item.Model_Name))
      acc[item.Make_Name].push(item.Model_Name);
    return acc;
  }, {});

const allMakes = Object.keys(filteredMakesModels).sort();

export default function CarInformationScreen({ navigation }) {
  const { colors } = useTheme();
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [errors, setErrors] = useState({});

  const modelsForSelectedMake = selectedMake ? filteredMakesModels[selectedMake] : [];

  const validate = () => {
    const errs = {};
    if (!selectedMake) errs.make = "Required";
    if (!selectedModel) errs.model = "Required";
    if (!selectedYear) errs.year = "Required";
    if (
      selectedYear &&
      (parseInt(selectedYear) < minYear || parseInt(selectedYear) > currentYear)
    )
      errs.year = "Vehicle must be ≤ 12 years old";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Missing Info', 'Please complete all fields with valid info.');
      return;
    }
    navigation.navigate('MyVehicleScreen', {
      vehicle: { make: selectedMake, model: selectedModel, year: selectedYear },
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Vehicle Information</Text>

      <Text style={styles.label}>Make</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedMake}
          onValueChange={value => {
            setSelectedMake(value);
            setSelectedModel('');
          }}
        >
          <Picker.Item label="Select Make" value="" />
          {allMakes.map(make => (
            <Picker.Item label={make} value={make} key={make} />
          ))}
        </Picker>
      </View>
      {errors.make && <Text style={styles.error}>{errors.make}</Text>}

      <Text style={styles.label}>Model</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedModel}
          enabled={!!selectedMake}
          onValueChange={setSelectedModel}
        >
          <Picker.Item label={selectedMake ? "Select Model" : "Choose Make First"} value="" />
          {modelsForSelectedMake.map(model => (
            <Picker.Item label={model} value={model} key={model} />
          ))}
        </Picker>
      </View>
      {errors.model && <Text style={styles.error}>{errors.model}</Text>}

      <Text style={styles.label}>Year</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedYear}
          onValueChange={setSelectedYear}
        >
          <Picker.Item label="Select Year" value="" />
          {years.map(year => (
            <Picker.Item label={String(year)} value={String(year)} key={year} />
          ))}
        </Picker>
      </View>
      {errors.year && <Text style={styles.error}>{errors.year}</Text>}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary, opacity: validate() ? 1 : 0.7 }]}
        onPress={handleSubmit}
        disabled={!validate()}
      >
        <Text style={styles.buttonText}>Submit Vehicle Info</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 18 },
  label: { marginTop: 15, marginBottom: 3, fontWeight: 'bold' },
  pickerWrap: { borderWidth: 1, borderRadius: 8, borderColor: '#ccc', marginBottom: 5 },
  error: { color: 'red', marginBottom: 4, marginLeft: 5 },
  button: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
