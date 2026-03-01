import React, {useRef, useEffect} from 'react';
import {Animated, Dimensions, StyleSheet} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ANIMATION_DURATION = 280;

interface PageTransitionProps {
  children: React.ReactNode;
  direction: 'forward' | 'back';
  trigger: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  direction,
  trigger,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startX = direction === 'back' ? -SCREEN_WIDTH : SCREEN_WIDTH;
    translateX.setValue(startX);
    opacity.setValue(0.8);

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [trigger, direction, translateX, opacity]);

  return (
    <Animated.View style={[styles.container, {transform: [{translateX}], opacity}]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PageTransition;
