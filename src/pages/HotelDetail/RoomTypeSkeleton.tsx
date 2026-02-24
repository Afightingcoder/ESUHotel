import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Image, Text} from 'react-native';

const RoomTypeItemSkeleton = () => {
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
          <Animated.View style={[styles.skeletonTags, {opacity}]} />
        </View>
        <Animated.View style={[styles.skeletonDetail, {opacity}]} />
        <View style={styles.skeletonBottom}>
          <Animated.View style={[styles.skeletonStock, {opacity}]} />
          <View style={styles.skeletonPriceRow}>
            <Animated.View style={[styles.skeletonPrice, {opacity}]} />
            <Animated.View style={[styles.skeletonBtn, {opacity}]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const RoomTypeSkeleton = () => {
  return (
    <View style={styles.container}>
      <RoomTypeItemSkeleton />
      <RoomTypeItemSkeleton />
      <View style={styles.loadingOverlay}>
        <Image
          source={{uri: 'https://img.cdn1.vip/i/699da81f4a28c_1771939871.png'}}
          style={styles.loadingIcon}
        />
        <Text style={styles.loadingText}>正在为您匹配房型</Text>
      </View>
      <RoomTypeItemSkeleton />
      <RoomTypeItemSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  skeletonItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  skeletonInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  skeletonNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonName: {
    width: 100,
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonTags: {
    width: 80,
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonDetail: {
    width: '60%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 8,
  },
  skeletonBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonStock: {
    width: 60,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skeletonPrice: {
    width: 70,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonBtn: {
    width: 72,
    height: 32,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  loadingOverlay: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default RoomTypeSkeleton;
