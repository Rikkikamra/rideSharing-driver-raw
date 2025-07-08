
import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const HornLoading = () => {
  const fillAnim = new Animated.Value(0);

  Animated.loop(
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    })
  ).start();

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.horn}>
        <Animated.View style={[styles.fill, { width: fillWidth }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horn: {
    width: '100%',
    height: 10,
    borderWidth: 2,
    borderColor: '#BF5700',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFF8F0',
  },
  fill: {
    height: '100%',
    backgroundColor: '#BF5700',
  },
});

export default HornLoading;
