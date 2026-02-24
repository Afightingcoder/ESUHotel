import React, {useState, useMemo, useCallback, memo, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Animated,
} from 'react-native';
import type {RouteType, HotelType} from '../../types';
import LocationSelector from '../../components/LocationSelector';
import DateSelector from '../../components/DateSelector';
import GuestModal from '../../components/GuestModal';
import SortFilter from '../../components/SortFilter';
import PriceStarFilter from '../../components/PriceStarFilter';
import AdvancedFilter from '../../components/AdvancedFilter';
import {formatDate, calculateNights} from '../../utils/dateUtils';
import {styles} from './styles';
import HotelListSkeleton from './HotelListSkeleton';
import {getHotelDetail, getHotelList} from '../../utils/api';
import {amenitiesMap, removeFilterKeywords, parseKeywordFilters} from '../../utils/mappings';

const ITEM_HEIGHT = 140;

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
        defaultSource={{uri: 'https://picsum.photos/id/1031/200/200'}}
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

const HotelListPage = ({
  navigateTo,
  routeParams
}: {
  navigateTo: (route: RouteType, params?: any) => void;
  routeParams: any;
}) => {
  const [location, setLocation] = useState<string>(routeParams?.location || '');
  const [startDate, setStartDate] = useState<string>(routeParams?.startDate || '');
  const [endDate, setEndDate] = useState<string>(routeParams?.endDate || '');
  const [hotels, setHotels] = useState<HotelType[]>(routeParams?.hotels || []);
  const [rooms, setRooms] = useState<number>(routeParams?.rooms || 1);
  const [adults, setAdults] = useState<number>(routeParams?.adults || 1);
  const [children, setChildren] = useState<number>(routeParams?.children || 0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  React.useEffect(() => {
    console.log('接收到的routeParams:', routeParams);
    
    if (routeParams?.updatedData) {
      console.log('接收到的更新数据:', routeParams.updatedData);
      const { startDate: updatedStartDate, endDate: updatedEndDate, rooms: updatedRooms, adults: updatedAdults, children: updatedChildren, hotels: updatedHotels, location: updatedLocation } = routeParams.updatedData;
      if (updatedStartDate) setStartDate(updatedStartDate);
      if (updatedEndDate) setEndDate(updatedEndDate);
      if (updatedLocation) setLocation(updatedLocation);
      if (updatedRooms) setRooms(updatedRooms);
      if (updatedAdults) setAdults(updatedAdults);
      if (updatedChildren) setChildren(updatedChildren);
      if (updatedHotels) setHotels(updatedHotels);
    }
  }, [routeParams]); 

  React.useEffect(() => {
    console.log('酒店列表数据:', hotels);
  }, [hotels]);

  const [searchKeyword, setSearchKeyword] = useState<string>(routeParams?.keyword || '');

  const [isSortFilterVisible, setIsSortFilterVisible] = useState<boolean>(false);
  const [isPriceStarFilterVisible, setIsPriceStarFilterVisible] = useState<boolean>(false);
  const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] = useState<boolean>(false);
  
  const [sortType, setSortType] = useState<string>('default');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(routeParams?.selectedPrice || null);
  const [selectedStars, setSelectedStars] = useState<number[]>(routeParams?.selectedStars || []);
  
  const [advancedFilters, setAdvancedFilters] = useState<{
    hotFilters: string[];
    accommodationTypes: string[];
    hotelFeatures: string[];
    roomFeatures: string[];
  }>(() => {
    const keyword = routeParams?.keyword || '';
    return parseKeywordFilters(keyword);
  });

  React.useEffect(() => {
    if (routeParams) {
      if (routeParams.keyword !== undefined) setSearchKeyword(routeParams.keyword);
      if (routeParams.selectedPrice !== undefined) setSelectedPrice(routeParams.selectedPrice);
      if (routeParams.selectedStars) setSelectedStars(routeParams.selectedStars);
      if (routeParams.advancedFilters) setAdvancedFilters(routeParams.advancedFilters);
      if (routeParams.sortType) setSortType(routeParams.sortType);
      if (routeParams.startDate) setStartDate(routeParams.startDate);
      if (routeParams.endDate) setEndDate(routeParams.endDate);
      if (routeParams.rooms) setRooms(routeParams.rooms);
      if (routeParams.adults) setAdults(routeParams.adults);
      if (routeParams.children) setChildren(routeParams.children);
      if (routeParams.hotels) setHotels(routeParams.hotels);
      if (routeParams.location) setLocation(routeParams.location);
    }
  }, [routeParams]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isGuestModalVisible, setIsGuestModalVisible] = useState<boolean>(false);

  const handleLoadMore = useCallback(() => {
    // 预留分页加载逻辑
  }, []);

  const sortedHotels = useMemo(() => {
    const result = [...hotels];
    
    switch (sortType) {
      case 'price_low':
        result.sort((a, b) => {
          const aRoomTypes = a.roomTypes as any;
          const bRoomTypes = b.roomTypes as any;
          const priceA = aRoomTypes?.available?.[0]?.price || aRoomTypes?.[0]?.price || 0;
          const priceB = bRoomTypes?.available?.[0]?.price || bRoomTypes?.[0]?.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price_high':
        result.sort((a, b) => {
          const aRoomTypes = a.roomTypes as any;
          const bRoomTypes = b.roomTypes as any;
          const priceA = aRoomTypes?.available?.[0]?.price || aRoomTypes?.[0]?.price || 0;
          const priceB = bRoomTypes?.available?.[0]?.price || bRoomTypes?.[0]?.price || 0;
          return priceB - priceA;
        });
        break;
      case 'star_high':
        result.sort((a, b) => (b.star || 0) - (a.star || 0));
        break;
      default:
        break;
    }
    
    return result;
  }, [hotels, sortType]);

  const searchHotels = useCallback(async (params?: {
    price?: number | null;
    stars?: number[];
    filters?: typeof advancedFilters;
  }) => {
    setIsLoading(true);
    try {
      const searchParams: any = {
        location,
        keyword: searchKeyword,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        rooms,
        guests: adults + children,
      };

      const priceToUse = params?.price !== undefined ? params.price : selectedPrice;
      if (priceToUse !== null) {
        const priceRanges: Record<number, {min?: number; max?: number}> = {
          200: {max: 200},
          350: {min: 200, max: 350},
          400: {min: 350, max: 400},
          500: {min: 400, max: 500},
          900: {min: 500, max: 900},
          1400: {min: 900, max: 1400},
          1401: {min: 1400},
        };
        
        const priceRange = priceRanges[priceToUse];
        if (priceRange) {
          if (priceRange.min) searchParams.minPrice = priceRange.min;
          if (priceRange.max) searchParams.maxPrice = priceRange.max;
        }
      }

      const starsToUse = params?.stars || selectedStars;
      if (starsToUse.length > 0) {
        searchParams.stars = starsToUse;
      }

      const filtersToUse = params?.filters || advancedFilters;
      const filterKeywords: string[] = [];
      
      if (filtersToUse.hotFilters.length > 0) {
        filterKeywords.push(...filtersToUse.hotFilters);
      }
      if (filtersToUse.accommodationTypes.length > 0) {
        filterKeywords.push(...filtersToUse.accommodationTypes);
      }
      if (filtersToUse.hotelFeatures.length > 0) {
        filterKeywords.push(...filtersToUse.hotelFeatures);
      }
      if (filtersToUse.roomFeatures.length > 0) {
        filterKeywords.push(...filtersToUse.roomFeatures);
      }
      
      if (filterKeywords.length > 0) {
        searchParams.keyword = searchKeyword ? `${searchKeyword} ${filterKeywords.join(' ')}` : filterKeywords.join(' ');
      }

      console.log('搜索参数:', searchParams);
      
      const hotelList = await getHotelList(searchParams);
      console.log('获取酒店列表成功:', hotelList);
      
      if (hotelList) {
        setHotels(hotelList);
      }
    } catch (error) {
      console.error('获取酒店列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [location, searchKeyword, startDate, endDate, rooms, adults, children, selectedPrice, selectedStars, advancedFilters]);

  const handleHotelPress = useCallback(async (item: HotelType) => {
    try {
      const hotelDetail = await getHotelDetail(`${item.id}`, {
        startDate,
        endDate,
        rooms,
        guests: adults + children,
      });
      console.log('===单个酒店详情', hotelDetail.data.amenities);
      navigateTo('detail', {
        hotelId: item.id,
        hotelDetail: hotelDetail.data,
        startDate,
        endDate,
        rooms,
        adults,
        children,
        hotels,
        location,
        keyword: searchKeyword,
        selectedPrice,
        selectedStars,
        advancedFilters,
        sortType,
        fromRoute: 'list',
      });
    } catch (error) {
      console.error('网络请求错误:', error);
      navigateTo('detail', {
        hotelId: item.id,
        startDate,
        endDate,
        rooms,
        adults,
        children,
        hotels,
        location,
        keyword: searchKeyword,
        selectedPrice,
        selectedStars,
        advancedFilters,
        sortType,
        fromRoute: 'list',
      });
    }
  }, [startDate, endDate, rooms, adults, children, hotels, location, searchKeyword, selectedPrice, selectedStars, advancedFilters, sortType, navigateTo]);

  const nights = useMemo(() => calculateNights(startDate, endDate), [startDate, endDate]);

  const renderHotelItem = useCallback(({item}: {item: HotelType}) => (
    <HotelItem item={item} onPress={handleHotelPress} rooms={rooms} nights={nights} />
  ), [handleHotelPress, rooms, nights]);

  const keyExtractor = useCallback((item: HotelType) => `${item.id}`, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 200);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  }, []);

  const handleGoBack = useCallback(() => {
    navigateTo('search', {
      location,
      keyword: searchKeyword,
      startDate,
      endDate,
      rooms,
      adults,
      children,
      selectedPrice,
      selectedStars,
    });
  }, [navigateTo, location, searchKeyword, startDate, endDate, rooms, adults, children, selectedPrice, selectedStars]);

  const handleModalConfirm = useCallback(() => {
    setIsModalVisible(false);
    searchHotels();
  }, [searchHotels]);

  const renderListEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>暂无符合条件的酒店，修改条件可重新查询</Text>
    </View>
  ), []);

  const renderListFooter = useCallback(() => {
    if (sortedHotels.length === 0) return null;
    return (
      <View style={styles.loadMoreFooter}>
        <Text style={styles.loadMoreText}>———我是有底线的哦———</Text>
      </View>
    );
  }, [sortedHotels.length]);

  const handleSortChange = useCallback((type: string) => {
    setSortType(type);
  }, []);

  const handlePriceStarChange = useCallback((price: number | null, stars: number[]) => {
    setSelectedPrice(price);
    setSelectedStars(stars);
    searchHotels({ price, stars });
  }, [searchHotels]);

  const handleAdvancedFilterChange = useCallback((filters: typeof advancedFilters) => {
    setAdvancedFilters(filters);
    searchHotels({ filters });
  }, [searchHotels]);

  const handleClearAdvancedFilter = useCallback(() => {
    const cleanedKeyword = removeFilterKeywords(searchKeyword);
    setSearchKeyword(cleanedKeyword);
  }, [searchKeyword]);

  return (
    <View style={styles.pageContainer}>
      {/* 顶部核心筛选头 */}
      <View style={styles.listFilterHeader}>
        <View style={styles.headerLeftContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleGoBack}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerInfoItem}
            onPress={() => setIsModalVisible(true)}>
            <Text style={styles.headerInfoText} numberOfLines={2}>{location||'暂无位置信息'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerInfoItem}
            onPress={() => setIsModalVisible(true)}>
            <Text style={styles.headerInfoText} numberOfLines={2}>{`住 ${formatDate(startDate)} 离 ${formatDate(endDate)}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerInfoItem}
            onPress={() => setIsModalVisible(true)}>
            <Text style={[styles.headerInfoText, {maxWidth: 20}]}>
              {rooms}间{adults+children}人
            </Text>
          </TouchableOpacity>
          {/* 搜索框 */}
          <View style={styles.searchBoxContainer}>
            <View style={styles.searchInputWrapper}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchBox}
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                placeholder="酒店/品牌"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="default"
                autoCorrect={false}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setIsSortFilterVisible(true)}>
          <Text style={[
            styles.filterBtnText,
            styles.filterBtnTextActive
          ]}>
            {sortType === 'default' ? '默认排序' : 
             sortType === 'price_low' ? '低价优先' :
             sortType === 'price_high' ? '高价优先' : '高星优先'}
          </Text>
          <Text style={[
            styles.filterArrow,
            isSortFilterVisible && styles.filterArrowUp,
            styles.filterArrowActive
          ]}>
            {isSortFilterVisible ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setIsPriceStarFilterVisible(true)}>
          <Text style={[
            styles.filterBtnText,
            (isPriceStarFilterVisible || selectedPrice !== null || selectedStars.length > 0) && styles.filterBtnTextActive
          ]}>
            价格/星级
          </Text>
          {(selectedPrice !== null || selectedStars.length > 0) && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {(selectedPrice !== null ? 1 : 0) + selectedStars.length}
              </Text>
            </View>
          )}
          <Text style={[
            styles.filterArrow,
            isPriceStarFilterVisible && styles.filterArrowUp,
            (isPriceStarFilterVisible || selectedPrice !== null || selectedStars.length > 0) && styles.filterArrowActive
          ]}>
            {isPriceStarFilterVisible ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setIsAdvancedFilterVisible(true)}>
          <Text style={[
            styles.filterBtnText,
            (isAdvancedFilterVisible || 
             advancedFilters.hotFilters.length > 0 ||
             advancedFilters.accommodationTypes.length > 0 ||
             advancedFilters.hotelFeatures.length > 0 ||
             advancedFilters.roomFeatures.length > 0) && styles.filterBtnTextActive
          ]}>
            筛选
          </Text>
          {(advancedFilters.hotFilters.length > 0 ||
            advancedFilters.accommodationTypes.length > 0 ||
            advancedFilters.hotelFeatures.length > 0 ||
            advancedFilters.roomFeatures.length > 0) && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {advancedFilters.hotFilters.length +
                 advancedFilters.accommodationTypes.length +
                 advancedFilters.hotelFeatures.length +
                 advancedFilters.roomFeatures.length}
              </Text>
            </View>
          )}
          <Text style={[
            styles.filterArrow,
            isAdvancedFilterVisible && styles.filterArrowUp,
            (isAdvancedFilterVisible || 
             advancedFilters.hotFilters.length > 0 ||
             advancedFilters.accommodationTypes.length > 0 ||
             advancedFilters.hotelFeatures.length > 0 ||
             advancedFilters.roomFeatures.length > 0) && styles.filterArrowActive
          ]}>
            {isAdvancedFilterVisible ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 酒店列表 */}
      {isLoading ? (
        <HotelListSkeleton />
      ) : (
        <FlatList
          ref={flatListRef}
          data={sortedHotels}
          renderItem={renderHotelItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderListEmpty}
          ListFooterComponent={renderListFooter}
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopButton}
          onPress={scrollToTop}
          activeOpacity={0.8}>
          <Image
            source={{uri: 'https://img.cdn1.vip/i/699d8a74b78e8_1771932276.png'}}
            style={styles.scrollTopIcon}
          />
        </TouchableOpacity>
      )}

      {/* 顶部固定的蒙层弹窗 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalContent}>
                {/* 位置选择 */}
                <View style={styles.locationModalContent}>
                  <LocationSelector
                    value={location}
                    onChange={setLocation}
                    placeholder="输入城市"
                  />
                </View>
                <View style={styles.horizontalDivider} />

                {/* 日期选择 */}
                <View style={styles.searchItem}>
                  <DateSelector
                    startDate={startDate}
                    endDate={endDate}
                    onDateSelect={(start, end) => {
                      setStartDate(start);
                      setEndDate(end);
                    }}
                  />
                </View>

                {/* 横线分隔符 */}
                <View style={styles.horizontalDivider} />
                
                {/* 客房和人数统计 */}
                <TouchableOpacity
                  style={styles.searchItem}
                  onPress={() => setIsGuestModalVisible(true)}>
                  <Text style={styles.searchLabel}>👥</Text>
                  <View style={styles.guestInfoContainer}>
                    <Text style={styles.guestInfoText}>
                      {rooms}间房 · {adults}成人 · {children}儿童
                    </Text>
                    <Text style={styles.dropdownIcon}>▼</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleModalConfirm}>
                <Text style={styles.confirmButtonText}>确认</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 选择客房和入住人数弹窗 */}
      <GuestModal
        visible={isGuestModalVisible}
        onClose={() => setIsGuestModalVisible(false)}
        onConfirm={() => {}}
        rooms={rooms}
        adults={adults}
        children={children}
        onRoomsChange={setRooms}
        onAdultsChange={setAdults}
        onChildrenChange={setChildren}
      />

      {/* 排序筛选弹窗 */}
      <SortFilter
        visible={isSortFilterVisible}
        onClose={() => setIsSortFilterVisible(false)}
        onSortChange={handleSortChange}
        currentSort={sortType}
      />

      {/* 价格/星级筛选弹窗 */}
      <PriceStarFilter
        visible={isPriceStarFilterVisible}
        onClose={() => setIsPriceStarFilterVisible(false)}
        onFilterChange={handlePriceStarChange}
        currentPrice={selectedPrice}
        currentStars={selectedStars}
        onRealTimeChange={(price, stars) => {
          setSelectedPrice(price);
          setSelectedStars(stars);
        }}
      />

      {/* 综合筛选弹窗 */}
      <AdvancedFilter
        visible={isAdvancedFilterVisible}
        onClose={() => setIsAdvancedFilterVisible(false)}
        onFilterChange={handleAdvancedFilterChange}
        currentFilters={advancedFilters}
        onRealTimeChange={(filters) => {
          setAdvancedFilters(filters);
        }}
        onClear={handleClearAdvancedFilter}
      />
    </View>
  );
};

export default HotelListPage;
