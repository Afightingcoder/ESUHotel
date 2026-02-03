import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet
} from 'react-native';
import type { RouteType, HotelType } from '../types';
import { mockHotels } from '../data/mockData';

const HotelListPage = ({
  navigateTo,
  navigateBack,
  routeParams
}: {
  navigateTo: (route: RouteType, params?: any) => void;
  navigateBack: () => void;
  routeParams: any;
}) => {
  const [hotels, setHotels] = useState<HotelType[]>(mockHotels);
  const [page, setPage] = useState<number>(1);

  // 上滑加载更多（模拟）
  const handleLoadMore = () => {
    setTimeout(() => {
      setHotels(prev => [...prev, ...mockHotels.map(hotel => ({ ...hotel, id: `${hotel.id}_${page + 1}` }))]);
      setPage(prev => prev + 1);
    }, 1000);
  };

  // 渲染酒店列表项
  const renderHotelItem = ({ item }: { item: HotelType }) => (
    <TouchableOpacity
      style={styles.hotelItem}
      onPress={() => navigateTo('detail', { hotelId: item.id })}
    >
      <Image source={{ uri: item.mainImage }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <View style={styles.hotelNameContainer}>
          <Text style={styles.hotelName}>{item.name.cn}</Text>
          <Text style={styles.hotelStar}>{item.star}星</Text>
        </View>
        <Text style={styles.hotelAddress}>{item.address}</Text>
        <View style={styles.hotelTags}>
          {item.tags.slice(0, 2).map((tag, idx) => (
            <Text key={idx} style={styles.hotelTagText}>#{tag}</Text>
          ))}
        </View>
        <View style={styles.hotelPriceContainer}>
          <Text style={styles.hotelScore}>{item.score}分</Text>
          <View style={styles.priceWrapper}>
            <Text style={styles.hotelPriceSymbol}>¥</Text>
            <Text style={styles.hotelPrice}>{item.price}</Text>
            <Text style={styles.hotelPriceDesc}>起/晚</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.pageContainer}>
      {/* 顶部核心筛选头 */}
      <View style={styles.listFilterHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={navigateBack}>
          <Text style={styles.backBtnText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.filterHeaderText}>{routeParams.location}</Text>
        <Text style={styles.filterHeaderText}>{routeParams.checkDate}</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterBtnText}>筛选 ▼</Text>
        </TouchableOpacity>
      </View>

      {/* 酒店列表（支持上滑加载） */}
      <FlatList
        data={hotels}
        renderItem={renderHotelItem}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View style={styles.loadMoreFooter}>
            <Text style={styles.loadMoreText}>加载中...</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  // 列表页筛选头样式
  listFilterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  backBtn: {
    width: 60,
  },
  backBtnText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  filterHeaderText: {
    fontSize: 12,
    color: '#333',
    flexWrap: 'wrap',
    width: '20%'
  },
  filterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4
  },
  filterBtnText: {
    fontSize: 12,
    color: '#333'
  },
  // 酒店列表项样式
  hotelItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  hotelImage: {
    width: 100,
    height: 120,
    resizeMode: 'cover'
  },
  hotelInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between'
  },
  hotelNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    maxWidth: '80%'
  },
  hotelStar: {
    fontSize: 12,
    color: '#ff9500',
    borderWidth: 1,
    borderColor: '#ff9500',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1
  },
  hotelAddress: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4
  },
  hotelTags: {
    flexDirection: 'row',
    gap: 6
  },
  hotelTagText: {
    fontSize: 10,
    color: '#1890ff',
    backgroundColor: 'rgba(24,144,255,0.1)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2
  },
  hotelPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  hotelScore: {
    fontSize: 12,
    color: '#ff9500',
    fontWeight: '500'
  },
  priceWrapper: {
    alignItems: 'flex-end'
  },
  hotelPriceSymbol: {
    fontSize: 12,
    color: '#ff4d4f',
    fontWeight: '500'
  },
  hotelPrice: {
    fontSize: 18,
    color: '#ff4d4f',
    fontWeight: '600'
  },
  hotelPriceDesc: {
    fontSize: 10,
    color: '#666'
  },
  // 加载更多样式
  loadMoreFooter: {
    padding: 16,
    alignItems: 'center'
  },
  loadMoreText: {
    fontSize: 14,
    color: '#666'
  }
});

export default HotelListPage;
