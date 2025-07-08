
import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const AnimationWrapper = ({ children, style }) => {
  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      style={style}
    >
      {children}
    </Animated.View>
  );
};

export default AnimationWrapper;
