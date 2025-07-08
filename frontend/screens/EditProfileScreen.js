
import React, { useContext, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthProvider';
import { useTheme } from '../theme/ThemeContext';
import axios from 'axios';

const EditProfileScreen = ({ navigation }) => {
  const { user, authToken, setUser } = useContext(AuthContext);
  const { colors } = useTheme();

  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = { email, phone };

      const res = await axios.put(
        'https://your-backend-domain.com/api/driver/profile',
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (res.data?.driver) {
        setUser(res.data.driver);
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);

      Alert.alert(
        'Submitted for Review',
        'Your profile image has been submitted for admin approval. Once approved, it will appear in your profile.'
      );

    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Edit Profile</Text>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: newImage || user?.profileImage }}
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={handleImagePick}>
          <Text style={[styles.link, { color: colors.primary }]}>Change Profile Photo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.inputDisabled, { borderColor: colors.border, color: colors.text }]}
        value={user?.name || ''}
        editable={false}
        placeholderTextColor={colors.text}
      />

      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor={colors.text}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        placeholder="Phone"
        keyboardType="phone-pad"
        placeholderTextColor={colors.text}
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16,
  },
  inputDisabled: {
    borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#ddd'
  },
  button: {
    marginTop: 10, padding: 14, borderRadius: 8, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  link: { fontSize: 14, textDecorationLine: 'underline' },
});

export default EditProfileScreen;
