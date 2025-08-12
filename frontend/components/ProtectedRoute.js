
import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthProvider';

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const { authToken, loading } = useContext(AuthContext);

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#C54B18" />
        </View>
      );
    }

    if (!authToken) {
      props.navigation.replace('Login');
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default ProtectedRoute;
