import React, {useState, useMemo, useCallback, useRef} from 'react';
import {View, Text, FlatList} from 'react-native';
import type {RouteType, HotelType} from '../../types';
import SortFilter from '../../components/SortFilter';
import PriceStarFilter from '../../components/PriceStarFilter';
import AdvancedFilter from '../../components/AdvancedFilter';
import {formatDate, calculateNights} from '../../utils/dateUtils';
import {styles} from './styles';
import HotelListSkeleton from './HotelListSkeleton';
import {getHotelDetail, getHotelList} from '../../utils/api';
import {removeFilterKeywords, parseKeywordFilters} from '../../utils/mappings';
import HotelItem from './HotelItem';
import FilterBar from './FilterBar';
import ListHeader from './ListHeader';
import ScrollToTop from './ScrollToTop';
import SearchModal from './SearchModal';
import {sortHotels, buildSearchParams} from './utils';

const ITEM_HEIGHT = 140;

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
  }, []);

  const sortedHotels = useMemo(() => {
    return sortHotels(hotels, sortType);
  }, [hotels, sortType]);

  const searchHotels = useCallback(async (params?: {
    price?: number | null;
    stars?: number[];
    filters?: typeof advancedFilters;
  }) => {
    setIsLoading(true);
    try {
      const searchParams = buildSearchParams(
        location,
        searchKeyword,
        startDate,
        endDate,
        rooms,
        adults,
        children,
        params?.price !== undefined ? params.price : selectedPrice,
        params?.stars || selectedStars,
        params?.filters || advancedFilters,
        formatDate
      );

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
      <ListHeader
        location={location}
        startDate={startDate}
        endDate={endDate}
        rooms={rooms}
        adults={adults}
        children={children}
        searchKeyword={searchKeyword}
        onBackPress={handleGoBack}
        onHeaderInfoPress={() => setIsModalVisible(true)}
        onSearchKeywordChange={setSearchKeyword}
        onSearchSubmit={searchHotels}
      />

      <FilterBar
        sortType={sortType}
        selectedPrice={selectedPrice}
        selectedStars={selectedStars}
        advancedFilters={advancedFilters}
        isSortFilterVisible={isSortFilterVisible}
        isPriceStarFilterVisible={isPriceStarFilterVisible}
        isAdvancedFilterVisible={isAdvancedFilterVisible}
        onSortPress={() => setIsSortFilterVisible(true)}
        onPriceStarPress={() => setIsPriceStarFilterVisible(true)}
        onAdvancedFilterPress={() => setIsAdvancedFilterVisible(true)}
      />
      
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

      <ScrollToTop
        visible={showScrollTop}
        onPress={scrollToTop}
      />

      <SearchModal
        visible={isModalVisible}
        location={location}
        startDate={startDate}
        endDate={endDate}
        rooms={rooms}
        adults={adults}
        children={children}
        isGuestModalVisible={isGuestModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleModalConfirm}
        onLocationChange={setLocation}
        onDateSelect={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        onGuestModalOpen={() => setIsGuestModalVisible(true)}
        onGuestModalClose={() => setIsGuestModalVisible(false)}
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
