import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import type {HotelType} from '../../../types';
import {getImageUrl} from '../../../utils/api';
import {amenitiesMap} from '../../../utils/mappings';
import {styles} from '../styles';

interface HotelCardProps {
  item: HotelType;
  onPress: () => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({item, onPress}) => {
  const starText = `${'🌟'.repeat(item.star)}`;
  const lowestPrice =
    item.roomTypes && item.roomTypes.length > 0 ? item.roomTypes[0].price : 0;
  const imageUrl =
    item.photos && item.photos[0] ? getImageUrl(item.photos[0].url) : '';

  return (
    <TouchableOpacity style={styles.hotelItem} onPress={onPress}>
      <Image source={{uri: imageUrl}} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <View>
          <View style={styles.hotelNameContainer}>
            <Text numberOfLines={1} style={styles.hotelName}>
              {item.name}
            </Text>
            <Text style={styles.hotelStar}>{starText}</Text>
          </View>
          <Text numberOfLines={1} style={styles.hotelAddress}>
            {item.address}
          </Text>
          <View style={styles.hotelTags}>
            {item.amenities &&
              item.amenities.length > 0 &&
              item.amenities
                .slice(0, 3)
                .map((amenity: string, index: number) => (
                  <Text key={index} style={styles.hotelTagText}>
                    {amenitiesMap[amenity] || amenity}
                  </Text>
                ))}
          </View>
        </View>
        <View style={styles.hotelPriceContainer}>
          <View style={styles.priceWrapper}>
            <Text style={styles.hotelPriceSymbol}>¥</Text>
            <Text style={styles.hotelPrice}>{lowestPrice}</Text>
            <Text style={styles.hotelPriceDesc}>起/晚</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
