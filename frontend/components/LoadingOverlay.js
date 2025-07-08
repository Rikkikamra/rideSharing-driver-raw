import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

export const LoadingOverlay = () => {
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fillAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(fillAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hornWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.hornContainer}>
        <View style={styles.hornWrapper}>
          <Animated.View style={[styles.horn, { width: hornWidth }]} />
        </View>
        <View style={styles.hornWrapper}>
          <Animated.View style={[styles.horn, { width: hornWidth }]} />
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  hornContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.5,
  },
  hornWrapper: {
    width: '48%',
    height: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
  },
  horn: {
    height: '100%',
    backgroundColor: '#BF5700',
  },
});
