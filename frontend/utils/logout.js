
import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async (navigation) => {
  await AsyncStorage.removeItem('token');
  navigation.replace('LoginScreen');
};
