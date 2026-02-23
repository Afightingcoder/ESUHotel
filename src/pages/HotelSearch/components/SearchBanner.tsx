import React from 'react';
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';
import {getImageUrl} from '../../../utils/api';
import {amenitiesMap} from '../../../utils/mappings';

interface SearchBannerProps {
  bannerHotel: any;
  onPress: () => void;
}

const SearchBanner: React.FC<SearchBannerProps> = ({bannerHotel, onPress}) => {
  if (!bannerHotel) return null;

  return (
    <TouchableOpacity style={styles.bannerContainer} onPress={onPress}>
      <ImageBackground
        source={{
          uri: getImageUrl(bannerHotel.photos?.[0]?.url) || 'https://picsum.photos/id/1031/800/400',
        }}
        style={styles.bannerImage}>
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>{bannerHotel.name}</Text>
          <Text style={styles.bannerSubtitle}>
            {bannerHotel.amenities
              ?.slice(0, 3)
              .map((amenity: string) => amenitiesMap[amenity] || amenity)
              .join(' · ') || '豪华体验 · 优质服务'}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    height: 180,
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
});

export default SearchBanner;
