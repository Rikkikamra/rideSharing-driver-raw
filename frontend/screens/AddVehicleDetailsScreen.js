import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNotification } from '../context/NotificationContext';
import * as DocumentPicker from 'expo-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchMakes, fetchModels } from '../utils/vehicleAPI';
import apiClient from '../utils/api';

export default function AddVehicleDetailsScreen() {
  const [year, setYear] = useState(null);
  const [yearOpen, setYearOpen] = useState(false);
  const [make, setMake] = useState(null);
  const [makeOpen, setMakeOpen] = useState(false);
  const [model, setModel] = useState(null);
  const [modelOpen, setModelOpen] = useState(false);

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  const [licensePlate, setLicensePlate] = useState('');
  const [registrationFile, setRegistrationFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);

  const { notify } = useNotification();

  // Year options (12‑year window)
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 12;
  const yearOptions = Array.from({ length: currentYear - minYear + 1 }, (_, i) => {
    const y = currentYear - i;
    return { label: y.toString(), value: y };
  });

  // Fetch makes on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMakes();
        // fetchMakes returns an array of { label, value }
        setMakes(data);
      } catch (e) {
        notify('Error fetching makes');
      }
    })();
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    if (!make) return;
    setLoadingModels(true);
    (async () => {
      try {
        const data = await fetchModels(make);
        setModels(data);
      } catch (e) {
        notify('Error fetching models');
      } finally {
        setLoadingModels(false);
      }
    })();
  }, [make]);

  // File pickers
  const pickRegistrationFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*']
      });
      if (!result.canceled) {
        // Expo SDK 48+ uses assets, else use result
        setRegistrationFile(result.assets?.[0] || result);
      }
    } catch (e) {
      notify('Error picking registration file');
    }
  };

  const pickInsuranceFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*']
      });
      if (!result.canceled) {
        setInsuranceFile(result.assets?.[0] || result);
      }
    } catch (e) {
      notify('Error picking insurance file');
    }
  };

  // Submit logic with file upload
  const handleSubmit = async () => {
    if (!year || !make || !model || !licensePlate || !registrationNumber || !consent) {
      Alert.alert('Error', 'Please fill all required fields and give consent.');
      return;
    }
    if (!registrationFile || !insuranceFile) {
      Alert.alert('Error', 'Please upload both Registration and Insurance files.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('year', year);
      formData.append('make', make);
      formData.append('model', model);
      formData.append('licensePlate', licensePlate);
      formData.append('registrationNumber', registrationNumber);
      formData.append('consent', consent);

      // For Expo/React Native FormData: URI, name, and type required
      formData.append('registrationFile', {
        uri: registrationFile.uri,
        name: registrationFile.name || 'registration.pdf',
        type: registrationFile.mimeType || 'application/pdf'
      });

      formData.append('insuranceFile', {
        uri: insuranceFile.uri,
        name: insuranceFile.name || 'insurance.pdf',
        type: insuranceFile.mimeType || 'application/pdf'
      });

      // POST using the configured apiClient so auth headers are added automatically
      const response = await apiClient.post(
        '/vehicles',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Vehicle submitted for review!');
        // Reset form
        setYear(null);
        setMake(null);
        setModel(null);
        setLicensePlate('');
        setRegistrationNumber('');
        setConsent(false);
        setRegistrationFile(null);
        setInsuranceFile(null);
      } else {
        Alert.alert('Error', response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Vehicle submit error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Vehicle submission failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Vehicle Details</Text>

      {/* Year Dropdown */}
      <Text style={styles.label}>Year</Text>
      <DropDownPicker
        open={yearOpen}
        value={year}
        items={yearOptions}
        setOpen={setYearOpen}
        setValue={setYear}
        setItems={() => {}}
        placeholder="Select year"
        zIndex={4000}
        containerStyle={styles.dropdown}
      />

      {/* Make Dropdown */}
      <Text style={styles.label}>Make</Text>
      <DropDownPicker
        open={makeOpen}
        value={make}
        items={makes}
        setOpen={setMakeOpen}
        setValue={setMake}
        setItems={setMakes}
        placeholder="Select make"
        zIndex={3000}
        containerStyle={styles.dropdown}
      />

      {/* Model Dropdown */}
      <Text style={styles.label}>Model</Text>
      <DropDownPicker
        open={modelOpen}
        value={model}
        items={models}
        setOpen={setModelOpen}
        setValue={setModel}
        setItems={setModels}
        loading={loadingModels}
        placeholder={make ? 'Select model' : 'Choose make first'}
        disabled={!make}
        zIndex={2000}
        containerStyle={styles.dropdown}
      />

      {/* License Plate */}
      <Text style={styles.label}>License Plate</Text>
      <TextInput
        style={styles.input}
        value={licensePlate}
        onChangeText={setLicensePlate}
        placeholder="Enter license plate"
      />

      {/* Registration Number */}
      <Text style={styles.label}>Registration Number</Text>
      <TextInput
        style={styles.input}
        value={registrationNumber}
        onChangeText={setRegistrationNumber}
        placeholder="Enter registration number"
      />

      {/* Registration File */}
      <Text style={styles.label}>Registration File (PDF/IMG)</Text>
      <TouchableOpacity
        style={styles.fileButton}
        onPress={pickRegistrationFile}
      >
        <Text style={styles.fileButtonText}>
          {registrationFile ? registrationFile.name || 'File Selected' : 'Upload Registration'}
        </Text>
      </TouchableOpacity>

      {/* Insurance File */}
      <Text style={styles.label}>Insurance File (PDF/IMG)</Text>
      <TouchableOpacity
        style={styles.fileButton}
        onPress={pickInsuranceFile}
      >
        <Text style={styles.fileButtonText}>
          {insuranceFile ? insuranceFile.name || 'File Selected' : 'Upload Insurance'}
        </Text>
      </TouchableOpacity>

      {/* Consent */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, consent && styles.checkboxChecked]}
          onPress={() => setConsent(!consent)}
        />
        <Text style={styles.checkboxLabel}>
          I consent to the terms and confirm details are correct.
        </Text>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, loading && { backgroundColor: '#aaa' }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Vehicle</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#c15016'
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fafafa'
  },
  dropdown: {
    marginBottom: 8
  },
  fileButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8
  },
  fileButtonText: {
    color: '#c15016',
    fontWeight: '500'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#c15016',
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#fff'
  },
  checkboxChecked: {
    backgroundColor: '#c15016'
  },
  checkboxLabel: {
    fontSize: 14,
    flexShrink: 1
  },
  submitButton: {
    backgroundColor: '#c15016',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17
  }
});
