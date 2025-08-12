import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNotification } from '../context/NotificationContext';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../utils/api';

const EditProfileScreen = ({ navigation }) => {
  const { notify } = useNotification();
  const { user, setUser } = useContext(AuthContext);
  const { colors } = useTheme();

  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [pendingApproval, setPendingApproval] = useState(false);

  // Upload the selected image via JSON payload for admin review
  const handleImageUpload = async uri => {
    try {
      setUploading(true);
      /**
       * The API expects a JSON body with `imageUrl`.  For simplicity we
       * submit the local URI as the URL.  In production you should upload
       * the file to a storage service and send its public URL.
       */
      // Submit the new image to the profile image review endpoint.  The
      // backend mounts the review route under `/api/profile/image-review` and
      // defines the route path `/profile-image-review`, resulting in
      // `/profile/image-review/profile-image-review` on the client.  See
      // `backend/routes/profileImageReview.js` and `server.js` for details.
      // The profile image review route is mounted under `/api/profile/image-review` and
      // defines its own path as `/` in the router.  Therefore the full client
      // path is simply `/profile/image-review`.  See backend/routes/profileImageReview.js.
      const res = await apiClient.post('/profile/image-review', {
        imageUrl: uri,
      });
      setUploading(false);
      if (res.data?.message) {
        setPendingApproval(true);
        notify('Submitted for Review', res.data.message);
      }
    } catch (err) {
      setUploading(false);
      notify('Error', 'Failed to upload image. Please try again.');
      console.error(err);
    }
  };

  // Pick a new image and upload it
  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setNewImage(uri);
      setPendingApproval(false);
      await handleImageUpload(uri);
    }
  };

  // Save email/phone
  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = { email, phone };
      // Update the driver’s basic info.  The profile route is mounted
      // at `/api/profile` and the router defines its endpoint at `/`.
      // Therefore the full client path for updating the profile is
      // simply `/profile` (with the base URL containing `/api`).
      // Drivers update their profile via `/drivers/profile`.  Using the
      // generic `/profile` route would update the wrong model or fail
      // depending on the server implementation.  The drivers router
      // mounts the update endpoint at `/profile`, so the full path is
      // `/drivers/profile` on the client.
      const res = await apiClient.put('/drivers/profile', payload);
      if (res.data?.driver) {
        setUser(res.data.driver);
        notify('Success', 'Profile updated successfully');
        navigation.goBack();
      }
    } catch (err) {
      console.error(err);
      notify('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
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
        <TouchableOpacity onPress={handleImagePick} disabled={uploading}>
          <Text style={[styles.link, { color: colors.primary }]}>
            {uploading ? 'Uploading...' : 'Change Profile Photo'}
          </Text>
        </TouchableOpacity>
        {pendingApproval && (
          <Text style={{ color: colors.warning || 'orange', marginTop: 8, fontSize: 12 }}>
            Pending admin approval
          </Text>
        )}
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

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSave}
        disabled={loading || uploading}
      >
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputDisabled: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#ddd',
  },
  button: {
    marginTop: 10,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  link: { fontSize: 14, textDecorationLine: 'underline' },
});

export default EditProfileScreen;
