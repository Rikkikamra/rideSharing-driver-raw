
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const { token, loading } = useAuth();

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#C54B18" />
        </View>
      );
    }

    if (!token) {
      props.navigation.replace('Login');
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default ProtectedRoute;
