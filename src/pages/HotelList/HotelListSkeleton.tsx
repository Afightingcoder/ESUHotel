import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const SKELETON_COUNT = 5;

const HotelItemSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.skeletonItem}>
      <Animated.View style={[styles.skeletonImage, {opacity}]} />
      <View style={styles.skeletonInfo}>
        <View style={styles.skeletonNameRow}>
          <Animated.View style={[styles.skeletonName, {opacity}]} />
          <Animated.View style={[styles.skeletonStar, {opacity}]} />
        </View>
        <Animated.View style={[styles.skeletonAddress, {opacity}]} />
        <View style={styles.skeletonTags}>
          <Animated.View style={[styles.skeletonTag, {opacity}]} />
          <Animated.View style={[styles.skeletonTag, {opacity}]} />
          <Animated.View style={[styles.skeletonTag, {opacity}]} />
        </View>
        <View style={styles.skeletonPriceRow}>
          <Animated.View style={[styles.skeletonRoomNight, {opacity}]} />
          <Animated.View style={[styles.skeletonPrice, {opacity}]} />
        </View>
      </View>
    </View>
  );
};

const HotelListSkeleton = () => {
  return (
    <View style={styles.container}>
      {Array.from({length: SKELETON_COUNT}).map((_, index) => (
        <HotelItemSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  skeletonItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    height: 120,
  },
  skeletonImage: {
    width: 100,
    height: 120,
    backgroundColor: '#e0e0e0',
  },
  skeletonInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  skeletonNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonName: {
    width: 120,
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonStar: {
    width: 60,
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonAddress: {
    width: '70%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 8,
  },
  skeletonTags: {
    flexDirection: 'row',
    gap: 6,
  },
  skeletonTag: {
    width: 50,
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonPriceRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  skeletonRoomNight: {
    width: 60,
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonPrice: {
    width: 80,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});

export default HotelListSkeleton;
