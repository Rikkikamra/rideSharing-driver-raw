
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchMakes, fetchModels } from '../utils/vehicleAPI';

export default function AddVehicleDetailsScreen() {
  const [year, setYear] = useState('');
  const [make, setMake] = useState(null);
  const [model, setModel] = useState(null);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [licensePlate, setLicensePlate] = useState('');
  const [registrationFile, setRegistrationFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [consent, setConsent] = useState(false);

  
  useEffect(() => {
    const loadMakes = async () => {
      const fetchedMakes = await fetchMakes();
      setMakes(fetchedMakes);
    };
    loadMakes();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (!make) return;
      setLoadingModels(true);
      const fetchedModels = await fetchModels(make);
      setModels(fetchedModels);
      setLoadingModels(false);
    };
    loadModels();

    fetchMakes().then(setMakes);
  }, []);

  
  useEffect(() => {
    const loadMakes = async () => {
      const fetchedMakes = await fetchMakes();
      setMakes(fetchedMakes);
    };
    loadMakes();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (!make) return;
      setLoadingModels(true);
      const fetchedModels = await fetchModels(make);
      setModels(fetchedModels);
      setLoadingModels(false);
    };
    loadModels();

    if (make) {
      setLoadingModels(true);
      fetchModels(make).then(res => {
        setModels(res);
        setLoadingModels(false);
      });
    } else {
      setModels([]);
    }
  }, [make]);

  const handleDocumentPick = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled) {
        if (type === 'registration') setRegistrationFile(result.assets[0]);
        else setInsuranceFile(result.assets[0]);
      }
    } catch (error) {
      console.log('Document Picker Error:', error);
    }
  };

  const handleSubmit = () => {
    if (!year || !make || !model || !licensePlate || !registrationNumber || !consent || !registrationFile || !insuranceFile) {
      Alert.alert('All fields including uploads are required');
      return;
    }
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 12;
    if (parseInt(year) < minYear || parseInt(year) > currentYear) {
      Alert.alert(`Vehicle must be from year ${minYear} or newer`);
      return;
    }
    Alert.alert('Vehicle details submitted');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Add Vehicle Details</Text>
      <TextInput placeholder="Year (e.g. 2020)" keyboardType="numeric" style={styles.input} value={year} onChangeText={setYear} />
      <DropDownPicker placeholder="Select Make" open={false} value={make} items={makes} setValue={setMake} setItems={setMakes} containerStyle={{ marginBottom: 15 }} />
      {loadingModels ? <ActivityIndicator size="small" color="#E4572E" /> :
        make && (
          <DropDownPicker placeholder="Select Model" open={false} value={model} items={models} setValue={setModel} setItems={setModels} containerStyle={{ marginBottom: 15 }} />
        )
      }
      <TextInput placeholder="License Plate Number" style={styles.input} value={licensePlate} onChangeText={setLicensePlate} />
      <TextInput placeholder="Registration Number" style={styles.input} value={registrationNumber} onChangeText={setRegistrationNumber} />

      <TouchableOpacity style={styles.uploadBtn} onPress={() => handleDocumentPick('registration')}>
        <Text style={styles.uploadText}>{registrationFile ? `Uploaded: ${registrationFile.name}` : 'Upload Car Registration'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadBtn} onPress={() => handleDocumentPick('insurance')}>
        <Text style={styles.uploadText}>{insuranceFile ? `Uploaded: ${insuranceFile.name}` : 'Upload Car Insurance'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.checkboxRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]} />
        <Text style={styles.checkboxText}>I confirm this vehicle is valid and registered in my name</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Vehicle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', color: '#E4572E', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#aaa', marginRight: 10 },
  checked: { backgroundColor: '#E4572E' },
  checkboxText: { flex: 1 },
  uploadBtn: { padding: 12, backgroundColor: '#eee', borderRadius: 6, marginBottom: 15 },
  uploadText: { color: '#333' },
  button: { backgroundColor: '#E4572E', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
