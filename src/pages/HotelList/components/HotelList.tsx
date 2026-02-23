import React from 'react';
import {FlatList, View, Text} from 'react-native';
import type {HotelType} from '../../../types';
import {HotelCard} from './HotelCard';
import {styles} from '../styles';

interface HotelListProps {
  hotels: HotelType[];
  onLoadMore: () => void;
  onItemPress: (item: HotelType) => void;
}

export const HotelList: React.FC<HotelListProps> = ({hotels, onLoadMore, onItemPress}) => {
  return (
    <FlatList
      data={hotels}
      keyExtractor={item => `${item.id}`}
      renderItem={({item}) => <HotelCard item={item} onPress={() => onItemPress(item)} />}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        <View style={styles.loadMoreFooter}>
          <Text style={styles.loadMoreText}>正在加载更多...</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏨</Text>
          <Text style={styles.emptyText}>暂无符合条件的酒店</Text>
          <Text style={styles.emptySubText}>试试调整筛选条件吧</Text>
        </View>
      }
    />
  );
};
