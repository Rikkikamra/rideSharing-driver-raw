import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../utils/api';
// apiClient is an axios instance preconfigured with the API base URL and
// token handling. Using it ensures all requests are sent to the correct
// `/api` prefix and include authentication when available.

const ApplicationFormScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDob, setShowDob] = useState(false);
  const [ssn, setSsn] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expiration, setExpiration] = useState(new Date());
  const [showExp, setShowExp] = useState(false);
  const [issuingState, setIssuingState] = useState('');
  const [photo, setPhoto] = useState(null);
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = async setter => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) setter(result.uri);
  };

  const isValid = () =>
    firstName && lastName && ssn && address && licenseNumber && issuingState && consent;

  const handleSubmit = async () => {
    if (!isValid()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('dob', dob.toISOString());
      formData.append('ssn', ssn);
      formData.append('address', address);
      formData.append('licenseNumber', licenseNumber);
      formData.append('expiration', expiration.toISOString());
      formData.append('issuingState', issuingState);
      formData.append('consent', consent);

      if (photo) {
        formData.append('photo', {
          uri: photo,
          name: 'profile_photo.jpg',
          type: 'image/jpeg'
        });
      }
      if (licensePhoto) {
        formData.append('licensePhoto', {
          uri: licensePhoto,
          name: 'license_photo.jpg',
          type: 'image/jpeg'
        });
      }

      // Use the configured apiClient; the baseURL already includes the `/api`
      // prefix so we only specify the resource path.  The endpoint for
      // submitting a driver onboarding application is `/driver/onboarding/submit`.
      const response = await apiClient.post(
        '/driver/onboarding/submit',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        navigation.navigate('ApplicationSubmitted', { firstName, lastName });
      } else {
        Alert.alert('Submission failed', response.data.message || 'Please try again later.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not submit application. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Driver Application</Text>
      <TouchableOpacity style={styles.upload} onPress={() => pickImage(setPhoto)}>
        <Text style={{ color: colors.text }}>
          {photo ? 'Photo Selected' : 'Upload Profile Photo'}
        </Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <TextInput
          placeholder="First Name"
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          placeholder="Last Name"
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <TouchableOpacity onPress={() => setShowDob(true)}>
        <Text style={[styles.date, { color: colors.text }]}>DOB: {dob.toDateString()}</Text>
      </TouchableOpacity>
      {showDob && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowDob(false);
            date && setDob(date);
          }}
        />
      )}
      <TextInput
        placeholder="SSN"
        secureTextEntry
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={ssn}
        onChangeText={setSsn}
      />
      <TextInput
        placeholder="Home Address"
        multiline
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text, height: 80 },
        ]}
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        placeholder="License Number"
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={licenseNumber}
        onChangeText={setLicenseNumber}
      />
      <TouchableOpacity onPress={() => setShowExp(true)}>
        <Text style={{ color: colors.text }}>Expiration: {expiration.toDateString()}</Text>
      </TouchableOpacity>
      {showExp && (
        <DateTimePicker
          value={expiration}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowExp(false);
            date && setExpiration(date);
          }}
        />
      )}
      <TextInput
        placeholder="Issuing State"
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={issuingState}
        onChangeText={setIssuingState}
      />
      <TouchableOpacity style={styles.upload} onPress={() => pickImage(setLicensePhoto)}>
        <Text style={{ color: colors.text }}>
          {licensePhoto ? 'License Photo Selected' : 'Upload License Photo'}
        </Text>
      </TouchableOpacity>
      <View style={styles.checkboxContainer}>
      <TouchableOpacity
          onPress={() => setConsent(!consent)}
          style={styles.checkbox}
        >
          <Text>{consent ? '☑' : '☐'}</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text }}>
          I consent to a background check and agree to terms.
        </Text>
      </View>
      <TouchableOpacity
        disabled={!isValid() || loading}
        style={[
          styles.button,
          { backgroundColor: colors.primary, opacity: isValid() ? 1 : 0.5 },
        ]}
        onPress={handleSubmit}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  upload: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  date: { marginBottom: 15 },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: { marginRight: 10 },
  button: { padding: 15, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ApplicationFormScreen;
