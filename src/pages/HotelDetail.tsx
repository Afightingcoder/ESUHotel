import React, {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import Calendar from '../components/Calendar';
import GuestSelector from '../components/GuestSelector';
import {amenitiesMap, roomTagsMap, bedTypeMap} from '../utils/mappings';
import {getImageUrl} from '../utils/api';
import type {HotelType} from '../types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const HotelDetailPage = ({
  navigateBack,
  routeParams,
}: {
  navigateBack: (params?: any) => void;
  routeParams: any;
}) => {
  // 获取当前酒店数据 - 不使用模拟数据，只使用接口返回的数据
  const currentHotel = routeParams?.hotelDetail;

  // 只在组件首次挂载时输出调试信息
  useEffect(() => {
    console.log(
      '===接收详情',
      currentHotel,
      '地点=====',
      routeParams?.location,
    );
  }, []); // 空依赖数组，只在挂载时执行一次

  // 日期状态管理
  const [startDate, setStartDate] = useState<string>(
    routeParams?.startDate || '2026-03-10',
  );
  const [endDate, setEndDate] = useState<string>(
    routeParams?.endDate || '2026-03-11',
  );

  // 房间和人数状态管理
  const [rooms, setRooms] = useState<number>(routeParams?.rooms || 1);
  const [adults, setAdults] = useState<number>(routeParams?.adults || 1);
  const [children, setChildren] = useState<number>(routeParams?.children || 0);

  // 弹窗状态
  const [isGuestModalVisible, setIsGuestModalVisible] =
    useState<boolean>(false);

  // 轮播图状态
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 处理日期选择
  const handleDateSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // 使用useMemo缓存轮播图数据，避免每次渲染都重新计算
  const bannerData = useMemo(() => {
    const data =
      currentHotel?.photos && currentHotel.photos.length > 0
        ? currentHotel.photos
            .map((photo: any) => getImageUrl(photo?.url))
            .filter((url: string) => url && url.trim())
        : ['https://picsum.photos/id/1031/800/400'];

    // 只在数据变化时输出
    console.log('----轮播图数据更新---', data.length, '张图片');
    return data;
  }, [currentHotel?.photos]);

  // 自动播放轮播图
  useEffect(() => {
    if (bannerData.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % bannerData.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, 3000);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [bannerData.length]);

  // 使用useCallback优化handleScroll函数，避免每次渲染都创建新函数
  const handleScroll = useCallback(
    (event: any) => {
      const contentOffset = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffset / SCREEN_WIDTH);
      setActiveIndex(prevIndex => {
        if (index !== prevIndex && index >= 0 && index < bannerData.length) {
          return index;
        }
        return prevIndex;
      });
    },
    [bannerData.length],
  );

  // 使用useCallback缓存renderPagination函数
  const renderPagination = useCallback(() => {
    if (bannerData.length <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {bannerData.map((_: string, index: number) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  }, [bannerData.length, activeIndex]);

  // 使用useCallback缓存renderItem函数，避免每次渲染都创建新函数
  const renderBannerItem = useCallback(
    ({item}: {item: string}) => (
      <Image
        source={{
          uri: item,
          cache: 'force-cache',
        }}
        style={styles.detailBanner}
        onError={() => console.log('图片加载失败：', item)}
      />
    ),
    [],
  );

  return (
    <ScrollView style={styles.pageContainer}>
      {/* 顶部导航头 */}
      <View style={styles.detailHeader}>
        <TouchableOpacity
          onPress={() => {
            navigateBack({
              startDate,
              endDate,
              rooms,
              adults,
              children,
              hotels: routeParams?.hotels || [],
              location: routeParams?.location || '',
              keyword: routeParams?.keyword || '',
              selectedPrice: routeParams?.selectedPrice,
              selectedStars: routeParams?.selectedStars || [],
              advancedFilters: routeParams?.advancedFilters || {
                hotFilters: [],
                accommodationTypes: [],
                hotelFeatures: [],
                roomFeatures: [],
              },
              sortType: routeParams?.sortType || 'default',
            });
          }}
          style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>{currentHotel.name}</Text>
        <View style={styles.emptyView} />
      </View>

      {/* 大图Banner（支持左右滚动、自动播放、分页指示器） */}
      <View style={styles.bannerContainer}>
        <FlatList
          ref={flatListRef}
          data={bannerData}
          renderItem={renderBannerItem}
          keyExtractor={(item, idx) => `img_${idx}_${item}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />
        {renderPagination()}
      </View>

      {/* 酒店基础信息 */}
      <View style={styles.hotelBaseInfo}>
        <View style={styles.baseInfoRow}>
          <Text style={styles.hotelNameLarge}>{currentHotel.name}</Text>
          <View style={styles.hotelInfoRight}>
            <Text style={styles.hotelStarLarge}>
              {'🌟'.repeat(currentHotel.star)}
            </Text>
            {currentHotel.openingDate && (
              <Text style={styles.openingDate}>
                {currentHotel.openingDate.split('-')[0]}年开业
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.hotelAddressLarge}>{currentHotel.address}</Text>
        <View style={styles.facilitiesContainer}>
          <Text style={styles.facilityLabel}>酒店设施：</Text>
          <View style={styles.facilitiesList}>
            {currentHotel.amenities && currentHotel.amenities.length > 0 ? (
              currentHotel.amenities.map((amenity: string, index: number) => (
                <Text key={index} style={styles.facilityText}>
                  {amenitiesMap[amenity] || amenity}
                </Text>
              ))
            ) : (
              <Text style={styles.facilityText}>暂无设施信息</Text>
            )}
          </View>
        </View>
      </View>

      {/* 日历+人间夜Banner */}
      <View style={styles.calendarBanner}>
        <Calendar
          onDateSelect={handleDateSelect}
          initialStartDate={startDate}
          initialEndDate={endDate}
        />
        <View style={styles.roomNightContainer}>
          <View style={styles.roomNightContent}>
            <Text style={styles.roomNightLabel}>入住间夜</Text>
            <TouchableOpacity
              style={styles.roomNightBtn}
              onPress={() => setIsGuestModalVisible(true)}>
              <Text style={styles.roomNightText}>
                {rooms}间{adults + children}人 ▼
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 房型价格列表（从低到高排序） */}
      <View style={styles.roomTypesContainer}>
        <Text style={styles.sectionTitle}>
          房型价格（{currentHotel.roomTypes.length}种房型）
        </Text>
        {currentHotel.roomTypes
          .sort((a, b) => a.price - b.price) // 按价格从低到高排序
          .map(roomType => (
            <View key={roomType._id.$oid} style={styles.roomTypeItem}>
              <View style={styles.roomTypeLeftContent}>
                {roomType.photos &&
                roomType.photos.length > 0 &&
                roomType.photos[0].url ? (
                  <Image
                    source={{uri: getImageUrl(roomType.photos[0].url)}}
                    style={styles.roomTypeImage}
                    defaultSource={{
                      uri: 'https://picsum.photos/id/1031/800/400',
                    }}
                    onError={() =>
                      console.log(
                        '房型图片加载失败：',
                        getImageUrl(roomType.photos[0].url),
                      )
                    }
                  />
                ) : (
                  <Image
                    source={{uri: 'https://picsum.photos/id/1031/800/400'}}
                    style={styles.roomTypeImage}
                  />
                )}
                <View style={styles.roomTypeInfo}>
                  <Text style={styles.roomTypeName}>{roomType.name}</Text>
                  <View style={styles.roomTypeDetails}>
                    <Text style={styles.roomTypeDetailText}>
                      {bedTypeMap[roomType.bedType] || roomType.bedType} · 可住
                      {roomType.capacity}人
                    </Text>
                  </View>
                  {roomType.tags && roomType.tags.length > 0 && (
                    <View style={styles.roomTypeTags}>
                      {roomType.tags.map((tag, index) => (
                        <Text key={index} style={styles.roomTypeTagText}>
                          {roomTagsMap[tag] || tag}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.roomTypePrice}>
                <Text style={styles.roomPriceSymbol}>¥</Text>
                <Text style={styles.roomPrice}>{roomType.price}</Text>
                <Text style={styles.roomPriceDesc}>/晚</Text>
                <View style={styles.roomTypeBottomRow}>
                  <Text style={styles.roomTypeDesc}>
                    仅剩 {roomType.stock} 间
                  </Text>
                  <TouchableOpacity style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>立即预订</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
      </View>

      {/* 选择客房和入住人数弹窗 */}
      <Modal
        visible={isGuestModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsGuestModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalBottom}
          activeOpacity={1}
          onPress={() => setIsGuestModalVisible(false)}>
          <View style={styles.guestModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择客房和入住人数</Text>
                <TouchableOpacity onPress={() => setIsGuestModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                <GuestSelector
                  rooms={rooms}
                  adults={adults}
                  children={children}
                  onRoomsChange={setRooms}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setIsGuestModalVisible(false)}>
                <Text style={styles.confirmButtonText}>确认</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // 详情页样式
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    width: 60,
  },
  backBtnText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  emptyView: {
    width: 60,
  },
  bannerContainer: {
    position: 'relative',
  },
  detailBanner: {
    width: SCREEN_WIDTH,
    height: 220,
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  hotelBaseInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  baseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotelNameLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  hotelInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hotelStarLarge: {
    fontSize: 12,
  },
  openingDate: {
    fontSize: 12,
    color: '#b8860b',
    backgroundColor: '#ffd700',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hotelAddressLarge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  facilitiesContainer: {
    marginBottom: 8,
  },
  facilityLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityText: {
    fontSize: 14,
    color: '#1890ff',
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  // 日历Banner样式
  calendarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roomNightContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  roomNightContent: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  roomNightLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  roomNightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomNightText: {
    fontSize: 14,
    color: '#333',
  },
  // 房型价格列表样式
  roomTypesContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  roomTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roomTypeLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  roomTypeImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
    resizeMode: 'cover',
  },
  roomTypeInfo: {
    flex: 1,
  },
  roomTypeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  roomTypeDetails: {
    marginTop: 4,
    marginBottom: 6,
  },
  roomTypeDetailText: {
    fontSize: 12,
    color: '#666',
  },
  roomTypeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  roomTypeTagText: {
    fontSize: 11,
    color: '#1890ff',
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  roomTypeBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  roomTypeDesc: {
    fontSize: 12,
    color: '#666',
  },
  roomTypePrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  roomPriceSymbol: {
    fontSize: 14,
    color: '#ff4d4f',
    fontWeight: '500',
  },
  roomPrice: {
    fontSize: 20,
    color: '#ff4d4f',
    fontWeight: '600',
  },
  roomPriceDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  bookBtn: {
    width: 80,
    height: 32,
    backgroundColor: '#1890ff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  // 弹窗样式
  modalBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  guestModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 20,
    color: '#999',
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  confirmButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default HotelDetailPage;
