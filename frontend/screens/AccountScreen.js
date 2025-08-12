import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNotification } from '../context/NotificationContext';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../utils/api';

const AccountScreen = () => {
  const { notify } = useNotification();
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  /**
   * Pick an image from the user’s gallery and submit it for review.
   *
   * The back‑end expects a JSON payload with an `imageUrl` property on
   * the `/driver/profile-image-review` endpoint.  Rather than sending
   * multipart form data to a non‑existent route, we simply send the
   * local URI as the URL.  In a real deployment you could upload
   * the image to a CDN (e.g. S3 or Cloudinary) and send that URL
   * instead.
   */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        setUploading(true);
        // Post the image URI to the profile image review endpoint.  The route
        // is mounted at `/api/profile/image-review` with a route path of `/`,
        // therefore the client path is `/profile/image-review`.
        await apiClient.post('/profile/image-review', {
          imageUrl: result.assets[0].uri,
        });
        setMessage('Image submitted for review. An admin will approve it shortly.');
      } catch (error) {
        console.error('Profile image upload error', error);
        notify('Upload Failed', 'Could not upload image. Try again later.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.header, { color: colors.primary }]}>Account Information</Text>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={user?.profileImage ? { uri: user.profileImage } : require('../assets/profile-placeholder.png')}
            style={styles.profileImage}
          />
          {uploading && <ActivityIndicator size="small" color={colors.primary} />}
        </TouchableOpacity>
        {message ? <Text style={styles.notice}>{message}</Text> : null}

        <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'N/A'}</Text>
        <Text style={[styles.label, { color: colors.text }]}>Email: {user?.email || 'N/A'}</Text>
        <Text style={[styles.label, { color: colors.text }]}>Phone: {user?.phone || 'N/A'}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('EditProfileScreen')}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  notice: {
    fontSize: 12,
    color: '#d67c00',
    marginBottom: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    marginTop: 6,
  },
  button: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountScreen;
