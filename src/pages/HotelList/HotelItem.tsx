import React, {memo, useCallback} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import type {HotelType} from '../../types';
import {amenitiesMap} from '../../utils/mappings';
import {styles} from './styles';

interface HotelItemProps {
  item: HotelType;
  onPress: (item: HotelType) => void;
  rooms: number;
  nights: number;
}

const HotelItem = memo(({item, onPress, rooms, nights}: HotelItemProps) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  const roomTypes = item.roomTypes as any;
  const price = roomTypes?.available?.[0]?.price || roomTypes?.[0]?.price || '暂无';

  return (
    <TouchableOpacity
      style={styles.hotelItem}
      onPress={handlePress}
      activeOpacity={0.8}>
      <Image 
        source={{uri: item.photos[1].url}} 
        style={styles.hotelImage}
        defaultSource={{uri: 'https://img.cdn1.vip/i/699dc7d46e039_1771947988.webp'}}
      />
      <View style={styles.hotelInfo}>
        <View style={styles.hotelNameContainer}>
          <Text style={styles.hotelName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.hotelStar}>{'🌟'.repeat(item.star)}</Text>
        </View>
        <Text style={styles.hotelAddress} numberOfLines={1}>{item.address}</Text>
        <View style={styles.hotelTags}>
          {item.amenities && item.amenities.length > 0 && item.amenities.slice(0, 5).map((amenity: string, index: number) => (
            <Text key={`${amenity}_${index}`} style={styles.hotelTagText}>
              {amenitiesMap[amenity] || amenity}
            </Text>
          ))}
        </View>
        <View style={styles.hotelPriceContainer}>
          <Text style={styles.hotelRoomNight}>{rooms}间·{nights}晚</Text>
          <View style={styles.priceWrapper}>
            <Text style={styles.hotelPriceSymbol}>¥</Text>
            <Text style={styles.hotelPrice}>{price}</Text>
            <Text style={styles.hotelPriceDesc}>起/晚</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default HotelItem;
