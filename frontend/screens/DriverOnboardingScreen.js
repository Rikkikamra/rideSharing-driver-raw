
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, CheckBox } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

export default function DriverOnboardingScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [ssn, setSSN] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [issuingState, setIssuingState] = useState('');
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [consent, setConsent] = useState(false);

  const pickLicensePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.cancelled) {
      setLicensePhoto(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !dob || !ssn || !address || !licenseNumber || !expirationDate || !issuingState || !licensePhoto || !consent) {
      Alert.alert('Please complete all fields and agree to the terms.');
      return;
    }

    try {
      const res = await axios.post('/api/driver/onboarding', {
        fullName,
        dob,
        ssn,
        address,
        licenseNumber,
        expirationDate,
        issuingState,
        licensePhoto,
        consent
      });

      if (res.data.success) {
        Alert.alert('Application Submitted Successfully');
        navigation.navigate('ApplicationReviewScreen');
      } else {
        Alert.alert('Submission failed', res.data.message);
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Driver Onboarding</Text>
      <TextInput style={styles.input} placeholder="Full Legal Name" value={fullName} onChangeText={setFullName} />
      <TouchableOpacity onPress={() => setShowDOBPicker(true)}>
        <TextInput style={styles.input} placeholder="Date of Birth" value={dob.toDateString()} editable={false} />
      </TouchableOpacity>
      {showDOBPicker && (
        <DateTimePicker value={dob} mode="date" display="default" onChange={(e, date) => { setShowDOBPicker(false); if (date) setDob(date); }} />
      )}
      <TextInput style={styles.input} placeholder="SSN" value={ssn} onChangeText={setSSN} secureTextEntry />
      <TextInput style={styles.input} placeholder="Home Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="License Number" value={licenseNumber} onChangeText={setLicenseNumber} />
      <TextInput style={styles.input} placeholder="License Expiration Date (YYYY-MM-DD)" value={expirationDate} onChangeText={setExpirationDate} />
      <TextInput style={styles.input} placeholder="Issuing State" value={issuingState} onChangeText={setIssuingState} />
      <TouchableOpacity style={styles.photoUpload} onPress={pickLicensePhoto}>
        <Text>{licensePhoto ? 'License Photo Selected' : 'Upload License Photo'}</Text>
      </TouchableOpacity>
      <View style={styles.checkboxRow}>
        <CheckBox value={consent} onValueChange={setConsent} />
        <Text style={styles.checkboxLabel}>I agree to the terms and certify all information is correct.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 15 },
  photoUpload: { borderWidth: 1, borderColor: '#aaa', borderRadius: 6, padding: 15, alignItems: 'center', marginBottom: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkboxLabel: { marginLeft: 10, flex: 1 },
  button: { backgroundColor: '#E4572E', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
