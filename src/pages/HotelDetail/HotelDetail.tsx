import React, {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import Calendar from '../../components/Calendar';
import GuestModal from '../../components/GuestModal';
import {amenitiesMap, roomTagsMap, bedTypeMap} from '../../utils/mappings';
import {getHotelDetail} from '../../utils/api';
import {styles, SCREEN_WIDTH} from './styles';
import RoomTypeSkeleton from './RoomTypeSkeleton';
import BookingSuccessModal from '../../components/BookingSuccessModal';

const HotelDetailPage = ({
  navigateBack,
  routeParams,
}: {
  navigateBack: (params?: any) => void;
  routeParams: any;
}) => {
  const hotelId = routeParams?.hotelId;
  const [currentHotel, setCurrentHotel] = useState<any>(routeParams?.hotelDetail);
  
  useEffect(() => {
    console.log('===接收详情', currentHotel, '地点=====', routeParams?.location);
  }, []);

  const [startDate, setStartDate] = useState<string>(routeParams?.startDate || '2026-03-10');
  const [endDate, setEndDate] = useState<string>(routeParams?.endDate || '2026-03-11');
  
  const [rooms, setRooms] = useState<number>(routeParams?.rooms || 1);
  const [adults, setAdults] = useState<number>(routeParams?.adults || 1);
  const [children, setChildren] = useState<number>(routeParams?.children || 0);
  
  const [isGuestModalVisible, setIsGuestModalVisible] = useState<boolean>(false);
  const [isLoadingRoomTypes, setIsLoadingRoomTypes] = useState<boolean>(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState<boolean>(false);

  const handleBooking = useCallback(() => {
    setIsBookingSuccess(true);
  }, []);
  
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const refreshHotelDetail = async () => {
    setIsLoadingRoomTypes(true);
    try {
      const response = await getHotelDetail(hotelId, {
        startDate,
        endDate,
        rooms,
        guests: adults + children,
      });
      if (response && response.data) {
        setCurrentHotel(response.data);
        console.log('===刷新酒店详情成功', response.data);
      }
    } catch (error) {
      console.error('刷新酒店详情失败:', error);
    } finally {
      setIsLoadingRoomTypes(false);
    }
  };
  
  const handleDateSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  useEffect(() => {
    if (startDate && endDate && hotelId) {
      refreshHotelDetail();
    }
  }, [startDate, endDate]);
  
  const bannerData = useMemo(() => {
    const data = currentHotel?.photos && currentHotel.photos.length > 0
      ? currentHotel.photos
          .map((photo: any) => photo?.url)
          .filter((url: string) => url && url.trim())
      : ['https://img.cdn1.vip/i/699dc7d46e039_1771947988.webp'];
    
    console.log('----轮播图数据更新---', data.length, '张图片');
    return data;
  }, [currentHotel?.photos]);
    
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
  
  const handleScroll = useCallback((event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setActiveIndex(prevIndex => {
      if (index !== prevIndex && index >= 0 && index < bannerData.length) {
        return index;
      }
      return prevIndex;
    });
  }, [bannerData.length]);
  
  const renderPagination = useCallback(() => {
    if (bannerData.length <= 1) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {bannerData.map((_, index) => (
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
  
  const renderBannerItem = useCallback(({ item }: { item: string }) => (
    <Image
      source={{ 
        uri: item,
        cache: 'force-cache' 
      }}
      style={styles.detailBanner}
      onError={() => console.log('图片加载失败：', item)}
    />
  ), []);

  return (
    <ScrollView style={styles.pageContainer}>
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
          style={styles.backBtn}
        >
          <Image
            source={{uri: 'https://img.cdn1.vip/i/699dc8eabcd80_1771948266.png'}}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>{currentHotel.name}</Text>
        <View style={styles.emptyView} />
      </View>

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

      <View style={styles.hotelBaseInfo}>
        <View style={styles.baseInfoRow}>
          <Text style={styles.hotelNameLarge}>{currentHotel.name}</Text>
          <View style={styles.hotelInfoRight}>
            <Text style={styles.hotelStarLarge}>{'🌟'.repeat(currentHotel.star)}</Text>
            {currentHotel.openingDate && (
              <Text style={styles.openingDate}>{currentHotel.openingDate.split('-')[0]}年开业</Text>
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

      <View style={styles.calendarBanner}>
        <Calendar
          onDateSelect={handleDateSelect}
          initialStartDate={startDate}
          initialEndDate={endDate}
        />
        <View style={styles.roomNightContainer}>
          <View style={styles.roomNightContent}>
            <Text style={styles.roomNightLabel}>入住间夜</Text>
            <TouchableOpacity style={styles.roomNightBtn} onPress={() => setIsGuestModalVisible(true)}>
              <Text style={styles.roomNightText}>{rooms}间{adults+children}人▼</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.roomTypesContainer}>
        {isLoadingRoomTypes ? (
          <RoomTypeSkeleton />
        ) : (
          <>
            {currentHotel.roomTypes?.available && currentHotel.roomTypes.available.length > 0 && (
          <View key="available_rooms_section">
            <Text style={styles.sectionTitle}>
              可预订房型（{currentHotel.roomTypes.available.length}种）
            </Text>
            {currentHotel.roomTypes.available
              .sort((a, b) => a.price - b.price)
              .map((roomType, index) => (
                <View key={roomType._id?.$oid} style={styles.roomTypeItem}>
                  <View style={styles.roomTypeLeftContent}>
                    {roomType.photos && roomType.photos.length > 0 && roomType.photos[0].url ? (
                      <Image 
                        source={{uri: roomType.photos[0].url}} 
                        style={styles.roomTypeImage}
                        defaultSource={{ uri: 'https://img.cdn1.vip/i/699dc7d46e039_1771947988.webp' }}
                        onError={() => console.log('房型图片加载失败：', roomType.photos[0].url)}
                      />
                    ) : (
                      <Image 
                        source={{uri: 'https://img.cdn1.vip/i/699dc7d46e039_1771947988.webp'}} 
                        style={styles.roomTypeImage}
                      />
                    )}
                    <View style={styles.roomTypeInfo}>
                      <Text style={styles.roomTypeName}>{roomType.name}</Text>
                      <Text style={styles.roomTypeDetailText}>
                        {bedTypeMap[roomType.bedType] || roomType.bedType} · 可住{roomType.capacity}人
                      </Text>
                      {roomType.tags && roomType.tags.length > 0 && (
                        <View style={styles.roomTypeTags}>
                          {roomType.tags.map((tag, index) => {
                            const roomId = roomType._id?.$oid;
                            return (
                              <Text key={`tag_${roomId}_${index}`} style={styles.roomTypeTagText}>
                                {roomTagsMap[tag] || tag}
                              </Text>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.roomTypeRightContent}>
                    <View style={styles.priceRow}>
                        <Text style={styles.roomPriceSymbol}>均¥</Text>
                        <Text style={styles.roomPrice}>{roomType.price}</Text>
                        <Text style={styles.roomPriceSymbol}>/晚</Text>
                      </View>
                    <Text style={styles.stockText}>仅剩 {roomType.stock} 间</Text>
                    <View style={styles.priceAndBookRow}>
                      
                      <TouchableOpacity style={styles.bookBtn} onPress={handleBooking}>
                        <Text style={styles.bookBtnText}>立即预订</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        )}
        
        {currentHotel.roomTypes?.unavailable && currentHotel.roomTypes.unavailable.length > 0 && (
          <View key="unavailable_rooms_section">
            <View style={styles.unavailableDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>👥 以下房型不满足{rooms}间{adults+children}人</Text>
              <View style={styles.dividerLine} />
            </View>
            {currentHotel.roomTypes.unavailable
              .sort((a, b) => a.price - b.price)
              .map((roomType, index) => (
                <View key={roomType._id?.$oid} style={styles.roomTypeItem}>
                  <View style={styles.roomTypeLeftContent}>
                    {roomType.photos && roomType.photos.length > 0 && roomType.photos[0].url ? (
                      <Image 
                        source={{uri: roomType.photos[0].url}} 
                        style={styles.roomTypeImage}
                        defaultSource={{ uri: 'https://img.cdn1.vip/i/699dc7d46e039_1771947988.webp' }}
                      />
                    ) : (
                      <Image 
                        source={{uri: 'https://img.cdn1.vip/i/699dc7d46e039_1771947988.webp'}} 
                        style={styles.roomTypeImage}
                      />
                    )}
                    <View style={styles.roomTypeInfo}>
                      <Text style={styles.roomTypeName}>{roomType.name}</Text>
                      <Text style={styles.roomTypeDetailText}>
                        {bedTypeMap[roomType.bedType] || roomType.bedType} · 可住{roomType.capacity}人
                      </Text>
                      {roomType.tags && roomType.tags.length > 0 && (
                        <View style={styles.roomTypeTags}>
                          {roomType.tags.map((tag, index) => {
                            const roomId = roomType._id?.$oid;
                            return (
                              <Text key={`unavail_tag_${roomId}_${index}`} style={styles.roomTypeTagText}>
                                {roomTagsMap[tag] || tag}
                              </Text>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.roomTypeRightContent}>
                    <Text style={styles.stockText}>仅剩 {roomType.stock} 间</Text>
                    <View style={styles.priceAndBookRow}>
                      <View style={styles.priceRow}>
                        <Text style={styles.roomPriceSymbol}>¥</Text>
                        <Text style={styles.roomPrice}>{roomType.price}</Text>
                      </View>
                      <TouchableOpacity style={styles.bookBtn} onPress={handleBooking}>
                        <Text style={styles.bookBtnText}>立即预订</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        )}
          </>
        )}
      </View>

      <GuestModal
        visible={isGuestModalVisible}
        onClose={() => setIsGuestModalVisible(false)}
        onConfirm={refreshHotelDetail}
        rooms={rooms}
        adults={adults}
        children={children}
        onRoomsChange={setRooms}
        onAdultsChange={setAdults}
        onChildrenChange={setChildren}
      />

      <BookingSuccessModal
        visible={isBookingSuccess}
        onClose={() => setIsBookingSuccess(false)}
      />
    </ScrollView>
  );
};

export default HotelDetailPage;
